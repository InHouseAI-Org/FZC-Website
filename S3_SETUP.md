# S3 Setup for All Static Assets (Images, Videos, Datasheets)

## Benefits of Using S3:
- ✅ Unlimited storage (no more 300MB Vercel limits!)
- ✅ Fast CDN delivery via CloudFront
- ✅ Update images/videos/datasheets without redeploying
- ✅ Direct PDF downloads
- ✅ Reduced Docker image size (from 2.26GB to ~500MB)
- ✅ Faster deployments and builds
- ✅ Cost effective (~$0.023/GB/month + $9/month for 100GB transfer)

---

## Step 1: Create S3 Bucket

1. Go to AWS Console: https://console.aws.amazon.com/s3
2. Click **Create bucket**
3. Settings:
   - **Bucket name:** `inmarco-datasheets` (must be globally unique)
   - **Region:** Choose closest to your users (e.g., `us-east-1`)
   - **Block Public Access:** Uncheck all (we want public read access)
   - **Bucket Versioning:** Enable (optional)
4. Click **Create bucket**

---

## Step 2: Configure Bucket Policy (Public Read)

1. Go to your bucket → **Permissions** → **Bucket Policy**
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

## Step 3: Create IAM User for Uploads

1. Go to: https://console.aws.amazon.com/iam
2. Click **Users** → **Create user**
3. Username: `inmarco-s3-uploader`
4. Attach policy: `AmazonS3FullAccess` (or create custom policy)
5. Create **Access Key**:
   - Use case: **Application running outside AWS**
   - Save the **Access Key ID** and **Secret Access Key**

---

## Step 4: Upload All Assets

### Option A: AWS CLI (Recommended)

```bash
# Install AWS CLI
brew install awscli

# Configure credentials
aws configure
# Enter:
#   AWS Access Key ID: [your-access-key]
#   AWS Secret Access Key: [your-secret-key]
#   Default region: us-east-1
#   Default output format: json

# Navigate to project directory
cd "/Users/manavbathija/Desktop/InHouse AI/FZC/Website/Website Pro/Website"

# 1. Upload product images and videos (431MB)
aws s3 sync "public/FZC Inmarco Product Shoot" s3://inmarco-datasheets/assets/products/ \
  --acl public-read \
  --cache-control "public, max-age=31536000" \
  --exclude "*.DS_Store"

# 2. Upload industry images (power.jpg, water.jpg, etc.)
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

# 3. Upload HTML datasheets
aws s3 sync public/datasheets/new_generated_html s3://inmarco-datasheets/datasheets/html/ \
  --acl public-read \
  --cache-control "public, max-age=31536000"

# 4. Generate and upload PDFs
pnpm export:datasheets
aws s3 sync public/datasheets/pdf_exports s3://inmarco-datasheets/datasheets/pdf/ \
  --acl public-read \
  --cache-control "public, max-age=31536000"
```

### S3 Folder Structure
```
inmarco-datasheets/
├── assets/
│   ├── products/               # Product photos and videos (431MB)
│   │   ├── Ultra FE 1002/
│   │   ├── 504AR/
│   │   ├── Renders/
│   │   │   └── WEBM/          # Product render videos
│   │   └── ...
│   └── images/                 # Industry images
│       ├── power.jpg
│       ├── water.jpg
│       ├── oil and gas.jpg
│       └── ...
├── datasheets/
│   ├── html/                   # HTML datasheets
│   │   ├── Type_600.html
│   │   └── ...
│   └── pdf/                    # PDF datasheets
│       ├── Type_600.pdf
│       └── ...
```

### Option B: AWS Console (Manual)

1. Go to your bucket
2. Click **Upload**
3. Drag and drop files from `public/datasheets/new_generated_html`
4. Under **Permissions** → Select **Grant public read access**
5. Click **Upload**

---

## Step 5: Get S3 URLs

Your assets will be available at:

