# Bot Protection Setup Guide

Your website now has comprehensive bot protection for all datasheet and contact form submissions. This guide will help you configure and test the protection.

## 🛡️ Protection Layers Implemented

1. **Rate Limiting** - Limits requests per IP address
2. **Cloudflare Turnstile CAPTCHA** - Prevents automated bot submissions
3. **Honeypot Fields** - Catches simple bots that auto-fill forms
4. **Disposable Email Blocking** - Blocks temporary/throwaway email addresses
5. **Enhanced Email Validation** - Validates email format and blocks suspicious patterns

## 📋 Setup Instructions

### Step 1: Configure Cloudflare Turnstile (Recommended)

Cloudflare Turnstile is a free, privacy-friendly CAPTCHA alternative:

1. **Sign up for Cloudflare Turnstile**
   - Go to https://dash.cloudflare.com/
   - Navigate to "Turnstile" in the sidebar
   - Click "Add site"

2. **Create a new site**
   - Enter your domain name
   - Choose widget mode: "Managed" (recommended)
   - Click "Create"

3. **Get your keys**
   - Copy the **Site Key** (public key)
   - Copy the **Secret Key** (private key)

4. **Add keys to your environment variables**

   Create or update your `.env.local` file:
   ```bash
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key_here
   TURNSTILE_SECRET_KEY=your_secret_key_here
   ```

   For production (Vercel), add these as environment variables in your project settings.

### Step 2: Test CAPTCHA on Localhost (Development)

Cloudflare provides test keys that work on any domain including localhost:

Add to your `.env.local`:
```bash
# Cloudflare test keys (work on localhost)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

These test keys:
- ✅ Work on localhost and any domain
- ✅ Always pass validation
- ✅ Show a real CAPTCHA widget
- ⚠️ Should NOT be used in production

**Alternative:** Skip CAPTCHA entirely in development:
```bash
SKIP_CAPTCHA_VERIFICATION=true
```

### Step 3: Deploy to Production

1. **Add environment variables to Vercel/your hosting platform:**
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (from Cloudflare)
   - `TURNSTILE_SECRET_KEY` (from Cloudflare)

2. **Redeploy your application**

## 🧪 Testing the Protection

### Test Rate Limiting

1. Try to download/share datasheets more than 10 times in an hour from the same IP
2. You should get a "Too many requests" error with retry information

### Test Honeypot

The honeypot field is invisible to users but visible to bots. It's automatically working.

### Test Email Validation

Try submitting with:
- Invalid email format: `notanemail`
- Disposable email: `test@mailinator.com`
- Test email: `test@test.com`

All should be rejected.

### Test CAPTCHA (if configured)

1. Open datasheet download/share modal
2. You should see the Cloudflare Turnstile widget
3. Complete the challenge
4. Submit the form

## 📊 Rate Limit Configuration

Current limits (can be adjusted in `app/lib/rateLimiter.ts`):

- **Datasheet Requests**: 10 per hour per IP
- **Contact Form**: 5 per hour per IP

To adjust limits, modify the presets in `RateLimitPresets`:

```typescript
DATASHEET: {
  maxRequests: 10,    // Change this number
  windowMs: 60 * 60 * 1000,  // 1 hour in milliseconds
}
```

## 🚨 Monitoring Bot Attacks

### Check Server Logs

Bot attempts are logged with warnings:
```bash
# Look for these log messages:
"Honeypot triggered for datasheet download"
"Honeypot triggered for contact form"
"Turnstile verification failed"
```

### Rate Limit Headers

When rate limiting is active, responses include these headers:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: When the limit resets

## 🔧 Troubleshooting

### CAPTCHA Not Showing

1. Check that `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set
2. Verify the site key is correct
3. Check browser console for errors
4. Make sure your domain is added to Turnstile site configuration

### False Positives (Blocking Real Users)

If legitimate users are being blocked:

1. **Rate limits too strict?** - Increase limits in `rateLimiter.ts`
2. **Email validation too strict?** - Adjust patterns in `botProtection.ts`
3. **Add custom disposable domains** - Some corporate emails might be flagged

### Production vs Development

- Development mode skips CAPTCHA by default
- Production requires CAPTCHA if configured
- Use `SKIP_CAPTCHA_VERIFICATION=true` to disable in production (not recommended)

## 📝 Files Modified

### New Files Created:
- `app/lib/rateLimiter.ts` - Rate limiting logic
- `app/lib/captchaVerification.ts` - CAPTCHA verification
- `app/lib/botProtection.ts` - Email validation & honeypot

### Files Updated:
- `app/api/datasheet/download/route.ts` - Added bot protection
- `app/api/datasheet/share/route.ts` - Added bot protection
- `app/api/contact/route.ts` - Added bot protection
- `src/app/components/EmailModal.tsx` - Added CAPTCHA & honeypot
- `src/app/pages/ProductDetail.tsx` - Pass CAPTCHA tokens

## 🎯 Additional Recommendations

### 1. Monitor Analytics

Track bot submission attempts in your analytics to understand attack patterns.

### 2. IP Blocking

For persistent attackers, consider implementing IP blocking at the infrastructure level (Cloudflare, nginx, etc.).

### 3. Email Verification

Consider adding email verification links for high-value actions.

### 4. Add More Disposable Domains

Update the list in `botProtection.ts` as you discover new disposable email services.

### 5. Implement Request Signing

For API endpoints, consider implementing request signing to prevent direct API calls.

## 💡 Advanced Configuration

### Custom Rate Limits Per Endpoint

```typescript
// In your API route
const customLimit = rateLimit({
  maxRequests: 5,
  windowMs: 5 * 60 * 1000, // 5 minutes
  message: 'Custom rate limit message'
});
```

### Add Custom Disposable Email Domains

```typescript
import { addDisposableDomains } from '@/lib/botProtection';

addDisposableDomains([
  'example-spam.com',
  'temp-emails.org'
]);
```

### Customize Honeypot Field Names

Edit `EmailModal.tsx` to use different field names to avoid detection:
```typescript
<input
  type="text"
  id="company_name"  // Change this
  name="company_name"  // And this
  value={honeypot}
  onChange={(e) => setHoneypot(e.target.value)}
/>
```

## 📞 Support

If you encounter issues or need help:
1. Check server logs for error messages
2. Verify environment variables are set correctly
3. Test in development mode first
4. Review Cloudflare Turnstile dashboard for CAPTCHA statistics

## 🔒 Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Rotate keys regularly** if you suspect compromise
3. **Monitor logs** for unusual patterns
4. **Keep rate limits reasonable** to not block legitimate users
5. **Test thoroughly** before deploying to production

---

**Implementation Complete** ✅

Your site now has enterprise-grade bot protection. Legitimate users will have a smooth experience, while bots will be blocked at multiple layers.
