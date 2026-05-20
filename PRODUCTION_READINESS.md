# Production Deployment Readiness Checklist

## ✅ Completed

### Application Architecture
- ✅ **Contact Form**: Converted from Express to Next.js API route (`/api/contact`)
- ✅ **Database**: PostgreSQL with Prisma ORM
- ✅ **Authentication**: Database-backed admin auth with bcrypt
- ✅ **Analytics**: Real-time tracking stored in database
- ✅ **Email**: Microsoft Graph API integration (Next.js compatible)
- ✅ **Docker**: Multi-container setup (Next.js + PostgreSQL + Nginx)
- ✅ **SSL**: Automated Let's Encrypt configuration
- ✅ **Security**: No hardcoded passwords, environment-based configuration

---

## 🔧 Configuration Required

### 1. Azure Email Setup (REQUIRED for contact form)

**Steps:**
1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory** → **App registrations** → **New registration**
3. Name: "Inmarco Website Email Service"
4. Supported account types: "Single tenant"
5. Click **Register**

**Get Credentials:**
- **Tenant ID**: Overview page → Directory (tenant) ID
- **Client ID**: Overview page → Application (client) ID
- **Client Secret**: Certificates & secrets → New client secret → Copy value

**Grant Permissions:**
- API permissions → Add permission → Microsoft Graph → Application permissions
- Add: `Mail.Send`
- Click **Grant admin consent**

**Configure Mailbox:**
- The `AZURE_EMAIL_FROM` email (e.g., `noreply@inmarco.ae`) must be a valid mailbox
- Admin must grant permission to send mail on behalf of this mailbox

---

### 2. Environment Variables

Create `.env.production` on your server:

```bash
# ============================================
# DATABASE
# ============================================
DATABASE_URL="postgresql://inmarco:CHANGE_THIS@postgres:5432/inmarco_website?schema=public"
POSTGRES_PASSWORD="CHANGE_THIS"

# ============================================
# ADMIN AUTHENTICATION
# ============================================
ADMIN_USERNAME="Inmarco"
ADMIN_EMAIL="admin@inmarco.ae"
ADMIN_PASSWORD="CHANGE_THIS"  # Set before running seed
JWT_SECRET="$(openssl rand -base64 64 | tr -d '\n')"  # Generate with this command

# ============================================
# EMAIL (from Azure Portal)
# ============================================
AZURE_TENANT_ID="your-tenant-id-from-azure"
AZURE_CLIENT_ID="your-client-id-from-azure"
AZURE_CLIENT_SECRET="your-client-secret-from-azure"
AZURE_EMAIL_FROM="noreply@inmarco.ae"

# ============================================
# ANALYTICS (Optional but recommended)
# ============================================
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"  # Get from Google Analytics
NEXT_PUBLIC_GTM_ID="GTM-XXXXXXX"  # Optional
NEXT_PUBLIC_CLARITY_ID="xxxxxxxxxx"  # Optional

# ============================================
# APPLICATION
# ============================================
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1
```

**Generate secure passwords:**
```bash
# For POSTGRES_PASSWORD and ADMIN_PASSWORD
openssl rand -base64 32

# For JWT_SECRET
openssl rand -base64 64 | tr -d '\n'
```

---

### 3. Domain Setup

**Requirements:**
- Domain name (e.g., `inmarco.ae` or `www.inmarco.ae`)
- DNS access to create A records

**DNS Configuration:**
```
Type: A Record
Name: @ (or www)
Value: [Your AWS Elastic IP]
TTL: 300 (or default)
```

**Wait for propagation** (5-30 minutes):
```bash
# Test DNS resolution
nslookup yourdomain.com
```

---

## 🚀 Deployment Steps

### Phase 1: AWS Setup

**1. Launch EC2 Instance**
```bash
Region: me-south-1 (Middle East - Bahrain)
AMI: Ubuntu 24.04 LTS
Instance Type: t3.small or t3.medium
Storage: 30 GB gp3
```

**2. Security Group Configuration**
```
Inbound Rules:
- SSH (22): Your IP only
- HTTP (80): 0.0.0.0/0
- HTTPS (443): 0.0.0.0/0
```

**3. Allocate and Associate Elastic IP**
```bash
# In AWS Console:
EC2 → Network & Security → Elastic IPs → Allocate
Actions → Associate Elastic IP address → Select your instance
```

---

### Phase 2: Server Setup

**1. Connect to Server**
```bash
ssh -i your-key.pem ubuntu@your-elastic-ip
```

**2. Update System**
```bash
sudo apt update && sudo apt upgrade -y
```

**3. Clone Repository**
```bash
cd /home/ubuntu
git clone https://github.com/your-repo/inmarco-website.git
cd inmarco-website
```

**4. Create Production Environment File**
```bash
nano .env.production
# Paste your production environment variables
# Save: Ctrl+O, Enter, Ctrl+X
```

**5. Run Docker Setup Script**
```bash
sudo ./setup-docker.sh
```

This will:
- Install Docker & Docker Compose
- Setup directories for Nginx
- Generate self-signed SSL (temporary)
- Configure firewall

---

### Phase 3: Application Deployment

**1. Build and Start Services**
```bash
# Build Docker images
docker-compose build --no-cache

# Start all services (PostgreSQL + Next.js + Nginx)
docker-compose up -d

# Check status
docker-compose ps
```

**2. Run Database Migrations**
```bash
# Wait 10 seconds for PostgreSQL to initialize
sleep 10

# Run migrations
docker-compose exec nextjs npx prisma migrate deploy

# Seed admin user
docker-compose exec nextjs npx prisma db seed
```

