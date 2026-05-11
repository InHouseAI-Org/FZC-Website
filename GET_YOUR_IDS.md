# 🆔 Get Your Analytics IDs - Step-by-Step Guide

This guide will walk you through getting all the IDs you need for analytics, heatmaps, and search tracking.

**Total Time**: 15-20 minutes
**Cost**: $0 (Everything is FREE!)

---

## 📋 What You'll Get

By the end of this guide, you'll have:
- ✅ Google Analytics 4 Measurement ID (`G-XXXXXXXXXX`)
- ✅ Microsoft Clarity Project ID (`xxxxxxxxxx`)
- ✅ Google Search Console Verification Code
- ✅ Google Tag Manager Container ID (optional - `GTM-XXXXXXX`)

---

# 🔥 PHASE 1: Get Microsoft Clarity ID (Heatmaps)

**Time**: 3 minutes
**Cost**: FREE forever

## Step 1: Sign Up for Microsoft Clarity

1. Open your browser and go to:
   ```
   https://clarity.microsoft.com/
   ```

2. Click the **"Sign up"** or **"Get started - it's free"** button

3. Sign in with one of these accounts:
   - Microsoft account (Outlook, Hotmail, Office 365)
   - GitHub account
   - Facebook account
   - Google account

   > 💡 **Tip**: Use your work Microsoft/Google account for easy access

## Step 2: Create Your First Project

1. After signing in, you'll see the dashboard
2. Click **"+ New project"** button (top right)

3. Fill in the project details:
   ```
   Project name: Inmarco Website
   Website URL: https://www.inmarco.com
   ```
   (Use your actual domain - it's okay if it's not live yet)

4. Click **"Add new project"**

## Step 3: Get Your Clarity Project ID

1. After creating the project, you'll see the **Setup** screen
2. Clarity will show you a tracking code that looks like this:
   ```html
   <script type="text/javascript">
     (function(c,l,a,r,i,t,y){
       ...
     })(window, document, "clarity", "script", "xxxxxxxxxx");
   </script>
   ```

3. **COPY THE PROJECT ID** - it's the `xxxxxxxxxx` part in the script
   - It's usually 10 characters
   - Example: `abc123def4`

4. You can also find it by:
   - Go to **Settings** → **Setup**
   - Look for "Project ID" or "Clarity ID"

## Step 4: Save Your Clarity ID

**Your Clarity Project ID**: `____________________`

You'll add this to your `.env.local` file later.

✅ **Phase 1 Complete!**

---

# 📊 PHASE 2: Get Google Analytics 4 ID

**Time**: 5 minutes
**Cost**: FREE forever

## Step 1: Sign Up / Sign In to Google Analytics

1. Go to:
   ```
   https://analytics.google.com/
   ```

2. Sign in with your Google account
   - Use your work Gmail if you have one
   - Or any personal Gmail account

3. If this is your first time:
   - Click **"Start measuring"**
   - Accept Terms of Service

## Step 2: Create an Account

1. Click **"Admin"** (gear icon at bottom left)

2. Click **"Create Account"** (if you don't have one)

3. Fill in account details:
   ```
   Account name: Inmarco
   Account data sharing settings: Check the boxes you're comfortable with
   ```

4. Click **"Next"**

## Step 3: Create a Property

1. Fill in property details:
   ```
   Property name: Inmarco Website
   Reporting time zone: Your timezone (e.g., Asia/Dubai)
   Currency: USD or your currency
   ```

2. Click **"Next"**

3. Fill in business information:
   ```
   Industry category: Manufacturing
   Business size: Select your company size
   How you plan to use: Select your goals
   ```

4. Click **"Create"**

5. Accept the Google Analytics Terms of Service

## Step 4: Set Up Data Stream

1. Select **"Web"** platform

2. Fill in website details:
   ```
   Website URL: https://www.inmarco.com
   Stream name: Inmarco Website
   ```

3. Click **"Create stream"**

## Step 5: Get Your Measurement ID

1. After creating the stream, you'll see the **Web stream details** page

2. At the top right, you'll see:
   ```
   Measurement ID: G-XXXXXXXXXX
   ```

3. **COPY THIS ID!**
   - It starts with "G-"
   - Followed by 10 characters
   - Example: `G-ABC1234567`

4. You can also find it by:
   - Admin → Data Streams → Click your stream
   - Look for "Measurement ID" at the top

## Step 6: Save Your GA4 Measurement ID

**Your GA4 Measurement ID**: `G-____________________`

✅ **Phase 2 Complete!**

---

# 🔍 PHASE 3: Get Google Search Console Verification

**Time**: 5 minutes
**Cost**: FREE forever

## Step 1: Go to Google Search Console

1. Open:
   ```
   https://search.google.com/search-console
   ```

2. Sign in with the same Google account you used for Analytics

## Step 2: Add Your Property

1. Click **"Add property"** (or "Start now" if first time)

2. You'll see two options:

   **Option A: Domain** (Recommended)
   ```
   Domain: inmarco.com
   ```
   (Covers www, http, https, subdomains)

   **Option B: URL prefix**
   ```
   URL prefix: https://www.inmarco.com
   ```
   (Only covers exact URL)

3. Choose **Domain** and enter: `inmarco.com`

4. Click **"Continue"**

## Step 3: Verify Ownership - DNS Method (Easiest)

1. Google will show you a TXT record that looks like:
   ```
   google-site-verification=abcd1234efgh5678ijkl9012mnop3456
   ```

2. **COPY THIS ENTIRE STRING**

3. Go to your domain registrar (where you bought the domain):
   - GoDaddy, Namecheap, Cloudflare, etc.
   - Find "DNS Settings" or "DNS Management"

4. Add a new record:
   ```
   Type: TXT
   Name: @ (or leave blank)
   Value: google-site-verification=abcd1234efgh5678ijkl9012mnop3456
   TTL: 3600 (or default)
   ```

5. Save the DNS record

6. Wait 5-10 minutes for DNS propagation

7. Go back to Search Console and click **"Verify"**

## Alternative: HTML Tag Method (Easier for Deployment)

If DNS is complicated, use HTML tag method:

1. In Search Console verification screen, click **"HTML tag"** tab

2. Copy the verification code from the meta tag:
   ```html
   <meta name="google-site-verification" content="abcd1234efgh5678ijkl9012mnop3456" />
   ```

3. **COPY ONLY THE CONTENT VALUE**:
   ```
   abcd1234efgh5678ijkl9012mnop3456
   ```

4. You'll add this to your website code (I'll show you where below)

