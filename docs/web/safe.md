# 安全

## XSS
信任用户输入且输出到页面时未转义，恶意用户的script（也可能是img的onload等）被渲染到正常用户的页面上执行。1、转义。2、meta：Content-Security-Policy（限制资源来源、请求的）

## CSRF
信任请求，第三方网站发起到cookie的本站请求。1、加上无法跨页获取的token(dom注入、setcookie手动取出)。2、cookie的SameSite

？？dom注入的话，外域可以先ajax请求页面（一般页面不会有限制？）拿到dom，再拿token去发出恶意api？？

## SQL注入

## DDoS

## WAF

## 网络劫持

dns劫持、页面内容篡改

解决方案：https

> 详见[【web/web协议/https】](/web/protocol?id=https)

