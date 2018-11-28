# JS（ECMA）

## 数组方法（Array.prototype）

修改原数组：push / pop / shift / unshift / splice / sort / reverse

返回新数组：slice / map / filter / concat

数组遍历相关：forEach / map / filter / some / every / reduce / indexOf / find / includes


## 原型/继承

### 原型、实例、构造函数

    function A() {} // 构造函数 constructor

    const a = new A(); // 实例 instance

    const proto = A.prototype; // 原型 prototype

三者相互访问:

    Object.getPrototypeOf(a) === proto
    A.prototype === proto

    proto.constructor === A
    a.constructor === A // 实际上等同于 a.__proto__.constructor

### 继承

### class extends 写法


## 类型转换

#### 数字转字符串

    number + '';
    number.toString();
    String(number);

#### 字符串转数字

    +string;
    Number.parseFloat(string);
    Number(string);

#### (1).toString()

基本类型在读取模式下会被包装为对应的对象，比如

    (1).toString(); // 等同于new Number(1).toString()

写入模式则无效

    const num = 1;
    num.prop = 2;
    num.prop; // undefined
 
#### 隐式转换

对需要转换的值`foo`调用其内部方法`[Symbol.toPrimitive](hint)`，根据上下文决定hint取值（string/number/default）

默认的toPrimitive试着调用foo的toString和valueOf转换为基本值，转换失败则抛错：

string: try `foo.toString()` => try `foo.valueOf()` => throw error

number/default: try `foo.valueOf()` => try `foo.String()` => throw error

## Object

#### 禁止修改属性

Object.freeze

defineProperty writable

defineProperty set


## Promise错误处理

能否 try { new Promise(..); } catch() {} ？ 为何

对比

new Promise(...).then(data => {}, error => {})

new Promise(...).then(date => {}).catch(error => {})

## async/await

async(); // return promise

await promise; // or await value;

## setTimeout & setInterval 处理循环

setInterval可能连续多次触发（定时推送，不管内部函数是否执行完毕，因为JS引擎和定时器是两个不同线程各自执行）

## import

静态导入

    import a './module-a';

按标准，静态导入是会作用于编译阶段，在代码运行之前，所以import不能被包裹在if代码块内

动态导入

    const b = import('./module-b'); // 得到promise

    b.then(content => { ... }) // module-b的内容content作为promise的结果返回

详见 工程化/模块化

## 数字精度

JS中能转换成整数的值都会用整数来存储，小数在底层用 IEEE-754 双精度（64位）浮点数来存储。

64位：1符号位+11指数位+52有效数字位

小数x转化成二进制是用 x = 1/2\*a + 1/4\*b + 1/8\*c + 1/16\*d ... 中的abcd等因子来表示。

比如0.1 = 1/2\*0 + 1/4\*0 + 1/8\*0 + 1/16\*1 + 1/32\*1 + 1/64\*0  ... ，则0.1的二进制表示为00011001100...，去掉头部的0从1开始（头部的0可以在指数位表示），则有效数字部分为11001100...

因此大部分小数无法精确存储，除了0.5/0.125/0.375这类数字


## 手写函数

实现Array.prototype.reduce/String.prototype.indexOf/Function.prototype.bind

## 排序

方法 | 平均 | 最快 | 最慢 | 空间
:- | :-: | :-: | :-: | :-:
快排 | NlogN | N2 | NlogN | 1
冒泡 | N2 | N2 | N | 1
插入 | N2 | N2 | N | 1

## 尾调用优化

最后return一个函数，不依赖其他变量

递归会产生多层函数调用栈，优化后只有一层

	
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