## Step 4: Save Your Verification Code

**Your Search Console Verification Code**: `____________________`

✅ **Phase 3 Complete!**

---

# 🏷️ PHASE 4: Get Google Tag Manager ID (Optional)

**Time**: 3 minutes
**Cost**: FREE forever
**Note**: Only do this if you want advanced tracking features

## Step 1: Go to Google Tag Manager

1. Open:
   ```
   https://tagmanager.google.com/
   ```

2. Sign in with your Google account

## Step 2: Create Account

1. Click **"Create Account"**

2. Fill in account details:
   ```
   Account Name: Inmarco
   Country: Your country
   ```

3. Click **"Continue"**

## Step 3: Set Up Container

1. Fill in container setup:
   ```
   Container name: www.inmarco.com
   Target platform: Web
   ```

2. Click **"Create"**

3. Accept Terms of Service

## Step 4: Get Your Container ID

1. After creation, you'll see a popup with installation code

2. At the top, you'll see:
   ```
   Container ID: GTM-XXXXXXX
   ```

3. **COPY THIS ID!**
   - It starts with "GTM-"
   - Followed by 7 characters
   - Example: `GTM-ABC1234`

4. You can also find it:
   - Top right corner of GTM dashboard
   - Or in Admin → Container Settings

## Step 5: Save Your GTM Container ID

**Your GTM Container ID**: `GTM-____________________`

✅ **Phase 4 Complete!**

---

# 📝 ADD IDS TO YOUR PROJECT

Now that you have all your IDs, let's add them to your website!

## Step 1: Create/Edit .env.local File

1. Open your project folder:
   ```
   Industrial Website Homepage Design v1/
   ```

2. Create a new file named `.env.local` (or edit if it exists)
   - On Mac: Right-click → New File → Name it `.env.local`
   - On Windows: Right-click → New → Text Document → Rename to `.env.local`

3. Open `.env.local` in a text editor

## Step 2: Add Your IDs

Copy this template and fill in YOUR actual IDs:

```bash
# Google Analytics 4 (REQUIRED)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Microsoft Clarity (REQUIRED for heatmaps)
NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx

# Google Tag Manager (OPTIONAL)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Google Search Console Verification (REQUIRED)
NEXT_PUBLIC_GSC_VERIFICATION=your-verification-code-here
```

### Example with Real IDs:
```bash
# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-ABC1234567

# Microsoft Clarity
NEXT_PUBLIC_CLARITY_ID=abc123def4

# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-ABC1234

# Google Search Console
NEXT_PUBLIC_GSC_VERIFICATION=abcd1234efgh5678ijkl9012mnop3456
```

## Step 3: Update Google Search Console Verification in Code

1. Open this file:
   ```
   app/layout.tsx
   ```

2. Find line 81 (around there) that looks like:
   ```typescript
   verification: {
     google: 'your-google-verification-code',
   },
   ```

3. Replace `'your-google-verification-code'` with YOUR actual code:
   ```typescript
   verification: {
     google: 'abcd1234efgh5678ijkl9012mnop3456',
   },
   ```

4. Save the file

## Step 4: Restart Your Development Server

If you're running the dev server, restart it:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

## Step 5: Verify It's Working

1. Open your browser to `http://localhost:4001`

2. Open Developer Tools (Press F12)

3. Go to **Network** tab

4. Refresh the page

5. Filter by "gtag" or "clarity"

6. You should see requests being made to:
   - `www.google-analytics.com`
   - `www.clarity.ms`

