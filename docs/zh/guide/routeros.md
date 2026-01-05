# RouterOS 配置指南

本文档介绍如何在 RouterOS (MikroTik) 路由器上配置 MSM 旁路由，实现 DNS 分流和透明代理。

## 环境说明

**示例网络环境**：
- RouterOS IP: `192.168.20.1`
- MSM 主机 IP: `192.168.20.2`
- 备用 DNS: `223.5.5.5`

::: tip 提示
请根据实际网络环境修改 IP 地址。
:::

## 前置条件

1. ✅ RouterOS 已连接外网，能够正常上网
2. ✅ MSM 已安装并运行在 `192.168.20.2`
3. ✅ MSM 主机已配置固定 IP 地址
4. ✅ 当前 RouterOS DNS 设置为 `223.5.5.5`

## 配置步骤

### 步骤一：配置静态路由

在 WinBox 或 WebFig 中，进入 `IP > Routes`，添加以下静态路由规则：

#### 1. FakeIP 路由（必需）

```shell
/ip route add \
  comment="MSM FakeIP" \
  disabled=no \
  distance=1 \
  dst-address=28.0.0.0/8 \
  gateway=192.168.20.2 \
  routing-table=main \
  scope=30 \
  suppress-hw-offload=no \
  target-scope=10
```

#### 2. Telegram IP 路由（可选）

```shell
/ip route
add disabled=no distance=1 dst-address=149.154.160.0/22 gateway=192.168.20.2 scope=30 suppress-hw-offload=no target-scope=10
add disabled=no distance=1 dst-address=149.154.164.0/22 gateway=192.168.20.2 scope=30 suppress-hw-offload=no target-scope=10
add disabled=no distance=1 dst-address=149.154.172.0/22 gateway=192.168.20.2 scope=30 suppress-hw-offload=no target-scope=10
add disabled=no distance=1 dst-address=91.108.4.0/22 gateway=192.168.20.2 scope=30 suppress-hw-offload=no target-scope=10
add disabled=no distance=1 dst-address=91.108.8.0/22 gateway=192.168.20.2 scope=30 suppress-hw-offload=no target-scope=10
add disabled=no distance=1 dst-address=91.108.12.0/22 gateway=192.168.20.2 scope=30 suppress-hw-offload=no target-scope=10
add disabled=no distance=1 dst-address=91.108.16.0/22 gateway=192.168.20.2 scope=30 suppress-hw-offload=no target-scope=10
add disabled=no distance=1 dst-address=91.108.20.0/22 gateway=192.168.20.2 scope=30 suppress-hw-offload=no target-scope=10
add disabled=no distance=1 dst-address=91.108.56.0/22 gateway=192.168.20.2 scope=30 suppress-hw-offload=no target-scope=10
add disabled=no distance=1 dst-address=95.161.64.0/22 gateway=192.168.20.2 scope=30 suppress-hw-offload=no target-scope=10
add disabled=no distance=1 dst-address=67.198.55.0/24 gateway=192.168.20.2 scope=30 suppress-hw-offload=no target-scope=10
add disabled=no distance=1 dst-address=109.239.140.0/24 gateway=192.168.20.2 scope=30 suppress-hw-offload=no target-scope=10
```

::: tip 说明
Telegram IP 路由是可选的，用于确保 Telegram 的 IP 直连也走代理。如果不使用 Telegram，可以跳过这一步。
:::

### 步骤二：配置 DNS

#### 1. 修改 RouterOS DNS 设置

进入 `IP > DNS`，将 DNS 服务器设置为 MSM 主机 IP：

**Web 界面配置**：
- Servers: `192.168.20.2`
- Allow Remote Requests: ✅ 勾选

**命令行配置**：
```shell
/ip dns set servers=192.168.20.2 allow-remote-requests=yes
```

#### 2. 配置 DHCP Server

进入 `IP > DHCP Server > Networks`，修改 DHCP 分发的 DNS：

**Web 界面配置**：
- DNS Servers: `192.168.20.2`

**命令行配置**：
```shell
/ip dhcp-server network set dns-server=192.168.20.2 numbers=0
```

