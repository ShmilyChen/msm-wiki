# HTTPS

With Certbot + Nginx:

```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d msm.example.com
```

Enable auto-renew:

```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```
