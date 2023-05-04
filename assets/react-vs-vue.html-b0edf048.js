import{_ as e,p as a,q as t,a1 as r}from"./framework-5866ffd3.js";const d={},c=r('<h1 id="react-vs-vue" tabindex="-1"><a class="header-anchor" href="#react-vs-vue" aria-hidden="true">#</a> React VS Vue</h1><p>学院派 VS 实用派</p><p>React特点：UI=f(state)、函数式设计、自顶向下更新UI树、all in JS</p><p>Vue特点：劫持数据、组件状态可变、精准更新组件、HTML模板</p><h2 id="相同" tabindex="-1"><a class="header-anchor" href="#相同" aria-hidden="true">#</a> 相同</h2><p>组件化框架，隔离DOM操作</p><h2 id="生态" tabindex="-1"><a class="header-anchor" href="#生态" aria-hidden="true">#</a> 生态</h2><p>Vue的配套以官方库为主，选择成本低，项目风格较一致。</p><p>React以社区为主，灵活选择，可根据业务特性更多地定制化。</p><h2 id="设计哲学" tabindex="-1"><a class="header-anchor" href="#设计哲学" aria-hidden="true">#</a> 设计哲学</h2><p>Vue对开发者友好，流式数据，提供了更多便捷API来方便业务开发，如v-model、computed、class名组装、scoped css等。</p><p>组件类web component设计，声明式API，代码量低不过有额外理解成本。</p><p>React核心更简洁，函数式编程，immutable。</p><p>组件all in JS，额外学习JSX即可，逻辑都是直观的JS。</p><p>React内部实现更纯粹，不依赖语言特性，更贴合最小表达力原则。比如基于事务实现批量state更新而非setTimeout，比如不用getter/setter做数据劫持。</p><h2 id="内部原理" tabindex="-1"><a class="header-anchor" href="#内部原理" aria-hidden="true">#</a> 内部原理</h2><p>Vue的核心是数据劫持+依赖关联。提前绑定好数据和组件的关联关系，数据的变动只会引发关联组件的render和DOM diff，计算只在局部进行。</p><p>这种关联可以理解为一种空间换时间，组件初始化时多花时间和空间来建立关联关系，后续更新时则免于判断更新影响了哪些组件。关联的粒度到组件级别是一个折中的优化，Vue1则是直接关联到精确的DOM片段，连DOM diff都不需要，更新效率更高，但其初始化时间和内存占用也更差。</p><p>React思想是immutable+函数式。某个组件发生数据变动，则引发整个组件和其子孙组件（除非某个组件用了memo或者shouldupdate的优化，此路径会中断）都会render并整体DOM diff。</p><p>Vue的这步监听绑定，在初始化有额外消耗，但也使其后续更新的消耗更少，性能下限更高。</p>',20),p=[c];function s(h,i){return a(),t("div",null,p)}const o=e(d,[["render",s],["__file","react-vs-vue.html.vue"]]);export{o as default};
