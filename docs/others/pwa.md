
# PWA

对象：

作用域：sw.js相对路径下的client受控、该域同一时间只有一个sw

serviceWorker更新时机（检查sw，若改变则重新install）：页面初始化、手动reg.update()、触发了push等事件且24h未更新

skipWaiting：

不等老sw的client全部卸载，直接激活新sw

claim：

控制当前作用域还未被控制的client ？？

install：注册，一般cache在此时操作

active：激活

fetch：等sw active后才受控

缓存：

serviceWorker监听client的fetch，从cache判断命中

消息推送：

可视化消息

register返回registration对象，在此对象subscribe来注册

serviceWork监听push，调用registration的showNotification展示消息，client.postMessage推送给页面
