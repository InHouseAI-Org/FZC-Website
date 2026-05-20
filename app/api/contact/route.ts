import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '../../lib/emailService';
import { trackContactSubmission } from '../../lib/analyticsTracking';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, enquiryType, message } = body;

    // Validation
    if (!name || !email || !message || !enquiryType) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: name, email, enquiryType, and message are required',
        },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email address',
        },
        { status: 400 }
      );
    }

    // Validate enquiry type
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
