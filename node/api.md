# API

## 进程

### child_process

子进程调用和通信

- exec：shell方式调用子进程，输出值默认有maxBuffer限制，一般用于获取执行结果而非大量数据。

- spawn：原理类似exec，监听stdout输出流来获取数据，可用于产生大量数据的进程。

- fork：针对node子进程的特殊spawn，以较高效率的IPC管道通信，可用process.send(data)和process.on('message', callback)通信。

### cluster

node的集群管理模块。

一般以cpu核数来执行cluster.fork，来生成对应数量的worker进程。通过cluster.isMaster来区分master进程和worker进程

cluster.fork基于child_process.fork实现。所以master和worker间也是以IPC通信。与child_process.fork不同，cluster.fork生成的多个worker可以监听同一端口。

## fs模块

### 日志

日志一般以文件形式存储在磁盘。如果每次日志变更都去读写，可能会造成频繁的磁盘IO，可以先把日志存在内存，再定时写入磁盘。

相关API：

```js
// 创建stream，以追加模式写入文件
const stream = fs.createWriteStream('./access.log', { flags: 'a' });

let logCache = '';

setInterval(() => {
  // 往stream里定时写入缓存的日志
  stream.write(logCache);
  logCache = '';
}, 1000);

// 业务代码中，记录日志到缓存
onAccess((data) => {
  logCache += data + '\n';
});
```

## http模块