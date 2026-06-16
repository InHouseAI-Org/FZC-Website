# Docker Deployment - Quick Start Guide

## 🚀 Deploy in 3 Steps

### Step 1: Build and Push (On Your Local Machine)

```bash
# Run the automated build script
./docker-build-push.sh
```

This will:
- ✅ Build the Docker image
- ✅ Tag it with your Docker Hub username
- ✅ Push to Docker Hub

**Time:** ~10-20 minutes (depending on internet speed)

---

### Step 2: Server Setup (On Ubuntu Server - First Time Only)

```bash
# Copy and run the server setup script
wget https://raw.githubusercontent.com/YOUR_REPO/main/server-setup.sh
chmod +x server-setup.sh
./server-setup.sh
```

Or manually:
1. SSH into your server
2. Copy `server-setup.sh` to your server
3. Run: `chmod +x server-setup.sh && ./server-setup.sh`

This will:
- ✅ Install Docker and Docker Compose
- ✅ Create deployment directory
- ✅ Generate configuration files
- ✅ Setup firewall (optional)

**Time:** ~5-10 minutes

---

### Step 3: Deploy (On Ubuntu Server)

```bash
# Edit environment variables
cd ~/inmarco-website
nano .env

# Update these values:
# - POSTGRES_PASSWORD
# - ADMIN_PASSWORD  
# - JWT_SECRET
# - Email credentials (AZURE_*)

# Deploy the application
./deploy.sh
```

**Time:** ~5 minutes

---

## ✅ Verify Deployment

```bash
# Check status
docker-compose ps

# View logs
docker-compose logs -f app

# Test the application
curl http://localhost:3000

# Or visit in browser
http://your-server-ip:3000
```

---

## 🔄 Update Application

When you make changes and want to deploy updates:

### On Local Machine:
```bash
./docker-build-push.sh
```

### On Server:
```bash
cd ~/inmarco-website
./deploy.sh
```

---

## 📋 Common Commands

### View Logs
```bash
docker-compose logs -f app          # Application logs
docker-compose logs -f postgres     # Database logs
docker-compose logs -f              # All logs
```

### Restart Services
```bash
docker-compose restart              # Restart all
docker-compose restart app          # Restart app only
```

### Stop Services
```bash
docker-compose stop                 # Stop all
docker-compose down                 # Stop and remove containers
```

### Database Backup
```bash
# Backup
docker-compose exec postgres pg_dump -U inmarco inmarco_website > backup.sql

# Restore
docker-compose exec -T postgres psql -U inmarco inmarco_website < backup.sql
```

---

## 🔒 Production Checklist

- [ ] Change all default passwords in `.env`
- [ ] Generate strong JWT secret (32+ characters)
- [ ] Configure email settings (Azure credentials)
- [ ] Setup domain name and DNS
- [ ] Install SSL certificate (Let's Encrypt)
- [ ] Configure Nginx reverse proxy
- [ ] Enable firewall (UFW)
- [ ] Setup automated backups
- [ ] Configure monitoring

---

## 📚 Full Documentation

For detailed instructions, troubleshooting, and production setup:
- **Full Guide:** `DOCKER_DEPLOYMENT.md`
- **Configuration:** Edit `.env` file
- **Logs:** `docker-compose logs`

---

## 🆘 Quick Troubleshooting

### App won't start
```bash
docker-compose logs app
docker-compose restart app
```

### Database connection error
```bash
# Check if postgres is running
docker-compose ps postgres

# Verify DATABASE_URL in .env
nano .env
```

### Port already in use
```bash
# Check what's using port 3000
sudo lsof -i :3000

# Change port in docker-compose.yml
# ports: - "4000:3000"  # Maps server port 4000 to container port 3000
```

### PDF generation not working
```bash
# Restart app to ensure Chromium is loaded
docker-compose restart app
```

---

## 🌐 Access Points

After deployment:
- **Application:** http://your-server-ip:3000
- **Admin Panel:** http://your-server-ip:3000/admin
- **Health Check:** http://your-server-ip:3000/api/health

With Nginx + SSL:
- **Application:** https://your-domain.com
- **Admin Panel:** https://your-domain.com/admin

---

## 💡 Tips

1. **First deployment takes longer** (~10-15 min) as it downloads images
2. **Subsequent updates are faster** (~2-3 min)
3. **Always backup database** before major updates
4. **Check logs** if something doesn't work: `docker-compose logs -f`
5. **Use `docker-compose pull`** to get latest images

---

**Need Help?** See `DOCKER_DEPLOYMENT.md` for detailed troubleshooting.
