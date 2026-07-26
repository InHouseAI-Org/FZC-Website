/**
 * Cloudflare Turnstile CAPTCHA Verification
 *
 * Setup Instructions:
 * 1. Sign up for Cloudflare Turnstile at https://dash.cloudflare.com/
 * 2. Create a new site and get your site key and secret key
 * 3. Add to your .env.local file:
 *    NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key_here
 *    TURNSTILE_SECRET_KEY=your_secret_key_here
 */

export interface TurnstileVerificationResult {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

/**
 * Verify Cloudflare Turnstile CAPTCHA token
 * @param token - The token from the Turnstile widget
 * @param remoteIp - Optional IP address of the client
 * @returns Promise with verification result
 */
export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string
): Promise<{ success: boolean; message?: string }> {
  // Check if Turnstile is configured
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.warn('Turnstile secret key not configured. Skipping CAPTCHA verification.');
    // In production, you should fail closed (return false) if CAPTCHA is not configured
    // For now, we'll allow requests through but log a warning
    return { success: true };
  }

  if (!token) {
    return {
      success: false,
      message: 'CAPTCHA token is required',
    };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);

    if (remoteIp) {
      formData.append('remoteip', remoteIp);
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data: TurnstileVerificationResult = await response.json();

    if (!data.success) {
      console.error('Turnstile verification failed:', data['error-codes']);
      return {
        success: false,
        message: 'CAPTCHA verification failed. Please try again.',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return {
      success: false,
      message: 'CAPTCHA verification error. Please try again.',
    };
  }
}

/**
 * Check if CAPTCHA verification should be skipped
 * (useful for development or testing)
 */
export function shouldSkipCaptcha(): boolean {
  return process.env.SKIP_CAPTCHA_VERIFICATION === 'true' ||
         process.env.NODE_ENV === 'development';
}
