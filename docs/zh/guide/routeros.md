# RouterOS 配置指南

适用于 MikroTik RouterOS（WinBox / WebFig / CLI）。

## 变量约定

- `{MSM主机IP}`：部署 MosDNS / Mihomo / Sing-box 的主机 IP

## 示例环境

- RouterOS 网关：`192.168.20.1`
- MSM 主机：`192.168.20.2`

## 方式一：同时修改网关和 DNS 为 MSM 主机 IP (最简方式)

1. 打开 **IP > DHCP Server > Networks**
2. 编辑你的 LAN 网络条目
3. 将 **Gateway** 和 **DNS Servers** 设置为 `{MSM主机IP}`

#### CLI（修改已有网络）

```shell
/ip dhcp-server network set 0 dns-server=192.168.20.2 gateway=192.168.20.2
```

## 方式二：仅修改 DNS 为 MSM 主机 IP (进阶方式)

### 步骤一：添加静态路由（FakeIP及其它）

#### Web 界面（WinBox / WebFig）

1. 打开 **IP > Routes**
2. 新增路由：
   - **Dst. Address**：`28.0.0.0/8`
   - **Gateway**：`192.168.20.2`
3. 继续新增 `1.1.1.1` 等IP，根据需求新增Telegram、Netflix等其它IP

#### CLI

```shell
/ip route
add distance=1 dst-address=28.0.0.0/8 gateway=192.168.20.2
add distance=1 dst-address=8.8.8.8/32 gateway=192.168.20.2
add distance=1 dst-address=8.8.4.4/32 gateway=192.168.20.2
add distance=1 dst-address=1.1.1.1/32 gateway=192.168.20.2
add distance=1 dst-address=1.0.0.1/32 gateway=192.168.20.2

# Telegram
add distance=1 dst-address=149.154.160.0/22 gateway=192.168.20.2
add distance=1 dst-address=149.154.164.0/22 gateway=192.168.20.2
add distance=1 dst-address=149.154.172.0/22 gateway=192.168.20.2
add distance=1 dst-address=91.108.4.0/22 gateway=192.168.20.2
add distance=1 dst-address=91.108.20.0/22 gateway=192.168.20.2
add distance=1 dst-address=91.108.56.0/22 gateway=192.168.20.2
add distance=1 dst-address=91.108.8.0/22 gateway=192.168.20.2
add distance=1 dst-address=95.161.64.0/22 gateway=192.168.20.2
add distance=1 dst-address=91.108.12.0/22 gateway=192.168.20.2
add distance=1 dst-address=91.108.16.0/22 gateway=192.168.20.2
add distance=1 dst-address=67.198.55.0/24 gateway=192.168.20.2
add distance=1 dst-address=109.239.140.0/24 gateway=192.168.20.2

# Netflix
add distance=1 dst-address=207.45.72.0/22 gateway=192.168.20.2
add distance=1 dst-address=208.75.76.0/22 gateway=192.168.20.2
add distance=1 dst-address=210.0.153.0/24 gateway=192.168.20.2
add distance=1 dst-address=185.76.151.0/24 gateway=192.168.20.2
```

### 步骤二：配置 DHCP DNS

1. 打开 **IP > DHCP Server > Networks**
2. 编辑你的 LAN 网络条目
3. 将 **DNS Servers** 设置为 `{MSM主机IP}`

#### CLI（修改已有网络）

```shell
/ip dhcp-server network set 0 dns-server=192.168.20.2
```

### 跳过链接追踪 (Conntrack) (可选)

RouterOS v7 的默认防火墙设置，会导致 Conntrack 将目标地址为 FakeIP 的连接首包 (SYN) 标记为 invalid。  
现象为任何需要走代理的连接，需要等待5秒才能建立连接。如果没有遇到上述现象，无需进行此配置。

