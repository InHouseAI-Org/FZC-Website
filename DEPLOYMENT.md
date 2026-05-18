# AWS EC2 + Cloudflare Deployment Guide

Complete guide to deploy Inmarco website on AWS EC2 with Cloudflare CDN.

## Architecture Overview
```
User → Cloudflare (Free CDN) → AWS EC2 (Next.js) → Internet
```

**Benefits:**
- Cloudflare Free: Unlimited bandwidth, DDoS protection
- AWS EC2: Full control, Puppeteer support for PDFs
- Total cost: ~$42/month for 100k visitors

---

## Part 1: AWS EC2 Setup

### Step 1: Launch EC2 Instance

**Instance Configuration:**
- **Instance Type:** t3.medium (2 vCPU, 4GB RAM)
- **AMI:** Ubuntu 22.04 LTS
- **Storage:** 30GB GP3
- **Security Group:** Configure below

**Security Group Rules:**
```
Type        Protocol    Port    Source          Description
SSH         TCP         22      Your IP         SSH access
HTTP        TCP         80      0.0.0.0/0       HTTP traffic
HTTPS       TCP         443     0.0.0.0/0       HTTPS traffic
Custom TCP  TCP         4001    0.0.0.0/0       Next.js (testing only)
```

### Step 2: Connect and Install Dependencies

```bash
# SSH into your instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install -y nginx

# Install Git
sudo apt install -y git

# Verify installations
node -v    # Should show v20.x
npm -v     # Should show 10.x
pm2 -v     # Should show 5.x
nginx -v   # Should show 1.18+
```

### Step 3: Clone and Build Project

```bash
# Create app directory
sudo mkdir -p /var/www/inmarco
sudo chown ubuntu:ubuntu /var/www/inmarco

# Clone repository
cd /var/www/inmarco
git clone YOUR_REPO_URL .

# Install dependencies (this may take 5-10 minutes)
npm install

# Create production environment file
nano .env.local
```

**Add these variables to .env.local:**
```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

```bash
# Build the project
npm run build

# Test the build
NODE_ENV=production pm2 start npm --name "inmarco-web" -- start

# Check application status
pm2 status
pm2 logs inmarco-web --lines 50

# If working, save PM2 configuration
pm2 save

# Configure PM2 to start on system boot
pm2 startup
# Copy and run the command it outputs (starts with 'sudo')
```

### Step 4: Configure Nginx Reverse Proxy

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/inmarco
```

**Paste this configuration:**
```nginx
# HTTP - Redirect to HTTPS
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Allow Let's Encrypt ACME challenge
    location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;
    }

    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Configuration
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL certificates (will be updated by Certbot)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-CHACHA20-POLY1305;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Client upload size
    client_max_body_size 50M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/x-javascript
        application/xml+rss
        application/javascript
        application/json
        image/svg+xml;

    # Proxy to Next.js application
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

        # Timeouts for Puppeteer PDF generation
        proxy_connect_timeout 90s;
        proxy_send_timeout 90s;
        proxy_read_timeout 90s;
    }

    # Cache static files aggressively
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot|webp|webm)$ {
        proxy_pass http://localhost:4001;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
        access_log off;
    }

    # Next.js static files (never change)
    location /_next/static {
        proxy_pass http://localhost:4001;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Next.js optimized images
    location /_next/image {
        proxy_pass http://localhost:4001;
        expires 1h;
        add_header Cache-Control "public, max-age=3600";
    }

    # PDF datasheet endpoint (no caching, long timeout)
    location /api/datasheet-pdf {
        proxy_pass http://localhost:4001;
        proxy_read_timeout 120s;
        add_header Cache-Control "public, max-age=3600";
    }
}
```

