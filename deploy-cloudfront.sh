#!/bin/bash

# Complete deployment script for CloudFront-enabled Inmarco Website
# This script builds, pushes to Docker Hub, and deploys to EC2 server

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "================================================"
echo -e "${BLUE}Inmarco Website - CloudFront Deployment${NC}"
echo "================================================"
echo ""

# Configuration
DOCKER_IMAGE="manav27/inmarco-website:latest"
SSH_HOST="FZC-Website"
SERVER_DIR="~/inmarco-website"

# Check if docker is running
echo -e "${YELLOW}[1/5] Checking Docker...${NC}"
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker Desktop first.${NC}"
    echo "After starting Docker, run this script again."
    exit 1
fi
echo -e "${GREEN}✓ Docker is running${NC}"
echo ""

# Check Docker Hub login
echo -e "${YELLOW}[2/5] Checking Docker Hub authentication...${NC}"
if ! docker info 2>/dev/null | grep -q "Username"; then
    echo -e "${YELLOW}Not logged in to Docker Hub. Attempting login...${NC}"
    docker login
fi
echo -e "${GREEN}✓ Docker Hub authenticated${NC}"
echo ""

# Build Docker image
echo -e "${YELLOW}[3/5] Building Docker image with CloudFront changes...${NC}"
echo "This may take 5-10 minutes..."
docker build -t ${DOCKER_IMAGE} .
echo -e "${GREEN}✓ Docker image built successfully${NC}"
echo ""

# Push to Docker Hub
echo -e "${YELLOW}[4/5] Pushing image to Docker Hub...${NC}"
docker push ${DOCKER_IMAGE}
echo -e "${GREEN}✓ Image pushed to Docker Hub${NC}"
echo ""

# Deploy to server
echo -e "${YELLOW}[5/5] Deploying to EC2 server...${NC}"
ssh ${SSH_HOST} << 'ENDSSH'
set -e

echo "📦 Navigating to deployment directory..."
cd ~/inmarco-website || { echo "Directory not found. Creating..."; mkdir -p ~/inmarco-website; cd ~/inmarco-website; }

echo "🐳 Pulling latest Docker image..."
docker compose pull app

echo "🔄 Restarting application..."
docker compose up -d app

echo "⏳ Waiting for application to start..."
sleep 10

echo "📊 Checking container status..."
docker compose ps

echo ""
echo "✅ Deployment to server complete!"
echo ""
ENDSSH

echo ""
echo "================================================"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "================================================"
echo ""
echo -e "${GREEN}Your CloudFront-enabled website is now live!${NC}"
echo ""
echo "Next steps:"
echo "  • Check logs: ssh ${SSH_HOST} 'cd ~/inmarco-website && docker compose logs -f app'"
echo "  • Check status: ssh ${SSH_HOST} 'cd ~/inmarco-website && docker compose ps'"
echo "  • Restart if needed: ssh ${SSH_HOST} 'cd ~/inmarco-website && docker compose restart app'"
echo ""
echo "CloudFront CDN: https://d24gq0kplkhyxr.cloudfront.net"
echo "S3 Bucket: s3://inmarco-datasheets"
echo ""
