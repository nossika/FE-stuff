# 页面渲染

## 渲染过程

页面初次渲染时需要 1. parse HTML 2. DOM解析为DOM tree & CSS解析为CSSOM tree

DOM更新的渲染过程

1. **recalculate style**(style)：计算应用到各元素的css规则
2. **layout**：重新计算各元素位置（即reflow，当仅repaint时此步会跳过）
3. **update layer tree**(layer)：更新渲染树
4. **paint**：绘制元素
5. **composite layers**(composite)：把各个图层合成为最终结果

## 渲染时机

以chrome为例：

当JS修改了元素样式，不是立刻重新渲染，是把render flag标记为dirty，在**下一个渲染时机**执行完整渲染过程。

**渲染时机**一般为此轮事件循环的结束时，但如果此时距离上次渲染的时间点不足1帧（1帧一般为16.6ms，因环境而异），则推迟到1帧时间以后再渲染。原因是，这1帧时间内可能还有几轮事件循环，其中可能对样式再次修改，提前执行渲染是对性能的浪费。

有时渲染过程中的layout会被提前，而不是等到达渲染时机再执行。如果**同一轮事件循环里**修改了layout相关样式后，又**对layout相关属性进行了读取**，则浏览器会立刻执行recalculate style和layout来得出准确数据，但也只是提前了这2个步骤，后续步骤不影响。

渲染过程中的layout可能被跳过，比如对样式的修改不影响layout，只需repaint而不需reflow。


### 结合例子验证


创建一个div为例子：

    const div = document.createElement('div');
    div.style.cssText = 'width: 100px; height: 100px; background: red';
    document.body.appendChild(div);

    document.body.addEventListener('click', () => {
      // do some test...
    });


在click回调中分别使用不同代码来测试

1. setTimeout模拟多轮task

        div.style.height = 110 + 'px'; // step 1
        setTimeout(() => {
          div.style.height = 120 + 'px'; // step 2
            setTimeout(() => {
              div.style.height = 130 + 'px'; // step 3
            }, 0);
        }, 0);


![result](../resources/browser-render-screenshot/set-timeout.jpg)

在step 1当轮事件循环结束后，浏览器重新执行了完整的5步渲染过程。

然而step 2执行以后一直到step 3执行（即使step 2那轮的事件循环已结束），浏览器都没有执行渲染，直到step 3执行以后才再次渲染，因为step 2执行完距离step 1渲染完毕的时间还不到1帧，所以浏览器忽略了这次渲染（但DOM改动是生效的，只是没有渲染它）。

2. setTimeout + 强制layout

        div.style.height = 110 + 'px'; // step 1
        console.log(div.offsetHeight)
        setTimeout(() => {
          div.style.height = 120 + 'px'; // step 2
          console.log(div.offsetHeight)
            setTimeout(() => {
              div.style.height = 130 + 'px'; // step 3
              console.log(div.offsetHeight)
            }, 0);
        }, 0);


![result](../resources/browser-render-screenshot/set-timeout-force.jpg)

和第一种写法唯一不同的地方在于，每个step后面都加上了对layout的读取。结果不同的是，每次执行读取，浏览器都会强制提前执行style和layout来保证读取到正确的结果，其他步骤不变。

3. Promise模拟microTask

        div.style.height = 110 + 'px'; // step 1
        Promise.resolve().then(() => {
          div.style.height = 120 + 'px'; // step 2
          Promise.resolve().then(() => {
            div.style.height = 130 + 'px'; // step 3
          });
        });


![result](../resources/browser-render-screenshot/promise.jpg)

在带有microTask的情况中，step 1以及step 2、step 3（microTask）都执行完毕（当轮事件循环结束）后才进行渲染，其实和3步step同步执行的结果是一样的。

4. requestAnimationFrame

        div.style.height = 110 + 'px'; // step 1
        requestAnimationFrame(() => {
          div.style.height = 120 + 'px'; // step 2
          requestAnimationFrame(() => {
            div.style.height = 130 + 'px'; // step 3
          });
        });

![result](../resources/browser-render-screenshot/request-animation-frame.jpg)

使用requestAnimationFrame的情况中，step 1执行完毕后浏览器执行了style和layout，由于添加了requestAnimationFrame回调，则在本次页面绘制前（执行layer前）会先执行这个回调，执行完回调再继续执行layer、paint、composite。

但如果requestAnimationFrame里又新增了另一个requestAnimationFrame回调，这个新的回调会在下次绘制前执行，而非本次绘制。


## GPU加速

dom的绘制信息会被分成多个格栅上传GPU绘制。

浏览器会按规则把页面分为多个合成层，合成层上的变动只需重绘这个层。

### 创建合成层

某些情况下节点会被单独升级为合成层（比如：transform、opacity、canvas标签、手动加上will-change、有个比自己index低的合成层时 等），浏览器会独立绘制各个合成层，最后再复合而成最终页面，合成层内的dom变动只需要重绘这个层，更高效。

### 结论

- 尽量多用transform
- 在合理时机设置will-change
- 把合成层的index尽可能调高（避免自动创建不必要的合成层）
