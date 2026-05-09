# 推理与生成

训练让模型学会「给定上下文，下一个 token 的概率分布是什么」；**推理（Inference）**则是把这个分布转化为实际文本的过程。同一个模型用不同的采样策略，输出风格与稳定性会有显著差异。

---

## 自回归生成（Autoregressive Generation）

LLM 的生成是**逐 token 进行**的：每一步把已有序列输入模型，得到下一个 token 在词表上的概率分布，按某种策略采样出一个 token，拼回序列尾部，再进入下一步，直到遇到终止 token（如 `<eos>`）或达到最大长度。

这种「**一次只前进一步**」的范式，是 KV Cache（见 `transformer.md`）能成立的前提，也决定了输出**只能流式产出**——服务端通常用 SSE 把每个新 token 推给前端，UI 才能呈现「打字机」效果。

---

## 采样策略（Sampling）

在每一步，模型会输出一个 logits 向量（词表大小），经 softmax 得到概率分布。怎么从这个分布选下一个 token，就是采样策略要解决的问题。

### Temperature（温度）

在 softmax 前对 logits 除以一个温度系数 T：

- **T → 0**：分布趋于尖锐，几乎每次都选最高概率的 token，输出**确定、保守**。
- **T = 1**：使用模型原始分布。
- **T > 1**：分布趋于平坦，低概率 token 也有机会被选中，输出**多样、发散**，但更易跑偏。

> Temperature 不改变排名，只改变概率差距，因此通常和下面的截断策略组合使用。

### Greedy Decoding（贪心）

每步直接选概率最高的 token。等价于 T → 0。优点是**完全确定**、可复现；缺点是**容易陷入重复**（"The cat sat on the cat sat on the…"），且在创造性任务上表现单一。

### Top-k 采样

只从概率最高的 k 个 token 中按归一化后的概率采样。k 越小越保守，越大越接近原分布。问题是 k 是固定值：当分布很尖锐时 k 个里包含了大量低概率 token，分布很平坦时又可能裁掉合理候选。

### Top-p / Nucleus 采样

按概率从高到低累加，取**累计概率刚好达到 p** 的最小集合，再在这个集合里采样。相比 Top-k，它的候选数会随分布形状**自适应**：分布尖锐时只剩少数几个，分布平坦时自动放宽。这是当前最常用的策略，常见组合是 `temperature=0.7, top_p=0.9`。

### 重复惩罚

为避免循环输出，常见参数：

- **frequency_penalty**：根据 token 在已生成序列中出现的频次降低其概率。
- **presence_penalty**：只要 token 出现过就施加固定惩罚，鼓励引入新词。

### Beam Search

并行维护若干条候选序列（beam），每步基于整段序列的累积概率挑出 Top-N 个分支继续展开，最后选总分最高的一条。优点是能找到全局更优的序列，常用于翻译、摘要等**确定性任务**。缺点是在开放式生成中容易给出过于「平均」、缺乏新意的文本，因此现代对话模型更偏好采样而非 Beam。

---

## 结构化输出

让模型生成自然语言只需文本接龙，但要让模型可靠地输出**机器可解析**的格式（JSON、SQL、特定 DSL），需要额外手段。

### JSON Mode

许多 API 提供「JSON Mode」开关，强制输出合法 JSON。原理上通常是：在系统提示里加约束 + 在解码时校验输出可解析。**注意它只保证「是合法 JSON」，不保证字段符合你想要的 schema**，业务侧仍要做校验。

### Constrained Decoding（约束解码）

更强的方案是在每一步采样前，根据语法（JSON Schema、正则、CFG）**屏蔽掉不合法的 token**——只在合法候选里采样，从根本上保证输出符合结构。代表实现有 `outlines`、`xgrammar`、llama.cpp 的 GBNF 语法等。

