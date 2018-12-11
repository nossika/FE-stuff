
# JS 引擎相关

##  V8

### runtime优化

### 垃圾回收

新生代（from/to，存活晋升）、老生代（标记清除、标记整理）、大对象、jit

## 事件循环

### 事件循环模型 

主线程 + 事件队列

主线程是单线程，主线程在执行代码中，遇到异步操作（比如setTimeout/http请求等）时，会交给另外的线程处理（setTimeout交给定时器线程/http请求交给网络请求线程），当其他线程返回结果后，会将事件推入事件队列中，按先进先出原则待主线程处理。

主线程空闲时（一轮事件循坏结束），会从事件队列取出事件（如果有的话）加入执行栈执行（进入下轮事件循环）。如果再遇到异步操作，则重复上述行为。

### task/microTask

事件循环中有task和microTask的概念

	function repeat() {
	  Promise.resovle().then(repeat);
	}
	
	setTimeout(() => {
	  console.log('setTimeout');
	}, 1000);
	
	repeat();
		
		// 'setTimeout'永远不会被打印，因为无限执行microTask，不会进入下个loop
		
如果改成
		
	function repeat() {
	  setTimeout(repeat);
	}
	
	setTimeout(() => {
	  console.log('setTimeout');
	}, 1000);
	
	repeat();
	
	// 'setTimeout'会被打印
		
执行顺序

loop ( 一轮循环开始 -> task -> microTask -> 一轮循环结束 ) => nextLoop ( 一轮循环开始 -> task -> microTask -> 一轮循环结束 ) => nextLoop => ...

task类型: setTimeout, MessageChannel

microTask类型: Promise, MutationObserver

#### setTimeout/setInterval

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

两者都表示1s执行一次的循环，区别在于这个间隔1s，它在setTimeout的例子中是本次`do sth.`执行完才触发下次计时，而setInterval的例子是一直在计时（因为计时器是单独的线程，不被主线程阻塞），一次计时完毕后立刻开始下一次。当`do sth.`耗时越高它们的行为差别越明显，setInterval可能连续多次触发。

### WebWorker

#### Worker

用法：

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

Worker会独立开启一个线程执行，不占用主线程资源，post出来的数据推入事件队列待主线程处理。

#### SharedWorker

用法同Worker，区别在于SharedWorker是独立进程，多tab页可共享一个
	

	
