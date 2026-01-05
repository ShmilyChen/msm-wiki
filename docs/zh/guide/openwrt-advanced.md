# OpenWrt 进阶配置

本文档介绍 OpenWrt 的高级配置方法，包括自动化脚本、批量路由管理等。

## 自动化路由配置脚本

手动添加大量静态路由比较繁琐，可以使用自动化脚本批量配置。

### 脚本功能

- 自动读取路由列表文件
- 批量添加静态路由
- 智能清理旧路由，避免冲突
- 支持路由优先级设置
- 支持注释和空行

### 创建路由列表文件

首先创建路由列表文件 `/root/routes.txt`：

```bash
cat > /root/routes.txt << 'EOF'
# MosDNS 和 Mihomo FakeIP 路由
28.0.0.0/8
8.8.8.8/32
1.1.1.1/32

# Telegram 路由
149.154.160.0/22
149.154.164.0/22
149.154.172.0/22
91.108.4.0/22
91.108.8.0/22
91.108.12.0/22
91.108.16.0/22
91.108.20.0/22
91.108.56.0/22
95.161.64.0/22
67.198.55.0/24
109.239.140.0/24

# Netflix 路由
207.45.72.0/22
208.75.76.0/22
210.0.153.0/24
185.76.151.0/24
EOF
```

### 创建自动化配置脚本

创建脚本 `/root/setup-routes.sh`：

```bash
cat > /root/setup-routes.sh << 'EOF'
#!/bin/bash

# 配置变量
DEFAULT_INTERFACE="lan"
HIGH_PRIORITY_NET="28.0.0.0/8"
ROUTES_FILE="/root/routes.txt"
DEFAULT_GATEWAY_DEFAULT_VALUE="192.168.1.2"

# 提示用户输入网关 IP
echo "请输入 MSM 主机 IP 地址（默认: $DEFAULT_GATEWAY_DEFAULT_VALUE）:"
read -r user_input

# 使用用户输入或默认值
if [ -z "$user_input" ]; then
    DEFAULT_GATEWAY="$DEFAULT_GATEWAY_DEFAULT_VALUE"
else
    DEFAULT_GATEWAY="$user_input"
fi

echo "使用网关: $DEFAULT_GATEWAY"

# 清理旧路由
echo "正在清理旧路由..."
EXISTING_ROUTES=$(uci show network | grep "=route" | grep -v "=route6" | cut -d'.' -f2 | cut -d'=' -f1)

for route in $EXISTING_ROUTES; do
    GATEWAY=$(uci get network."$route".gateway 2>/dev/null)
    if [ "$GATEWAY" = "$DEFAULT_GATEWAY" ]; then
        echo "删除旧路由: $route"
        uci delete network."$route"
    fi
done

# 读取路由文件并添加路由
echo "正在添加新路由..."
while IFS= read -r line; do
    # 跳过空行和注释
    if [ -z "$line" ] || [[ "$line" =~ ^# ]]; then
        continue
    fi

    target_net="$line"

    # 添加路由
    ROUTE_SECTION=$(uci add network route)
    uci set network."$ROUTE_SECTION".interface="$DEFAULT_INTERFACE"
    uci set network."$ROUTE_SECTION".target="$target_net"
    uci set network."$ROUTE_SECTION".gateway="$DEFAULT_GATEWAY"

    # 为 FakeIP 网段设置高优先级
    if [ "$target_net" = "$HIGH_PRIORITY_NET" ]; then
        uci set network."$ROUTE_SECTION".metric="0"
        echo "添加高优先级路由: $target_net"
    else
        uci set network."$ROUTE_SECTION".metric="1"
        echo "添加路由: $target_net"
    fi
done < "$ROUTES_FILE"

# 提交配置
echo "正在提交配置..."
uci commit network

# 重启网络
echo "正在重启网络服务..."
/etc/init.d/network reload

echo "路由配置完成！"
echo "使用 'ip route' 命令查看路由表"
EOF

# 添加执行权限
chmod +x /root/setup-routes.sh
```

### 运行脚本

```bash
# 运行脚本
/root/setup-routes.sh

# 按提示输入 MSM 主机 IP（如 192.168.1.2）
# 或直接回车使用默认值
```

### 验证路由

```bash
# 查看路由表
ip route | grep 28.0.0.0

# 查看 UCI 配置
uci show network | grep route
```

## IPv6 支持

如果需要支持 IPv6，可以使用以下脚本：

### 创建 IPv6 路由列表

```bash
cat > /root/routes6.txt << 'EOF'
# IPv6 FakeIP 路由
fc00::/18

# IPv6 Telegram 路由
2001:b28:f23d::/48
2001:b28:f23f::/48
2001:67c:4e8::/48
EOF
```

### 创建 IPv6 配置脚本

