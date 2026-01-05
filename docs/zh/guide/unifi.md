# UniFi 配置指南

本文档介绍如何在 UniFi (Ubiquiti) 路由器上配置 MSM 旁路由，实现 DNS 分流和透明代理。

## 环境说明

**示例网络环境**：
- UniFi 网关 IP: `192.168.1.1`
- MSM 主机 IP: `192.168.1.2`
- 备用 DNS: `223.5.5.5`

## 配置步骤

### 步骤一：配置静态路由

1. 登录 UniFi Controller
2. 进入 **Settings > Routing & Firewall > Static Routes**
3. 点击 **Create New Static Route**

#### 添加 FakeIP 路由

- **Name**: `MSM FakeIP`
- **Destination Network**: `28.0.0.0/8`
- **Static Route Type**: `Next Hop`
- **Next Hop**: `192.168.1.2`
- **Distance**: `1`

点击 **Save**。

#### 添加 Telegram IP 路由（可选）

重复上述步骤，添加以下路由：

| Name | Destination Network | Next Hop |
|------|-------------------|----------|
| Telegram 1 | 149.154.160.0/22 | 192.168.1.2 |
| Telegram 2 | 149.154.164.0/22 | 192.168.1.2 |
| Telegram 3 | 149.154.172.0/22 | 192.168.1.2 |
| Telegram 4 | 91.108.4.0/22 | 192.168.1.2 |
| Telegram 5 | 91.108.8.0/22 | 192.168.1.2 |
| Telegram 6 | 91.108.12.0/22 | 192.168.1.2 |
| Telegram 7 | 91.108.16.0/22 | 192.168.1.2 |
| Telegram 8 | 91.108.20.0/22 | 192.168.1.2 |
| Telegram 9 | 91.108.56.0/22 | 192.168.1.2 |
| Telegram 10 | 95.161.64.0/22 | 192.168.1.2 |
| Telegram 11 | 67.198.55.0/24 | 192.168.1.2 |
| Telegram 12 | 109.239.140.0/24 | 192.168.1.2 |

### 步骤二：配置 DNS

#### 1. 配置网关 DNS

1. 进入 **Settings > Internet > WAN**
2. 点击编辑 WAN 接口
3. 在 **DNS Server** 中：
   - **DNS Server 1**: `192.168.1.2`
   - **DNS Server 2**: `223.5.5.5` (备用)
4. 点击 **Save**

#### 2. 配置 DHCP DNS

1. 进入 **Settings > Networks**
2. 点击编辑 LAN 网络
3. 在 **DHCP** 部分：
   - **DHCP DNS Server**: `Manual`
   - **DNS Server 1**: `192.168.1.2`
   - **DNS Server 2**: `223.5.5.5` (可选)
4. 点击 **Save**

### 步骤三：配置健康检查（高级）

UniFi 不直接支持健康检查脚本，但可以通过 SSH 登录网关配置。

#### 1. SSH 登录网关

```bash
ssh admin@192.168.1.1
```

#### 2. 创建检查脚本

```bash
cat > /config/scripts/msm-check.sh << 'EOF'
#!/bin/bash

MSM_IP="192.168.1.2"
BACKUP_DNS="223.5.5.5"
CHECK_HOST="1.1.1.1"

# 检查 MSM 是否可达
if ping -c 3 -W 5 $CHECK_HOST > /dev/null 2>&1; then
    # MSM 正常
    echo "MSM is healthy"
else
    # MSM 故障，切换 DNS
    echo "MSM is down, switching to backup DNS"
    # 这里需要通过 UniFi API 修改 DNS 设置
fi
EOF

chmod +x /config/scripts/msm-check.sh
```

#### 3. 添加定时任务

```bash
# 编辑 crontab
crontab -e

# 添加以下行（每分钟检查一次）
* * * * * /config/scripts/msm-check.sh
```

::: warning 注意
UniFi 网关的配置在固件升级后可能会丢失，建议使用 UniFi Controller 的配置管理功能。
:::

## 配置验证

### 1. 检查静态路由

在 UniFi Controller 中，进入 **Settings > Routing & Firewall > Static Routes**，确认路由已添加。

### 2. 检查 DNS 设置

在 UniFi Controller 中，进入 **Settings > Networks**，确认 DHCP DNS 已设置为 `192.168.1.2`。

### 3. 测试 DNS 解析

在客户端设备上：

**Windows**:
```cmd
nslookup google.com
```

**Linux/macOS**:
```bash
dig google.com
```

应该返回 28.0.0.0/8 网段的 IP 地址。

## 故障排查

### 问题 1: 静态路由不生效

**解决方法**:
1. 检查路由配置是否正确
2. 尝试重启网关
3. 检查 MSM 主机是否在线

### 问题 2: DNS 不生效

**解决方法**:
1. 检查 DHCP DNS 配置是否正确
2. 在客户端上释放并重新获取 IP（`ipconfig /release && ipconfig /renew`）
3. 检查客户端 DNS 设置（`ipconfig /all`）

### 问题 3: 无法访问国外网站

**解决方法**:
1. 检查静态路由是否配置正确
2. 检查客户端 IP 是否在 MSM 白名单中
3. 检查 SingBox/Mihomo 是否运行

## 高级配置

### 使用 UniFi API 自动化配置

可以使用 UniFi API 自动化配置静态路由和 DNS 设置。

#### 1. 获取 API Token

```bash
curl -X POST https://192.168.1.1:8443/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}' \
  -k
```

#### 2. 添加静态路由

```bash
curl -X POST https://192.168.1.1:8443/api/s/default/rest/routing \
  -H "Content-Type: application/json" \
  -H "Cookie: unifises=..." \
  -d '{"type":"static-route","name":"MSM FakeIP","static-route_network":"28.0.0.0/8","static-route_nexthop":"192.168.1.2","static-route_distance":"1"}' \
  -k
```

::: tip 提示
UniFi API 的使用较为复杂，建议参考官方文档或使用第三方工具。
:::

## 下一步

- [设备管理](/zh/guide/device-management) - 配置设备白名单
- [基础配置](/zh/guide/basic-config) - MSM 基础配置
- [常见问题](/zh/faq/) - 故障排查
