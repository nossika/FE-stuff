
# 构建

## webpack

### entry、output

多入口配置

### loader

对指定文件自定义编译，多个loader流式工作

#### 使用

	config = {
		entry: '',
		output: {},
		module: {
			rules: [ // Rule[]
				{
					test: /xx.ext/,
					use: [ // Loader[]
						'loader-a',
						{
							loader: 'loader-b',
							option: {},
							query: {},
						}
					]
				}
			]
		}
	}

编译过程中遇到匹配某rule的test的文件，会使用rule的use中设置的loader（可以是多个loader，从后往前）来加载这个文件。loader从node_module里的对应loader名调用。

#### 编写

	module.export = function(content, map, meta) { 
		// do sth
		return newContent;
	}
	
或者异步使用
	
	module.export = function(content, map, meta) { 
		// do sth
		this.callback(newContent);
	}

babel-loader（文本loader）：

得到js文件的文本内容content，将其解析成ast，重新组织语法，再生成新的字符串newContent返回

file-loader（二进制loader）：

文件内容content为二进制数据。引用webpack自带的loader-utils库，调用其`interpolateName`方法得到其hash名，调用`this.emitFile`把二进制content生成新file输出到output指定的目录下，最终结合config中的publicPath得到新file的可访问路径，最终组合成`module.exports = fileOutputPath`格式的数据返回

### plugin

插手构建过程，在complition各阶段添加钩子函数来改变构建逻辑


#### 使用

		config = {
			entry: '',
			output: {},
			plugins: [
				new SomePlugin(options),
			],
		}

#### 编写

	class {
		constructor(options) {
			// 拿到用户定义的options
		}
		apply(compiler) {
			// 插件安装时调用一次，拿到compiler对象（提供webpack全局配置信息）
			// 可以从compiler的hooks回调拿到compilation对象（每次文件变动重新生成，提供本次资源相关信息）
			// 在compiler和compilation的各类hooks（基于tapable）绑定自定义事件
		}			
	}

	
#### definePlugin

一般用于定义一些全局字段，和process.env（模仿node环境）。

这些配置是在编译阶段静态直接转换，而非生成全局变量，比如模块中`process.env.NODE_ENV`编译后会直接被替换为定义的值，而`process.env['NODE' + '_ENV']`则不会


### 代码分割

optimization.splitChunks 整体控制模块的独立打包规则，比如提取多页项目的公共依赖

cacheGroups.vendor 分割出不常改变的公共文件单独打包，利于被浏览器缓存

页面中import('./module') 手动分割模块，webpack编译时会单独打包此module

可用webpack-bundle-analyzer分析打包结果

### 编译速度优化

ddl：ddl.config打包公共文件生成manifest，config引用这个manifest，省去对公共文件再次打包的时间

## rollup

更纯粹的打包工具，适合库而非应用（app）

## gulp

流式任务

## 代码体积优化

treeshaking去除无用代码，前提需要模块无副作用

模块扁平化，比如能直接返回值的模块，引用它时直接引用返回值，而不是引用模块

单例模式引用模块

提升各模块中的polyfill函数来共用

代码压缩


## babel

和polyfill关系：babel只转语法，polyfill拓展原型和全局对象

原理：text => tokens => ast => ast(transformed) => text

### babel如何直接运行于浏览器？

以此版本 https://unpkg.com/babel-standalone@6.26.0/babel.js 的babel为例：

1. 监听`DOMContentLoaded`事件，事件触发后会选取所有`type`为`text/jsx`和`text/babel`的`script`存入jsxScripts数组。
2. 遍历数组，将`scriptEl.innerHTML`作为源码调用babel核心方法编译为结果代码（带`src`的`script`用ajax异步获取content作为源码，在回调中处理编译）。
3. 编译完成后新建`script`元素，将`scriptEl.text`设置为结果代码，`append`到`headEl`，此时浏览器会自动执行该`script`。
