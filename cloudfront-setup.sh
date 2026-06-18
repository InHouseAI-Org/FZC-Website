#!/bin/bash

##############################################################################
# CloudFront Optimization Setup Script
# This script helps you configure CloudFront for optimal performance
##############################################################################

set -e

echo "🚀 CloudFront Optimization Setup"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed${NC}"
    echo "Install it with: brew install awscli (macOS) or pip install awscli"
    exit 1
fi

echo -e "${GREEN}✓ AWS CLI found${NC}"
echo ""

# Get distribution ID
echo "📋 Finding your CloudFront distribution..."
DIST_ID=$(aws cloudfront list-distributions \
    --query "DistributionList.Items[?DomainName=='d24gq0kplkhyxr.cloudfront.net'].Id" \
    --output text 2>/dev/null)

if [ -z "$DIST_ID" ]; then
    echo -e "${RED}❌ Could not find CloudFront distribution${NC}"
    echo "Make sure you're authenticated with AWS CLI:"
    echo "  aws configure"
    exit 1
fi

echo -e "${GREEN}✓ Found distribution: $DIST_ID${NC}"
echo ""

# Function to check current compression setting
check_compression() {
    echo "🔍 Checking current compression setting..."

    COMPRESSED=$(aws cloudfront get-distribution-config \
        --id "$DIST_ID" \
        --query 'DistributionConfig.DefaultCacheBehavior.Compress' \
        --output text)

    if [ "$COMPRESSED" == "True" ]; then
        echo -e "${GREEN}✓ Compression is already enabled${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠ Compression is NOT enabled${NC}"
        return 1
    fi
}

# Function to enable compression
enable_compression() {
    echo ""
    echo "🔧 Enabling Brotli/gzip compression..."

    # Get current config
    aws cloudfront get-distribution-config \
        --id "$DIST_ID" \
        --output json > /tmp/dist-config.json

    # Extract ETag
    ETAG=$(jq -r '.ETag' /tmp/dist-config.json)

    # Modify config to enable compression
    jq '.DistributionConfig.DefaultCacheBehavior.Compress = true' /tmp/dist-config.json \
        | jq '.DistributionConfig' > /tmp/dist-config-updated.json

    # Update distribution
    aws cloudfront update-distribution \
        --id "$DIST_ID" \
        --if-match "$ETAG" \
        --distribution-config file:///tmp/dist-config-updated.json \
        --output json > /dev/null

    echo -e "${GREEN}✓ Compression enabled!${NC}"
    echo "  ⏳ Changes will propagate in 15-20 minutes"
}

# Function to create response headers policy
create_headers_policy() {
    echo ""
    echo "📝 Creating response headers policy..."

    # Check if policy already exists
    POLICY_ID=$(aws cloudfront list-response-headers-policies \
        --query "ResponseHeadersPolicyList.Items[?ResponseHeadersPolicy.ResponseHeadersPolicyConfig.Name=='inmarco-optimal-caching'].ResponseHeadersPolicy.Id" \
        --output text 2>/dev/null)

    if [ -n "$POLICY_ID" ]; then
        echo -e "${YELLOW}⚠ Policy 'inmarco-optimal-caching' already exists (ID: $POLICY_ID)${NC}"
        echo "  Skipping creation..."
        return 0
    fi

    # Create policy JSON
    cat > /tmp/response-headers-policy.json << 'EOF'
{
  "Name": "inmarco-optimal-caching",
  "Comment": "Optimal caching and security headers for Inmarco static assets",
  "CustomHeadersConfig": {
    "Quantity": 5,
    "Items": [
      {
        "Header": "Cache-Control",
        "Value": "public, max-age=31536000, immutable",
        "Override": true
      },
      {
        "Header": "X-Content-Type-Options",
        "Value": "nosniff",
        "Override": true
      },
      {
        "Header": "X-Frame-Options",
        "Value": "SAMEORIGIN",
        "Override": true
      },
      {
        "Header": "X-XSS-Protection",
        "Value": "1; mode=block",
        "Override": true
      },
      {
        "Header": "Referrer-Policy",
        "Value": "origin-when-cross-origin",
        "Override": true
      }
    ]
  }
}
EOF

    # Create policy
    POLICY_ID=$(aws cloudfront create-response-headers-policy \
        --cli-input-json file:///tmp/response-headers-policy.json \
        --query 'ResponseHeadersPolicy.Id' \
        --output text)

    echo -e "${GREEN}✓ Response headers policy created!${NC}"
    echo "  Policy ID: $POLICY_ID"
}

