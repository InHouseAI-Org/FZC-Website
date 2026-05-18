# Docker Deployment Guide

This guide covers deploying the Inmarco website using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum
- 30GB disk space

---

## Quick Start (Local Testing)

```bash
# Build and run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f

# Access application
http://localhost:4001
```

---

## Docker Architecture

### Multi-Stage Build

The Dockerfile uses a 3-stage build process:

1. **Dependencies Stage**: Installs Node.js dependencies
2. **Builder Stage**: Builds Next.js application
3. **Runner Stage**: Creates minimal production image with Chromium for PDF generation

### Key Features

- ✅ Alpine Linux base (minimal size)
- ✅ Chromium installed for Puppeteer PDF generation
- ✅ Non-root user (security)
- ✅ Next.js standalone output
- ✅ Production-optimized
- ✅ Health checks configured

---

## Local Development with Docker

### Build Image

```bash
docker build -t inmarco-web:latest .
```

### Run Container

```bash
docker run -d \
  --name inmarco-web \
  --restart unless-stopped \
  -p 4001:3000 \
  -e NODE_ENV=production \
  -v $(pwd)/public:/app/public:ro \
  inmarco-web:latest
```

### Using Docker Compose (Recommended)

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f web

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

### Check Container Status

```bash
# View running containers
docker ps

# View logs
docker logs inmarco-web -f

# Execute commands inside container
docker exec -it inmarco-web sh

# Check health
docker inspect --format='{{json .State.Health}}' inmarco-web
```

---

## AWS EC2 Deployment with Docker

### Step 1: Install Docker on EC2

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installations
docker --version
docker-compose --version

# Log out and back in for group changes
exit
```

### Step 2: Deploy Application

```bash
# SSH back into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Create app directory
mkdir -p ~/inmarco && cd ~/inmarco

# Clone repository
git clone YOUR_REPO_URL .

# Create .env file
nano .env.local
```

Add environment variables:
```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

```bash
# Build and start with docker-compose
docker-compose up -d --build

# Check status
docker-compose ps
docker-compose logs -f
```

