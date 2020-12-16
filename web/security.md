# 安全


## 同源策略

浏览器为保护用户信息安全的策略，必须协议、域名、端口都相同才是同源，否则为非同源，也称跨域。

### 跨域限制

浏览器对网络请求、存储资源、DOM资源在跨域情况下会有一些访问限制：

- ajax请求无法跨域读取返回结果
- cookie、localstorage无法跨域读取
- iframe的dom内容无法跨域获取
- 跨域script标签的错误内容无法被window.onerror捕获

### 绕过跨域

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

场景：

1. 后台对表单输入数据未转义直接存入数据库，并且前端在输出到页面时也未转义，使得恶意用户可以植入代码到其他用户的页面。

2. 前端对URL上的参数取值时未转义直接输出到页面，使得恶意用户可以植入代码到URL传播，其他用户误点击后就会在本地页面执行。

应对：

1. 存入数据库前对参数转义、输出到页面时对参数转义，从根源防止

2. CSP防止加载外域资源、发送请求给外域，防止发送本地用户数据给外部服务器

3. Cookie使用HttpOnly，防止Cookie被代码读取

4. 使用postMessage通信时，接收方判断origin，且不对传来的参数直接输出或执行

### CSP

内容安全策略（Content-Security-Policy），可以限制网站只向可信来源发起请求。

启用CSP：

- 在HTTP的response中加上Content-Security-Policy的header

```
Content-Security-Policy: content
```

- 或者在HTML头部设置http-equiv="Content-Security-Policy"的meta标签

```html
<meta http-equiv="Content-Security-Policy" content=""/>
```

## CSRF

跨站请求伪造(Cross Site Request Forgery)，因服务端信任请求来自正常用户，把此请求正常执行或返回数据，被恶意用户利用。

场景：

1. 某网站后台仅用cookie来确认用户身份，用户登录恶意网站时，网站可以向该网站暗地发出请求（请求自动带上该网站下的cookie），后台把此请求当做正常用户的请求受理，导致用户信息泄露或者资源损失。

应对：

1. 使用token：生成token存到cookie或者页面内存，前端请求时读取此token带在header或者body中供后台校验

2. 设置Cookie的SameSite，不允许跨域发送Cookie

3. 增加验证码，确保操作是真人执行而不是自动发起

## 点击劫持

点击劫持（Click Jacking），用户点击某个按钮，却触发了不是用户真正意愿的事件。

场景：

1. 恶意网站用iframe内嵌正常网站悬浮在网页上并将iframe透明，诱使用户在页面特定位置进行点击，导致用户在不知情的情况下触发了事件。

应对：

1. 使用X-Frame-Options，防止被恶意网站内嵌

## SQL注入

## DDoS

攻击结果：用非正常请求占满服务器资源，使得正常用户的请求无法被响应。

- flood攻击：持续发送大量请求，占满cpu资源/连接池。

- 慢速攻击：大量慢速请求，占满连接池。

防御：检测异常请求，及时封禁异常请求来源IP。

## WAF

## 网络劫持

页面内容监听、篡改

解决方案：HTTPS

> 详见[【HTTPS】](/web/protocol.html#https)

## 内容加密

密钥：对称加密、非对称加密

算法：RSA、ECC

RSA算法详见[【RSA加密】](/algorithm/concept.html#rsa加密)
