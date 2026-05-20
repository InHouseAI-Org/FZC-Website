#!/bin/bash

# SSL Setup Script using Let's Encrypt (Certbot)
# For production deployment with real domain

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

if [ -z "$1" ]; then
    echo -e "${RED}Usage: sudo ./setup-ssl.sh yourdomain.com${NC}"
    echo "Example: sudo ./setup-ssl.sh inmarco.com"
    exit 1
fi

DOMAIN=$1
EMAIL="admin@${DOMAIN}"

echo "================================================"
echo "Setting up SSL for: $DOMAIN"
echo "================================================"

# Install Certbot
echo -e "${GREEN}Installing Certbot...${NC}"
apt update
apt install -y certbot python3-certbot-nginx

# Stop containers temporarily
echo -e "${GREEN}Stopping containers...${NC}"
docker compose down

# Get certificate
echo -e "${GREEN}Obtaining SSL certificate...${NC}"
certbot certonly --standalone \
    -d $DOMAIN \
    -d www.$DOMAIN \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    --preferred-challenges http

# Copy certificates to nginx folder
echo -e "${GREEN}Copying certificates...${NC}"
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem nginx/ssl/
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem nginx/ssl/

# Update Nginx config
echo -e "${GREEN}Updating Nginx configuration...${NC}"
sed -i "s|server_name _;|server_name $DOMAIN www.$DOMAIN;|g" nginx/conf.d/default.conf
sed -i "s|# ssl_certificate /etc/nginx/ssl/fullchain.pem;|ssl_certificate /etc/nginx/ssl/fullchain.pem;|g" nginx/conf.d/default.conf
sed -i "s|# ssl_certificate_key /etc/nginx/ssl/privkey.pem;|ssl_certificate_key /etc/nginx/ssl/privkey.pem;|g" nginx/conf.d/default.conf
sed -i "s|ssl_certificate /etc/nginx/ssl/self-signed.crt;|# ssl_certificate /etc/nginx/ssl/self-signed.crt;|g" nginx/conf.d/default.conf
sed -i "s|ssl_certificate_key /etc/nginx/ssl/self-signed.key;|# ssl_certificate_key /etc/nginx/ssl/self-signed.key;|g" nginx/conf.d/default.conf

# Setup auto-renewal
echo -e "${GREEN}Setting up auto-renewal...${NC}"
(crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet --post-hook 'docker compose restart nginx'") | crontab -

# Restart containers
echo -e "${GREEN}Starting containers...${NC}"
docker compose up -d

echo ""
echo "================================================"
echo -e "${GREEN}SSL Setup Complete!${NC}"
echo "================================================"
echo ""
echo "Your site is now accessible at:"
echo "https://$DOMAIN"
echo "https://www.$DOMAIN"
echo ""
echo "Certificate will auto-renew every 90 days."
echo "================================================"
