#!/bin/bash

# SSL Certificate Setup Script for Docker
# Usage: ./init-letsencrypt.sh yourdomain.com your@email.com

set -e

DOMAIN=$1
EMAIL=$2

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
    echo "Usage: ./init-letsencrypt.sh yourdomain.com your@email.com"
    exit 1
fi

echo "🔒 Setting up SSL certificates for $DOMAIN..."
echo "================================================"

# Create directories
mkdir -p certbot/conf
mkdir -p certbot/www

# Check if certificate already exists
if [ -d "certbot/conf/live/$DOMAIN" ]; then
    echo "⚠️  Certificate already exists for $DOMAIN"
    read -p "Do you want to renew it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
    fi
fi

# Download recommended TLS parameters
echo "📥 Downloading recommended TLS parameters..."
if [ ! -e "certbot/conf/options-ssl-nginx.conf" ]; then
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > certbot/conf/options-ssl-nginx.conf
fi
if [ ! -e "certbot/conf/ssl-dhparams.pem" ]; then
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > certbot/conf/ssl-dhparams.pem
fi

# Update nginx.conf with actual domain
echo "📝 Updating nginx.conf with domain $DOMAIN..."
sed -i.bak "s/yourdomain\.com/$DOMAIN/g" nginx.conf

# Create dummy certificate for initial nginx start
echo "🔐 Creating dummy certificate..."
mkdir -p "certbot/conf/live/$DOMAIN"
docker-compose -f docker-compose.prod.yml run --rm --entrypoint "\
    openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout /etc/letsencrypt/live/$DOMAIN/privkey.pem \
    -out /etc/letsencrypt/live/$DOMAIN/fullchain.pem \
    -subj '/CN=localhost'" certbot

# Start nginx
echo "🚀 Starting nginx..."
docker-compose -f docker-compose.prod.yml up -d nginx

# Delete dummy certificate
echo "🗑️  Removing dummy certificate..."
docker-compose -f docker-compose.prod.yml run --rm --entrypoint "\
    rm -rf /etc/letsencrypt/live/$DOMAIN && \
    rm -rf /etc/letsencrypt/archive/$DOMAIN && \
    rm -rf /etc/letsencrypt/renewal/$DOMAIN.conf" certbot

# Request real certificate
echo "📜 Requesting Let's Encrypt certificate..."
docker-compose -f docker-compose.prod.yml run --rm --entrypoint "\
    certbot certonly --webroot -w /var/www/certbot \
    --email $EMAIL \
    -d $DOMAIN \
    --rsa-key-size 4096 \
    --agree-tos \
    --force-renewal" certbot

# Reload nginx
echo "🔄 Reloading nginx..."
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload

echo ""
echo "✅ SSL certificate setup complete!"
echo "🌐 Your site is now accessible at https://$DOMAIN"
echo ""
echo "Certificate will auto-renew every 12 hours via the certbot container."
