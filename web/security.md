# 安全

## 同源策略

浏览器为保护用户信息安全的策略，必须协议、域名、端口都相同才是同源，否则为非同源，也称跨域。

### 跨域限制

浏览器对网络请求、存储资源、DOM资源在跨域情况下会有一些访问限制：

- ajax请求无法跨域读取返回结果
- cookie、localstorage无法跨域读取
- iframe的dom内容无法跨域获取
- 跨域script标签的错误内容无法被window.onerror捕获

### 应对方法

#### ajax请求无法读取返回结果

- CORS，在服务端设置返回http的header设置`Access-Control-Allow-Origin`为`*`或者本站域名

- JSONP，利用script标签无跨域限制的特性，新建script标签，src后面加上回调函数名，服务端把返回结果包装成`callback(data)`的形式返回

- 改用WebSocket通信，无跨域限制

- 同源服务端转发

#### cookie、localStorage无法读取

- 如果一级域名相同，只是二级或以后的域名不同，可以设置document.domain为相同域名，即可共享cookie和localStorage

#### iframe的DOM内容无法获取

- 如果一级域名相同，只是二级或以后的域名不同，可以设置document.domain为相同域名，即可通过`document.getElementById("iframe").contentWindow.document`获取

- postMessage和监听message事件完成通信

#### 外域script标签的错误内容无法被window.onerror捕获

- 服务端需要设置`Access-Control-Allow-Origin`，且script标签需要加上`crossorigin`属性

## XSS

跨站脚本攻击 (Cross Site Script) ，因信任用户输入，且输出到页面时未转义，使得恶意用户输入的脚本可以被渲染到正常用户的页面上执行。

1. 输入转义、输出转义，从根源防止

2. CSP防止加载外域资源、发送请求给外域

3. Cookie使用HttpOnly，防止Cookie被窃取

### CSP

内容安全策略（Content-Security-Policy），可以限制网站只向可信来源发起请求。


- 在HTTP的response中加上Content-Security-Policy的header


        Content-Security-Policy: content


- 或者在HTML头部设置http-equiv="Content-Security-Policy"的meta标签


        <meta http-equiv="Content-Security-Policy" content=""/>


## CSRF

 跨站请求伪造(Cross Site Request Forgery)，因信任用户请求，用户误点击恶意网站，恶意网站背后向本站发起的请求，被当做用户本人请求处理。

1、使用额外请求参数（token）作为凭据

2、设置Cookie的SameSite，不允许跨域发送Cookie

3、增加验证码，确保操作是真人执行而不是自动发起

4、判断请求header里的referer

## SQL注入

## DDoS

## WAF

## 网络劫持

页面内容监听、篡改

解决方案：HTTPS

> 详见[【HTTPS】](/web/protocol.html#https)

## 内容加密

密钥：对称加密、非对称加密

算法：RSA、ECC

RSA算法详见[【RSA加密】](/algorithm/concept.html#rsa加密)
