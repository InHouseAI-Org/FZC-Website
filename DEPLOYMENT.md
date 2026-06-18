# Production Deployment Guide

## Files Included

- `docker-compose.prod.yml` - Production Docker Compose configuration
- `nginx.conf` - Nginx reverse proxy configuration with SSL
- `init-letsencrypt.sh` - SSL certificate setup script
- `.env.production.example` - Environment variables template

---

## Local Setup (Build & Push)

### 1. Build and Push to Docker Hub

```bash
# Build for Linux AMD64
docker buildx build \
  --platform linux/amd64 \
  -t manav27/inmarco-website:latest \
  --push \
  .
```

### 2. Verify Image

```bash
# Check image was pushed
docker pull manav27/inmarco-website:latest
```

---

## Server Setup

### 1. Install Docker & Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for group changes
```

### 2. Copy Files to Server

```bash
# On your local machine, create deployment package
cd "path/to/Website"

# Create deployment directory
mkdir -p deploy
cp docker-compose.prod.yml deploy/
cp nginx.conf deploy/
cp init-letsencrypt.sh deploy/
cp .env.production.example deploy/.env

# Transfer to server
scp -r deploy/* user@your-server-ip:/home/user/inmarco/
```

Or clone from git if you've pushed these files.

### 3. Configure Environment Variables

```bash
# On server
cd /home/user/inmarco

# Edit .env file
nano .env
```

Set these values:
```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://yourdomain.com"
```

### 4. Make Scripts Executable

```bash
chmod +x init-letsencrypt.sh
```

### 5. Start Application (Without SSL First)

```bash
# Start just the app to test
docker-compose -f docker-compose.prod.yml up -d app

# Check logs
docker-compose -f docker-compose.prod.yml logs -f app

# Test app is running
curl http://localhost:3000
```

### 6. Setup SSL Certificates

```bash
# Run SSL setup script
./init-letsencrypt.sh yourdomain.com your@email.com
```

This will:
- Create SSL certificates with Let's Encrypt
- Start Nginx with SSL
- Configure auto-renewal

### 7. Start All Services

```bash
# Start everything
docker-compose -f docker-compose.prod.yml up -d

# Check all services are running
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

---

## Verification

### 1. Check Services

```bash
# Check container status
docker ps

# Expected output:
# - inmarco-app (running)
# - inmarco-nginx (running)
# - inmarco-certbot (running)
```

### 2. Test Website

```bash
# HTTP should redirect to HTTPS
curl -I http://yourdomain.com

# HTTPS should work
curl -I https://yourdomain.com

# Check SSL certificate
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
```

### 3. Browser Test

Visit `https://yourdomain.com` and verify:
- ✅ SSL certificate is valid
- ✅ Website loads correctly
- ✅ No console errors

---

## Updates & Maintenance

### Deploy New Version

```bash
# 1. Build and push new image locally
docker buildx build \
  --platform linux/amd64 \
  -t manav27/inmarco-website:latest \
  --push \
  .

# 2. On server, pull and restart
cd /home/user/inmarco
docker-compose -f docker-compose.prod.yml pull app
docker-compose -f docker-compose.prod.yml up -d app

# 3. Check logs
docker-compose -f docker-compose.prod.yml logs -f app
```

### Renew SSL Certificate

Certificates auto-renew every 12 hours via certbot container.

To force renewal:
```bash
docker-compose -f docker-compose.prod.yml run --rm certbot renew
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

### View Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f app
docker-compose -f docker-compose.prod.yml logs -f nginx
docker-compose -f docker-compose.prod.yml logs -f certbot
```

### Stop Services

```bash
docker-compose -f docker-compose.prod.yml down
```

### Backup

```bash
# Backup SSL certificates
tar -czf certbot-backup-$(date +%Y%m%d).tar.gz certbot/

# Backup environment
cp .env .env.backup
```

---

## Troubleshooting

### SSL Certificate Issues

```bash
# Check certificate status
docker-compose -f docker-compose.prod.yml run --rm certbot certificates

# Force renewal
docker-compose -f docker-compose.prod.yml run --rm certbot renew --force-renewal
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

### App Not Starting

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs app

# Check environment variables
docker-compose -f docker-compose.prod.yml exec app env | grep DATABASE_URL

# Restart app
docker-compose -f docker-compose.prod.yml restart app
```

### Nginx Issues

```bash
# Test nginx configuration
docker-compose -f docker-compose.prod.yml exec nginx nginx -t

# Reload nginx
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload

# Check nginx logs
docker-compose -f docker-compose.prod.yml logs nginx
```

---

## Firewall Configuration

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp  # SSH
sudo ufw enable

# Check status
sudo ufw status
```

---

## Performance Monitoring

```bash
# Check resource usage
docker stats

# Check specific container
docker stats inmarco-app
```

---

## Summary

✅ **Build locally:** `docker buildx build --platform linux/amd64 -t manav27/inmarco-website:latest --push .`
✅ **Deploy on server:** Transfer files, configure .env, run `./init-letsencrypt.sh`
✅ **Auto SSL renewal:** Certbot renews certificates automatically
✅ **Update:** Build + push locally, pull + restart on server

Your production deployment is now complete! 🚀