# Function to apply headers policy to distribution
apply_headers_policy() {
    echo ""
    echo "🔗 Applying headers policy to distribution..."

    # Get policy ID
    POLICY_ID=$(aws cloudfront list-response-headers-policies \
        --query "ResponseHeadersPolicyList.Items[?ResponseHeadersPolicy.ResponseHeadersPolicyConfig.Name=='inmarco-optimal-caching'].ResponseHeadersPolicy.Id" \
        --output text 2>/dev/null)

    if [ -z "$POLICY_ID" ]; then
        echo -e "${RED}❌ Policy not found. Run the script again to create it.${NC}"
        return 1
    fi

    # Get current config
    aws cloudfront get-distribution-config \
        --id "$DIST_ID" \
        --output json > /tmp/dist-config.json

    # Extract ETag
    ETAG=$(jq -r '.ETag' /tmp/dist-config.json)

    # Modify config to add response headers policy
    jq ".DistributionConfig.DefaultCacheBehavior.ResponseHeadersPolicyId = \"$POLICY_ID\"" /tmp/dist-config.json \
        | jq '.DistributionConfig' > /tmp/dist-config-updated.json

    # Update distribution
    aws cloudfront update-distribution \
        --id "$DIST_ID" \
        --if-match "$ETAG" \
        --distribution-config file:///tmp/dist-config-updated.json \
        --output json > /dev/null

    echo -e "${GREEN}✓ Headers policy applied!${NC}"
}

# Function to enable HTTP/2 and HTTP/3
enable_http_versions() {
    echo ""
    echo "⚡ Enabling HTTP/2 and HTTP/3..."

    # Get current config
    aws cloudfront get-distribution-config \
        --id "$DIST_ID" \
        --output json > /tmp/dist-config.json

    # Extract ETag
    ETAG=$(jq -r '.ETag' /tmp/dist-config.json)

    # Modify config to enable HTTP/2 and HTTP/3
    jq '.DistributionConfig.HttpVersion = "http2and3"' /tmp/dist-config.json \
        | jq '.DistributionConfig' > /tmp/dist-config-updated.json

    # Update distribution
    aws cloudfront update-distribution \
        --id "$DIST_ID" \
        --if-match "$ETAG" \
        --distribution-config file:///tmp/dist-config-updated.json \
        --output json > /dev/null

    echo -e "${GREEN}✓ HTTP/2 and HTTP/3 enabled!${NC}"
}

# Function to invalidate cache
invalidate_cache() {
    echo ""
    echo "🔄 Creating cache invalidation..."

    INVALIDATION_ID=$(aws cloudfront create-invalidation \
        --distribution-id "$DIST_ID" \
        --paths "/*" \
        --query 'Invalidation.Id' \
        --output text)

    echo -e "${GREEN}✓ Cache invalidation created!${NC}"
    echo "  Invalidation ID: $INVALIDATION_ID"
    echo "  ⏳ This may take 10-15 minutes to complete"
}

# Function to show current status
show_status() {
    echo ""
    echo "📊 Current Distribution Status"
    echo "=============================="

    aws cloudfront get-distribution --id "$DIST_ID" --output json > /tmp/dist-info.json

    STATUS=$(jq -r '.Distribution.Status' /tmp/dist-info.json)
    DOMAIN=$(jq -r '.Distribution.DomainName' /tmp/dist-info.json)
    COMPRESSED=$(jq -r '.Distribution.DistributionConfig.DefaultCacheBehavior.Compress' /tmp/dist-info.json)
    HTTP_VERSION=$(jq -r '.Distribution.DistributionConfig.HttpVersion' /tmp/dist-info.json)

    echo "  Distribution ID: $DIST_ID"
    echo "  Domain: $DOMAIN"
    echo "  Status: $STATUS"
    echo "  Compression: $COMPRESSED"
    echo "  HTTP Version: $HTTP_VERSION"
    echo ""
}

# Main menu
main_menu() {
    echo ""
    echo "What would you like to do?"
    echo ""
    echo "  1) Check current status"
    echo "  2) Enable Brotli/gzip compression"
    echo "  3) Create response headers policy"
    echo "  4) Apply headers policy to distribution"
    echo "  5) Enable HTTP/2 and HTTP/3"
    echo "  6) Invalidate cache (apply changes immediately)"
    echo "  7) Do everything (recommended)"
    echo "  8) Exit"
    echo ""
    read -p "Enter choice [1-8]: " choice

    case $choice in
        1) show_status; main_menu ;;
        2) enable_compression; main_menu ;;
        3) create_headers_policy; main_menu ;;
        4) apply_headers_policy; main_menu ;;
        5) enable_http_versions; main_menu ;;
        6) invalidate_cache; main_menu ;;
        7)
            enable_compression
            create_headers_policy
            apply_headers_policy
            enable_http_versions
            invalidate_cache
            echo ""
            echo -e "${GREEN}✅ All optimizations applied!${NC}"
            echo ""
            echo "Next steps:"
            echo "  1. Wait 15-20 minutes for changes to propagate"
            echo "  2. Test with: ./test-cloudfront.sh"
            echo "  3. Monitor CloudFront metrics in AWS Console"
            ;;
        8) echo "Goodbye!"; exit 0 ;;
        *) echo -e "${RED}Invalid choice${NC}"; main_menu ;;
    esac
}

# Run
check_compression || true
main_menu
