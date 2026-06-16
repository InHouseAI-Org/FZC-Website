# Complete AWS Deployment Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  Users  →  CloudFront CDN  →  ALB  →  EC2/ECS (Next.js)     │
│                    ↓                                          │
│              S3 Bucket (Static Assets)                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Components:
1. **S3 + CloudFront**: Static assets (images, videos, PDFs) - 706MB
2. **EC2/ECS/Lightsail**: Next.js application
3. **RDS PostgreSQL**: Database (or use existing server)
4. **ALB** (optional): Load balancer for HTTPS/SSL

---

## Option 1: AWS Lightsail (Easiest - Recommended for Start)

**Best for:** Simple setup, predictable pricing, small-medium traffic

### Pricing:
- **$10/month**: 1GB RAM, 1 vCPU, 2TB transfer
- **$20/month**: 2GB RAM, 1 vCPU, 3TB transfer
- **$40/month**: 4GB RAM, 2 vCPU, 4TB transfer

### Setup Steps:

```bash
# 1. Create Lightsail instance
# - Go to: https://lightsail.aws.amazon.com
# - Choose: Linux/Unix
# - Blueprint: OS Only → Ubuntu 22.04
# - Plan: $20/month (2GB RAM recommended)

# 2. SSH into instance
ssh ubuntu@<lightsail-ip>

# 3. Install Docker
sudo apt update
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker ubuntu

# 4. Create docker-compose.yml
cat > docker-compose.yml <<'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_DB: inmarco
      POSTGRES_USER: inmarco_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  nextjs:
    image: manav27/inmarco-website:latest
    restart: always
    ports:
      - "80:3000"
    environment:
      - DATABASE_URL=postgresql://inmarco_user:${POSTGRES_PASSWORD}@postgres:5432/inmarco
      - NEXT_PUBLIC_S3_BASE_URL=https://d1234567890.cloudfront.net
      - NODE_ENV=production
    depends_on:
      - postgres

volumes:
  postgres-data:
EOF

# 5. Create .env file
cat > .env <<'EOF'
POSTGRES_PASSWORD=your_secure_password_here
EOF

# 6. Pull and start services
docker-compose pull
docker-compose up -d

# 7. Initialize database
docker-compose exec nextjs npx prisma db push
docker-compose exec nextjs npx prisma db seed

# 8. Configure firewall
# In Lightsail console → Networking → Add rule:
# - HTTP (port 80)
# - HTTPS (port 443)
```

### Enable HTTPS (SSL):
```bash
# Install Certbot
sudo apt install -y certbot

# Get SSL certificate
sudo certbot certonly --standalone -d yourdomain.com

# Update docker-compose.yml to use ports 443
```

---

## Option 2: AWS EC2 (More Control)

**Best for:** Custom configurations, scalability, production workloads

### Pricing:
- **t3.small**: $15/month (2GB RAM, 2 vCPU) - Minimum recommended
- **t3.medium**: $30/month (4GB RAM, 2 vCPU) - Recommended
- **t3.large**: $60/month (8GB RAM, 2 vCPU) - High traffic

### Setup Steps:

```bash
# 1. Launch EC2 Instance
# - AMI: Ubuntu 22.04 LTS
# - Instance type: t3.medium
# - Storage: 30GB gp3
# - Security group:
#   - SSH (22) - Your IP
#   - HTTP (80) - 0.0.0.0/0
#   - HTTPS (443) - 0.0.0.0/0

# 2. SSH into instance
ssh -i your-key.pem ubuntu@<ec2-ip>

# 3-7. Same as Lightsail steps 3-7 above

# 8. Set up Application Load Balancer (ALB) for HTTPS
# - Create Target Group → Point to EC2 instance port 3000
# - Create ALB → Add HTTPS listener with ACM certificate
# - Update Security Groups
```

---

## Option 3: AWS ECS Fargate (Serverless Containers)

**Best for:** Auto-scaling, no server management, modern architecture

### Pricing:
- **0.25 vCPU, 0.5GB RAM**: ~$13/month
- **0.5 vCPU, 1GB RAM**: ~$25/month
- **1 vCPU, 2GB RAM**: ~$50/month

### Setup Steps:

1. **Create ECS Cluster**
   ```bash
   # Via AWS Console or CLI
   aws ecs create-cluster --cluster-name inmarco-cluster
   ```

2. **Create Task Definition**
   ```json
   {
     "family": "inmarco-website",
     "networkMode": "awsvpc",
     "requiresCompatibilities": ["FARGATE"],
     "cpu": "512",
     "memory": "1024",
     "containerDefinitions": [
       {
         "name": "nextjs",
         "image": "manav27/inmarco-website:latest",
         "portMappings": [
           {
             "containerPort": 3000,
             "protocol": "tcp"
           }
         ],
         "environment": [
           {
             "name": "DATABASE_URL",
             "value": "postgresql://..."
           },
           {
             "name": "NEXT_PUBLIC_S3_BASE_URL",
             "value": "https://d1234567890.cloudfront.net"
           }
         ]
       }
     ]
   }
   ```

