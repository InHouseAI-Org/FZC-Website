/**
 * Bot Protection Utilities
 * Includes honeypot validation and disposable email detection
 */

/**
 * Honeypot field validation
 * Bots typically fill in all fields including hidden honeypot fields
 *
 * @param honeypotValue - Value from the honeypot field
 * @returns true if request appears to be from a bot
 */
export function isHoneypotTriggered(honeypotValue: any): boolean {
  // If honeypot field has any value, it's likely a bot
  return honeypotValue !== undefined && honeypotValue !== '' && honeypotValue !== null;
}

/**
 * Common disposable/temporary email domains
 * These are frequently used by bots and spammers
 */
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  // Common disposable email services
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  'throwawaymail.com',
  'getnada.com',
  'maildrop.cc',
  'trashmail.com',
  'yopmail.com',
  'fakeinbox.com',
  'sharklasers.com',
  'guerrillamail.info',
  'grr.la',
  'guerrillamail.biz',
  'guerrillamail.de',
  'spam4.me',
  'mailnesia.com',
  'mintemail.com',
  'mytemp.email',
  'tempmail.net',
  'dispostable.com',
  'mohmal.com',
  'emailondeck.com',
  'ezehe.com',
  'trash-mail.com',
  'tempr.email',
  'getairmail.com',
  'temp-mail.io',
  'moakt.com',
  'tempinbox.com',
  'receiveee.com',
  'fakemail.net',
  'throwam.com',
  'mailtemp.net',
  'mytrashmail.com',
  'bofthew.com',
  'spamgourmet.com',
  'h8s.org',
  'tmails.net',
  'inboxbear.com',
  'mailbox92.com',
  'emailtemporaire.com',
  'correotemporal.org',
  'disposablemail.com',
  'emltmp.com',
  'tmail.com',
  'bugmenot.com',
  'jetable.org',
  'nobulk.com',
  'mailcatch.com',
  'spambox.us',
  'spaml.com',
  'safetymail.info',
  'spamfree24.org',
  'zippymail.info',
  'emailias.com',
  'fleckens.hu',
  'dacoolest.com',
  'spamcowboy.com',
  'dodgit.com',
  'e4ward.com',
  'enterto.com',
  'ephemail.net',
  'kasmail.com',
  'oshietechan.link',
  'pookmail.com',
  'sogetthis.com',
  'spamex.com',
  'spamobox.com',
  'spamstack.net',
  'spamthisplease.com',
  'thisisnotmyrealemail.com',
  'uroid.com',
  'viditag.com',
  'vomoto.com',
  'vpn.st',
  'vubby.com',
  'vsimcard.com',
  'wasteland.rfc822.org',
  'wetrainbayarea.com',
  'wetrainbayarea.org',
  'wh4f.org',
  'whatiaas.com',
  'whyspam.me',
  'willselfdestruct.com',
  'winemaven.info',
  'wronghead.com',
  'wuzup.net',
  'xoxy.net',
  'yep.it',
  'yogamaven.com',
  'zehnminutenmail.de',
  'zetmail.com',
  'zip.net',
  'zoaxe.com',
  'zumpul.com',
]);

/**
 * Check if email domain is a known disposable email service
 * @param email - Email address to check
 * @returns true if email is from a disposable domain
 */
export function isDisposableEmail(email: string): boolean {
  try {
    const domain = email.toLowerCase().split('@')[1];
    if (!domain) return false;

    return DISPOSABLE_EMAIL_DOMAINS.has(domain);
  } catch {
    return false;
  }
}

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns true if email format is valid
 */
export function isValidEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Comprehensive email validation
 * Checks format, disposable domains, and suspicious patterns
 */
export interface EmailValidationResult {
  isValid: boolean;
  reason?: string;
}

export function validateEmail(email: string): EmailValidationResult {
  // Check if email is provided
  if (!email || typeof email !== 'string') {
    return { isValid: false, reason: 'Email is required' };
  }

  // Check email format
  if (!isValidEmailFormat(email)) {
    return { isValid: false, reason: 'Invalid email format' };
  }

  // Check for disposable email
  if (isDisposableEmail(email)) {
    return {
      isValid: false,
      reason: 'Disposable email addresses are not allowed. Please use a permanent email address.',
    };
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /test@/i,
    /fake@/i,
    /spam@/i,
    /noreply@/i,
    /abuse@/i,
    /^[a-z]{1,2}@/i, // Very short local part (e.g., a@domain.com)
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(email)) {
      return {
        isValid: false,
        reason: 'This email address appears to be invalid. Please use a real email address.',
      };
    }
  }

  return { isValid: true };
}

/**
 * Check if request timing is suspicious
 * Bots typically submit forms very quickly
 *
 * @param formLoadTime - Timestamp when form was loaded
 * @param submitTime - Timestamp when form was submitted
 * @param minTimeMs - Minimum expected time to fill form (default 3 seconds)
 * @returns true if submission was suspiciously fast
 */
export function isSuspiciouslyFastSubmission(
  formLoadTime: number,
  submitTime: number,
  minTimeMs: number = 3000
): boolean {
  const timeSpent = submitTime - formLoadTime;
  return timeSpent < minTimeMs;
}

/**
 * Add custom disposable domains
 * Useful for blocking specific domains you've identified as problematic
 */
export function addDisposableDomains(domains: string[]): void {
  domains.forEach(domain => DISPOSABLE_EMAIL_DOMAINS.add(domain.toLowerCase()));
}
