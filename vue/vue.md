# Vue

### 组件通信

prop

emit

bus、vuex等第三方数据管理库

watch

ref

broadcast+dispatch（vue1）

### 生命周期

### vuex 数据流

action异步，mutation同步

弊端：action意义不大

### $nextTick

作用

可否用setTimeout替代

### v-if & v-show

用法，场景

### 父调子

ref、props+watch

### 实现tel格式的input（133 1234 1234）

### 从data改变到view变化经历的过程

初始化 为obj每个属性建立getter/setter，挂载新dep

初次渲染 利用触发getter绑定watcher到dep

数据变化 setter触发dep中的watcher，watcher触发更新

更新 virtual dom，snabbdom diff，patch

### watcher和virtual dom结合

vue1: 每条data一个watcher，绑定到data对应的dom，data变化直接更新到dom，粒度细
vue2的vdom：每条data一个watcher，每个组件也一个watcher，data只绑定到组件，data变化通知组件的watcher重新渲染，粒度适中

### runtime & with-compiler

### slots

slot-scope用法（子：`<slot name="a" :params="params"/>`，父：`<div slot="a" slot-scope="p">{{p}}</div>`）

$slots返回值（render函数）

### css scope

### mixins

### Vue.directive

### 大列表优化 

### SSR

生命周期只执行到created且不能有浏览器独有api

### dom diff

基于snabbdom，头尾双指针，o(n)，牺牲对比精度换取时间(更贴近数组实际操作而非完全乱序)，有key的情况

### 源码学习

#### 结构

core/instance 定义Vue，定义原型属性

core/globalAPI 定义静态属性

platform 平台化包装导出（runtime & with-compiler）

core/lifecycle  初始化实例的生命周期，callHook

架构是随着项目发展调整的，commit记录

#### dep.target

正常：data监听setter和绑定dep，编译模板时AST解析调用了哪些data属性，去给它们添加dep

Vue：data还监听了getter，编译模板时会触发getter，getter里通过target判断是否处于编译中，是的话把target指向的watcher添加到对应的dep，编译前后会改写target

#### nextTick

（内部实现micro：Promise，macro：MessageChannel、setTimeout）

定义microFunc macroFunc

执行nextTick时，推入callbacks并触发一次（根据pending变量判断）在下轮执行flushCallbacks

flushCallbacks清空callbacks，依次执行callbacks（先清空来保证出现nextTick嵌套时的执行次序）

数据变动优先使用micro，可以在一轮事件循环内改变完data，只触发一次重渲染

#### computed

vue中的computed具有缓存和懒计算。

实现：

每个computed属性会建立一个watcher对应。

在被使用时（getter触发时）进入computedGetter，根据watcher.dirty的值 true/false 决定 重新计算/返回缓存。

第一次被使用时，默认watcher.dirty为true，触发computed计算，并收集计算中用到的依赖（把自身关联到依赖的watcher通知列表），并存下本次计算的value值。

当有依赖发生改动时，该computed的watcher.dirty会被设置为true，下次该computed被使用时就会被重新计算并缓存value，再把dirty重置为false。

### vue/react差异

写法：webcomponent / all in js

MVC：数据层侵入 / 纯视图

数据管理：便捷的v-model、computed / 单向、immutable的数据流

库：官方库 简单 / 第三方库 灵活 复杂
