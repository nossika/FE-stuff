# Vue


## 组件通信

### 父传递信息给子

父设置 props + 子 props/$attr

父设置 props + 子 watch 监听

### 父访问子

$ref

vm.$children[childIndex]

### 子传递信息给父

子 vm.$emit + 父设置 v-on 监听

### 子访问父

vm.$parent

### 跨层级传递

祖先 provide + 子孙 inject

$on + $emit：在某实例设置vm.$on，传递实例vm，利用vm.$emit传递事件

bus（新建一个Vue实例来传递事件，即$on + $emit的一种普遍用法）

VueX


## 生命周期

### 执行顺序

#### 组件新建

- beforeCreate()
- created()
- serverPrefetch()
（服务端渲染仅执行到此）
- beforeMount()
- mounted()

#### 组件更新

- beforeUpdate()
- updated()

#### 组件卸载

- beforeDestroy()
- destroyed()

### keep-alive

`keep-alive`标签内部的组件即使`v-if`为false从dom上被卸载，其实例也不会被销毁，当再次转为true时直接再次以这个实例渲染，其之前状态都会被保留。

激活时
- activated()

停用时
- deactivated()

### $nextTick

作用

可否用setTimeout替代


## API

### v-if vs v-show

都是用于控制元素的显示隐藏，v-if是通过元素的渲染，v-show是通过元素的display。所以二者的适用场景为，v-show适合频繁在显示隐藏间切换的、内容少的的元素；v-if适合内容多的、不需要在初次渲染就展示出来的元素。

### slots

slot-scope用法

```html
<!--组件-->
<div>
  <slot name="a" :id="123"/>
</div>

<!--页面-->
<div>
  <div slot="a" slot-scope="d">{{d.id}}</div>
</div>
```

$slots返回值（render函数）

### computed

### watch

### scoped style

### mixins

### Vue.directive

### $parent/$children


## 原理相关

### 从data改变到view变化经历的过程

初始化 为obj每个属性建立getter/setter，挂载新dep

初次渲染 利用触发getter绑定watcher到dep

数据变化 setter触发dep中的watcher，watcher触发更新

更新 virtual dom，snabbdom diff，patch

### DOM-diff

Vue分离了diff和patch的逻辑，先基于vnode进行diff，再根据diff结果进行实际的patch操作，patch在不同的终端上有不同实现，但diff是统一的逻辑。

传统DOM-diff的时间复杂度为O(n<sup>3</sup>)

- 只在新老DOM的同一层级的节点比较，且对每个节点只遍历一次。实际业务中很少有跨层级移动节点的情况。
- 新老节点如果类型/key不同，直接当做新建节点处理，不会再继续往下比较。大部分情况下，不同节点有不同内部的结构。

基于此两点优化算法后，DOM-diff的时间复杂度为O(n)，牺牲对比的准确性来换取性能（有时即使原节点存在，也会因没匹配到而重新创建）。

#### diff算法

vue中的diff算法基于开源的snabbdom修改而来，实现如下：

1. 在新老vnode列表的头尾部各设置1个指针，总共4个指针：newStart/newEnd/oldStart/oldEnd

2. 对这4个指针指向的vnode进行如下对比

  - 如果newStart和oldStart的vnode同类型（包括key、tag等），那么复用oldStart对应的节点，对其递归diff，然后newStart++、oldStart++

  - 如果newEnd和oldEnd的vnode同类型，那么复用oldEnd对应的节点，对其递归diff，然后newEnd--、oldEnd--

  - 如果newStart和oldEnd的vnode同类型，那么复用oldEnd对应的节点，并将其移动到oldStart对应的节点之前，对其递归diff，然后newStart++、oldEnd--

  - 如果newEnd和oldStart的vnode同类型，那么复用oldStart对应的节点，并将其移动到oldEnd对应的节点之后，对其递归diff，然后newEnd--、oldStart++

  - 如果newStart的vnode有key值且能找到到key对应的oldVnode，且同类型，那么复用oldVnode对应的节点，并将其移动到oldStart对应的节点之前，对其递归diff，然后newStart++

  - 如果上述条件都不成立，那么直接根据newStart的vnode创建一个新节点，插入到oldStart对应的节点之前，然后newStart++

3. 重复步骤2，直到oldStart > oldEnd 或者 newStart > newEnd 时，进入步骤4