**3. Setup SSL Certificate**
```bash
# Replace yourdomain.com with your actual domain
sudo ./setup-ssl.sh yourdomain.com
```

This will:
- Stop containers temporarily
- Obtain Let's Encrypt certificate
- Update Nginx config with your domain
- Setup auto-renewal cron job
- Restart containers

---

### Phase 4: Verification

**1. Test Website**
```bash
# Visit in browser
https://yourdomain.com
```

**2. Test Contact Form**
- Go to Contact page
- Fill out form
- Submit
- Check: Sender receives confirmation email
- Check: Sales/support receives notification email

**3. Test Admin Login**
```bash
# Visit
https://yourdomain.com/admin

# Login with credentials from seed output
Username: Inmarco
Password: [from .env.production ADMIN_PASSWORD]
```

**4. Check Logs**
```bash
# View all logs
docker-compose logs -f

# Just Next.js logs
docker-compose logs -f nextjs

# Just Nginx logs
docker-compose logs -f nginx

# Just PostgreSQL logs
docker-compose logs -f postgres
```

---

## 🔒 Post-Deployment Security

**1. Change Default Passwords**
```bash
# Login to admin panel
# Go to Settings → Change Password
```

**2. Setup Monitoring**
```bash
# Install monitoring tools
sudo apt install -y htop

# Monitor containers
docker stats
```

**3. Configure Automated Backups**
```bash
# Create backup script
cat > /home/ubuntu/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# Backup database
docker exec inmarco-postgres pg_dump -U inmarco inmarco_website > $BACKUP_DIR/database.sql

# Backup uploaded files (if any)
tar -czf $BACKUP_DIR/uploads.tar.gz /home/ubuntu/inmarco-website/public/uploads 2>/dev/null || true

echo "Backup completed: $BACKUP_DIR"
EOF

chmod +x /home/ubuntu/backup.sh

# Add to cron (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /home/ubuntu/backup.sh") | crontab -
```

**4. Setup Firewall Rules**
```bash
# Already configured by setup-docker.sh, but verify:
sudo ufw status

# Should show:
# 22/tcp  ALLOW
# 80/tcp  ALLOW
# 443/tcp ALLOW
```

---

## 📊 Monitoring

### Application Health
```bash
# Check container health
docker-compose ps

# View resource usage
docker stats

# Check disk space
df -h

# Check memory
free -h
```

### Database Health
```bash
# Connect to database
docker exec -it inmarco-postgres psql -U inmarco -d inmarco_website

# Check table sizes
\dt+

# Exit
\q
```

### Logs
```bash
# Application logs
docker-compose logs --tail=100 nextjs

# Nginx access logs
docker-compose logs --tail=100 nginx

# Database logs
docker-compose logs --tail=100 postgres

# Follow all logs in real-time
docker-compose logs -f
```

---

## 🔄 Updates and Maintenance

### Deploy Application Updates
```bash
cd /home/ubuntu/inmarco-website

# Pull latest code
git pull

# Rebuild and restart
docker-compose build --no-cache
docker-compose down
docker-compose up -d

# Run any new migrations
docker-compose exec nextjs npx prisma migrate deploy

# Check logs
docker-compose logs -f --tail=50
```

### Update SSL Certificate (Automatic)
```bash
# Certificates auto-renew via cron job
# Check renewal status
sudo certbot renew --dry-run
```

### Database Maintenance
```bash
# Clean up old sessions (should run automatically)
docker-compose exec nextjs npx prisma studio
# Navigate to sessions table and delete old entries

# Or via psql
docker exec -it inmarco-postgres psql -U inmarco -d inmarco_website -c "DELETE FROM sessions WHERE expires_at < NOW();"
```

---

## ⚠️ Troubleshooting

### Contact Form Not Sending Emails

**Check:**
1. Azure credentials are correct in `.env.production`
2. App has Mail.Send permission in Azure
3. `AZURE_EMAIL_FROM` is a valid mailbox
4. Check logs: `docker-compose logs nextjs | grep -i error`

**Test manually:**
```bash
# Check if API is accessible
curl -X POST https://yourdomain.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","enquiryType":"sales","message":"Test message"}'
```

### Database Connection Issues

**Check:**
```bash
# Verify PostgreSQL is running
docker-compose ps postgres

# Check connection
docker exec inmarco-postgres pg_isready -U inmarco

# View logs
docker-compose logs postgres
```

### Nginx/SSL Issues

**Check:**
```bash
# Test Nginx config
docker-compose exec nginx nginx -t

# Reload Nginx
docker-compose exec nginx nginx -s reload

# Check SSL certificate
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
```

---

## 📞 Support Contacts

- **Docker Issues**: Check `docker-compose logs`
- **Database Issues**: Check `DATABASE_SETUP.md`
- **Deployment Issues**: Check `DEPLOYMENT_GUIDE.md`
- **Email Issues**: Verify Azure Portal settings

---

## ✅ Final Checklist

Before going live:

- [ ] Azure email configured and tested
- [ ] `.env.production` created with all variables
- [ ] Domain DNS points to Elastic IP
- [ ] Docker containers running (all healthy)
- [ ] Database migrations applied
- [ ] Admin user created
- [ ] SSL certificate installed
- [ ] Contact form tested (emails received)
- [ ] Admin login tested
- [ ] Analytics tracking verified
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] Default passwords changed

---

**Estimated Deployment Time**: 2-3 hours

**Last Updated**: May 2026
