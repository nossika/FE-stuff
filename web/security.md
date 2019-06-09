# 安全

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

解决方案：https

> 详见[【Web/HTTPS】](/web/protocol.html#https)

## 内容加密

密钥：对称加密、非对称加密

算法：RSA、ECC

RSA算法详见[【RSA加密】](/algorithm/concept.html#rsa加密)
