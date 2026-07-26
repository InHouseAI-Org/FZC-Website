import { NextRequest, NextResponse } from 'next/server';
import { sendDatasheetEmail, sendDatasheetNotification } from '../../../lib/emailService';
import { trackDatasheetShare } from '../../../lib/analyticsTracking';
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
    const { recipientEmail, senderEmail, productName, productSlug, datasheetUrl, captchaToken, honeypot } = body;

    // 2. Honeypot Check
    if (isHoneypotTriggered(honeypot)) {
      console.warn('Honeypot triggered for datasheet share', { recipientEmail, productName });
      // Return success to not alert the bot
      return NextResponse.json({ success: true, message: 'Datasheet shared successfully!' }, { status: 200 });
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
    if (!recipientEmail || !productName || !productSlug || !datasheetUrl) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: recipientEmail, productName, productSlug, and datasheetUrl are required',
        },
        { status: 400 }
      );
    }

    // 5. Email Validation (format + disposable domains)
    const recipientValidation = validateEmail(recipientEmail);
    if (!recipientValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: recipientValidation.reason || 'Invalid recipient email address',
        },
        { status: 400 }
      );
    }

    if (senderEmail) {
      const senderValidation = validateEmail(senderEmail);
      if (!senderValidation.isValid) {
        return NextResponse.json(
          {
            success: false,
            message: senderValidation.reason || 'Invalid sender email address',
          },
          { status: 400 }
        );
      }
    }

    // Track share in database (don't wait for it)
    trackDatasheetShare({
      senderEmail,
      recipientEmail,
      productName,
      productSlug,
      datasheetUrl,
      userAgent: request.headers.get('user-agent') || undefined,
      referrer: request.headers.get('referer') || undefined,
    }).catch(err => console.error('Failed to track datasheet share:', err));

    // Send datasheet email
    try {
      await sendDatasheetEmail({
        recipientEmail,
        senderEmail,
        productName,
        productSlug,
        datasheetUrl,
      });

      // Send notification email to techsupport@inmarco.ae (don't wait for it)
      sendDatasheetNotification({
        visitorEmail: recipientEmail,
        productName,
        action: 'share',
      }).catch(err => console.error('Failed to send notification email:', err));

      return NextResponse.json(
        {
          success: true,
          message: 'Datasheet shared successfully! The recipient will receive an email shortly.',
        },
        { status: 200 }
      );
    } catch (emailError: any) {
      console.error('Email sending error:', emailError);

      // Check if it's an Azure configuration error
      if (emailError.message?.includes('Azure credentials not configured')) {
        return NextResponse.json(
          {
            success: false,
            message: 'Email service is not configured. Please contact the administrator.',
            error: 'Email configuration error',
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to send email. Please try again later or contact us directly.',
          error: emailError.message,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Datasheet share error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process share request',
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
