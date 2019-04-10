# 综合应用

## OAuth2.0

用户（浏览器端）、客户端（服务端）、第三方服务提供商（提供认证登陆和资源）

授权码模式:

1. 用户进入客户端，选择以第三方登陆，客户端将用户重定向到第三方(带有callback-url参数)。
2. 用户在第三方的页面上输入帐号密码完成登陆，第三方生成授权码，将用户重定向到刚才的callback-url回到客户端，并带上授权码参数。
3. 客户端接收到授权码，在后台向第三方发出请求，包含授权码和自身身份信息，第三方验证通过后，返回访问令牌给客户端。
4. 客户端将访问令牌与用户关联，此后客户端能通过该令牌请求第三方内容，即用户可在客户端上获取/操作自己在第三方的资源。

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

## 登陆

登陆的一种实现：

C

gen randomKey

encodeKey = psw

H(id+randomKey)

S

decodeKey = psw

decode id + randomKey

encodeKey = randomKey

gen syncKey

H(syncKey)

C 

decodeKey = randomKey

decode syncKey


票据的一种实现：

登陆后，服务端生成票据，传给客户端保存，票据中记录登陆序列。若客户端数据泄露被copy进行登陆，服务端序列增加，下次客户端再次登陆，则因为序列对不上要求客户端输入密码重新登陆，重新生成票据。
