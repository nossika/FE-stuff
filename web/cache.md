# 缓存

#### 缓存位置：service worker、memory（关闭tab清空）、disk

#### 缓存顺序
：
SW内的fetch方法也遵守此规则

强制缓存：cache-control(max-age)、expires

协商缓存：e-tag、last-modified

#### no-store

除了no-store的情况，当前页多次同一资源的请求（无论同步异步）只会从网络获取一次，其余都从memory获取（且不显示在network），如果no-store，则多少请求就获取多少次