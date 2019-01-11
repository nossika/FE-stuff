# NPM

## package.json

### module & main

main指向此包被外部导入时的入口文件，cjs格式；module是esm格式的入口文件。

### scripts
	
	scripts: {
	  "test": "node bin/test.js --hot"
	}

在包根目录可通过`npm run test`来快捷执行script中test指向的命令`node bin/test.js --hot`，在`test.js`中可用process.argvs读取到命令行参数`--hot`
	
### bin

表示此包可用命令行来直接执行。

	bin: {
	  "my-bin": "bin/my-bin.js"
	}


npm install之后，`my-bin.js`会被复制到`node_modules/.bin`下成为shell脚本，在cmd中运行`node_modules/.bin/my-bin [--params]`（或者全局install后直接`my-bin [--params]`）来使用

> `my-bin.js`中的文件首行加上`#!/usr/bin/env node`表示该脚本以node环境运行

## npm install

- `npm i`：安装package.json中所有dependencies和devDependencies

- `npm i [module] [-S/-D] [-g]`：安装指定[module]到此目录下的node_modules，-S/-D表示并记录到package.json，-g表示是否安装到全局

- `npm uninstall [module] [-g]`：卸载指定[module]

### version

- `1.2.3`：指定版本1.2.3
- `~1.2.3`：可兼容到1.2.x（默认）
- `^1.2.3`：可兼容到1.x.x
- `>=1.2.3 <1.3.0`：大于等于1.2.3且小于1.3.0
- `<=1.2.3 || >1.3.0`：小于等于1.2.3或者大于1.3.0
