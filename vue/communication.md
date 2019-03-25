
# 组件通信

## 父传递信息给子

父设置 props + 子 props/$attr

父设置 props + 子 watch 监听

## 父访问子

$ref

vm.$children[childIndex]

## 子传递信息给父

子 vm.$emit + 父设置 v-on 监听

## 子访问父

vm.$parent

## 跨层级传递

祖先 provide + 子孙 inject

$on + $emit：在某实例设置vm.$on，传递实例vm，利用vm.$emit传递事件

bus（新建一个Vue实例来传递事件，即$on + $emit的一种普遍用法）

VueX

