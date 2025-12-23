---
layout: home

hero:
  name: "MSM"
  text: "Unified Management Platform"
  tagline: One-stop visual platform for managing MosDNS, SingBox, and Mihomo
  image:
    src: /logo/logo-square.svg
    alt: MSM Logo
  actions:
    - theme: brand
      text: One-Click Install
      link: /en/guide/getting-started
    - theme: alt
      text: View Documentation
      link: /en/introduction/what-is-msm
    - theme: alt
      text: GitHub Releases
      link: https://github.com/msm9527/msm-wiki/releases/latest

features:
  - icon: 🚀
    title: One-Click Deployment
    details: Single binary deployment with no complex configuration required
  - icon: 🎨
    title: Modern Interface
    details: Built with React + TailwindCSS for a beautiful and smooth user experience
  - icon: 🔐
    title: Permission Management
    details: Complete user permission system with multi-role management
  - icon: ⚡
    title: Real-time Monitoring
    details: WebSocket real-time push of service status and log information
  - icon: 📝
    title: Configuration Management
    details: Online configuration editing with history version rollback support
  - icon: 🔄
    title: Multi-Kernel Support
    details: Support for switching between different kernel versions and configurations
  - icon: 🌐
    title: Bilingual Support
    details: Complete Chinese and English interface with internationalization support
  - icon: 🛡️
    title: Secure and Reliable
    details: JWT authentication, HTTPS support, and operation auditing
---

## What is MSM?

MSM (Mosdns Singbox Mihomo Manager) is a unified visual platform for managing **MosDNS**, **SingBox**, and **Mihomo**. Install, start, stop, uninstall, and configure three core network services with one click through a Web interface, replacing traditional script-based management with a modern approach.

## Core Features

- **Unified Management**: Manage all services on one platform
- **Visual Operations**: Intuitive Web interface, no command line needed
- **Configuration Editing**: Built-in Monaco editor with syntax highlighting
- **History Rollback**: Automatically save configuration history, one-click rollback
- **Real-time Monitoring**: Real-time view of service status and logs
- **Permission Control**: Multi-level permission management, secure and reliable

## Quick Start

### One-Click Installation (Recommended)

::: tip For Root Users
If you are already the root user, you can omit `sudo` and run directly:
```bash
# Using curl
curl -fsSL https://raw.githubusercontent.com/msm9527/msm-wiki/main/install.sh | bash

# Or using wget
wget -qO- https://raw.githubusercontent.com/msm9527/msm-wiki/main/install.sh | bash
```
:::

```bash
# Download and run installation script using curl
curl -fsSL https://raw.githubusercontent.com/msm9527/msm-wiki/main/install.sh | sudo bash

# Or using wget
wget -qO- https://raw.githubusercontent.com/msm9527/msm-wiki/main/install.sh | sudo bash
```

After installation, visit `http://your-server-ip:7777`

::: tip First Use
On first visit, you need to create an administrator account. Please keep your credentials safe.
:::

### Manual Installation

```bash
# Download latest version (example with 0.7.1, replace with actual version)
wget https://github.com/msm9527/msm-wiki/releases/latest/download/msm-0.7.1-linux-amd64.tar.gz

# Extract
tar -xzf msm-0.7.1-linux-amd64.tar.gz

# Add execute permission
chmod +x msm

# Run
./msm
```

Visit `http://localhost:7777` to use.

See [Detailed Installation Guide](/en/guide/getting-started) for more installation options and configurations.

## Tech Stack

- **Frontend**: React 18
- **Backend**: Golang

## Community

- [GitHub Issues](https://github.com/msm9527/msm-wiki/issues) - Report issues

