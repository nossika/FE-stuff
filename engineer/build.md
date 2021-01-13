
# 构建

## webpack

### 构建体积优化

- 懒加载：只加载当前界面需要的代码，可以结合预加载来优化等待时间，合理利用动态import。

- 按需加载：只加载依赖库用到的模块，而非加载整个库，比如antd结合plugin-import、moment只加载需要的语言库等。

- treeshaking：webpack内置优化，构建时丢弃模块未被使用的代码，但需要满足模块代码干净无副作用，比如加载第三方库时指定加载其es版本，更利于webpack做treeshaking优化。

- 代码压缩：webpack已在生产模式内置，比如uglifyjs。

- 分离CSS：把样式独立到css文件，或者异步加载，不阻塞js执行。

- chunk粒度权衡：将多个异步模块共用的依赖提取出来，统一加载，就可以不必在每个异步模块中都重复打包这些共用依赖，但要考虑chunk粒度，太粗起不到优化效果，太细会拖慢主模块的加载，合理使用splitchunks配置。


### 构建速度优化

- loader粒度精细：每一类文件只经过它必须的loader。

- 多线程编译：webpack5内置的Terser plugin已开启parallel，或者手动使用happypack之类的plugin。

- 编译缓存：webpack5已经内置了模块缓存策略，或者手动使用cache-loader、dll之类的工具。

- （对于ts项目）类型检查放到异步：transpileOnly结合fork-ts-checker-webpack-plugin。


### 缓存策略优化

- 基于contenthash命名模块：模块内容改变文件名才会改变。

- 提取公共依赖：将不常变动的第三方库从业务代码中独立成一个模块，这个模块的内容可以比较稳定。

## rollup

更纯粹的打包工具，适合库而非应用（app）

## gulp

流式任务


## babel

和polyfill关系：babel只转语法，polyfill拓展原型和全局对象

原理：text => tokens => ast => ast(transformed) => text

### babel如何直接运行于浏览器？

以此版本 https://unpkg.com/babel-standalone@6.26.0/babel.js 的babel为例：

1. 监听`DOMContentLoaded`事件，事件触发后会选取所有`type`为`text/jsx`和`text/babel`的`script`存入jsxScripts数组。
2. 遍历数组，将`scriptEl.innerHTML`作为源码调用babel核心方法编译为结果代码（带`src`的`script`用ajax异步获取content作为源码，在回调中处理编译）。
3. 编译完成后新建`script`元素，将`scriptEl.text`设置为结果代码，`append`到`headEl`，此时浏览器会自动执行该`script`。
