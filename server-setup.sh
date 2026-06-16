#!/bin/bash

# Server Setup Script for Inmarco Website
# Run this on your Ubuntu server to set up the deployment environment

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== Inmarco Website Server Setup ===${NC}\n"

# Check if running on Ubuntu
if [ ! -f /etc/os-release ] || ! grep -q "Ubuntu" /etc/os-release; then
    echo -e "${YELLOW}Warning: This script is designed for Ubuntu. Proceed with caution on other systems.${NC}"
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
    fi
fi

# Update system
echo -e "\n${YELLOW}Updating system packages...${NC}"
sudo apt update
sudo apt upgrade -y

# Install Docker if not installed
if ! command -v docker &> /dev/null; then
    echo -e "\n${YELLOW}Installing Docker...${NC}"
    sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io
    echo -e "${GREEN}✓ Docker installed${NC}"
else
    echo -e "${GREEN}✓ Docker already installed${NC}"
fi

# Install Docker Compose if not installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "\n${YELLOW}Installing Docker Compose...${NC}"
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}✓ Docker Compose installed${NC}"
else
    echo -e "${GREEN}✓ Docker Compose already installed${NC}"
fi

# Add current user to docker group
if ! groups $USER | grep -q docker; then
    echo -e "\n${YELLOW}Adding user to docker group...${NC}"
    sudo usermod -aG docker $USER
    echo -e "${GREEN}✓ User added to docker group${NC}"
    echo -e "${YELLOW}Note: You'll need to logout and login again for this to take effect${NC}"
fi

# Create deployment directory
DEPLOY_DIR="$HOME/inmarco-website"
echo -e "\n${YELLOW}Creating deployment directory...${NC}"
mkdir -p "$DEPLOY_DIR"
cd "$DEPLOY_DIR"
echo -e "${GREEN}✓ Created directory: $DEPLOY_DIR${NC}"

# Prompt for Docker Hub username
read -p $'\nEnter Docker Hub username for the image: ' DOCKER_USERNAME

if [ -z "$DOCKER_USERNAME" ]; then
    echo -e "${RED}Error: Docker Hub username is required${NC}"
    exit 1
fi

IMAGE_NAME="${DOCKER_USERNAME}/inmarco-website"

# Create .env file
echo -e "\n${YELLOW}Creating environment file...${NC}"
cat > .env << 'ENVFILE'
# ============================================
# DATABASE CONFIGURATION
# ============================================
POSTGRES_PASSWORD=CHANGE_THIS_SECURE_PASSWORD

# Database URL
DATABASE_URL=postgresql://inmarco:CHANGE_THIS_SECURE_PASSWORD@postgres:5432/inmarco_website?schema=public

# ============================================
# ADMIN AUTHENTICATION
# ============================================
ADMIN_USERNAME=Inmarco
ADMIN_EMAIL=admin@inmarco.ae
ADMIN_PASSWORD=CHANGE_THIS_ADMIN_PASSWORD

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=CHANGE_THIS_JWT_SECRET_MIN_32_CHARS

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

# ============================================
# APPLICATION SETTINGS
# ============================================
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1
ENVFILE

echo -e "${GREEN}✓ Created .env file${NC}"
echo -e "${YELLOW}⚠  IMPORTANT: Edit .env and update all passwords and secrets!${NC}"

# Create docker-compose.yml
echo -e "\n${YELLOW}Creating docker-compose.yml...${NC}"
cat > docker-compose.yml << COMPOSEFILE
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: inmarco-postgres
    restart: unless-stopped
    environment:
      - POSTGRES_USER=inmarco
      - POSTGRES_PASSWORD=\${POSTGRES_PASSWORD}
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
    image: ${IMAGE_NAME}:latest
    container_name: inmarco-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file:
      - .env
    environment:
      - DATABASE_URL=postgresql://inmarco:\${POSTGRES_PASSWORD}@postgres:5432/inmarco_website?schema=public
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
COMPOSEFILE

echo -e "${GREEN}✓ Created docker-compose.yml${NC}"

# Create deployment script
cat > deploy.sh << 'DEPLOYFILE'
#!/bin/bash
set -e

echo "Pulling latest image..."
docker-compose pull app

echo "Starting services..."
docker-compose up -d

echo "Waiting for services to be healthy..."
sleep 10

echo "Running database migrations..."
docker-compose exec app npx prisma migrate deploy

echo "Seeding database (if needed)..."
docker-compose exec app npx prisma db seed || true

echo "Deployment complete!"
docker-compose ps
DEPLOYFILE

chmod +x deploy.sh
echo -e "${GREEN}✓ Created deploy.sh${NC}"

# Setup firewall (optional)
read -p $'\nSetup UFW firewall? (y/n): ' -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Setting up firewall...${NC}"
    sudo ufw allow 22
    sudo ufw allow 80
    sudo ufw allow 443
    sudo ufw --force enable
    echo -e "${GREEN}✓ Firewall configured${NC}"
fi

echo -e "\n${GREEN}=== Setup Complete ===${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Edit .env file and update all passwords/secrets:"
echo "   nano $DEPLOY_DIR/.env"
echo ""
echo "2. Pull and start the application:"
echo "   cd $DEPLOY_DIR"
echo "   ./deploy.sh"
echo ""
echo "3. Check status:"
echo "   docker-compose ps"
echo "   docker-compose logs -f"
echo ""
echo "4. Access the application:"
echo "   http://$(hostname -I | awk '{print $1}'):3000"
echo ""
echo -e "${YELLOW}For production setup with SSL, see DOCKER_DEPLOYMENT.md${NC}"