> 这与 `llm.md` 中的 **Function Call** 是一体两面：Function Call 是上层约定（声明工具及参数 schema），约束解码是下层实现手段之一，确保模型选出的工具名与参数确实落在合法集合里。

---

## 流式输出（Streaming）

### 协议层

服务端最常用 **SSE（Server-Sent Events）**：单向、基于 HTTP，天然适合「每生成一个 token 推一次」的场景。OpenAI 兼容协议中每条消息形如 `data: {"choices":[{"delta":{"content":"x"}}]}`，最后以 `data: [DONE]` 结束。少数场景（双向、多媒体）也会用 WebSocket。

### 前端实现

浏览器原生 `EventSource` 不支持自定义 header（如鉴权），生产代码通常用 `fetch` + `ReadableStream` 自行解析：

```ts
const res = await fetch(url, { method: 'POST', headers, body });
const reader = res.body!.getReader();
const decoder = new TextDecoder();
let buffer = '';
while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  buffer += decoder.decode(value, { stream: true });
  for (const line of buffer.split('\n\n')) {
    if (line.startsWith('data: ')) {
      const payload = line.slice(6);
      if (payload === '[DONE]') return;
      const delta = JSON.parse(payload).choices[0].delta.content ?? '';
    }
  }
}
```

### 工程注意

- **TTFT（Time To First Token）** 与 **TPOT（Time Per Output Token）** 是流式体验的两个核心指标，长上下文会显著拉高 TTFT。
- **中断（AbortController）** 必须支持：用户停止后要立即关闭连接，避免后端继续生成产生费用。
- **Markdown 增量渲染**：每来一个 token 都重新解析整段会卡顿；常见做法是节流 + 渲染稳定前缀，或使用支持流式解析的 Markdown 库。

---

## 上下文窗口（Context Window）

**上下文窗口**指模型一次前向能处理的最大 token 数（输入 + 输出）。它由训练时的位置编码范围与显存共同决定，是推理阶段绕不开的硬约束。

### 为什么有限制

标准自注意力的计算量与显存占用都是 **O(n²)**（n 为序列长度）：序列翻倍，注意力矩阵面积是 4 倍。即便有 KV Cache 缓解推理冗余，长上下文仍意味着显存与延迟同步上升。

### 常见扩展手段

- **位置插值 / NTK / YaRN**：在 RoPE 基础上调整频率，使模型在未训练过的长度上仍能工作（位置编码细节见 `tokenizer.md`）。
- **稀疏 / 局部注意力**：只让每个 token 关注一个窗口或固定模式（Sliding Window、Longformer 等），把复杂度降到接近 O(n)。
- **分层检索（RAG）**：把长文档先用检索召回，再喂给短上下文模型，回避「真长上下文」的成本（见 `llm.md`）。

### 工程注意

- 「128K 窗口」并不等于「在 128K 中表现一致」，常见有**中间遗忘（Lost in the Middle）**：放在上下文中段的信息更容易被忽略。
- 输入越长，**首 token 延迟（TTFT）** 越高，前端在做流式 UI 时尤其要关注；可以通过 prompt 压缩、KV Cache 复用（前缀缓存）等方式优化。

---

## 推理优化

模型实际上线时还有一系列工程层面的优化，前端虽然不直接实现，但理解概念有助于和后端协作。

- **KV Cache 复用 / 前缀缓存**：相同的 system prompt 在多次请求间复用 KV，可大幅降低 TTFT 与成本。
- **Continuous Batching**：把多个用户请求动态拼到同一个 batch 里推理，提升 GPU 利用率（vLLM、TGI 等推理框架的核心能力）。
- **投机采样（Speculative Decoding）**：用一个小模型先草拟若干 token，大模型一次性验证，验证通过的部分直接接受，从而把「逐 token 串行」部分变成并行，加速 1.5～3 倍。
- **量化（Quantization）**：把权重从 FP16 压到 INT8 / INT4，显存与带宽同步下降，是端侧、消费级显卡部署的必经之路。
