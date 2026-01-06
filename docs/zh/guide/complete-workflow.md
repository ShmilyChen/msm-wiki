# 完整使用流程

本文档提供从安装到配置到使用的完整流程指南，帮助你快速上手 MSM。

## 准备工作

### 1. 硬件准备

- **主机**: 一台 Linux 主机或 macOS 电脑（作为 MSM 旁路由）
- **路由器**: 支持静态路由和自定义 DNS 的路由器
- **网络**: 主机和路由器在同一局域网

### 2. 网络规划

假设网络环境：
- **主路由 IP**: `192.168.1.1`
- **MSM 主机 IP**: `192.168.1.2` (需要固定 IP)
- **局域网段**: `192.168.1.0/24`

::: tip 提示
建议为 MSM 主机配置固定 IP 地址，避免 DHCP 租约过期后 IP 变化。
:::

## 第一步：安装 MSM

### 1. 一键安装

在 MSM 主机上执行：

```bash
# 使用 curl
curl -fsSL https://raw.githubusercontent.com/msm9527/msm-wiki/main/install.sh | sudo bash

# 或使用 wget
wget -qO- https://raw.githubusercontent.com/msm9527/msm-wiki/main/install.sh | sudo bash
```

::: tip 国内加速
安装脚本已内置 MSM 专用加速链接，国内用户下载速度更快。如果 GitHub 访问速度较慢，可使用以下加速镜像：

**MSM 专用加速**（推荐）：
```bash
curl -fsSL http://152.69.226.93:5000/https://raw.githubusercontent.com/msm9527/msm-wiki/main/install.sh | sudo bash
```

**通用加速镜像**：
```bash
curl -fsSL https://gh-proxy.org/https://raw.githubusercontent.com/msm9527/msm-wiki/main/install.sh | sudo bash
```
:::

### 2. 验证安装

```bash
# 检查服务状态
sudo systemctl status msm

# 检查端口监听
sudo ss -tlnp | grep 7777
```

## 第二步：初始化 MSM

### 1. 访问 Web 界面

打开浏览器访问：`http://192.168.1.2:7777`

### 2. 创建管理员账号

首次访问会进入初始化向导：

1. **设置管理员账号**
   - 用户名：`admin`（建议）
   - 密码：设置强密码（至少 12 位）

2. **选择代理内核**
   - MosDNS：必选（DNS 分流）
   - SingBox 或 Mihomo：二选一（代理内核）

3. **等待组件下载**
   - 系统自动下载并安装选择的组件
   - 下载完成后自动初始化配置

### 3. 登录系统

使用刚才创建的管理员账号登录。

## 第三步：配置路由器

### 1. 配置 DNS

在路由器管理界面中：

1. 进入 **网络设置 > DNS 设置**
2. 将 DNS 服务器设置为：`192.168.1.2`
3. 保存配置

### 2. 配置 DHCP DNS

在路由器管理界面中：

1. 进入 **DHCP 设置**
2. 将 DHCP 分发的 DNS 设置为：`192.168.1.2`
3. 保存配置

### 3. 配置静态路由

添加以下静态路由：

| 目标网段 | 网关 | 说明 |
|---------|------|------|
| 28.0.0.0/8 | 192.168.1.2 | FakeIP 路由（必需） |
| 149.154.160.0/22 | 192.168.1.2 | Telegram（可选） |
| 149.154.164.0/22 | 192.168.1.2 | Telegram（可选） |
| 91.108.4.0/22 | 192.168.1.2 | Telegram（可选） |

::: tip 提示
详细的路由器配置请参考：
- [RouterOS 配置](/zh/guide/routeros)
- [爱快配置](/zh/guide/ikuai)
- [OpenWrt 配置](/zh/guide/openwrt)
- [UniFi 配置](/zh/guide/unifi)
:::

## 第四步：配置设备白名单

### 1. 添加设备

在 MSM 管理界面中：

1. 进入 **设备管理** 页面
2. 点击 **添加设备**
3. 填写设备信息：
   - IP 地址：`192.168.1.100`
   - 设备名称：`小明的手机`
