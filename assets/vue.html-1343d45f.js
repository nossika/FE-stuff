import{_ as e,M as p,p as o,q as c,R as n,t as a,N as t,a1 as i}from"./framework-5866ffd3.js";const l={},r=i(`<h1 id="vue" tabindex="-1"><a class="header-anchor" href="#vue" aria-hidden="true">#</a> Vue</h1><h2 id="组件通信" tabindex="-1"><a class="header-anchor" href="#组件通信" aria-hidden="true">#</a> 组件通信</h2><h3 id="父传递信息给子" tabindex="-1"><a class="header-anchor" href="#父传递信息给子" aria-hidden="true">#</a> 父传递信息给子</h3><p>父设置 props + 子 props/$attr</p><p>父设置 props + 子 watch 监听</p><h3 id="父访问子" tabindex="-1"><a class="header-anchor" href="#父访问子" aria-hidden="true">#</a> 父访问子</h3><p>$ref</p><p>vm.$children[childIndex]</p><h3 id="子传递信息给父" tabindex="-1"><a class="header-anchor" href="#子传递信息给父" aria-hidden="true">#</a> 子传递信息给父</h3><p>子 vm.$emit + 父设置 v-on 监听</p><h3 id="子访问父" tabindex="-1"><a class="header-anchor" href="#子访问父" aria-hidden="true">#</a> 子访问父</h3><p>vm.$parent</p><h3 id="跨层级传递" tabindex="-1"><a class="header-anchor" href="#跨层级传递" aria-hidden="true">#</a> 跨层级传递</h3><p>祖先 provide + 子孙 inject</p><p>$on + $emit：在某实例设置vm.$on，传递实例vm，利用vm.$emit传递事件</p><p>bus（新建一个Vue实例来传递事件，即$on + $emit的一种普遍用法）</p><p>VueX</p><h2 id="生命周期" tabindex="-1"><a class="header-anchor" href="#生命周期" aria-hidden="true">#</a> 生命周期</h2><h3 id="执行顺序" tabindex="-1"><a class="header-anchor" href="#执行顺序" aria-hidden="true">#</a> 执行顺序</h3><h4 id="组件新建" tabindex="-1"><a class="header-anchor" href="#组件新建" aria-hidden="true">#</a> 组件新建</h4><ul><li>beforeCreate()</li><li>created()</li><li>serverPrefetch() （服务端渲染仅执行到此）</li><li>beforeMount()</li><li>mounted()</li></ul><h4 id="组件更新" tabindex="-1"><a class="header-anchor" href="#组件更新" aria-hidden="true">#</a> 组件更新</h4><ul><li>beforeUpdate()</li><li>updated()</li></ul><h4 id="组件卸载" tabindex="-1"><a class="header-anchor" href="#组件卸载" aria-hidden="true">#</a> 组件卸载</h4><ul><li>beforeDestroy()</li><li>destroyed()</li></ul><h3 id="keep-alive" tabindex="-1"><a class="header-anchor" href="#keep-alive" aria-hidden="true">#</a> keep-alive</h3><p><code>keep-alive</code>标签内部的组件即使<code>v-if</code>为false从dom上被卸载，其实例也不会被销毁，当再次转为true时直接再次以这个实例渲染，其之前状态都会被保留。</p><p>激活时</p><ul><li>activated()</li></ul><p>停用时</p><ul><li>deactivated()</li></ul><h3 id="nexttick" tabindex="-1"><a class="header-anchor" href="#nexttick" aria-hidden="true">#</a> $nextTick</h3><p>作用</p><p>可否用setTimeout替代</p><h2 id="api" tabindex="-1"><a class="header-anchor" href="#api" aria-hidden="true">#</a> API</h2><h3 id="v-if-vs-v-show" tabindex="-1"><a class="header-anchor" href="#v-if-vs-v-show" aria-hidden="true">#</a> v-if vs v-show</h3><p>\b\b\b都是用于控制元素的显示隐藏，v-if是通过元素的渲染，v-show是通过元素的display。所以二者的适用场景为，v-show适合频繁在显示隐藏间切换的、内容少的的元素；v-if适合内容多的、不需要在初次渲染就展示出来的元素。</p><h3 id="slots" tabindex="-1"><a class="header-anchor" href="#slots" aria-hidden="true">#</a> slots</h3><p>slot-scope用法</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token comment">&lt;!--组件--&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>slot</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>a<span class="token punctuation">&quot;</span></span> <span class="token attr-name">:id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>123<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>

<span class="token comment">&lt;!--页面--&gt;</span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">slot</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>a<span class="token punctuation">&quot;</span></span> <span class="token attr-name">slot-scope</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>d<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>{{d.id}}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>$slots返回值（render函数）</p><h3 id="computed" tabindex="-1"><a class="header-anchor" href="#computed" aria-hidden="true">#</a> computed</h3><h3 id="watch" tabindex="-1"><a class="header-anchor" href="#watch" aria-hidden="true">#</a> watch</h3><h3 id="scoped-style" tabindex="-1"><a class="header-anchor" href="#scoped-style" aria-hidden="true">#</a> scoped style</h3><h3 id="mixins" tabindex="-1"><a class="header-anchor" href="#mixins" aria-hidden="true">#</a> mixins</h3><h3 id="vue-directive" tabindex="-1"><a class="header-anchor" href="#vue-directive" aria-hidden="true">#</a> Vue.directive</h3><h3 id="parent-children" tabindex="-1"><a class="header-anchor" href="#parent-children" aria-hidden="true">#</a> $parent/$children</h3><h2 id="原理相关" tabindex="-1"><a class="header-anchor" href="#原理相关" aria-hidden="true">#</a> 原理相关</h2><h3 id="从data改变到view变化经历的过程" tabindex="-1"><a class="header-anchor" href="#从data改变到view变化经历的过程" aria-hidden="true">#</a> 从data改变到view变化经历的过程</h3><p>初始化 为obj每个属性建立getter/setter，挂载新dep</p><p>初次渲染 利用触发getter绑定watcher到dep</p><p>数据变化 setter触发dep中的watcher，watcher触发更新</p><p>更新 virtual dom，snabbdom diff，patch</p><h3 id="dom-diff" tabindex="-1"><a class="header-anchor" href="#dom-diff" aria-hidden="true">#</a> DOM-diff</h3><p>Vue分离了diff和patch的逻辑，先基于vnode进行diff，再根据diff结果进行实际的patch操作，patch在不同的终端上有不同实现，但diff是统一的逻辑。</p><p>传统DOM-diff的时间复杂度为O(n<sup>3</sup>)</p><ul><li>只在新老DOM的同一层级的节点比较，且对每个节点只遍历一次。实际业务中很少有跨层级移动节点的情况。</li><li>新老节点如果类型/key不同，直接当做新建节点处理，不会再继续往下比较。大部分情况下，不同节点有不同内部的结构。</li></ul><p>基于此两点优化算法后，DOM-diff的时间复杂度为O(n)，牺牲对比的准确性来换取性能（有时即使原节点存在，也会因没匹配到而重新创建）。</p><h4 id="diff算法" tabindex="-1"><a class="header-anchor" href="#diff算法" aria-hidden="true">#</a> diff算法</h4><p>vue中的diff算法基于开源的snabbdom修改而来，实现如下：</p><ol><li><p>在新老vnode列表的头尾部各设置1个指针，总共4个指针：newStart/newEnd/oldStart/oldEnd</p></li><li><p>对这4个指针指向的vnode进行如下对比</p></li></ol><ul><li><p>如果newStart和oldStart的vnode同类型（包括key、tag等），那么复用oldStart对应的节点，对其递归diff，然后newStart++、oldStart++</p></li><li><p>如果newEnd和oldEnd的vnode同类型，那么复用oldEnd对应的节点，对其递归diff，然后newEnd--、oldEnd--</p></li><li><p>如果newStart和oldEnd的vnode同类型，那么复用oldEnd对应的节点，并将其移动到oldStart对应的节点之前，对其递归diff，然后newStart++、oldEnd--</p></li><li><p>如果newEnd和oldStart的vnode同类型，那么复用oldStart对应的节点，并将其移动到oldEnd对应的节点之后，对其递归diff，然后newEnd--、oldStart++</p></li><li><p>如果newStart的vnode有key值且能找到到key对应的oldVnode，且同类型，那么复用oldVnode对应的节点，并将其移动到oldStart对应的节点之前，对其递归diff，然后newStart++</p></li><li><p>如果上述条件都不成立，那么直接根据newStart的vnode创建一个新节点，插入到oldStart对应的节点之前，然后newStart++</p></li></ul><ol start="3"><li><p>重复步骤2，直到oldStart &gt; oldEnd 或者 newStart &gt; newEnd 时，进入步骤4</p></li><li><p>此时有两种情况</p></li></ol><ul><li><p>如果是oldStart &gt; oldEnd，那么将newStart和newEnd之间的vnode都创建为新节点，插入到oldEnd之前</p></li><li><p>如果是newStart &gt; newEnd，那么将oldStart和oldEnd之间的节点都作为废弃节点删除掉</p></li></ul><ol start="5"><li>整个diff操作完成</li></ol><h4 id="例子" tabindex="-1"><a class="header-anchor" href="#例子" aria-hidden="true">#</a> 例子</h4><p>old: a b c d e</p><p>new: b c d f</p><p>todo</p><h3 id="响应式更新" tabindex="-1"><a class="header-anchor" href="#响应式更新" aria-hidden="true">#</a> 响应式更新</h3><p>监听对象变化：</p><p>对对象各个key递归使用Object.defineProperty监听其getter和setter。</p><p>监听数组变化：</p><p>改写数组的原型上的push、pop、reverse等方法，监听数组api的调用。但不监听直接对数组下标修改的变化（<code>arr[1]=2</code>），其实同样可以通过defineProperty的方式来监听，arr当做对象，下标当做key，但出于性能考虑没有这么实现。</p><p>Proxy：</p><p>Vue3用Proxy来改写响应式逻辑，Proxy能把对象和数组的监听统一处理，也可监听到通过数组下标作的修改，省去对数组的特殊操作。</p><h4 id="watcher" tabindex="-1"><a class="header-anchor" href="#watcher" aria-hidden="true">#</a> watcher</h4><p>data每个prop的setter与组件的watcher关联，prop变化时，通知组件的watcher来重新执行render。后面再对新老render生成的vdom进行diff，来更新dom。</p><p>Vue1做法: 在初次编译时遍历dom节点，新建watcher将dom节点与data里对应的prop的setter关联，prop变化时，通过此watcher直接更新对应的dom节点。此方法dom更新效率更高（直接更新目标dom，省去了diff过程），但初始化时间长（创建watcher与dom的一一关联）、占用内存高（内存里保留了dom的引用）、watcher和浏览器环境的dom耦合。</p><h4 id="dep-target" tabindex="-1"><a class="header-anchor" href="#dep-target" aria-hidden="true">#</a> dep.target</h4><p>一般做法：data监听setter和绑定dep，编译模板时AST解析调用了哪些data属性，去给它们添加dep</p><p>Vue做法：data还监听了getter，编译模板时会触发getter，getter里通过target判断是否处于编译中，是的话把target指向的watcher添加到对应的dep，编译前后会改写target</p><h4 id="computed-1" tabindex="-1"><a class="header-anchor" href="#computed-1" aria-hidden="true">#</a> computed</h4><p>vue中的computed具有缓存和懒计算。</p><p>实现：</p><p>每个computed属性会建立一个watcher对应。</p><p>在被使用时（getter触发时）进入computedGetter，根据watcher.dirty的值 true/false 决定 重新计算/返回缓存。</p><p>第一次被使用时，默认watcher.dirty为true，触发computed计算，并收集计算中用到的依赖（把自身关联到依赖的watcher通知列表），并存下本次计算的value值。</p><p>当有依赖发生改动时，该computed的watcher.dirty会被设置为true，下次该computed被使用时就会被重新计算并缓存value，再把dirty重置为false。</p><h3 id="nexttick-1" tabindex="-1"><a class="header-anchor" href="#nexttick-1" aria-hidden="true">#</a> nextTick</h3><p>（内部实现micro：Promise，macro：MessageChannel、setTimeout）</p><p>定义microFunc macroFunc</p><p>执行nextTick时，推入callbacks并触发一次（根据pending变量判断）在下轮执行flushCallbacks</p><p>flushCallbacks清空callbacks，依次执行callbacks（先清空来保证出现nextTick嵌套时的执行次序）</p><p>数据变动优先使用micro，可以在一轮事件循环内改变完data，只触发一次重渲染</p><h3 id="源码结构" tabindex="-1"><a class="header-anchor" href="#源码结构" aria-hidden="true">#</a> 源码结构</h3><p>core/instance 定义Vue，定义原型属性</p><p>core/globalAPI 定义静态属性</p><p>platform 平台化包装导出（runtime &amp; with-compiler）</p><p>core/lifecycle 初始化实例的生命周期，callHook</p><h4 id="runtime-with-compiler" tabindex="-1"><a class="header-anchor" href="#runtime-with-compiler" aria-hidden="true">#</a> runtime &amp; with-compiler</h4><p>官方提供两种包：仅运行时 &amp; 运行时 + 编译器</p><h2 id="官方库" tabindex="-1"><a class="header-anchor" href="#官方库" aria-hidden="true">#</a> 官方库</h2><h3 id="vuerouter" tabindex="-1"><a class="header-anchor" href="#vuerouter" aria-hidden="true">#</a> VueRouter</h3><p>单页概念</p><p>路由模式：history、hash</p><h3 id="vuex" tabindex="-1"><a class="header-anchor" href="#vuex" aria-hidden="true">#</a> Vuex</h3><p>解决的问题</p><p>模块：action -&gt; mutation -&gt; state -&gt; getter</p><h2 id="ssr" tabindex="-1"><a class="header-anchor" href="#ssr" aria-hidden="true">#</a> SSR</h2><h3 id="ssr过程" tabindex="-1"><a class="header-anchor" href="#ssr过程" aria-hidden="true">#</a> SSR过程</h3><p>普通渲染（客户端渲染）过程：</p><ol><li>客户端发起请求</li><li>服务端返回静态HTML（只有一个app外壳），以及渲染所需的scripts资源</li><li>客户端拿到HTML渲染一个空界面，并加载scripts资源</li><li>资源加载完毕，在客户端执行<code>new Vue()</code>渲染出正确界面</li></ol><p>SSR过程：</p><ol><li>客户端发起请求</li><li>服务端返回渲染后的完整HTML，也包含渲染所需的scripts资源</li><li>客户端拿到HTML<strong>直接渲染出正确界面</strong>，并加载scripts资源</li><li>资源加载完毕，在客户端执行<code>new Vue()</code>来重新渲染界面（这个结果会和服务端渲染的HTML一致，所以用户对此过程无感知），之后由客户端的Vue实例来<strong>接管客户端的行为</strong>，后续行为和客户端渲染一致</li></ol><h3 id="静态页渲染" tabindex="-1"><a class="header-anchor" href="#静态页渲染" aria-hidden="true">#</a> 静态页渲染</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> renderer <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;vue-server-renderer&#39;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">createRenderer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
renderer<span class="token punctuation">.</span><span class="token function">renderToString</span><span class="token punctuation">(</span>app<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">err<span class="token punctuation">,</span> html</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token comment">// send html to client</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此方式只适用于渲染不需要交互的静态页面，可以开启缓存提高性能。</p><h3 id="前后端同构" tabindex="-1"><a class="header-anchor" href="#前后端同构" aria-hidden="true">#</a> 前后端同构</h3><p>显然，在服务端代码和前端代码中各写一个app会很难维护，理想状态应该是只有一份app代码，它能够被打包成服务端文件和静态文件来供双方使用，我们称之为前后端同构。</p><p>这里以使用webpack的Vue项目为例，需要对其作一些修改：</p><ul><li><p>独立出<strong>entry-client.js</strong>和<strong>entry-server.js</strong>两个入口文件，以及共用的<strong>create-app.js</strong>。</p></li><li><p><strong>create-app.js</strong>只提供一个<code>createApp</code>函数，不做其他有副作用的或者和运行环境有关的事情。</p></li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createApp</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token function-variable function">render</span><span class="token operator">:</span> <span class="token parameter">h</span> <span class="token operator">=&gt;</span> <span class="token function">h</span><span class="token punctuation">(</span>App<span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token literal-property property">store</span><span class="token operator">:</span> <span class="token function">createStore</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token literal-property property">router</span><span class="token operator">:</span> <span class="token function">createRouter</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> app<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><strong>entry-server.js</strong>需要对<code>createApp</code>函数做一层封装，使其变成能够根据传入的store和router参数来初始化app，并注册匹配路由和预获取组件数据（asyncData）。</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">(</span><span class="token parameter">context <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token function">createApp</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> store <span class="token operator">=</span> app<span class="token punctuation">.</span>$store<span class="token punctuation">;</span>
  <span class="token keyword">const</span> router <span class="token operator">=</span> app<span class="token punctuation">.</span>$router<span class="token punctuation">;</span>

  context<span class="token punctuation">.</span>path <span class="token operator">&amp;&amp;</span> router<span class="token punctuation">.</span><span class="token function">replace</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span>path<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 将context传入的state作为初始化state</span>
  context<span class="token punctuation">.</span>state <span class="token operator">&amp;&amp;</span> store<span class="token punctuation">.</span><span class="token function">replaceState</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span>state<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    router<span class="token punctuation">.</span><span class="token function">onReady</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token comment">// 预先把匹配到路由信息加载到router返回给客户端，客户端在router.onReady后执行app渲染，才能完全匹配上ssr的dom</span>
      <span class="token keyword">const</span> matchedComponents <span class="token operator">=</span> router<span class="token punctuation">.</span><span class="token function">getMatchedComponents</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span><span class="token parameter">item</span> <span class="token operator">=&gt;</span> item <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      Promise<span class="token punctuation">.</span><span class="token function">all</span><span class="token punctuation">(</span>matchedComponents<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">comp</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>comp<span class="token punctuation">.</span>asyncData<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token comment">// 组件内部的asyncData可能会对state再次操作，返回给客户端的是这些操作后的state，通过window.__INITIAL_STATE__取值</span>
          <span class="token keyword">return</span> comp<span class="token punctuation">.</span><span class="token function">asyncData</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
            store<span class="token punctuation">,</span>
            <span class="token literal-property property">route</span><span class="token operator">:</span> router<span class="token punctuation">.</span>currentRoute<span class="token punctuation">,</span>
          <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token function">resolve</span><span class="token punctuation">(</span>app<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">catch</span><span class="token punctuation">(</span>reject<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span> reject<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><strong>entry-client.js</strong>需要调用<code>createApp</code>函数来在客户端完成Vue实例化，然后等待__INITIAL_STATE__初始化store、router.onReady（加载注册路由）、预获取组件数据这几个操作执行完毕后，再执行$mount操作，以保证客户端渲染结果和服务端的完全一致。</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token function">createApp</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">if</span> <span class="token punctuation">(</span>window<span class="token punctuation">.</span>__INITIAL_STATE__<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  app<span class="token punctuation">.</span>$store<span class="token punctuation">.</span><span class="token function">replaceState</span><span class="token punctuation">(</span>window<span class="token punctuation">.</span>__INITIAL_STATE__<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> router <span class="token operator">=</span> app<span class="token punctuation">.</span>$router<span class="token punctuation">;</span>
<span class="token keyword">const</span> store <span class="token operator">=</span> app<span class="token punctuation">.</span>$store<span class="token punctuation">;</span>

<span class="token comment">// 等路由异步组件加载完再执行app.$mount操作，\b以保持和服务端渲染结果一致</span>
router<span class="token punctuation">.</span><span class="token function">onReady</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token comment">// 路由跳转前先执行完asyncData(如果有)再渲染，以保持和服务端渲染的行为一致（也是执行完asyncData再返回）</span>
  router<span class="token punctuation">.</span><span class="token function">beforeResolve</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">to<span class="token punctuation">,</span> from<span class="token punctuation">,</span> next</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> matched <span class="token operator">=</span> router<span class="token punctuation">.</span><span class="token function">getMatchedComponents</span><span class="token punctuation">(</span>to<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> prevMatched <span class="token operator">=</span> router<span class="token punctuation">.</span><span class="token function">getMatchedComponents</span><span class="token punctuation">(</span>from<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">let</span> diffed <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> activated <span class="token operator">=</span> matched<span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">c<span class="token punctuation">,</span> i</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> diffed <span class="token operator">||</span> <span class="token punctuation">(</span>diffed <span class="token operator">=</span> <span class="token punctuation">(</span>prevMatched<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">!==</span> c<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>activated<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    Promise<span class="token punctuation">.</span><span class="token function">all</span><span class="token punctuation">(</span>activated<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">comp</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>comp <span class="token operator">&amp;&amp;</span> comp<span class="token punctuation">.</span>asyncData<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> comp<span class="token punctuation">.</span><span class="token function">asyncData</span><span class="token punctuation">(</span><span class="token punctuation">{</span> store<span class="token punctuation">,</span> <span class="token literal-property property">route</span><span class="token operator">:</span> to <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">catch</span><span class="token punctuation">(</span>next<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>

  app<span class="token punctuation">.</span><span class="token function">$mount</span><span class="token punctuation">(</span><span class="token string">&#39;#app&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p>webpack的打包配置也需要分成<strong>client.config.js</strong>和<strong>server.config.js</strong>，需要各自加上官方提供的对应plugin，注意<strong>server.config.js</strong>中要去掉MiniCssExtractPlugin这类外置资源的插件。打包出来的文件可以放在同一文件夹，包含<strong>vue-ssr-client-manifest.json</strong>（客户端依赖的资源map）、<strong>vue-ssr-server-bundle.json</strong>（服务端需要的app创建方法）和一些chunks文件。</p></li><li><p>服务端代码通过<code>require(&#39;vue-server-renderer&#39;).createBundleRenderer</code>引用打包后的vue-ssr-server-bundle.json、vue-ssr-client-manifest.json，计算出渲染完成的HTML并注入资源依赖后，返回给客户端。</p></li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> renderer <span class="token operator">=</span> <span class="token function">createBundleRenderer</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">&#39;../dist/vue-ssr-server-bundle.json&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">template</span><span class="token operator">:</span> fs<span class="token punctuation">.</span><span class="token function">readFileSync</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">&#39;../src/index.html&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">&#39;utf-8&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token comment">// html模板</span>
  <span class="token literal-property property">clientManifest</span><span class="token operator">:</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;../dist/vue-ssr-client-manifest.json&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token comment">// 客户端依赖，服务端完成首页渲染之后，客户端路由变化的新页面由客户端代码去渲染</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> htmlStr <span class="token operator">=</span> <span class="token keyword">await</span> renderer<span class="token punctuation">.</span><span class="token function">renderToString</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">state</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">user</span><span class="token operator">:</span> <span class="token string">&#39;my friend&#39;</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">path</span><span class="token operator">:</span> ctx<span class="token punctuation">.</span>req<span class="token punctuation">.</span>url<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,129),u={href:"https://github.com/nossika/vue-ssr-demo",target:"_blank",rel:"noopener noreferrer"},d=n("h2",{id:"hooks-vs-option",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#hooks-vs-option","aria-hidden":"true"},"#"),a(" Hooks VS Option")],-1),k=n("p",null,"Vue3为组件编写提供了新的hooks写法。hooks组件和option组件的区别，和React中hooks组件与class组件的区别类似。",-1),h={href:"/framework/react.html#hooks-vs-class",target:"_blank",rel:"noopener noreferrer"};function v(m,f){const s=p("ExternalLinkIcon");return o(),c("div",null,[r,n("p",null,[a("上述例子已上传到"),n("a",u,[a("vue-ssr-demo"),t(s)]),a("，可结合代码查看。")]),d,k,n("blockquote",null,[n("p",null,[a("详见"),n("a",h,[a("【React】"),t(s)])])])])}const g=e(l,[["render",v],["__file","vue.html.vue"]]);export{g as default};
