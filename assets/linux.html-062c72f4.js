import{_ as a,p as e,q as s,a1 as n}from"./framework-5866ffd3.js";const i={},l=n(`<h1 id="linux" tabindex="-1"><a class="header-anchor" href="#linux" aria-hidden="true">#</a> linux</h1><h2 id="环境变量" tabindex="-1"><a class="header-anchor" href="#环境变量" aria-hidden="true">#</a> 环境变量</h2><p>设置env：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token builtin class-name">export</span> <span class="token assign-left variable">field1</span><span class="token operator">=</span>value1 <span class="token assign-left variable">field2</span><span class="token operator">=</span>value2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>查看env：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token builtin class-name">echo</span> <span class="token variable">$field1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>查看全部env：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">env</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>把可执行文件添加到环境变量中：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token builtin class-name">export</span> <span class="token assign-left variable"><span class="token environment constant">PATH</span></span><span class="token operator">=</span><span class="token environment constant">$PATH</span>:/path/to/bin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><blockquote><p>$PATH表示当前的路径设置，用<code>:</code>和新路径分隔，如果去掉<code>$PATH:</code>则会以新值覆盖PATH。</p></blockquote><p>程序在sudo模式下运行时，会忽略当前用户配置的env，如果需要当前env的变量，可以加上<code>-E</code>参数来透传环境变量：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">sudo</span> <span class="token parameter variable">-E</span> <span class="token punctuation">[</span>cmd<span class="token punctuation">]</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,13),d=[l];function c(t,o){return e(),s("div",null,d)}const p=a(i,[["render",c],["__file","linux.html.vue"]]);export{p as default};
