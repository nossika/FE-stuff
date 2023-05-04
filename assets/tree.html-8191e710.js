import{_ as e,p as a,q as t,a1 as r}from"./framework-5866ffd3.js";const d={},i=r(`<h1 id="杂" tabindex="-1"><a class="header-anchor" href="#杂" aria-hidden="true">#</a> 杂</h1><p>[TOC]</p><h2 id="js-ecma" tabindex="-1"><a class="header-anchor" href="#js-ecma" aria-hidden="true">#</a> JS（ECMA）</h2><h3 id="数字转字符串-字符串转数字" tabindex="-1"><a class="header-anchor" href="#数字转字符串-字符串转数字" aria-hidden="true">#</a> 数字转字符串 &amp; 字符串转数字</h3><p>number + &quot;&quot; / number.toString() / String(number)</p><p>+string / parseFloat(string) / Number(string)</p><p>隐式转换规则，调用to根据preferType调用toString() / valueOf()</p><p>Number() &amp; new Number() 区别: 为什么可以在基本属性上执行方法（比如(123).toString()）</p><h3 id="隐式转换" tabindex="-1"><a class="header-anchor" href="#隐式转换" aria-hidden="true">#</a> 隐式转换</h3><p>toPrimitive(hint) hint：string/number/default</p><p>string mode: toString =&gt; valueOf =&gt; error</p><p>number mode: valueOf =&gt; toString =&gt; error</p><h3 id="数组原型上的方法array-prototype" tabindex="-1"><a class="header-anchor" href="#数组原型上的方法array-prototype" aria-hidden="true">#</a> 数组原型上的方法Array.prototype</h3><p>影响原数组 / 返回新数组 / 遍历</p><p>find、findIndex(ES6)</p><p>includes(ES7)</p><h3 id="es8" tabindex="-1"><a class="header-anchor" href="#es8" aria-hidden="true">#</a> ES8</h3><p>...Object</p><p>await let of</p><h3 id="object" tabindex="-1"><a class="header-anchor" href="#object" aria-hidden="true">#</a> Object</h3><h4 id="禁止修改属性" tabindex="-1"><a class="header-anchor" href="#禁止修改属性" aria-hidden="true">#</a> 禁止修改属性</h4><p>Object.freeze</p><p>defineProperty writable</p><p>defineProperty set</p><h3 id="原型继承" tabindex="-1"><a class="header-anchor" href="#原型继承" aria-hidden="true">#</a> 原型继承</h3><h4 id="instance-a-、prototype-protoa-、constructor-a-之间关系" tabindex="-1"><a class="header-anchor" href="#instance-a-、prototype-protoa-、constructor-a-之间关系" aria-hidden="true">#</a> instance(a)、prototype(protoA)、constructor(A)之间关系:</h4><p>a ===&gt; protoA: Object.getPrototypeOf(a);</p><p>a ===&gt; A: a.constructor;</p><p>protoA ===&gt; A: protoA.constructor;</p><p>A ===&gt; protoA: A.prototype;</p><p>A ===&gt; a: new A();</p><h4 id="class-extends-写法" tabindex="-1"><a class="header-anchor" href="#class-extends-写法" aria-hidden="true">#</a> class extends 写法</h4><h3 id="promise错误处理" tabindex="-1"><a class="header-anchor" href="#promise错误处理" aria-hidden="true">#</a> Promise错误处理</h3><p>能否 try { new Promise(..); } catch() {} ？ 为何</p><p>对比</p><p>new Promise(...).then(data =&gt; {}, error =&gt; {})</p><p>new Promise(...).then(date =&gt; {}).catch(error =&gt; {})</p><h3 id="settimeout-setinterval-处理循环" tabindex="-1"><a class="header-anchor" href="#settimeout-setinterval-处理循环" aria-hidden="true">#</a> setTimeout &amp; setInterval 处理循环</h3><p>setInterval可能连续多次触发（定时推送，不管内部函数是否执行完毕，因为JS引擎和定时器是两个不同线程各自执行）</p><h3 id="esm、cjs" tabindex="-1"><a class="header-anchor" href="#esm、cjs" aria-hidden="true">#</a> esm、cjs</h3><p>import：编译时导入（静态），值引用，只读；</p><p>require：运行时导入（动态），值拷贝</p><p>循环引用区别</p><p>import()动态，返回promise。</p><h3 id="amd、cmd" tabindex="-1"><a class="header-anchor" href="#amd、cmd" aria-hidden="true">#</a> AMD、CMD</h3><p>AMD：依赖前置，requireJS</p><p>CMD：依赖就近，seaJS</p><p>浏览器中用法：type=&quot;module&quot;</p><h3 id="数字精度" tabindex="-1"><a class="header-anchor" href="#数字精度" aria-hidden="true">#</a> 数字精度</h3><p>JS中能转换成整数的值都会用整数来存储，小数在底层用 IEEE-754 双精度（64位）浮点数来存储。</p><p>64位：1符号位+11指数位+52有效数字位</p><p>小数x转化成二进制是用 x = 1/2*a + 1/4*b + 1/8*c + 1/16*d ... 中的abcd等因子来表示。</p><p>比如0.1 = 1/2*0 + 1/4*0 + 1/8*0 + 1/16*1 + 1/32*1 + 1/64*0 ... ，则0.1的二进制表示为00011001100...，去掉头部的0从1开始（头部的0可以在指数位表示），则有效数字部分为11001100...</p><p>因此大部分小数无法精确存储，除了0.5/0.125/0.375这类数字</p><h3 id="手写函数" tabindex="-1"><a class="header-anchor" href="#手写函数" aria-hidden="true">#</a> 手写函数</h3><p>实现Array.prototype.reduce/String.prototype.indexOf/Function.prototype.bind</p><h3 id="排序" tabindex="-1"><a class="header-anchor" href="#排序" aria-hidden="true">#</a> 排序</h3><table><thead><tr><th style="text-align:left;">方法</th><th style="text-align:center;">平均</th><th style="text-align:center;">最快</th><th style="text-align:center;">最慢</th><th style="text-align:center;">空间</th></tr></thead><tbody><tr><td style="text-align:left;">快排</td><td style="text-align:center;">NlogN</td><td style="text-align:center;">N2</td><td style="text-align:center;">NlogN</td><td style="text-align:center;">1</td></tr><tr><td style="text-align:left;">冒泡</td><td style="text-align:center;">N2</td><td style="text-align:center;">N2</td><td style="text-align:center;">N</td><td style="text-align:center;">1</td></tr><tr><td style="text-align:left;">插入</td><td style="text-align:center;">N2</td><td style="text-align:center;">N2</td><td style="text-align:center;">N</td><td style="text-align:center;">1</td></tr></tbody></table><h3 id="尾调用优化" tabindex="-1"><a class="header-anchor" href="#尾调用优化" aria-hidden="true">#</a> 尾调用优化</h3><p>最后return一个函数，不依赖其他变量</p><p>递归会产生多层函数调用栈，优化后只有一层</p><h2 id="js-dom" tabindex="-1"><a class="header-anchor" href="#js-dom" aria-hidden="true">#</a> JS（DOM）</h2><h3 id="addeventlistener参数" tabindex="-1"><a class="header-anchor" href="#addeventlistener参数" aria-hidden="true">#</a> addEventListener参数</h3><p>冒泡、捕获，</p><p>阻止冒泡</p><h3 id="attribute操作-class操作" tabindex="-1"><a class="header-anchor" href="#attribute操作-class操作" aria-hidden="true">#</a> attribute操作，class操作</h3><h3 id="检测页面是否滚动到底部" tabindex="-1"><a class="header-anchor" href="#检测页面是否滚动到底部" aria-hidden="true">#</a> 检测页面是否滚动到底部</h3><h3 id="nodelist-htmlcollection" tabindex="-1"><a class="header-anchor" href="#nodelist-htmlcollection" aria-hidden="true">#</a> NodeList &amp; HTMLCollection</h3><p>Node.childNodes &amp; Node.children</p><p>HTMLCollection不同：只包含elementNode（无textNode）、动态更新、namedItem方法</p><h3 id="cssstyledeclaration" tabindex="-1"><a class="header-anchor" href="#cssstyledeclaration" aria-hidden="true">#</a> CSSStyleDeclaration</h3><p>CSSStyleDeclaration.setProperty(&#39;--color&#39;, &#39;red&#39;)</p><h3 id="repaint-reflow" tabindex="-1"><a class="header-anchor" href="#repaint-reflow" aria-hidden="true">#</a> repaint &amp; reflow</h3><p>repaint: transform/visibility/background</p><h2 id="js-bom" tabindex="-1"><a class="header-anchor" href="#js-bom" aria-hidden="true">#</a> JS（BOM）</h2><h3 id="区分pc-ios-android" tabindex="-1"><a class="header-anchor" href="#区分pc-ios-android" aria-hidden="true">#</a> 区分pc/ios/android</h3><h2 id="js-引擎" tabindex="-1"><a class="header-anchor" href="#js-引擎" aria-hidden="true">#</a> JS 引擎</h2><h3 id="v8" tabindex="-1"><a class="header-anchor" href="#v8" aria-hidden="true">#</a> V8</h3><p>runtime优化</p><p>垃圾回收：</p><p>新生代（from/to，存活晋升）、老生代（标记清除、标记整理）、大对象、jit</p><h3 id="事件循环" tabindex="-1"><a class="header-anchor" href="#事件循环" aria-hidden="true">#</a> 事件循环</h3><p>GUI渲染线程、JS主线程、定时器线程、http请求线程</p><p>setTimeout和Promise.then先后（macro、micro）</p><h3 id="webworker" tabindex="-1"><a class="header-anchor" href="#webworker" aria-hidden="true">#</a> WebWorker</h3><p>Worker、SharedWorker（后者是独立进程，多tab页可共享一个）</p><h2 id="mobile" tabindex="-1"><a class="header-anchor" href="#mobile" aria-hidden="true">#</a> mobile</h2><h3 id="flexible方案" tabindex="-1"><a class="header-anchor" href="#flexible方案" aria-hidden="true">#</a> flexible方案</h3><p>通过dpr来设置根节点的font-size + viewport的scale，页面使用设计图尺寸转换得到的rem，完成一个设计图到多种屏幕的适配</p><h2 id="浏览器" tabindex="-1"><a class="header-anchor" href="#浏览器" aria-hidden="true">#</a> 浏览器</h2><h3 id="渲染" tabindex="-1"><a class="header-anchor" href="#渲染" aria-hidden="true">#</a> 渲染</h3><h4 id="过程" tabindex="-1"><a class="header-anchor" href="#过程" aria-hidden="true">#</a> 过程</h4><ul><li>style（确定每个节点应用的css规则）</li><li>layout（reflow，重新计算各个节点位置）</li><li>update layer tree（确定层叠顺序））（render layer）</li><li>paint（计算节点绘制信息）</li><li>composite（合成层）（graphics layer）</li></ul><h4 id="gpu加速" tabindex="-1"><a class="header-anchor" href="#gpu加速" aria-hidden="true">#</a> gpu加速</h4><p>dom的绘制信息会被分成多个格栅上传gpu绘制</p><p>某些情况下节点会被单独升级为合成层（比如：transform、opacity、canvas标签、手动加上will-change、有个比自己index低的合成层时 等），浏览器会独立绘制各个合成层，最后再复合而成最终页面，合成层内的dom变动只需要重绘这个层，更高效。</p><p>结论：尽量用transform，合理利用will-change，把合成层的index尽可能高（避免自动创建不必要的合成层）</p><h4 id="dom-update-、-dom-render" tabindex="-1"><a class="header-anchor" href="#dom-update-、-dom-render" aria-hidden="true">#</a> dom update 、 dom render</h4><ul><li>dom update的修改和获取是实时的，dom render是非实时（一般在一轮循环中，task和microtask都执行完后render，不一定每轮，因为事件循环频率可能比浏览器帧率高）</li><li>所以vue使用promise.then来做dom更新，如果放在task里则下轮循环才更新</li></ul><h3 id="输入url-页面展示" tabindex="-1"><a class="header-anchor" href="#输入url-页面展示" aria-hidden="true">#</a> 输入url =&gt; 页面展示</h3><ul><li><p>缓存查询</p></li><li><p>dns</p></li><li><p>打开tcp（tcp/ip协议） 后台负载均衡</p></li><li><p>browser主进程发起请求 =&gt; 结果转交给render进程（tab页进程）处理 浏览器多进程（主进程，tab页，GPU等），tab页多线程（js引擎、GUI渲染、http请求、定时器、事件调度等）</p></li><li><p>渲染（DOM树，CSS树，render树） js解析会中断渲染（GUI渲染线程与js线程互斥）</p></li></ul><h2 id="web" tabindex="-1"><a class="header-anchor" href="#web" aria-hidden="true">#</a> WEB</h2><h3 id="http协议" tabindex="-1"><a class="header-anchor" href="#http协议" aria-hidden="true">#</a> http协议</h3><p>基于tcp协议，req格式： <code>HTTP/1.1 /index.html GET\\r\\nConnection: keep-alive</code>，res格式：<code>HTTP/1.1 200 OK\\r\\nContent-type: text/plain\\r\\n\\r\\nsome text here</code></p><p>1.1默认keep-alive，基于一次tcp（3次握手4次挥手）来发多次http请求</p><p>状态码12345</p><p>header(content-type/accept-encoding/user-agent/cookie/access-control-allow-origin/cache-control/e-tag/connection)</p><p>缓存控制</p><p>cookie</p><p>http2：二进制、多路复用、主动推送、头部压缩</p><p>https</p><h3 id="前端缓存" tabindex="-1"><a class="header-anchor" href="#前端缓存" aria-hidden="true">#</a> 前端缓存</h3><h4 id="缓存位置-service-worker、memory-关闭tab清空-、disk" tabindex="-1"><a class="header-anchor" href="#缓存位置-service-worker、memory-关闭tab清空-、disk" aria-hidden="true">#</a> 缓存位置：service worker、memory（关闭tab清空）、disk</h4><h4 id="缓存顺序" tabindex="-1"><a class="header-anchor" href="#缓存顺序" aria-hidden="true">#</a> 缓存顺序</h4><p>： SW内的fetch方法也遵守此规则</p><p>强制缓存：cache-control(max-age)、expires</p><p>协商缓存：e-tag、last-modified</p><h4 id="no-store" tabindex="-1"><a class="header-anchor" href="#no-store" aria-hidden="true">#</a> no-store</h4><p>除了no-store的情况，当前页多次同一资源的请求（无论同步异步）只会从网络获取一次，其余都从memory获取（且不显示在network），如果no-store，则多少请求就获取多少次</p><h3 id="websocket" tabindex="-1"><a class="header-anchor" href="#websocket" aria-hidden="true">#</a> websocket</h3><p>和http一样基于tcp，http协议的升级</p><p>tcp连接（连接实例称为socket）建立后，客户端发送http格式的报文<code>{ Connection: Upgrade, Upgrade: websocket, ... }</code>，服务端如果支持，也返回类似的确认报文，双方都对这个socket做好全双工通信的准备，即websocket连接建立。</p><h3 id="socket" tabindex="-1"><a class="header-anchor" href="#socket" aria-hidden="true">#</a> socket</h3><p>套接字，可以理解为一个连接的实例， 比如说服务端客户端建立起一个tcp连接，那么两端各会有一个socket实例，可以对其调用各种方法来收发信息。</p><h3 id="七层模型" tabindex="-1"><a class="header-anchor" href="#七层模型" aria-hidden="true">#</a> 七层模型</h3><p>应用：http</p><p>会话：ssl/tls</p><p>传输：tcp/udp</p><p>网络：ip</p><h3 id="跨域" tabindex="-1"><a class="header-anchor" href="#跨域" aria-hidden="true">#</a> 跨域</h3><p>http header(cors)</p><p>iframe</p><p>jsonp</p><p>nginx转发</p><h3 id="性能优化" tabindex="-1"><a class="header-anchor" href="#性能优化" aria-hidden="true">#</a> 性能优化</h3><p>定位：chrome的network、performance、memory</p><p>解决：</p><p>dns：cdn</p><p>缓存：response header、打包配置</p><p>文件粒度：打包配置</p><p>业务代码：结合框架特性</p><p>http2</p><p>window.performance：measure、mark</p><h3 id="安全" tabindex="-1"><a class="header-anchor" href="#安全" aria-hidden="true">#</a> 安全</h3><p>XSS：信任用户输入且输出到页面时未转义，恶意用户的script（也可能是img的onload等）被渲染到正常用户的页面上执行。1、转义。2、meta：Content-Security-Policy（限制资源来源、请求的）</p><p>CSRF：信任请求，第三方网站发起到cookie的本站请求。1、加上无法跨页获取的token(dom注入、setcookie手动取出)。2、cookie的SameSite</p><p>？？dom注入的话，外域可以先ajax请求页面（一般页面不会有限制？）拿到dom，再拿token去发出恶意api？？</p><p>SQL注入</p><p>DDoS</p><p>WAF</p><h3 id="模块化" tabindex="-1"><a class="header-anchor" href="#模块化" aria-hidden="true">#</a> 模块化</h3><p>ESM / CJS / AMD / CMD / UMD</p><h3 id="源码阅读" tabindex="-1"><a class="header-anchor" href="#源码阅读" aria-hidden="true">#</a> 源码阅读</h3><p>main/module</p><p>package.json scripts</p><p>main entry</p><p>submodule</p><h2 id="构建工具" tabindex="-1"><a class="header-anchor" href="#构建工具" aria-hidden="true">#</a> 构建工具</h2><h3 id="webpack" tabindex="-1"><a class="header-anchor" href="#webpack" aria-hidden="true">#</a> webpack</h3><h4 id="配置" tabindex="-1"><a class="header-anchor" href="#配置" aria-hidden="true">#</a> 配置</h4><p>多入口配置</p><p>loader作用，对特定文件编译，流式</p><p>plugin作用 ，全局作用，在complition不同阶段起作用</p><h4 id="实现代码分割" tabindex="-1"><a class="header-anchor" href="#实现代码分割" aria-hidden="true">#</a> 实现代码分割</h4><p>splitChunk：单页：用test提取公共文件，减小文件体积，配合chunkhash，浏览器缓存公共文件；多入口：用minChunks提取出多次引用的文件</p><p>ddl：ddl.config打包公共文件生成manifest，config引用这个manifest，不会对公共文件再次打包，提高编译速度</p><h4 id="defineplugin" tabindex="-1"><a class="header-anchor" href="#defineplugin" aria-hidden="true">#</a> definePlugin:</h4><p>一般用于定义一些全局字段，和p<wbr>rocess.env（模仿node环境）。</p><p>这些配置是在编译阶段静态直接转换，而非生成全局变量，比如模块中<code>p<wbr>rocess.env.NODE_ENV</code>编译后会直接被替换为定义的值，而<code>p<wbr>rocess.env[&#39;NODE&#39; + &#39;_ENV&#39;]</code>则不会</p><h4 id="loader" tabindex="-1"><a class="header-anchor" href="#loader" aria-hidden="true">#</a> loader</h4><p>webpack中使用loader：</p><pre><code>config = {
	entry: &#39;&#39;,
	output: {},
	module: {
		rules: [ // Rule[]
			{
				test: /xx.ext/,
				use: [ // Loader[]
					&#39;loader-a&#39;,
					{
						loader: &#39;loader-b&#39;,
						option: {},
						query: {},
					}
				]
			}
		]
	}
}
</code></pre><p>编译过程中遇到匹配某rule的test的文件，会使用rule的use中设置的loader（可以是多个loader，从后往前）来加载这个文件。loader从node_module里的对应loader名调用。</p><p>loader编写：</p><pre><code>module.export = function(content, map, meta) { 
	// do sth
	return newContent;
}
</code></pre><p>或者异步使用</p><pre><code>module.export = function(content, map, meta) { 
	// do sth
	this.callback(newContent);
}
</code></pre><p>babel-loader（文本loader）：</p><p>得到js文件的文本内容content，将其解析成ast，重新组织语法，再生成新的字符串newContent返回</p><p>file-loader（二进制loader）：</p><p>文件内容content为二进制数据。引用webpack自带的loader-utils库，调用其<code>interpolateName</code>方法得到其hash名，调用<code>this.emitFile</code>把二进制content生成新file输出到output指定的目录下，最终结合config中的publicPath得到新file的可访问路径，最终组合成<code>module.exports = fileOutputPath</code>格式的数据返回</p><h4 id="plugin" tabindex="-1"><a class="header-anchor" href="#plugin" aria-hidden="true">#</a> plugin</h4><p>plugin使用：</p><pre><code>	config = {
		entry: &#39;&#39;,
		output: {},
		plugins: [
			new SomePlugin(options),
		],
	}
</code></pre><p>plugin编写：</p><pre><code>class {
	constructor(options) {
		// 拿到用户定义的options
	}
	apply(compiler) {
		// 插件安装时调用一次，拿到compiler对象（提供webpack全局配置信息）
		// 可以从compiler的hooks回调拿到compilation对象（每次文件变动重新生成，提供本次资源相关信息）
		// 在compiler和compilation的各类hooks\b（基于tapable）绑定自定义事件
	}			
}
</code></pre><h3 id="rollup" tabindex="-1"><a class="header-anchor" href="#rollup" aria-hidden="true">#</a> rollup</h3><p>适合库而非应用（app），treeshaking，缺少懒加载</p><h3 id="webpack-rollup" tabindex="-1"><a class="header-anchor" href="#webpack-rollup" aria-hidden="true">#</a> webpack&amp;rollup</h3><p>treeshaking + 去除无用if代码</p><h3 id="gulp" tabindex="-1"><a class="header-anchor" href="#gulp" aria-hidden="true">#</a> gulp</h3><p>流式任务</p><h3 id="babel" tabindex="-1"><a class="header-anchor" href="#babel" aria-hidden="true">#</a> babel</h3><p>polyfill关系：babel只转语法，polyfill拓展原型和全局对象</p><p>原理：text =&gt; tokens =&gt; ast =&gt; ast(transformed) =&gt; text</p><p>browser版：监听DOMContentLoaded，选取所有<code>type=&quot;text/babel&quot;</code>（带src的ajax加载），编译结果新建script设置script.text后append到head</p><h2 id="html" tabindex="-1"><a class="header-anchor" href="#html" aria-hidden="true">#</a> HTML</h2><h3 id="input有哪些attribute" tabindex="-1"><a class="header-anchor" href="#input有哪些attribute" aria-hidden="true">#</a> input有哪些attribute</h3><h3 id="label作用" tabindex="-1"><a class="header-anchor" href="#label作用" aria-hidden="true">#</a> label作用</h3><h3 id="script标签-defer、async" tabindex="-1"><a class="header-anchor" href="#script标签-defer、async" aria-hidden="true">#</a> script标签 defer、async</h3><h3 id="blob-、dataurl" tabindex="-1"><a class="header-anchor" href="#blob-、dataurl" aria-hidden="true">#</a> blob 、dataURL</h3><h4 id="blob" tabindex="-1"><a class="header-anchor" href="#blob" aria-hidden="true">#</a> blob</h4><p>提供内存地址，数据保存在页面内存</p><p><code>new Blob([...data], {...options})</code> 自动垃圾回收</p><p><code>URL.createObjectURL(file)</code> 用URL.revokeObjectURL手动回收</p><h4 id="dataurl" tabindex="-1"><a class="header-anchor" href="#dataurl" aria-hidden="true">#</a> dataURL</h4><p>用编码（比如base64字符串）显式表示文件</p><p><code>new FileReader().readAsDataURL</code></p><h2 id="css" tabindex="-1"><a class="header-anchor" href="#css" aria-hidden="true">#</a> CSS</h2><h3 id="float、flex、gird" tabindex="-1"><a class="header-anchor" href="#float、flex、gird" aria-hidden="true">#</a> float、flex、gird</h3><h3 id="bfc" tabindex="-1"><a class="header-anchor" href="#bfc" aria-hidden="true">#</a> BFC</h3><p>独立容器，不影响外部</p><p>BFC：overflow: hidden / float: left / display: inline-block</p><p>特性：外部margin不合并/内部清除浮动（高度不塌陷）/外部清除浮动（文字不环绕）</p><h3 id="无限滚动的轮播图" tabindex="-1"><a class="header-anchor" href="#无限滚动的轮播图" aria-hidden="true">#</a> 无限滚动的轮播图</h3><h3 id="左边定宽右边自适应多种实现" tabindex="-1"><a class="header-anchor" href="#左边定宽右边自适应多种实现" aria-hidden="true">#</a> 左边定宽右边自适应多种实现</h3><p>flex、calc、absolute</p><h3 id="css变量" tabindex="-1"><a class="header-anchor" href="#css变量" aria-hidden="true">#</a> CSS变量</h3><h3 id="retina-画0-5px" tabindex="-1"><a class="header-anchor" href="#retina-画0-5px" aria-hidden="true">#</a> retina 画0.5px</h3><p>dpr（window.devicePixelRatio）+ <code>&lt;mete name=&quot;viewport&quot;/&gt;</code>(initial-scale)</p><h3 id="盒模型" tabindex="-1"><a class="header-anchor" href="#盒模型" aria-hidden="true">#</a> 盒模型</h3><h2 id="vue" tabindex="-1"><a class="header-anchor" href="#vue" aria-hidden="true">#</a> Vue</h2><h3 id="组件通信" tabindex="-1"><a class="header-anchor" href="#组件通信" aria-hidden="true">#</a> 组件通信</h3><p>prop</p><p>emit</p><p>bus、vuex等第三方数据管理库</p><p>watch</p><p>ref</p><p>broadcast+dispatch（vue1）</p><h3 id="生命周期" tabindex="-1"><a class="header-anchor" href="#生命周期" aria-hidden="true">#</a> 生命周期</h3><h3 id="vuex-数据流" tabindex="-1"><a class="header-anchor" href="#vuex-数据流" aria-hidden="true">#</a> vuex 数据流</h3><p>action异步，mutation同步</p><p>弊端：action意义不大</p><h3 id="nexttick" tabindex="-1"><a class="header-anchor" href="#nexttick" aria-hidden="true">#</a> $nextTick</h3><p>作用</p><p>可否用setTimeout替代</p><h3 id="v-if-v-show" tabindex="-1"><a class="header-anchor" href="#v-if-v-show" aria-hidden="true">#</a> v-if &amp; v-show</h3><p>用法，场景</p><h3 id="父调子" tabindex="-1"><a class="header-anchor" href="#父调子" aria-hidden="true">#</a> 父调子</h3><p>ref、props+watch</p><h3 id="实现tel格式的input-133-1234-1234" tabindex="-1"><a class="header-anchor" href="#实现tel格式的input-133-1234-1234" aria-hidden="true">#</a> 实现tel格式的input（133 1234 1234）</h3><h3 id="从data改变到view变化经历的过程" tabindex="-1"><a class="header-anchor" href="#从data改变到view变化经历的过程" aria-hidden="true">#</a> 从data改变到view变化经历的过程</h3><p>初始化 为obj每个属性建立getter/setter，挂载新dep</p><p>初次渲染 利用触发getter绑定watcher到dep</p><p>数据变化 setter触发dep中的watcher，watcher触发更新</p><p>更新 virtual dom，snabbdom diff，patch</p><h3 id="watcher和virtual-dom结合" tabindex="-1"><a class="header-anchor" href="#watcher和virtual-dom结合" aria-hidden="true">#</a> watcher和virtual dom结合</h3><p>vue1: 每条data一个watcher，绑定到data对应的dom，data变化直接更新到dom，粒度细 vue2的vdom：每条data一个watcher，每个组件也一个watcher，data只绑定到组件，data变化通知组件的watcher重新渲染，粒度适中</p><h3 id="runtime-with-compiler" tabindex="-1"><a class="header-anchor" href="#runtime-with-compiler" aria-hidden="true">#</a> runtime &amp; with-compiler</h3><h3 id="slots" tabindex="-1"><a class="header-anchor" href="#slots" aria-hidden="true">#</a> slots</h3><p>slot-scope用法（子：<code>&lt;slot name=&quot;a&quot; :params=&quot;params&quot;/&gt;</code>，父：<code>&lt;div slot=&quot;a&quot; slot-scope=&quot;p&quot;&gt;{{p}}&lt;/div&gt;</code>）</p><p>$slots返回值（render函数）</p><h3 id="css-scope" tabindex="-1"><a class="header-anchor" href="#css-scope" aria-hidden="true">#</a> css scope</h3><h3 id="mixins" tabindex="-1"><a class="header-anchor" href="#mixins" aria-hidden="true">#</a> mixins</h3><h3 id="vue-directive" tabindex="-1"><a class="header-anchor" href="#vue-directive" aria-hidden="true">#</a> Vue.directive</h3><h3 id="大列表优化" tabindex="-1"><a class="header-anchor" href="#大列表优化" aria-hidden="true">#</a> 大列表优化</h3><h3 id="ssr" tabindex="-1"><a class="header-anchor" href="#ssr" aria-hidden="true">#</a> SSR</h3><p>生命周期只执行到created且不能有浏览器独有api</p><p>###dom diff</p><p>基于snabbdom，头尾双指针，o(n)，牺牲对比精度换取时间(更贴近数组实际操作而非完全乱序)，有key的情况</p><h3 id="源码学习" tabindex="-1"><a class="header-anchor" href="#源码学习" aria-hidden="true">#</a> 源码学习</h3><h4 id="结构" tabindex="-1"><a class="header-anchor" href="#结构" aria-hidden="true">#</a> 结构</h4><p>core/instance 定义Vue，定义原型属性</p><p>core/globalAPI 定义静态属性</p><p>platform 平台化包装导出（runtime &amp; with-compiler）</p><p>core/lifecycle 初始化实例的生命周期，callHook</p><p>架构是随着项目发展调整的，commit记录</p><h4 id="dep-target" tabindex="-1"><a class="header-anchor" href="#dep-target" aria-hidden="true">#</a> dep.target</h4><p>正常：data监听setter和绑定dep，编译模板时AST解析调用了哪些data属性，去给它们添加dep</p><p>Vue：data还监听了getter，编译模板时会触发getter，getter里通过target判断是否处于编译中，是的话把target指向的watcher添加到对应的dep，编译前后会改写target</p><h4 id="nexttick-1" tabindex="-1"><a class="header-anchor" href="#nexttick-1" aria-hidden="true">#</a> nextTick</h4><p>（内部实现micro：Promise，macro：MessageChannel、setTimeout）</p><p>定义microFunc macroFunc</p><p>执行nextTick时，推入callbacks并触发一次（根据pending变量判断）在下轮执行flushCallbacks</p><p>flushCallbacks清空callbacks，依次执行callbacks（先清空来保证出现nextTick嵌套时的执行次序）</p><p>数据变动优先使用micro，可以在一轮事件循环内改变完data，只触发一次重渲染</p><h4 id="computed" tabindex="-1"><a class="header-anchor" href="#computed" aria-hidden="true">#</a> computed</h4><p>vue中的computed具有缓存和懒计算。</p><p>实现：</p><p>每个computed属性会建立一个watcher对应。</p><p>在被使用时（getter触发时）进入computedGetter，根据watcher.dirty的值 true/false 决定 重新计算/返回缓存。</p><p>第一次被使用时，默认watcher.dirty为true，触发computed计算，并收集计算中用到的依赖（把自身关联到依赖的watcher通知列表），并存下本次计算的value值。</p><p>当有依赖发生改动时，该computed的watcher.dirty会被设置为true，下次该computed被使用时就会被重新计算并缓存value，再把dirty重置为false。</p><h3 id="vue-react差异" tabindex="-1"><a class="header-anchor" href="#vue-react差异" aria-hidden="true">#</a> vue/react差异</h3><p>写法：webcomponent / all in js</p><p>MVC：数据层侵入 / 纯视图</p><p>数据管理：便捷的v-model、computed / 单向、immutable的数据流</p><p>库：官方库 简单 / 第三方库 灵活 复杂</p><h2 id="react" tabindex="-1"><a class="header-anchor" href="#react" aria-hidden="true">#</a> React</h2><p>###组件通信</p><p>prop,ref,context,数据管理(redux, mobx, rx)</p><p>###生命周期</p><p>新建： constructor -&gt; componentWillMount -&gt; render -&gt; componentDidMount</p><p>卸载：componentWillUnmount</p><p>更新：componentWillReceiveProps -&gt; shouldComponentUpdate-&gt; componentWillUpdate -&gt; render -&gt; componentDidUpdate</p><p>setState：shouldComponentUpdate-&gt; componentWillUpdate -&gt; render -&gt; componentDidUpdate</p><p>forceUpdate：componentWillUpdate -&gt; render -&gt; componentDidUpdate</p><h3 id="redux" tabindex="-1"><a class="header-anchor" href="#redux" aria-hidden="true">#</a> redux</h3><p>redux实现：</p><p>\bcombineReducers把多个reducer函数整合成一个大reducer函数，createStore(reducer)初始化store。</p><p>每次调用store.dispatch(action)，该action都会通过这个大reducer（相当于通过每个子reducer），来得到各部分的新state，最后整合得到大state。</p><p>结合react-redux：顶层state变化时，使用connect的组件会将它通过state\b\x1B获取到的props作前后浅比较，若有变化，该容器层props改变触发组件render，而非一有state变化就render</p><p>改进点？：action和reducer繁琐；action和reducer需要匹配自定义type来关联，而不是自动关联。</p><h3 id="fiber" tabindex="-1"><a class="header-anchor" href="#fiber" aria-hidden="true">#</a> fiber</h3><p>任务分片，任务优先级，基于requestIdleCallback、requestAnimationFrame</p><h3 id="context" tabindex="-1"><a class="header-anchor" href="#context" aria-hidden="true">#</a> context</h3><p>16.3前后api对比</p><p>解决：不符合分形、无法穿透shouldUpdateComponent</p><h3 id="hook" tabindex="-1"><a class="header-anchor" href="#hook" aria-hidden="true">#</a> hook</h3><h3 id="setstate" tabindex="-1"><a class="header-anchor" href="#setstate" aria-hidden="true">#</a> setState</h3><p>一次DOM reconciliation调用setState多次，state非立刻变化</p><p>transaction模型,batchedUpdates(ReactDOM.unstable_batchedUpdates)</p><p>###pureComponent</p><p>和普通component差异：</p><p>自动添加shouldUpdateComponent的判断，对变化前后的props和state进行浅比较返回bool，来决定要不要走render</p><h3 id="immutable" tabindex="-1"><a class="header-anchor" href="#immutable" aria-hidden="true">#</a> immutable</h3><p>优势：</p><p>命名：$$</p><p>一个有趣的现象：</p><pre><code>&lt;div&gt;
  {
    immutable.fromJS([{ a: 1 }, 2, 3]) // 渲染成a123
  }
&lt;/div&gt;
&lt;div&gt;
  {
    [{ a: 1 }, 2, 3] // 报错
  }
&lt;/div&gt;
</code></pre><p>因为渲染时递归判断元素是否为简单值（作为text节点渲染）？是否为ReactElement实例（作为原生DOM或者组件渲染）？是否为数组（是的话调用其<code>Symbol.iterator</code>得到其子集，继续对子集元素递归以上步骤）？都为否的话则无法渲染。 <code>{a: 1}</code>在immutable化后，是一个布署了iterator接口的Map，遍历结构类似<code>[[&quot;a&quot;, 1]]</code>，所以可以渲染成文本节点<code>a</code> 和<code>1</code>；而Object类型的<code>{a: 1}</code>则无法满足以上条件。</p><h2 id="测试" tabindex="-1"><a class="header-anchor" href="#测试" aria-hidden="true">#</a> 测试</h2><h3 id="e2e、unit" tabindex="-1"><a class="header-anchor" href="#e2e、unit" aria-hidden="true">#</a> e2e、unit</h3><p>karma、macha</p><h2 id="node" tabindex="-1"><a class="header-anchor" href="#node" aria-hidden="true">#</a> Node</h2><h3 id="进程模块" tabindex="-1"><a class="header-anchor" href="#进程模块" aria-hidden="true">#</a> 进程模块</h3><p>进程通信 exec：shell，一次性数据 spawn：stream管道，stdout fork：特殊的spawn（node），IPC管道，可用process.send(data)和process.on(&#39;message&#39;, callback)通信</p><h3 id="package-json" tabindex="-1"><a class="header-anchor" href="#package-json" aria-hidden="true">#</a> package.json</h3><h4 id="npm-install" tabindex="-1"><a class="header-anchor" href="#npm-install" aria-hidden="true">#</a> NPM install</h4><p><code>npm i</code>：安装pkg所有dependencies，devdependencies <code>npm i [module] [-S/-D]</code>：安装[module]到此目录下的node_modules并记录到pkg <code>-g</code>：安装到全局node_modules <code>npm uninstall [module] [-g]</code>：卸载</p><h4 id="scripts" tabindex="-1"><a class="header-anchor" href="#scripts" aria-hidden="true">#</a> scripts</h4><pre><code>scripts: {
  &quot;test&quot;: &quot;node bin/test.js --hot&quot;
}
</code></pre><p>通过<code>npm run test</code>来快捷执行<code>node bin/test.js --hot</code>，script中process.argvs读取命令行参数</p><h4 id="版本号" tabindex="-1"><a class="header-anchor" href="#版本号" aria-hidden="true">#</a> 版本号</h4><p><code>^1.2.3</code>：可兼容到1.x.x <code>~1.2.3</code>：可兼容到1.2.x</p><h4 id="bin" tabindex="-1"><a class="header-anchor" href="#bin" aria-hidden="true">#</a> bin</h4><p>shell方式运行，bin如下设置</p><pre><code>bin: {
  &quot;my-bin&quot;: &quot;bin/my-bin.js&quot;
}
</code></pre><p><code>my-bin.js</code>中的文件首行加上<code>#!/usr/bin/env node</code>表示以node环境运行</p><p>install之后，my-bin.js会被复制到<code>node_modules/.bin</code>下成为shell脚本，在cmd中直接<code>node_modules/.bin/my-bin [--params]</code>（或者全局安装后<code>my-bin [--params]</code>）来运行</p><h3 id="爬虫" tabindex="-1"><a class="header-anchor" href="#爬虫" aria-hidden="true">#</a> 爬虫</h3><p>历史、当前</p><h2 id="pwa" tabindex="-1"><a class="header-anchor" href="#pwa" aria-hidden="true">#</a> PWA</h2><p>对象：</p><p>作用域：sw.js相对路径下的client受控、该域同一时间只有一个sw</p><p>serviceWorker更新时机（检查sw，若改变则重新install）：页面初始化、手动reg.update()、触发了push等事件且24h未更新</p><p>skipWaiting：</p><p>不等老sw的client全部卸载，直接激活新sw</p><p>claim：</p><p>控制当前作用域还未被控制的client ？？</p><p>install：注册，一般cache在此时操作</p><p>active：激活</p><p>fetch：等sw active后才受控</p><p>缓存：</p><p>serviceWorker监听client的fetch，从cache判断命中</p><p>消息推送：</p><p>可视化消息</p><p>register返回registration对象，在此对象subscribe来注册</p><p>serviceWork监听push，调用registration的showNotification展示消息，client.postMessage推送给页面</p><h2 id="graphql" tabindex="-1"><a class="header-anchor" href="#graphql" aria-hidden="true">#</a> GraphQL</h2><p>query</p><pre><code>query {
  viewer { // 对象
    name, // string数据
    respos (first: 10, after: &quot;cursorString&quot;) { // 对象数据，需要另开connection，返回respo列表，first：列表数量；after：分页标记；以及其他支持的查询条件
      edges {
        cursor // 分页标记
        node { // 每条数据的结构
          name
        }
      }
      pageInfo { // 分页相关信息
        hasNextPage
      }
    } 
    respo (name: &quot;aaa&quot;) { // connection，返回指定name的respo或者null
      createdAt
    }
  }
}
variables { // 定义变量。在上面用$something使用
  &quot;something&quot;: {
    &quot;name&quot;: &quot;bbb&quot;
  }
}
</code></pre><p>mutation</p><h2 id="experience" tabindex="-1"><a class="header-anchor" href="#experience" aria-hidden="true">#</a> experience</h2><h4 id="产品、技术平衡" tabindex="-1"><a class="header-anchor" href="#产品、技术平衡" aria-hidden="true">#</a> 产品、技术平衡</h4><h4 id="推动技术、产品抽象" tabindex="-1"><a class="header-anchor" href="#推动技术、产品抽象" aria-hidden="true">#</a> 推动技术、产品抽象</h4><p>弹框</p><p>token</p><h4 id="项目架构、前后分离" tabindex="-1"><a class="header-anchor" href="#项目架构、前后分离" aria-hidden="true">#</a> 项目架构、前后分离</h4><p>背景：无leader、无架构、边尝试边修改</p><p>问题：每个系统重复搭建，且架构不一</p><p>改进：</p><p>基于vue/react+webpack抽象出通用系统模板，封装token、枚举值等，多套打包配置，及时改进</p><p>新增活动系统，按需打包，各项目隔离。cli启动，自定义webpack打包前后逻辑</p><p>思考：架构是让团队专注业务开发。适时改进，贴近业务</p><h4 id="团队分工" tabindex="-1"><a class="header-anchor" href="#团队分工" aria-hidden="true">#</a> 团队分工</h4><p>背景：历史原因，项目架构不一，放养不限制风格，人员固定</p><p>问题：项目风格个人化，别人不易接手</p><p>改进：制定代码规范，均匀分配需求，写技术文档</p><p>思考：</p><p>1、团队像项目，低耦合可拆卸，才能长远发展</p><p>2、制定一个没大错的规范比没有好</p><p>3、写的代码是给别人看的，对自己也是一种监督</p><p>4、分工有度，系统负责人，减少技术债</p><h4 id="开发流程" tabindex="-1"><a class="header-anchor" href="#开发流程" aria-hidden="true">#</a> 开发流程</h4><p>背景：开发规范、产品规范薄弱</p><p>问题：甩锅接口，prd过简，团队开发效率低，延期率高</p><p>改进：推进swagger+mock，推进产品规范（抽离通用组件，一致性），git workflow &amp; 自动化发布</p><p>思考：规范推动效率，充足的时间才能保证项目质量</p><h4 id="如何写基础组件" tabindex="-1"><a class="header-anchor" href="#如何写基础组件" aria-hidden="true">#</a> 如何写基础组件</h4><p>定义好输入=&gt;输出，中间的复杂变化交给代码</p><p>满足固定逻辑： 取舍有度，不能无限制灵活（table表格）</p><p>易拓展： 不仅是枚举出来的选项，只要满足规定就可用（slot、函数），给默认值 降低耦合性、抛出必要信息给外部业务处理（input联想输入里的http请求）</p><p>代码质量： 缓存优化、加载卸载</p><h2 id="加密" tabindex="-1"><a class="header-anchor" href="#加密" aria-hidden="true">#</a> 加密</h2><h3 id="rsa非对称加密" tabindex="-1"><a class="header-anchor" href="#rsa非对称加密" aria-hidden="true">#</a> RSA非对称加密</h3><h4 id="用法" tabindex="-1"><a class="header-anchor" href="#用法" aria-hidden="true">#</a> 用法</h4><p>密钥a：e（指数），n（模） 密钥b：d（指数），n（模）</p><p>用密钥a把M加密为C：C = M ** e (mod n) 用密钥b把C还原为M：M = C ** d (mod n)</p><p>也可以反过来用密钥b加密，密钥a还原，从数学上密钥a、b完全可以交换使用。但在实际运用中，一般会生成一个指数较小的（或者固定的）数作为公钥开放（客户端使用起来更方便），指数较大的数作为私钥。如果将它们交换，相当于用一个指数较小的数作为私钥，较容易被反推出来，不安全。</p><h4 id="密钥对生成" tabindex="-1"><a class="header-anchor" href="#密钥对生成" aria-hidden="true">#</a> 密钥对生成</h4><p>生成e，d，n过程：</p><p>1、选取两个足够大的素数：p、q</p><p>2、n = p * q</p><p>3、m = (p - 1) * (q - 1)</p><p>4、找一个与m互质的数e，且1 &lt; e &lt; m</p><p>5、找出d，使得d * e (mod m) = 1</p><p>6、生成完毕，密钥a：(e, n)，密钥b：(d, n)</p><h4 id="安全性" tabindex="-1"><a class="header-anchor" href="#安全性" aria-hidden="true">#</a> 安全性</h4><p>安全性是基于：大素数分解困难。在这个条件成立的前提下，通过已知的大素数n难以反推出p、q，所以也难以推出e、d，因此密钥a、b虽然可以相互加密解密，但算出另一密钥是困难的。</p><h4 id="例子" tabindex="-1"><a class="header-anchor" href="#例子" aria-hidden="true">#</a> 例子</h4><p>生成密钥对</p><p>1、选取两个素数 p = 3 ，q = 11（为方便举例选取了较小的素数）</p><p>2、n = p * q = 3 * 11 = 33</p><p>3、m = (p - 1) * (q - 1) = (3 - 1) * (11 - 1) = 20</p><p>4、从比m小的数中找出一个与m互质的数 e = 3</p><p>5、可以通过穷举法，d从1开始递增，试出满足条件的最小的d = 7</p><p>6、得出一对密钥：密钥a：(3, 33)，密钥b：(7, 33)</p><p>对&#39;rsa&#39;这个字符串加密</p><p>1、对‘rsa’进行数字化转化，&#39;r&#39;，‘s&#39;，’a&#39;可以转化成其对应字母表次序：18、19、1</p><p>2、用密钥a加密：</p><p>r =&gt; 18 =&gt; 18 ** 3 % 33 =&gt; 24</p><p>s =&gt; 19 =&gt; 19 ** 3 % 33 =&gt; 28</p><p>a =&gt; 1 =&gt; 1 ** 3 % 33 =&gt; 1</p><p>加密后：[&#39;r&#39;, &#39;s&#39;, &#39;a&#39;] =&gt; [24, 28, 1]</p><p>对加密后的[24, 28, 1]进行还原</p><p>1、用密钥b解密</p><p>24 =&gt; 24 ** 7 % 33 =&gt; 18 =&gt; r</p><p>28 =&gt; 28 ** 7 % 33 =&gt; 19 =&gt; s</p><p>1 =&gt; 1 ** 7 % 33 =&gt; 1 =&gt; a</p><p>得出结果&#39;rsa&#39;</p><h2 id="工程化" tabindex="-1"><a class="header-anchor" href="#工程化" aria-hidden="true">#</a> 工程化</h2><h3 id="规范、人员分工" tabindex="-1"><a class="header-anchor" href="#规范、人员分工" aria-hidden="true">#</a> 规范、人员分工</h3><h3 id="模块化-1" tabindex="-1"><a class="header-anchor" href="#模块化-1" aria-hidden="true">#</a> 模块化</h3><h3 id="自动化" tabindex="-1"><a class="header-anchor" href="#自动化" aria-hidden="true">#</a> 自动化</h3>`,435),n=[i];function h(p,o){return a(),t("div",null,n)}const s=e(d,[["render",h],["__file","tree.html.vue"]]);export{s as default};
