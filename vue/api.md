
# API

## v-if vs v-show

都是用于控制元素的显示隐藏，v-if是通过元素的渲染，v-show是通过元素的display。所以二者的适用场景为，v-show适合频繁在显示隐藏间切换的、内容少的的元素；v-if适合内容多的、不需要在初次渲染就展示出来的元素。

## slots

slot-scope用法

```html
<!--组件-->
<div>
  <slot name="a" :id="123"/>
</div>

<!--页面-->
<div>
  <div slot="a" slot-scope="d">{{d.id}}</div>
</div>
```

$slots返回值（render函数）

## computed

## watch

## scoped style

## mixins

## Vue.directive

## $parent/$children

