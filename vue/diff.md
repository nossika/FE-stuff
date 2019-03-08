
# vue/react差异

vue比react的封装程度更高（也更依赖于语言特性），提供了更多简单友好的API，但也隐藏了底层的实现。

写法上，vue为webcomponent、声明式；react为all in js、函数式。

vue封装了便捷的v-model、computed等，API依赖程度也高（实现HOC需要借助mixin）；react中这些功能需要自行实现，但也更贴近JS的运用（JS高阶函数直接实现HOC）。

vue加上了对数据的监听（类似于react加了mobx）来自动触发更新，但对数据层有侵入（改写了setter且依赖于JS的getter/setter特性）；react纯作用于视图层。

vue使用了promise/setTimeout等JS语言的特性来优化批量更新；react则使用事务来完成。

社区上，vue官方提供各种库，不需要选择；react自行选择第三方库，灵活性更高，选择成本也高。



