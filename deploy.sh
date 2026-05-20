#!/bin/bash

# Quick deployment script for Inmarco Website
# Usage: ./deploy.sh

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "================================================"
echo -e "${BLUE}Inmarco Website - Deployment${NC}"
echo "================================================"
echo ""

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${YELLOW}Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Pull latest changes (if using git)
if [ -d .git ]; then
    echo -e "${GREEN}Pulling latest changes from git...${NC}"
    git pull
fi

# Build and deploy
echo -e "${GREEN}Building Docker images...${NC}"
docker compose build --no-cache

echo ""
echo -e "${GREEN}Stopping old containers...${NC}"
docker compose down

echo ""
echo -e "${GREEN}Starting new containers...${NC}"
docker compose up -d

echo ""
echo -e "${GREEN}Waiting for services to start...${NC}"
sleep 5

echo ""
echo -e "${GREEN}Checking container status...${NC}"
docker compose ps

echo ""
echo -e "${GREEN}Checking logs...${NC}"
docker compose logs --tail=20

echo ""
echo "================================================"
echo -e "${GREEN}Deployment Complete!${NC}"
echo "================================================"
echo ""
echo "Check status: docker compose ps"
echo "View logs: docker compose logs -f"
echo "Stop: docker compose down"
echo "Restart: docker compose restart"
echo ""
echo -e "${GREEN}Your site is running!${NC}"
echo "================================================"
