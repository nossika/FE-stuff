# 跨域

## 同源策略

浏览器为保护用户信息安全的策略，必须协议、域名、端口都相同才是同源，否则为非同源，也称跨域。

## 跨域限制

浏览器一般对跨域行为作如下限制

- ajax请求无法读取返回结果
- cookie、localstorage无法读取
- iframe的dom内容无法获取
- 外域script标签的错误内容无法被window.onerror捕获

## 应对方法

### ajax请求无法读取返回结果

- CORS，在服务端设置返回http的header设置`Access-Control-Allow-Origin`为`*`或者本站域名

- JSONP，利用script标签无跨域限制的特性，新建script标签，src后面加上回调函数名，服务端把返回结果包装成`callback(data)`的形式返回

- 改用WebSocket通信，无跨域限制

- 同源服务端转发

### cookie、localStorage无法读取

- 如果一级域名相同，只是二级或以后的域名不同，可以设置document.domain为相同域名，即可共享cookie和localStorage

### iframe的DOM内容无法获取

- 如果一级域名相同，只是二级或以后的域名不同，可以设置document.domain为相同域名，即可通过`document.getElementById("iframe").contentWindow.document`获取

- postMessage和监听message事件完成通信

### 外域script标签的错误内容无法被window.onerror捕获

- 服务端需要设置`Access-Control-Allow-Origin`，且script标签需要加上`crossorigin`属性