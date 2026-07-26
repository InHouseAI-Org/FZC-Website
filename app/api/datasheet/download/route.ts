import { NextRequest, NextResponse } from 'next/server';
import { trackDatasheetDownload } from '../../../lib/analyticsTracking';
import { sendDatasheetNotification } from '../../../lib/emailService';
import { rateLimit, RateLimitPresets, getClientIp } from '../../../lib/rateLimiter';
import { verifyTurnstileToken, shouldSkipCaptcha } from '../../../lib/captchaVerification';
import { isHoneypotTriggered, validateEmail } from '../../../lib/botProtection';

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting
    const rateLimitCheck = rateLimit(RateLimitPresets.DATASHEET)(request);
    if (!rateLimitCheck.success) {
      return NextResponse.json(
        {
          success: false,
          message: rateLimitCheck.message,
          retryAfter: Math.ceil((rateLimitCheck.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitCheck.limit.toString(),
            'X-RateLimit-Remaining': rateLimitCheck.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitCheck.resetTime).toISOString(),
          },
        }
      );
    }

    const body = await request.json();
    const { email, productName, productSlug, datasheetUrl, captchaToken, honeypot } = body;

    // 2. Honeypot Check
    if (isHoneypotTriggered(honeypot)) {
      console.warn('Honeypot triggered for datasheet download', { email, productName });
      // Return success to not alert the bot
      return NextResponse.json({ success: true, message: 'Download tracked successfully' }, { status: 200 });
    }

    // 3. CAPTCHA Verification (if configured)
    if (!shouldSkipCaptcha()) {
      const captchaResult = await verifyTurnstileToken(captchaToken, getClientIp(request));
      if (!captchaResult.success) {
        return NextResponse.json(
          {
            success: false,
            message: captchaResult.message || 'CAPTCHA verification failed',
          },
          { status: 400 }
        );
      }
    }

    // 4. Field Validation
    if (!email || !productName || !productSlug || !datasheetUrl) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: email, productName, productSlug, and datasheetUrl are required',
        },
        { status: 400 }
      );
    }

    // 5. Email Validation (format + disposable domains)
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: emailValidation.reason || 'Invalid email address',
        },
        { status: 400 }
      );
    }

    // Track download in database (don't wait for it)
    trackDatasheetDownload({
      email,
      productName,
      productSlug,
      datasheetUrl,
      userAgent: request.headers.get('user-agent') || undefined,
      referrer: request.headers.get('referer') || undefined,
    }).catch(err => console.error('Failed to track datasheet download:', err));

    // Send notification email to techsupport@inmarco.ae (don't wait for it)
    sendDatasheetNotification({
      visitorEmail: email,
      productName,
      action: 'download',
    }).catch(err => console.error('Failed to send notification email:', err));

    return NextResponse.json(
      {
        success: true,
        message: 'Download tracked successfully',
        downloadUrl: datasheetUrl,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Datasheet download tracking error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process download request',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Optional: Handle OPTIONS for CORS if needed
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}