4. 点击 **保存**

### 2. 批量添加

如果需要整个网段走代理，可以添加：

```
192.168.1.0/24
```

::: warning 注意
只有在白名单中的设备才会走代理，其他设备只能访问国内网站。
:::

## 第五步：配置代理节点

### 1. 编辑配置文件

在 MSM 管理界面中：

1. 进入 **配置编辑** 页面
2. 选择 **SingBox** 或 **Mihomo** 配置
3. 添加代理节点配置

### 2. SingBox 配置示例

```json
{
  "outbounds": [
    {
      "type": "shadowsocks",
      "tag": "proxy",
      "server": "your-server.com",
      "server_port": 8388,
      "method": "aes-256-gcm",
      "password": "your-password"
    }
  ]
}
```

### 3. Mihomo 配置示例

```yaml
proxies:
  - name: "proxy"
    type: ss
    server: your-server.com
    port: 8388
    cipher: aes-256-gcm
    password: your-password
```

### 4. 保存并重启

1. 点击 **保存**
2. 点击 **重启服务**

::: tip 提示
MSM 已内置默认配置，首次使用可以直接使用内置配置。如需自定义配置，请在 MSM 管理界面的配置编辑页面进行修改。
:::

## 第六步：测试验证

### 1. 测试 DNS 解析

在客户端设备上：

**Windows**:
```cmd
nslookup google.com
```

**Linux/macOS**:
```bash
dig google.com
```

应该返回 28.0.0.0/8 网段的 IP 地址（FakeIP）。

### 2. 测试代理

在白名单设备上：

1. 访问 Google：`https://www.google.com`
2. 访问 YouTube：`https://www.youtube.com`
3. 访问 Twitter：`https://twitter.com`

应该能够正常访问。

### 3. 测试国内网站

访问百度：`https://www.baidu.com`

应该能够正常访问，且速度正常（不走代理）。

### 4. 测试非白名单设备

在不在白名单的设备上：

1. 访问百度：应该正常
2. 访问 Google：应该无法访问

## 第七步：查看日志

### 1. 查看服务状态

在 MSM 管理界面中：

1. 进入 **仪表板** 页面
2. 查看服务运行状态
3. 查看资源使用情况

### 2. 查看实时日志

1. 进入 **日志查看** 页面
2. 选择服务（MosDNS/SingBox/Mihomo）
3. 查看实时日志

### 3. 排查问题

如果遇到问题：

1. 查看日志中的错误信息
2. 参考 [故障排查文档](/zh/faq/troubleshooting)
3. 参考 [常见问题](/zh/faq/)

## 常见问题

### 1. 无法访问 MSM 管理界面

**排查步骤**:
1. 检查 MSM 服务是否运行：`sudo systemctl status msm`
2. 检查端口是否监听：`sudo ss -tlnp | grep 7777`
3. 检查防火墙是否放行 7777 端口
4. 尝试使用 `http://localhost:7777` 访问

### 2. DNS 解析失败

**排查步骤**:
1. 检查路由器 DNS 设置是否正确
2. 检查 MosDNS 服务是否运行
3. 在 MSM 主机上测试：`nslookup google.com 127.0.0.1`
4. 查看 MosDNS 日志

### 3. 无法访问国外网站

**排查步骤**:
1. 检查设备 IP 是否在白名单中
2. 检查静态路由是否配置正确
3. 检查代理节点配置是否正确
4. 查看 SingBox/Mihomo 日志

### 4. 国内网站访问慢

**可能原因**:
- MosDNS 配置问题，国内域名没有正确分流
- 国内 DNS 上游配置不正确

**解决方法**:
1. 检查 MosDNS 配置文件
2. 确认国内 DNS 上游设置为国内 DNS（如 223.5.5.5）
3. 清理 DNS 缓存

## 下一步

- [设备管理](/zh/guide/device-management) - 详细的设备管理指南
- [路由器集成](/zh/guide/router-integration) - 详细的路由器配置
- [常见问题](/zh/faq/) - 更多问题解答
