
# React

### 组件通信

prop,ref,context,数据管理(redux, mobx, rx)

### 生命周期

新建： constructor -> componentWillMount -> render -> componentDidMount

卸载：componentWillUnmount

更新：componentWillReceiveProps -> shouldComponentUpdate-> componentWillUpdate -> render -> componentDidUpdate

setState：shouldComponentUpdate-> componentWillUpdate -> render -> componentDidUpdate

forceUpdate：componentWillUpdate -> render -> componentDidUpdate

### redux

redux实现：

combineReducers把多个reducer函数整合成一个大reducer函数，createStore(reducer)初始化store。

每次调用store.dispatch(action)，该action都会通过这个大reducer（相当于通过每个子reducer），来得到各部分的新state，最后整合得到大state。

结合react-redux：顶层state变化时，使用connect的组件会将它通过state获取到的props作前后浅比较，若有变化，该容器层props改变触发组件render，而非一有state变化就render

改进点？：action和reducer繁琐；action和reducer需要匹配自定义type来关联，而不是自动关联。

### fiber

任务分片，任务优先级，基于requestIdleCallback、requestAnimationFrame

### context

16.3前后api对比

解决：不符合分形、无法穿透shouldUpdateComponent

### hook

### setState

一次DOM reconciliation调用setState多次，state非立刻变化

transaction模型,batchedUpdates(ReactDOM.unstable_batchedUpdates)

### pureComponent

和普通component差异：

自动添加shouldUpdateComponent的判断，对变化前后的props和state进行浅比较返回bool，来决定要不要走render

### immutable

优势：

命名：$$

一个有趣的现象：

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

因为渲染时递归判断元素是否为简单值（作为text节点渲染）？是否为ReactElement实例（作为原生DOM或者组件渲染）？是否为数组（是的话调用其`Symbol.iterator`得到其子集，继续对子集元素递归以上步骤）？都为否的话则无法渲染。
`{a: 1}`在immutable化后，是一个布署了iterator接口的Map，遍历结构类似`[["a", 1]]`，所以可以渲染成文本节点`a` 和`1`；而Object类型的`{a: 1}`则无法满足以上条件。

	

### React中的setState异步

	
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

这是因为组件初始化时，React对其内部的函数都进行了一层**包装**，变成 initialize => perform（你自己写的代码） => close 的形式，这个起止过程就是一个**transaction**。调用setState时如果发现正**处于transaction中**，它并不会立即修改state，而是推到一个缓存数组中，在close时一并执行，造成异步的效果。而如果把这段代码放到React组件外部就失去了transaction封装，从而使setState一执行就立即修改state。

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

