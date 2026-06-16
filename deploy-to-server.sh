#!/bin/bash

# Deployment script for Ubuntu server
# This script will be copied to the server and executed

set -e

echo "🚀 Starting Inmarco Website Deployment..."

# Install Docker if not installed
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

# Install Docker Compose if not installed
if ! command -v docker-compose &> /dev/null; then
    echo "📦 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Create deployment directory
echo "📁 Creating deployment directory..."
mkdir -p ~/inmarco-website
cd ~/inmarco-website

# Create .env file
echo "⚙️  Creating environment file..."
cat > .env << 'ENVEOF'
POSTGRES_PASSWORD=Inmarco2024SecurePass
DATABASE_URL=postgresql://inmarco:Inmarco2024SecurePass@postgres:5432/inmarco_website?schema=public
ADMIN_USERNAME=Inmarco
ADMIN_EMAIL=admin@inmarco.ae
ADMIN_PASSWORD=Admin2024SecurePass
JWT_SECRET=jwt_secret_key_minimum_32_characters_long_12345
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_EMAIL_FROM=noreply@inmarco.ae
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1
ENVEOF

# Create docker-compose.yml
echo "📝 Creating docker-compose.yml..."
cat > docker-compose.yml << 'COMPOSEEOF'
version: '3.8'

services:
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

  app:
    image: manav27/inmarco-website:latest
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
COMPOSEEOF

# Pull and start services
echo "🐳 Pulling Docker images..."
docker compose pull

echo "🚀 Starting services..."
docker compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to start (30 seconds)..."
sleep 30

# Run database migrations
echo "🗄️  Running database migrations..."
docker compose exec app npx prisma migrate deploy

# Seed database
echo "🌱 Seeding database..."
docker compose exec app npx prisma db seed || true

# Show status
echo ""
echo "✅ Deployment Complete!"
echo ""
docker compose ps
echo ""
echo "📊 Application logs (Ctrl+C to exit):"
echo ""
docker compose logs -f app
