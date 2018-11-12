	
	
## task & microTask

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
	
## React中的setState异步

	
	class Comp extends React.Component {
	  state = {
	    count: 1,
	  };
	  componentWillMount () {
	    console.log(this.state.count); // 1
	    this.setState({
	      count: this.state.count + 1,
	    });
	    console.log(this.state.count); // 1
	    this.setState({
	      count: this.state.count + 1,
	    });
	    console.log(this.state.count); // 1
	  }
	  render () {
	    return null;
	  }
	}

	ReactDOM.render(<Comp/>, document.querySelector('#app'));
	
大家都知道以上打印结果是因为setState是异步执行，但是如果把setState放到组件外
	
	class Comp extends React.Component {
	  state = {
	    count: 1,
	  };
	  componentWillMount () {
	    window.comp = this;
	  }
	  render () {
	    return null;
	  }
	}

	ReactDOM.render(<Comp/>, document.querySelector('#app'));
	
	setTimeout(() => {
	  console.log(comp.state.count); // 1
	  comp.setState({
	    count: comp.state.count + 1,
	  });
	  console.log(comp.state.count); // 2
	  comp.setState({
	    count: comp.state.count + 1,
	  });
	  console.log(comp.state.count); // 3
	});

修改后的代码state的结果变了，setState似乎变成了同步执行。

这是因为组件初始化时，React对其内部的函数都进行了一层**包装**，变成 initialize => perform（你自己写的代码） => close 的形式，这个起止过程就是一个**transaction**。调用setState时如果发现正**处于transaction中**，它并不会立即修改state，而是推到一个缓存数组中，在close时一并执行，造成异步的效果。而如果把这段代码放到React组件外部就失去了transaction封装，从而使setState一执行就立即修改state。

可以通过Reace提供的batchedUpdates手动包装一个transaction

	class Comp extends React.Component {
	  state = {
	    count: 1,
	  };
	  componentWillMount () {
	    window.comp = this;
	  }
	  render () {
	    return null;
	  }
	}

	ReactDOM.render(<Comp/>, document.querySelector('#app'));
	
	setTimeout(() => {
	  ReactDOM.unstable_batchedUpdates(() => {
	    console.log(comp.state.count); // 1
	    comp.setState({
	      count: comp.state.count + 1,
	    });
	    console.log(comp.state.count); // 1
	    comp.setState({
	      count: comp.state.count + 1,
	    });
	    console.log(comp.state.count); // 1	  
	  });
	});

这样就回到了大家熟悉的结果。

顺带一提，这种对函数加层包装使其处于特殊环境中执行的做法，在vue中也有运用，比如vuex中的_withCommit，用于判断state的修改是来自mutation还是外部直接修改。
	

## babel如何在浏览器运行？（https://unpkg.com/babel-standalone@6.26.0/babel.js）

1. 监听`DOMContentLoaded`事件，事件触发后会选取所有`type`为`text/jsx`和`text/babel`的`script`存入jsxScripts数组。
2. 遍历数组，将`scriptEl.innerHTML`作为源码调用babel核心方法编译为结果代码（带`src`的`script`用ajax异步获取content作为源码，在回调中处理编译）。
3. 编译完成后新建`script`元素，将`scriptEl.text`设置为结果代码，`append`到`headEl`，此时浏览器会自动执行该`script`。
	
	
	
## 为什么 `Object instanceof Function` 和 `Function instanceof Object` 都返回 `true` ？

先理解一下 `instanceof` 这个操作符， 它会沿着前者的 `__proto__` 链寻找是否存在后者的 `prototype` ，若找到就返回 `true` ，若 `__proto__` 链遍历完还是没找到就返回 `false` 。

然后还需要知道这几个点：所有函数的都是 `Function` 的实例，包括 `Function` 函数； `Function.prototype` 是 `Object` 的实例。

现在来看下问题中的 `Object instanceof Function` ，因为所有函数的都是 `Function` 的实例，`Object`虽然是一个构造函数，但也是函数，所以 `Object.__proto__` 等于 `Function.prototype` ，返回结果 `true` 。

再看 `Function instanceof Object` ，`Function`也是一个函数，它的原型（`Function.__proto__`）是 `Function.prototype` ,   `Function.prototype.__proto__` 是 `Object.prototype`，即 `Function.__proto__.__proto__ === Object.prototype` ，所以也返回 `true` 。

## \__proto__ & constructor

	function A () {};
	function B () {};
	const a = new A();
	B.prototype = a;
	const b = new B();

	b.constructor; // A

	b.__proto__; // a
	b.__proto__.__proto__; // A.prototype
	b.__proto__.__proto__.constructor; // A

改变执行顺序
	
	function A () {};
	function B () {};
	const a = new A();
	const b = new B();
	B.prototype = a;

	b.constructor; // B

	b.__proto__; // B.prototype (被改写之前的那个prototype)
	b.__proto__.constructor; // B

ES6 class

	class A {};
	class B extends A {};
	const b = new B();

	b.constructor; // B

	b.__proto__ // B.prototype (已包含了constructor信息)
	b.__proto__.constructor // B
	
	
## 浏览器中的进程与线程
		
进程是CPU分配资源的最小单位，线程是CPU调度的最小单位。一个进程内可有单或多个线程。

浏览器一般是多进程。以chrome为例

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

JS线程与GUI线程互斥（一个执行时另一个会被挂起），以保证JS中获取的DOM是最新的。

