
# JS（DOM）

### addEventListener参数

冒泡、捕获，

阻止冒泡

### attribute操作，class操作


### NodeList & HTMLCollection

Node.childNodes & Node.children

HTMLCollection不同：只包含elementNode（无textNode）、动态更新、namedItem方法

### CSSStyleDeclaration

CSSStyleDeclaration.setProperty('--color', 'red')

### repaint & reflow

repaint: transform/visibility/background

### 判断元素是否在可视区域

1. el.getBoundingClientRect
2. 计算坐标

### 计算元素在页面上的坐标

    let top = 0, left = 0;
    while (el && el !== document) {
      top += el.offsetTop || 0;
      left += el.offsetLeft || 0;
      el = el.offsetParent;
    }
    
