# 综合

### 输入url => 页面展示

* 缓存查询
* dns
* 打开tcp（tcp/ip协议）
后台负载均衡
* browser主进程发起请求 => 结果转交给render进程（tab页进程）处理
浏览器多进程（主进程，tab页，GPU等），tab页多线程（js引擎、GUI渲染、http请求、定时器、事件调度等）

* 渲染（DOM树，CSS树，render树）
js解析会中断渲染（GUI渲染线程与js线程互斥）

