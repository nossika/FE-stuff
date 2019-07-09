# 性能

## 分析工具

chrome-devtools: network、performance、memory

### 首次渲染指标

DOMContentLoaded

onload

首次绘制（First Paint，FP）

首次内容绘制（First Contentful Paint，FCP）

首次有意义绘制（First Meaningful Paint，FMP）

首次交互（Time to First Interactive，TTFI）

## 优化点

### 网络性能

传输效率：cdn

缓存设置：response header、打包配置

文件粒度：打包配置

协议：HTTP2、QUIC

### 渲染性能

框架：结合框架特性，减少diff，render等操作

长列表：分段加载、只渲染可视区域数据

其他渲染优化点：详见[【浏览器渲染】](/htmlcss/render.html)



