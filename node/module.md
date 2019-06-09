# 模块

## 进程

进程通信

- exec：shell，一次性数据
- spawn：stream管道，stdout
- fork：特殊的spawn（node），IPC管道，可用process.send(data)和process.on('message', callback)通信

cluster

## fs模块

## http模块