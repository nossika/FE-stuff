# 组件通信

## 父传递信息给子

props

## 子传递信息给父

以信息为参数调用 props 传过来的函数（作用域在父层）

## 父访问子

ref

## 子访问父

需间接实现，先用父 props 传递this实例给子，子再通过此this访问父

## 跨层级

祖先 Context.Provider + 子孙 Context.Consumer

借助第三方库(redux, mobx, rx等)