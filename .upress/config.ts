import { defineConfig } from 'upress'
import type { Theme } from '@upress/theme-default/theme'

export default defineConfig<Theme.Config>({
  title: `dh's blog`,
  titleTemplate: `:title - dh's blog`,
  theme: '@upress/theme-default',
  themeConfig: {
    name: `yue1123`,
    nav: [
      { text: '首页', link: '/' },
      { text: '标签', link: '/tags' },
      { text: '归档', link: '/archives' },
      { text: '关于', link: '/about' }
    ],
    pagination: {
      size: 999
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/yue1123' }],
    filePathToTags: [
      {
        test: /\/notes\//,
        tag: '笔记'
      },
      {
        test: /\/vue\//,
        tag: 'vue'
      },
      {
        test: /\/react\//,
        tag: 'react'
      },
      {
        test: /\/essays\//,
        tag: '随笔'
      },
      {
        test: /\/js\//,
        tag: 'JavaScript'
      }
    ],
    sortBy: 'RANDOM',
    footer: {
      copyright: 'Copyright © 2023-present yue1123'
    }
  }
})
