# Inmarco Website - Docker + Nginx Deployment Guide

Complete deployment guide for Ubuntu 24.04 LTS with Docker and Nginx.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Server Setup](#initial-server-setup)
3. [Quick Deployment](#quick-deployment)
4. [Manual Deployment](#manual-deployment)
5. [SSL Configuration](#ssl-configuration)
6. [Maintenance](#maintenance)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **AWS EC2 Instance:**
  - Ubuntu 24.04 LTS
  - t3.small or t3.medium
  - 20-30 GB storage
  - Elastic IP attached

- **Domain:**
  - Domain name pointed to your Elastic IP
  - DNS A records configured

- **Local Machine:**
  - Git installed
  - SSH key access to EC2

---

## Initial Server Setup

### 1. Connect to Your EC2 Instance

```bash
ssh -i your-key.pem ubuntu@your-server-ip
```

### 2. Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Clone Your Repository

```bash
cd /home/ubuntu
git clone <your-repo-url> inmarco-website
cd inmarco-website
```

---

## Quick Deployment (Recommended)

### Option A: Automated Setup

```bash
# Make scripts executable
chmod +x setup-docker.sh setup-ssl.sh deploy.sh

# Run initial setup (installs Docker, Nginx config, etc.)
sudo ./setup-docker.sh

# Build and deploy
./deploy.sh

# Setup SSL (replace with your domain)
sudo ./setup-ssl.sh yourdomain.com
```

Your site will be live at `https://yourdomain.com` 🎉

---

## Manual Deployment

### Step 1: Install Docker

```bash
# Remove old versions
sudo apt remove docker docker-engine docker.io containerd runc

# Install dependencies
sudo apt install -y ca-certificates curl gnupg lsb-release

# Add Docker GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (optional)
sudo usermod -aG docker $USER
```

### Step 2: Setup Directories

```bash
mkdir -p nginx/conf.d nginx/ssl nginx/logs
```

### Step 3: Generate Self-Signed SSL (for testing)

```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/self-signed.key \
  -out nginx/ssl/self-signed.crt \
  -subj "/C=AE/ST=Dubai/L=Dubai/O=Inmarco/OU=IT/CN=localhost"
```

### Step 4: Configure Environment

```bash
# Create production environment file
cat > .env.production << EOF
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1
EOF
```

### Step 5: Build and Run

```bash
# Build Docker image
docker compose build

# Start services
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f
```

### Step 6: Configure Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## SSL Configuration

### Option A: Let's Encrypt (Automated)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Stop containers
docker compose down

# Get certificate (replace with your domain)
sudo certbot certonly --standalone \
  -d yourdomain.com \
  -d www.yourdomain.com \
  --non-interactive \
  --agree-tos \
  --email admin@yourdomain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/

# Update nginx config (uncomment SSL lines in nginx/conf.d/default.conf)
# Change server_name to your domain

# Restart containers
docker compose up -d
```

### Option B: Use Setup Script

```bash
sudo ./setup-ssl.sh yourdomain.com
```

### Auto-Renewal

```bash
# Add cron job for auto-renewal
(crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet --post-hook 'docker compose -f /home/ubuntu/inmarco-website/docker-compose.yml restart nginx'") | crontab -
```

---

## Maintenance

### View Logs

```bash
# All services
docker compose logs -f

# Just Next.js
docker compose logs -f nextjs

# Just Nginx
docker compose logs -f nginx
```

### Restart Services

```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart nextjs
docker compose restart nginx
```

### Update Application

```bash
# Pull latest code
git pull

# Rebuild and redeploy
docker compose build
docker compose down
docker compose up -d
```

### Stop Services

```bash
docker compose down
```

### View Container Stats

```bash
docker stats
```

### Clean Up

```bash
# Remove stopped containers
docker system prune -a

# Remove unused images
docker image prune -a
```

---

## Troubleshooting

### Check Container Status

```bash
docker compose ps
```

### Check Logs for Errors

```bash
docker compose logs --tail=100
```

### Test Nginx Configuration

```bash
docker compose exec nginx nginx -t
```

### Reload Nginx Without Downtime

```bash
docker compose exec nginx nginx -s reload
```

### Connect to Container

```bash
# Next.js container
docker compose exec nextjs sh

# Nginx container
docker compose exec nginx sh
```

### Check Port Availability

```bash
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443
```

### Check Firewall Status

```bash
sudo ufw status
```

### Permission Issues

```bash
# Fix nginx log permissions
sudo chown -R $(whoami):$(whoami) nginx/logs

# Fix SSL permissions
sudo chown -R $(whoami):$(whoami) nginx/ssl
```

### DNS Issues

```bash
# Check DNS resolution
nslookup yourdomain.com

# Check SSL certificate
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
```

---

## Performance Optimization

### Enable HTTP/2

Already enabled in `nginx/conf.d/default.conf`:
```nginx
listen 443 ssl http2;
```

### Enable Gzip Compression

Already enabled in `nginx/nginx.conf`

### Static Asset Caching

Already configured in `nginx/conf.d/default.conf`:
- Static files: 60m cache
- Images: 7d cache
- Next.js static: 1 year cache

### Monitor Performance

```bash
# Check CPU/Memory usage
docker stats

# Check response times
curl -w "@curl-format.txt" -o /dev/null -s https://yourdomain.com
```

---

## Backup Strategy

### Backup Important Files

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/inmarco-app.tar.gz \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='nginx/logs/*' \
  /home/ubuntu/inmarco-website
echo "Backup completed: $BACKUP_DIR/inmarco-app.tar.gz"
EOF

chmod +x backup.sh
```

### Schedule Automated Backups

```bash
# Run backup daily at 2 AM
(crontab -l 2>/dev/null; echo "0 2 * * * /home/ubuntu/inmarco-website/backup.sh") | crontab -
```

---

## Monitoring

### Setup Basic Monitoring

```bash
# Install monitoring tools
sudo apt install -y htop iotop

# Check system resources
htop

# Monitor disk usage
df -h

# Monitor Docker containers
docker stats
```

### Health Checks

Container health checks are already configured in `docker-compose.yml`

Check health status:
```bash
docker compose ps
```

---

## Security Checklist

- [x] Firewall enabled (UFW)
- [x] SSH key authentication only
- [x] SSL/TLS configured
- [x] Non-root user in Docker container
- [x] Security headers in Nginx
- [x] Rate limiting configured
- [x] Automated SSL renewal
- [ ] Regular security updates
- [ ] Monitoring setup
- [ ] Backup strategy implemented

---

## Quick Reference Commands

```bash
# Deploy/Update
./deploy.sh

# View logs
docker compose logs -f

# Restart
docker compose restart

# Stop
docker compose down

# Start
docker compose up -d

# Rebuild
docker compose build --no-cache

# Clean up
docker system prune -a

# SSL setup
sudo ./setup-ssl.sh yourdomain.com
```

---

## Support

For issues or questions:
1. Check logs: `docker compose logs -f`
2. Check container status: `docker compose ps`
3. Check Nginx config: `docker compose exec nginx nginx -t`
4. Review this guide

---

**Last Updated:** May 2026
**Version:** 1.0
