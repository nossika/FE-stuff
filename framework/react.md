# React

## 组件通信

### 父传递信息给子

props

### 子传递信息给父

以信息为参数调用 props 传过来的函数（作用域在父层）

### 父访问子

ref

### 子访问父

需间接实现，先用父 props 传递this实例给子，子再通过此this访问父

### 跨层级

祖先 Context.Provider + 子孙 Context.Consumer

借助第三方库(redux, mobx, rx等)


## 生命周期

### 执行顺序

#### 组件新建

- constructor()
- static getDerivedStateFromProps()
- render()
- componentDidMount()

#### 组件卸载

- componentWillUnmount()

#### 组件更新 && 组件内执行setState

- static getDerivedStateFromProps()
- shouldComponentUpdate()
- render()
- getSnapshotBeforeUpdate()
- componentDidUpdate()

#### 对组件执行forceUpdate

- static getDerivedStateFromProps()
- render()
- getSnapshotBeforeUpdate()
- componentDidUpdate()

### 执行顺序（before v16.3）

#### 组件新建

- constructor()
- UNSAFE_componentWillMount()
- render()
- componentDidMount()

#### 组件卸载

- componentWillUnmount()

#### 组件更新

- UNSAFE_componentWillReceiveProps()
- shouldComponentUpdate()
- UNSAFE_componentWillUpdate()
- render()
- componentDidUpdate()

#### 组件内执行setState

- shouldComponentUpdate()
- UNSAFE_componentWillUpdate()
- render()
- componentDidUpdate()

#### 对组件执行forceUpdate

- UNSAFE_componentWillUpdate()
- render()
- componentDidUpdate()

### componentDidCatch

## API

