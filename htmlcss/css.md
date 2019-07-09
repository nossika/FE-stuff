# CSS

## 布局方式

流式+float

flex

gird

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



## repaint & reflow

一般元素的css属性改变都会引发reflow&repaint，除了少数只触发repaint的属性: transform/visibility/background等。

浏览器一般也会对渲染做优化，对元素样式的修改都被推入队列，当一定时间或者累积一定数量时，才会对其进行一次批量处理，这样多次样式修改操作只需要一次reflow&repaint。

当访问一些布局相关的信息的API时，比如clientWidth、offsetWidth、scrollWidth、getComputedStyle()等，浏览器为保证获取到的数据正确，会立刻清空队列进行一次reflow&repaint。

> 详见[【浏览器渲染】](/htmlcss/render.html)

## 选择器优先级

当多条css规则的属性冲突时，以选择器合计优先级最高的那条规则为准。且直接定义在目标元素上的样式，永远高于从父级继承的（即使父级的那条规则优先级更高）。

1. !important
2. #id
3. 
  1. :hove
  2. [data="value"]
  3. .class
4. 
  1. ::before
  2. div

## CSS变量

变量定义和使用

```css
:root {
  --main-color: #ddd;
}

selector1 {
  --main-color: #ddd;
}

selector2 {
  background-color: var(--main-color);
}
```

元素使用的css变量如果在多个选择器中定义，遵从css选择器优先级规则，取对该元素优先级最高的选择器中的定义

## CSS Houdini

开放CSS的API给开发者，使得能够用编程的方式来控制渲染过程（layout/paint等）。

例如定义一个layout：

```js
registerLayout('my-display', class {
  static get inputProperties() {
    return ['width', 'height']
  }
  layout(children, constraintSpace, styleMap, breakToken) {
    // handle layout
  }
}
```

使用：

```scss
div {
  display: layout('my-display');
}
```

## 预处理器（如sass/less）

### sass

  嵌套

```scss
parent {
  background: #fff;
  &.red {
    background: red;
  }
  child {
    background: #eee;
  }
}
```

变量定义和使用

```scss
$main-color = #ddd

selector {
  background-color: $main-color;
}
```

函数定义和使用

```scss
@mixin rounded($radius: 4px) {
  border-top-left-radius: $radius;
  border-top-right-radius: $radius;
}

selector {
  @include rounded(6px);
}
```

模块化

```scss
@import "./path/to/common.scss"
```

## 后处理器（如PostCSS）

### 和预处理器区别

预处理器：高级语法css -> 普通css -> 发生产

后处理器：普通css -> 拓展后的普通css -> 发生产

两者结合使用：高级语法css -> 普通css -> 拓展后的普通css -> 发生产

## 移动端

### flexible方案

通过dpr来设置根节点的font-size + viewport的scale，页面使用设计图尺寸转换得到的rem，完成一个设计图到多种屏幕的适配

## 应用

### 元素居中

### 左边定宽右边自适应

flex、calc、absolute

### retina画0.5px

dpr（window.devicePixelRatio）+ `<mete name="viewport"/>`(initial-scale)

### 无限滚动的轮播图
