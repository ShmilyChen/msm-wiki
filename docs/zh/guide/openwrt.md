# OpenWrt 配置指南

本文档介绍如何在 OpenWrt/LEDE 路由器上配置 MSM 旁路由，实现 DNS 分流和透明代理。

## 环境说明

**示例网络环境**：
- OpenWrt 路由器 IP: `192.168.1.1`
- MSM 主机 IP: `192.168.1.2`
- 备用 DNS: `223.5.5.5`

## 配置步骤

### 步骤一：配置静态路由

#### 方式一：LuCI Web 界面

1. 登录 OpenWrt 管理界面
2. 进入 **网络 > 路由**
3. 点击 **添加**，填写以下信息：
   - **接口**: `lan`
   - **目标**: `28.0.0.0`
   - **IPv4 网关**: `192.168.1.2`
   - **IPv4 子网掩码**: `255.0.0.0`
   - **跃点数**: `0`
4. 点击 **保存并应用**

#### 方式二：命令行

SSH 登录 OpenWrt，执行以下命令：

```bash
# 添加 FakeIP 路由
uci add network route
uci set network.@route[-1].interface='lan'
uci set network.@route[-1].target='28.0.0.0'
uci set network.@route[-1].netmask='255.0.0.0'
uci set network.@route[-1].gateway='192.168.1.2'
uci commit network
/etc/init.d/network reload
```

#### 添加 Telegram IP 路由（可选）

```bash
# Telegram IP 段
for ip in \
  149.154.160.0/22 \
  149.154.164.0/22 \
  149.154.172.0/22 \
  91.108.4.0/22 \
  91.108.8.0/22 \
  91.108.12.0/22 \
  91.108.16.0/22 \
  91.108.20.0/22 \
  91.108.56.0/22 \
  95.161.64.0/22 \
  67.198.55.0/24 \
  109.239.140.0/24
do
  uci add network route
  uci set network.@route[-1].interface='lan'
  uci set network.@route[-1].target=$(echo $ip | cut -d'/' -f1)
  uci set network.@route[-1].netmask=$(ipcalc.sh $ip | grep NETMASK | cut -d'=' -f2)
  uci set network.@route[-1].gateway='192.168.1.2'
done
uci commit network
/etc/init.d/network reload
```

### 步骤二：配置 DNS

#### 方式一：LuCI Web 界面

1. 进入 **网络 > 接口 > LAN > 编辑**
2. 在 **高级设置** 标签页中：
   - **使用自定义的 DNS 服务器**: `192.168.1.2`
3. 在 **DHCP 服务器** 标签页中：
   - **DHCP 选项**: `6,192.168.1.2`
4. 点击 **保存并应用**

#### 方式二：命令行

```bash
# 配置 DNS
uci set network.lan.dns='192.168.1.2'
uci set dhcp.lan.dhcp_option='6,192.168.1.2'
uci commit
/etc/init.d/network reload
/etc/init.d/dnsmasq reload
```

### 步骤三：配置健康检查（推荐）

创建健康检查脚本，监控 MSM 服务状态。

#### 1. 创建检查脚本

```bash
cat > /root/msm-check.sh << 'EOF'
#!/bin/sh

MSM_IP="192.168.1.2"
BACKUP_DNS="223.5.5.5"
CHECK_HOST="1.1.1.1"

# 检查 MSM 是否可达
if ping -c 3 -W 5 $CHECK_HOST > /dev/null 2>&1; then
    # MSM 正常，使用 MSM DNS
    uci set network.lan.dns="$MSM_IP"
    uci set dhcp.lan.dhcp_option="6,$MSM_IP"
else
    # MSM 故障，使用备用 DNS
    uci set network.lan.dns="$BACKUP_DNS"
    uci set dhcp.lan.dhcp_option="6,$BACKUP_DNS"
fi

uci commit
/etc/init.d/network reload
/etc/init.d/dnsmasq reload
EOF

chmod +x /root/msm-check.sh
```

#### 2. 添加定时任务

```bash
# 编辑 crontab
crontab -e

# 添加以下行（每分钟检查一次）
* * * * * /root/msm-check.sh
```

## 配置验证

### 1. 检查静态路由

```bash
ip route | grep 28.0.0.0
```

应该显示：
```
28.0.0.0/8 via 192.168.1.2 dev br-lan
```

### 2. 检查 DNS 设置

```bash
uci show network.lan.dns
uci show dhcp.lan.dhcp_option
```

### 3. 测试 DNS 解析

```bash
nslookup google.com 192.168.1.2
```

应该返回 28.0.0.0/8 网段的 IP 地址。

## 故障排查

### 问题 1: 静态路由不生效

**解决方法**:
```bash
# 重启网络服务
/etc/init.d/network restart
```

### 问题 2: DNS 不生效

**解决方法**:
```bash
# 重启 dnsmasq
/etc/init.d/dnsmasq restart
```

### 问题 3: 定时任务不执行

**解决方法**:
```bash
# 检查 cron 服务是否运行
/etc/init.d/cron status

# 启动 cron 服务
/etc/init.d/cron start
/etc/init.d/cron enable
```

## 下一步

- [OpenWrt 进阶配置](/zh/guide/openwrt-advanced) - 自动化脚本和高级功能
- [设备管理](/zh/guide/device-management) - 配置设备白名单
- [基础配置](/zh/guide/basic-config) - MSM 基础配置
- [常见问题](/zh/faq/) - 故障排查