::: tip 租约时间
可以将 DHCP 租约时间设置为较短时间（如 3 分钟），这样当 MSM 故障时，设备可以更快地获取新的 DNS 配置。
:::

### 步骤三：配置 Netwatch 自动切换（推荐）

Netwatch 可以监控 MSM 服务状态，当 MSM 故障时自动切换到备用 DNS，恢复后自动切回。

进入 `Tools > Netwatch`，添加监控规则：

#### 配置参数

- **Host**: `1.1.1.1` (监控目标，用于测试 MSM 是否正常)
- **Interval**: `00:00:30` (检查间隔 30 秒)
- **Timeout**: `5000` (超时时间 5 秒)

#### Up 脚本（MSM 恢复时执行）

```shell
/ip dns set servers=192.168.20.2
/ip dhcp-server network set dns-server=192.168.20.2 numbers=0
```

#### Down 脚本（MSM 故障时执行）

```shell
/ip dns set servers=223.5.5.5
/ip dhcp-server network set dns-server=223.5.5.5 numbers=0
```

**命令行配置**：
```shell
/tool netwatch add \
  host=1.1.1.1 \
  interval=30s \
  timeout=5s \
  up-script="/ip dns set servers=192.168.20.2\r\n/ip dhcp-server network set dns-server=192.168.20.2 numbers=0" \
  down-script="/ip dns set servers=223.5.5.5\r\n/ip dhcp-server network set dns-server=223.5.5.5 numbers=0"
```

::: warning 注意
- Up/Down 脚本中的 IP 地址需要根据实际环境修改
- `numbers=0` 表示第一个 DHCP 网络，如果有多个 DHCP 网络，需要修改这个值
:::

## 配置验证

### 1. 检查静态路由

```shell
/ip route print where dst-address=28.0.0.0/8
```

应该显示：
```
Flags: X - disabled, A - active, D - dynamic, C - connect, S - static, r - rip, b - bgp, o - ospf, m - mme, B - blackhole, U - unreachable, P - prohibit
 #      DST-ADDRESS        PREF-SRC        GATEWAY            DISTANCE
 0 AS   28.0.0.0/8                         192.168.20.2              1
```

### 2. 检查 DNS 设置

```shell
/ip dns print
```

应该显示：
```
              servers: 192.168.20.2
  allow-remote-requests: yes
```

### 3. 测试 DNS 解析

在 RouterOS 终端执行：

```shell
/tool dns-lookup name=google.com server=192.168.20.2
```

应该返回 28.0.0.0/8 网段的 IP 地址。

### 4. 测试客户端

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

### 问题 1: DNS 解析失败

**症状**: 客户端无法解析域名

**排查步骤**:
1. 检查 MSM 服务是否运行: `systemctl status msm`
2. 检查 MosDNS 是否监听 53 端口: `netstat -tlnp | grep 53`
3. 检查 RouterOS DNS 设置: `/ip dns print`
4. 检查防火墙是否阻止 DNS 请求

### 问题 2: 无法访问国外网站

**症状**: 客户端可以解析域名，但无法访问国外网站

**排查步骤**:
1. 检查静态路由是否配置正确: `/ip route print where dst-address=28.0.0.0/8`
2. 检查客户端 IP 是否在 MSM 白名单中
3. 检查 SingBox/Mihomo 是否运行
4. 检查代理配置是否正确

### 问题 3: Netwatch 不工作

**症状**: MSM 故障时没有自动切换 DNS

**排查步骤**:
1. 检查 Netwatch 规则是否启用: `/tool netwatch print`
2. 检查 Netwatch 状态: 查看 `status` 字段
3. 检查脚本是否有语法错误
4. 手动执行脚本测试: 复制脚本内容到终端执行

### 问题 4: 国内网站访问慢

**症状**: 访问百度等国内网站速度慢

**可能原因**:
- MosDNS 配置问题，国内域名没有正确分流
- 国内 DNS 上游配置不正确

**解决方法**:
1. 检查 MosDNS 配置文件
2. 确认国内 DNS 上游设置为国内 DNS（如 223.5.5.5）
3. 清理 DNS 缓存

## 高级配置

### 1. 配置多个备用 DNS

```shell
/ip dns set servers=192.168.20.2,223.5.5.5,114.114.114.114
```

