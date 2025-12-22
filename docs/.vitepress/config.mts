import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "MSM Wiki",
  description: "Mosdns Singbox Mihomo Manager - 统一管理平台文档",
  base: '/',
  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo/favicon.svg' }],
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
      { text: '快速开始', link: '/zh/guide/getting-started' },
      { text: '用户指南', link: '/zh/guide/' },
      { text: 'API 文档', link: '/zh/api/' },
      { text: '部署指南', link: '/zh/deployment/' },
      {
        text: '语言',
        items: [
          { text: '简体中文', link: '/zh/' },
          { text: 'English', link: '/en/' }
        ]
      }
    ],

    sidebar: {
      '/zh/': [
        {
          text: '介绍',
          items: [
            { text: '什么是 MSM', link: '/zh/introduction/what-is-msm' },
            { text: '核心特性', link: '/zh/introduction/features' },
            { text: '架构设计', link: '/zh/introduction/architecture' },
            { text: '技术栈', link: '/zh/introduction/tech-stack' }
          ]
        },
        {
          text: '快速开始',
          items: [
            { text: '一键安装部署', link: '/zh/guide/install' },
            { text: '手动安装', link: '/zh/guide/getting-started' },
            { text: '基础配置', link: '/zh/guide/basic-config' },
            { text: '首次使用', link: '/zh/guide/first-use' }
          ]
        },
        {
          text: '用户指南',
          items: [
            { text: '用户管理', link: '/zh/guide/user-management' },
            { text: 'MosDNS 管理', link: '/zh/guide/mosdns' },
            { text: 'SingBox 管理', link: '/zh/guide/singbox' },
            { text: 'Mihomo 管理', link: '/zh/guide/mihomo' },
            { text: '配置编辑', link: '/zh/guide/config-editor' },
            { text: '历史记录与回滚', link: '/zh/guide/history' },
            { text: '日志查看', link: '/zh/guide/logs' }
          ]
        },
        {
          text: 'API 文档',
          items: [
            { text: 'API 概览', link: '/zh/api/' },
            { text: '认证接口', link: '/zh/api/auth' },
            { text: '用户接口', link: '/zh/api/users' },
            { text: '服务管理接口', link: '/zh/api/service' },
            { text: '配置管理接口', link: '/zh/api/config' },
            { text: '历史记录接口', link: '/zh/api/history' },
            { text: 'WebSocket 接口', link: '/zh/api/websocket' }
          ]
        },
        {
          text: '部署指南',
          items: [
            { text: '单机部署', link: '/zh/deployment/standalone' },
            { text: 'Docker 部署', link: '/zh/deployment/docker' },
            { text: 'Systemd 配置', link: '/zh/deployment/systemd' },
            { text: 'Nginx 配置', link: '/zh/deployment/nginx' },
            { text: 'HTTPS 配置', link: '/zh/deployment/https' }
          ]
        },
        {
          text: '开发指南',
          items: [
            { text: '开发环境搭建', link: '/zh/development/setup' },
            { text: '项目结构', link: '/zh/development/structure' },
            { text: '前端开发', link: '/zh/development/frontend' },
            { text: '后端开发', link: '/zh/development/backend' },
            { text: '贡献指南', link: '/zh/development/contributing' }
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
            { text: 'Features', link: '/en/introduction/features' },
            { text: 'Architecture', link: '/en/introduction/architecture' },
            { text: 'Tech Stack', link: '/en/introduction/tech-stack' }
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
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/en/api/' },
            { text: 'Authentication', link: '/en/api/auth' },
            { text: 'Users', link: '/en/api/users' },
            { text: 'Service Management', link: '/en/api/service' },
            { text: 'Config Management', link: '/en/api/config' },
            { text: 'History', link: '/en/api/history' },
            { text: 'WebSocket', link: '/en/api/websocket' }
          ]
        },
        {
          text: 'Deployment',
          items: [
            { text: 'Standalone', link: '/en/deployment/standalone' },
            { text: 'Docker', link: '/en/deployment/docker' },
            { text: 'Systemd', link: '/en/deployment/systemd' },
            { text: 'Nginx', link: '/en/deployment/nginx' },
            { text: 'HTTPS', link: '/en/deployment/https' }
          ]
        },
        {
          text: 'Development',
          items: [
            { text: 'Setup', link: '/en/development/setup' },
            { text: 'Project Structure', link: '/en/development/structure' },
            { text: 'Frontend', link: '/en/development/frontend' },
            { text: 'Backend', link: '/en/development/backend' },
            { text: 'Contributing', link: '/en/development/contributing' }
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
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present MSM Team'
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
          { text: 'API Reference', link: '/en/api/' },
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