✅ **If you see these requests, analytics is working!**

---

# 🧪 TEST YOUR SETUP

## Test Google Analytics (Realtime)

1. Go to your GA4 dashboard:
   ```
   https://analytics.google.com/
   ```

2. Click **Reports** → **Realtime**

3. Open your website in another browser tab

4. Within 30 seconds, you should see:
   - 1 active user (you!)
   - The page you're viewing
   - Your location

✅ **If you see yourself, GA4 is working!**

## Test Microsoft Clarity (Sessions)

1. Go to Clarity dashboard:
   ```
   https://clarity.microsoft.com/
   ```

2. Select your project

3. Browse your website for 1-2 minutes:
   - Click around
   - Scroll pages
   - Navigate to different pages

4. Wait 5-10 minutes

5. Go back to Clarity → **Recordings** tab

6. You should see your session recording!

✅ **If you see your recording, Clarity is working!**

## Test Search Console (After Deployment)

After you deploy to production:

1. Go to Search Console:
   ```
   https://search.google.com/search-console
   ```

2. Click **"Verify"** button

3. If verification succeeds, you'll see:
   - Property verified ✓
   - Dashboard will show over next 24-48 hours

4. Go to **Sitemaps** (left sidebar)

5. Add your sitemap:
   ```
   https://www.inmarco.com/sitemap.xml
   ```

6. Click **Submit**

✅ **If sitemap is submitted successfully, Search Console is working!**

---

# 📋 CHECKLIST - Did You Get Everything?

## IDs Collected
- [ ] Google Analytics 4 Measurement ID (`G-XXXXXXXXXX`)
- [ ] Microsoft Clarity Project ID (`xxxxxxxxxx`)
- [ ] Google Search Console Verification Code
- [ ] Google Tag Manager Container ID (optional - `GTM-XXXXXXX`)

## Files Updated
- [ ] Created/Updated `.env.local` with all IDs
- [ ] Updated `app/layout.tsx` with GSC verification code
- [ ] Restarted dev server

## Testing
- [ ] Tested GA4 in Realtime report (saw yourself)
- [ ] Tested Clarity (browsed site for tracking)
- [ ] Will verify Search Console after deployment

---

# 🎯 QUICK REFERENCE

### Your IDs (Fill this out!)

```
Google Analytics 4:  G-____________________
Microsoft Clarity:   ____________________
Search Console:      ____________________
Google Tag Manager:  GTM-____________________ (optional)
```

### Where to Find Them Again

| Service | Dashboard URL |
|---------|--------------|
| Google Analytics | https://analytics.google.com/ → Admin → Data Streams |
| Microsoft Clarity | https://clarity.microsoft.com/ → Settings → Setup |
| Search Console | https://search.google.com/search-console → Settings |
| Tag Manager | https://tagmanager.google.com/ → Admin → Container Settings |

---

# ❓ TROUBLESHOOTING

## "I can't find my Measurement ID"

**Solution**:
1. Go to https://analytics.google.com/
2. Click **Admin** (gear icon, bottom left)
3. Under **Property**, click **Data Streams**
4. Click your web stream
5. Measurement ID is at the top right

## "Clarity isn't showing recordings"

**Solution**:
- Wait 10-15 minutes after first setup
- Clarity processes recordings in batches
- Make sure you browsed multiple pages (at least 2-3)
- Check that NEXT_PUBLIC_CLARITY_ID is correct in .env.local

## "Analytics shows 0 users in Realtime"

**Solution**:
1. Check .env.local has correct GA4 ID
2. Restart dev server (Ctrl+C, then `npm run dev`)
3. Clear browser cache and reload
4. Check browser console for errors (F12)
5. Make sure not using ad blocker

## "Search Console verification failed"

**Solution**:
- **DNS Method**: Wait 24 hours for DNS propagation
- **HTML Tag Method**:
  1. Make sure code is in app/layout.tsx
  2. Deploy your website first
  3. Then verify in Search Console

---

# 🎉 YOU'RE DONE!

You now have:
- ✅ Real-time visitor tracking (GA4)
- ✅ Heatmaps and session recordings (Clarity)
- ✅ Search performance tracking (Search Console)
- ✅ Advanced tag management (GTM - optional)

**Cost**: $0/month for everything!

---

# 📞 SUPPORT

### Need Help?

**Documentation**:
- Full Analytics Guide: `ANALYTICS_SETUP_GUIDE.md`
- Quick Start: `ANALYTICS_QUICK_START.md`

**Official Support**:
- GA4: https://support.google.com/analytics
- Clarity: https://learn.microsoft.com/en-us/clarity/
- Search Console: https://support.google.com/webmasters
- Tag Manager: https://support.google.com/tagmanager

**Video Tutorials**:
- GA4 Setup: https://www.youtube.com/results?search_query=google+analytics+4+setup
- Clarity Setup: https://www.youtube.com/results?search_query=microsoft+clarity+setup

---

**Next Step**: After getting your IDs, check `DEPLOYMENT_READY.md` to deploy your website! 🚀
