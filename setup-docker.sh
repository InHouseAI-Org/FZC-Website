#!/bin/bash

# Docker + Nginx Setup Script for Ubuntu 24.04 LTS
# Inmarco Industrial Website Deployment

set -e

echo "================================================"
echo "Inmarco Website - Docker + Nginx Setup"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

echo -e "${GREEN}Step 1: Updating system...${NC}"
apt update && apt upgrade -y

echo ""
echo -e "${GREEN}Step 2: Installing Docker...${NC}"

# Remove old versions
apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

# Install dependencies
apt install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker GPG key
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start Docker
systemctl start docker
systemctl enable docker

echo ""
echo -e "${GREEN}Step 3: Installing Docker Compose V2...${NC}"
# Docker Compose V2 is already installed with docker-compose-plugin

echo ""
echo -e "${GREEN}Step 4: Setting up directories...${NC}"
mkdir -p nginx/conf.d
mkdir -p nginx/ssl
mkdir -p nginx/logs

echo ""
echo -e "${GREEN}Step 5: Generating self-signed SSL certificate (for testing)...${NC}"
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginx/ssl/self-signed.key \
    -out nginx/ssl/self-signed.crt \
    -subj "/C=AE/ST=Dubai/L=Dubai/O=Inmarco/OU=IT/CN=localhost"

echo ""
echo -e "${GREEN}Step 6: Setting up firewall...${NC}"
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo ""
echo -e "${GREEN}Step 7: Creating .env file...${NC}"
if [ ! -f .env.production ]; then
    cat > .env.production << EOF
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1
# Add your production environment variables here
EOF
    echo -e "${YELLOW}Created .env.production - Please update with your values${NC}"
else
    echo -e "${YELLOW}.env.production already exists - skipping${NC}"
fi

echo ""
echo "================================================"
echo -e "${GREEN}Setup Complete!${NC}"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Update .env.production with your environment variables"
echo "2. Run: docker compose build"
echo "3. Run: docker compose up -d"
echo "4. Check status: docker compose ps"
echo "5. View logs: docker compose logs -f"
echo ""
echo "For SSL with Let's Encrypt:"
echo "1. Update nginx/conf.d/default.conf with your domain"
echo "2. Run: ./setup-ssl.sh yourdomain.com"
echo ""
echo -e "${GREEN}Access your site at: http://localhost${NC}"
echo "================================================"