**Product Images:**
```
https://inmarco-datasheets.s3.us-east-1.amazonaws.com/assets/products/Ultra%20FE%201002/image1.jpg
https://inmarco-datasheets.s3.us-east-1.amazonaws.com/assets/products/Renders/WEBM/RTJ_3167_Render_2.webm
```

**Industry Images:**
```
https://inmarco-datasheets.s3.us-east-1.amazonaws.com/assets/images/power.jpg
https://inmarco-datasheets.s3.us-east-1.amazonaws.com/assets/images/water.jpg
```

**Datasheets:**
```
https://inmarco-datasheets.s3.us-east-1.amazonaws.com/datasheets/html/Type_600.html
https://inmarco-datasheets.s3.us-east-1.amazonaws.com/datasheets/pdf/Type_600.pdf
```

---

## Step 6: Update Application

### Update Environment Variables

Add to `.env.local` and Vercel environment variables:
```bash
NEXT_PUBLIC_S3_BUCKET=inmarco-datasheets
NEXT_PUBLIC_S3_REGION=us-east-1
NEXT_PUBLIC_S3_BASE_URL=https://inmarco-datasheets.s3.us-east-1.amazonaws.com
```

### Update `productsData.json`

Change paths from local to S3:

**Before:**
```json
{
  "image": "/FZC Inmarco Product Shoot/Ultra FE 1002/image1.jpg",
  "datasheet": "/datasheets/new_generated_html/Type_600.html"
}
```

**After:**
```json
{
  "image": "https://inmarco-datasheets.s3.us-east-1.amazonaws.com/assets/products/Ultra%20FE%201002/image1.jpg",
  "datasheet": "https://inmarco-datasheets.s3.us-east-1.amazonaws.com/datasheets/html/Type_600.html",
  "datasheetPdf": "https://inmarco-datasheets.s3.us-east-1.amazonaws.com/datasheets/pdf/Type_600.pdf"
}
```

### Update Image References in Components

Replace local image paths with S3 URLs:

**Before:**
```tsx
<img src="/power.jpg" alt="Power Industry" />
<img src="/FZC Inmarco Product Shoot/Renders/WEBM/product.webm" />
```

**After:**
```tsx
<img src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/assets/images/power.jpg`} alt="Power Industry" />
<video src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/assets/products/Renders/WEBM/product.webm`} />
```

### Update .vercelignore

Remove exclusions since assets are now in S3:
```bash
# Can remove these lines:
# public/FZC Inmarco Product Shoot/Videos
# *.mp4
# *.webm
```

### Files That Need Updating

Search and replace image paths in these files:
1. **src/data/productsData.json** - Product images and datasheets
2. **src/app/pages/IndustryDetail.tsx** - Industry images
3. **src/app/components/CompanyOverview.tsx** - Product images
4. **src/app/components/Footer.tsx** - Logo/footer images
5. **src/app/components/Header.tsx** - Logo/header images
6. **src/app/pages/AboutUs.tsx** - About page images
7. **src/app/components/Hero.tsx** - Hero section images
8. **src/app/pages/FluidSealingSimplified.tsx** - Feature images
9. **src/app/components/Sustainability.tsx** - Sustainability images
10. **src/app/components/BrandSignature.tsx** - Brand assets

**Tip:** Use find/replace with:
- Find: `"/FZC Inmarco Product Shoot/`
- Replace: `"https://inmarco-datasheets.s3.us-east-1.amazonaws.com/assets/products/`

### Deployment Benefits After S3 Migration

**Before (with local assets):**
- Docker image: 2.26GB (includes 706MB of images/videos)
- Vercel: ❌ Cannot deploy (exceeds 300MB limit)
- Build time: ~5 minutes
- Deployment time: ~10 minutes
- Update single image: Requires full rebuild and redeploy

**After (with S3):**
- Docker image: ~500MB (no images/videos)
- Vercel: ✅ Can deploy successfully
- Build time: ~2 minutes
- Deployment time: ~3 minutes
- Update single image: Just upload to S3 (30 seconds)

---

## Step 7: Optional - CloudFront CDN

