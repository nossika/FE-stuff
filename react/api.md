# API

## Hooks

用法：

```jsx
// version 16.7

function Example() {
  // 定义state中的某个字段和修改该字段的方法
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    // 执行带副作用的逻辑，如绑定事件
    // 初次mount和每次render都会调用
    const subscription = message$.subscribe();

    // 可以返回一个函数来消除副作用，如解绑事件    
    // 每次render前都会调用（如果useEffect使用了第二个参数指定依赖，则只在依赖变化时调用），来消除上个副作用，当然在卸载时也会调用
    return () => {
      subscription.unsubscribe();
    };
  });

  // 使用useCallback缓存click回调函数，避免组件更新时不必要的diff
  const onClick = React.useCallback(() => {
    setCount(count + 1);
  }, [count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={onClick}>
        Click me
      </button>
    </div>
  );
}
```

Hooks相比传统的class组件写法：


- 去掉生命周期的概念，不再关心组件处于didMount还是didUpdate中，副作用统一放到useEffect管理。
- 去掉类和实例的概念，不再使用this，不再用实例来保存状态。（把状态转移到fiber上，详见[【Hooks实现】](/react/principle.html#hooks实现)）。
- 组件状态粒度更细，useState使“状态”与“修改状态的逻辑”配对，而非统一用一个大的state和setState来管理，使state能以更细的粒度划分管理。
- 事件配对，useEffect把“绑定事件”和“解绑事件”配对，而非把两者分散写到didMount和willUnmount中，使相关代码能够以更统一的方式组织。


## Lazy/Suspense

```jsx
// version 16.6

// import()返回一个promise，加载完毕后将结果作为promise的resolve结果
const OtherComponent = React.lazy(() => import('./OtherComponent'));

// Suspense内有lazy组件在加载中时，隐藏children显示fallback内容，加载完毕后再显示children
function MyComponent() {
  return (
    <div>
      <React.Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </React.Suspense>
    </div>
  );
}
```

可以手动实现lazy和suspense组件：在lazy中抛出一个异常，此异常为一个promise，文件加载完毕后将内容作为promise的resolve结果；suspense层定义didCatch来捕获这个promise，默认用fallback内容展示，在promise.then中把内容修改为children。

## Context

```jsx
// version 16.3
// 定义Context
const MyContext = React.createContext(defaultValue);

// 祖先层
<MyContext.Provider value={/* some value */}>
  {/* render something */}
</MyContext.Provider>

// 使用层
<MyContext.Consumer>
  {value => /* render something based on the context value */}
</MyContext.Consumer>
```

相比老context用法

- 更符合分形思想，consumer使用前需显式指明依赖的context，而非在consumer内部直接使用this.context
- 可穿透shouldUpdateComponent，provider变化时通知对应的consumer重渲染，而非依赖父组件的render


## setState

一次DOM reconciliation调用setState多次，state非立刻变化

transaction模型，batchedUpdates(ReactDOM.unstable_batchedUpdates)

> 详见[【setState的异步】](/react/principle.html#setstate的异步)

## pureComponent/memo

相当于在普通component的基础上，自动添加shouldUpdateComponent函数，该函数对当前props/nextProps以及当前state/nextState进行浅比较（比较对象的第一层），有改变就返回true，否则返回false跳过组件更新。

memo和pureComponent是同样的用途，只不过memo是用于处理函数式组件。在一次更新中，如果组件树传递给这块组件的props未改变，则不去调用此函数，直接复用之前的结果。