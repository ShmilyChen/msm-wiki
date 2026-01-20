# Alpine 安装

Alpine 使用 musl 与 OpenRC，安装流程与常规 Linux 略有不同。

## 依赖准备

确保已安装 `curl` 或 `wget`：

```bash
apk add --no-cache curl
```

## 一键安装

```bash
curl -fsSL https://raw.githubusercontent.com/msm9527/msm-wiki/main/install.sh | sudo bash
```

脚本会自动选择 **musl** 版本。Alpine 使用 OpenRC，可用内置命令托管启动。

## 启动方式（OpenRC）

```bash
sudo msm service install --manager openrc
rc-service msm start
```

## 验证安装

```bash
msm status
msm logs
```

浏览器访问：`http://<MSM-IP>:7777`

## 注意事项

- 如需开机自启，请使用 OpenRC 自行创建服务脚本
- 端口开放请按实际防火墙策略配置

## 下一步

- [路由器集成](/zh/guide/router-integration)
- [首次使用](/zh/guide/first-use)
