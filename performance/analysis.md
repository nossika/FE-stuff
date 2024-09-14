# 性能优化

## 所谓“性能优化”

性能优化只是手段，而非目的。不谈场景、目的的性能优化都是耍流氓。

真正通用的优化，在工具层能做的早已都做了。比如 JS 的执行，v8 引擎底层做了很多隐藏类、快数组等优化；比如网络请求，有 gzip 压缩、http2 多路复用等。

我们通常谈论的性能优化，都是要针对具体业务场景的。且性能优化并非万能，它通常也带来了一些隐性成本。

一些场景下的“优化”可能是另一些场景下的“负优化”。比如 React 组件，全量使用 useMemo 缓存，能够阻止不必要的组件更新，带来了更好的更新性能，但其也使用了额外缓存空间、增大了初始化开销。在高频数据变动的场景下是“优化”，但在数据量大但变动小的场景下是“负优化”。再比如 JS 分包，构建时把所有依赖库都独立成包，这样可以让所有不同 entry 的依赖都是按需的，可以避免不必要的依赖加载，但也带来了额外的网络往返开销，因为要多次加载才能拿到所需依赖。

所以性能优化必须在具体场景下权衡。

性能优化也可以是非技术的，可以从产品设计上给用户操作及时的反馈，来造成性能提升的效果。比如给等待页加骨架屏、图片先加载个模糊版本、乐观 UI 等。

## 一些场景

- 首屏加载

减少资源依赖（资源分割、懒加载）、资源加载加速（CDN、SSR、HTTP2主动推送）

- 页面操作

减少不必要的渲染范围（懒加载、虚拟滚动）、减少渲染次数（缓存对比）、主线程不阻塞渲染（web worker、requestIdleCallback）

- 产品设计

骨架屏、耗时操作频率控制/藏深入口

## 分析工具

chrome-devtools:

- network

- performance

- memory


performance.now()时间精度为纳秒级，比起Date.now()的毫秒级，能作更精确的性能分析。

> 但各浏览器的performance.now()事实上并非真正精确到纳秒，而是作了一定程度的四舍五入或者随机处理。原因是为降低[Spectre（幽灵漏洞）](https://zh.wikipedia.org/wiki/%E5%B9%BD%E7%81%B5%E6%BC%8F%E6%B4%9E)的安全威胁，Spectre对于CPU中[Speculative execution（推测执行）](https://zh.wikipedia.org/wiki/%E6%8E%A8%E6%B5%8B%E6%89%A7%E8%A1%8C)能力的利用需要非常精确的定时器。

### 首次渲染指标

DOMContentLoaded

onload

首次绘制（First Paint，FP）

首次内容绘制（First Contentful Paint，FCP）

首次有意义绘制（First Meaningful Paint，FMP）

首次交互（Time to First Interactive，TTFI）

## 优化点

### 网络性能

传输效率：cdn

缓存设置：response header、打包配置

文件粒度：打包配置

协议：HTTP2、QUIC

### 渲染性能

框架：结合框架特性，减少diff，render等操作

长列表：分段加载、只渲染可视区域数据

其他渲染优化点：详见[【浏览器渲染】](./render.md)


