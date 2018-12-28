# 原理相关

## fiber

任务分片，任务优先级，基于requestIdleCallback、requestAnimationFrame

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

		// print 'native outer' -> 'react inner' -> 'react outer' -> 'native window'

React在真实的document节点监听真实click事件，真实事件冒泡到document时，React按捕获(外节点到内节点)到冒泡(内节点到外节点)的顺序，收集节点上注册的click回调进队列，然后依次调用（传递的event参数是react合成后的对象）队列内的回调，完成click事件处理。

不能冒泡的事件(如focus)，可以使用对应的可冒泡事件(如focusin)来监听document。

