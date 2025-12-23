# Troubleshooting

## Service status

```bash
sudo systemctl status msm
```

## Logs

```bash
sudo journalctl -u msm -n 100 --no-pager
```

## Port conflict

```bash
sudo ss -tlnp | grep 7777
```
