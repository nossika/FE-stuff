# 杂
[TOC]

## JS（ECMA）

### 数字转字符串 & 字符串转数字
number + "" / number.toString() / String(number)
+string / parseFloat(string) / Number(string)
隐式转换规则，调用to根据preferType调用toString() / valueOf()
Number() & new Number() : 为什么可以在基本属性上执行方法（比如(123).toString()）
### 隐式转换
toPrimitive(hint) hint：string/number/default

string mode: toString => valueOf => error
number mode: valueOf => toString => error


### 数组原型上的方法Array.prototype
影响原数组 / 返回新数组 / 遍历
find、findIndex(ES6)
includes(ES7)

### ES8
...Object
await let of

### Object

#### 禁止修改属性
Object.freeze
defineProperty writable
defineProperty set


###原型继承
instance(a)、prototype(protoA)、constructor(A)之间关系:

a ===> protoA:  Object.getPrototypeOf(a);
a ===> A:  a.constructor;
protoA ===> A:  protoA.constructor;
A ===> protoA:  A.prototype;
A ===> a: new A();


class extends 写法

###Promise错误处理
能否 try { new Promise(..); } catch() {} ？ 为何
对比
new Promise(...).then(data => {}, error => {})
new Promise(...).then(date => {}).catch(error => {})

### setTimeout & setInterval 处理循环
setInterval可能连续多次触发（定时推送，不管内部函数是否执行完毕，因为JS引擎和定时器是两个不同线程各自执行）


### esm、cjs
import：编译时导入（静态），值引用，只读；
require：运行时导入（动态），值拷贝
循环引用区别
import()动态，返回promise。

### AMD、CMD
AMD：依赖前置，requireJS
CMD：依赖就近，seaJS
浏览器中用法：type="module"

### 数字精度

JS中能转换成整数的值都会用整数来存储，小数在底层用 IEEE-754 双精度（64位）浮点数来存储。
64位：1符号位+11指数位+52有效数字位

小数x转化成二进制是用 x = 1/2\*a + 1/4\*b + 1/8\*c + 1/16\*d ... 中的abcd等因子来表示。
比如0.1 = 1/2\*0 + 1/4\*0 + 1/8\*0 + 1/16\*1 + 1/32\*1 + 1/64\*0  ... ，则0.1的二进制表示为00011001100...，去掉头部的0从1开始（头部的0可以在指数位表示），则有效数字部分为11001100...

因此大部分小数无法精确存储，除了0.5/0.125/0.375这类数字


### 手写函数
实现Array.prototype.reduce/String.prototype.indexOf/Function.prototype.bind


### 排序
方法 | 平均 | 最快 | 最慢 | 空间
:- | :-: | :-: | :-: | :-:
快排 | NlogN | N2 | NlogN | 1
冒泡 | N2 | N2 | N | 1
插入 | N2 | N2 | N | 1

### 尾调用优化
最后return一个函数，不依赖其他变量
递归会产生多层函数调用栈，优化后只有一层


##JS（DOM）

###addEventListener参数
冒泡、捕获，
阻止冒泡

### attribute操作，class操作

### 检测页面是否滚动到底部

### NodeList & HTMLCollection
Node.childNodes & Node.children
HTMLCollection不同：只包含elementNode（无textNode）、动态更新、namedItem方法

### CSSStyleDeclaration
CSSStyleDeclaration.setProperty('--color', 'red')

### repaint & reflow
repaint: transform/visibility/background

## JS（BOM）

### 区分pc/ios/android

## JS 引擎

###  V8
runtime优化

垃圾回收：
新生代（from/to，存活晋升）、老生代（标记清除、标记整理）、大对象、jit


### 事件循环
GUI渲染线程、JS主线程、定时器线程、http请求线程
setTimeout和Promise.then先后（macro、micro）

### WebWorker
Worker、SharedWorker（后者是独立进程，多tab页可共享一个）

## mobile

### flexible方案
通过dpr来设置根节点的font-size + viewport的scale，页面使用设计图尺寸转换得到的rem，完成一个设计图到多种屏幕的适配

