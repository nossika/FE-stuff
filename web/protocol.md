# web协议

## HTTP

基于tcp协议，req格式： `HTTP/1.1 /index.html GET\r\nConnection: keep-alive`，res格式：`HTTP/1.1 200 OK\r\nContent-type: text/plain\r\n\r\nsome text here`

1.1默认keep-alive，基于一次tcp（3次握手4次挥手）来发多次http请求

状态码12345

header(content-type/accept-encoding/user-agent/cookie/access-control-allow-origin/cache-control/e-tag/connection)

缓存控制

cookie

## HTTPS

HTTP：IP -> TCP -> HTTP

HTTPS: IP -> TCP -> **SSL/TLS** -> HTTP

HTTP是明文传输，通信内容容易被监听，并且易受中间人攻击，client（C）端到server（S）端的通信容易变成client端到middle（M）再到server端，从而通信内容被篡改。

看起来好像对通信内容加密就能解决问题，加密后的内容就不易被监听和篡改。但是传递加密解密的密钥又成了问题，因为在传递密钥这一步同样也会被中间人监听和篡改。

> 加密相关内容详见[【web/加密】](/web/encode)

HTTPS引入CA证书来解决密钥传递的问题，过程如下：

1. C端发起访问

2. S端收到请求，返回证书内容（包含网站信息、签发机构CA信息、证书有效期等）和证书签名（CA签发证书时交给网站的，对**证书内容hash**用CA私钥加密后得到的签名）

3. C端收到证书内容，从**浏览器内置**的CA列表中，拿出证书对应的CA公钥，解密签名，将签名数据与证书内容比对一致后，即可认为此证书来源可信（这步的关键之处在于CA公钥是从浏览器本地直接取得的，保证公钥绝对可信）。C端生成**非对称密钥c_pri、c_pub**，将c_pub用CA公钥加密后发给S端，保证发送后没有CA私钥的人无法拿到c_pub。

4. S端收到数据，用CA私钥解密得到c_pub，生成**对称密钥k**，用c_pub加密k后发送给C端，保证发送后没有c_pri的人无法拿到k。

5. C端收到数据，用c_pri解密得到k，因为c_pub只有S端知道，而只有c_pub加密的内容才能被c_pri正确解密，所以当c_pri解密出一个有效密钥时，可以认为此密钥的来源可信。

6. C端和S端可以用这个k来进行加密通信了。

## HTTP2

改进点：

1. 编码方式：文本 => 二进制
2. 多路复用：一个tcp连接中同时发起多个http请求，而不是一个http请求完毕才能发下一个
3. 头部压缩：客户端/服务端都维护一个headers索引表，请求不再每次都带上完整headers
4. 主动推送：可以在客户端请求html时，把相关css、js也一并推送（需要服务端配置）

区分HTTP：

HTTP2的headers风格是（冒号+）全小写+连字符，比如`:method`、`user-agent`等，HTTP1的风格是首字母大写+连字符。

HTTP2必须基于HTTPS。

## websocket

和http一样基于tcp，http协议的升级

tcp连接（连接实例称为socket）建立后，客户端发送http格式的报文`{ Connection: Upgrade, Upgrade: websocket, ... }`，服务端如果支持，也返回类似的确认报文，双方都对这个socket做好全双工通信的准备，即websocket连接建立。

### socket

套接字，可以理解为一个连接的实例，
比如说服务端客户端建立起一个tcp连接，那么两端各会有一个socket实例，可以对其调用各种方法来收发信息。

## QUIC

## 七层模型

应用：http

会话：ssl/tls

传输：tcp/udp

网络：ip

## 跨域

http header(cors)

iframe

jsonp

nginx转发


## 单点登陆（SSO）

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