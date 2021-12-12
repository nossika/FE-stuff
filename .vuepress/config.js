module.exports = {
  title: '前端工程师的自我修养',
  description: '一本关于前端开发领域知识的书',
  base: '/FE-stuff/', // for github pages
  themeConfig: {
    serviceWorker: {
      updatePopup: true,
    },
    repo: 'nossika/FE-stuff',
    sidebar: [
      {
        title: 'JS',
        collapsable: false,
        children: [
          '/js/ecma.md',
          '/js/dom',
          '/js/engine',
          '/js/thread',
        ],
      },
      {
        title: 'HTML/CSS',
        collapsable: false,
        children: [
          '/htmlcss/html.md',
          '/htmlcss/css.md',
        ],
      },
      {
        title: 'WEB',
        collapsable: false,
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
        title: '性能',
        collapsable: false,
        children: [
          '/performance/render.md',
          '/performance/analysis.md',
        ],
      },
      {
        title: 'React',
        collapsable: false,
        children: [
          '/react/communication.md',
          '/react/lifecycle.md',
          '/react/api.md',
          '/react/principle.md',
          '/react/lib.md',
          '/react/hooks.md',
          '/react/diff.md',
        ],
      },
      {
        title: 'Vue',
        collapsable: false,
        children: [
          '/vue/communication.md',
          '/vue/lifecycle.md',
          '/vue/api.md',
          '/vue/principle.md',
          '/vue/lib.md',
          '/vue/ssr.md',
          '/vue/hooks.md',
          '/vue/diff.md',
        ],
      },
      {
        title: '算法',
        collapsable: false,
        children: [
          '/algorithm/structure.md',
          '/algorithm/concept.md',
          '/algorithm/application.md',
        ],
      },
      {
        title: '计算机科学',
        collapsable: false,
        children: [
          '/cs/concept.md',
          '/cs/lang.md',
          '/cs/paradigm.md',
          '/cs/design.md',
        ],
      },
      {
        title: '工程化',
        collapsable: false,
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
        title: 'NodeJS',
        collapsable: false,
        children: [
          '/node/loop.md',
          '/node/dep.md',
          '/node/api.md',
          '/node/npm.md',
        ],
      },
      {
        title: 'GoLang',
        collapsable: false,
        children: [
          '/go/main.md',
          '/go/diff-js.md',
        ],
      },
      {
        title: 'others',
        collapsable: true,
        children: [
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
  },
};