## 浏览器

### 渲染

#### 过程
* style（确定每个节点应用的css规则）
* layout（reflow，重新计算各个节点位置）
* update layer tree（确定层叠顺序））（render layer）
* paint（计算节点绘制信息）
* composite（合成层）（graphics layer）
#### gpu加速
dom的绘制信息会被分成多个格栅上传gpu绘制

某些情况下节点会被单独升级为合成层（比如：transform、opacity、canvas标签、手动加上will-change、有个比自己index低的合成层时 等），浏览器会独立绘制各个合成层，最后再复合而成最终页面，合成层内的dom变动只需要重绘这个层，更高效。

结论：尽量用transform，合理利用will-change，把合成层的index尽可能高（避免自动创建不必要的合成层）


#### dom update 、 dom render
* dom update的修改和获取是实时的，dom render是非实时（一般在一轮循环中，task和microtask都执行完后render，不一定每轮，因为事件循环频率可能比浏览器帧率高）
* 所以vue使用promise.then来做dom更新，如果放在task里则下轮循环才更新
 
### 输入url => 页面展示
* 缓存查询
* dns
* 打开tcp（tcp/ip协议）
后台负载均衡
* browser主进程发起请求 => 结果转交给render进程（tab页进程）处理
浏览器多进程（主进程，tab页，GPU等），tab页多线程（js引擎、GUI渲染、http请求、定时器、事件调度等）

* 渲染（DOM树，CSS树，render树）
js解析会中断渲染（GUI渲染线程与js线程互斥）

## WEB

### http协议
基于tcp协议，req格式： `HTTP/1.1 /index.html GET\r\nConnection: keep-alive`，res格式：`HTTP/1.1 200 OK\r\nContent-type: text/plain\r\n\r\nsome text here`

1.1默认keep-alive，基于一次tcp（3次握手4次挥手）来发多次http请求
状态码12345
header(content-type/accept-encoding/user-agent/cookie & access-control-allow-origin/cache-control/e-tag/connection)
缓存控制
cookie
http2：二进制、多路复用、主动推送、头部压缩
https

### 前端缓存

#### 缓存位置：service worker、memory（关闭tab清空）、disk

#### 缓存顺序：
SW内的fetch方法也遵守此规则
强制缓存：cache-control(max-age)、expires
协商缓存：e-tag、last-modified

#### no-store
除了no-store的情况，当前页多次同一资源的请求（无论同步异步）只会从网络获取一次，其余都从memory获取（且不显示在network），如果no-store，则多少请求就获取多少次

### websocket
和http一样基于tcp，http协议的升级
tcp连接（连接实例称为socket）建立后，客户端发送http格式的报文`{ Connection: Upgrade, Upgrade: websocket, ... }`，服务端如果支持，也返回类似的确认报文，双方都对这个socket做好全双工通信的准备，即websocket连接建立。

### socket
套接字，可以理解为一个连接的实例，
比如说服务端客户端建立起一个tcp连接，那么两端各会有一个socket实例，可以对其调用各种方法来收发信息。

### 七层模型
应用：http
会话：ssl/tls
传输：tcp/udp
网络：ip

### 跨域
http header(cors)
iframe
jsonp

nginx转发



### 性能优化
定位：chrome的network、performance、memory

解决：
dns：cdn
缓存：response header、打包配置
文件粒度：打包配置
业务代码：结合框架特性
http2

window.performance：measure、mark


### 安全

XSS：信任用户输入且输出到页面时未转义，恶意用户的script（也可能是img的onload等）被渲染到正常用户的页面上执行。1、转义。2、meta：Content-Security-Policy（限制资源来源、请求的）

CSRF：信任请求，第三方网站发起到cookie的本站请求。1、加上无法跨页获取的token(dom注入、setcookie手动取出)。2、cookie的SameSite

？？dom注入的话，外域可以先ajax请求页面（一般页面不会有限制？）拿到dom，再拿token去发出恶意api？？

SQL注入

DDoS

WAF

### 模块化

