/**
 * Rate Limiter for API Routes
 * Implements IP-based rate limiting to prevent abuse
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (consider Redis for production with multiple servers)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the time window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
  /** Optional message to return when rate limit is exceeded */
  message?: string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  message?: string;
}

/**
 * Get client IP address from request
 */
export function getClientIp(request: Request): string {
  // Check various headers for IP address (in order of preference)
  const headers = request.headers;

  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback to a default value
  return 'unknown';
}

/**
 * Check if request should be rate limited
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // If no entry exists or time window has passed, create new entry
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    });

    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }

  // Check if limit is exceeded
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      resetTime: entry.resetTime,
      message: config.message || 'Too many requests. Please try again later.',
    };
  }

  // Increment counter
  entry.count++;

  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Rate limit middleware for API routes
 */
export function rateLimit(config: RateLimitConfig) {
  return (request: Request): RateLimitResult => {
    const identifier = getClientIp(request);
    return checkRateLimit(identifier, config);
  };
}

/**
 * Preset rate limit configurations
 */
export const RateLimitPresets = {
  /** Very strict: 3 requests per minute */
  STRICT: {
    maxRequests: 3,
    windowMs: 60 * 1000,
    message: 'Too many requests. Please wait 1 minute before trying again.',
  },
  /** Standard: 10 requests per minute */
  STANDARD: {
    maxRequests: 10,
    windowMs: 60 * 1000,
    message: 'Too many requests. Please wait before trying again.',
  },
  /** Lenient: 30 requests per minute */
  LENIENT: {
    maxRequests: 30,
    windowMs: 60 * 1000,
    message: 'Too many requests. Please slow down.',
  },
  /** Contact form: 5 submissions per hour */
  CONTACT_FORM: {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000,
    message: 'You have submitted too many contact forms. Please try again in 1 hour.',
  },
  /** Datasheet: 10 downloads per hour */
  DATASHEET: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000,
    message: 'You have requested too many datasheets. Please try again later.',
  },
};
