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

### 继承（ES5/ES6）

ES5写法

    // 定义
    function A() { this.name = 'A' }
    A.prototype.hi = function () { console.log('hi') };
    function B() {}
    const a = new A();
    B.prototype = a; // B继承A
    const b = new B(); // 生成实例b

    // 执行
    b.hi(); // print 'hi' （继承到了A的方法）
    b.name; // A （也继承到了A中this定义的属性，但name属性是定义在a中，b通过原型链找到a，从而访问a.name）
    b.constructor; // A （但构造函数指向A ）

    // 原型链如下
    b.__proto__; // a（constructor和__proto__都指向A）
    b.__proto__.__proto__; // A.prototype

ES5写法，改变一下执行顺序
	
    // 定义
    function A() { this.name = 'A' }
    A.prototype.hi = function () { console.log('hi') };
    function B() {}
    const a = new A();
    const b = new B(); // 在继承前生成生成实例b
    B.prototype = a; // B继承A

    // 执行
    b.hi(); // throw error （没有继承到A的方法）
    b.name; // undefined
    b.constructor; // B （构造函数正确）

    // 原型链如下
    b.__proto__; // 原B.prototype (即prototype指向被改写之前的那个对象)

ES6 class（比起ES5写法，少了些容易让人困惑的地方）

    // 定义
    class A { 
      constructor() {
        this.name = 'A';
      }
      hi() {
        console.log('hi');
      }
    };
    class B extends A {};
    const b = new B();

    // 执行
    b.hi(); // print 'hi' （继承到了A的方法）
    b.name; // A （name直接定义在b上，即b.hasOwnProperty('name')为true）
    b.constructor; // B （构造函数也正确）

    // 原型链如下
    b.__proto__ // B.prototype（constructor指向B、但__proto__指向A的一个对象）
    b.__proto__.__proto__ // A.prototype

### class extends 写法

### 为什么 `Object instanceof Function` 和 `Function instanceof Object` 都返回true？

首先理解一下`instanceof`这个操作符，它会沿着前者的原型链（`__proto__`链）寻找是否满足与后者`prototype`相同的祖先，若找到就返回true，若一直到`__proto__`链遍历完还是没找到就返回false。

最简单的例子

    function A() {}
    const a = new A();
    a instanceof A // 按上述查法，找到a.__proto__等于A.prototype，查找结束，返回true

需要知道的几个知识：

1. 实例的`__proto__`等于其构造函数的`prototype`；
2. 所有函数都是`Function`的实例，包括`Function`这个函数自身；
3. 构造函数的`prototype`是一个普通对象，自然也是`Object`的实例。

现在来看下问题中的`Object instanceof Function`：

根据知识2，`Object`自身虽然是一个构造函数，但也是函数，是`Function`的实例，再根据知识1得出`Object.__proto__`等于`Function.prototype`，返回结果true。

再看`Function instanceof Object`：

由知识2我们知道，`Function`是构造函数`Function`的实例，所以根据知识1知道`Function.__proto__`等于`Function.prototype`；结合知识1和3，知道`Function.prototype.__proto__`等于`Object.prototype`。当沿着`Function`原型链查找到`Function.__proto__.__proto__`，也就是`Function.prototype.__proto__`，它等于`Object.prototype`，所以也返回true。




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