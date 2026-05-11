# Analytics Quick Start - 5 Minutes Setup

## 🚀 Get Analytics Running in 3 Steps

### Step 1: Get Your Google Analytics ID (2 minutes)
1. Go to https://analytics.google.com/
2. Create property → **Copy Measurement ID** (G-XXXXXXXXXX)

### Step 2: Add to Your Project (30 seconds)
Create `.env.local` file in project root:
```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Step 3: Deploy & Verify (2 minutes)
```bash
npm run build
npm start
```
Open your site → Check GA4 Realtime report → See yourself online!

---

## 📊 What You Get (FREE)

### Google Analytics 4
- ✅ Real-time visitor tracking
- ✅ Traffic sources (Google, LinkedIn, Direct)
- ✅ Popular pages and products
- ✅ User location and devices
- ✅ Session duration and engagement
- ✅ Custom events (form submits, downloads)

### Microsoft Clarity (Optional - FREE)
```bash
# Add to .env.local
NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx
```
- ✅ Heatmaps (where users click)
- ✅ Session recordings (watch real users)
- ✅ Rage click detection (user frustration)
- ✅ Mobile vs desktop behavior

---

## 🎯 Key Metrics to Check Daily

### Open GA4 → Reports → Realtime
- **Active Users**: Who's on your site right now
- **Traffic Sources**: Where they came from
- **Popular Pages**: What they're viewing

### Open GA4 → Reports → Acquisition
- **New vs Returning**: First-time vs repeat visitors
- **Channels**: Organic Search, Direct, Social, Email
- **Campaigns**: Which marketing works

### Open GA4 → Reports → Engagement
- **Pages and Screens**: Most popular pages
- **Average Engagement Time**: How long users stay
- **Events**: Form submits, downloads, clicks

---

## 🔥 Pre-Built Event Tracking

Your site **automatically tracks** these events:

### Product Views
```typescript
// Already integrated - no code needed!
// Tracks every product page visit
```

### Contact Form
```typescript
// Add to your contact form submit handler:
import { trackContactFormSubmit } from '@/app/lib/gtag';

const handleSubmit = () => {
  // ... your form logic
  trackContactFormSubmit();
};
```

### Download Tracking
```typescript
import { trackCatalogDownload } from '@/app/lib/gtag';

<button onClick={() => {
  trackCatalogDownload('Product Catalog 2025');
  // ... download logic
}}>
  Download Catalog
</button>
```

---

## 📈 Sample Dashboard View

After 1 week, you'll see:
```
Users:              1,234
Sessions:           2,456
Avg Session:        3m 45s
Bounce Rate:        42%
Top Page:           /products/compression-packings (456 views)
Top Source:         Google Organic (678 users)
Top Country:        United States (45%)
Mobile vs Desktop:  35% / 65%
```

---

## 🎓 Reports to Check Weekly

### Traffic Health
- **Acquisition → Traffic Acquisition**: Where users come from
- **Engagement → Pages**: What content performs best
- **Tech → Overview**: Mobile vs desktop trends

### Business Goals
- **Events → Conversions**: Form submissions, downloads
- **Engagement → Events**: Custom event tracking
- **User Attributes → Demographics**: User locations

---

## ⚡ Pro Tips

### 1. Set Up Goals (5 minutes)
GA4 → Admin → Events → Mark as Conversion:
- `submit_contact_form`
- `download_catalog`
- `view_product`

### 2. Exclude Your Office Traffic
GA4 → Admin → Data Filters → Add filter:
- Filter Name: "Exclude Office"
- IP Address: Your office IP

### 3. Weekly Email Reports
GA4 → Library → Create custom report → Schedule email

### 4. Mobile vs Desktop Insights
GA4 → Reports → Tech → Overview → Compare device categories

---

## 🔍 Troubleshooting One-Liners

```bash
# Check if analytics loads
# Open DevTools → Network → Filter "gtag"

# Test in production mode locally
npm run build && npm start

# Verify environment variable
echo $NEXT_PUBLIC_GA_ID

# Check .env.local exists
ls -la .env.local
```

---

## 📞 Quick Links

- **GA4 Dashboard**: https://analytics.google.com/
- **Microsoft Clarity**: https://clarity.microsoft.com/
- **Search Console**: https://search.google.com/search-console
- **Full Setup Guide**: See `ANALYTICS_SETUP_GUIDE.md`

---

## ✅ 5-Minute Checklist

- [ ] Create GA4 property (2 min)
- [ ] Add ID to `.env.local` (30 sec)
- [ ] Deploy to production (2 min)
- [ ] Check Realtime report (30 sec)
- [ ] **Done!** 🎉

You now have enterprise-grade analytics tracking!
