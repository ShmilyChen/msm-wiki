# MSM Docker 镜像

MSM 官方 Docker 镜像，支持多架构部署。

## 支持的架构

- `linux/amd64` - x86_64 系统
- `linux/arm64` - ARM64 系统（如树莓派 4、Apple Silicon）
- `linux/arm/v7` - ARMv7 系统（如树莓派 3）
- `linux/arm/v6` - ARMv6 系统（如树莓派 Zero）
- `linux/386` - 32位 x86 系统

## 快速开始

### 基础运行

```bash
docker run -d \
  --name msm \
  -p 7777:7777 \
  -v msm-data:/opt/msm \
  --restart unless-stopped \
  msmbox/msm:latest
```

访问 `http://localhost:7777` 开始使用。

### 完整配置

```bash
docker run -d \
  --name msm \
  -p 7777:7777 \
  -p 53:53/udp \
  -p 53:53/tcp \
  -p 1053:1053/udp \
  -p 7890:7890 \
  -p 7891:7891 \
  -p 7892:7892 \
  -p 6666:6666 \
  -v msm-data:/opt/msm \
  -v msm-logs:/var/log/msm \
  -e TZ=Asia/Shanghai \
  -e MSM_PORT=7777 \
  --restart unless-stopped \
  msmbox/msm:latest
```

## 端口说明

| 端口 | 协议 | 说明 |
|------|------|------|
| 7777 | TCP | Web 管理界面 |
| 53 | UDP/TCP | DNS 服务 (MosDNS) |
| 1053 | UDP/TCP | DNS 备用端口 |
| 7890 | TCP | HTTP 代理 (SingBox/Mihomo) |
| 7891 | TCP | SOCKS5 代理 (SingBox/Mihomo) |
| 7892 | TCP | 混合代理端口 (SingBox/Mihomo) |
| 6666 | TCP | 管理端口 |

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `MSM_PORT` | `7777` | Web 管理界面端口 |
| `MSM_CONFIG_DIR` | `/opt/msm` | 配置目录路径 |
| `TZ` | `Asia/Shanghai` | 时区设置 |
| `JWT_SECRET` | - | JWT 密钥（可选） |

## Docker Compose

创建 `docker-compose.yml` 文件：

```yaml
version: '3.8'

services:
  msm:
    image: msmbox/msm:latest
    container_name: msm
    restart: unless-stopped
    ports:
      - "7777:7777"
      - "53:53/udp"
      - "53:53/tcp"
      - "1053:1053/udp"
      - "7890:7890"
      - "7891:7891"
      - "7892:7892"
      - "6666:6666"
    volumes:
      - msm-data:/opt/msm
      - msm-logs:/var/log/msm
    environment:
      - TZ=Asia/Shanghai
      - MSM_PORT=7777
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:7777/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 5s

volumes:
  msm-data:
  msm-logs:
```

启动：

```bash
docker-compose up -d
```

## 数据持久化

建议挂载以下目录：

- `/opt/msm` - 配置文件和数据目录
- `/var/log/msm` - 日志目录（可选）

## 网络模式

### 默认桥接模式（推荐）

适合大多数场景：

```bash
docker run -d \
  --name msm \
  -p 7777:7777 \
  -v msm-data:/opt/msm \
  msmbox/msm:latest
```

### Host 网络模式

适合需要直接访问宿主机网络的场景（如 DNS 服务）：

```bash
docker run -d \
  --name msm \
  --network host \
  -v msm-data:/opt/msm \
  msmbox/msm:latest
```

**注意**：Host 模式下不需要 `-p` 参数，服务直接使用宿主机端口。

## 常见问题

### 1. 53 端口被占用

如果宿主机的 53 端口被占用（如 systemd-resolved），可以：

**方法1**：使用其他端口

```bash
docker run -d \
  --name msm \
  -p 7777:7777 \
  -p 5353:53/udp \
  -v msm-data:/opt/msm \
  msmbox/msm:latest
```

**方法2**：停止 systemd-resolved

```bash
sudo systemctl stop systemd-resolved
sudo systemctl disable systemd-resolved
```

### 2. 权限问题

容器内使用非 root 用户（uid=1000）运行，如果遇到权限问题：

```bash
# 修改挂载目录权限
sudo chown -R 1000:1000 /path/to/msm-data
```

### 3. 查看日志

```bash
# 查看容器日志
docker logs -f msm

# 查看 MSM 应用日志
docker exec msm ls -lh /var/log/msm
```

### 4. 进入容器

```bash
docker exec -it msm bash
```

## 更新镜像

```bash
# 停止并删除旧容器
docker stop msm
docker rm msm

# 拉取最新镜像
docker pull msmbox/msm:latest

# 重新创建容器
docker run -d \
  --name msm \
  -p 7777:7777 \
  -v msm-data:/opt/msm \
  msmbox/msm:latest
```

使用 Docker Compose：

```bash
docker-compose pull
docker-compose up -d
```

## 版本标签

- `latest` - 最新稳定版本
- `x.y.z` - 特定版本号（如 `0.7.1`）

## 资源

- [项目主页](https://github.com/msm9527/msm)
- [完整文档](https://msm9527.github.io/msm-wiki/)
- [Docker Hub](https://hub.docker.com/r/msmbox/msm)
- [问题反馈](https://github.com/msm9527/msm/issues)

## 许可证

本项目基于 MIT 许可证开源。
