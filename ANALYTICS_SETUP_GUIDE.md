# Analytics Setup Guide - Inmarco Website

## Overview
This guide will help you set up comprehensive analytics for tracking user behavior, conversions, and website performance.

---

## 🎯 What Has Been Implemented

### 1. Google Analytics 4 (GA4)
- **File**: `app/components/Analytics.tsx`
- **Helper Functions**: `app/lib/gtag.ts`
- **Auto-tracking**: Page views, user sessions, traffic sources
- **Custom Events**: Product views, industry views, downloads, form submissions

### 2. Google Tag Manager (GTM) - Optional
- Advanced tracking without code changes
- Easy integration with third-party tools
- A/B testing capabilities

### 3. Microsoft Clarity - Optional (FREE)
- **Heatmaps**: See where users click
- **Session Recordings**: Watch real user sessions
- **Insights**: Automatic rage clicks, dead clicks detection

---

## 📋 Step-by-Step Setup

### Step 1: Set Up Google Analytics 4

#### 1.1 Create GA4 Property
1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (bottom left gear icon)
3. Click **Create Property**
4. Enter property details:
   - **Property name**: Inmarco Website
   - **Time zone**: Your timezone
   - **Currency**: USD (or your currency)
5. Click **Next** → Fill business details → **Create**
6. Accept Terms of Service

#### 1.2 Create Data Stream
1. Select **Web** platform
2. Enter website URL: `https://www.inmarco.com`
3. Stream name: `Inmarco Main Site`
4. Click **Create Stream**
5. **Copy your Measurement ID** (format: `G-XXXXXXXXXX`)

#### 1.3 Add to Your Website
1. Create `.env.local` file in your project root:
```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # Replace with your actual ID
```

2. Restart your dev server:
```bash
npm run dev
```

3. Test in browser:
   - Open your website
   - Open browser DevTools (F12)
   - Go to **Network** tab
   - Filter by "gtag" or "collect"
   - You should see analytics requests

#### 1.4 Verify Data Collection
1. Go back to GA4 → **Reports** → **Realtime**
2. Open your website in another tab
3. You should see yourself as an active user within 30 seconds

---

### Step 2: Set Up Google Tag Manager (GTM) - Optional

#### 2.1 Create GTM Account
1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Click **Create Account**
3. Enter:
   - **Account Name**: Inmarco
   - **Country**: Your country
   - **Container Name**: www.inmarco.com
   - **Target Platform**: Web
4. Accept Terms → **Create**
5. **Copy your Container ID** (format: `GTM-XXXXXXX`)

#### 2.2 Add to Website
Add to `.env.local`:
```bash
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX  # Your GTM Container ID
```

#### 2.3 Link GTM with GA4
1. In GTM, click **Tags** → **New**
2. Tag Configuration → **Google Analytics: GA4 Configuration**
3. Enter your GA4 Measurement ID (`G-XXXXXXXXXX`)
4. Triggering → **All Pages**
5. Save → **Submit** → **Publish**

---

### Step 3: Set Up Microsoft Clarity - Optional (FREE)

