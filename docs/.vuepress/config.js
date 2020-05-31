const path = require("path")
const querystring = require("querystring")
const domain = "https://kiana.moe"

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@assets': path.resolve(__dirname, "../assets")
      }
    }
  },
  plugins: [
    /*[
      'vuepress-plugin-clean-urls',
      {
        normalSuffix: '',
        indexSuffix: '/',
        notFoundPath: '/404.html',
      },
    ],*/
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
    [
      'vuepress-plugin-seo',
      {
        siteTitle: (_, $site) => $site.title,
        title: $page => $page.title,
        description: $page => $page.frontmatter.description || $page.frontmatter.title,
        author: (_, $site) => "coearth",
        tags: $page => $page.frontmatter.tags,
        twitterCard: _ => 'summary_large_image',
        type: $page => ['articles', 'posts', 'blog'].some(folder => $page.regularPath.startsWith('/' + folder)) ? 'article' : 'website',
        url: (_, $site, path) => (domain || '') + path,
        image: ($page, $site) => {
          if ($page.frontmatter.cover) {
            const paths = $page.frontmatter.cover.split("/")
            const filename = paths[paths.length - 1]
            return (domain || '') + 
              paths.slice(0, paths.length - 1).join("/") + "/" + 
              querystring.escape(filename)
          } 
          return null
        },
        publishedAt: $page => $page.frontmatter.date && new Date($page.frontmatter.date),
        modifiedAt: $page => $page.lastUpdated && new Date($page.lastUpdated),
      }
    ],
    'disqus',
    [
      '@vuepress/google-analytics',
      {
        'ga': 'UA-33867391-3' 
      }
    ]
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
        permalink: false, 
        permalinkBefore: false, 
        permalinkSymbol: '#' 
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