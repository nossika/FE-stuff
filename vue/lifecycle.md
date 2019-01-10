
# 生命周期

## 执行顺序

### 组件新建

- beforeCreate()
- created()
- beforeMount()
- mounted()

### 组件更新

- beforeUpdate()
- updated()

### 组件卸载

- beforeDestroy()
- destroyed()

## keep-alive

`keep-alive`标签内部的组件即使`v-if`为false从dom上被卸载，其实例也不会被销毁，当再次转为true时直接再次以这个实例渲染，其之前状态都会被保留。

激活时
- activated()

停用时
- deactivated()

## $nextTick

作用

可否用setTimeout替代