### Step 3: Configure Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/inmarco
```

Add this configuration:
```nginx
# HTTP - Redirect to HTTPS
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    client_max_body_size 50M;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

    # Proxy to Docker container
    location / {
        proxy_pass http://localhost:4001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts for PDF generation
        proxy_connect_timeout 90s;
        proxy_send_timeout 90s;
        proxy_read_timeout 90s;
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot|webp|webm)$ {
        proxy_pass http://localhost:4001;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
    }

    # Next.js specific
    location /_next/static {
        proxy_pass http://localhost:4001;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /_next/image {
        proxy_pass http://localhost:4001;
        expires 1h;
        add_header Cache-Control "public, max-age=3600";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/inmarco /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test and restart
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### Step 4: Auto-Start on Boot

Docker Compose containers with `restart: unless-stopped` will automatically restart on system reboot.

Verify:
```bash
# Check restart policy
docker inspect inmarco-web | grep -A 3 RestartPolicy

# Test reboot
sudo reboot

# After reboot, check container
docker ps
```

---

## Production Deployment Workflow

### Update Application

```bash
# On EC2
cd ~/inmarco

# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Check logs
docker-compose logs -f
```

### Zero-Downtime Deployment (Advanced)

```bash
# Build new image
docker-compose build

# Start new container with different name
docker run -d \
  --name inmarco-web-new \
  -p 4002:3000 \
  -e NODE_ENV=production \
  inmarco-web:latest

# Test new container
curl http://localhost:4002

# Update Nginx to point to new port
sudo nano /etc/nginx/sites-available/inmarco
# Change proxy_pass to http://localhost:4002

sudo nginx -t
sudo systemctl reload nginx

# Stop old container
docker stop inmarco-web
docker rm inmarco-web

# Rename new container
docker rename inmarco-web-new inmarco-web
```

---

## Docker Commands Reference

### Container Management

```bash
# Start container
docker-compose up -d

# Stop container
docker-compose down

# Restart container
docker-compose restart

# View logs
docker-compose logs -f web

# Execute shell inside container
docker exec -it inmarco-web sh

# View container stats
docker stats inmarco-web
```

### Image Management

```bash
# Build image
docker build -t inmarco-web:latest .

# List images
docker images

# Remove image
docker rmi inmarco-web:latest

# Remove unused images
docker image prune -a
```

### Cleanup

```bash
# Stop and remove all containers
docker-compose down

# Remove all stopped containers
docker container prune

# Remove all unused images
docker image prune -a

# Remove all unused volumes
docker volume prune

# Complete cleanup (WARNING: removes everything)
docker system prune -a --volumes
```

---

## Monitoring

### View Logs

```bash
# Real-time logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific service logs
docker-compose logs -f web
```

### Resource Usage

```bash
# Container stats
docker stats inmarco-web

# Detailed inspect
docker inspect inmarco-web

# Health check status
docker inspect --format='{{json .State.Health}}' inmarco-web | jq
```

---

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs web

# Check if port is in use
sudo netstat -tlnp | grep 4001

# Rebuild from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### PDF Generation Fails

```bash
# Check Chromium installation
docker exec -it inmarco-web sh
chromium-browser --version

# Check Puppeteer config
docker exec -it inmarco-web env | grep PUPPETEER
```

### Out of Memory

```bash
# Check container memory limit
docker stats inmarco-web

# Increase Docker memory (Docker Desktop)
# Settings → Resources → Memory → Increase to 4GB+

# On Linux, add to docker-compose.yml:
services:
  web:
    mem_limit: 2g
    mem_reservation: 1g
```

### High Disk Usage

```bash
# Check disk usage
docker system df

# Clean up
docker system prune -a --volumes
```

---

## Performance Optimization

### Multi-Stage Build Benefits

- **Development image size:** ~2GB
- **Production image size:** ~350MB (87% reduction)
- Includes only runtime dependencies
- No source code in final image

### Resource Limits

Add to `docker-compose.yml`:

```yaml
services:
  web:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2G
        reservations:
          cpus: '1.0'
          memory: 1G
```

---

## Security Best Practices

- ✅ Non-root user (nextjs:nodejs)
- ✅ Read-only file system where possible
- ✅ No secrets in Dockerfile (use .env)
- ✅ Minimal Alpine base image
- ✅ Multi-stage build (no dev dependencies)
- ✅ Health checks enabled
- ✅ Regular image updates

### Scan for Vulnerabilities

```bash
# Install Trivy
docker run aquasec/trivy image inmarco-web:latest

# Or use Docker Scout
docker scout cves inmarco-web:latest
```

---

## CI/CD Integration

### GitHub Actions Example

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to EC2

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd ~/inmarco
            git pull origin main
            docker-compose down
            docker-compose up -d --build
```

---

## Cost Comparison

### Docker vs PM2

| Aspect | Docker | PM2 |
|--------|--------|-----|
| Memory Usage | ~400MB | ~300MB |
| CPU Overhead | ~2-5% | ~1% |
| Deployment | Easier | Manual |
| Rollback | Fast | Manual |
| Isolation | Better | None |
| **Recommended For** | Production | Small scale |

---

## FAQ

**Q: Should I use Docker or PM2?**
A: Docker for production (easier deployment, better isolation). PM2 for quick/small deployments.

**Q: Why is the image so large?**
A: Chromium adds ~150MB for PDF generation. Without it, image is ~200MB.

**Q: Can I run without Chromium?**
A: Yes, but PDF downloads won't work. Remove Chromium from Dockerfile if not needed.

**Q: How do I backup Docker data?**
A: Volumes are in `/var/lib/docker/volumes/`. Backup with `docker run --rm -v inmarco_data:/data -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz /data`

---

## Summary

Docker deployment provides:
- ✅ Consistent environment (dev = prod)
- ✅ Easy rollback (tag images)
- ✅ Better isolation
- ✅ Simplified deployment workflow
- ✅ Horizontal scaling ready

For Cloudflare + CDN setup, see **DEPLOYMENT.md**.

---

**Need help?** Check logs with `docker-compose logs -f` or open an issue.