::: warning 注意
配置多个 DNS 时，RouterOS 会并发查询所有 DNS，可能导致分流失效。建议只配置一个 DNS，通过 Netwatch 实现故障切换。
:::

### 2. 配置 DNS 缓存

```shell
/ip dns set cache-size=10240 cache-max-ttl=1d
```

### 3. 配置防火墙规则

如果需要限制哪些设备可以使用 MSM DNS：

```shell
# 允许特定 IP 访问 MSM DNS
/ip firewall filter add \
  chain=forward \
  src-address=192.168.20.100 \
  dst-address=192.168.20.2 \
  protocol=udp \
  dst-port=53 \
  action=accept

# 拒绝其他设备访问 MSM DNS
/ip firewall filter add \
  chain=forward \
  dst-address=192.168.20.2 \
  protocol=udp \
  dst-port=53 \
  action=drop
```

## 完整配置脚本

以下是完整的 RouterOS 配置脚本，可以直接复制到终端执行：

```shell
# 配置静态路由
/ip route add comment="MSM FakeIP" disabled=no distance=1 dst-address=28.0.0.0/8 gateway=192.168.20.2 routing-table=main scope=30 suppress-hw-offload=no target-scope=10

# 配置 Telegram IP 路由（可选）
/ip route add disabled=no distance=1 dst-address=149.154.160.0/22 gateway=192.168.20.2 scope=30 suppress-hw-offload=no target-scope=10
/ip route add disabled=no distance=1 dst-address=149.154.164.0/22 gateway=192.168.20.2 scope=30 suppress-hw-offload=no target-scope=10
/ip route add disabled=no distance=1 dst-address=149.154.172.0/22 gateway=192.168.20.2 scope=30 suppress-hw-offload=no target-scope=10
/ip route add disabled=no distance=1 dst-address=91.108.4.0/22 gateway=192.168.20.2 scope=30 suppress-hw-offload=no target-scope=10
/ip route add disabled=no distance=1 dst-address=91.108.8.0/22 gateway=192.168.20.2 scope=30 suppress-hw-offload=no target-scope=10
/ip route add disabled=no distance=1 dst-address=91.108.12.0/22 gateway=192.168.20.2 scope=30 suppress-hw-offload=no target-scope=10
/ip route add disabled=no distance=1 dst-address=91.108.16.0/22 gateway=192.168.20.2 scope=30 suppress-hw-offload=no target-scope=10
/ip route add disabled=no distance=1 dst-address=91.108.20.0/22 gateway=192.168.20.2 scope=30 suppress-hw-offload=no target-scope=10
/ip route add disabled=no distance=1 dst-address=91.108.56.0/22 gateway=192.168.20.2 scope=30 suppress-hw-offload=no target-scope=10
/ip route add disabled=no distance=1 dst-address=95.161.64.0/22 gateway=192.168.20.2 scope=30 suppress-hw-offload=no target-scope=10
/ip route add disabled=no distance=1 dst-address=67.198.55.0/24 gateway=192.168.20.2 scope=30 suppress-hw-offload=no target-scope=10
/ip route add disabled=no distance=1 dst-address=109.239.140.0/24 gateway=192.168.20.2 scope=30 suppress-hw-offload=no target-scope=10

# 配置 DNS
/ip dns set servers=192.168.20.2 allow-remote-requests=yes

# 配置 DHCP Server
/ip dhcp-server network set dns-server=192.168.20.2 numbers=0

# 配置 Netwatch 自动切换
/tool netwatch add \
  host=1.1.1.1 \
  interval=30s \
  timeout=5s \
  up-script="/ip dns set servers=192.168.20.2\r\n/ip dhcp-server network set dns-server=192.168.20.2 numbers=0" \
  down-script="/ip dns set servers=223.5.5.5\r\n/ip dhcp-server network set dns-server=223.5.5.5 numbers=0"
```

::: warning 重要提示
执行脚本前，请根据实际网络环境修改 IP 地址！
:::

## 下一步

- [设备管理](/zh/guide/device-management) - 配置设备白名单
- [基础配置](/zh/guide/basic-config) - MSM 基础配置
- [常见问题](/zh/faq/) - 故障排查
