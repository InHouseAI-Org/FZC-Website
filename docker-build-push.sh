#!/bin/bash

# Docker Build and Push Script for Inmarco Website
# This script builds the Docker image and pushes it to Docker Hub

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Inmarco Website Docker Build & Push ===${NC}\n"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# Prompt for Docker Hub username
read -p "Enter your Docker Hub username: " DOCKER_USERNAME

if [ -z "$DOCKER_USERNAME" ]; then
    echo -e "${RED}Error: Docker Hub username is required${NC}"
    exit 1
fi

# Prompt for version tag (optional)
read -p "Enter version tag (leave empty for 'latest' only): " VERSION_TAG

IMAGE_NAME="${DOCKER_USERNAME}/inmarco-website"

echo -e "\n${YELLOW}Image will be tagged as:${NC}"
echo "  - ${IMAGE_NAME}:latest"
if [ ! -z "$VERSION_TAG" ]; then
    echo "  - ${IMAGE_NAME}:${VERSION_TAG}"
fi

read -p $'\nProceed with build? (y/n): ' -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Build cancelled."
    exit 0
fi

# Login to Docker Hub
echo -e "\n${YELLOW}Logging in to Docker Hub...${NC}"
if ! docker login; then
    echo -e "${RED}Error: Docker Hub login failed${NC}"
    exit 1
fi

# Build the image
echo -e "\n${YELLOW}Building Docker image...${NC}"
echo "This may take 5-15 minutes depending on your system."

if docker build -t "${IMAGE_NAME}:latest" .; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}Error: Build failed${NC}"
    exit 1
fi

# Tag with version if provided
if [ ! -z "$VERSION_TAG" ]; then
    echo -e "\n${YELLOW}Tagging image with version ${VERSION_TAG}...${NC}"
    docker tag "${IMAGE_NAME}:latest" "${IMAGE_NAME}:${VERSION_TAG}"
fi

# Show image size
IMAGE_SIZE=$(docker images "${IMAGE_NAME}:latest" --format "{{.Size}}")
echo -e "\n${GREEN}Image size: ${IMAGE_SIZE}${NC}"

# Push to Docker Hub
echo -e "\n${YELLOW}Pushing to Docker Hub...${NC}"
echo "This may take 5-20 minutes depending on your internet speed."

if docker push "${IMAGE_NAME}:latest"; then
    echo -e "${GREEN}✓ Pushed ${IMAGE_NAME}:latest${NC}"
else
    echo -e "${RED}Error: Failed to push latest tag${NC}"
    exit 1
fi

if [ ! -z "$VERSION_TAG" ]; then
    if docker push "${IMAGE_NAME}:${VERSION_TAG}"; then
        echo -e "${GREEN}✓ Pushed ${IMAGE_NAME}:${VERSION_TAG}${NC}"
    else
        echo -e "${RED}Error: Failed to push version tag${NC}"
        exit 1
    fi
fi

echo -e "\n${GREEN}=== Deployment Complete ===${NC}"
echo -e "\nYour image is now available on Docker Hub:"
echo "  docker pull ${IMAGE_NAME}:latest"
if [ ! -z "$VERSION_TAG" ]; then
    echo "  docker pull ${IMAGE_NAME}:${VERSION_TAG}"
fi

echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. SSH into your Ubuntu server"
echo "2. Pull the image: docker pull ${IMAGE_NAME}:latest"
echo "3. Follow the deployment guide in DOCKER_DEPLOYMENT.md"
echo ""
