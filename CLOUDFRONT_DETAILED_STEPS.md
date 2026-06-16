# CloudFront Distribution - Complete Detailed Guide

**Time**: 5-10 minutes
**Goal**: Create a CDN to serve your S3 files globally with HTTPS

---

## Step-by-Step Instructions

### 1. Open CloudFront Console

Go to: **https://console.aws.amazon.com/cloudfront**

You'll see the CloudFront dashboard.

### 2. Start Creating Distribution

Click the orange **"Create distribution"** button (top right or center).

---

## Section 1: Origin Settings

### **Origin Domain** ⚠️ IMPORTANT
- **What it is**: Where CloudFront gets your files from (your S3 bucket)
- **What to do**:
  1. Click in the text field
  2. A dropdown will appear showing your S3 buckets
  3. **Select your bucket**: `inmarco-datasheets.s3.us-east-1.amazonaws.com`
     - (The exact format depends on your bucket name and region)
  4. It will auto-fill

**Example values**:
- If bucket is `inmarco-datasheets` in `us-east-1`:
  - `inmarco-datasheets.s3.us-east-1.amazonaws.com`
- If bucket is `inmarco-datasheets` in `ap-south-1`:
  - `inmarco-datasheets.s3.ap-south-1.amazonaws.com`

### **Origin Path** (optional)
- **What it is**: A folder path within your bucket
- **What to do**: **Leave EMPTY**
- **Why**: We want to serve everything from the bucket root

### **Name**
- **What it is**: A friendly name for this origin
- **What to do**: **Leave auto-filled**
- **It will show**: Something like `inmarco-datasheets.s3.us-east-1.amazonaws.com`

### **Origin Access** ⚠️ IMPORTANT
- **What it is**: How CloudFront accesses your S3 bucket
- **What to do**: Select **"Public"**
- **Why**: Your bucket is publicly readable (we set this in Task 2)

**Options explained**:
- ❌ **Origin access control settings (recommended)**: For private buckets (not our case)
- ✅ **Public**: Your bucket allows public access (THIS ONE)
- ❌ **Legacy access identities**: Old method, don't use

### **Enable Origin Shield**
- **What it is**: Additional caching layer (extra cost)
- **What to do**: Keep **UNCHECKED** (No)
- **Why**: Not needed for your use case, saves money

### **Additional settings** (collapsed by default)
- **What to do**: **Don't expand, leave defaults**

---

## Section 2: Default Cache Behavior Settings

### **Path Pattern**
- **Shows**: `Default (*)`
- **What it is**: Which files this rule applies to
- **What to do**: **Leave as is** (Default (*))
- **Why**: We want this rule to apply to all files

### **Compress Objects Automatically**
- **What it is**: CloudFront compresses files for faster delivery
- **What to do**: Keep **CHECKED** (Yes)
- **Why**: Makes your site faster

### **Viewer Protocol Policy** ⚠️ IMPORTANT
- **What it is**: HTTP vs HTTPS rules
- **What to do**: Select **"Redirect HTTP to HTTPS"**

**Options explained**:
- ❌ **HTTP and HTTPS**: Allows both (not secure)
- ✅ **Redirect HTTP to HTTPS**: Forces HTTPS (THIS ONE)
- ❌ **HTTPS only**: Blocks HTTP completely

**Why Redirect HTTP to HTTPS**:
- Secure connections (SSL)
- Better for SEO
- Users typing http:// get redirected to https://

### **Allowed HTTP Methods** ⚠️ IMPORTANT
- **What it is**: Which HTTP actions are allowed
- **What to do**: Select **"GET, HEAD"**

**Options explained**:
- ✅ **GET, HEAD**: Read-only access (THIS ONE)
- ❌ **GET, HEAD, OPTIONS**: Adds OPTIONS requests (not needed)
- ❌ **GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE**: For APIs (not needed)

**Why GET, HEAD**:
- We only serve static files (images, PDFs)
- Users only need to read/download, not upload

### **Restrict Viewer Access**
- **What it is**: Require signed URLs (private content)
- **What to do**: Keep **NO** (unchecked)
- **Why**: Your content is public

### **Cache Key and Origin Requests** ⚠️ IMPORTANT
- **What to do**: Click **"Cache policy and origin request policy (recommended)"**

**Then under "Cache policy"**:
- **What to do**: Select **"CachingOptimized"** from dropdown

