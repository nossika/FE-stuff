# 单线程的JS

## 几个基本概念

### 进程和线程
		
进程是系统分配资源的最小单位，线程是系统运算和调度的最小单位。一个进程内可有单或多个线程，进程和线程都由操作系统管理。

通俗点说就是系统把内存资源分配给各进程，得到执行程序的空间，进程中的各线程再使用CPU资源，来实际执行程序。

进程切换消耗比线程切换大，涉及虚拟内存地址的转换。因为每个进程都有专属的、地址连续的内存空间，这块内存是由操作系统抽象给进程的，称为虚拟内存，可通过页表映射到物理内存。

### 协程

协程是更轻量的运算单位，由**程序**基于线程去创建和调度（一般在语言层实现，比如go、python等），操作系统对协程的存在无感知。可能是一个线程对应多个协程，也可能是多个线程对应多个协程，协程间的切换可以不依赖线程切换，取决于程序的设计。

go语言的协程，栈空间在KB级，而线程的栈空间一般在MB级。

### 并发、并行

并发是**一定时间段内**完成多条指令。比如有3个耗时0.5s的运算，程序通过资源调度在0.6s内完成了这3个原本总和需要1.5s的运算，称为并发。浏览器中，JS的事件循环通过对多线程的调度即可实现并发。

并行是**同一时间点**有多条指令在同时执行，所以其前提必须是多核CPU。NodeJS中可以通过cluster模块来利用多核CPU实现并行。


## 多进程的浏览器

浏览器一般是多进程的应用。以chrome为例

包含进程有（shift+esc可查看）：
* 浏览器主进程
* GPU进程：GPU加速
* tab页进程：每个tab页对应一个进程
* 扩展程序（第三方插件）进程

页面进程中又包含多个线程：
* JS引擎线程
* GUI渲染线程：DOM渲染
* 事件控制线程：实现event loop
* 定时触发器线程：setTimeout、setInterval等计时器
* 网络请求线程：如http请求
* webWorker线程（sharedWorker线程归属浏览器主进程）

JS线程与GUI线程互斥（一个执行时另一个会被挂起），因为JS可以读取DOM的渲染数据，须保证读取到的数据准确。浏览器一般在JS线程空闲时执行layout&paint，如果在JS线程执行中触发layout，JS线程会阻塞，等其执行完毕再继续。

> 渲染相关详见[【页面渲染】](/htmlcss/render.html)。


## 事件循环

### 浏览器的事件循环


JS本身是单线程，但执行JS的环境不是。宿主一般会有JS主线程、调度线程、网络请求线程等多个线程配合来运行程序，所以单线程的JS能实现非阻塞。

浏览器中以事件循环模型来运行JS，如下图：

![event loop](../resources/event-loop/browser.png)

事件循环模型包含执行栈（JS stack）和事件队列（event queue），由调度线程来控制整体的调度。执行栈即JS主线程，在主线程运行中，一旦遇到异步操作（比如setTimeout/http请求等）时，会交给另外的线程处理（比如setTimeout交给定时器线程、http请求交给网络请求线程），当其他线程返回结果后，调度线程会将事件推入事件队列中，按先进先出原则待主线程处理。

每一轮循环称为一个task，每轮循环的末尾还会检查并执行微任务（micro task queue）队列。

主线程空闲时（即一轮事件循坏结束），会从事件队列取出事件（如果有的话）加入执行栈执行（即进入下轮事件循环）。如果执行栈再遇到异步操作，则重复上述调度行为。


> NodeJS中的事件循环略有不同，详见[【事件循环（NodeJS）】](/node/loop.html)



### task/microTask

事件循环中有task和microTask的概念

```js
function repeat() {
	Promise.resovle().then(repeat);
}

setTimeout(() => {
	console.log('setTimeout');
}, 1000);

repeat();
	
// 'setTimeout'永远不会被打印，因为无限执行microTask，不会进入下个loop
```
		
如果改成

```js	
function repeat() {
	setTimeout(repeat);
}

setTimeout(() => {
	console.log('setTimeout');
}, 1000);

repeat();

// 'setTimeout'会被打印
```		

执行顺序

loop ( 一轮循环开始 -> task -> microTask -> 一轮循环结束 ) => nextLoop ( 一轮循环开始 -> task -> microTask -> 一轮循环结束 ) => nextLoop => ...

task类型: setTimeout, MessageChannel

microTask类型: Promise, MutationObserver

#### setTimeout/setInterval

```js
function loop1() {
	// do sth.
	setTimeout(loop1, 1000);
}

loop1();

function loop2() {
	setInterval(() => {
		// do sth.
	}, 1000);
}

loop2();
```

两者都表示1s执行一次的循环，区别在于这个间隔1s，它在loop1中是本次`do sth.`执行完才触发下次计时，而loop2是一直在计时（因为计时器是单独的线程，不被主线程阻塞），一次计时完毕后立刻开始下一次。当`do sth.`耗时越高它们的行为差别越明显，setInterval可能连续多次触发`do sth.`。

### WebWorker

#### Worker

用法：

```js
// main.js
const worker = new Worker('./worker.js');
worker.postMessage('main msg');
worker.onmessage(msg => {
	msg; // 'worker msg'
	// workder.terminate();  
});

// worker.js
onmessage = msg => {
	msg; //  'main msg'
	postMessage('worker msg');
}
```

Worker会独立开启一个线程执行，不占用主线程资源，post出来的数据推入事件队列待主线程处理。

#### SharedWorker

用法同Worker，区别在于SharedWorker是独立进程，多tab页可共享一个
	