#!/bin/bash

##############################################################################
# CloudFront Optimization Test Script
# Verifies that Brotli, caching, and other optimizations are working
##############################################################################

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🧪 Testing CloudFront Optimizations"
echo "===================================="
echo ""

CLOUDFRONT_DOMAIN="d24gq0kplkhyxr.cloudfront.net"

# Test URLs
TEST_IMAGE="https://$CLOUDFRONT_DOMAIN/assets/images/Hero.webp"
TEST_VIDEO="https://$CLOUDFRONT_DOMAIN/assets/products/GB2.webm"

# Function to test compression
test_compression() {
    echo -e "${BLUE}1. Testing Brotli Compression${NC}"
    echo "   URL: $TEST_IMAGE"
    echo ""

    ENCODING=$(curl -sI -H "Accept-Encoding: br, gzip, deflate" "$TEST_IMAGE" | grep -i "content-encoding" | tr -d '\r')

    if echo "$ENCODING" | grep -q "br"; then
        echo -e "   ${GREEN}✓ Brotli compression is ENABLED${NC}"
        echo "   $ENCODING"
    elif echo "$ENCODING" | grep -q "gzip"; then
        echo -e "   ${YELLOW}⚠ Only gzip compression (Brotli not yet enabled)${NC}"
        echo "   $ENCODING"
    else
        echo -e "   ${RED}❌ No compression detected${NC}"
    fi
    echo ""
}

# Function to test cache headers
test_cache_headers() {
    echo -e "${BLUE}2. Testing Cache-Control Headers${NC}"
    echo "   URL: $TEST_IMAGE"
    echo ""

    CACHE_CONTROL=$(curl -sI "$TEST_IMAGE" | grep -i "cache-control" | tr -d '\r')

    if echo "$CACHE_CONTROL" | grep -q "max-age=31536000"; then
        echo -e "   ${GREEN}✓ Optimal cache headers detected (1 year)${NC}"
        echo "   $CACHE_CONTROL"
    elif echo "$CACHE_CONTROL" | grep -q "max-age"; then
        echo -e "   ${YELLOW}⚠ Cache headers present but not optimal${NC}"
        echo "   $CACHE_CONTROL"
    else
        echo -e "   ${RED}❌ No cache headers detected${NC}"
    fi
    echo ""
}

# Function to test cache status
test_cache_status() {
    echo -e "${BLUE}3. Testing CloudFront Cache Status${NC}"
    echo "   URL: $TEST_IMAGE"
    echo ""

    # First request
    echo "   Making first request..."
    CACHE_STATUS_1=$(curl -sI "$TEST_IMAGE" | grep -i "x-cache" | tr -d '\r')
    echo "   $CACHE_STATUS_1"

    sleep 1

    # Second request (should be cached)
    echo "   Making second request..."
    CACHE_STATUS_2=$(curl -sI "$TEST_IMAGE" | grep -i "x-cache" | tr -d '\r')
    echo "   $CACHE_STATUS_2"

    if echo "$CACHE_STATUS_2" | grep -q "Hit from cloudfront"; then
        echo -e "   ${GREEN}✓ CloudFront cache is working (HIT)${NC}"
    elif echo "$CACHE_STATUS_2" | grep -q "Miss from cloudfront"; then
        echo -e "   ${YELLOW}⚠ Cache MISS (may need time to propagate)${NC}"
    else
        echo "   Status: Unknown"
    fi
    echo ""
}

# Function to test security headers
test_security_headers() {
    echo -e "${BLUE}4. Testing Security Headers${NC}"
    echo "   URL: $TEST_IMAGE"
    echo ""

    HEADERS=$(curl -sI "$TEST_IMAGE")

    # Check each security header
    if echo "$HEADERS" | grep -qi "x-content-type-options"; then
        echo -e "   ${GREEN}✓ X-Content-Type-Options${NC}"
    else
        echo -e "   ${RED}❌ X-Content-Type-Options missing${NC}"
    fi

    if echo "$HEADERS" | grep -qi "x-frame-options"; then
        echo -e "   ${GREEN}✓ X-Frame-Options${NC}"
    else
        echo -e "   ${RED}❌ X-Frame-Options missing${NC}"
    fi

    if echo "$HEADERS" | grep -qi "referrer-policy"; then
        echo -e "   ${GREEN}✓ Referrer-Policy${NC}"
    else
        echo -e "   ${RED}❌ Referrer-Policy missing${NC}"
    fi
    echo ""
}