### Hooks

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
- 去掉类和实例的概念，不再使用this，不再用实例来保存状态。（把状态转移到fiber上，详见[【Hooks实现】](#hooks实现)）。
- 组件状态粒度更细，useState使“状态”与“修改状态的逻辑”配对，而非统一用一个大的state和setState来管理，使state能以更细的粒度划分管理。
- 事件配对，useEffect把“绑定事件”和“解绑事件”配对，而非把两者分散写到didMount和willUnmount中，使相关代码能够以更统一的方式组织。


### Lazy/Suspense

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

### Context

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


### setState

一次DOM reconciliation调用setState多次，state非立刻变化

transaction模型，batchedUpdates(ReactDOM.unstable_batchedUpdates)

> 详见[【setState的异步】](#setstate的异步)

### pureComponent/memo

相当于在普通component的基础上，自动添加shouldUpdateComponent函数，该函数对当前props/nextProps以及当前state/nextState进行浅比较（比较对象的第一层），有改变就返回true，否则返回false跳过组件更新。

memo和pureComponent是同样的用途，只不过memo是用于处理函数式组件。在一次更新中，如果组件树传递给这块组件的props未改变，则不去调用此函数，直接复用之前的结果。

## 原理相关


### Hooks实现

class组件的状态保存在实例上，但Hooks实现的组件看起来是个纯函数，内部的状态却也可以保存，比如下面例子中，每次点击button都会重新调用函数App，而App内的count可以正确计数，不会因重新调用App而重置。

```jsx
function App() { // 每次render都会调用App
  const [count, setCount] = React.useState(0); // 多次调用中，count值可以累加
  return (
    <div>
      <p>count: {count}</p>
      <button onClick={e => setCount(count + 1)}>count + 1</button>
    </div>
  );
}

ReactDOM.render(
  <App/>,
  document.querySelector('#app'),
);
```

因为组件中的Hook函数被调用时，经React内部处理，状态被保存在**组件的FiberNode**中，在其memoizedState属性以**链表**形式依次保存每个Hook对应的状态；组件下次render时，按序取出状态和各个Hook**一一对应**，即实现状态保存。这也是Hook函数不能写在条件或循环中的原因，因为同个组件中的每次render必须保证各Hook调用的**顺序一致**，否则对应关系就乱了。

> FiberNode详见[【FiberNode】](#fibernode)。

### Fiber

任务分片，任务优先级，基于requestIdleCallback、requestAnimationFrame

#### FiberNode

FiberNode把React组件中原本用JSON树来表示DOM的方式改成了用**链表**来表示，DOM树的遍历由递归展开遍历变成了**线性遍历**，便于遍历的中断和继续。

组件的FiberNode可以通过React element的\_owner属性访问到，但必须是通过React的render方法调用JSX生成的React element，手动调用JSX生成的React element的\_owner属性为null。

```jsx
function App() {
  const vDOM = <div>test</div>; // 返回_owner为FiberNode的React element
  return vDOM;
}

const vDOM2 = <div>test</div>; // 返回_owner为null的React element

ReactDOM.render(
  <App/>,
  document.querySelector('#app'),
);
```

FiberNode通过sibling、child、return这3个指针，把DOM的树形结构转化为链表结构

- child：第一个子节点
- sibling：下一个兄弟节点
- return：父节点

对某节点遍历过程：

1. 访问目标节点。
2. 若该节点已被访问过，访问return，回到1。
3. 处理该节点，并且打上访问标记。
4. 若该节点有未访问过的child，先访问child，回到1。
5. 若该节点有未访问过的sibling，去访问sibling，回到1。
6. 访问该节点的return，回到1。

从某根节点开始遍历，最后回到根节点本身时，对根节点的遍历结束。


### setState的异步

```jsx
class Comp extends React.Component {
  state = {
    count: 1,
  };
  componentWillMount () {
    console.log(this.state.count); // 1
    this.setState({
      count: this.state.count + 1,
    });
    console.log(this.state.count); // 1
    this.setState({
      count: this.state.count + 1,
    });
    console.log(this.state.count); // 1
  }
  render () {
    return null;
  }
}

ReactDOM.render(<Comp/>, document.querySelector('#app'));
```

大家都知道以上打印结果是因为setState是异步执行，但是如果把setState放到组件外
	
```jsx
class Comp extends React.Component {
  state = {
    count: 1,
  };
  componentWillMount () {
    window.comp = this;
  }
  render () {
    return null;
  }
}

ReactDOM.render(<Comp/>, document.querySelector('#app'));

setTimeout(() => {
  console.log(comp.state.count); // 1
  comp.setState({
    count: comp.state.count + 1,
  });
  console.log(comp.state.count); // 2
  comp.setState({
    count: comp.state.count + 1,
  });
  console.log(comp.state.count); // 3
});
```

修改后的代码state的结果变了，setState似乎变成了同步执行。

这是因为组件初始化时，React对其内部的函数都进行了一层**包装**，变成 initialize => perform（你自己写的代码） => ending 的形式，这个起止过程就是一个**transaction**。调用setState时如果发现正**处于transaction中**，它并不会立即修改state，而是推到一个缓存数组中，在ending时一并执行，造成异步的效果。而如果把这段代码放到React组件外部就失去了transaction封装，从而使setState一执行就立即修改state。

可以通过Reace提供的batchedUpdates手动包装一个transaction

```jsx
class Comp extends React.Component {
  state = {
    count: 1,
  };
  componentWillMount () {
    window.comp = this;
  }
  render () {
    return null;
  }
}

ReactDOM.render(<Comp/>, document.querySelector('#app'));

setTimeout(() => {
  ReactDOM.unstable_batchedUpdates(() => {
    console.log(comp.state.count); // 1
    comp.setState({
      count: comp.state.count + 1,
    });
    console.log(comp.state.count); // 1
    comp.setState({
      count: comp.state.count + 1,
    });
    console.log(comp.state.count); // 1	  
  });
});
```

这样就回到了大家熟悉的结果。

顺带一提，这种对函数加层包装使其处于特殊环境中执行的做法，在vue中也有运用，比如vuex中的_withCommit，用于判断state的修改是来自mutation还是外部直接修改。

### DOM-diff

JSX => JS => ReactElement => diff

1. JSX源代码

```jsx
render() {
  return (
    <section className="wrapper">
      <Header type={1}>Hello World</Header>
      <p>This</p>
      is JSX
    </section>
  )
}
```

2. 经过babel编译后的代码

```jsx
render() {
  return (
    React.createElement(
      'section',
      { className: 'wrapper' },
      React.createElement(
        Header,
        { type: 1 },
        'Hello World',
      ),
      React.createElement(
        'p',
        null,
        'This',
      ),
      'is JSX',
    );
  );
}
```

3. 执行render()后的返回值为React element（用JSON表示的DOM树），数据格式类似如下

```js
{
  type: 'section',
  props: {
    className: 'wrapper',
    children: [
      {
        type: Header,
        props: {
          type: 1,
          children: 'Hello World',
        },
      },
      {
        type: 'p',
        props: {
          children: 'This',
        },
      },
      'is JSX',
    ],
  },
}
```

4. 把React element渲染为真实DOM

在ReactDOM.render初次渲染时，ReactDOM把React element转化为真实的DOM渲染到页面：遇到文本节点、type为原生DOM的节点可直接转化，遇到type为组件类型的节点则通过组件函数（class组件用实例的render返回值，函数组件用函数返回值，返回值里若还有组件类型则继续递归，最后总会以原生DOM或者文本节点结束）来创建DOM。

状态更新时，则通过更新前后虚拟DOM的diff比较，来按需更新真实DOM。

> diff实现上，React因为Fiber用链表来表示DOM树，是对链表遍历而非对树遍历，但diff的策略和Vue大致相同，可以参考[【DOM-diff（Vue）】](./vue.md#dom-diff)。


### React element中的Symbol

React element的$$typeof是一个Symbol类型的值。

因为React组件在render时，允许传递一个React element对象作为参数。

```jsx
render() {
  // ...
  return <div>{ data }</div>;
}
```

这个data的值可以是string，也可以是一个React element结构的对象。

比如data用jsx表示：

```jsx
data = <div>hello</div>;
```

当运行时，data的值会生成为React element，类似如下结构：

```jsx
data = {
  type: 'div',
  props: {
    children: 'hello',
  },
};
```

直接使用如果此对象去渲染的话，当data是从服务端获取的any类型，且此值来自用户的输入，则用户可以构造出一个React element植入html到他人的页面，带来安全问题。如果在React element中增加一个无法被序列化的标记（Symbol、Function、Set等均可），来表示其是在客户端的代码里生成的，通过判断此标记来决定是否渲染这个React element，则可以防止此问题发生。



### 事件合成

```jsx
class App extends React.Component {
  innerClick = e => console.log('react inner');
  outerClick = e => console.log('react outer');
  componentDidMount() {
    document
      .querySelector('#outer')
      .addEventListener('click', e => console.log('native outer'));

    window.addEventListener('click', e => console.log('native window'));
  }
  render() {
    return (
      <div id="outer" onClick={this.outerClick}>
        <div id="inner" onClick={this.innerClick}>
          click me
        </div>
      </div>
    );
  }
}

// output:
// 1. 'native outer'
// 2. 'react inner'
// 3. 'react outer'
// 4. 'native window'
```

React**在真实的document节点**监听真实click事件，真实事件冒泡到document时，React按捕获(外节点到内节点)到冒泡(内节点到外节点)的顺序，收集节点上注册的click回调进队列，然后依次调用（传递的event参数是react合成后的对象）队列内的回调，完成click事件处理。

不能冒泡的事件(如focus)，可以使用对应的可冒泡事件(如focusin)来监听document。

对React合成事件进行stopPropagation()只能阻止event在React组件上继续冒泡，但**无法阻止其在真实DOM节点的冒泡**，因为React的事件是发生在document节点，事件已经冒泡到document了。所以尽量不要把React组件的事件监听和真实DOM的事件监听混用，容易搞混事件次序。

### 区分class组件和function组件

在React.Component的原型上定义isReactComponent字段。对于一个组件构造函数A，通过判断A.prototype && A.prototype.isReactComponent来区分是否为class组件，因为class组件extends了React.Component。

如果用A.prototype instanceof React.Component判断更严谨，但如果同个项目中有多个React副本，则此判断会有问题。

## Hooks VS Class

React16.8为组件编写提供了新的hooks写法。

解决UI相关逻辑的复用场景，非普通逻辑复用（JS）、非UI复用（组件）。比如一个定时获取最新数据的逻辑，用JS（手动setState更新视图）和HOC（多一层组件嵌套）处理都不是太合适。用hooks则很自然。

hooks组件相比原来的class组件的优点在于：

1. 扩展了组件的定义，使得组件不再局限于UI组件，也可以是逻辑组件

组件返回参数可以是普通参数，支持了**和view关联的逻辑**的复用。这个复用非UI复用（class组件），也非逻辑复用（抽象出JS函数）。

2. 基于1的基础组合出来的组件，各个参数的来源更清晰

复用逻辑时直接把参数定义和来源写在组件内，而非原来的HOC组件（在Vue中是mixins）嵌套，参数来源得从上游组件去找。

3. 相关逻辑聚合

比如bind和unbind的配对代码可以成对地写在更近的位置，而非分散在各个生命周期里。

4. 避免this问题

避免了组件内this的使用，**写法上**就像一个纯函数一样，不依赖于运行的上下文（虽然只是把复杂度隐藏在hooks内部，上下文交给了内部逻辑去处理）。

## 第三方库

### redux

redux实现：

combineReducers把多个reducer函数整合成一个大reducer函数，createStore(reducer)初始化store。

每次调用store.dispatch(action)，该action都会通过这个大reducer（相当于通过每个子reducer），来得到各部分的新state，最后整合得到大state。

结合react-redux：顶层state变化时，使用connect的组件会将它通过state获取到的props作前后浅比较，若有变化，该容器层props改变触发组件render，而非一有state变化就render

缺点：

1、发出action对应的reducer的type是基于string的，运行时关联，需要人工去保证type不冲突，且利于做静态分析，维护困难。
2、带来了多余的计算，state的更新信息经历了『丢失-找回』过程，组件state更新（精确）后被整合成一个大state（丢失了具体的state更新部分），再通过大state来diff（找回具体更新的state），来判断需要更新的组件。

### immutable

顾名思义，（对象）不可变。对象的内容与其内存地址绑定，同样内存地址的对象其内容必定一致，如果需要改变对象里的某个值，则需生成一个新的对象来表示这个改变。在react中使用能方便setState触发更新、在shouldComponentUpdate比较对象变化等操作。

项目中可以用$$开头的命名来表示immutable对象，以便和一般对象作区分。

一个有趣的现象：

```jsx
<div>
	{
		immutable.fromJS([{ a: 1 }, 2, 3]) // 渲染成a123
	}
</div>
<div>
	{
		[{ a: 1 }, 2, 3] // 报错
	}
</div>
```

因为渲染时递归判断元素是否为简单值（作为text节点渲染）？是否为ReactElement实例（作为原生DOM或者组件渲染）？是否为数组（是的话调用其`Symbol.iterator`得到其子集，继续对子集元素递归以上步骤）？都为否的话则无法渲染。
`{a: 1}`在immutable化后，是一个布署了iterator接口的Map，遍历结构类似`[["a", 1]]`，所以可以渲染成文本节点`a` 和`1`；而Object类型的`{a: 1}`则无法满足以上条件。



