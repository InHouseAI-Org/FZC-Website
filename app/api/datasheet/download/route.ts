import { NextRequest, NextResponse } from 'next/server';
import { trackDatasheetDownload } from '../../../lib/analyticsTracking';
import { sendDatasheetNotification } from '../../../lib/emailService';
import { rateLimit, RateLimitPresets, getClientIp } from '../../../lib/rateLimiter';
import { verifyTurnstileToken, shouldSkipCaptcha } from '../../../lib/captchaVerification';
import { isHoneypotTriggered, validateEmail } from '../../../lib/botProtection';
import prisma from '../../../lib/prisma';

// Email-based rate limiting: 10 downloads per email per 24 hours
async function checkEmailRateLimit(email: string) {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  try {
    const downloadCount = await prisma.datasheetDownload.count({
      where: {
        email: email.toLowerCase(),
        createdAt: {
          gte: twentyFourHoursAgo,
        },
      },
    });

    const limit = 10;
    const remaining = Math.max(0, limit - downloadCount);
    const resetTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

    return {
      success: downloadCount < limit,
      count: downloadCount,
      limit,
      remaining,
      resetTime,
      message: downloadCount >= limit
        ? 'You have reached the maximum number of datasheet downloads (10) for this email in 24 hours. Please try again later or use a different email address.'
        : undefined,
    };
  } catch (error) {
    console.error('Error checking email rate limit:', error);
    // On error, allow the request to proceed (fail open)
    return {
      success: true,
      count: 0,
      limit: 10,
      remaining: 10,
      resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
  }
}

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

    // 6. Email-based Rate Limiting (10 downloads per email per 24 hours)
    const emailRateLimitCheck = await checkEmailRateLimit(email);
    if (!emailRateLimitCheck.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailRateLimitCheck.message,
          limit: emailRateLimitCheck.limit,
          remaining: emailRateLimitCheck.remaining,
          resetTime: emailRateLimitCheck.resetTime.toISOString(),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit-Email': emailRateLimitCheck.limit.toString(),
            'X-RateLimit-Remaining-Email': emailRateLimitCheck.remaining.toString(),
            'X-RateLimit-Reset-Email': emailRateLimitCheck.resetTime.toISOString(),
          },
        }
      );
    }

    // Track download in database (MUST await to prevent race conditions)
    // This ensures the count is updated before the next request can check the limit
    try {
      await trackDatasheetDownload({
        email,
        productName,
        productSlug,
        datasheetUrl,
        userAgent: request.headers.get('user-agent') || undefined,
        referrer: request.headers.get('referer') || undefined,
      });
    } catch (err) {
      console.error('Failed to track datasheet download:', err);
      // Continue anyway - tracking failure shouldn't block the download
    }

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
