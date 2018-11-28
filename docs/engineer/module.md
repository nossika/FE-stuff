# 模块化

ESM / CJS / AMD / CMD  / UMD

### esm、cjs

import：编译时导入（静态），值引用，只读；

require：运行时导入（动态），值拷贝

循环引用区别

import()动态，返回promise。

### AMD、CMD

AMD：依赖前置，requireJS

CMD：依赖就近，seaJS

浏览器中用法：type="module"