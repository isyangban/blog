const path = require("path");
console.log("dirname: ", __dirname)

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@assets': path.resolve(__dirname, "../assets")
      }
    }
  },
  plugins: [
    [
      'vuepress-plugin-clean-urls',
      {
        normalSuffix: '',
        indexSuffix: '/',
        notFoundPath: '/404.html',
      },
    ],
    [
      '@vuepress/medium-zoom',
      {
        selector: "img",
        options: {
          margin: 10,
          background: 'rgb(30, 30, 30)',
        }
      },
    ],
    '@vuepress/nprogress',
    '@vuepress/last-updated',
    'vuepress-plugin-reading-time',
    'disqus',
   /* [
      '@vuepress/register-components',
      {
        componentsDir: "components"
      }
    ],*/
  ],
  postcss: {
    plugins: [
      require('postcss-import'),
      require("autoprefixer"),  
    ]
  },
  /*configureWebpack: (config, isServer) => {
    console.log("webpack config", config)
  },*/
  title: "코어스의 잡지식 리포지터리",
  description: "코어스의 잡지식 리포지터리",
  markdown: {
    anchor: {
      permalink: false
    },
    linkify: true
  },
  head: [
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    ['link', { rel: 'stylesheet', href: '/milligram.css' }],
    ['link', { rel: 'stylesheet', href: '/microns.css' }],
    ['link', { rel: 'stylesheet', href: '/style.css' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Noto+Sans|Noto+Sans+KR&display=swap' }]
  ]
}