# Function to test video
test_video() {
    echo -e "${BLUE}5. Testing GB2.webm Video${NC}"
    echo "   URL: $TEST_VIDEO"
    echo ""

    # Get headers
    VIDEO_HEADERS=$(curl -sI "$TEST_VIDEO")

    # Check compression
    if echo "$VIDEO_HEADERS" | grep -qi "content-encoding"; then
        ENCODING=$(echo "$VIDEO_HEADERS" | grep -i "content-encoding" | tr -d '\r')
        echo -e "   ${GREEN}✓ Compression: $ENCODING${NC}"
    else
        echo "   ⚠ No compression (videos may not compress much)"
    fi

    # Check cache
    if echo "$VIDEO_HEADERS" | grep -qi "cache-control.*max-age=31536000"; then
        echo -e "   ${GREEN}✓ Cache headers: Optimal${NC}"
    else
        CACHE=$(echo "$VIDEO_HEADERS" | grep -i "cache-control" | tr -d '\r')
        echo "   Cache: $CACHE"
    fi

    # Check content-type
    if echo "$VIDEO_HEADERS" | grep -qi "content-type.*video"; then
        echo -e "   ${GREEN}✓ Content-Type: video${NC}"
    fi
    echo ""
}

# Function to test HTTP version
test_http_version() {
    echo -e "${BLUE}6. Testing HTTP Version Support${NC}"
    echo ""

    # Check if HTTP/2 is supported
    if curl -sI --http2 "$TEST_IMAGE" | grep -q "HTTP/2"; then
        echo -e "   ${GREEN}✓ HTTP/2 is supported${NC}"
    else
        echo -e "   ${RED}❌ HTTP/2 is not supported${NC}"
    fi

    # Check if HTTP/3 is supported (requires --http3 flag)
    if command -v curl --http3 &> /dev/null; then
        if curl -sI --http3 "$TEST_IMAGE" 2>/dev/null | grep -q "HTTP/3"; then
            echo -e "   ${GREEN}✓ HTTP/3 is supported${NC}"
        else
            echo "   ⚠ HTTP/3 check requires curl with HTTP/3 support"
        fi
    else
        echo "   ℹ HTTP/3 check requires curl with --http3 flag"
    fi
    echo ""
}

# Function to show file sizes
test_file_sizes() {
    echo -e "${BLUE}7. Testing File Sizes${NC}"
    echo ""

    # Test image size
    echo "   Downloading Hero.webp..."
    IMG_SIZE=$(curl -sI -H "Accept-Encoding: br" "$TEST_IMAGE" | grep -i "content-length" | awk '{print $2}' | tr -d '\r')
    if [ -n "$IMG_SIZE" ]; then
        IMG_SIZE_KB=$((IMG_SIZE / 1024))
        echo -e "   Image size: ${IMG_SIZE_KB}KB"
    fi

    # Test video size
    echo "   Checking GB2.webm size..."
    VIDEO_SIZE=$(curl -sI "$TEST_VIDEO" | grep -i "content-length" | awk '{print $2}' | tr -d '\r')
    if [ -n "$VIDEO_SIZE" ]; then
        VIDEO_SIZE_MB=$((VIDEO_SIZE / 1024 / 1024))
        echo -e "   Video size: ${VIDEO_SIZE_MB}MB"
    fi
    echo ""
}

# Run all tests
echo "Testing against: $CLOUDFRONT_DOMAIN"
echo ""
sleep 1

test_compression
test_cache_headers
test_cache_status
test_security_headers
test_video
test_http_version
test_file_sizes

# Summary
echo "=========================================="
echo -e "${GREEN}✅ Testing Complete!${NC}"
echo ""
echo "📋 Summary:"
echo "   • If compression shows 'br', Brotli is working"
echo "   • If cache shows 'HIT', caching is working"
echo "   • If headers show max-age=31536000, optimal caching is set"
echo ""
echo "⏳ Note: Changes may take 15-20 minutes to propagate globally"
echo ""
echo "💡 Tips:"
echo "   • Test from multiple locations for global verification"
echo "   • Check browser DevTools Network tab for detailed headers"
echo "   • Monitor CloudFront metrics in AWS Console"
echo ""
