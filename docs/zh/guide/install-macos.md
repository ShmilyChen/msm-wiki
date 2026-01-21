# macOS 安装

macOS 支持 **CLI 版** 与 **桌面版**（若发布提供）。

## 方式一：CLI 版（推荐）

```bash
# 使用 curl
curl -fsSL https://raw.githubusercontent.com/msm9527/msm-wiki/main/install.sh | sudo bash
```

### 国内网络加速（可选）

```bash
# 镜像反代
curl -fsSL https://msm.19930520.xyz/https://raw.githubusercontent.com/msm9527/msm-wiki/refs/heads/main/install.sh | sudo bash

# 镜像直链
curl -fsSL https://msm.19930520.xyz/dl/install.sh | sudo bash
```

安装后可使用：

```bash
msm -d
```

访问地址：`http://<MSM-IP>:7777`

::: warning 安全提示（CLI）
由于应用未经过 Apple 公证，macOS 可能提示“文件已损坏/无法打开”。请在 `msm` 所在目录执行：

```bash
/usr/bin/xattr -cr ./msm && /usr/bin/codesign -fs - ./msm
```
:::

## 方式二：桌面版（可选）

1. 打开 Releases 页面下载 macOS 安装包（按 Intel / Apple Silicon 选择）
2. 打开 `.dmg` 并拖拽到 Applications
3. 若被系统阻止，请在 **系统设置 > 隐私与安全性** 中允许

> 桌面版与 CLI 版功能一致，适合本地管理与快速体验。

::: warning 安全提示
由于应用未经过 Apple 公证，macOS 可能提示“文件已损坏/无法打开”。请执行以下命令解除限制：

```bash
/usr/bin/xattr -cr "/Applications/msm-desktop.app" && /usr/bin/codesign -fs - "/Applications/msm-desktop.app"
```
:::

## 下一步

- [路由器集成](/zh/guide/router-integration)
- [首次使用](/zh/guide/first-use)
