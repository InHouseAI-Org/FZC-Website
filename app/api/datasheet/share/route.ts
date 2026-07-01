import { NextRequest, NextResponse } from 'next/server';
import { sendDatasheetEmail } from '../../../lib/emailService';
import { trackDatasheetShare } from '../../../lib/analyticsTracking';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipientEmail, senderEmail, productName, productSlug, datasheetUrl } = body;

    // Validation
    if (!recipientEmail || !productName || !productSlug || !datasheetUrl) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: recipientEmail, productName, productSlug, and datasheetUrl are required',
        },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid recipient email address',
        },
        { status: 400 }
      );
    }

    if (senderEmail && !emailRegex.test(senderEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid sender email address',
        },
        { status: 400 }
      );
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
