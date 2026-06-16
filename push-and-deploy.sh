#!/bin/bash

# Script to push image and deploy to server automatically
set -e

SERVER="13.235.106.227"
USER="ubuntu"  # Change if your username is different

echo "🚀 Inmarco Website - Push and Deploy"
echo ""

# Step 1: Push to Docker Hub
echo "📤 Step 1: Pushing to Docker Hub..."
docker push manav27/inmarco-website:latest

echo ""
echo "✅ Image pushed successfully!"
echo ""

# Step 2: Copy deployment script to server
echo "📋 Step 2: Copying deployment script to server..."
scp deploy-to-server.sh ${USER}@${SERVER}:/tmp/

echo ""
echo "✅ Script copied to server!"
echo ""

# Step 3: Execute deployment on server
echo "🚀 Step 3: Deploying on server..."
echo "----------------------------------------"

ssh ${USER}@${SERVER} 'bash /tmp/deploy-to-server.sh'

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "Access your application at: http://${SERVER}:3000"
echo ""
