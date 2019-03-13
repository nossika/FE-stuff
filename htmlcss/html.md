
# HTML



## script

integrity

defer、async

crossorigin

## link

## input

有哪些attribute

## label作用



## Web Components


相关API：Element.attachShadow & window.customElements

### 基本用法

1. 使用attachShadow定义组件（基于HTMLElement类）


    class RedText extends HTMLElement {
      constructor() {
        super();

        // 使用attachShadow创建shadowRoot，mode设为"open"表示允许从外部的el.shadowRoot来读取此shadowRoot
        const shadowRoot = this.attachShadow({ mode: 'open' });

        // 创建组件实例的DOM内容，这里的this指向未被改写前的原始组件（Element类型，可以使用this.innerHTML、this.attributes等API）
        const content = document.createElement('div');
        content.textContent = this.textContent;
        content.className = "text";

        // 创建样式，此样式仅被应用于此shadowRoot，可以用:host来修改组件顶层样式
        const style = document.createElement('style');
        style.textContent = `
        :host {
          display: block; 
          padding: 10px; 
        }
        .text {
          color: red;
        } 
        `;

        // 将DOM和样式加入shadowRoot
        shadowRoot.appendChild(content);
        shadowRoot.appendChild(style);
      }
    }
    

2. 通过customElements注册组件


    customElements.define('red-text', RedText);


3. 在HTML中使用组件


    <body>
      <red-text>hello world</red-text>
    </body>


渲染结果类似于：


    <body>
      <red-text>
        #shadow-root
          <div class="text">
            hello world
          </div>
          <style>
            :host {
              display: block; 
              padding: 10px; 
            }
            .text {
              color: red;
            } 
          </style>
      </red-text>
    </body>


### 使用 template & slot 的例子

1. 在HTML里定义一个template

    <body>
      <template id="my-template">
        <span>hello</span>
        <slot name="my-word"></slot>
      </template>
    </body>

2. 定义组件类并注册


    class myTemplate extends HTMLElement {
      constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        // 使用my-template的克隆副本，以多次复用
        const content = document.querySelector('#my-template').content.cloneNode(true);
        shadowRoot.appendChild(content);
      }
    }

    customElements.define('my-template', myTemplate);


3. 在HTML中使用组件


    <body>
      <my-template>
        <span slot="my-word">world</span>
      </my-template>
    </body>


渲染结果类似于：


    <body>
      <my-template>
        #shadow-root
          <span>hello</span>
          <span>world</span>
      </my-template>
    </body>


组件模板里的slot会被实例中name对应的slot元素替换，如果没有对应元素则不渲染此slot。



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
