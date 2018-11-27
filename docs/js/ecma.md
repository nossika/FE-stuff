# JS（ECMA）

### 数字转字符串 & 字符串转数字

number + "" / number.toString() / String(number)

+string / parseFloat(string) / Number(string)

隐式转换规则，调用to根据preferType调用toString() / valueOf()

Number() & new Number() 区别: 为什么可以在基本属性上执行方法（比如(123).toString()）

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


### 原型继承

#### instance(a)、prototype(protoA)、constructor(A)之间关系:

a ===> protoA:  Object.getPrototypeOf(a);

a ===> A:  a.constructor;

protoA ===> A:  protoA.constructor;

A ===> protoA:  A.prototype;

A ===> a: new A();


#### class extends 写法

### Promise错误处理

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

	
### 为什么 `Object instanceof Function` 和 `Function instanceof Object` 都返回 `true` ？

先理解一下 `instanceof` 这个操作符， 它会沿着前者的 `__proto__` 链寻找是否存在后者的 `prototype` ，若找到就返回 `true` ，若 `__proto__` 链遍历完还是没找到就返回 `false` 。

然后还需要知道这几个点：所有函数的都是 `Function` 的实例，包括 `Function` 函数； `Function.prototype` 是 `Object` 的实例。

现在来看下问题中的 `Object instanceof Function` ，因为所有函数的都是 `Function` 的实例，`Object`虽然是一个构造函数，但也是函数，所以 `Object.__proto__` 等于 `Function.prototype` ，返回结果 `true` 。

再看 `Function instanceof Object` ，`Function`也是一个函数，它的原型（`Function.__proto__`）是 `Function.prototype` ,   `Function.prototype.__proto__` 是 `Object.prototype`，即 `Function.__proto__.__proto__ === Object.prototype` ，所以也返回 `true` 。

### \__proto__ & constructor

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
	


### with的隐式调用
	
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
	
	
### WeakMap的弱引用

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