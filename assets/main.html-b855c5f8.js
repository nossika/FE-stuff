import{_ as n,p as s,q as a,a1 as t}from"./framework-5866ffd3.js";const p={},e=t(`<h1 id="一些用法" tabindex="-1"><a class="header-anchor" href="#一些用法" aria-hidden="true">#</a> 一些用法</h1><h2 id="threading" tabindex="-1"><a class="header-anchor" href="#threading" aria-hidden="true">#</a> threading</h2><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token keyword">import</span> threading
<span class="token keyword">import</span> time

<span class="token comment"># 初始化 task，等待 1 秒后自动完成</span>
<span class="token keyword">def</span> <span class="token function">task</span><span class="token punctuation">(</span><span class="token builtin">id</span><span class="token punctuation">:</span> <span class="token builtin">int</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    time<span class="token punctuation">.</span>sleep<span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">&#39;task done&#39;</span><span class="token punctuation">,</span> <span class="token builtin">id</span><span class="token punctuation">)</span>

thread_list <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

start_time <span class="token operator">=</span> time<span class="token punctuation">.</span>time<span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    t <span class="token operator">=</span> threading<span class="token punctuation">.</span>Thread<span class="token punctuation">(</span>target<span class="token operator">=</span>task<span class="token punctuation">,</span> args<span class="token operator">=</span><span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token comment"># 创建 task 线程并传递参数</span>
    t<span class="token punctuation">.</span>start<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment"># 启动线程</span>
    thread_list<span class="token punctuation">.</span>append<span class="token punctuation">(</span>t<span class="token punctuation">)</span>

<span class="token keyword">for</span> t <span class="token keyword">in</span> thread_list<span class="token punctuation">:</span>
    t<span class="token punctuation">.</span>join<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment"># 等待线程完成</span>

end_time <span class="token operator">=</span> time<span class="token punctuation">.</span>time<span class="token punctuation">(</span><span class="token punctuation">)</span>

 <span class="token comment"># 线程并发，1 秒左右完成全部线程</span>
<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">&#39;time&#39;</span><span class="token punctuation">,</span> end_time <span class="token operator">-</span> start_time<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="debounce" tabindex="-1"><a class="header-anchor" href="#debounce" aria-hidden="true">#</a> debounce</h2><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token keyword">import</span> threading
<span class="token keyword">from</span> typing <span class="token keyword">import</span> Callable<span class="token punctuation">,</span> Optional

<span class="token keyword">def</span> <span class="token function">debounce</span><span class="token punctuation">(</span>wait<span class="token punctuation">:</span> <span class="token builtin">float</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">decorator</span><span class="token punctuation">(</span>fn<span class="token punctuation">:</span> Callable<span class="token punctuation">)</span><span class="token punctuation">:</span>
        timer<span class="token punctuation">:</span> Optional<span class="token punctuation">[</span>threading<span class="token punctuation">.</span>Timer<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token boolean">None</span>
        <span class="token keyword">def</span> <span class="token function">debounced</span><span class="token punctuation">(</span><span class="token operator">*</span>args<span class="token punctuation">,</span> <span class="token operator">**</span>kwargs<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token comment"># py 的参数有 tuple(位置参数) &amp; dict(关键字参数) 两种形式，* 匹配 tuple，** 匹配 dict</span>
            <span class="token keyword">nonlocal</span> timer <span class="token comment"># 使得 debounced 内可以访问外部作用域的 timer</span>
            <span class="token keyword">def</span> <span class="token function">call_fn</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
                fn<span class="token punctuation">(</span><span class="token operator">*</span>args<span class="token punctuation">,</span> <span class="token operator">**</span>kwargs<span class="token punctuation">)</span>
            <span class="token keyword">if</span> timer<span class="token punctuation">:</span>
                timer<span class="token punctuation">.</span>cancel<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment"># 取消已有定时器线程</span>
            timer <span class="token operator">=</span> threading<span class="token punctuation">.</span>Timer<span class="token punctuation">(</span>wait<span class="token punctuation">,</span> call_fn<span class="token punctuation">)</span> <span class="token comment"># 创建一个 wait 后执行 call_fn 的定时器线程</span>
            timer<span class="token punctuation">.</span>start<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment"># 启动定时器线程</span>
        <span class="token keyword">return</span> debounced
    <span class="token keyword">return</span> decorator

<span class="token decorator annotation punctuation">@debounce</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
<span class="token keyword">def</span> <span class="token function">foo</span><span class="token punctuation">(</span>num<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">&#39;foo&#39;</span><span class="token punctuation">,</span> num<span class="token punctuation">)</span>

<span class="token keyword">for</span> i <span class="token keyword">in</span> <span class="token builtin">range</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    foo<span class="token punctuation">(</span>i<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),o=[e];function c(i,l){return s(),a("div",null,o)}const d=n(p,[["render",c],["__file","main.html.vue"]]);export{d as default};
