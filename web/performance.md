## 分析工具

chrome的network、performance、memory

### 首次渲染指标

DOMContentLoaded

onload

首次绘制（First Paint，FP）

首次内容绘制（First Contentful Paint，FCP）

首次有意义绘制（First Meaningful Paint，FMP）

首次交互（Time to First Interactive，TTFI）

## 优化方式

dns：cdn

缓存：response header、打包配置

文件粒度：打包配置

业务代码：结合框架特性

长列表：分段加载（避免单线程阻塞）、只可视区域数据（避免建立多余dom）

http2

window.performance：measure、mark