4. 此时有两种情况

  - 如果是oldStart > oldEnd，那么将newStart和newEnd之间的vnode都创建为新节点，插入到oldEnd之前

  - 如果是newStart > newEnd，那么将oldStart和oldEnd之间的节点都作为废弃节点删除掉

5. 整个diff操作完成

#### 例子

old: a b c d e

new: b c d f 

todo

### 响应式更新

监听对象变化：

对对象各个key递归使用Object.defineProperty监听其getter和setter。

监听数组变化：

改写数组的原型上的push、pop、reverse等方法，监听数组api的调用。但不监听直接对数组下标修改的变化（`arr[1]=2`），其实同样可以通过defineProperty的方式来监听，arr当做对象，下标当做key，但出于性能考虑没有这么实现。

Proxy：

Vue3用Proxy来改写响应式逻辑，Proxy能把对象和数组的监听统一处理，也可监听到通过数组下标作的修改，省去对数组的特殊操作。


#### watcher

data每个prop的setter与组件的watcher关联，prop变化时，通知组件的watcher来重新执行render。后面再对新老render生成的vdom进行diff，来更新dom。

Vue1做法: 在初次编译时遍历dom节点，新建watcher将dom节点与data里对应的prop的setter关联，prop变化时，通过此watcher直接更新对应的dom节点。此方法dom更新效率更高（直接更新目标dom，省去了diff过程），但初始化时间长（创建watcher与dom的一一关联）、占用内存高（内存里保留了dom的引用）、watcher和浏览器环境的dom耦合。

#### dep.target

一般做法：data监听setter和绑定dep，编译模板时AST解析调用了哪些data属性，去给它们添加dep

Vue做法：data还监听了getter，编译模板时会触发getter，getter里通过target判断是否处于编译中，是的话把target指向的watcher添加到对应的dep，编译前后会改写target

#### computed

vue中的computed具有缓存和懒计算。

实现：

每个computed属性会建立一个watcher对应。

在被使用时（getter触发时）进入computedGetter，根据watcher.dirty的值 true/false 决定 重新计算/返回缓存。

第一次被使用时，默认watcher.dirty为true，触发computed计算，并收集计算中用到的依赖（把自身关联到依赖的watcher通知列表），并存下本次计算的value值。

当有依赖发生改动时，该computed的watcher.dirty会被设置为true，下次该computed被使用时就会被重新计算并缓存value，再把dirty重置为false。


### nextTick

（内部实现micro：Promise，macro：MessageChannel、setTimeout）

定义microFunc macroFunc

执行nextTick时，推入callbacks并触发一次（根据pending变量判断）在下轮执行flushCallbacks

flushCallbacks清空callbacks，依次执行callbacks（先清空来保证出现nextTick嵌套时的执行次序）

数据变动优先使用micro，可以在一轮事件循环内改变完data，只触发一次重渲染


### 源码结构

core/instance 定义Vue，定义原型属性

core/globalAPI 定义静态属性

platform 平台化包装导出（runtime & with-compiler）

core/lifecycle  初始化实例的生命周期，callHook

#### runtime & with-compiler 

官方提供两种包：仅运行时 & 运行时 + 编译器


## 官方库

### VueRouter

单页概念

路由模式：history、hash

### Vuex

解决的问题

模块：action -> mutation -> state -> getter


## SSR

### SSR过程

普通渲染（客户端渲染）过程：

1. 客户端发起请求
2. 服务端返回静态HTML（只有一个app外壳），以及渲染所需的scripts资源
3. 客户端拿到HTML渲染一个空界面，并加载scripts资源
4. 资源加载完毕，在客户端执行`new Vue()`渲染出正确界面

SSR过程：

1. 客户端发起请求
2. 服务端返回渲染后的完整HTML，也包含渲染所需的scripts资源
3. 客户端拿到HTML**直接渲染出正确界面**，并加载scripts资源
4. 资源加载完毕，在客户端执行`new Vue()`来重新渲染界面（这个结果会和服务端渲染的HTML一致，所以用户对此过程无感知），之后由客户端的Vue实例来**接管客户端的行为**，后续行为和客户端渲染一致

### 静态页渲染

```js
const renderer = require('vue-server-renderer').createRenderer();
renderer.renderToString(app, (err, html) => {
  // send html to client
});
```

此方式只适用于渲染不需要交互的静态页面，可以开启缓存提高性能。

### 前后端同构

