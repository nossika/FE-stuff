
# SSR

## SSR过程

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

## 静态页渲染

    const renderer = require('vue-server-renderer').createRenderer();
    renderer.renderToString(app, (err, html) => {
      // send html to client
    });

此方式只适用于渲染不需要交互的静态页面，可以开启缓存提高性能。

## 前后端同构

显然，在服务端代码和前端代码中各写一个app会很难维护，理想状态应该是只有一份app代码，它能够被打包成服务端文件和静态文件来供双方使用，我们称之为前后端同构。

这里以使用webpack的Vue项目为例，需要对其作一些修改：

- 独立出**entry-client.js**和**entry-server.js**两个入口文件，以及共用的**create-app.js**。

- **create-app.js**只提供一个`createApp`函数，不做其他有副作用的或者和运行环境有关的事情。


    export function createApp() {
      const app = new Vue({
        render: h => h(App),
        store: createStore(),
        router: createRouter(),
      });
      return app;
    }
    

- **entry-server.js**需要对`createApp`函数做一层封装，使其变成能够根据传入的store和router参数来初始化app，并注册匹配路由和预获取组件数据（asyncData）。


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


- **entry-client.js**需要调用`createApp`函数来在客户端完成Vue实例化，然后等待\_\_INITIAL_STATE__初始化store、router.onReady（加载注册路由）、预获取组件数据这几个操作执行完毕后，再执行$mount操作，以保证客户端渲染结果和服务端的完全一致。


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


- webpack的打包配置也需要分成**client.config.js**和**server.config.js**，需要各自加上官方提供的对应plugin，注意**server.config.js**中要去掉MiniCssExtractPlugin这类外置资源的插件。打包出来的文件可以放在同一文件夹，包含**vue-ssr-client-manifest.json**（客户端依赖的资源map）、**vue-ssr-server-bundle.json**（服务端需要的app创建方法）和一些chunks文件。

- 服务端代码通过`require('vue-server-renderer').createBundleRenderer`引用打包后的vue-ssr-server-bundle.json、vue-ssr-client-manifest.json，计算出渲染完成的HTML并注入资源依赖后，返回给客户端。


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



上述例子已上传到[vue-ssr-demo](https://github.com/nossika/vue-ssr-demo)，可结合代码查看。





