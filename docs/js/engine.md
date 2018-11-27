
# JS 引擎相关

###  V8

runtime优化

垃圾回收：

新生代（from/to，存活晋升）、老生代（标记清除、标记整理）、大对象、jit


### 事件循环

GUI渲染线程、JS主线程、定时器线程、http请求线程

setTimeout和Promise.then先后（macro、micro）

### WebWorker

Worker、SharedWorker（后者是独立进程，多tab页可共享一个）

	
### task & microTask

	function repeat () {
	  Promise.resovle().then(repeat);
	}
	
	setTimeout(() => {
	  console.log('setTimeout');
	}, 1000);
	
	repeat();
	
	// 'setTimeout'永远不会被打印，因为无限执行microTask，不会进入下个task
		
		
如果改成
		
	function repeat () {
	  setTimeout(repeat);
	}
	
	setTimeout(() => {
	  console.log('setTimeout');
	}, 1000);
	
	repeat();
	
	// 'setTimeout'会被打印
		
事件循环顺序: task ( begin -> stack -> microtask -> end ) => nextTask ( begin -> stack -> microtask -> end ) => nextTask (...) => ...

task类型: setTimeout, MessageChannel

microTask类型: Promise, MutationObserver
	
