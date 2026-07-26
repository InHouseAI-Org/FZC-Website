import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '../../lib/emailService';
import { trackContactSubmission } from '../../lib/analyticsTracking';
import { rateLimit, RateLimitPresets, getClientIp } from '../../lib/rateLimiter';
import { verifyTurnstileToken, shouldSkipCaptcha } from '../../lib/captchaVerification';
import { isHoneypotTriggered, validateEmail } from '../../lib/botProtection';

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting (stricter for contact forms)
    const rateLimitCheck = rateLimit(RateLimitPresets.CONTACT_FORM)(request);
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
    const { name, email, phone, company, enquiryType, message, captchaToken, honeypot } = body;

    // 2. Honeypot Check
    if (isHoneypotTriggered(honeypot)) {
      console.warn('Honeypot triggered for contact form', { email, name });
      // Return success to not alert the bot
      return NextResponse.json({ success: true, message: 'Thank you for contacting us!' }, { status: 200 });
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
    if (!name || !email || !message || !enquiryType) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: name, email, enquiryType, and message are required',
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

    // 6. Validate enquiry type
    const validEnquiryTypes = ['sales', 'technical', 'general', 'partnership'];
    if (!validEnquiryTypes.includes(enquiryType)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid enquiry type',
        },
        { status: 400 }
      );
    }

    // Track contact submission in database (don't wait for it)
    trackContactSubmission({
      name,
      email,
      phone,
      company,
      enquiryType,
      message,
      referrer: request.headers.get('referer') || undefined,
    }).catch(err => console.error('Failed to track contact submission:', err));

    // Send email
    try {
      await sendContactEmail({
        name,
        email,
        phone,
        company,
        enquiryType,
        message,
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Thank you for contacting us! We will get back to you shortly.',
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
    console.error('Contact form error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process contact form',
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
