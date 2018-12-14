
# 构建工具

### webpack

#### 配置

多入口配置

loader作用，对特定文件编译，流式

plugin作用 ，全局作用，在complition不同阶段起作用

#### 实现代码分割

splitChunk：单页：用test提取公共文件，减小文件体积，配合chunkhash，浏览器缓存公共文件；多入口：用minChunks提取出多次引用的文件

ddl：ddl.config打包公共文件生成manifest，config引用这个manifest，不会对公共文件再次打包，提高编译速度

#### definePlugin:

一般用于定义一些全局字段，和process.env（模仿node环境）。

这些配置是在编译阶段静态直接转换，而非生成全局变量，比如模块中`process.env.NODE_ENV`编译后会直接被替换为定义的值，而`process.env['NODE' + '_ENV']`则不会

#### loader

webpack中使用loader：

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

loader编写：

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

#### plugin

plugin使用：

		config = {
			entry: '',
			output: {},
			plugins: [
				new SomePlugin(options),
			],
		}

plugin编写：

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


### rollup

适合库而非应用（app），treeshaking，缺少懒加载

### webpack&rollup

treeshaking + 去除无用if代码

### gulp

流式任务

### babel

polyfill关系：babel只转语法，polyfill拓展原型和全局对象

原理：text => tokens => ast => ast(transformed) => text

#### babel如何在浏览器运行？（https://unpkg.com/babel-standalone@6.26.0/babel.js）

1. 监听`DOMContentLoaded`事件，事件触发后会选取所有`type`为`text/jsx`和`text/babel`的`script`存入jsxScripts数组。
2. 遍历数组，将`scriptEl.innerHTML`作为源码调用babel核心方法编译为结果代码（带`src`的`script`用ajax异步获取content作为源码，在回调中处理编译）。
3. 编译完成后新建`script`元素，将`scriptEl.text`设置为结果代码，`append`到`headEl`，此时浏览器会自动执行该`script`。
