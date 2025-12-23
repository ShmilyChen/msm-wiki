# 基础配置

本页聚焦主路由与 DNS 分流的基础配置，适用于 RouterOS（ROS）等软路由场景。

## 变量约定

- `{Debian主机IP}`：部署 MosDNS / Mihomo / sing-box 的 Debian 主机 IP

## 主路由 DNS / DHCP DNS 设置

| 配置项 | 值 |
| --- | --- |
| DNS 服务器 | `{Debian主机IP}` |
| DHCP DNS | `{Debian主机IP}` |

> 说明：若主路由存在备用 DNS，可在故障切换策略中设置为备用值。

## 主路由路由规则（主路由表）

### MosDNS 和 Mihomo fakeip 路由

| 目标地址 | 网关 |
| --- | --- |
| `28.0.0.0/8` | `{Debian主机IP}` |
| `8.8.8.8/32` | `{Debian主机IP}` |
| `1.1.1.1/32` | `{Debian主机IP}` |

### Telegram 路由

| 目标地址 | 网关 |
| --- | --- |
| `149.154.160.0/22` | `{Debian主机IP}` |
| `149.154.164.0/22` | `{Debian主机IP}` |
| `149.154.172.0/22` | `{Debian主机IP}` |
| `91.108.4.0/22` | `{Debian主机IP}` |
| `91.108.20.0/22` | `{Debian主机IP}` |
| `91.108.56.0/22` | `{Debian主机IP}` |
| `91.108.8.0/22` | `{Debian主机IP}` |
| `95.161.64.0/22` | `{Debian主机IP}` |
| `91.108.12.0/22` | `{Debian主机IP}` |
| `91.108.16.0/22` | `{Debian主机IP}` |
| `67.198.55.0/24` | `{Debian主机IP}` |
| `109.239.140.0/24` | `{Debian主机IP}` |

### Netflix 路由

| 目标地址 | 网关 |
| --- | --- |
| `207.45.72.0/22` | `{Debian主机IP}` |
| `208.75.76.0/22` | `{Debian主机IP}` |
| `210.0.153.0/24` | `{Debian主机IP}` |
| `185.76.151.0/24` | `{Debian主机IP}` |

## RouterOS 配置提示（可选）

1. 在 `IP > Routes` 中新增上述路由规则，路由表选择 `main`。
2. 在 `IP > DNS` 设置路由器 DNS 指向 `{Debian主机IP}`。
3. 在 `IP > DHCP Server > Networks` 设置 DHCP 下发 DNS 为 `{Debian主机IP}`。
4. 如需故障切换，可在 `Tools > Netwatch` 监测目标（如 `1.1.1.1`），异常时切换到备用 DNS，恢复后切回主 DNS。