**Options explained**:
- ✅ **CachingOptimized**: Best for static content (THIS ONE)
- ❌ **CachingDisabled**: Don't cache (bad performance)
- ❌ **Elemental-MediaPackage**: For video streaming
- ❌ **Custom**: Advanced, not needed

**Why CachingOptimized**:
- Keeps files cached for a long time
- Faster delivery
- Lower costs (fewer S3 requests)

### **Origin Request Policy**
- **What to do**: **Leave as "None"**
- **Why**: Not needed for static content

### **Response Headers Policy**
- **What it is**: Add security headers
- **What to do**: **Leave as "None"** (or select SimpleCORS if you want)
- **Why**: Not critical for now, can add later if needed

### **Smooth Streaming**
- **What it is**: For video streaming
- **What to do**: Keep **NO** (unchecked)
- **Why**: Not needed

### **Real-time Logs**
- **What it is**: Detailed access logs
- **What to do**: Keep **OFF**
- **Why**: Costs extra money, not needed initially

---

## Section 3: Function Associations

### **Viewer Request, Viewer Response, Origin Request, Origin Response**
- **What it is**: Custom code to modify requests
- **What to do**: **Leave all as "No association"**
- **Why**: Not needed for basic static file serving

---

## Section 4: Settings

### **Price Class** ⚠️ AFFECTS COST
- **What it is**: Which edge locations to use globally
- **What to do**: Choose based on your needs:

**Options**:

**Option 1 - Best Performance** (Recommended for global audience):
- ✅ **Use all edge locations (best performance)**
- **Cost**: ~$8.50 per 100GB
- **Coverage**: Worldwide (300+ locations)
- **Best for**: Global customers

**Option 2 - Moderate Cost**:
- **Use only North America and Europe**
- **Cost**: ~$7 per 100GB
- **Coverage**: US, Canada, Europe
- **Best for**: Western markets mainly

**Option 3 - Lowest Cost**:
- **Use only North America, Europe, Asia, Middle East, and Africa**
- **Cost**: ~$6 per 100GB
- **Coverage**: Excludes South America
- **Best for**: If you have no South American customers

**My Recommendation**:
- If your customers are in India/Middle East/Global → **Use all edge locations**
- If mainly India/Asia → **Use all edge locations** (includes ap-south-1 Mumbai)

### **AWS WAF Web ACL**
- **What it is**: Firewall protection
- **What to do**: **Leave as "Do not enable security protections"**
- **Why**: Costs extra, not needed initially

### **Alternate Domain Name (CNAME)** (optional)
- **What it is**: Use your own domain (e.g., cdn.inmarco.com)
- **What to do**: **Leave EMPTY for now**
- **Why**: You can add your domain later. For now, use CloudFront's domain.

**Note**: If you want to add later, you'll need:
- A domain name
- SSL certificate in AWS Certificate Manager
- DNS CNAME record

### **Custom SSL Certificate**
- **What it is**: HTTPS certificate for custom domain
- **What to do**: **Leave as "Default CloudFront Certificate"**
- **Why**: CloudFront provides free SSL for their domain

**Options**:
- ✅ **Default CloudFront Certificate**: Free HTTPS (THIS ONE)
- ❌ **Custom SSL Certificate**: For your own domain (needs ACM cert)

### **Supported HTTP Versions**
- **What it is**: Which HTTP protocols to support
- **What to do**: **Leave default (HTTP/2, HTTP/3)**
- **Why**: Faster protocols, better performance

**Keep checked**:
- ✅ HTTP/2
- ✅ HTTP/3

### **Default Root Object** (optional)
- **What it is**: File to serve when accessing root (e.g., index.html)
- **What to do**: **Leave EMPTY**
- **Why**: We're not serving a website root, just files

### **Standard Logging**
- **What it is**: Save access logs
- **What to do**: Keep **OFF**
- **Why**: Costs money for S3 storage, not needed initially

### **IPv6**
- **What it is**: Support for IPv6 addresses
- **What to do**: Keep **ENABLED** (checked)
- **Why**: Future-proof, no extra cost

### **Description** (optional)
- **What it is**: Note for yourself
- **What to do**: Type something like: "Inmarco static assets - images, videos, datasheets"
- **Why**: Helps you remember what this distribution is for

---

## Section 5: Review and Create

### Final Check:

Before clicking "Create distribution", verify these key settings:

