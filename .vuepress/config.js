module.exports = {
  title: '前端工程师的自我修养',
  themeConfig: {
    serviceWorker: {
      updatePopup: true,
    },
    repo: 'nossika/FE-guide',
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
          '/htmlcss/render.md',
        ],
      },
      {
        title: 'WEB',
        collapsable: false,
        children: [
          '/web/protocol.md',
          '/web/cache.md',
          '/web/crossorigin.md',
          '/web/security.md',
          '/web/performance.md',
          '/web/cdn.md',
          '/web/auth.md',
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
        title: '计算机基础',
        collapsable: false,
        children: [
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
        ],
      },
      {
        title: 'NodeJS',
        collapsable: false,
        children: [
          '/node/loop.md',
          '/node/module.md',
          '/node/npm.md',
          '/node/app.md',
        ],
      },
      {
        title: 'others',
        collapsable: false,
        children: [
          '/others/pwa.md',
          '/others/graphql.md',
          '/others/rxjs.md',
          '/others/webassembly.md',
          '/others/go.md',
          '/others/docker.md',
          '/others/database.md',
          '/others/nginx.md',
        ],
      },
    ],
  },
};