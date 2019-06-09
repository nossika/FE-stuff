
# Vue vs React

## 相同点

- 视图层类库

- 组件化，可复用可组装

- 虚拟DOM，都是O(n)的diff效率


## 写法

- vue：webcomponent、声明式，开发简单但隐藏了实现细节；react：all in js、函数式，灵活可控。

- 声明式的vue对框架API依赖程度也高，比如模板里需要依赖v-for、v-if，实现HOC需要借助mixin；react中则更贴近JS的运用，模板可用JS自行控制，HOC可用高阶函数直接实现。

## 性能

- vue依靠响应式更新，data与对应组件绑定，data变化只render绑定组件，不影响其父组件或子组件；react在state变化时，会从变化层组件开始往下做render，当页面结构复杂时需要手动做更精细的控制来保证性能。

## 上手

- vue比react提供了更多便捷的方法来方便业务开发，如v-model、computed、class名组装、scoped css等；react更精简，只关注视图渲染的核心功能。

- vue提供适用大部分场景的官方库；react自行选择第三方库，灵活性更高，选择成本也高。

- react-native社区成熟度高于weex。

## 对语言特性的依赖

- vue加上了对数据的监听（类似于react加了mobx）来自动触发更新，但对数据层有侵入（改写了setter且依赖于JS的getter/setter特性）；react纯作用于视图层。

- vue依赖promise/setTimeout（也是JS的语言特性）等来优化批量更新；react则把事件回调和生命周期函数都包裹在事务内来完成批量更新。