✅ **Origin domain**: Your S3 bucket selected
✅ **Origin access**: Public
✅ **Viewer protocol policy**: Redirect HTTP to HTTPS
✅ **Allowed HTTP methods**: GET, HEAD
✅ **Cache policy**: CachingOptimized
✅ **Price class**: All edge locations (or your choice)
✅ **SSL certificate**: Default CloudFront Certificate

### Click "Create Distribution"

Big orange button at the bottom.

---

## After Creation

### You'll see:

1. **Status**: "Deploying..."
   - This is normal
   - Takes **5-15 minutes** to deploy globally
   - You can continue, don't need to wait

2. **Distribution Domain Name**:
   - Example: `d111111abcdef8.cloudfront.net`
   - ⚠️ **COPY THIS!** You need it later

3. **Status will change**: "Deploying..." → "Enabled"
   - When it says "Enabled", it's ready to use

---

## Save This Information:

**CloudFront Distribution Domain Name**:
```
d_____________________.cloudfront.net
```

**Full URL format**:
```
https://d_____________________.cloudfront.net
```

---

## Test Your CloudFront (After it's Enabled)

Once status shows "Enabled" (after 5-15 min), test it:

### Test URL format:
```
https://YOUR-CLOUDFRONT-URL/assets/products/test-file.jpg
```

After you upload files to S3, you can test:
```
https://d111111abcdef8.cloudfront.net/datasheets/html/Type_600.html
```

**If you get 404**:
- Files not uploaded to S3 yet (do this in next steps)

**If you get 403 Forbidden**:
- Check S3 bucket policy (Task 2)
- Check Origin Access is set to "Public"

---

## Summary - What You Created:

```
CloudFront Distribution
├── Origin: Your S3 bucket
├── HTTPS: Enabled (redirects HTTP)
├── Caching: Optimized (long cache times)
├── Global: 300+ edge locations worldwide
└── Cost: ~$0.085/GB transferred
```

**Your files will be served as**:
```
https://YOUR-CLOUDFRONT-URL/assets/products/[filename]
https://YOUR-CLOUDFRONT-URL/assets/images/[filename]
https://YOUR-CLOUDFRONT-URL/datasheets/html/[filename]
https://YOUR-CLOUDFRONT-URL/datasheets/pdf/[filename]
```

---

## What CloudFront Does:

1. **User requests**: `https://d111111abcdef8.cloudfront.net/assets/products/image.jpg`
2. **CloudFront checks**: Do I have this cached?
   - **Yes** → Serve from nearest edge location (fast!)
   - **No** → Get from S3, cache it, then serve
3. **Future requests**: Served from cache (even faster!)

**Result**:
- 🚀 Fast delivery worldwide
- 🔒 HTTPS by default
- 💰 Lower S3 costs (fewer requests)

---

## Next Steps:

After CloudFront is created and shows "Enabled":

1. ✅ Copy your CloudFront URL
2. ✅ Continue to uploading files to S3
3. ✅ Update your application to use CloudFront URL
4. ✅ Test everything works

---

## Need to Edit Later?

Go to CloudFront console → Click on your distribution ID → Click "Edit"

You can change:
- Cache settings
- Price class
- Add custom domain
- Enable logging
- Invalidate cache (clear cached files)

---

## Invalidating Cache (Clearing CloudFront Cache):

If you update a file in S3 and want CloudFront to serve the new version immediately:

```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

Or in AWS Console:
- CloudFront → Your distribution → Invalidations tab → Create invalidation
- Enter paths: `/*` (all files) or `/assets/products/*` (specific folder)

**Note**: First 1,000 invalidations/month are free, then $0.005 per path.

---

## Cost Calculator:

**Example scenario**:
- 706MB of assets stored in S3
- 10,000 page views/month
- Each page loads 2MB of assets (images, videos)
- Total transfer: 20GB/month

**Costs**:
- S3 storage (706MB): **$0.02/month**
- CloudFront transfer (20GB): **$1.70/month**
- CloudFront requests (10k): **$0.01/month**
- **Total**: **~$2/month**

**Higher traffic (100k page views)**:
- Transfer: 200GB
- **Cost**: **$17/month**

---

## All Done! 🎉

You should now have your CloudFront distribution created and deploying.

**Write down your CloudFront URL**: `_______________________`

Continue to the next step: Uploading files to S3!