```bash
cat > /root/setup-routes6.sh << 'EOF'
#!/bin/bash

DEFAULT_INTERFACE="lan"
ROUTES_FILE="/root/routes6.txt"
DEFAULT_GATEWAY_DEFAULT_VALUE="fd00::2"

echo "请输入 MSM 主机 IPv6 地址（默认: $DEFAULT_GATEWAY_DEFAULT_VALUE）:"
read -r user_input

if [ -z "$user_input" ]; then
    DEFAULT_GATEWAY="$DEFAULT_GATEWAY_DEFAULT_VALUE"
else
    DEFAULT_GATEWAY="$user_input"
fi

echo "使用网关: $DEFAULT_GATEWAY"

# 清理旧路由
echo "正在清理旧 IPv6 路由..."
EXISTING_ROUTES=$(uci show network | grep "=route6" | cut -d'.' -f2 | cut -d'=' -f1)

for route in $EXISTING_ROUTES; do
    GATEWAY=$(uci get network."$route".gateway 2>/dev/null)
    if [ "$GATEWAY" = "$DEFAULT_GATEWAY" ]; then
        echo "删除旧路由: $route"
        uci delete network."$route"
    fi
done

# 添加新路由
echo "正在添加新 IPv6 路由..."
while IFS= read -r line; do
    if [ -z "$line" ] || [[ "$line" =~ ^# ]]; then
        continue
    fi

    target_net="$line"

    ROUTE_SECTION=$(uci add network route6)
    uci set network."$ROUTE_SECTION".interface="$DEFAULT_INTERFACE"
    uci set network."$ROUTE_SECTION".target="$target_net"
    uci set network."$ROUTE_SECTION".gateway="$DEFAULT_GATEWAY"

    echo "添加 IPv6 路由: $target_net"
done < "$ROUTES_FILE"

uci commit network
/etc/init.d/network reload

echo "IPv6 路由配置完成！"
EOF

chmod +x /root/setup-routes6.sh
```

## 高级 DNS 配置

### 使用 dnsmasq 配置

OpenWrt 默认使用 dnsmasq 作为 DNS 服务器，可以配置 dnsmasq 转发到 MSM。

#### 方式一：修改 dnsmasq 配置文件

```bash
# 编辑 dnsmasq 配置
cat >> /etc/dnsmasq.conf << 'EOF'

# 转发所有 DNS 请求到 MSM
server=192.168.1.2

# 禁用上游 DNS
no-resolv
EOF

# 重启 dnsmasq
/etc/init.d/dnsmasq restart
```

#### 方式二：使用 UCI 配置

```bash
# 配置 dnsmasq
uci set dhcp.@dnsmasq[0].noresolv='1'
uci add_list dhcp.@dnsmasq[0].server='192.168.1.2'
uci commit dhcp

# 重启 dnsmasq
/etc/init.d/dnsmasq restart
```

### 配置 DNS 劫持（可选）

强制所有 DNS 请求通过 MSM，防止设备使用自定义 DNS。

```bash
# 添加防火墙规则
cat >> /etc/firewall.user << 'EOF'

# DNS 劫持 - 重定向所有 DNS 请求到 MSM
iptables -t nat -A PREROUTING -p udp --dport 53 -j DNAT --to 192.168.1.2:53
iptables -t nat -A PREROUTING -p tcp --dport 53 -j DNAT --to 192.168.1.2:53

# IPv6 DNS 劫持
ip6tables -t nat -A PREROUTING -p udp --dport 53 -j DNAT --to [fd00::2]:53
ip6tables -t nat -A PREROUTING -p tcp --dport 53 -j DNAT --to [fd00::2]:53
EOF

# 重启防火墙
/etc/init.d/firewall restart
```

## 健康检查和自动切换

配置健康检查脚本，MSM 故障时自动切换到备用 DNS。

### 创建健康检查脚本

```bash
cat > /root/msm-health-check.sh << 'EOF'
#!/bin/bash

MSM_IP="192.168.1.2"
BACKUP_DNS="223.5.5.5"
CHECK_HOST="1.1.1.1"
LOG_FILE="/var/log/msm-health-check.log"

# 记录日志
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> $LOG_FILE
}

# 检查 MSM 是否可达
if ping -c 3 -W 5 $CHECK_HOST > /dev/null 2>&1; then
    # MSM 正常，使用 MSM DNS
    CURRENT_DNS=$(uci get dhcp.@dnsmasq[0].server 2>/dev/null | grep $MSM_IP)
    if [ -z "$CURRENT_DNS" ]; then
        log "MSM 恢复，切换到 MSM DNS"
        uci delete dhcp.@dnsmasq[0].server
        uci add_list dhcp.@dnsmasq[0].server="$MSM_IP"
        uci set network.lan.dns="$MSM_IP"
        uci set dhcp.lan.dhcp_option="6,$MSM_IP"
        uci commit
        /etc/init.d/network reload
        /etc/init.d/dnsmasq restart
    fi
else
    # MSM 故障，使用备用 DNS
    CURRENT_DNS=$(uci get dhcp.@dnsmasq[0].server 2>/dev/null | grep $BACKUP_DNS)
    if [ -z "$CURRENT_DNS" ]; then
        log "MSM 故障，切换到备用 DNS"
        uci delete dhcp.@dnsmasq[0].server
        uci add_list dhcp.@dnsmasq[0].server="$BACKUP_DNS"
        uci set network.lan.dns="$BACKUP_DNS"
        uci set dhcp.lan.dhcp_option="6,$BACKUP_DNS"
        uci commit
        /etc/init.d/network reload
        /etc/init.d/dnsmasq restart
    fi
fi
EOF

chmod +x /root/msm-health-check.sh
```