3. **Create Service with ALB**

---

## S3 + CloudFront Setup (Required for All Options)

### 1. Create S3 Bucket
```bash
# Already covered in S3_SETUP.md
aws s3 mb s3://inmarco-datasheets
```

### 2. Upload Assets
```bash
# Export PDFs first
pnpm export:datasheets

# Upload all assets (one command)
cd "/Users/manavbathija/Desktop/InHouse AI/FZC/Website/Website Pro/Website"

aws s3 sync "public/FZC Inmarco Product Shoot" s3://inmarco-datasheets/assets/products/ --acl public-read --exclude "*.DS_Store" && \
aws s3 sync public s3://inmarco-datasheets/assets/images/ --acl public-read --exclude "datasheets/*" --exclude "FZC Inmarco Product Shoot/*" --exclude "fonts/*" --exclude "*.json" --exclude "*.svg" --include "*.jpg" --include "*.jpeg" --include "*.png" --include "*.webp" && \
aws s3 sync public/datasheets/new_generated_html s3://inmarco-datasheets/datasheets/html/ --acl public-read && \
aws s3 sync public/datasheets/pdf_exports s3://inmarco-datasheets/datasheets/pdf/ --acl public-read && \
echo "✅ All assets uploaded!"
```

### 3. Create CloudFront Distribution
```bash
# Via AWS Console:
# 1. Go to CloudFront → Create Distribution
# 2. Origin domain: inmarco-datasheets.s3.us-east-1.amazonaws.com
# 3. Origin path: leave empty
# 4. Viewer protocol policy: Redirect HTTP to HTTPS
# 5. Cache policy: CachingOptimized
# 6. Create

# Note the CloudFront URL: https://d1234567890.cloudfront.net
```

### 4. Update Application Environment Variables
```bash
NEXT_PUBLIC_S3_BASE_URL=https://d1234567890.cloudfront.net
```

---

## Database Options

### Option A: Use RDS PostgreSQL (Managed)
- **Pricing**: $15-50/month (db.t3.micro to db.t3.small)
- **Benefits**: Automated backups, high availability, managed
- **Setup**: Create RDS instance, update DATABASE_URL

### Option B: Use Existing Server (13.235.106.227)
- **Pricing**: Free (already running)
- **Setup**: Update DATABASE_URL to point to existing PostgreSQL
- **Security**: Set up VPC peering or open port 5432 to AWS

### Option C: PostgreSQL in Docker (Same instance)
- **Pricing**: Included in EC2/Lightsail cost
- **Setup**: Already configured in docker-compose.yml above

---

## Recommended Architecture for Your Use Case

Based on your needs, I recommend:

### **Best Option: Lightsail ($20/month) + S3/CloudFront (~$10/month)**

**Total Cost: ~$30/month**

**Why:**
- Simple setup, managed infrastructure
- Docker already configured (reuse existing docker-compose.yml)
- Includes database (PostgreSQL in Docker)
- Fixed, predictable pricing
- 2GB RAM, 3TB transfer - perfect for your traffic
- Easy to upgrade if needed

**Architecture:**
```
Users → CloudFront (static assets) → Lightsail (Next.js + PostgreSQL)
```

### Setup Timeline:
1. **S3 + CloudFront** - 30 minutes
2. **Lightsail + Docker** - 20 minutes
3. **DNS Configuration** - 10 minutes
4. **SSL Certificate** - 10 minutes
**Total: ~70 minutes**

---

## Cost Comparison

| Service | S3/CloudFront | Compute | Database | Total/month |
|---------|---------------|---------|----------|-------------|
| **Lightsail** | $10 | $20 | Included | **$30** ✅ |
| **EC2 t3.medium** | $10 | $30 | $15 RDS | **$55** |
| **ECS Fargate** | $10 | $25 | $15 RDS | **$50** |
| **Current (13.235.106.227)** | $10 | $0 (existing) | $0 (existing) | **$10** 💰 |

**Note:** You could also keep your existing server (13.235.106.227) and just add S3/CloudFront for $10/month total!

---

## Next Steps - Choose Your Path:

**Path 1: Minimal Cost** - Keep existing server + Add S3
- Cost: $10/month (just S3/CloudFront)
- Time: 30 minutes
- Use existing Docker setup on 13.235.106.227

**Path 2: Recommended** - Lightsail + S3
- Cost: $30/month
- Time: 70 minutes
- Fresh AWS setup, easy management

**Path 3: Production Scale** - EC2/ECS + RDS + S3
- Cost: $50-60/month
- Time: 2-3 hours
- Enterprise-grade, highly scalable

Which path would you like to take?
