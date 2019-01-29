# 综合

## 输入url => 页面展示

* 缓存查询
* dns
* 打开tcp（tcp/ip协议）
后台负载均衡
* browser主进程发起请求 => 结果转交给render进程（tab页进程）处理
浏览器多进程（主进程，tab页，GPU等），tab页多线程（js引擎、GUI渲染、http请求、定时器、事件调度等）

* 渲染（DOM树，CSS树，render树）
js解析会中断渲染（GUI渲染线程与js线程互斥）

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