For better performance, add CloudFront:

1. Go to: https://console.aws.amazon.com/cloudfront
2. Click **Create Distribution**
3. Settings:
   - **Origin domain:** `inmarco-datasheets.s3.us-east-1.amazonaws.com`
   - **Origin path:** `/datasheets`
   - **Viewer protocol policy:** Redirect HTTP to HTTPS
   - **Allowed HTTP methods:** GET, HEAD
   - **Cache policy:** CachingOptimized
4. Click **Create**

Your CDN URL will be:
```
https://d1234567890.cloudfront.net/html/Type_600.html
https://d1234567890.cloudfront.net/pdf/Type_600.pdf
```

---

## Cost Estimate

For all assets (~706MB total):
- **Storage:**
  - Product images/videos: 431MB
  - Datasheets (HTML + PDF): 275MB
  - Industry images: ~30MB
  - **Total storage cost:** ~$0.02/month ($0.023/GB)
- **Data transfer:**
  - 100GB/month = $9/month
  - 500GB/month = $40/month (high traffic)
- **Requests:**
  - 100k GET requests = $0.04/month
  - 1M GET requests = $0.40/month
- **Estimated Total:**
  - Low traffic: ~$10/month
  - Medium traffic: ~$25/month
  - High traffic: ~$50/month

**With CloudFront CDN:**
- Same cost structure
- Much faster global delivery
- Better caching = fewer S3 requests
- SSL/HTTPS included free

---

## Quick Commands Reference

```bash
# Upload all product images/videos (431MB)
aws s3 sync "public/FZC Inmarco Product Shoot" s3://inmarco-datasheets/assets/products/ --acl public-read --exclude "*.DS_Store"

# Upload industry images
aws s3 sync public s3://inmarco-datasheets/assets/images/ --acl public-read --exclude "datasheets/*" --exclude "FZC Inmarco Product Shoot/*" --include "*.jpg" --include "*.png" --include "*.webp"

# Upload HTML datasheets
aws s3 sync public/datasheets/new_generated_html s3://inmarco-datasheets/datasheets/html/ --acl public-read

# Generate and upload PDFs
pnpm export:datasheets
aws s3 sync public/datasheets/pdf_exports s3://inmarco-datasheets/datasheets/pdf/ --acl public-read

# Update a single file
aws s3 cp "public/FZC Inmarco Product Shoot/Ultra FE 1002/image1.jpg" s3://inmarco-datasheets/assets/products/Ultra%20FE%201002/ --acl public-read

# List all files in bucket
aws s3 ls s3://inmarco-datasheets/ --recursive --human-readable

# Delete old/unused files
aws s3 rm s3://inmarco-datasheets/assets/products/old-file.jpg
```

## One-Command Upload (All Assets)

```bash
# Upload everything at once (recommended for first-time setup)
cd "/Users/manavbathija/Desktop/InHouse AI/FZC/Website/Website Pro/Website"

# Products
aws s3 sync "public/FZC Inmarco Product Shoot" s3://inmarco-datasheets/assets/products/ --acl public-read --exclude "*.DS_Store" && \
# Images
aws s3 sync public s3://inmarco-datasheets/assets/images/ --acl public-read --exclude "datasheets/*" --exclude "FZC Inmarco Product Shoot/*" --exclude "fonts/*" --exclude "*.json" --exclude "*.svg" --include "*.jpg" --include "*.jpeg" --include "*.png" --include "*.webp" && \
# HTML Datasheets
aws s3 sync public/datasheets/new_generated_html s3://inmarco-datasheets/datasheets/html/ --acl public-read && \
# PDF Datasheets (generate first)
pnpm export:datasheets && \
aws s3 sync public/datasheets/pdf_exports s3://inmarco-datasheets/datasheets/pdf/ --acl public-read && \
echo "✅ All assets uploaded successfully!"
```

---

## Need Help?

- AWS S3 Docs: https://docs.aws.amazon.com/s3/
- AWS CLI Docs: https://docs.aws.amazon.com/cli/
