# Docker Deployment

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
    ports:
      - "7777:7777"
    volumes:
      - /opt/msm/config:/app/config
      - /opt/msm/data:/app/data
      - /opt/msm/logs:/app/logs
```
