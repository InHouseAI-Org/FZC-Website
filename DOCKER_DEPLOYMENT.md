# Docker Deployment Guide - Inmarco Website

This guide provides step-by-step instructions for deploying the Inmarco website using Docker and Docker Hub on an Ubuntu server.

## Prerequisites

### On Your Local Machine:
- Docker installed ([Install Docker](https://docs.docker.com/get-docker/))
- Docker Hub account ([Sign up](https://hub.docker.com/signup))
- Access to this repository

### On Your Ubuntu Server:
- Ubuntu 20.04 or later
- Docker installed
- Docker Compose installed
- At least 4GB RAM (8GB recommended)
- 20GB free disk space

---

## Part 1: Building and Pushing to Docker Hub

### Step 1: Login to Docker Hub

```bash
docker login
```

Enter your Docker Hub username and password when prompted.

### Step 2: Build the Docker Image

```bash
# Navigate to project directory
cd /Users/manavbathija/Desktop/InHouse\ AI/FZC/Website/Website\ Pro/Website

# Build the image (replace YOUR_DOCKERHUB_USERNAME with your actual username)
docker build -t YOUR_DOCKERHUB_USERNAME/inmarco-website:latest .

# Example:
# docker build -t johndoe/inmarco-website:latest .
```

**Note:** The build process may take 5-15 minutes depending on your internet speed and CPU.

### Step 3: Tag the Image (Optional - for versioning)

```bash
# Tag with version number
docker tag YOUR_DOCKERHUB_USERNAME/inmarco-website:latest YOUR_DOCKERHUB_USERNAME/inmarco-website:v1.0.0
```

### Step 4: Push to Docker Hub

```bash
# Push latest tag
docker push YOUR_DOCKERHUB_USERNAME/inmarco-website:latest

# Push versioned tag (if you created one)
docker push YOUR_DOCKERHUB_USERNAME/inmarco-website:v1.0.0
```

**Note:** Pushing may take 5-20 minutes depending on your upload speed. The image size is approximately 1-2GB.

---

## Part 2: Deploying on Ubuntu Server

### Step 1: SSH into Your Server

```bash
ssh user@your-server-ip

# Example:
# ssh ubuntu@192.168.1.100
```

### Step 2: Install Docker (if not installed)

```bash
# Update package index
sudo apt update

# Install dependencies
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Add your user to docker group (optional - to run docker without sudo)
sudo usermod -aG docker $USER

# Logout and login again for group changes to take effect
exit
```

### Step 3: Install Docker Compose

```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### Step 4: Create Deployment Directory

```bash
# Create app directory
mkdir -p ~/inmarco-website
cd ~/inmarco-website
```

### Step 5: Create Environment File

```bash
# Create .env file
nano .env
```

Paste the following content (update with your actual values):

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================
POSTGRES_PASSWORD=your_very_secure_password_here

# Database URL (use 'postgres' as host in Docker network)
DATABASE_URL=postgresql://inmarco:your_very_secure_password_here@postgres:5432/inmarco_website?schema=public

# ============================================
# ADMIN AUTHENTICATION
# ============================================
ADMIN_USERNAME=Inmarco
ADMIN_EMAIL=admin@inmarco.ae
ADMIN_PASSWORD=your_secure_admin_password

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_min_32_chars

# ============================================
# EMAIL CONFIGURATION
# ============================================
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_EMAIL_FROM=noreply@inmarco.ae

# ============================================
# ANALYTICS
# ============================================
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx
NEXT_PUBLIC_GSC_VERIFICATION=your-verification-code

# ============================================
# APPLICATION SETTINGS
# ============================================
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1
```

Save and exit (Ctrl+X, then Y, then Enter).

### Step 6: Create Docker Compose File

```bash
# Create docker-compose.yml
nano docker-compose.yml
```

Paste the following content (replace YOUR_DOCKERHUB_USERNAME):

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: inmarco-postgres
    restart: unless-stopped
    environment:
      - POSTGRES_USER=inmarco
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=inmarco_website
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - inmarco-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U inmarco -d inmarco_website"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Next.js Application
  app:
    image: YOUR_DOCKERHUB_USERNAME/inmarco-website:latest
    container_name: inmarco-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file:
      - .env
    environment:
      - DATABASE_URL=postgresql://inmarco:${POSTGRES_PASSWORD}@postgres:5432/inmarco_website?schema=public
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - inmarco-network

networks:
  inmarco-network:
    driver: bridge

volumes:
  postgres-data:
    driver: local
```

Save and exit.

### Step 7: Pull and Start Services

```bash
# Pull the latest image from Docker Hub
docker pull YOUR_DOCKERHUB_USERNAME/inmarco-website:latest

# Start all services
docker-compose up -d

# Check status
docker-compose ps
```

### Step 8: Initialize Database

```bash
# Run Prisma migrations
docker-compose exec app npx prisma migrate deploy

# Seed database with admin user
docker-compose exec app npx prisma db seed
```

### Step 9: Verify Deployment

```bash
# Check logs
docker-compose logs -f app

# Check if app is responding
curl http://localhost:3000

# Or visit in browser: http://your-server-ip:3000
```

---

## Part 3: Production Setup (Nginx + SSL)

### Step 1: Install Nginx

```bash
sudo apt update
sudo apt install -y nginx
```

### Step 2: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/inmarco
```

Paste the following (replace `your-domain.com`):

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/inmarco /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 3: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal is set up automatically
sudo certbot renew --dry-run
```

---

## Useful Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart app
```

### Stop Services
```bash
docker-compose down
```

### Update Application
```bash
# Pull latest image
docker pull YOUR_DOCKERHUB_USERNAME/inmarco-website:latest

# Restart with new image
docker-compose up -d --force-recreate app
```

### Database Backup
```bash
# Backup database
docker-compose exec postgres pg_dump -U inmarco inmarco_website > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
docker-compose exec -T postgres psql -U inmarco inmarco_website < backup_20240101_120000.sql
```

### Clean Up
```bash
# Remove unused images
docker system prune -a

# Remove unused volumes
docker volume prune
```

---

## Troubleshooting

### Application won't start
```bash
# Check logs
docker-compose logs app

# Check if database is ready
docker-compose exec postgres pg_isready -U inmarco
```

### Database connection issues
```bash
# Verify DATABASE_URL in .env
# Ensure postgres service is healthy
docker-compose ps postgres
```

### PDF generation not working
```bash
# Check if Chromium is installed in container
docker-compose exec app which chromium

# Check Puppeteer environment
docker-compose exec app printenv | grep PUPPETEER
```

### Port already in use
```bash
# Check what's using port 3000
sudo lsof -i :3000

# Kill process using port
sudo kill -9 <PID>
```

---

## Security Recommendations

1. **Change all default passwords** in .env file
2. **Use strong JWT secret** (minimum 32 characters)
3. **Enable firewall**:
   ```bash
   sudo ufw allow 22
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```
4. **Regular updates**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
5. **Monitor logs** regularly for suspicious activity
6. **Setup automated backups** for database

---

## Support

For issues or questions:
- Check logs: `docker-compose logs -f`
- Review environment variables in `.env`
- Verify Docker and Docker Compose versions
- Check server resources: `htop` or `free -h`

---

**Last Updated:** $(date +%Y-%m-%d)
