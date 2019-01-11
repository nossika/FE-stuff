
# HTML



## script

integrity

defer、async

crossorigin

## link

## input

有哪些attribute

## label作用

## CSP


## web component

在JS中向customElements注册组件

    class RedText extends HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const container = document.createElement('div');
        const style = document.createElement('style');
        container.textContent = this.textContent;
        style.textContent = `span { color: red }`;
        shadow.appendChild(style);
        shadow.appendChild(span);
      }
    }

    customElements.define('red-text', RedText);

在HTML中使用已注册组件

    <div>
      <red-text>hello world</red-text>
    </div>


## blob

### blob 、dataURL

#### blob

提供内存地址，数据保存在页面内存

`new Blob([...data],  {...options})` 自动垃圾回收

`URL.createObjectURL(file)` 用URL.revokeObjectURL手动回收

#### dataURL

用编码（比如base64字符串）显式表示文件

`new FileReader().readAsDataURL`

## canvas

### canvas

### webgl
