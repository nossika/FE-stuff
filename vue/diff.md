
# Vue vs React

## 相同点

- 视图层类库

- 组件化，可复用可组装

- 类MVC，隔离DOM操作

- 使用虚拟DOM，都是O(n)的diff效率

## 写法

- vue：webcomponent、声明式，开发简单但隐藏了实现细节；react：all in js、函数式，更灵活可控。

- 声明式的vue对框架API依赖程度也高，比如需要v-for、v-if等api来控制模板，父子组件嵌套时可能需要scope-slot划分父子组件作用域，实现HOC需要借助mixin；而react的模板语法JSX是基于JS的拓展，可直接用JS逻辑来控制条件和循环，父子组件嵌套时遵循JS作用域规则不需要特别处理，HOC可用高阶函数实现，处理起这些问题更灵活可控。

## 上手

- vue比react提供了更多便捷的方法来方便业务开发，如v-model、computed、class名组装、scoped css等；react更精简，只关注视图渲染的核心功能。

- vue提供适用大部分场景的官方库；react自行选择第三方库，灵活性更高，选择成本也高。

- 跨平台方面，react-native社区成熟度目前高于weex。

## 性能

- vue是响应式更新，data与对应组件关联，data变化只通知对应组件render，不影响其父或子组件，更新粒度更细、效率更高，但建立关联对初次渲染有性能损耗；react在state变化时，会从变化的组件那层开始往下递归render子树，当页面结构复杂时需要手动做更精细的控制（shouldComponentUpdate等）来保证性能。

## 其他

- vue加上了对数据的监听（类似于react加了mobx）来自动触发更新，但对数据层有侵入（改写了setter且依赖于JS的getter/setter特性）；react纯作用于视图层，不对数据侵入。

- vue依赖promise/setTimeout（也依赖了JS的语言特性）等来优化批量更新；react则把事件回调和生命周期函数都包裹在事务内来完成批量更新。