## with的隐式调用
	
	const proxy = new Proxy({}, {
	  get () { return 1; }
	});
	proxy.a; // 1
	with (proxy) {
	  a; // TypeError: a is not defined
	}
	
	const proxy2 = new Proxy({}, {
	  has (key) { console.log(`has ${key} ?`); return true; },
	  get () { return 1; }
	});
	proxy2.a; // 1
	with (proxy2) {
	  a; // 打印出'has a ?'并且返回 1
	}
	
`with(source){prop}`被调用时，解析器会先调用`prop in source`，若返回true，则`prop`取`source[prop]`的值；若false则沿着作用域链继续往上查找。
	
	
## WeakMap的弱引用

	const map = new Map();
	let el = document.querySelector('#title'); // el变量引用title这个DOM元素
	map.set(el, 'some info'); // 给title加上自定义信息，map对title再次引用
	
	// some code...
	
	el = null; // el变量清空
	
以上例子里，垃圾回收机制（GC）会发现，虽然title节点已经不再被el变量引用，但是依然被活动的map引用着，所以title节点还会被维持在内存中不会被释放。如果用WeakMap修改：

	const weakMap = new WeakMap();
	let el = document.querySelector('#title'); // el变量引用title这个DOM元素
	weakMap.set(el, 'some info'); // 给title加上自定义信息，weakMap对title是弱引用
	
	// some code...
	
	el = null; // el变量清空
	
使用了WeakMap的例子里，GC触发时会认为title节点已经没有被任何活动对象引用，可以清除。

这也是WeakMap不可遍历的原因，因为它内部的值可能随时会被GC清除。

## 单点登陆（SSO）

目的：系统A:a.com / 系统B:b.com / 认证中心:sso.com，让系统A和系统B共享用户登陆状态。

实现：

访问系统A：
1. 用户X访问a.com
2. a.com根据cookie判断用户X未登录，跳转sso.com
3. sso.com根据cookie判断用户X未登录，渲染登陆页
4. 用户X输入登陆信息，提交
5. sso.com保存用户X状态并签发cookie，然后带上ticket重定向到a.com
6. a.com根据ticket向sso.com验证用户X，验证成功
7. a.com保存用户X状态并签发cookie，完成登陆

访问系统B：
1. 用户X访问b.com
2. b.com根据cookie判断用户X未登录，跳转sso.com
3. sso.com根据cookie判断用户X已登陆，带上ticket重定向到b.com
4. b.com根据ticket向sso.com验证用户X，验证成功
5. b.com保存用户X状态并签发cookie，完成登陆

## HTTPS

HTTP：IP -> TCP -> HTTP
HTTPS: IP -> TCP -> SSL/TLS -> HTTP

1. 客户端初次访问服务器，服务器返回数据，包含CA证书+CA私钥加密的hash（验证信息完整性）等
2. 客户端收到数据，从浏览器内置CA证书取出CA公钥（这步最关键，保证CA公钥一定是正确的），用CA公钥解密hash，判断数据确实是由CA私钥加密且信息完整， 然后客户端用CA公钥加密client公钥，发送给服务器（发给服务器过程中间人没有CA私钥，无法查看内容）
3. 服务器收到客户端数据，用CA私钥解密取出client公钥，生成对称密钥，用client公钥加密后返回客户端（发给客户端的过程中间人没有client私钥，无法查看内容）
4. 客户端收到返回，用client私钥解密出对称密钥
5. 至此HTTPS连接建立，双方可以用对称密钥来收发信息，而不被中间人查看和修改

## RSA非对称加密

### 用法

密钥a：e（指数），n（模）

密钥b：d（指数），n（模）

用密钥a把M加密为C：C = M ** e (mod n)

用密钥b把C还原为M：M = C ** d (mod n)

也可以反过来用密钥b加密，密钥a还原，从数学上密钥a、b完全可以交换使用。但在实际运用中，一般会生成一个指数较小的（或者固定的）数作为公钥开放（加密解密更快），指数较大的数作为私钥。如果将它们交换，相当于用一个指数较小的数作为私钥，较容易被反推出来，不安全。

### 密钥对生成

生成e，d，n过程：

1、选取两个足够大的素数：p、q

2、n = p * q

3、m = (p - 1) * (q - 1)

4、找一个与m互质的数e，且1 < e < m

5、找出d，使得d * e (mod m) = 1

6、生成完毕，密钥a：(e, n)，密钥b：(d, n)

### 安全性

安全性是基于：大素数分解困难。在这个条件成立的前提下，通过已知的大素数n难以反推出p、q，所以也难以推出e、d，因此密钥a、b虽然可以相互加密解密，但算出另一密钥是困难的。

### 例子

生成密钥对：

1、选取两个素数 p = 3 ，q = 11（为方便举例选取了较小的素数）

2、n = p * q = 3 * 11 = 33

3、m = (p - 1) * (q - 1) = (3 - 1) * (11 - 1) = 20

4、从比m小的数中找出一个与m互质的数 e = 3

5、可以通过穷举法，d从1开始递增，试出满足条件的最小的d = 7

6、得出一对密钥：密钥a：(3, 33)，密钥b：(7, 33)

对'rsa'这个字符串加密：

1、对‘rsa’进行数字化转化，'r'，‘s'，’a'可以转化成其对应字母表次序：18、19、1

2、用密钥a加密：

r => 18 => 18 ** 3 % 33 => 24

s => 19 => 19 ** 3 % 33 => 28

a => 1 => 1 ** 3 % 33 => 1

加密后：['r', 's', 'a'] => [24, 28, 1]

对加密后的[24, 28, 1]进行还原：

1、用密钥b解密

24 => 24 ** 7 % 33 => 18 => r

28 => 28 ** 7 % 33 => 19 => s

1 => 1 ** 7 % 33 => 1 => a

得出结果'rsa'













