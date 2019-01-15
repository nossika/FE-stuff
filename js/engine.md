
## V8引擎

V8是google开源的JS引擎，由C++编写，被应用于Chrome、NodeJS等，其他JS引擎有Rhino、JavaScriptCore、Chakra等。

### 优化手段

- Just-In-Time编译

JS是弱类型动态语言，在源码生成AST以后，就开始边解释边执行，且因为变量类型不固定，运行时需边判断类型边操作，由此有了优化空间。

JIT加入**监视器**来分析代码片段的运行情况，如果某代码片段被执行次数越多，则对其进行越深层的优化。因为优化也需要代价，所以加入监视器来对优化收益更高的代码进行更多优化操作，以提高整体执行效率。

当某代码片段进入“warm”阶段，JIT对其进行**基线编译**并缓存，下次进入此代码片段时，如果变量类型没变，则直接使用这个编译后的版本来运行，节省再次执行解释的时间。

当某代码片段进入“hot”阶段，JIT会对其作更高效的**优化编译**，为此需要做一些假设（比如每次某变量使用的对象都有相同结构），针对这一假设再作优化程度更高的编译。如果某次执行中发现假设出错（比如对象结构变了），则放弃优化编译退回基线编译。如果代码片段多次从优化编译退回基线编译，则放弃对此片段的优化编译。

- 内联缓存

多个对象尽可能共用隐藏类，缓存各属性字段在内存中的偏移量，能加速属性提取

- 高效垃圾回收

### 垃圾回收原理

V8将内存划分为：

- 新生代区：大部分对象在此区，区域小但垃圾回收频繁
- 老生代区：从新生代晋升而来的生存周期长的对象
- 大对象区：占用空间较大的对象
- 代码区：唯一拥有执行权限的区域

#### 新生代区

采用复制算法（scavenge）做垃圾回收（GC）

内存空间分为两半---from区和to区，from区是处于使用状态的内存，新对象都会分配到from区，当GC开始时（如from区存满时），引擎会扫描出活跃对象（从root开始扫描，从root作BFS遍历其能访问的所有对象），复制到to区，这样to区就都为活跃对象，然后交换from区和to区内容，释放to区。

由于此区大部分对象是非活跃，所以复制操作代价小，空间上有一半是处于空置状态（to区），但因为此区空间本身就小，所以可以接受这种空置，牺牲空间带来的好处是只需要作一次复制遍历，而不用进行标记+清除两次遍历。

当此区的对象经过多次GC依然存活，说明其生命周期较长，对象会被移动到老生代区，此过程称为对象晋升。

#### 老生代区

采用标记-清除算法（mark-sweep）做GC

不再采用复制算法，因为此区空间较大，空置一半的空间太浪费，且大量活跃对象的复制代价大。此算法采用DFS遍历来标记活跃对象，标记结束后将非活跃对象（未被标记的对象）直接清除。

标记-清除操作会产生内存碎片（内存空间不连续），当空间不足时执行标记-整理算法（mark-compact）来整理内存。

## 事件循环

### 浏览器事件循环

主线程 + 事件队列

主线程是单线程，主线程在执行代码中，遇到异步操作（比如setTimeout/http请求等）时，会交给另外的线程处理（setTimeout交给定时器线程/http请求交给网络请求线程），当其他线程返回结果后，会将事件推入事件队列中，按先进先出原则待主线程处理。

主线程空闲时（一轮事件循坏结束），会从事件队列取出事件（如果有的话）加入执行栈执行（进入下轮事件循环）。如果再遇到异步操作，则重复上述行为。

> NodeJS中的事件循环略有不同，详见[【NodeJS/事件循环】](/node/loop)

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

两者都表示1s执行一次的循环，区别在于这个间隔1s，它在loop1中是本次`do sth.`执行完才触发下次计时，而loop2是一直在计时（因为计时器是单独的线程，不被主线程阻塞），一次计时完毕后立刻开始下一次。当`do sth.`耗时越高它们的行为差别越明显，setInterval可能连续多次触发`do sth.`。

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
	

	
