# 语法

## CSS变量

变量定义和使用

    :root {
      --main-color: #ddd;
    }

    selector1 {
      --main-color: #ddd;
    }

    selector2 {
      background-color: var(--main-color);
    }

元素使用的css变量如果在多个选择器中定义，遵从css选择器优先级规则，取对该元素优先级最高的选择器中的定义

## CSS Houdini

开放CSS的API给开发者，使得能够用编程的方式来控制渲染过程（layout/paint等）。

例如定义一个layout：

    registerLayout('my-display', class {
      static get inputProperties() {
        return ['width', 'height']
      }
      layout(children, constraintSpace, styleMap, breakToken) {
        // handle layout
      }
    }

使用：

    div {
      display: layout('my-display');
    }

## 预处理器（如sass/less）

### sass

  嵌套

    parent {
      background: #fff;
      &.red {
        background: red;
      }
      child {
        background: #eee;
      }
    }

变量定义和使用

    $main-color = #ddd

    selector {
      background-color: $main-color;
    }

函数定义和使用

    @mixin rounded($radius: 4px) {
      border-top-left-radius: $radius;
      border-top-right-radius: $radius;
    }

    selector {
      @include rounded(6px);
    }

模块化

    @import "./path/to/common.scss"

## 后处理器（如PostCSS）

### 和预处理器区别

预处理器：高级语法css -> 普通css -> 发生产

后处理器：普通css -> 拓展后的普通css -> 发生产

两者结合使用：高级语法css -> 普通css -> 拓展后的普通css -> 发生产


