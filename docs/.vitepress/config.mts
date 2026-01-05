import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "MSM Wiki",
  description: "MSM Manager - 统一管理平台文档",
  base: '/msm-wiki/',
  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/msm-wiki/logo/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#2563eb' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'zh_CN' }],
    ['meta', { name: 'og:site_name', content: 'MSM Wiki' }],
  ],

  themeConfig: {
    logo: '/logo/logo-square.svg',
    siteTitle: 'MSM Wiki',

    nav: [
      { text: '首页', link: '/zh/' },
      { text: '快速开始', link: '/zh/guide/install' },
      { text: '路由器集成', link: '/zh/guide/router-integration' },
      { text: '使用指南', link: '/zh/guide/basic-config' },
      { text: '常见问题', link: '/zh/faq/' }
    ],

    sidebar: {
      '/zh/': [
        {
          text: '项目介绍',
          items: [
            { text: '什么是 MSM', link: '/zh/introduction/what-is-msm' },
            { text: '核心功能', link: '/zh/introduction/features' }
          ]
        },
        {
          text: '快速开始',
          items: [
            { text: '安装部署', link: '/zh/guide/install' },
            { text: '首次使用', link: '/zh/guide/first-use' }
          ]
        },
        {
          text: '路由器集成',
          items: [
            { text: '集成概述', link: '/zh/guide/router-integration' },
            { text: 'RouterOS 配置', link: '/zh/guide/routeros' },
            { text: '爱快配置', link: '/zh/guide/ikuai' },
            { text: 'OpenWrt 配置', link: '/zh/guide/openwrt' },
            { text: 'UniFi 配置', link: '/zh/guide/unifi' }
          ]
        },
        {
          text: '使用指南',
          items: [
            { text: '基础配置', link: '/zh/guide/basic-config' },
            { text: '设备管理', link: '/zh/guide/device-management' },
            { text: 'MosDNS 管理', link: '/zh/guide/mosdns' },
            { text: 'SingBox 管理', link: '/zh/guide/singbox' },
            { text: 'Mihomo 管理', link: '/zh/guide/mihomo' },
            { text: '配置编辑', link: '/zh/guide/config-editor' },
            { text: '日志查看', link: '/zh/guide/logs' }
          ]
        },
        {
          text: '常见问题',
          items: [
            { text: 'FAQ', link: '/zh/faq/' },
            { text: '故障排查', link: '/zh/faq/troubleshooting' }
          ]
        }
      ],
      '/en/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is MSM', link: '/en/introduction/what-is-msm' },
            { text: 'Features', link: '/en/introduction/features' }
          ]
        },
        {
          text: 'Getting Started',
          items: [
            { text: 'Installation', link: '/en/guide/getting-started' },
            { text: 'Basic Configuration', link: '/en/guide/basic-config' },
            { text: 'First Use', link: '/en/guide/first-use' }
          ]
        },
        {
          text: 'User Guide',
          items: [
            { text: 'User Management', link: '/en/guide/user-management' },
            { text: 'MosDNS Management', link: '/en/guide/mosdns' },
            { text: 'SingBox Management', link: '/en/guide/singbox' },
            { text: 'Mihomo Management', link: '/en/guide/mihomo' },
            { text: 'Config Editor', link: '/en/guide/config-editor' },
            { text: 'History & Rollback', link: '/en/guide/history' },
            { text: 'Logs', link: '/en/guide/logs' }
          ]
        },
        {
          text: 'Deployment',
          items: [
            { text: 'Standalone', link: '/en/deployment/standalone' },
            { text: 'Nginx', link: '/en/deployment/nginx' },
            { text: 'HTTPS', link: '/en/deployment/https' }
          ]
        },
        {
          text: 'FAQ',
          items: [
            { text: 'FAQ', link: '/en/faq/' },
            { text: 'Troubleshooting', link: '/en/faq/troubleshooting' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/msm9527/msm-wiki' }
    ],

    footer: {
      message: 'MSM - 统一管理平台',
      copyright: 'Copyright © 2024-present MSM Project'
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }
      }
    },

    editLink: {
      pattern: 'https://github.com/msm9527/msm-wiki/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    outline: {
      label: '页面导航'
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  },

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/'
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Getting Started', link: '/en/guide/getting-started' },
          { text: 'User Guide', link: '/en/guide/' },
          { text: 'Deployment', link: '/en/deployment/' }
        ],
        editLink: {
          pattern: 'https://github.com/msm9527/msm-wiki/edit/main/docs/:path',
          text: 'Edit this page on GitHub'
        },
        lastUpdated: {
          text: 'Last updated'
        },
        docFooter: {
          prev: 'Previous page',
          next: 'Next page'
        },
        outline: {
          label: 'On this page'
        },
        returnToTopLabel: 'Return to top',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Appearance'
      }
    }
  }
})