**Enable the site:**
```bash
# Create temporary self-signed certificate (for initial testing)
sudo mkdir -p /etc/letsencrypt/live/your-domain.com
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/letsencrypt/live/your-domain.com/privkey.pem \
  -out /etc/letsencrypt/live/your-domain.com/fullchain.pem \
  -subj "/CN=your-domain.com"

# Enable site
sudo ln -s /etc/nginx/sites-available/inmarco /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# If test passes, restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### Step 5: Install SSL Certificate (Let's Encrypt)

**Do this AFTER Cloudflare DNS is pointing to your EC2 IP!**

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Stop Nginx temporarily
sudo systemctl stop nginx

# Get certificate
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# Start Nginx
sudo systemctl start nginx

# Auto-renewal test
sudo certbot renew --dry-run

# Certbot will auto-renew certificates via cron job
```

---

## Part 2: Cloudflare Setup

### Step 1: Add Domain to Cloudflare

1. Go to **https://dash.cloudflare.com**
2. Click **"Add a Site"**
3. Enter your domain: `inmarco.com` (or `your-domain.com`)
4. Select **Free Plan** ($0/month)
5. Click **"Continue"**
6. Cloudflare will scan your existing DNS records
7. Review and click **"Continue"**

### Step 2: Update Nameservers at Registrar

Cloudflare will display 2 nameservers like:
```
lara.ns.cloudflare.com
tim.ns.cloudflare.com
```

**Update at your domain registrar:**
- **GoDaddy:** Domain Settings → Nameservers → Change → Custom
- **Namecheap:** Domain List → Manage → Nameservers → Custom DNS
- **Google Domains:** DNS → Name servers → Custom name servers

**Enter Cloudflare's nameservers** and save.

⏱️ **Propagation time:** 2-24 hours (usually <2 hours)

### Step 3: Configure DNS Records

In Cloudflare dashboard, go to **DNS** → **Records**:

| Type | Name | Content | Proxy Status | TTL |
|------|------|---------|--------------|-----|
| A | @ | YOUR_EC2_PUBLIC_IP | ✅ Proxied | Auto |
| A | www | YOUR_EC2_PUBLIC_IP | ✅ Proxied | Auto |

**Critical:** Keep "Proxy Status" as **Proxied** (orange cloud icon) to enable CDN!

### Step 4: SSL/TLS Configuration

Go to **SSL/TLS** → **Overview**:
- Encryption mode: **Full (strict)**

Go to **SSL/TLS** → **Edge Certificates**:
- ✅ Always Use HTTPS: **ON**
- ✅ Minimum TLS Version: **TLS 1.2**
- ✅ Automatic HTTPS Rewrites: **ON**
- ✅ HTTP Strict Transport Security (HSTS): **Enable** (after testing)

### Step 5: Speed Optimization

Go to **Speed** → **Optimization**:
- ✅ Auto Minify: Enable **JavaScript**, **CSS**, **HTML**
- ✅ Brotli: **ON**
- ✅ Early Hints: **ON**
- ✅ Rocket Loader: **OFF** (breaks Next.js)

### Step 6: Caching Configuration

Go to **Caching** → **Configuration**:
- Caching Level: **Standard**
- Browser Cache TTL: **Respect Existing Headers**

### Step 7: Page Rules (CRITICAL for Performance)

Go to **Rules** → **Page Rules** → **Create Page Rule**

**Rule 1: Cache Next.js Images**
```
URL Pattern: *inmarco.com/_next/image/*
Settings:
  Cache Level: Cache Everything
  Edge Cache TTL: 1 month
  Browser Cache TTL: 1 month
```

**Rule 2: Cache Product Images**
```
URL Pattern: *inmarco.com/FZC%20Inmarco%20Product%20Shoot/*
Settings:
  Cache Level: Cache Everything
  Edge Cache TTL: 1 month
  Browser Cache TTL: 1 week
```

**Rule 3: Cache Static Assets**
```
URL Pattern: *inmarco.com/_next/static/*
Settings:
  Cache Level: Cache Everything
  Edge Cache TTL: 1 year
  Browser Cache TTL: 1 year
```

### Step 8: Network Configuration

Go to **Network**:
- ✅ HTTP/3 (with QUIC): **ON**
- ✅ 0-RTT Connection Resumption: **ON**
- ✅ WebSockets: **ON**
- IPv6 Compatibility: **ON**

### Step 9: Security (Optional but Recommended)

Go to **Security** → **Settings**:
- Security Level: **Medium**
- Challenge Passage: **30 minutes**
- Browser Integrity Check: **ON**

