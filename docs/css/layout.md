
# 布局

## 布局方式（float、flex、gird）

## 盒模型

一个元素的盒模型由 content + padding + border + margin 组成

设置border-box来改变盒模型的展示:

- content-box（默认）: 元素width/height的值就是其contnet宽度/高度
- border-box: 元素width/height的值是其content + padding + border三者之和

## BFC（块格式化上下文）

满足下列条件之一的元素会成为BFC：

- overflow: 非visible 
- float: 非none 
- position: absolute或fixed
- display: inline-block
- etc.

特性：

- 外部margin不合并（同属一个BFC的子元素间的margin会合并，当子元素自己也是BFC时则不合并）
- 内部清除浮动（高度不塌陷，内部的浮动元素可以撑开高度）
- 外部清除浮动（外部的浮动元素可能会挤开元素内文字造成环绕效果，设为BFC后内部文字就不再被挤开）

## 综合

### 左边定宽右边自适应多种实现

flex、calc、absolute

### retina 画0.5px

dpr（window.devicePixelRatio）+ `<mete name="viewport"/>`(initial-scale)

### 无限滚动的轮播图

#### gpu加速

> 详见[【web/浏览器渲染】](/web/browser?id=gpu加速)

