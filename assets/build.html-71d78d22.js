import{_ as e,p as a,q as l,a1 as i}from"./framework-5866ffd3.js";const d={},r=i('<h1 id="构建" tabindex="-1"><a class="header-anchor" href="#构建" aria-hidden="true">#</a> 构建</h1><h2 id="webpack" tabindex="-1"><a class="header-anchor" href="#webpack" aria-hidden="true">#</a> webpack</h2><h3 id="热更新" tabindex="-1"><a class="header-anchor" href="#热更新" aria-hidden="true">#</a> 热更新</h3><p>1、启动node层的dev服务，并在web页面注入自己的entry脚本，用于启动websocket连接等</p><p>2、编译模块为立即执行函数，保留模块的文件hash和模块间依赖关系图，监听文件变化</p><p>3、文件变化时重新计算hash并对比，替换变化模块，重新执行模块函数以及其关联依赖</p><h3 id="优化构建" tabindex="-1"><a class="header-anchor" href="#优化构建" aria-hidden="true">#</a> 优化构建</h3><h4 id="体积优化" tabindex="-1"><a class="header-anchor" href="#体积优化" aria-hidden="true">#</a> 体积优化</h4><ul><li><p>懒加载：只加载当前界面需要的代码，可以结合预加载来优化等待时间，合理利用动态import。</p></li><li><p>按需加载：只加载依赖库用到的模块，而非加载整个库，比如antd结合plugin-import、moment只加载需要的语言库等。</p></li><li><p>treeshaking：webpack内置优化，构建时丢弃模块未被使用的代码，但需要满足模块代码干净无副作用，比如加载第三方库时指定加载其es版本，更利于webpack做treeshaking优化。</p></li><li><p>代码压缩：webpack已在生产模式内置，比如uglifyjs。</p></li><li><p>分离CSS：把样式独立到css文件，或者异步加载，不阻塞js执行。</p></li><li><p>chunk粒度权衡：将多个异步模块共用的依赖提取出来，统一加载，就可以不必在每个异步模块中都重复打包这些共用依赖，但要考虑chunk粒度，太粗起不到优化效果，太细会拖慢主模块的加载，合理使用splitchunks配置。</p></li></ul><h4 id="速度优化" tabindex="-1"><a class="header-anchor" href="#速度优化" aria-hidden="true">#</a> 速度优化</h4><ul><li><p>loader粒度精细：每一类文件只经过它必须的loader。</p></li><li><p>多线程编译：webpack5内置的Terser plugin已开启parallel，或者手动使用happypack之类的plugin。</p></li><li><p>编译缓存：webpack5已经内置了模块缓存策略，或者手动使用cache-loader、dll之类的工具。</p></li><li><p>（对于ts项目）类型检查放到异步：transpileOnly结合fork-ts-checker-webpack-plugin。</p></li></ul><h4 id="用户网络资源优化" tabindex="-1"><a class="header-anchor" href="#用户网络资源优化" aria-hidden="true">#</a> 用户网络资源优化</h4><ul><li><p>基于contenthash命名模块：模块内容改变文件名才会改变。</p></li><li><p>提取公共依赖：将不常变动的第三方库从业务代码中独立成一个模块，这个模块的内容可以比较稳定。</p></li></ul><h2 id="rollup" tabindex="-1"><a class="header-anchor" href="#rollup" aria-hidden="true">#</a> rollup</h2><p>更纯粹的打包工具，适合库而非应用（app）</p><h2 id="gulp" tabindex="-1"><a class="header-anchor" href="#gulp" aria-hidden="true">#</a> gulp</h2><p>流式任务</p><h2 id="babel" tabindex="-1"><a class="header-anchor" href="#babel" aria-hidden="true">#</a> babel</h2><p>和polyfill关系：babel只转语法，polyfill拓展原型和全局对象</p><p>原理：text =&gt; tokens =&gt; ast =&gt; ast(transformed) =&gt; text</p><h3 id="babel如何直接运行于浏览器" tabindex="-1"><a class="header-anchor" href="#babel如何直接运行于浏览器" aria-hidden="true">#</a> babel如何直接运行于浏览器？</h3><p>以此版本 https://unpkg.com/babel-standalone@6.26.0/babel.js 的babel为例：</p><ol><li>监听<code>DOMContentLoaded</code>事件，事件触发后会选取所有<code>type</code>为<code>text/jsx</code>和<code>text/babel</code>的<code>script</code>存入jsxScripts数组。</li><li>遍历数组，将<code>scriptEl.innerHTML</code>作为源码调用babel核心方法编译为结果代码（带<code>src</code>的<code>script</code>用ajax异步获取content作为源码，在回调中处理编译）。</li><li>编译完成后新建<code>script</code>元素，将<code>scriptEl.text</code>设置为结果代码，<code>append</code>到<code>headEl</code>，此时浏览器会自动执行该<code>script</code>。</li></ol>',23),c=[r];function t(p,h){return a(),l("div",null,c)}const n=e(d,[["render",t],["__file","build.html.vue"]]);export{n as default};
