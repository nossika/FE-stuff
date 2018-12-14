# blob

### blob 、dataURL

#### blob

提供内存地址，数据保存在页面内存

`new Blob([...data],  {...options})` 自动垃圾回收

`URL.createObjectURL(file)` 用URL.revokeObjectURL手动回收

#### dataURL

用编码（比如base64字符串）显式表示文件

`new FileReader().readAsDataURL`
