# HTTP

### HTTP

基于tcp协议，req格式： `HTTP/1.1 /index.html GET\r\nConnection: keep-alive`，res格式：`HTTP/1.1 200 OK\r\nContent-type: text/plain\r\n\r\nsome text here`

1.1默认keep-alive，基于一次tcp（3次握手4次挥手）来发多次http请求

状态码12345

header(content-type/accept-encoding/user-agent/cookie/access-control-allow-origin/cache-control/e-tag/connection)

缓存控制

cookie

http2：二进制、多路复用、主动推送、头部压缩

### HTTPS

HTTP：IP -> TCP -> HTTP

HTTPS: IP -> TCP -> SSL/TLS -> HTTP

1. 客户端初次访问服务器，服务器返回数据，包含CA证书+CA私钥加密的hash（验证信息完整性）等
2. 客户端收到数据，从浏览器内置CA证书取出CA公钥（这步最关键，保证CA公钥一定是正确的），用CA公钥解密hash，判断数据确实是由CA私钥加密且信息完整， 然后客户端用CA公钥加密client公钥，发送给服务器（发给服务器过程中间人没有CA私钥，无法查看内容）
3. 服务器收到客户端数据，用CA私钥解密取出client公钥，生成对称密钥，用client公钥加密后返回客户端（发给客户端的过程中间人没有client私钥，无法查看内容）
4. 客户端收到返回，用client私钥解密出对称密钥
5. 至此HTTPS连接建立，双方可以用对称密钥来收发信息，而不被中间人查看和修改



### websocket

和http一样基于tcp，http协议的升级

tcp连接（连接实例称为socket）建立后，客户端发送http格式的报文`{ Connection: Upgrade, Upgrade: websocket, ... }`，服务端如果支持，也返回类似的确认报文，双方都对这个socket做好全双工通信的准备，即websocket连接建立。

### socket

套接字，可以理解为一个连接的实例，
比如说服务端客户端建立起一个tcp连接，那么两端各会有一个socket实例，可以对其调用各种方法来收发信息。

### 七层模型

应用：http

会话：ssl/tls

传输：tcp/udp

网络：ip

### 跨域

http header(cors)

iframe

jsonp

nginx转发


### 单点登陆（SSO）

目的：系统A:a.com / 系统B:b.com / 认证中心:sso.com，让系统A和系统B共享用户登陆状态。

实现：

访问系统A：
1. 用户X访问a.com
2. a.com根据cookie判断用户X未登录，跳转sso.com
3. sso.com根据cookie判断用户X未登录，渲染登陆页
4. 用户X输入登陆信息，提交
5. sso.com保存用户X状态并签发cookie，然后带上ticket重定向到a.com
6. a.com根据ticket向sso.com验证用户X，验证成功
7. a.com保存用户X状态并签发cookie，完成登陆

访问系统B：
1. 用户X访问b.com
2. b.com根据cookie判断用户X未登录，跳转sso.com
3. sso.com根据cookie判断用户X已登陆，带上ticket重定向到b.com
4. b.com根据ticket向sso.com验证用户X，验证成功
5. b.com保存用户X状态并签发cookie，完成登陆