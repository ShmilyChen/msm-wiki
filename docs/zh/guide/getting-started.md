# 快速开始

本指南将帮助你快速部署和使用 MSM。

::: tip 推荐方式
推荐使用[一键安装脚本](/zh/guide/install)，自动完成所有配置。本页面介绍手动安装方式。
:::

## 系统要求

### 支持的平台

- ✅ **Linux** (Ubuntu 20.04+ / Debian 11+ / CentOS 8+ / Alpine 3.15+)
- ✅ **macOS** (10.15+)

### 支持的架构

- ✅ x86_64 (amd64)
- ✅ ARM64 (aarch64)

### 支持的 libc

- ✅ **glibc** (标准 Linux 发行版)
- ✅ **musl** (Alpine Linux)

### 最低配置

- **CPU**: 1 核心
- **内存**: 512MB
- **磁盘**: 2GB 可用空间
- **权限**: root 或 sudo 权限（Linux）/ 管理员权限（macOS）

### 推荐配置

- **CPU**: 2 核心以上
- **内存**: 2GB 以上
- **磁盘**: 10GB 以上可用空间
- **网络**: 公网 IP（用于远程访问）

## 手动安装

### 1. 下载二进制文件

访问 [Releases 页面](https://github.com/msm9527/msm-wiki/releases/latest) 下载对应平台和架构的压缩包。

**Linux amd64 (glibc)**:
```bash
wget https://github.com/msm9527/msm-wiki/releases/latest/download/msm-0.7.1-linux-amd64.tar.gz
tar -xzf msm-0.7.1-linux-amd64.tar.gz
sudo mv msm /usr/local/bin/msm
sudo chmod +x /usr/local/bin/msm
```

**Linux amd64 (musl - Alpine)**:
```bash
wget https://github.com/msm9527/msm-wiki/releases/latest/download/msm-0.7.1-linux-amd64-musl.tar.gz
tar -xzf msm-0.7.1-linux-amd64-musl.tar.gz
sudo mv msm /usr/local/bin/msm
sudo chmod +x /usr/local/bin/msm
```

**Linux arm64 (glibc)**:
```bash
wget https://github.com/msm9527/msm-wiki/releases/latest/download/msm-0.7.1-linux-arm64.tar.gz
tar -xzf msm-0.7.1-linux-arm64.tar.gz
sudo mv msm /usr/local/bin/msm
sudo chmod +x /usr/local/bin/msm
```

**Linux arm64 (musl - Alpine)**:
```bash
wget https://github.com/msm9527/msm-wiki/releases/latest/download/msm-0.7.1-linux-arm64-musl.tar.gz
tar -xzf msm-0.7.1-linux-arm64-musl.tar.gz
sudo mv msm /usr/local/bin/msm
sudo chmod +x /usr/local/bin/msm
```

**macOS amd64 (Intel)**:
```bash
wget https://github.com/msm9527/msm-wiki/releases/latest/download/msm-0.7.1-darwin-amd64.tar.gz
tar -xzf msm-0.7.1-darwin-amd64.tar.gz
sudo mv msm /usr/local/bin/msm
sudo chmod +x /usr/local/bin/msm
```

**macOS arm64 (Apple Silicon)**:
```bash
wget https://github.com/msm9527/msm-wiki/releases/latest/download/msm-0.7.1-darwin-arm64.tar.gz
tar -xzf msm-0.7.1-darwin-arm64.tar.gz
sudo mv msm /usr/local/bin/msm
sudo chmod +x /usr/local/bin/msm
```

::: tip 提示
请将版本号 `0.7.1` 替换为最新版本号。
:::

### 2. 安装系统服务（可选）

**使用 systemd（推荐）**:
```bash
# 安装系统服务并设置开机自启
sudo msm service install

# 启动服务
sudo systemctl start msm

# 查看状态
sudo systemctl status msm
```

**直接运行**:
```bash
# 前台运行
msm

# 后台运行
msm -d

# 指定端口
msm -p 8080

# 指定配置目录
msm -c /opt/msm
```

### 3. 配置防火墙

MSM 需要开放以下端口：

**Ubuntu/Debian (UFW)**:
```bash
# Web 管理界面
sudo ufw allow 7777/tcp

# DNS 服务端口
sudo ufw allow 53/tcp
sudo ufw allow 53/udp
sudo ufw allow 1053/tcp
sudo ufw allow 1053/udp

# 代理服务端口
sudo ufw allow 7890/tcp
sudo ufw allow 7891/tcp
sudo ufw allow 7892/tcp

# 管理端口
sudo ufw allow 6666/tcp
```

**CentOS/RHEL (firewalld)**:
```bash
# 批量开放端口
for port in 7777 53 1053 7890 7891 7892 6666; do
  sudo firewall-cmd --permanent --add-port=${port}/tcp
  sudo firewall-cmd --permanent --add-port=${port}/udp
done
sudo firewall-cmd --reload
```

::: warning 端口说明
- **7777**: Web 管理界面
- **53, 1053**: MosDNS DNS 服务
- **7890, 7891, 7892**: SingBox/Mihomo 代理服务
- **6666**: 管理端口
:::

### 4. 处理端口冲突（如果需要）

如果 53 端口被占用（如 systemd-resolved），需要停止冲突服务：

```bash
# 停止 systemd-resolved
sudo systemctl stop systemd-resolved
sudo systemctl disable systemd-resolved

# 更新 DNS 配置
sudo rm /etc/resolv.conf
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf
echo "nameserver 1.1.1.1" | sudo tee -a /etc/resolv.conf
```

## 首次使用

### 1. 访问 Web 界面

打开浏览器访问：

```
http://your-server-ip:7777
```

### 2. 创建管理员账号

::: tip 首次访问
首次访问时，系统会引导你创建管理员账号。请设置强密码并妥善保管。
:::

### 3. 开始使用

登录后即可开始管理 MosDNS、SingBox 和 Mihomo 服务。

如果需要多用户使用：

1. 进入"用户管理"页面
2. 点击"创建用户"
3. 填写用户信息并选择角色
4. 保存

## MSM 命令详解

### 基本命令

```bash
# 直接启动（前台运行）
msm

# 指定端口启动
msm -p 8080

# 指定配置目录
msm -c /opt/msm

# 后台运行
msm -d

# 查看版本
msm -v
```

### 服务管理

```bash
# 安装系统服务（开机自启）
sudo msm service install

# 卸载系统服务
sudo msm service uninstall

# 启动服务
sudo systemctl start msm
# 或
sudo msm restart

# 停止服务
sudo systemctl stop msm
# 或
sudo msm stop

# 查看状态
sudo systemctl status msm
# 或
sudo msm status

# 重启服务
sudo systemctl restart msm
# 或
sudo msm restart
```

### 日志查看

```bash
# 查看实时日志
sudo msm logs

# 使用 systemd 查看日志
sudo journalctl -u msm -f

# 查看最近 50 条日志
sudo journalctl -u msm -n 50
```

### 其他命令

```bash
# 初始化配置目录
msm init

# 重置管理员密码
sudo msm reset-password

# 系统诊断
sudo msm doctor
```

## 配置说明

### 默认配置

- **配置目录**: `/root/.msm`
- **HTTP 端口**: `7777`
- **数据目录**: `/root/.msm/data`
- **日志目录**: `/root/.msm/logs`

### 自定义配置

```bash
# 使用自定义配置目录
msm -c /opt/msm

# 使用自定义端口
msm -p 8080

# 组合使用
msm -c /opt/msm -p 8080
```

## 常见问题

### 端口被占用

如果 7777 端口被占用，可以修改端口：

```bash
msm -p 8888
```

### 无法访问 Web 界面

1. 检查服务状态：
   ```bash
   sudo systemctl status msm
   ```

2. 检查防火墙：
   ```bash
   # Ubuntu/Debian
   sudo ufw status

   # CentOS/RHEL
   sudo firewall-cmd --list-all
   ```

3. 检查端口监听：
   ```bash
   sudo netstat -tlnp | grep 7777
   ```

4. 检查云服务器安全组：
   - 如果使用阿里云、腾讯云等，需要在控制台开放 7777 端口

### 服务无法启动

查看详细日志：

```bash
sudo journalctl -u msm -n 50 --no-pager
```

## 下一步

- [详细安装教程](/zh/guide/install) - 查看完整安装选项
- [基础配置](/zh/guide/basic-config) - 配置系统参数
- [用户管理](/zh/guide/user-management) - 管理用户和权限
- [服务管理](/zh/guide/mosdns) - 开始管理服务
