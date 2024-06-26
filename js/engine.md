

# V8引擎

## 简介

V8是google开源的JS引擎，由C++编写，被应用于Chrome、NodeJS等，其他JS引擎有Rhino、JavaScriptCore、Chakra等。

V8中做的性能优化有：

- JIT编译优化

- 隐藏类

- 高效垃圾回收

- etc.

> 一个可调试V8的库：https://github.com/GoogleChromeLabs/jsvu

## 查阅 V8 源码

V8 源码仓库：[https://github.com/v8/v8](https://github.com/v8/v8)

JS 大部分内置的 API 实现都在 [/src/builtins](https://github.com/v8/v8/tree/14bc07d1427de50421a672cfac5ded5ae2ee7bda/src/builtins) 目录内，可通过 API 名搜索到源码。

比如数组的 map 方法，可以用 Array.prototype.map 关键字搜索，找到其源码位于 [/src/builtins/array-map.tq](https://github.com/v8/v8/blob/14bc07d1427de50421a672cfac5ded5ae2ee7bda/src/builtins/array-map.tq#L227)，注释处附有对应的 ecma 的标准文件 [sec-array.prototype.map](https://tc39.github.io/ecma262/#sec-array.prototype.map)。

其中 .tq 结尾的文件是以 Torque 语言编写（一种 V8 内部的 DSL），实际构建时会先被 [Torque 编译器](https://github.com/v8/v8/tree/14bc07d1427de50421a672cfac5ded5ae2ee7bda/src/torque) 转化为 C++ 代码，再最终编译为二进制的机器码。

### mac 搭建源码调试环境

参考 v8 官方指引：[https://v8.dev/docs/source-code](https://v8.dev/docs/source-code)

1、下载调试工具 [depot_tools](https://commondatastorage.googleapis.com/chrome-infra-docs/flat/depot_tools/docs/html/depot_tools_tutorial.html#_setting_up)

2、安装 v8，关联依赖

```bash
$ cd depot_tools
$ fetch v8
$ gclient sync
```

3、编译

```bash
$ cd depot_tools/v8
$ tools/dev/gm.py arm64
```

编译产物默认在 `out/` 中，可用 `out/arm64.release/d8` 执行 JS 脚本。

4、输出 xcode 文件

```bash
$ cd depot_tools/v8
$ gn gen out/gn --ide="xcode"
```

输出的文件在 `out/gn`。

5、使用 xcode 调试

用 xcode 打开上一步输出的 `out/gn/all.xcodeproj` 文件。

xcode 工具栏 product -> scheme -> d8，启动编译并运行。

等待编译成功后，即可在 xcode 中的命令行执行 JS 脚本，并且可以用 xcode 在 v8 源码断点调试。

## V8 特性

### JIT（Just-In-Time）编译优化

#### 原理

JS 是非编译型语言，其运行是直接执行源码，运行时在 JS 引擎内部实现”源码 -> AST -> 字节码 -> 汇编（机器码）“编译过程。

但如果在运行前，就对全部代码执行上述编译过程，会占用较长时间，且需要较大内存来保存编译后的机器码（越底层的代码越冗长）。所以通常 JS 引擎的实现是翻译到“字节码”这一层，然后边运行边翻译成“机器码”来执行。

V8 引擎对这个过程做了 JIT 优化，即适时将某些较常运行的“字节码”优化并缓存，省去后续的编译耗时。

在 V8 中，解释执行“字节码”的模块是 Ignition，它在解释执行“字节码”的同时，也持续监控函数调用情况，当某个函数被高频调用且参数类型也稳定，它会认为这段“字节码”有优化必要，会将其优化并缓存优化结果供后续使用。

V8 初步优化“字节码”的动作叫 Baseline，它会尝试将“字节码”按固定参数类型优化，产物还是“字节码”，但执行速度相比“原始字节码“要快些。

如果函数依然被高频调用且入参稳定，V8 会将其更进一步优化为”机器码“，负责将“字节码”编译为“机器码”的动作叫做 TurboFan，被预编译的函数会得到 [TurboFanned](https://github.com/v8/v8/blob/c8fad7737ced5c262dee11610164f27a8ca155fe/src/runtime/runtime.h#L1019) 的状态，这里编译后的“机器码”其实还带了前置的、对函数入参的 checkpoint 判断。后续函数调用都会尝试用此机器码执行，但如果 checkpoint 阶段发现出现入参类型不同，无法直接用此“机器码”，则会回退到“原始字节码”执行。当多次出现这种回退，V8 会放弃这个编译优化。

对于编写代码的参考意义是：对于热点代码片段，可将其抽离成独立函数，并使其入参类型保持稳定。这样才能最大化利用 JIT 的优化。

#### 例子

可以通过`node --allow-natives-syntax`命令（允许使用 V8 debug API）执行以下代码：

```js
const add = (a, b) => a + b;

console.log(%GetOptimizationStatus(add).toString(2)); // 1 --- 初始状态，无优化

for (let i = 0; i < 100000; i++) {
  add(1, 2);
}

console.log(%GetOptimizationStatus(add).toString(2)); // 100000000000001 --- Baseline 优化

for (let i = 0; i < 10000000000; i++) {
  add(1, 2);
}

console.log(%GetOptimizationStatus(add).toString(2)); // 110001 --- TurboFan 优化

add('1', '2');

console.log(%GetOptimizationStatus(add).toString(2)); // 1 --- 回退到无优化
```

`%GetOptimizationStatus`可以获取函数的优化状态，得到结果是一个最多 20 位的二进制数字，每一位的含义可参考 V8 源码的 [OptimizationStatus](https://github.com/v8/v8/blob/c8fad7737ced5c262dee11610164f27a8ca155fe/src/runtime/runtime.h#L1012)。比如 `100001` 表示进入了 TurboFan 优化（倒数第 6 位为 1）。

### 隐藏类（快属性）

#### 原理

因为 JS 里实现同一类对象的手段是”原型“，没有严格意义上的类，且对象属性（甚至其原型）可以在运行时变化，所以无法在编译时就为对象分配好固定的空间。所以只能在运行时，动态为对象每个属性分配空间，那么从对象中取值时就有了查找的消耗。

V8 的对象以 3 类结构来存储数据

- elements: 以数字为下标的数据
- properties: 常规命名属性的数据
- inline-object properties: 同 properties，直接存储于对象本身，查找更快，但仅能存下少量数据，超出部份就存 properties

对于 properties 数据，每次访问都要O(n)遍历，找到需要的 key 来取出数据，对于同一类对象，每次都执行这样的操作有点多余。

V8 为每个对象创造了“隐藏类”，“隐藏类”中保存了 key 和其对应的内存偏移值，知道 key 就能直接根据内存偏移值取到数据，只需要O(1)。对于有相同“隐藏类”的对象，其取值可省去一次遍历查找的过程。“隐藏类”本身是类数组结构，编译期 V8 会把对象的 key 编译为数字，“隐藏类”的下标会与 key 的数字关联，所以对“隐藏类”本身的查找是O(1)。

隐藏类是有序创建的，比如对于同样的一个初始对象，先赋值 a 再赋值 b，和先赋值 b 再赋值 a，两者最终得到的隐藏类是不同的。

对于编写代码的参考意义是：对于同一类对象，属性声明顺序应保持稳定，如果有空值也显式用 undefined 声明。这样才能尽可能利用隐藏类。

#### 例子

可以通过`node --allow-natives-syntax`执行以下代码，观察隐藏类（`%DebugPrint` 返回的 map 地址）的复用情况：

```js
console.log('a -> b');

const obj1 = {};
obj1.a = 1;
// 生成隐藏类 Map(a)
obj1.b = 2;
// 生成隐藏类 Map(a, b)
%DebugPrint(obj1); // - map: 0x28d5385b7599 <Map(HOLEY_ELEMENTS)> [FastProperties]



console.log('b -> a');

const obj2 = {};
obj2.b = 2;
// 生成隐藏类 Map(b)
obj2.a = 1;
// 生成隐藏类 Map(b, a)
%DebugPrint(obj2); // map: 0x36c5d97f7629 <Map(HOLEY_ELEMENTS)> [FastProperties]



console.log('a -> b -> c');

const obj3 = {};
obj3.a = 1;
obj3.b = 2;
// 🌟 复用前面的 Map(a, b)
%DebugPrint(obj3); // - map: 0x28d5385b7599 <Map(HOLEY_ELEMENTS)> [FastProperties]

obj3.c = 3;
// 基于前面的 Map(a, b) 拓展出新的 Map(a, b, c)
%DebugPrint(obj3); // - map: 0x28d5385b7671 <Map(HOLEY_ELEMENTS)> [FastProperties]


console.log('a -> c vs a -> b -> c');

const obj4 = {};
obj4.a = 1;
obj4.c = 3;
// 生成隐藏类 Map(a, c)
%DebugPrint(obj4); // - map: 0x36c5d97f76b9 <Map(HOLEY_ELEMENTS)> [FastProperties]

const obj5 = {};
obj5.a = 1;
obj5.b = undefined;
obj5.c = 3;
// 🌟 复用前面的 Map(a, b, c)
%DebugPrint(obj5); // - map: 0x36c5d97f7671 <Map(HOLEY_ELEMENTS)> [FastProperties]


console.log('a + b vs b + a');

const obj6 = {
  a: 1,
  b: 2,
};
// 生成隐藏类 Map(ab)
%DebugPrint(obj6); // - map: 0x36c5d97f7749 <Map(HOLEY_ELEMENTS)> [FastProperties]

const obj7 = {
  b: 2,
  a: 1,
};
// 生成隐藏类 Map(ba)
%DebugPrint(obj7); // - map: 0x36c5d97f77d9 <Map(HOLEY_ELEMENTS)> [FastProperties]

const obj8 = {
  a: 1,
  b: 2,
};
// 🌟 复用隐藏类 Map(ab)
%DebugPrint(obj8); // - map: 0x36c5d97f7749 <Map(HOLEY_ELEMENTS)> [FastProperties]


```

也可以在 chrome 的 memory 抓取内存快照，查看对象的结构，其中`system / Map`指向的就是其隐藏类。

### 快数组

通常意义的数组是指元素类型一致、占用空间一致、内存上连续的一组数据。这样初始化时，通过容量大小即可确定分配的内存空间；通过数组下标访问元素时，仅需通过下标值乘以占用空间就能得到内存偏移量，即可获取到对应元素。

而JS的数组是可以存放不同类型的元素的，且不需要提前声明容量。此类场景更适合用哈希表实现。

所以V8内部对于数组有两种实现：FixedArray（快数组） / HashTable（慢数组）。FixedArray即通常意义的数组，有元素空间大小一致、内存连续等特性；HashTable即哈希表封装而成的数组，也提供了pop、push等方法，但内存非连续。V8还对FixedArray做了自动扩缩容，在数组操作过程中动态改变数组容量。

V8会尽可能地将数组以FixedArray的形式实现，来使数组有更好的性能。但需要满足一些条件：元素都为某几类元素、大部分元素排列紧密等。V8运行过程中会适时根据条件，把数组实现在FixedArray和HashTable互相切换。

#### 稀疏数组

前面提到”数组紧密排列“，数组有紧密数组（PACKED）和稀疏数组（HOLEY）的区别。比如下面方式即可构造出一个稀疏数组：

```
const arr = [1];
arr[1000] = 1;
console.log(arr); // [1, empty × 999, 1]
arr.forEach(n => console.log(n)); // 1, 1
```

数组中未被初始化的元素即为稀疏元素，用empty表示，并且遍历时会被跳过。

如果一个FixedArray数组中加入大量稀疏元素，则V8会将底层结构切换为HashTable，来减少内存空间占用。

### 垃圾回收

V8采用了分代GC，将内存划分为：

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



	