### 配置定时任务

```bash
# 编辑 crontab
crontab -e

# 添加以下行（每分钟检查一次）
* * * * * /root/msm-health-check.sh
```

## 性能优化

### 调整 dnsmasq 缓存

```bash
# 增加 DNS 缓存大小
uci set dhcp.@dnsmasq[0].cachesize='10000'
uci commit dhcp
/etc/init.d/dnsmasq restart
```

### 调整网络参数

```bash
# 优化网络性能
cat >> /etc/sysctl.conf << 'EOF'

# 增加连接跟踪表大小
net.netfilter.nf_conntrack_max=65536

# 优化 TCP 参数
net.ipv4.tcp_fin_timeout=30
net.ipv4.tcp_keepalive_time=1200
net.ipv4.tcp_syncookies=1
net.ipv4.tcp_tw_reuse=1
EOF

# 应用配置
sysctl -p
```

## 故障排查

### 查看路由表

```bash
# 查看 IPv4 路由
ip route

# 查看 IPv6 路由
ip -6 route

# 查看特定路由
ip route | grep 28.0.0.0
```

### 查看 DNS 配置

```bash
# 查看 dnsmasq 配置
uci show dhcp

# 查看 dnsmasq 进程
ps | grep dnsmasq

# 测试 DNS 解析
nslookup google.com 192.168.1.2
```

### 查看防火墙规则

```bash
# 查看 NAT 规则
iptables -t nat -L -n -v

# 查看 IPv6 NAT 规则
ip6tables -t nat -L -n -v
```

### 查看日志

```bash
# 查看系统日志
logread | grep -i dns

# 查看健康检查日志
tail -f /var/log/msm-health-check.log

# 查看 dnsmasq 日志
logread | grep dnsmasq
```

## 备份和恢复

### 备份配置

```bash
# 备份网络配置
cp /etc/config/network /root/network.backup

# 备份 DHCP 配置
cp /etc/config/dhcp /root/dhcp.backup

# 备份防火墙配置
cp /etc/config/firewall /root/firewall.backup

# 备份脚本
tar -czf /root/msm-scripts-backup.tar.gz \
  /root/routes.txt \
  /root/setup-routes.sh \
  /root/msm-health-check.sh
```

### 恢复配置

```bash
# 恢复网络配置
cp /root/network.backup /etc/config/network
uci commit network
/etc/init.d/network reload

# 恢复 DHCP 配置
cp /root/dhcp.backup /etc/config/dhcp
uci commit dhcp
/etc/init.d/dnsmasq restart

# 恢复防火墙配置
cp /root/firewall.backup /etc/config/firewall
uci commit firewall
/etc/init.d/firewall restart
```

## 完整配置示例

以下是一个完整的配置流程：

```bash
# 1. 创建路由列表
cat > /root/routes.txt << 'EOF'
28.0.0.0/8
149.154.160.0/22
149.154.164.0/22
91.108.4.0/22
EOF

# 2. 下载并运行配置脚本
wget -O /root/setup-routes.sh https://example.com/setup-routes.sh
chmod +x /root/setup-routes.sh
/root/setup-routes.sh

# 3. 配置 DNS
uci set dhcp.@dnsmasq[0].noresolv='1'
uci add_list dhcp.@dnsmasq[0].server='192.168.1.2'
uci set network.lan.dns='192.168.1.2'
uci set dhcp.lan.dhcp_option='6,192.168.1.2'
uci commit
/etc/init.d/network reload
/etc/init.d/dnsmasq restart

# 4. 配置健康检查
wget -O /root/msm-health-check.sh https://example.com/msm-health-check.sh
chmod +x /root/msm-health-check.sh
echo "* * * * * /root/msm-health-check.sh" | crontab -

# 5. 验证配置
ip route | grep 28.0.0.0
nslookup google.com
```

## 参考资源

- [OpenWrt 官方文档](https://openwrt.org/docs/start)
- [UCI 配置系统](https://openwrt.org/docs/guide-user/base-system/uci)
- [dnsmasq 配置](https://openwrt.org/docs/guide-user/base-system/dhcp)
- [防火墙配置](https://openwrt.org/docs/guide-user/firewall/firewall_configuration)

## 下一步

- [OpenWrt 基础配置](/zh/guide/openwrt) - 基础配置指南
- [设备管理](/zh/guide/device-management) - 配置设备白名单
- [常见问题](/zh/faq/) - 故障排查
