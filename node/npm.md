# NPM

## package.json

### 字段含义

对外入口：main/module

运行：scripts

### NPM install
`npm i`：安装pkg所有dependencies，devdependencies
`npm i [module] [-S/-D]`：安装[module]到此目录下的node_modules并记录到pkg
`-g`：安装到全局node_modules
`npm uninstall [module] [-g]`：卸载
### scripts
	
	scripts: {
	  "test": "node bin/test.js --hot"
	}

通过`npm run test`来快捷执行`node bin/test.js --hot`，script中process.argvs读取命令行参数
	
### 版本号

`^1.2.3`：可兼容到1.x.x
`~1.2.3`：可兼容到1.2.x

### bin 

shell方式运行，bin如下设置

	bin: {
	  "my-bin": "bin/my-bin.js"
	}

`my-bin.js`中的文件首行加上`#!/usr/bin/env node`表示以node环境运行

install之后，my-bin.js会被复制到`node_modules/.bin`下成为shell脚本，在cmd中直接`node_modules/.bin/my-bin [--params]`（或者全局安装后`my-bin [--params]`）来运行