#### 3.1 Create Clarity Project
1. Go to [Microsoft Clarity](https://clarity.microsoft.com/)
2. Sign in with Microsoft account (free)
3. Click **Add New Project**
4. Enter:
   - **Project Name**: Inmarco Website
   - **Website URL**: https://www.inmarco.com
5. **Copy your Project ID**

#### 3.2 Add to Website
Add to `.env.local`:
```bash
NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx  # Your Clarity Project ID
```

---

### Step 4: Set Up Google Search Console

#### 4.1 Add Property
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click **Add Property**
3. Choose **Domain** or **URL Prefix**
4. Enter: `https://www.inmarco.com`

#### 4.2 Verify Ownership
Choose one method:

**Method 1: HTML Meta Tag (Easiest)**
1. Copy the verification code from Search Console
2. Update `app/layout.tsx` line 81 with your code:
```typescript
verification: {
  google: 'your-actual-verification-code-here',
},
```
3. Deploy your site
4. Click **Verify** in Search Console

**Method 2: DNS Record**
1. Add TXT record to your domain DNS
2. Click **Verify**

#### 4.3 Submit Sitemap
1. In Search Console, go to **Sitemaps** (left sidebar)
2. Enter: `https://www.inmarco.com/sitemap.xml`
3. Click **Submit**
4. Status should show "Success" within a few hours

---

## 📊 Analytics Features & Tracking

### Automatic Tracking (No Code Needed)
✅ **Page Views**: Every page visit tracked automatically
✅ **Sessions**: User session duration and engagement
✅ **Traffic Sources**: Where users come from (Google, LinkedIn, Direct, etc.)
✅ **Device Type**: Desktop, mobile, tablet
✅ **Location**: Country, city, language
✅ **Bounce Rate**: % of users who leave immediately
✅ **Page Load Time**: Website performance metrics

### Custom Event Tracking (Already Implemented)

#### Product Views
Automatically tracked when users view product pages:
```typescript
import { trackProductView } from '@/app/lib/gtag';

trackProductView('PE 505', 'PTFE Packing');
```

#### Industry Page Views
```typescript
import { trackIndustryView } from '@/app/lib/gtag';

trackIndustryView('Oil & Gas');
```

#### Contact Form Submissions
```typescript
import { trackContactFormSubmit } from '@/app/lib/gtag';

trackContactFormSubmit();
```

#### Catalog Downloads
```typescript
import { trackCatalogDownload } from '@/app/lib/gtag';

trackCatalogDownload('Product Catalog 2025');
```

#### Video Plays
```typescript
import { trackVideoPlay } from '@/app/lib/gtag';

trackVideoPlay('Manufacturing Process Video');
```

#### Search Queries
```typescript
import { trackSearch } from '@/app/lib/gtag';

trackSearch('spiral wound gasket');
```

---

## 🎯 Key Metrics to Monitor

### Traffic Metrics
- **Users**: Total unique visitors
- **Sessions**: Total visits (users can have multiple sessions)
- **Pageviews**: Total pages viewed
- **Pages per Session**: Engagement indicator
- **Avg Session Duration**: How long users stay

### Acquisition Metrics
- **Traffic Sources**: Organic, Direct, Referral, Social
- **Top Channels**: Which marketing channels work best
- **Landing Pages**: Where users enter your site
- **Exit Pages**: Where users leave

### Engagement Metrics
- **Bounce Rate**: % of single-page sessions
- **Time on Page**: How long users read content
- **Scroll Depth**: How far users scroll (via GTM)
- **Click Events**: Button and link clicks

### Conversion Metrics
- **Form Submissions**: Contact form completions
- **Catalog Downloads**: PDF downloads
- **Product Inquiries**: Product page CTAs clicked
- **Email Clicks**: mailto: link clicks

### Technical Metrics
- **Page Load Time**: Website speed
- **Core Web Vitals**: LCP, FID, CLS (Google ranking factors)
- **Errors**: JavaScript errors, broken links
- **Browser/Device**: What technology users use

---

## 📈 GA4 Reports to Check Daily/Weekly

### Daily Reports
1. **Realtime Report** - Current active users
2. **Acquisition Overview** - Traffic sources today
3. **Pages and Screens** - Most viewed pages

### Weekly Reports
1. **User Acquisition** - Where new users come from
2. **Engagement** - User behavior trends
3. **Conversions** - Goal completions
4. **Demographics** - User locations and devices

### Monthly Reports
1. **Retention** - Returning user rate
2. **Lifetime Value** - User value over time
3. **Funnel Analysis** - Conversion path optimization
4. **Comparisons** - Month-over-month growth

---

## 🔧 Advanced Configuration (Optional)

### Setting Up Conversion Goals

#### 1. Contact Form Submission Goal
1. In GA4 → **Admin** → **Events**
2. Click **Create Event**
3. Event name: `submit_contact_form`
4. Go to **Conversions** → Mark as conversion

#### 2. Catalog Download Goal
1. Create event: `download_catalog`
2. Mark as conversion

#### 3. Product Inquiry Goal
1. Create event: `view_product`
2. Set up conditional conversion (e.g., viewed 3+ products)

### Custom Dimensions (Optional)
Track additional data:

1. **Product Category**: Which product types are popular
2. **Industry Interest**: Which industries users explore
3. **User Type**: New vs Returning

### E-commerce Tracking (If you add a store)
```typescript
// Track product details
gtag.event({
  action: 'view_item',
  category: 'ecommerce',
  label: 'Product Name',
  value: 299.99
});

// Track add to cart
gtag.event({
  action: 'add_to_cart',
  category: 'ecommerce',
  label: 'Product Name',
  value: 299.99
});
```

---

## 🔍 Heatmap & Session Recording (Microsoft Clarity)

### What Clarity Shows You:

#### Heatmaps
- **Click Heatmap**: Where users click most
- **Scroll Heatmap**: How far users scroll
- **Attention Heatmap**: Where users spend time

#### Session Recordings
- Watch actual user sessions (anonymized)
- See cursor movements, clicks, scrolls
- Identify usability issues
- Find confusing UI elements

#### Insights (Automatic)
- **Rage Clicks**: Users clicking repeatedly (frustration)
- **Dead Clicks**: Clicks on non-clickable elements
- **Quick Backs**: Users immediately leaving
- **Excessive Scrolling**: Users can't find content

### How to Use Clarity:
1. Go to [clarity.microsoft.com](https://clarity.microsoft.com)
2. Select your project
3. View **Recordings** tab → Watch user sessions
4. View **Heatmaps** tab → See click patterns
5. View **Insights** tab → Auto-detected issues

---

## 🚀 Best Practices

### Privacy & GDPR Compliance
1. ✅ Analytics only loads in production (implemented)
2. ✅ No personally identifiable information (PII) tracked
3. ⚠️ Add cookie consent banner (recommended for EU users)
4. ⚠️ Add Privacy Policy (link in footer)

### Performance
1. ✅ Scripts load `afterInteractive` (doesn't block page load)
2. ✅ Only loads in production environment
3. ✅ Minimal performance impact (<50ms)

### Data Accuracy
1. Filter out bot traffic in GA4
2. Exclude internal traffic (your office IP)
3. Set up data retention (default: 14 months)

---

## 🎓 Learning Resources

### Google Analytics 4
- [GA4 Beginner's Guide](https://support.google.com/analytics/answer/9304153)
- [GA4 Event Tracking](https://support.google.com/analytics/answer/9267735)
- [GA4 YouTube Channel](https://www.youtube.com/c/googleanalytics)

### Google Tag Manager
- [GTM Fundamentals](https://support.google.com/tagmanager/answer/6102821)
- [GTM Academy (Free)](https://analytics.google.com/analytics/academy/)

### Microsoft Clarity
- [Clarity Documentation](https://learn.microsoft.com/en-us/clarity/)
- [Clarity Blog](https://clarity.microsoft.com/blog)

### Search Console
- [Search Console Training](https://support.google.com/webmasters/answer/9128668)

---

## 🐛 Troubleshooting

### Analytics Not Working?

#### Check 1: Environment Variables
```bash
# Ensure .env.local exists and has correct IDs
cat .env.local
```

#### Check 2: Production Mode
Analytics only loads in production. To test locally:
```bash
npm run build
npm start
```

#### Check 3: Browser Console
Open DevTools → Console → Look for errors

#### Check 4: Network Requests
DevTools → Network → Filter "gtag" or "collect"

#### Check 5: Ad Blockers
Disable ad blockers temporarily to test

### Common Issues

**Issue**: "GA4 shows no data"
- **Solution**: Wait 24-48 hours for initial data processing
- Check Realtime report for immediate verification

**Issue**: "GTM not firing tags"
- **Solution**: Check GTM Preview Mode (GTM → Preview)
- Verify triggers are set up correctly

**Issue**: "Clarity shows no recordings"
- **Solution**: Wait 1-2 hours for first recordings
- Ensure NEXT_PUBLIC_CLARITY_ID is correct

---

## 📞 Support

### Get Help
- **GA4 Help**: https://support.google.com/analytics
- **GTM Help**: https://support.google.com/tagmanager
- **Clarity Help**: https://learn.microsoft.com/en-us/clarity/
- **Search Console**: https://support.google.com/webmasters

---

## ✅ Setup Checklist

- [ ] Create Google Analytics 4 property
- [ ] Add GA4 Measurement ID to `.env.local`
- [ ] Verify GA4 data collection (Realtime report)
- [ ] Set up Google Tag Manager (optional)
- [ ] Set up Microsoft Clarity (optional)
- [ ] Add property to Google Search Console
- [ ] Verify Search Console ownership
- [ ] Submit sitemap to Search Console
- [ ] Set up conversion goals in GA4
- [ ] Configure traffic filters (exclude internal IPs)
- [ ] Test all tracking events
- [ ] Add cookie consent banner (if needed)
- [ ] Train team on reading analytics reports

---

## 🎉 You're All Set!

Your website now has **enterprise-grade analytics** to track:
- User behavior and engagement
- Traffic sources and conversion funnels
- Search engine performance
- Heatmaps and session recordings (if Clarity enabled)

Check your analytics dashboard daily to make data-driven decisions about your website and marketing efforts!
