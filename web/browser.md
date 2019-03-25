
# 浏览器

## 渲染

### 过程

* style（确定每个节点应用的css规则）
* layout（reflow，重新计算各个节点位置）
* update layer tree（确定层叠顺序））（render layer）
* paint（计算节点绘制信息）
* composite（合成层）（graphics layer）

### GPU加速

dom的绘制信息会被分成多个格栅上传GPU绘制。

某些情况下节点会被单独升级为合成层（比如：transform、opacity、canvas标签、手动加上will-change、有个比自己index低的合成层时 等），浏览器会独立绘制各个合成层，最后再复合而成最终页面，合成层内的dom变动只需要重绘这个层，更高效。

结论：

- 尽量多用transform
- 在合理时机设置will-change
- 把合成层的index尽可能调高（避免自动创建不必要的合成层）

### dom update 、 dom render
* dom update的修改和获取是实时的，dom render是非实时（一般在一轮循环中，task和microtask都执行完后render，不一定每轮，因为事件循环频率可能比浏览器帧率高）
* 所以vue使用promise.then来做dom更新，如果放在task里则下轮循环才更新
 
 	
## 进程与线程
		
进程是CPU分配资源的最小单位，线程是CPU调度的最小单位。一个进程内可有单或多个线程。

浏览器一般是多进程的应用。以chrome为例

包含进程有（shift+esc可查看）：
* 浏览器主进程
* GPU进程：GPU加速
* tab页进程：每个tab页对应一个进程
* 扩展程序（第三方插件）进程

页面进程中又包含多个线程：
* JS引擎线程
* GUI渲染线程：DOM渲染
* 事件控制线程：实现event loop
* 定时触发器线程：setTimeout、setInterval等计时器
* 网络请求线程：如http请求
* webWorker线程（sharedWorker线程归属浏览器主进程）

JS线程与GUI线程互斥（一个执行时另一个会被挂起），以保证JS中获取的DOM是最新的。

