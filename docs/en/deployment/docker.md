# Docker Deployment

> Note: Docker deployment currently supports **host network mode only** (`network_mode: host` / `--network host`). Other network modes (including `bridge` / `macvlan` / `ipvlan`, and `ports:` / `-p`) are not supported.

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

Docker Compose example (adjust image and paths):

```yaml
version: '3.8'
services:
  msm:
    image: doumao/msm:latest
    container_name: msm
    restart: unless-stopped
    network_mode: host
    volumes:
      - /opt/msm/config:/app/config
      - /opt/msm/data:/app/data
      - /opt/msm/logs:/app/logs
```
