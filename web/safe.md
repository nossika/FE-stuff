# 安全

## XSS
信任用户输入且输出到页面时未转义，恶意用户的script（也可能是img的onload等）被渲染到正常用户的页面上执行。1、转义。2、meta：Content-Security-Policy（限制资源来源、请求的）

### CSP

内容安全策略，可以限制网站只加载可信来源的内容。


- 在HTTP的response中加上Content-Security-Policy的header


    Content-Security-Policy: content


- 或者在HTML头部设置http-equiv="Content-Security-Policy"的meta标签


    <meta http-equiv="Content-Security-Policy" content=""/>


## CSRF
信任请求，第三方网站发起到cookie的本站请求。1、加上无法跨页获取的token(dom注入、setcookie手动取出)。2、cookie的SameSite

？？dom注入的话，外域可以先ajax请求页面（一般页面不会有限制？）拿到dom，再拿token去发出恶意api？？

## SQL注入

## DDoS

## WAF

## 网络劫持

dns劫持、页面内容篡改

解决方案：https

> 详见[【Web/HTTPS】](/web/protocol?id=https)

## 内容加密

密钥：对称加密、非对称加密

算法：RSA、ECC

RSA算法详见[【RSA加密】](/algorithm/concept?id=rsa加密)
