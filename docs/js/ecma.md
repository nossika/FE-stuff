# JS（ECMA）

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

### 数字转字符串

    number + '';
    number.toString();
    String(number);

### 字符串转数字

    +string;
    Number.parseFloat(string);
    Number(string);

### 对于基本类型的值调用方法（比如`'asd'.indexOf('s')`）

基本类型在读取模式下会被先包装为对应的对象再执行，比如

    'asd'.indexOf('s'); // 等同于new String('asd').indexOf('s')

而写入模式则无效

    const str = 'asd';
    str.prop = 'f';
    str.prop; // undefined
 
### 隐式转换

对需要转换的值`foo`调用其内部方法`[Symbol.toPrimitive](hint)`，根据上下文决定hint取值（string/number/default）

默认的toPrimitive试着调用foo的toString和valueOf转换为基本值，转换失败则抛错：

string: try `foo.toString()` => try `foo.valueOf()` => throw error

number/default: try `foo.valueOf()` => try `foo.String()` => throw error

搬运一个MDN上的例子：

    // An object without Symbol.toPrimitive property.
    var obj1 = {};
    console.log(+obj1);     // NaN
    console.log(`${obj1}`); // "[object Object]"
    console.log(obj1 + ''); // "[object Object]"

    // An object with Symbol.toPrimitive property.
    var obj2 = {
      [Symbol.toPrimitive](hint) {
        if (hint == 'number') {
          return 10;
        }
        if (hint == 'string') {
          return 'hello';
        }
        return true;
      }
    };
    console.log(+obj2);     // 10        -- hint is "number"
    console.log(`${obj2}`); // "hello"   -- hint is "string"
    console.log(obj2 + ''); // "true"    -- hint is "default"

## Number

### 数字精度

    0.1; // 0.1
    0.2; // 0.2
    0.1 + 0.2; // 0.30000000000000004

JS中能转换成整数的值都会用整数来存储，而小数在底层则用**IEEE-754标准**的双精度（64位）浮点数来存储。所以此问题不仅出现于JS，而是使用这个标准的所有语言。

64位的组成：1符号位 + 11指数位 + 52有效数字位。

小数x转化成二进制的过程是：把x分解成`x = 1/2*a + 1/4*b + 1/8*c + 1/16*d + ...`，用其中的abcd等因子来作为二进制数。

以小数0.1为例，`0.1 = 1/2*0 + 1/4*0 + 1/8*0 + 1/16*1 + 1/32*1 + 1/64*0 + ...` ，则0.1的二进制表示为00011001100...，去掉头部的0，从1开始算（头部的0有多少可以用指数表示），则有效数字为11001100...

因此大部分小数无法精确存储，除了0.5/0.125/0.375这类数字（有效数字有限）。

回到最开始的问题，因为0.1和0.2本身就不是精确的0.1和0.2（他们自身正确显示因为在某个精度舍入了，看起来像是对的数字），所以他们相加的结果也不是精确的0.3。


## Array

### 数组方法（Array.prototype）

修改原数组：push / pop / shift / unshift / splice / sort / reverse

返回新数组：slice / map / filter / concat

数组遍历相关：forEach / map / filter / some / every / reduce / indexOf / find / includes

## Object

### 禁止修改属性

Object.freeze(obj)（Object.seal：同样禁止增删属性，但允许修改现有属性）

Reflect.defineProperty(obj, 'prop', { writable: false })

Reflect.defineProperty(obj, 'prop', { set() {} })

## 经典函数实现

### Array.prototype.reduce

    Array.prototype.reduce = function(fn, initial) {
      const arr = this;
      initial = initial === undefined ? arr.shift() : initial;
      let total = initial;
      for (let i = 0; i < arr.length; i++) {
        total = fn(total, arr[i], i, arr);
      }
      return total;
    }

### Function.prototype.bind

    Function.prototype.bind = function(scope) {
      const fn = this;
      const bindArgs = [].slice.call(arguments, 1);
      return function() {
        const args = [].slice.call(arguments);
        return fn.apply(scope, bindArgs.concat(args));
      };
    }

    // or

    Function.prototype.bind = function(scope, ...bindArgs) {
      return (...args) => this.call(scope, ...bindArgs, ...args);
    }

### String.prototype.indexOf

    String.prototype.indexOf = function(match, startIndex) {
      if (match === '') return startIndex || 0;
      const str = this;
      strLoop: for (let i = startIndex || 0; i < str.length; i++) {
        if (str[i] === match[0]) {
          matchLoop: for (let j = 1; j < match.length; j++) {
            if (str[i + j] !== match[j]) {
              break strLoop;
            }
          }
          return i;
        }
      }
      return -1;
    }

