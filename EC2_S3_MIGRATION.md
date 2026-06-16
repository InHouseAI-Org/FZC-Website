# EC2 + S3 Migration Guide (Existing EC2: 13.235.106.227)

**Goal**: Move static assets to S3/CloudFront, keep application on existing EC2

**Benefits**:
- Reduce Docker image: 2.26GB → ~500MB
- Faster deployments: 10min → 3min
- CDN for global delivery
- Update assets without redeploying
- Cost: Only ~$10/month for S3/CloudFront

---

## Step 1: Set Up AWS S3 Bucket (5 minutes)

### A. Create Bucket

```bash
# Install AWS CLI (if not already installed)
brew install awscli

# Configure AWS credentials
aws configure
# Enter your AWS Access Key ID and Secret Access Key
```

**Or via AWS Console:**

1. Go to: https://console.aws.amazon.com/s3
2. Click **Create bucket**
3. Settings:
   - **Bucket name**: `inmarco-datasheets` (must be globally unique)
   - **Region**: `us-east-1` (or closest to your users)
   - **Uncheck** "Block all public access"
   - Click **Create bucket**

### B. Set Bucket Policy (Public Read Access)

1. Go to bucket → **Permissions** → **Bucket Policy**
2. Add this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::inmarco-datasheets/*"
    }
  ]
}
```

3. Click **Save**

---

## Step 2: Create CloudFront Distribution (5 minutes)

1. Go to: https://console.aws.amazon.com/cloudfront
2. Click **Create Distribution**
3. Settings:
   - **Origin domain**: `inmarco-datasheets.s3.us-east-1.amazonaws.com`
   - **Origin path**: Leave empty
   - **Name**: inmarco-static-assets
   - **Viewer protocol policy**: Redirect HTTP to HTTPS
   - **Allowed HTTP methods**: GET, HEAD
   - **Cache policy**: CachingOptimized
   - **Price class**: Use all edge locations (or choose based on your region)
4. Click **Create Distribution**

**Note**: CloudFront takes 5-15 minutes to deploy globally

**Save your CloudFront URL**: `https://d1234567890.cloudfront.net` (you'll see it in the console)

---

## Step 3: Export Datasheets to PDF (2 minutes)

```bash
cd "/Users/manavbathija/Desktop/InHouse AI/FZC/Website/Website Pro/Website"

# Export all 64 datasheets to PDF
pnpm export:datasheets

# This will create: public/datasheets/pdf_exports/
```

---

## Step 4: Upload All Assets to S3 (10 minutes)

```bash
cd "/Users/manavbathija/Desktop/InHouse AI/FZC/Website/Website Pro/Website"

# 1. Upload product images and videos (431MB) - takes ~5 minutes
echo "📤 Uploading product images and videos..."
aws s3 sync "public/FZC Inmarco Product Shoot" s3://inmarco-datasheets/assets/products/ \
  --acl public-read \
  --cache-control "public, max-age=31536000" \
  --exclude "*.DS_Store"

# 2. Upload industry images (30MB) - takes ~30 seconds
echo "📤 Uploading industry images..."
aws s3 sync public s3://inmarco-datasheets/assets/images/ \
  --acl public-read \
  --cache-control "public, max-age=31536000" \
  --exclude "datasheets/*" \
  --exclude "FZC Inmarco Product Shoot/*" \
  --exclude "fonts/*" \
  --exclude "*.json" \
  --exclude "*.svg" \
  --include "*.jpg" \
  --include "*.jpeg" \
  --include "*.png" \
  --include "*.webp"

# 3. Upload HTML datasheets - takes ~1 minute
echo "📤 Uploading HTML datasheets..."
aws s3 sync public/datasheets/new_generated_html s3://inmarco-datasheets/datasheets/html/ \
  --acl public-read \
  --cache-control "public, max-age=31536000"

# 4. Upload PDF datasheets - takes ~2 minutes
echo "📤 Uploading PDF datasheets..."
aws s3 sync public/datasheets/pdf_exports s3://inmarco-datasheets/datasheets/pdf/ \
  --acl public-read \
  --cache-control "public, max-age=31536000"

echo "✅ All assets uploaded successfully!"

# Verify upload
aws s3 ls s3://inmarco-datasheets/ --recursive --human-readable --summarize
```

**Expected output**: Total Objects: ~257, Total Size: ~706 MB

---

## Step 5: Update Application Code (15 minutes)

### A. Create Environment Variable

Create `.env.local`:
```bash
NEXT_PUBLIC_S3_BASE_URL=https://d1234567890.cloudfront.net
```

Replace `d1234567890.cloudfront.net` with your actual CloudFront URL from Step 2.

### B. Update productsData.json

You need to update image paths in `src/data/productsData.json`:

**Option 1: Manual Find & Replace**
- Find: `"/FZC Inmarco Product Shoot/`
- Replace: `"https://d1234567890.cloudfront.net/assets/products/`

- Find: `"/datasheets/new_generated_html/`
- Replace: `"https://d1234567890.cloudfront.net/datasheets/html/`

**Option 2: Automated Script** (I can create this for you)

### C. Update Component Files

Files that need updating (image imports):
1. `src/app/pages/IndustryDetail.tsx`
2. `src/app/components/Hero.tsx`
3. `src/app/components/Footer.tsx`
4. `src/app/components/Header.tsx`
5. `src/app/pages/AboutUs.tsx`
6. `src/app/components/Sustainability.tsx`
7. `src/app/components/BrandSignature.tsx`
8. `src/app/pages/FluidSealingSimplified.tsx`
9. `src/app/components/CompanyOverview.tsx`

**Pattern to replace:**
- Find: `"/power.jpg"`
- Replace: `"https://d1234567890.cloudfront.net/assets/images/power.jpg"`

### D. Update .dockerignore

Add these lines to `.dockerignore` (since we don't need to include assets in Docker image anymore):

```
# Static assets now in S3
public/FZC Inmarco Product Shoot
public/datasheets/pdf_exports
public/*.jpg
public/*.png
public/*.webp
```

---

## Step 6: Rebuild Docker Image (5 minutes)

```bash
cd "/Users/manavbathija/Desktop/InHouse AI/FZC/Website/Website Pro/Website"

# Build new smaller image (without 706MB of assets)
docker buildx build --platform linux/amd64 \
  -t manav27/inmarco-website:latest \
  -t manav27/inmarco-website:s3-migration \
  --push .

# This should be much faster now!
```

**Expected size**: ~500MB (was 2.26GB before)

---

## Step 7: Deploy to EC2 (3 minutes)

```bash
# SSH to EC2
ssh FZC-Website

# Navigate to project directory
cd /path/to/docker-compose

# Pull new image
docker-compose pull

# Update environment variable
echo "NEXT_PUBLIC_S3_BASE_URL=https://d1234567890.cloudfront.net" >> .env

# Restart services
docker-compose up -d

# Verify
docker-compose ps
docker-compose logs -f nextjs
```

---

## Step 8: Verify Everything Works (5 minutes)

### Test URLs:

1. **CloudFront Assets**:
   - Product image: `https://d1234567890.cloudfront.net/assets/products/Ultra%20FE%201002/image1.jpg`
   - Industry image: `https://d1234567890.cloudfront.net/assets/images/power.jpg`
   - Datasheet HTML: `https://d1234567890.cloudfront.net/datasheets/html/Type_600.html`
   - Datasheet PDF: `https://d1234567890.cloudfront.net/datasheets/pdf/Type_600.pdf`

2. **Website**:
   - Visit: `http://13.235.106.227` (or your domain)
   - Check images load correctly
   - Test datasheet downloads
   - Check product pages

---

## Rollback Plan (If Needed)

If something goes wrong:

```bash
# SSH to EC2
ssh FZC-Website

# Pull previous image
docker pull manav27/inmarco-website:previous-tag

# Update docker-compose.yml to use old image temporarily
# Restart
docker-compose up -d
```

---

## Future Updates

### Update a Single Image:
```bash
aws s3 cp "public/FZC Inmarco Product Shoot/new-image.jpg" \
  s3://inmarco-datasheets/assets/products/ \
  --acl public-read

# Wait 5-15 minutes for CloudFront cache to clear, or invalidate:
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/assets/products/new-image.jpg"
```

### Update All Datasheets:
```bash
# Generate new PDFs
pnpm export:datasheets

# Upload to S3
aws s3 sync public/datasheets/new_generated_html s3://inmarco-datasheets/datasheets/html/ --acl public-read
aws s3 sync public/datasheets/pdf_exports s3://inmarco-datasheets/datasheets/pdf/ --acl public-read

# No need to redeploy application!
```

---

## Cost Breakdown

### S3 Storage:
- **706MB** × $0.023/GB = **$0.02/month**

### CloudFront:
- **Data transfer**: 100GB/month = **$8.50/month**
- **Requests**: 100k requests = **$0.10/month**

### Total: **~$10/month**

---

## Benefits You'll See:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Docker image size | 2.26GB | ~500MB | 78% smaller ✅ |
| Docker build time | ~5min | ~2min | 60% faster ✅ |
| Docker push time | ~10min | ~3min | 70% faster ✅ |
| Update single image | Full redeploy | 30 seconds | 95% faster ✅ |
| Global CDN | ❌ | ✅ | Much faster ✅ |

---

## Need Help?

Common issues:
- **CloudFront not working**: Wait 15 minutes for deployment
- **403 Forbidden**: Check S3 bucket policy is correct
- **Images not loading**: Verify CloudFront URL is correct in .env
- **CORS errors**: Add CORS policy to S3 bucket

---

## Ready to Start?

Follow steps 1-8 in order. Total time: ~40 minutes.

Would you like me to:
1. Create a script to automatically update all image URLs?
2. Help you with the AWS console setup?
3. Start with Step 3 (exporting PDFs)?
