# Electron

一个使用JS编写系统App的工具，本质是node+chromium。

## 运行

运行时有两类核心进程：

- 主进程

代码在node环境，可调度渲染进程，可监听ipcMain事件

- 渲染进程

由主进程调起，可加载指定的html/js等，代码在chromium环境（类前端环境，还包括一些electron注入的模块），可通过ipcRenderer和ipcMain通信。

## 编译

会把整套node+chromium环境都打包到App，包括V8引擎和blink内核，以及业务代码依赖的node_modules。所以即使业务逻辑只有几行代码，App包也有几百M。

业务代码都被打包到app.asar压缩文件，本质上是一个套壳的文件夹，包含完整的业务代码结构，可在node环境中以文件方式读取。