ESM / CJS / AMD / CMD  / UMD



### 源码阅读
main/module
package.json scripts
main entry
submodule
## 构建工具

###webpack
####配置
多入口配置
loader作用，对特定文件编译，流式
plugin作用 ，全局作用，在complition不同阶段起作用

####实现代码分割
splitChunk：单页：用test提取公共文件，减小文件体积，配合chunkhash，浏览器缓存公共文件；多入口：用minChunks提取出多次引用的文件
ddl：ddl.config打包公共文件生成manifest，config引用这个manifest，不会对公共文件再次打包，提高编译速度

####definePlugin:

一般用于定义一些全局字段，和process.env（模仿node环境）。
这些配置是在编译阶段静态直接转换，而非生成全局变量，比如模块中`process.env.NODE_ENV`编译后会直接被替换为定义的值，而`process.env['NODE' + '_ENV']`则不会


#### loader

webpack中使用loader：

	config = {
		entry: '',
		output: {},
		module: {
			rules: [ // Rule[]
				{
					test: /xx.ext/,
					use: [ // Loader[]
						'loader-a',
						{
							loader: 'loader-b',
							option: {},
							query: {},
						}
					]
				}
			]
		}
	}

编译过程中遇到匹配某rule的test的文件，会使用rule的use中设置的loader（可以是多个loader，从后往前）来加载这个文件。loader从node_module里的对应loader名调用。

loader编写：

	module.export = function(content, map, meta) { 
		// do sth
		return newContent;
	}
	
或者异步使用
	
	module.export = function(content, map, meta) { 
		// do sth
		this.callback(newContent);
	}

babel-loader（文本loader）：

得到js文件的文本内容content，将其解析成ast，重新组织语法，再生成新的字符串newContent返回

file-loader（二进制loader）：

文件内容content为二进制数据。引用webpack自带的loader-utils库，调用其`interpolateName`方法得到其hash名，调用`this.emitFile`把二进制content生成新file输出到output指定的目录下，最终结合config中的publicPath得到新file的可访问路径，最终组合成`module.exports = fileOutputPath`格式的数据返回

#### plugin

plugin使用：

		config = {
			entry: '',
			output: {},
			plugins: [
				new SomePlugin(options),
			],
		}

plugin编写：

	class {
		constructor(options) {
			// 拿到用户定义的options
		}
		apply(compiler) {
			// 插件安装时调用一次，拿到compiler对象（提供webpack全局配置信息）
			// 可以从compiler的hooks回调拿到compilation对象（每次文件变动重新生成，提供本次资源相关信息）
			// 在compiler和compilation的各类hooks（基于tapable）绑定自定义事件
		}			
	}


### rollup
适合库而非应用（app），treeshaking，缺少懒加载
### webpack&rollup
treeshaking + 去除无用if代码

### gulp
流式任务
### babel
polyfill关系：babel只转语法，polyfill拓展原型和全局对象
原理：text => tokens => ast => ast(transformed) => text
browser版：监听DOMContentLoaded，选取所有`type="text/babel"`（带src的ajax加载），编译结果新建script设置script.text后append到head
##HTML

###input有哪些attribute

###label作用

### script标签 defer、async

### blob 、dataURL
####blob
提供内存地址，数据保存在页面内存
`new Blob([...data],  {...options})` 自动垃圾回收
`URL.createObjectURL(file)` 用URL.revokeObjectURL手动回收

####dataURL
用编码（比如base64字符串）显式表示文件
`new FileReader().readAsDataURL`




##CSS

###float、flex、gird
### BFC
独立容器，不影响外部
BFC：overflow: hidden / float: left / display: inline-block
特性：外部margin不合并/内部清除浮动（高度不塌陷）/外部清除浮动（文字不环绕）

### 无限滚动的轮播图
### 左边定宽右边自适应多种实现
flex、calc、absolute
### CSS变量
### retina 画0.5px
dpr（window.devicePixelRatio）+ `<mete name="viewport"/>`(initial-scale)
### 盒模型

##Vue

