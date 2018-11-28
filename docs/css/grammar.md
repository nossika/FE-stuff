# 语法

### CSS变量

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

### sass/less


#### sass

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

    

模块化

    @import "./path/to/common.scss"


