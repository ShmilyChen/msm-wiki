---
layout: home

hero:
  name: "MSM"
  text: "旁路由 DNS 分流方案"
  tagline: 基于 MosDNS + SingBox/Mihomo 的智能 DNS 分流与透明代理管理平台
  image:
    src: /logo/logo-square.svg
    alt: MSM Logo
  actions:
    - theme: brand
      text: 快速开始
      link: /zh/guide/install
    - theme: alt
      text: 路由器集成
      link: /zh/guide/router-integration
    - theme: alt
      text: GitHub
      link: https://github.com/msm9527/msm-wiki

features:
  - icon: 🌐
    title: 旁路由架构
    details: 作为旁路网关部署，不影响主路由配置，通过静态路由实现智能分流
  - icon: 🎯
    title: DNS 智能分流
    details: 基于 MosDNS 的 DNS 分流，支持 FakeIP 模式，精准识别国内外域名
  - icon: 🔄
    title: 透明代理
    details: 集成 SingBox/Mihomo 内核，支持多种代理协议，无感透明代理
  - icon: 🖥️
    title: 可视化管理
    details: 现代化 Web 界面，一键安装、配置、监控，告别命令行
  - icon: 🛡️
    title: 设备级控制
    details: 通过 IP 白名单精确控制哪些设备走代理，灵活管理家庭网络
  - icon: 🔌
    title: 广泛兼容
    details: 支持 RouterOS、爱快、OpenWrt、UniFi 等所有支持静态路由的路由系统
  - icon: 📝
    title: 配置管理
    details: 在线编辑配置文件，支持历史版本回滚，配置变更可追溯
  - icon: ⚡
    title: 跨平台支持
    details: 支持 Linux (x64/ARM64)、macOS (Intel/Apple Silicon)，支持 Docker 部署
---

## 什么是 MSM？

MSM 是一个**旁路由 DNS 分流方案**，通过将 **MosDNS**（DNS 服务器）和 **SingBox/Mihomo**（代理内核）整合到一个可视化管理平台，实现智能 DNS 分流和透明代理。

### 核心架构

```
主路由 (192.168.1.1)
    ↓ DNS: 192.168.1.2
    ↓ 静态路由: 28.0.0.0/8 → 192.168.1.2
    ↓
MSM 旁路由 (192.168.1.2)
    ├─ MosDNS (53端口) - DNS 分流
    │   ├─ 国内域名 → 国内 DNS
    │   └─ 国外域名 → FakeIP (28.0.0.0/8)
    │
    └─ SingBox/Mihomo (7890/7891) - 透明代理
        └─ FakeIP 流量 → 代理服务器
```

### 工作原理

1. **DNS 分流**: 主路由将 DNS 请求转发到 MSM，MosDNS 根据规则分流国内外域名
2. **FakeIP 模式**: 国外域名返回 FakeIP 地址（28.0.0.0/8 网段）
3. **静态路由**: 主路由将 FakeIP 流量路由到 MSM
4. **透明代理**: SingBox/Mihomo 拦截 FakeIP 流量并通过代理转发
5. **设备控制**: 通过 IP 白名单控制哪些设备走代理

## 核心功能

- **一键部署**: 单二进制文件，支持一键安装脚本，5 分钟完成部署
- **DNS 分流**: 基于域名规则的智能 DNS 分流，支持自定义规则
- **FakeIP 模式**: 高效的 FakeIP 实现，减少 DNS 泄漏
- **透明代理**: 无需客户端配置，全局透明代理
- **设备管理**: IP 白名单控制，精确管理哪些设备走代理
- **多内核支持**: 支持 SingBox 和 Mihomo 双内核，可自由切换
- **配置编辑**: 在线编辑配置文件，支持语法高亮和验证
- **历史回滚**: 自动保存配置历史，一键回滚到任意版本
- **实时监控**: 实时查看服务状态、日志和资源使用情况

## 支持的路由系统

MSM 支持所有能够配置**静态路由**和**自定义 DNS** 的路由系统：

- ✅ **RouterOS** (MikroTik)
- ✅ **爱快** (iKuai)
- ✅ **OpenWrt** / LEDE
- ✅ **UniFi** (Ubiquiti)
- ✅ **梅林固件** (Asuswrt-Merlin)
- ✅ **pfSense** / OPNsense
- ✅ 其他支持静态路由的路由系统

## 快速开始

### 系统要求

- **平台**: Linux (Debian/Ubuntu/CentOS/Alpine) 或 macOS
- **架构**: x86_64 (amd64) 或 ARM64 (aarch64)
- **内存**: 最低 512MB，推荐 2GB
- **权限**: root 或 sudo 权限

### 一键安装

```bash
# 使用 curl
curl -fsSL https://raw.githubusercontent.com/msm9527/msm-wiki/main/install.sh | sudo bash

# 或使用 wget
wget -qO- https://raw.githubusercontent.com/msm9527/msm-wiki/main/install.sh | sudo bash
```

::: tip 国内加速
如果 GitHub 访问速度较慢，可使用加速镜像：
```bash
curl -fsSL https://gh-proxy.org/https://raw.githubusercontent.com/msm9527/msm-wiki/main/install.sh | sudo bash
```
:::

安装完成后访问 `http://your-server-ip:7777`

### 配置路由器

安装完成后，需要在主路由器上配置：

1. **设置 DNS**: 将主路由的 DNS 设置为 MSM 主机 IP
2. **添加静态路由**: 添加 `28.0.0.0/8` 指向 MSM 主机 IP
3. **配置设备白名单**: 在 MSM 中配置哪些设备走代理

详细配置请查看 [路由器集成指南](/zh/guide/router-integration)

## 下一步

- [安装部署](/zh/guide/install) - 详细安装步骤
- [路由器集成](/zh/guide/router-integration) - 配置路由器
- [使用指南](/zh/guide/basic-config) - 基础配置和使用
- [常见问题](/zh/faq/) - 故障排查
