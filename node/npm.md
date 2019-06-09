# NPM

## package.json

### module & main

main指向此包被外部导入时的入口文件，cjs格式；module是esm格式的入口文件。

### scripts
	
```
scripts: {
	"test": "node bin/test.js --hot"
}
```

在包根目录可通过`npm run test`来快捷执行script中test指向的命令`node bin/test.js --hot`，在`test.js`中可用process.argvs读取到命令行参数`--hot`
	
## bin

一些npm包能以命令行的方式去运行，比如webpack、create-react-app等。

要使包能以命令行形式调用，需要配置package.json里的bin字段。

举个例子：

比如要创建一个叫my-bin的公共npm包，初始化my-bin项目，在项目中创建一个可执行文件`/bin/cli.js`，并在package.json中配置bin字段，发布到npm。

> `cli.js`中的文件首行应加上`#!/usr/bin/env node`表示该脚本以node环境运行

```
// my-bin 的 package.json
bin: {
	"my-bin": "bin/cli.js"
}
```

用户在自己项目执行`npm i my-bin`后，npm会将之前的`cli.js`复制到项目根目录下的`/node_module/.bin`，并重命名为`my-bin`；如果执行全局安装`npm i -g my-bin`，则会将其安装到全局的node目录下。

用户可以在项目根目录打开命令行手动调用

```
$ ./node_module/.bin/my-bin
```

来执行my-bin，也可以写在package.json的script中来调用（script里不必写出my-bin的完整路径，因为`npm run test`时已经把`./node_module/.bin`添加到环境依赖了）

```
// 用户项目 的 package.json
scripts: {
	"test": "my-bin"
}
```

如果是全局安装，node已经默认把全局目录下的bin写进环境依赖了，直接在命令行里

```
$ my-bin
```

就能调用。


## npm install

- `npm i`：安装package.json中所有dependencies和devDependencies

- `npm i --production`：仅安装dependencies

- `npm i [module] [-S/-D] [-g]`：安装指定[module]到此目录下的node_modules，-S/-D表示并记录到package.json，-g表示是否安装到全局

- `npm uninstall [module] [-g]`：卸载指定[module]



### version

- `1.2.3`：指定版本1.2.3
- `~1.2.3`：可兼容到1.2.x（默认）
- `^1.2.3`：可兼容到1.x.x
- `>=1.2.3 <1.3.0`：大于等于1.2.3且小于1.3.0
- `<=1.2.3 || >1.3.0`：小于等于1.2.3或者大于1.3.0
