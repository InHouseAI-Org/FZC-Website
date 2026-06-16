# AWS Console Setup - Step by Step

**What you need to do on AWS Console**: 4 tasks, ~15 minutes total

---

## Task 1: Create S3 Bucket (3 minutes)

### Steps:

1. **Go to S3**: https://console.aws.amazon.com/s3

2. **Click**: "Create bucket" (orange button)

3. **Fill in**:
   - **Bucket name**: `inmarco-datasheets`
     - (If taken, try: `inmarco-assets`, `inmarco-static`, `fzc-inmarco-assets`)
   - **Region**: `us-east-1` (N. Virginia)
     - Or choose: `ap-south-1` (Mumbai) if you want closer to your EC2

4. **Object Ownership**: Keep default (ACLs disabled)

5. **Block Public Access settings**:
   - ⚠️ **UNCHECK** "Block all public access"
   - Check the acknowledgment box that appears

6. **Bucket Versioning**: Disabled (keep default)

7. **Tags**: Skip (optional)

8. **Default encryption**: Keep default (SSE-S3)

9. **Click**: "Create bucket" (bottom)

✅ **Done!** Note down your bucket name: `________________`

---

## Task 2: Set Bucket Policy (2 minutes)

### Steps:

1. **Click** on your bucket name (from the list)

2. **Go to** "Permissions" tab

3. **Scroll down** to "Bucket policy"

4. **Click** "Edit"

5. **Paste this** (replace `YOUR-BUCKET-NAME` with your actual bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

**Example**: If your bucket is `inmarco-datasheets`, change to:
```json
"Resource": "arn:aws:s3:::inmarco-datasheets/*"
```

6. **Click** "Save changes"

✅ **Done!** Bucket is now publicly readable.

---

## Task 3: Get AWS Credentials (5 minutes)

You need these to upload files from your computer using AWS CLI.

### Steps:

1. **Go to IAM**: https://console.aws.amazon.com/iam

2. **Click** "Users" (left sidebar)

3. **Click** "Create user" (orange button)

4. **User name**: `inmarco-s3-uploader`

5. **Click** "Next"

6. **Permissions**: Click "Attach policies directly"

7. **Search** for: `AmazonS3FullAccess`

8. **Check** the box next to it

9. **Click** "Next" → "Create user"

10. **Click** on the user name you just created

11. **Go to** "Security credentials" tab

12. **Scroll down** to "Access keys"

13. **Click** "Create access key"

14. **Select**: "Command Line Interface (CLI)"

15. **Check** the confirmation box at bottom

16. **Click** "Next"

17. **Description**: "Upload to S3" (optional)

18. **Click** "Create access key"

19. ⚠️ **IMPORTANT**: You'll see:
    - **Access key ID**: `AKIA...` (copy this)
    - **Secret access key**: `wJalr...` (copy this)

    **Copy both now!** You won't see the secret again.

✅ **Done!** Save these credentials:
- Access Key ID: `________________`
- Secret Access Key: `________________`

---

## Task 4: Create CloudFront Distribution (5 minutes)

### Steps:

1. **Go to CloudFront**: https://console.aws.amazon.com/cloudfront

2. **Click** "Create distribution" (orange button)

3. **Origin settings**:
   - **Origin domain**: Click the dropdown → Select your S3 bucket
     - It will auto-fill like: `inmarco-datasheets.s3.us-east-1.amazonaws.com`
   - **Origin path**: Leave empty
   - **Name**: Leave auto-filled
   - **Origin access**: Select "Public"

4. **Default cache behavior**:
   - **Viewer protocol policy**: Select "Redirect HTTP to HTTPS"
   - **Allowed HTTP methods**: Keep "GET, HEAD" (default)
   - **Cache policy**: Select "CachingOptimized"
   - Leave everything else as default

5. **Settings**:
   - **Price class**: "Use all edge locations" (or choose based on budget)
   - **Alternate domain name (CNAME)**: Leave empty for now
   - **Custom SSL certificate**: Leave default
   - **Default root object**: Leave empty

6. **Click** "Create distribution" (bottom)

7. **Wait**: Status will show "Deploying..." → Takes 5-15 minutes

8. ⚠️ **IMPORTANT**: Copy your CloudFront URL:
   - Look for "Distribution domain name"
   - Example: `d111111abcdef8.cloudfront.net`

✅ **Done!** Save your CloudFront URL: `________________`

---

## That's It for AWS Console! 🎉

### What You Should Have Now:

- ✅ S3 Bucket name: `________________`
- ✅ AWS Access Key ID: `________________`
- ✅ AWS Secret Access Key: `________________`
- ✅ CloudFront URL: `________________`

### Next Steps (On Your Computer):

1. Configure AWS CLI with your credentials
2. Export datasheets to PDF
3. Upload files to S3
4. Update your application code
5. Deploy to EC2

**Continue to**: `EC2_S3_MIGRATION.md` (Step 3) once CloudFront shows "Enabled" status.

---

## Quick Reference - What We Created:

```
S3 Bucket: inmarco-datasheets
    ↓
CloudFront CDN: https://d111111abcdef8.cloudfront.net
    ↓
Your Website: http://13.235.106.227
```

---

## Troubleshooting:

**Q: Bucket name already taken?**
A: Try: `inmarco-assets-2024`, `fzc-inmarco`, `inmarco-static-prod`

**Q: Can't uncheck "Block all public access"?**
A: Make sure you check the acknowledgment box that appears

**Q: CloudFront still deploying?**
A: This is normal, takes 5-15 minutes. You can continue with Steps 3-5 while waiting.

**Q: Lost my secret access key?**
A: Delete the access key and create a new one (Step 3, start from step 12)
