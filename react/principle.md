# 原理相关


## Hooks实现状态保存

class组件的状态保存在实例上，但Hooks实现的组件看起来是个纯函数，内部的状态却也可以保存，比如下面例子中，每次点击button都会重新调用函数App，而App内的count可以正确计数，不会因重新调用App而重置。


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


因为组件中的Hook函数被调用时，经React内部处理，状态被保存在**组件的FiberNode**中，在其memoizedState属性以**链表**形式依次保存每个Hook对应的状态；组件下次render时，按序取出状态和各个Hook**一一对应**，即实现状态保存。这也是Hook函数不能写在条件或循环中的原因，因为同个组件中的每次render必须保证各Hook调用的**顺序一致**，否则对应关系就乱了。

FiberNode可通过[【React/Fiber】](/react/principle?id=fibernode)来了解。

## Fiber

任务分片，任务优先级，基于requestIdleCallback、requestAnimationFrame

### FiberNode

FiberNode把React组件中原本用JSON树来表示DOM的方式改成了用**链表**来表示，DOM树的遍历由递归展开遍历变成了**线性遍历**，便于遍历的中断和继续。

组件的FiberNode可以通过React element的\_owner属性访问到，但必须是通过React的render方法调用JSX生成的React element，手动调用JSX生成的React element的\_owner属性为null。


    function App() {
      const vDOM = <div>test</div>; // 返回_owner为FiberNode的React element
      return vDOM;
    }

    const vDOM2 = <div>test</div>; // 返回_owner为null的React element

    ReactDOM.render(
      <App/>,
      document.querySelector('#app'),
    );


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


## setState的异步

	
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
	
大家都知道以上打印结果是因为setState是异步执行，但是如果把setState放到组件外
	
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

修改后的代码state的结果变了，setState似乎变成了同步执行。

这是因为组件初始化时，React对其内部的函数都进行了一层**包装**，变成 initialize => perform（你自己写的代码） => ending 的形式，这个起止过程就是一个**transaction**。调用setState时如果发现正**处于transaction中**，它并不会立即修改state，而是推到一个缓存数组中，在ending时一并执行，造成异步的效果。而如果把这段代码放到React组件外部就失去了transaction封装，从而使setState一执行就立即修改state。

可以通过Reace提供的batchedUpdates手动包装一个transaction

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

这样就回到了大家熟悉的结果。

顺带一提，这种对函数加层包装使其处于特殊环境中执行的做法，在vue中也有运用，比如vuex中的_withCommit，用于判断state的修改是来自mutation还是外部直接修改。

## JSX => DOM

1. JSX源代码


    render() {
      return (
        <section className="wrapper">
          <Header type={1}>Hello World</Header>
          <p>This</p>
          is JSX
        </section>
      )
    }


2. 经过babel编译后的代码


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


3. 执行render()后的返回值为React element（用JSON表示的DOM树），数据格式类似如下


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


4. 把React element渲染为真实DOM

在ReactDOM.render初次渲染时，ReactDOM把React element转化为真实的DOM渲染到页面：遇到文本节点、type为原生DOM的节点可直接转化，遇到type为组件类型的节点则通过组件函数（class组件用实例的render返回值，函数组件用函数返回值，返回值里若还有组件类型则继续递归，最后总会以原生DOM或者文本节点结束）来创建DOM。

状态更新时，则通过更新前后虚拟DOM的diff比较，来按需更新真实DOM。

diff实现上，React因为Fiber用链表来表示DOM树，是对链表遍历而非对树遍历，但diff的策略和Vue大致相同，可以参考[【Vue/DOM-diff】](/vue/principle?id=dom-diff)。


## 事件合成


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


React**在真实的document节点**监听真实click事件，真实事件冒泡到document时，React按捕获(外节点到内节点)到冒泡(内节点到外节点)的顺序，收集节点上注册的click回调进队列，然后依次调用（传递的event参数是react合成后的对象）队列内的回调，完成click事件处理。

不能冒泡的事件(如focus)，可以使用对应的可冒泡事件(如focusin)来监听document。

对React合成事件进行stopPropagation()只能阻止event在React组件上继续冒泡，但**无法阻止其在真实DOM节点的冒泡**，因为React的事件是发生在document节点，事件已经冒泡到document了。所以尽量不要把React组件的事件监听和真实DOM的事件监听混用，容易搞混事件次序。


