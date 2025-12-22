# 一键安装部署

MSM 提供了一键安装脚本，可以快速在 Linux 服务器上部署 MSM。

## 系统要求

### 最低配置

- **操作系统**: Linux (Ubuntu 20.04+ / Debian 11+ / CentOS 8+)
- **CPU**: 1 核心
- **内存**: 512MB
- **磁盘**: 2GB 可用空间
- **权限**: root 或 sudo 权限

### 推荐配置

- **操作系统**: Ubuntu 22.04 LTS / Debian 12
- **CPU**: 2 核心以上
- **内存**: 2GB 以上
- **磁盘**: 10GB 以上可用空间
- **网络**: 公网 IP（用于远程访问）

### 支持的架构

- ✅ x86_64 (amd64)
- ✅ ARM64 (aarch64)
- ✅ ARMv7

## 快速安装

### 方式一：使用一键脚本（推荐）

```bash
# 下载并运行安装脚本
curl -fsSL https://raw.githubusercontent.com/msm9527/msm-wiki/main/install.sh | sudo bash
```

或者分步执行：

```bash
# 1. 下载脚本
wget https://raw.githubusercontent.com/msm9527/msm-wiki/main/install.sh

# 2. 添加执行权限
chmod +x install.sh

# 3. 运行安装
sudo ./install.sh
```

### 方式二：手动安装

如果你想更多控制安装过程，可以手动安装：

#### 1. 下载最新版本

