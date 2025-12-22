#!/bin/bash

# MSM 一键安装部署脚本
# 适用于 Linux 系统 (Ubuntu/Debian/CentOS)

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置变量
INSTALL_DIR="/opt/msm"
GITHUB_REPO="msm9527/msm-wiki"
RELEASE_URL="https://github.com/${GITHUB_REPO}/releases/latest"
SERVICE_NAME="msm"

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查是否为 root 用户
check_root() {
    if [ "$EUID" -ne 0 ]; then
        print_error "请使用 root 权限运行此脚本"
        print_info "使用命令: sudo bash install.sh"
        exit 1
    fi
}

# 检测系统架构
detect_arch() {
    local arch=$(uname -m)
    case $arch in
        x86_64)
            echo "amd64"
            ;;
        aarch64|arm64)
            echo "arm64"
            ;;
        armv7l)
            echo "armv7"
            ;;
        *)
            print_error "不支持的系统架构: $arch"
            exit 1
            ;;
    esac
}

# 检测操作系统
detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        echo $ID
    else
        print_error "无法检测操作系统"
        exit 1
    fi
}

# 安装依赖
install_dependencies() {
    local os=$(detect_os)
    print_info "检测到操作系统: $os"

    case $os in
        ubuntu|debian)
            print_info "更新软件包列表..."
            apt-get update -qq
            print_info "安装依赖..."
            apt-get install -y curl wget tar gzip > /dev/null 2>&1
            ;;
        centos|rhel|fedora)
            print_info "安装依赖..."
            yum install -y curl wget tar gzip > /dev/null 2>&1
            ;;
        *)
            print_warning "未知的操作系统，跳过依赖安装"
            ;;
    esac
}