## 排序

方法 | 平均 | 最快 | 最慢 | 空间
:- | :-: | :-: | :-: | :-:
快排 | NlogN | N2 | NlogN | 1
冒泡 | N2 | N2 | N | 1
插入 | N2 | N2 | N | 1

## 异步处理

### Promise

#### Promise.all/Promise.race

#### Promise错误处理

能否 try { new Promise(..); } catch() {} ？ 为何

对比

new Promise(...).then(data => {}, error => {})

new Promise(...).then(date => {}).catch(error => {})

### async/await

async(); // return promise

await promise; // or await value;

### setTimeout & setInterval 处理循环

setInterval可能连续多次触发（定时推送，不管内部函数是否执行完毕，因为JS引擎和定时器是两个不同线程各自执行）

## 模块化（import）

在ES6之前，JS在语言层面并没有模块相关的规范，CommonJS和AMD是社区上较为主流的模块方案。

静态导入（ES6标准）：

    import a from './module-a';

按相关标准，静态导入是会作用于编译阶段，在代码运行之前，所以import不能被包裹在if代码块内

动态导入（目前还处于提案阶段）：

作用于运行阶段，所以import后的路径可以是拼接的字符串

    const b = import('./module-b'); // 得到一个promise

    b.then(content => { ... }) // module-b的内容content作为promise的结果返回

> 详见本书的【工程化/模块化】

## 尾调用优化

定义：函数的return结果是调用一个函数。

正常情况下函数内调用函数，在内存会有一个调用栈，来保存下各个函数的调用帧。

比如：

    function A() {
      return B(params) + num;
    }

当执行到return，函数A还需要对函数B的执行结果操作才能得到最终结果，因此在调用栈中会有[A,B]，等到函数B得到结果，B从栈中pop出来，才会继续函数A的计算。如果函数B中再调用其他函数，那么其调用栈会更深。

如果改成

    function A() {
      return B(params, num);
    }

那么执行到return，去执行函数B时，调用栈中可以直接去掉函数A，只保留最后一层的函数B，函数B的调用结果可以当作整个调用栈的执行结果。

此特性一般可以在递归中作为优化手段，把普通递归改为尾调用（尾递归），可以节省大量内存。

斐波那契的例子

    function fib(n) {
      if (n === 1) return 1;
      if (n === 2) return 2;
      return fib(n - 1) + fib(n - 2);
    }
    // 普通递归：fib(5) 展开为 fib(4) + fib(3) 展开为 fib(3) + fib(2) + ... 展开为 fib(2) + fib(1) + ...
    // 函数会一直展开，调用栈不断往上堆叠

    function fib(n, result = 1, total = 1) {
      if (n === 1) return result;
      return fib(n - 1, result + total, result);
    }

    // 尾递归：fib(5) 替换为 fib(4, 2, 1) 替换为 fib(3, 3, 2) 替换为 fib(2, 5, 3) 替换为 fib(1, 8, 5)
    // 始终只需要保存最后一层调用帧

尾调用优化在支持ES6的环境中（严格模式下）默认开启。

## WeakMap的弱引用

	const map = new Map();
	let el = document.querySelector('#title'); // el变量引用#title这个DOM元素
	map.set(el, 'some info'); // 给#title加上自定义信息，map对#title再次引用
	
    map.get(el); // 读取#title的信息
	
	el = null; // el变量清空
	
以上例子里，垃圾回收机制（GC）会发现，虽然#title节点已经不再被el变量引用，但是依然被活动的变量map引用着，所以#title节点还会被维持在内存中不会被释放。

如果用WeakMap写法：

	const weakMap = new WeakMap();
	let el = document.querySelector('#title'); // el变量引用#title这个DOM元素
	weakMap.set(el, 'some info'); // 给#title加上自定义信息，weakMap对#title是弱引用
	
    weakMap.get(el); // 读取#title的信息
	
	el = null; // el变量清空
	
WeakMap的例子里，GC触发时，遍历后会认为#title节点已经没有被任何活动对象引用，可以清除。

这也是WeakMap不可遍历的一个原因，因为它内部的值可能随时会被GC清除。

## with会隐式调用in操作
	
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
	
`with(source){prop}`被调用时，实际上会先调用`prop in source`，若返回true，则`prop`取`source[prop]`的值；若false则沿着作用域链继续往上查找。
	
	