###组件通信
prop
emit
bus、vuex等第三方数据管理库
watch
ref
broadcast+dispatch（vue1）
###生命周期
### vuex 数据流

action异步，mutation同步

弊端：action意义不大

### $nextTick
作用
可否用setTimeout替代

### v-if & v-show
用法，场景
### 父调子
ref、props+watch
### 实现tel格式的input（133 1234 1234）
### 从data改变到view变化经历的过程
初始化 为obj每个属性建立getter/setter，挂载新dep

初次渲染 利用触发getter绑定watcher到dep

数据变化 setter触发dep中的watcher，watcher触发更新

更新 virtual dom，snabbdom diff，patch



### watcher和virtual dom结合

vue1: 每条data一个watcher，绑定到data对应的dom，data变化直接更新到dom，粒度细
vue2的vdom：每条data一个watcher，每个组件也一个watcher，data只绑定到组件，data变化通知组件的watcher重新渲染，粒度适中

### runtime & with-compiler

### slots
slot-scope用法（子：`<slot name="a" :params="params"/>`，父：`<div slot="a" slot-scope="p">{{p}}</div>`）
$slots返回值（render函数）
###css scope
### mixins
### Vue.directive
### 大列表优化 
### SSR
生命周期只执行到created且不能有浏览器独有api
###dom diff
基于snabbdom，头尾双指针，o(n)，牺牲对比精度换取时间(更贴近数组实际操作而非完全乱序)，有key的情况

### 源码学习

#### 结构
core/instance 定义Vue，定义原型属性
core/globalAPI 定义静态属性
platform 平台化包装导出（runtime & with-compiler）

core/lifecycle  初始化实例的生命周期，callHook

架构是随着项目发展调整的，commit记录



#### dep.target
正常：data监听setter和绑定dep，编译模板时AST解析调用了哪些data属性，去给它们添加dep
Vue：data还监听了getter，编译模板时会触发getter，getter里通过target判断是否处于编译中，是的话把target指向的watcher添加到对应的dep，编译前后会改写target

#### nextTick
（内部实现micro：Promise，macro：MessageChannel、setTimeout）

定义microFunc macroFunc
执行nextTick时，推入callbacks并触发一次（根据pending变量判断）在下轮执行flushCallbacks
flushCallbacks清空callbacks，依次执行callbacks（先清空来保证出现nextTick嵌套时的执行次序）

数据变动优先使用micro，可以在一轮事件循环内改变完data，只触发一次重渲染

#### computed
vue中的computed具有缓存和懒计算。

实现：
每个computed属性会建立一个watcher对应。
在被使用时（getter触发时）进入computedGetter，根据watcher.dirty的值 true/false 决定 重新计算/返回缓存。

第一次被使用时，默认watcher.dirty为true，触发computed计算，并收集计算中用到的依赖（把自身关联到依赖的watcher通知列表），并存下本次计算的value值。
当有依赖发生改动时，该computed的watcher.dirty会被设置为true，下次该computed被使用时就会被重新计算并缓存value，再把dirty重置为false。

### vue/react差异
写法：webcomponent / all in js
MVC：数据层侵入 / 纯视图
数据管理：便捷的v-model、computed / 单向、immutable的数据流
库：官方库 简单 / 第三方库 灵活 复杂


## React
###组件通信
prop,ref,context,数据管理(redux, mobx, rx)
###生命周期
新建： constructor -> componentWillMount -> render -> componentDidMount
卸载：componentWillUnmount
更新：componentWillReceiveProps -> shouldComponentUpdate-> componentWillUpdate -> render -> componentDidUpdate
setState：shouldComponentUpdate-> componentWillUpdate -> render -> componentDidUpdate
forceUpdate：componentWillUpdate -> render -> componentDidUpdate

### redux

redux实现：
combineReducers把多个reducer函数整合成一个大reducer函数，createStore(reducer)初始化store。
每次调用store.dispatch(action)，该action都会通过这个大reducer（相当于通过每个子reducer），来得到各部分的新state，最后整合得到大state。