---

## Part 3: Deployment Workflow

### Initial Deployment

```bash
# On local machine
git add -A
git commit -m "Production deployment"
git push origin main

# On EC2
cd /var/www/inmarco
git pull origin main
npm install
npm run build
pm2 restart inmarco-web
pm2 save
```

### Update Application (After Code Changes)

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

cd /var/www/inmarco
git pull origin main
npm install          # Only if package.json changed
npm run build
pm2 restart inmarco-web

# View logs
pm2 logs inmarco-web --lines 100
```

### Purge Cloudflare Cache (After Deployment)

1. Go to Cloudflare Dashboard
2. **Caching** → **Configuration**
3. Click **"Purge Everything"**
4. Confirm

Or use API:
```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/purge_cache" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

---

## Part 4: Monitoring & Maintenance

### Check Application Status

```bash
# PM2 status
pm2 status
pm2 logs inmarco-web
pm2 monit  # Real-time monitoring

# Nginx status
sudo systemctl status nginx
sudo nginx -t  # Test configuration

# View logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
pm2 logs inmarco-web --lines 200
```

### Restart Services

```bash
# Restart application
pm2 restart inmarco-web

# Restart Nginx
sudo systemctl restart nginx

# Restart both
pm2 restart all && sudo systemctl restart nginx
```

### Check Port Usage

```bash
# Check if port 4001 is in use
sudo netstat -tlnp | grep 4001

# Check all Node processes
ps aux | grep node
```

### SSL Certificate Renewal

```bash
# Check certificate expiry
sudo certbot certificates

# Manual renewal (usually automatic via cron)
sudo certbot renew

# Force renewal
sudo certbot renew --force-renewal
sudo systemctl restart nginx
```

---

## Part 5: Performance Optimization

### Expected Performance Metrics

With Cloudflare + Lazy Loading:
- **First Load (uncached):** ~800KB
- **First Load (cached):** ~200KB
- **Time to Interactive:** 2-3 seconds
- **Lighthouse Score:** 90+ Performance
- **Cloudflare Cache Hit Rate:** 90%+
- **Origin Bandwidth:** <10% of total traffic
- **Global Latency:** <100ms (via Cloudflare edge)

### Monitor Cloudflare Analytics

Go to **Analytics & Logs** → **Traffic**:
- Requests per second
- Bandwidth usage
- Cache hit rate (should be >85%)
- Top countries
- Status codes

### AWS CloudWatch (Optional)

```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb

# Configure monitoring for:
# - CPU usage
# - Memory usage
# - Disk usage
# - Network I/O
```

---

## Part 6: Cost Breakdown

### AWS Monthly Costs (Est. 100k visitors/month)

| Service | Specification | Monthly Cost |
|---------|--------------|--------------|
| EC2 t3.medium | 2 vCPU, 4GB RAM | $30.40 |
| EBS Storage | 30GB GP3 | $2.40 |
| Data Transfer | 100GB out | $9.00 |
| Elastic IP | 1 IP (attached) | $0.00 |
| **TOTAL** | | **~$42/month** |

### Cloudflare Costs

| Service | Specification | Monthly Cost |
|---------|--------------|--------------|
| Free Plan | Unlimited bandwidth | $0.00 |
| DDoS Protection | Included | $0.00 |
| SSL Certificates | Included | $0.00 |
| **TOTAL** | | **$0.00** |

### Grand Total: **$42/month**

### Cost at Scale

- **100k visitors:** ~$42/month
- **500k visitors:** ~$55/month (more bandwidth)
- **1M visitors:** ~$75/month

**Note:** With Cloudflare caching, you only pay for origin traffic (5-10% of total).

---

## Part 7: Troubleshooting

### Site Not Loading

```bash
# Check PM2
pm2 status
pm2 logs inmarco-web --err

# Check if app is listening
curl http://localhost:4001

# Check Nginx
sudo nginx -t
sudo systemctl status nginx
curl http://localhost

# Check firewall
sudo ufw status
```

### 502 Bad Gateway

