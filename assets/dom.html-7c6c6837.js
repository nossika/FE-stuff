import{_ as n,p as a,q as s,a1 as e}from"./framework-5866ffd3.js";const t={},o=e(`<h1 id="js-dom-bom" tabindex="-1"><a class="header-anchor" href="#js-dom-bom" aria-hidden="true">#</a> JS(DOM/BOM)</h1><h2 id="事件冒泡、事件委托" tabindex="-1"><a class="header-anchor" href="#事件冒泡、事件委托" aria-hidden="true">#</a> 事件冒泡、事件委托</h2><p>捕获、冒泡、阻止冒泡</p><p>事件委托</p><h2 id="nodelist-vs-htmlcollection" tabindex="-1"><a class="header-anchor" href="#nodelist-vs-htmlcollection" aria-hidden="true">#</a> NodeList vs HTMLCollection</h2><p>NodeList: Element.querySelectorAll(&#39;div&#39;) / Element.childNodes</p><p>HTMLCollection: Element.getElementsByTagName(&#39;div&#39;) / Element.children</p><p>HTMLCollection的特性</p><ul><li>只包含elementNode（无textNode）</li><li>动态更新，当页面的元素更新时，此集合也会自动同步</li><li>namedItem方法</li></ul><h2 id="attribute操作-class操作" tabindex="-1"><a class="header-anchor" href="#attribute操作-class操作" aria-hidden="true">#</a> attribute操作，class操作</h2><h2 id="css-object-model" tabindex="-1"><a class="header-anchor" href="#css-object-model" aria-hidden="true">#</a> CSS Object Model</h2><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token literal-property property">styleSheet</span><span class="token operator">:</span> CSSStyleSheet <span class="token operator">=</span> document<span class="token punctuation">.</span>styleSheets<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
styleSheet<span class="token punctuation">.</span><span class="token function">insertRule</span><span class="token punctuation">(</span><span class="token string">&#39;h1 { font-weight: bold; color: green; }&#39;</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token literal-property property">styleRule</span><span class="token operator">:</span> CSSStyleRule <span class="token operator">=</span> styleSheet<span class="token punctuation">.</span>cssRules<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

styleRule<span class="token punctuation">.</span>style<span class="token punctuation">.</span><span class="token function">setProperty</span><span class="token punctuation">(</span><span class="token string">&#39;color&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;red&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>styleRule<span class="token punctuation">.</span>cssText<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// &#39;h1 { font-weight: bold; color: red; }&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="window-btoa-window-atoa" tabindex="-1"><a class="header-anchor" href="#window-btoa-window-atoa" aria-hidden="true">#</a> window.btoa / window.atoa</h2><p>加密/解密base64</p><h2 id="window-navigator" tabindex="-1"><a class="header-anchor" href="#window-navigator" aria-hidden="true">#</a> window.navigator</h2><p>userAgent 区分浏览器类型和环境</p><p>geolocation 获取地理位置（需要用户手动许可）</p><h2 id="综合" tabindex="-1"><a class="header-anchor" href="#综合" aria-hidden="true">#</a> 综合</h2><h3 id="判断元素是否在可视区域" tabindex="-1"><a class="header-anchor" href="#判断元素是否在可视区域" aria-hidden="true">#</a> 判断元素是否在可视区域</h3><p>el.getBoundingClientRect直接返回相对可视区域的offset</p><p>IntersectionObserver</p><p>结合页面scroll和元素相对页面的offset计算</p><h3 id="计算元素在页面上的坐标" tabindex="-1"><a class="header-anchor" href="#计算元素在页面上的坐标" aria-hidden="true">#</a> 计算元素在页面上的坐标</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> top <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span> left <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token keyword">while</span> <span class="token punctuation">(</span>el <span class="token operator">&amp;&amp;</span> el <span class="token operator">!==</span> document<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  top <span class="token operator">+=</span> el<span class="token punctuation">.</span>offsetTop <span class="token operator">||</span> <span class="token number">0</span><span class="token punctuation">;</span>
  left <span class="token operator">+=</span> el<span class="token punctuation">.</span>offsetLeft <span class="token operator">||</span> <span class="token number">0</span><span class="token punctuation">;</span>
  el <span class="token operator">=</span> el<span class="token punctuation">.</span>offsetParent<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,24),p=[o];function l(c,i){return a(),s("div",null,p)}const d=n(t,[["render",l],["__file","dom.html.vue"]]);export{d as default};
