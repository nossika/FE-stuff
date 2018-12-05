# web性能分析/优化

定位：chrome的network、performance、memory

解决：

dns：cdn

缓存：response header、打包配置

文件粒度：打包配置

业务代码：结合框架特性

长列表：分段加载（避免单线程阻塞）、只可视区域数据（避免建立多余dom）

http2

window.performance：measure、mark
