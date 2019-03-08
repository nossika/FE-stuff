
# 原理相关

## 从data改变到view变化经历的过程

初始化 为obj每个属性建立getter/setter，挂载新dep

初次渲染 利用触发getter绑定watcher到dep

数据变化 setter触发dep中的watcher，watcher触发更新

更新 virtual dom，snabbdom diff，patch

## dom-diff

代码分离了diff和patch的逻辑，先基于vnode进行diff，再根据diff结果进行实际的patch操作，patch在不同的终端上有不同实现，但diff是统一的逻辑。

传统dom-diff的时间复杂度为O(n<sup>3</sup>)

- 只在新老dom的同一层级的节点比较，且对每个节点只遍历一次。实际业务中很少有跨层级移动节点的情况。
- 新老节点如果类型/key不同，直接当做新建节点处理，不会再继续往下比较。大部分情况下，不同节点有不同内部的结构。

基于此两点优化算法后，dom-diff的时间复杂度为O(n)，牺牲对比的准确性来换取性能（有时即使原节点存在，也会因没匹配到而重新创建）。

### 算法实现

vue中的diff算法基于开源的snabbdom修改而来，实现如下：

1. 在新老vnode列表的头尾部各设置1个指针，总共4个指针：newStart/newEnd/oldStart/oldEnd

2. 对这4个指针指向的vnode进行如下对比

  - 如果newStart和oldStart的vnode同类型（包括key、tag等），那么复用oldStart对应的节点，对其递归diff，然后newStart++、oldStart++

  - 如果newEnd和oldEnd的vnode同类型，那么复用oldEnd对应的节点，对其递归diff，然后newEnd--、oldEnd--

  - 如果newStart和oldEnd的vnode同类型，那么复用oldEnd对应的节点，并将其移动到oldStart对应的节点之前，对其递归diff，然后newStart++、oldEnd--

  - 如果newEnd和oldStart的vnode同类型，那么复用oldStart对应的节点，并将其移动到oldEnd对应的节点之后，对其递归diff，然后newEnd--、oldStart++

  - 如果newStart的vnode有key值且能找到到key对应的oldVnode，且同类型，那么复用oldVnode对应的节点，并将其移动到oldStart对应的节点之前，对其递归diff，然后newStart++

  - 如果上述条件都不成立，那么直接根据newStart的vnode创建一个新节点，插入到oldStart对应的节点之前，然后newStart++

3. 重复步骤2，直到oldStart > oldEnd 或者 newStart > newEnd 时，进入步骤4

4. 此时有两种情况

  - 如果是oldStart > oldEnd，那么将newStart和newEnd之间的vnode都创建为新节点，插入到oldEnd之前

  - 如果是newStart > newEnd，那么将oldStart和oldEnd之间的节点都作为废弃节点删除掉

5. 整个diff操作完成

### 例子

old: a b c d e

new: b c d f 

todo

## watcher与响应式更新

data每个prop的setter与组件的watcher关联，prop变化时，通知组件的watcher来重新执行render。后面再对新老render生成的vdom进行diff，来更新dom。

vue1: 在初次编译时遍历dom节点，新建watcher将dom节点与data里对应的prop的setter关联，prop变化时，通过此watcher直接更新对应的dom节点。此方法dom更新效率更高（直接更新目标dom，省去了diff过程），但初始化时间长（创建watcher与dom的一一关联）、占用内存高（内存里保留了dom的引用）、watcher和浏览器环境的dom耦合。

## dep.target

正常：data监听setter和绑定dep，编译模板时AST解析调用了哪些data属性，去给它们添加dep

Vue：data还监听了getter，编译模板时会触发getter，getter里通过target判断是否处于编译中，是的话把target指向的watcher添加到对应的dep，编译前后会改写target

## nextTick

（内部实现micro：Promise，macro：MessageChannel、setTimeout）

定义microFunc macroFunc

执行nextTick时，推入callbacks并触发一次（根据pending变量判断）在下轮执行flushCallbacks

flushCallbacks清空callbacks，依次执行callbacks（先清空来保证出现nextTick嵌套时的执行次序）

数据变动优先使用micro，可以在一轮事件循环内改变完data，只触发一次重渲染

## computed

vue中的computed具有缓存和懒计算。

实现：

每个computed属性会建立一个watcher对应。

在被使用时（getter触发时）进入computedGetter，根据watcher.dirty的值 true/false 决定 重新计算/返回缓存。

第一次被使用时，默认watcher.dirty为true，触发computed计算，并收集计算中用到的依赖（把自身关联到依赖的watcher通知列表），并存下本次计算的value值。

当有依赖发生改动时，该computed的watcher.dirty会被设置为true，下次该computed被使用时就会被重新计算并缓存value，再把dirty重置为false。


## 源码结构

core/instance 定义Vue，定义原型属性

core/globalAPI 定义静态属性

platform 平台化包装导出（runtime & with-compiler）

core/lifecycle  初始化实例的生命周期，callHook

### runtime & with-compiler 