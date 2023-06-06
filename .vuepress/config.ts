import { defaultTheme, defineUserConfig } from 'vuepress';
import { searchPlugin } from '@vuepress/plugin-search';

export default defineUserConfig({
  lang: 'zh-CN',
  title: '前端工程师的自我修养',
  description: '前端工程师的自我修养',
  base: '/FE-stuff/',
  dest: './FE-stuff/',
  theme: defaultTheme({
    repo: 'nossika/FE-stuff',
    docsBranch: 'master',
    sidebar: [
      {
        text: 'JS',
        children: [
          '/js/ecma.md',
          '/js/dom',
          '/js/engine',
          '/js/thread',
          '/js/examination',
        ],
      },
      {
        text: 'HTML/CSS',
        children: [
          '/htmlcss/html.md',
          '/htmlcss/css.md',
        ],
      },
      {
        text: 'WEB',
        children: [
          '/web/protocol.md',
          '/web/cache.md',
          '/web/security.md',
          '/web/cdn.md',
          '/web/auth.md',
          '/web/communication.md',
        ],
      },
      {
        text: '性能',
        children: [
          '/performance/render.md',
          '/performance/analysis.md',
        ],
      },
      {
        text: '框架',
        children: [
          '/framework/react.md',
          '/framework/vue.md',
          '/framework/react-vs-vue.md',
        ],
      },
      {
        text: '算法',
        children: [
          '/algorithm/structure.md',
          '/algorithm/concept.md',
          '/algorithm/application.md',
        ],
      },
      {
        text: '计算机科学',
        children: [
          '/cs/concept.md',
          '/cs/lang.md',
          '/cs/paradigm.md',
          '/cs/design.md',
        ],
      },
      {
        text: '工程化',
        children: [
          '/engineer/module.md',
          '/engineer/build.md',
          '/engineer/coop.md',
          '/engineer/test.md',
          '/engineer/deploy.md',
          '/engineer/monitor.md',
          '/engineer/devops.md',
        ],
      },
      {
        text: 'NodeJS',
        children: [
          '/node/loop.md',
          '/node/dep.md',
          '/node/api.md',
          '/node/npm.md',
        ],
      },
      {
        text: 'GoLang',
        children: [
          '/go/main.md',
          '/go/diff-js.md',
        ],
      },
      {
        text: '其他',
        children: [
          '/others/electron.md',
          '/others/pwa.md',
          '/others/graphql.md',
          '/others/rxjs.md',
          '/others/webassembly.md',
          '/others/docker.md',
          '/others/database.md',
          '/others/nginx.md',
          '/others/linux.md',
        ],
      },
    ],
  }),
  plugins: [
    searchPlugin(),
  ],
});