```bash
# Next.js app is not running
pm2 restart inmarco-web

# Check port 4001
sudo netstat -tlnp | grep 4001

# Check logs
pm2 logs inmarco-web
```

### Cloudflare Not Caching

1. Check DNS is "Proxied" (orange cloud)
2. Verify Page Rules are active and have priority order
3. Check SSL/TLS is "Full (strict)"
4. Clear browser cache
5. Purge Cloudflare cache
6. Check response headers: `curl -I https://your-domain.com`

### SSL Certificate Error

```bash
# Check certificate status
sudo certbot certificates

# Renew manually
sudo systemctl stop nginx
sudo certbot renew --standalone
sudo systemctl start nginx

# Check Cloudflare SSL mode (should be Full strict)
```

### High Memory Usage

```bash
# Check memory
free -h
pm2 monit

# If memory is full, increase swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### PDF Generation Timeout

If datasheet PDFs timeout:

1. Increase Nginx timeout in `/etc/nginx/sites-available/inmarco`:
   ```nginx
   location /api/datasheet-pdf {
       proxy_read_timeout 180s;  # Increase from 120s
   }
   ```

2. Restart Nginx:
   ```bash
   sudo systemctl restart nginx
   ```

---

## Part 8: Security Checklist

- [x] SSH key authentication (no password login)
- [x] Firewall configured (only ports 22, 80, 443 open)
- [x] SSL certificate installed (Let's Encrypt)
- [x] Cloudflare DDoS protection enabled
- [x] Security headers in Nginx config
- [x] Non-root user running application
- [ ] Regular security updates: `sudo apt update && sudo apt upgrade`
- [ ] Cloudflare WAF (Web Application Firewall) - Consider Pro plan
- [ ] Automated backups of `/var/www/inmarco`
- [ ] Rate limiting on API endpoints

---

## Part 9: Backup Strategy

### Create Backup Script

```bash
# Create backup script
nano ~/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p $BACKUP_DIR

# Backup application
tar -czf $BACKUP_DIR/inmarco_$TIMESTAMP.tar.gz /var/www/inmarco

# Keep only last 7 backups
find $BACKUP_DIR -name "inmarco_*.tar.gz" -mtime +7 -delete

echo "Backup completed: inmarco_$TIMESTAMP.tar.gz"
```

```bash
# Make executable
chmod +x ~/backup.sh

# Add to cron (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /home/ubuntu/backup.sh
```

---

## Part 10: Advanced: Docker Deployment

If using Docker (see Dockerfile in repository):

```bash
# Build image
docker build -t inmarco-web .

# Run container
docker run -d \
  --name inmarco \
  --restart unless-stopped \
  -p 4001:3000 \
  -e NODE_ENV=production \
  inmarco-web

# Or use docker-compose
docker-compose up -d
```

---

## Quick Reference Commands

```bash
# Application
pm2 status
pm2 logs inmarco-web
pm2 restart inmarco-web
pm2 monit

# Nginx
sudo nginx -t
sudo systemctl restart nginx
sudo tail -f /var/log/nginx/error.log

# SSL
sudo certbot certificates
sudo certbot renew

# System
free -h                    # Memory usage
df -h                      # Disk usage
htop                       # Process monitor
sudo netstat -tlnp         # Port usage
```

---

## Support Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Cloudflare Docs:** https://developers.cloudflare.com
- **PM2 Docs:** https://pm2.keymetrics.io/docs
- **Nginx Docs:** https://nginx.org/en/docs/
- **Let's Encrypt:** https://letsencrypt.org/docs/

---

## Deployment Complete! 🚀

Your Inmarco website is now deployed with:
- ✅ AWS EC2 hosting
- ✅ Cloudflare CDN (unlimited bandwidth)
- ✅ SSL/HTTPS encryption
- ✅ Video lazy loading
- ✅ PDF generation support (Puppeteer)
- ✅ Auto-restart on crashes (PM2)
- ✅ ~$42/month total cost

**Next Steps:**
1. Test all pages and functionality
2. Monitor performance in Cloudflare Analytics
3. Set up CloudWatch alarms (optional)
4. Configure automated backups
5. Share URL with team! 🎉
