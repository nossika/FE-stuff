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

## JSX => DOM

JSX源代码：

		render() {
			return (
				<section className="wrapper">
					<Header type={1}>Hello world</Header>
					<p>This</p>
					is JSX
				</section>
			)
		}

经过babel编译后的代码：

		render() {
			return (
				React.createElement(
					'section',
					{ className: 'wrapper' },
					React.createElement(
						Header,
						{ type: 1 },
						'hello world',
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

执行render()后的返回值类似如下结构，用来表示虚拟DOM树：

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


在ReactDOM.render初次渲染时，ReactDOM把虚拟DOM树转化为真实的DOM渲染到页面：遇到文本节点、type为原生DOM的节点可直接转化，遇到type为组件类型的节点则通过组件函数（class组件用render返回值，函数组件用直接返回值
，返回值里还有组件类型则继续递归，最后总会以原生DOM或者文本节点结束）来创建DOM。

状态更新时，则通过更新前后虚拟DOM树的diff比较，来按需更新真实DOM。



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