显然，在服务端代码和前端代码中各写一个app会很难维护，理想状态应该是只有一份app代码，它能够被打包成服务端文件和静态文件来供双方使用，我们称之为前后端同构。

这里以使用webpack的Vue项目为例，需要对其作一些修改：

- 独立出**entry-client.js**和**entry-server.js**两个入口文件，以及共用的**create-app.js**。

- **create-app.js**只提供一个`createApp`函数，不做其他有副作用的或者和运行环境有关的事情。

```js
export function createApp() {
  const app = new Vue({
    render: h => h(App),
    store: createStore(),
    router: createRouter(),
  });
  return app;
}
```

- **entry-server.js**需要对`createApp`函数做一层封装，使其变成能够根据传入的store和router参数来初始化app，并注册匹配路由和预获取组件数据（asyncData）。

```js
export default (context = {}) => {
  const app = createApp();
  const store = app.$store;
  const router = app.$router;

  context.path && router.replace(context.path);
  // 将context传入的state作为初始化state
  context.state && store.replaceState(context.state);

  return new Promise((resolve, reject) => {
    router.onReady(() => {
      // 预先把匹配到路由信息加载到router返回给客户端，客户端在router.onReady后执行app渲染，才能完全匹配上ssr的dom
      const matchedComponents = router.getMatchedComponents().filter(item => item !== null);
      Promise.all(matchedComponents.map(comp => {
        if (comp.asyncData) {
          // 组件内部的asyncData可能会对state再次操作，返回给客户端的是这些操作后的state，通过window.__INITIAL_STATE__取值
          return comp.asyncData({
            store,
            route: router.currentRoute,
          });
        }
      })).then(() => {
        resolve(app);
      }).catch(reject);
    }, reject);
  });
}
```

- **entry-client.js**需要调用`createApp`函数来在客户端完成Vue实例化，然后等待\_\_INITIAL_STATE__初始化store、router.onReady（加载注册路由）、预获取组件数据这几个操作执行完毕后，再执行$mount操作，以保证客户端渲染结果和服务端的完全一致。

```js
const app = createApp();

if (window.__INITIAL_STATE__) {
  app.$store.replaceState(window.__INITIAL_STATE__);
}

const router = app.$router;
const store = app.$store;

// 等路由异步组件加载完再执行app.$mount操作，以保持和服务端渲染结果一致
router.onReady(() => {
  // 路由跳转前先执行完asyncData(如果有)再渲染，以保持和服务端渲染的行为一致（也是执行完asyncData再返回）
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to);
    const prevMatched = router.getMatchedComponents(from);
    let diffed = false;
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c));
    });

    if (!activated.length) {
      return next();
    }

    Promise.all(activated.map(comp => {
      if (comp && comp.asyncData) {
        return comp.asyncData({ store, route: to });
      }
    })).then(() => {
      next();
    }).catch(next);
  })

  app.$mount('#app');
});
```

- webpack的打包配置也需要分成**client.config.js**和**server.config.js**，需要各自加上官方提供的对应plugin，注意**server.config.js**中要去掉MiniCssExtractPlugin这类外置资源的插件。打包出来的文件可以放在同一文件夹，包含**vue-ssr-client-manifest.json**（客户端依赖的资源map）、**vue-ssr-server-bundle.json**（服务端需要的app创建方法）和一些chunks文件。

- 服务端代码通过`require('vue-server-renderer').createBundleRenderer`引用打包后的vue-ssr-server-bundle.json、vue-ssr-client-manifest.json，计算出渲染完成的HTML并注入资源依赖后，返回给客户端。

```js
const renderer = createBundleRenderer(path.resolve(__dirname, '../dist/vue-ssr-server-bundle.json'), {
  template: fs.readFileSync(path.resolve(__dirname, '../src/index.html'), 'utf-8'), // html模板
  clientManifest: require('../dist/vue-ssr-client-manifest.json'), // 客户端依赖，服务端完成首页渲染之后，客户端路由变化的新页面由客户端代码去渲染
});

const htmlStr = await renderer.renderToString({
  state: {
    user: 'my friend',
  },
  path: ctx.req.url,
});
```


上述例子已上传到[vue-ssr-demo](https://github.com/nossika/vue-ssr-demo)，可结合代码查看。


## Hooks VS Option

Vue3为组件编写提供了新的hooks写法。hooks组件和option组件的区别，和React中hooks组件与class组件的区别类似。

> 详见[【React】](./react.md#hooks-vs-class)


