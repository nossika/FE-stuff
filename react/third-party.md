# 第三方库

## redux

redux实现：

combineReducers把多个reducer函数整合成一个大reducer函数，createStore(reducer)初始化store。

每次调用store.dispatch(action)，该action都会通过这个大reducer（相当于通过每个子reducer），来得到各部分的新state，最后整合得到大state。

结合react-redux：顶层state变化时，使用connect的组件会将它通过state获取到的props作前后浅比较，若有变化，该容器层props改变触发组件render，而非一有state变化就render

改进点？：action和reducer繁琐；action和reducer需要匹配自定义type来关联，而不是自动关联。

## immutable

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