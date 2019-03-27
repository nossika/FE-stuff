


## addEventListener

捕获、冒泡

阻止冒泡

## attribute操作，class操作

## NodeList vs HTMLCollection

NodeList: Element.querySelectorAll('div') / Element.childNodes

HTMLCollection: Element.getElementsByTagName('div') / Element.children

HTMLCollection的特性

- 只包含elementNode（无textNode）
- 动态更新，当页面的元素更新时，此集合也会自动同步
- namedItem方法

## CSS Object Model


    const styleSheet: CSSStyleSheet = document.styleSheets[0];
    styleSheet.insertRule('h1 { font-weight: bold; color: green; }', 0);

    const styleRule: CSSStyleRule = styleSheet.cssRules[0];

    styleRule.style.setProperty('color', 'red');

    console.log(styleRule.cssText); // 'h1 { font-weight: bold; color: red; }'





## window.btoa / window.atoa

加密/解密base64

## window.navigator

userAgent 区分浏览器类型和环境
 
geolocation 获取地理位置（需要用户手动许可）

## 综合

### 判断元素是否在可视区域

el.getBoundingClientRect直接返回相对可视区域的offset

IntersectionObserver

结合页面scroll和元素相对页面的offset计算

### 计算元素在页面上的坐标

    let top = 0, left = 0;
    while (el && el !== document) {
      top += el.offsetTop || 0;
      left += el.offsetLeft || 0;
      el = el.offsetParent;
    }


    