# 获取最新版本号
get_latest_version() {
    print_info "获取最新版本信息..."
    local version=$(curl -s "https://api.github.com/repos/${GITHUB_REPO}/releases/latest" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')

    if [ -z "$version" ]; then
        print_error "无法获取最新版本信息"
        exit 1
    fi

    echo $version
}

# 下载 MSM
download_msm() {
    local version=$1
    local arch=$2
    local download_url="https://github.com/${GITHUB_REPO}/releases/download/${version}/msm-linux-${arch}"

    print_info "下载 MSM ${version} (${arch})..."
    print_info "下载地址: $download_url"

    # 创建临时目录
    local temp_dir=$(mktemp -d)
    cd $temp_dir

    # 下载文件
    if ! wget -q --show-progress "$download_url" -O msm; then
        print_error "下载失败"
        rm -rf $temp_dir
        exit 1
    fi

    # 添加执行权限
    chmod +x msm

    echo $temp_dir
}

# 安装 MSM
install_msm() {
    local temp_dir=$1

    print_info "安装 MSM 到 ${INSTALL_DIR}..."

    # 创建安装目录
    mkdir -p ${INSTALL_DIR}
    mkdir -p ${INSTALL_DIR}/data
    mkdir -p ${INSTALL_DIR}/logs

    # 复制文件
    cp ${temp_dir}/msm ${INSTALL_DIR}/

    # 清理临时文件
    rm -rf $temp_dir

    print_success "MSM 安装完成"
}

# 生成 JWT 密钥
generate_jwt_secret() {
    if command -v openssl &> /dev/null; then
        openssl rand -base64 32
    else
        # 如果没有 openssl，使用 /dev/urandom
        cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1
    fi
}

# 创建配置文件
create_config() {
    print_info "创建配置文件..."

    local jwt_secret=$(generate_jwt_secret)

    cat > ${INSTALL_DIR}/config.env << EOF
# MSM 配置文件
# 生成时间: $(date)

# JWT 密钥（请妥善保管）
JWT_SECRET=${jwt_secret}

# 服务端口
MSM_PORT=7777

# 数据目录
MSM_DATA_DIR=${INSTALL_DIR}/data

# 日志级别 (debug, info, warn, error)
LOG_LEVEL=info
EOF

    chmod 600 ${INSTALL_DIR}/config.env
    print_success "配置文件已创建: ${INSTALL_DIR}/config.env"
}

# 创建 systemd 服务
create_systemd_service() {
    print_info "创建 systemd 服务..."

    cat > /etc/systemd/system/${SERVICE_NAME}.service << EOF
[Unit]
Description=MSM - Mosdns Singbox Mihomo Manager
Documentation=https://msm9527.github.io/msm-wiki/
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=${INSTALL_DIR}
EnvironmentFile=${INSTALL_DIR}/config.env
ExecStart=${INSTALL_DIR}/msm
Restart=on-failure
RestartSec=5s

# 安全配置
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=${INSTALL_DIR}/data ${INSTALL_DIR}/logs

# 日志配置
StandardOutput=append:${INSTALL_DIR}/logs/msm.log
StandardError=append:${INSTALL_DIR}/logs/msm-error.log

[Install]
WantedBy=multi-user.target
EOF

    # 重载 systemd
    systemctl daemon-reload

    print_success "systemd 服务已创建"
}

# 配置防火墙
configure_firewall() {
    print_info "配置防火墙..."

    # 检测防火墙类型
    if command -v ufw &> /dev/null; then
        # Ubuntu/Debian UFW
        ufw allow 7777/tcp > /dev/null 2>&1 || true
        print_success "UFW 防火墙规则已添加"
    elif command -v firewall-cmd &> /dev/null; then
        # CentOS/RHEL firewalld
        firewall-cmd --permanent --add-port=7777/tcp > /dev/null 2>&1 || true
        firewall-cmd --reload > /dev/null 2>&1 || true
        print_success "firewalld 防火墙规则已添加"
    else
        print_warning "未检测到防火墙，请手动开放 7777 端口"
    fi
}

# 启动服务
start_service() {
    print_info "启动 MSM 服务..."

    systemctl enable ${SERVICE_NAME}
    systemctl start ${SERVICE_NAME}

    # 等待服务启动
    sleep 2

    # 检查服务状态
    if systemctl is-active --quiet ${SERVICE_NAME}; then
        print_success "MSM 服务已启动"
    else
        print_error "MSM 服务启动失败"
        print_info "查看日志: journalctl -u ${SERVICE_NAME} -n 50"
        exit 1
    fi
}

# 显示安装信息
show_info() {
    local ip=$(curl -s ifconfig.me || echo "your-server-ip")

    echo ""
    echo "=========================================="
    echo -e "${GREEN}MSM 安装完成！${NC}"
    echo "=========================================="
    echo ""
    echo "访问地址: http://${ip}:7777"
    echo ""
    echo "默认账号:"
    echo "  用户名: admin"
    echo "  密码: admin123"
    echo ""
    echo -e "${YELLOW}重要提示:${NC}"
    echo "  1. 首次登录后请立即修改默认密码"
    echo "  2. JWT 密钥已保存在: ${INSTALL_DIR}/config.env"
    echo "  3. 请妥善保管配置文件"
    echo ""
    echo "常用命令:"
    echo "  启动服务: systemctl start ${SERVICE_NAME}"
    echo "  停止服务: systemctl stop ${SERVICE_NAME}"
    echo "  重启服务: systemctl restart ${SERVICE_NAME}"
    echo "  查看状态: systemctl status ${SERVICE_NAME}"
    echo "  查看日志: journalctl -u ${SERVICE_NAME} -f"
    echo ""
    echo "配置文件: ${INSTALL_DIR}/config.env"
    echo "数据目录: ${INSTALL_DIR}/data"
    echo "日志目录: ${INSTALL_DIR}/logs"
    echo ""
    echo "文档地址: https://msm9527.github.io/msm-wiki/zh/"
    echo "=========================================="
}

# 主函数
main() {
    echo ""
    echo "=========================================="
    echo "  MSM 一键安装脚本"
    echo "  Mosdns Singbox Mihomo Manager"
    echo "=========================================="
    echo ""

    # 检查 root 权限
    check_root

    # 检测系统架构
    local arch=$(detect_arch)
    print_info "系统架构: $arch"

    # 安装依赖
    install_dependencies

    # 获取最新版本
    local version=$(get_latest_version)
    print_success "最新版本: $version"

    # 下载 MSM
    local temp_dir=$(download_msm $version $arch)

    # 安装 MSM
    install_msm $temp_dir

    # 创建配置文件
    create_config

    # 创建 systemd 服务
    create_systemd_service

    # 配置防火墙
    configure_firewall

    # 启动服务
    start_service

    # 显示安装信息
    show_info
}

# 运行主函数
main
