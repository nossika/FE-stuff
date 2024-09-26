import{_ as o,M as n,p as h,q as d,R as a,t as e,N as r,V as l,a1 as i}from"./framework-5866ffd3.js";const s={},c=i('<h1 id="性能优化" tabindex="-1"><a class="header-anchor" href="#性能优化" aria-hidden="true">#</a> 性能优化</h1><h2 id="所谓-性能优化" tabindex="-1"><a class="header-anchor" href="#所谓-性能优化" aria-hidden="true">#</a> 所谓“性能优化”</h2><p>性能优化只是手段，而非目的。不谈场景、目的的性能优化都是耍流氓。</p><p>真正通用的优化，在工具层能做的早已都做了。比如 JS 的执行，v8 引擎底层做了很多隐藏类、快数组等优化；比如网络请求，有 gzip 压缩、http2 多路复用等。</p><p>我们通常谈论的性能优化，都是要针对具体业务场景的。且性能优化并非万能，它通常也带来了一些隐性成本。</p><p>一些场景下的“优化”可能是另一些场景下的“负优化”。比如 React 组件，全量使用 useMemo 缓存，能够阻止不必要的组件更新，带来了更好的更新性能，但其也使用了额外缓存空间、增大了初始化开销。在高频数据变动的场景下是“优化”，但在数据量大但变动小的场景下是“负优化”。再比如 JS 分包，构建时把所有依赖库都独立成包，这样可以让所有不同 entry 的依赖都是按需的，可以避免不必要的依赖加载，但也带来了额外的网络往返开销，因为要多次加载才能拿到所需依赖。</p><p>所以性能优化必须在具体场景下权衡。</p><p>性能优化也可以是非技术的，可以从产品设计上给用户操作及时的反馈，来造成性能提升的效果。比如给等待页加骨架屏、图片先加载个模糊版本、乐观 UI 等。</p><h2 id="一些场景" tabindex="-1"><a class="header-anchor" href="#一些场景" aria-hidden="true">#</a> 一些场景</h2><ul><li>首屏加载</li></ul><p>减少资源依赖（资源分割、懒加载）、资源加载加速（CDN、SSR、HTTP2主动推送）</p><ul><li>页面操作</li></ul><p>减少不必要的渲染范围（懒加载、虚拟滚动）、减少渲染次数（缓存对比）、主线程不阻塞渲染（web worker、requestIdleCallback）</p><ul><li>产品设计</li></ul><p>骨架屏、耗时操作频率控制/藏深入口</p><h2 id="分析工具" tabindex="-1"><a class="header-anchor" href="#分析工具" aria-hidden="true">#</a> 分析工具</h2><p>chrome-devtools:</p><ul><li><p>network</p></li><li><p>performance</p></li><li><p>memory</p></li></ul><p>performance.now()时间精度为纳秒级，比起Date.now()的毫秒级，能作更精确的性能分析。</p>',19),u={href:"https://zh.wikipedia.org/wiki/%E5%B9%BD%E7%81%B5%E6%BC%8F%E6%B4%9E",target:"_blank",rel:"noopener noreferrer"},f={href:"https://zh.wikipedia.org/wiki/%E6%8E%A8%E6%B5%8B%E6%89%A7%E8%A1%8C",target:"_blank",rel:"noopener noreferrer"},_=i('<h3 id="首次渲染指标" tabindex="-1"><a class="header-anchor" href="#首次渲染指标" aria-hidden="true">#</a> 首次渲染指标</h3><p>DOMContentLoaded</p><p>onload</p><p>首次绘制（First Paint，FP）</p><p>首次内容绘制（First Contentful Paint，FCP）</p><p>首次有意义绘制（First Meaningful Paint，FMP）</p><p>首次交互（Time to First Interactive，TTFI）</p><h2 id="优化点" tabindex="-1"><a class="header-anchor" href="#优化点" aria-hidden="true">#</a> 优化点</h2><h3 id="网络性能" tabindex="-1"><a class="header-anchor" href="#网络性能" aria-hidden="true">#</a> 网络性能</h3><p>传输效率：cdn</p><p>缓存设置：response header、打包配置</p><p>文件粒度：打包配置</p><p>协议：HTTP2、QUIC</p><h3 id="渲染性能" tabindex="-1"><a class="header-anchor" href="#渲染性能" aria-hidden="true">#</a> 渲染性能</h3><p>框架：结合框架特性，减少diff，render等操作</p><p>长列表：分段加载、只渲染可视区域数据</p>',16);function m(k,x){const t=n("ExternalLinkIcon"),p=n("RouterLink");return h(),d("div",null,[c,a("blockquote",null,[a("p",null,[e("但各浏览器的performance.now()事实上并非真正精确到纳秒，而是作了一定程度的四舍五入或者随机处理。原因是为降低"),a("a",u,[e("Spectre（幽灵漏洞）"),r(t)]),e("的安全威胁，Spectre对于CPU中"),a("a",f,[e("Speculative execution（推测执行）"),r(t)]),e("能力的利用需要非常精确的定时器。")])]),_,a("p",null,[e("其他渲染优化点：详见"),r(p,{to:"/performance/render.html"},{default:l(()=>[e("【浏览器渲染】")]),_:1})])])}const E=o(s,[["render",m],["__file","analysis.html.vue"]]);export{E as default};