```shell
# 将需要跳过链接追踪的 IP 添加到地址列表
/ip firewall address-list
add address=28.0.0.0/8 list=msm_list
add address=8.8.8.8/32 list=msm_list
add address=8.8.4.4/32 list=msm_list
add address=1.1.1.1/32 list=msm_list
add address=1.0.0.1/32 list=msm_list

# Telegram
add address=149.154.160.0/22 list=msm_list
add address=149.154.164.0/22 list=msm_list
add address=149.154.172.0/22 list=msm_list
add address=91.108.4.0/22 list=msm_list
add address=91.108.20.0/22 list=msm_list
add address=91.108.56.0/22 list=msm_list
add address=91.108.8.0/22 list=msm_list
add address=95.161.64.0/22 list=msm_list
add address=91.108.12.0/22 list=msm_list
add address=91.108.16.0/22 list=msm_list
add address=67.198.55.0/24 list=msm_list
add address=109.239.140.0/24 list=msm_list

# Netflix
add address=207.45.72.0/22 list=msm_list
add address=208.75.76.0/22 list=msm_list
add address=210.0.153.0/24 list=msm_list
add address=185.76.151.0/24 list=msm_list
```

```shell
# 跳过链接追踪
/ip firewall raw
add action=notrack chain=prerouting dst-address-list=msm_list
```
### Netwatch 故障切换示例

> 目标 IP 可使用 `1.1.1.1` 等公网 IP，备用 DNS 可替换为实际值。

#### 示例一
```shell
/tool netwatch
add host=1.1.1.1 type=http-get http-codes=200-399 interval=10s timeout=1s \
    up-script="/ip dhcp-server network set 0 dns-server=192.168.20.2" \
    down-script="/ip dhcp-server network set 0 dns-server=223.5.5.5"
```

- 当 `1.1.1.1` 可达时，DHCP 下发 MSM 主机 IP 作为 DNS
- 当 `1.1.1.1` 不可达时，DHCP 下发阿里 DNS 223.5.5.5 作为 DNS
- 缺点：故障切换后，需要设备的 DHCP 租约到期，或者手动重新连接网络后才能生效

#### 示例二

```shell
# 将 RouterOS 的 DNS 设置为 MSM 主机 IP
/ip dns set servers=192.168.20.2
/ip dns set allow-remote-requests=yes

# 将 DHCP Server 的网关和 DNS 恢复为 RouterOS IP
/ip dhcp-server network set gateway=192.168.20.1 numbers=0
/ip dhcp-server network set dns-server=192.168.20.1 numbers=0

# 避免 RouterOS 直接使用运营商 DNS 作为上游 DNS
/interface pppoe-client set [find name="pppoe-out1"] use-peer-dns=no

# 配置 Netwatch
/tool netwatch
add host=1.1.1.1 type=http-get http-codes=200-399 interval=10s timeout=1s \
    up-script="/ip dns set servers=192.168.20.2" \
    down-script="/ip dns set servers=223.5.5.5"
```

效果解释:
- 设备使用 RouterOS 作为上游 DNS 服务器，顺序为 `设备 -> RouterOS -> MSM 主机 / 备用 DNS`
- 当 `1.1.1.1` 可达时，RouterOS 的上游 DNS 为 MSM 主机
- 当 `1.1.1.1` 不可达时，RouterOS 的上游 DNS 为阿里 DNS 223.5.5.5
- 当 RouterOS 的上游服务器切换时，设备可以无感切换，无需等待 DHCP 租约到期或手动重连
- 缺点：MSM 中的 MosDNS 会将所有请求来源都识别为 RouterOS 的 IP，无法区分具体设备。  
  如需使用黑白名单功能，请确保目标设备的 DNS 已指向 MSM 主机 IP。

## 验证

- 客户端 `nslookup google.com` 返回 `28.0.0.0/8` 段 IP
- 白名单设备可访问国外站点

## 下一步

- [设备管理](/zh/guide/device-management)
- [MosDNS 管理](/zh/guide/mosdns)