访问 [Releases 页面](https://github.com/msm9527/msm-wiki/releases/latest) 下载对应架构的二进制文件。

```bash
# 示例：下载 amd64 版本
wget https://github.com/msm9527/msm-wiki/releases/latest/download/msm-linux-amd64

# 添加执行权限
chmod +x msm-linux-amd64

# 重命名
mv msm-linux-amd64 msm
```

#### 2. 创建安装目录

```bash
sudo mkdir -p /opt/msm/data
sudo mkdir -p /opt/msm/logs
sudo mv msm /opt/msm/
```

#### 3. 生成 JWT 密钥

```bash
# 使用 openssl 生成随机密钥
openssl rand -base64 32
```

#### 4. 创建配置文件

```bash
sudo nano /opt/msm/config.env
```

添加以下内容：

```bash
# JWT 密钥（替换为你生成的密钥）
JWT_SECRET=your-generated-secret-key-here

# 服务端口
MSM_PORT=7777

# 数据目录
MSM_DATA_DIR=/opt/msm/data

# 日志级别
LOG_LEVEL=info
```

#### 5. 创建 systemd 服务

```bash
sudo nano /etc/systemd/system/msm.service
```

添加以下内容：

```ini
[Unit]
Description=MSM - Mosdns Singbox Mihomo Manager
Documentation=https://msm9527.github.io/msm-wiki/
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/msm
EnvironmentFile=/opt/msm/config.env
ExecStart=/opt/msm/msm
Restart=on-failure
RestartSec=5s

# 安全配置
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/msm/data /opt/msm/logs

# 日志配置
StandardOutput=append:/opt/msm/logs/msm.log
StandardError=append:/opt/msm/logs/msm-error.log

[Install]
WantedBy=multi-user.target
```

#### 6. 启动服务

```bash
# 重载 systemd 配置
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start msm

# 设置开机自启
sudo systemctl enable msm

# 查看状态
sudo systemctl status msm
```

#### 7. 配置防火墙

**Ubuntu/Debian (UFW)**:
```bash
sudo ufw allow 7777/tcp
```

**CentOS/RHEL (firewalld)**:
```bash
sudo firewall-cmd --permanent --add-port=7777/tcp
sudo firewall-cmd --reload
```

## 安装后配置

### 1. 访问 Web 界面

打开浏览器访问：

```
http://your-server-ip:7777
```

### 2. 首次登录

使用默认账号登录：

- **用户名**: `admin`
- **密码**: `admin123`

::: danger 安全警告
首次登录后请立即修改默认密码！
:::

### 3. 修改密码

1. 登录后点击右上角头像
2. 选择"设置"
3. 点击"修改密码"
4. 输入旧密码和新密码
5. 保存更改

### 4. 创建新用户（可选）

如果需要多用户使用：

1. 进入"用户管理"页面
2. 点击"创建用户"
3. 填写用户信息并选择角色
4. 保存

## 服务管理

### 常用命令

```bash
# 启动服务
sudo systemctl start msm

# 停止服务
sudo systemctl stop msm

# 重启服务
sudo systemctl restart msm

# 查看状态
sudo systemctl status msm

# 查看日志
sudo journalctl -u msm -f

# 查看最近 50 条日志
sudo journalctl -u msm -n 50

# 禁用开机自启
sudo systemctl disable msm

# 启用开机自启
sudo systemctl enable msm
```

### 查看日志文件

```bash
# 查看应用日志
tail -f /opt/msm/logs/msm.log

# 查看错误日志
tail -f /opt/msm/logs/msm-error.log
```

## 更新 MSM

### 方式一：使用脚本更新

```bash
# 停止服务
sudo systemctl stop msm

# 备份当前版本
sudo cp /opt/msm/msm /opt/msm/msm.backup

# 下载最新版本
wget https://github.com/msm9527/msm-wiki/releases/latest/download/msm-linux-amd64 -O /tmp/msm

# 替换文件
sudo mv /tmp/msm /opt/msm/msm
sudo chmod +x /opt/msm/msm

# 启动服务
sudo systemctl start msm

# 查看状态
sudo systemctl status msm
```

### 方式二：重新运行安装脚本

```bash
# 安装脚本会自动检测并更新
curl -fsSL https://raw.githubusercontent.com/msm9527/msm-wiki/main/install.sh | sudo bash
```

## 卸载 MSM

### 完全卸载

```bash
# 停止并禁用服务
sudo systemctl stop msm
sudo systemctl disable msm

# 删除 systemd 服务文件
sudo rm /etc/systemd/system/msm.service
sudo systemctl daemon-reload

# 删除安装目录（包含数据）
sudo rm -rf /opt/msm

# 删除防火墙规则（可选）
sudo ufw delete allow 7777/tcp  # Ubuntu/Debian
# 或
sudo firewall-cmd --permanent --remove-port=7777/tcp  # CentOS/RHEL
sudo firewall-cmd --reload
```

### 保留数据卸载

```bash
# 停止并禁用服务
sudo systemctl stop msm
sudo systemctl disable msm

# 删除 systemd 服务文件
sudo rm /etc/systemd/system/msm.service
sudo systemctl daemon-reload

# 备份数据
sudo cp -r /opt/msm/data /opt/msm-data-backup

# 删除程序文件（保留数据）
sudo rm /opt/msm/msm
sudo rm /opt/msm/config.env
```

## 故障排查

### 服务无法启动

**问题**: 运行 `systemctl start msm` 后服务无法启动

**解决方案**:

1. 查看详细日志：
   ```bash
   sudo journalctl -u msm -n 50 --no-pager
   ```

2. 检查配置文件：
   ```bash
   cat /opt/msm/config.env
   ```

3. 检查端口占用：
   ```bash
   sudo netstat -tlnp | grep 7777
   # 或
   sudo ss -tlnp | grep 7777
   ```

4. 检查文件权限：
   ```bash
   ls -la /opt/msm/
   ```

### 无法访问 Web 界面

**问题**: 浏览器无法访问 `http://server-ip:7777`

**解决方案**:

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

### JWT 密钥错误

**问题**: 日志显示 JWT 相关错误

**解决方案**:

1. 重新生成 JWT 密钥：
   ```bash
   openssl rand -base64 32
   ```

2. 更新配置文件：
   ```bash
   sudo nano /opt/msm/config.env
   ```

3. 重启服务：
   ```bash
   sudo systemctl restart msm
   ```

### 数据库错误

**问题**: 日志显示数据库相关错误

**解决方案**:

1. 检查数据目录权限：
   ```bash
   ls -la /opt/msm/data/
   ```

2. 如果数据损坏，删除数据库文件（会丢失数据）：
   ```bash
   sudo systemctl stop msm
   sudo rm /opt/msm/data/msm.db
   sudo systemctl start msm
   ```

### 内存不足

**问题**: 服务频繁重启或 OOM 错误

**解决方案**:

1. 检查系统内存：
   ```bash
   free -h
   ```

2. 增加 swap 空间：
   ```bash
   # 创建 2GB swap
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile

   # 永久生效
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   ```

## 高级配置

### 修改端口

1. 编辑配置文件：
   ```bash
   sudo nano /opt/msm/config.env
   ```

2. 修改端口：
   ```bash
   MSM_PORT=8888
   ```

3. 更新防火墙规则：
   ```bash
   sudo ufw allow 8888/tcp
   sudo ufw delete allow 7777/tcp
   ```

4. 重启服务：
   ```bash
   sudo systemctl restart msm
   ```

### 配置 HTTPS

参考 [HTTPS 配置指南](/zh/deployment/https)

### 配置反向代理

参考 [Nginx 配置指南](/zh/deployment/nginx)

### 数据备份

```bash
# 创建备份脚本
sudo nano /opt/msm/backup.sh
```

添加以下内容：

```bash
#!/bin/bash
BACKUP_DIR="/opt/msm-backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/msm-backup-$DATE.tar.gz /opt/msm/data
find $BACKUP_DIR -name "msm-backup-*.tar.gz" -mtime +7 -delete
```

设置定时任务：

```bash
# 编辑 crontab
sudo crontab -e

# 添加每天凌晨 2 点备份
0 2 * * * /opt/msm/backup.sh
```

## 性能优化

### 系统优化

```bash
# 增加文件描述符限制
echo "* soft nofile 65535" | sudo tee -a /etc/security/limits.conf
echo "* hard nofile 65535" | sudo tee -a /etc/security/limits.conf

# 优化网络参数
sudo sysctl -w net.core.somaxconn=1024
sudo sysctl -w net.ipv4.tcp_max_syn_backlog=2048
```

### 日志轮转

创建日志轮转配置：

```bash
sudo nano /etc/logrotate.d/msm
```

添加以下内容：

```
/opt/msm/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0640 root root
    postrotate
        systemctl reload msm > /dev/null 2>&1 || true
    endscript
}
```

## 安全建议

1. **修改默认密码**: 首次登录后立即修改
2. **使用强密码**: 密码长度至少 12 位，包含大小写字母、数字和特殊字符
3. **限制访问**: 使用防火墙限制访问 IP
4. **启用 HTTPS**: 使用 SSL/TLS 加密传输
5. **定期备份**: 设置自动备份任务
6. **定期更新**: 及时更新到最新版本
7. **监控日志**: 定期检查日志文件
8. **最小权限**: 为不同用户分配合适的角色权限

## 下一步

- [基础配置](/zh/guide/basic-config) - 配置系统参数
- [用户管理](/zh/guide/user-management) - 管理用户和权限
- [服务管理](/zh/guide/mosdns) - 开始管理服务

## 获取帮助

如果遇到问题：

- 查看 [常见问题](/zh/faq/)
- 查看 [故障排查](/zh/faq/troubleshooting)
- 提交 [Issue](https://github.com/msm9527/msm-wiki/issues)
- 参与 [讨论](https://github.com/msm9527/msm-wiki/discussions)
