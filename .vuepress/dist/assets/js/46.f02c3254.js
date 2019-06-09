(window.webpackJsonp=window.webpackJsonp||[]).push([[46],{222:function(t,a,s){"use strict";s.r(a);var n=s(0),e=Object(n.a)({},function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"第三方库"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#第三方库","aria-hidden":"true"}},[t._v("#")]),t._v(" 第三方库")]),t._v(" "),s("h2",{attrs:{id:"redux"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#redux","aria-hidden":"true"}},[t._v("#")]),t._v(" redux")]),t._v(" "),s("p",[t._v("redux实现：")]),t._v(" "),s("p",[t._v("\bcombineReducers把多个reducer函数整合成一个大reducer函数，createStore(reducer)初始化store。")]),t._v(" "),s("p",[t._v("每次调用store.dispatch(action)，该action都会通过这个大reducer（相当于通过每个子reducer），来得到各部分的新state，最后整合得到大state。")]),t._v(" "),s("p",[t._v("结合react-redux：顶层state变化时，使用connect的组件会将它通过state\b获取到的props作前后浅比较，若有变化，该容器层props改变触发组件render，而非一有state变化就render")]),t._v(" "),s("p",[t._v("改进点？：action和reducer繁琐；action和reducer需要匹配自定义type来关联，而不是自动关联。")]),t._v(" "),s("h2",{attrs:{id:"immutable"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#immutable","aria-hidden":"true"}},[t._v("#")]),t._v(" immutable")]),t._v(" "),s("p",[t._v("优势：")]),t._v(" "),s("p",[t._v("命名：$$")]),t._v(" "),s("p",[t._v("一个有趣的现象：")]),t._v(" "),s("div",{staticClass:"language-jsx extra-class"},[s("pre",{pre:!0,attrs:{class:"language-jsx"}},[s("code",[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("div")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),s("span",{pre:!0,attrs:{class:"token plain-text"}},[t._v("\n\t")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t\timmutable"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("fromJS")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" a"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("3")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 渲染成a123")]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token plain-text"}},[t._v("\n")]),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("div")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("div")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),s("span",{pre:!0,attrs:{class:"token plain-text"}},[t._v("\n\t")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t\t"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" a"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("3")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 报错")]),t._v("\n\t"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token plain-text"}},[t._v("\n")]),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("div")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n")])])]),s("p",[t._v("因为渲染时递归判断元素是否为简单值（作为text节点渲染）？是否为ReactElement实例（作为原生DOM或者组件渲染）？是否为数组（是的话调用其"),s("code",[t._v("Symbol.iterator")]),t._v("得到其子集，继续对子集元素递归以上步骤）？都为否的话则无法渲染。\n"),s("code",[t._v("{a: 1}")]),t._v("在immutable化后，是一个布署了iterator接口的Map，遍历结构类似"),s("code",[t._v('[["a", 1]]')]),t._v("，所以可以渲染成文本节点"),s("code",[t._v("a")]),t._v(" 和"),s("code",[t._v("1")]),t._v("；而Object类型的"),s("code",[t._v("{a: 1}")]),t._v("则无法满足以上条件。")])])},[],!1,null,null,null);a.default=e.exports}}]);