结合react-redux：顶层state变化时，使用connect的组件会将它通过state获取到的props作前后浅比较，若有变化，该容器层props改变触发组件render，而非一有state变化就render

改进点？：action和reducer繁琐；action和reducer需要匹配自定义type来关联，而不是自动关联。

### fiber
任务分片，任务优先级，基于requestIdleCallback、requestAnimationFrame

### context
16.3前后api对比
解决：不符合分形、无法穿透shouldUpdateComponent

### hook

### setState
一次DOM reconciliation调用setState多次，state非立刻变化
transaction模型,batchedUpdates(ReactDOM.unstable_batchedUpdates)

###pureComponent
和普通component差异：
自动添加shouldUpdateComponent的判断，对变化前后的props和state进行浅比较返回bool，来决定要不要走render

### immutable
优势：

命名：$$

一个有趣的现象：

	<div>
	  {
	    immutable.fromJS([{ a: 1 }, 2, 3]) // 渲染成a123
	  }
	</div>
	<div>
	  {
	    [{ a: 1 }, 2, 3] // 报错
	  }
	</div>

因为渲染时递归判断元素是否为简单值（作为text节点渲染）？是否为ReactElement实例（作为原生DOM或者组件渲染）？是否为数组（是的话调用其`Symbol.iterator`得到其子集，继续对子集元素递归以上步骤）？都为否的话则无法渲染。
`{a: 1}`在immutable化后，是一个布署了iterator接口的Map，遍历结构类似`[["a", 1]]`，所以可以渲染成文本节点`a` 和`1`；而Object类型的`{a: 1}`则无法满足以上条件。








## 测试
### e2e、unit
karma、macha

## Node
### 进程模块
进程通信
exec：shell，一次性数据
spawn：stream管道，stdout
fork：特殊的spawn（node），IPC管道，可用process.send(data)和process.on('message', callback)通信
 
###   package.json
#### NPM install
`npm i`：安装pkg所有dependencies，devdependencies
`npm i [module] [-S/-D]`：安装[module]到此目录下的node_modules并记录到pkg
`-g`：安装到全局node_modules
`npm uninstall [module] [-g]`：卸载
#### scripts
	
	scripts: {
	  "test": "node bin/test.js --hot"
	}

通过`npm run test`来快捷执行`node bin/test.js --hot`，script中process.argvs读取命令行参数
	
#### 版本号
`^1.2.3`：可兼容到1.x.x
`~1.2.3`：可兼容到1.2.x
#### bin 
shell方式运行，bin如下设置

	bin: {
	  "my-bin": "bin/my-bin.js"
	}

`my-bin.js`中的文件首行加上`#!/usr/bin/env node`表示以node环境运行

install之后，my-bin.js会被复制到`node_modules/.bin`下成为shell脚本，在cmd中直接`node_modules/.bin/my-bin [--params]`（或者全局安装后`my-bin [--params]`）来运行


### 爬虫
历史、当前

## PWA

对象：

作用域：sw.js相对路径下的client受控、该域同一时间只有一个sw
serviceWorker更新时机（检查sw，若改变则重新install）：页面初始化、手动reg.update()、触发了push等事件且24h未更新

skipWaiting：
不等老sw的client全部卸载，直接激活新sw
claim：
控制当前作用域还未被控制的client ？？
install：注册，一般cache在此时操作
active：激活
fetch：等sw active后才受控


缓存：
serviceWorker监听client的fetch，从cache判断命中

消息推送：
可视化消息
register返回registration对象，在此对象subscribe来注册
serviceWork监听push，调用registration的showNotification展示消息，client.postMessage推送给页面

## GraphQL

