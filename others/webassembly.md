# WebAssembly

WebAssembly允许在浏览器中运行一些低级别但性能更高的语言（比如C语言），适合一些需要大量复杂计算的场景，比如游戏。


## 在浏览器中使用

1. 将其他语言编写的模块编译成wasm文件

2. 在JS中引入wasm（在浏览器还未实现`<script type="module"/>`前，用fetch引入）
  
```js
const bytes = await fetch(wasmUrl).then(res => res.arrayBuffer());
```

3. 使用WebAssembly解析二进制文件为module

```js
const module = await WebAssembly.compile(bytes);
```

4. 实例化module

```js
const instance = await WebAssembly.instantiate(module, {});
```

5. 使用实例上提供的方法

```js
const exports = instance.exports;

exports.add(1, 2); // 这里的add方法来自原始模块中的定义
```