query

	query {
	  viewer { // 对象
	    name, // string数据
	    respos (first: 10, after: "cursorString") { // 对象数据，需要另开connection，返回respo列表，first：列表数量；after：分页标记；以及其他支持的查询条件
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
        respo (name: "aaa") { // connection，返回指定name的respo或者null
          createdAt
        }
	  }
	}
	variables { // 定义变量。在上面用$something使用
	  "something": {
        "name": "bbb"
	  }
	}

mutation

## experience

#### 产品、技术平衡

#### 推动技术、产品抽象
弹框
token

#### 项目架构、前后分离
背景：无leader、无架构、边尝试边修改
问题：每个系统重复搭建，且架构不一
改进：
基于vue/react+webpack抽象出通用系统模板，封装token、枚举值等，多套打包配置，及时改进
新增活动系统，按需打包，各项目隔离。cli启动，自定义webpack打包前后逻辑
思考：架构是让团队专注业务开发。适时改进，贴近业务

#### 团队分工
背景：历史原因，项目架构不一，放养不限制风格，人员固定
问题：项目风格个人化，别人不易接手
改进：制定代码规范，均匀分配需求，写技术文档

思考：
1、团队像项目，低耦合可拆卸，才能长远发展
2、制定一个没大错的规范比没有好
3、写的代码是给别人看的，对自己也是一种监督
4、分工有度，系统负责人，减少技术债

#### 开发流程
背景：开发规范、产品规范薄弱
问题：甩锅接口，prd过简，团队开发效率低，延期率高
改进：推进swagger+mock，推进产品规范（抽离通用组件，一致性），git workflow & 自动化发布
思考：规范推动效率，充足的时间才能保证项目质量

#### 如何写基础组件
定义好输入=>输出，中间的复杂变化交给代码

满足固定逻辑：
取舍有度，不能无限制灵活（table表格）

易拓展：
不仅是枚举出来的选项，只要满足规定就可用（slot、函数），给默认值
降低耦合性、抛出必要信息给外部业务处理（input联想输入里的http请求）

代码质量：
缓存优化、加载卸载


## 加密

### RSA非对称加密

#### 用法

密钥a：e（指数），n（模）
密钥b：d（指数），n（模）

用密钥a把M加密为C：C = M ** e (mod n)
用密钥b把C还原为M：M = C ** d (mod n)

也可以反过来用密钥b加密，密钥a还原，从数学上密钥a、b完全可以交换使用。但在实际运用中，一般会生成一个指数较小的（或者固定的）数作为公钥开放（客户端使用起来更方便），指数较大的数作为私钥。如果将它们交换，相当于用一个指数较小的数作为私钥，较容易被反推出来，不安全。

#### 密钥对生成

生成e，d，n过程：
1、选取两个足够大的素数：p、q
2、n = p * q
3、m = (p - 1) * (q - 1)
4、找一个与m互质的数e，且1 < e < m
5、找出d，使得d * e (mod m) = 1
6、生成完毕，密钥a：(e, n)，密钥b：(d, n)

#### 安全性

安全性是基于：大素数分解困难。在这个条件成立的前提下，通过已知的大素数n难以反推出p、q，所以也难以推出e、d，因此密钥a、b虽然可以相互加密解密，但算出另一密钥是困难的。

#### 例子

生成密钥对
1、选取两个素数 p = 3 ，q = 11（为方便举例选取了较小的素数）
2、n = p * q = 3 * 11 = 33
3、m = (p - 1) * (q - 1) = (3 - 1) * (11 - 1) = 20
4、从比m小的数中找出一个与m互质的数 e = 3
5、可以通过穷举法，d从1开始递增，试出满足条件的最小的d = 7
6、得出一对密钥：密钥a：(3, 33)，密钥b：(7, 33)

对'rsa'这个字符串加密
1、对‘rsa’进行数字化转化，'r'，‘s'，’a'可以转化成其对应字母表次序：18、19、1
2、用密钥a加密：
r => 18 => 18 ** 3 % 33 => 24
s => 19 => 19 ** 3 % 33 => 28
a => 1 => 1 ** 3 % 33 => 1
加密后：['r', 's', 'a'] => [24, 28, 1]

对加密后的[24, 28, 1]进行还原
1、用密钥b解密
24 => 24 ** 7 % 33 => 18 => r
28 => 28 ** 7 % 33 => 19 => s
1 => 1 ** 7 % 33 => 1 => a
得出结果'rsa'

## 工程化

### 规范、人员分工

### 模块化

### 自动化


