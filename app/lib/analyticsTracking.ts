// Analytics tracking service - Store events in database
import prisma from './prisma';
import { headers } from 'next/headers';

// ============================================
// Helper Functions
// ============================================

/**
 * Get client IP address
 */
async function getClientIp(): Promise<string | undefined> {
  const headersList = await headers();
  return (
    headersList.get('x-forwarded-for')?.split(',')[0] ||
    headersList.get('x-real-ip') ||
    undefined
  );
}

/**
 * Get user agent string
 */
async function getUserAgent(): Promise<string | undefined> {
  const headersList = await headers();
  return headersList.get('user-agent') || undefined;
}

/**
 * Parse device type from user agent
 */
function getDeviceType(userAgent?: string): string {
  if (!userAgent) return 'Unknown';

  const ua = userAgent.toLowerCase();
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'Mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'Tablet';
  }
  return 'Desktop';
}

/**
 * Get or create visitor ID from cookie/generate new one
 */
async function getOrCreateVisitor(sessionId?: string): Promise<string> {
  // In production, you'd get this from a cookie
  // For now, generate a simple visitor ID based on IP + user agent
  const ipAddress = await getClientIp();
  const userAgent = await getUserAgent();
  const visitorId = `${ipAddress}-${userAgent ? userAgent.substring(0, 50) : 'unknown'}`;

  return visitorId;
}

// ============================================
// Page View Tracking
// ============================================

export async function trackPageView(data: {
  path: string;
  title?: string;
  referrer?: string;
  sessionId?: string;
  loadTime?: number;
}) {
  try {
    const ipAddress = await getClientIp();
    const userAgent = await getUserAgent();
    const device = getDeviceType(userAgent);
    const visitorId = await getOrCreateVisitor(data.sessionId);

    await prisma.pageView.create({
      data: {
        path: data.path,
        title: data.title,
        referrer: data.referrer,
        userAgent,
        ipAddress,
        device,
        sessionId: data.sessionId,
        visitorId,
        loadTime: data.loadTime,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error tracking page view:', error);
    return { success: false, error };
  }
}

// ============================================
// Product View Tracking
// ============================================

export async function trackProductView(data: {
  productId: string;
  productName: string;
  category: string;
  sessionId?: string;
  referrer?: string;
}) {
  try {
    const visitorId = await getOrCreateVisitor(data.sessionId);

    await prisma.productView.create({
      data: {
        productId: data.productId,
        productName: data.productName,
        category: data.category,
        sessionId: data.sessionId,
        visitorId,
        referrer: data.referrer,
      },
    });

    // Also create an analytics event
    await trackEvent({
      eventType: 'view_product',
      category: 'Product',
      action: 'view',
      label: `${data.category} - ${data.productName}`,
      sessionId: data.sessionId,
      metadata: { productId: data.productId },
    });

    return { success: true };
  } catch (error) {
    console.error('Error tracking product view:', error);
    return { success: false, error };
  }
}

// ============================================
// Industry View Tracking
// ============================================

export async function trackIndustryView(data: {
  industryId: string;
  industryName: string;
  sessionId?: string;
  referrer?: string;
}) {
  try {
    const visitorId = await getOrCreateVisitor(data.sessionId);

    await prisma.industryView.create({
      data: {
        industryId: data.industryId,
        industryName: data.industryName,
        sessionId: data.sessionId,
        visitorId,
        referrer: data.referrer,
      },
    });

    // Also create an analytics event
    await trackEvent({
      eventType: 'view_industry',
      category: 'Industry',
      action: 'view',
      label: data.industryName,
      sessionId: data.sessionId,
      metadata: { industryId: data.industryId },
    });

    return { success: true };
  } catch (error) {
    console.error('Error tracking industry view:', error);
    return { success: false, error };
  }
}

// ============================================
// Generic Event Tracking
// ============================================

export async function trackEvent(data: {
  eventType: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  sessionId?: string;
  metadata?: any;
}) {
  try {
    const ipAddress = await getClientIp();
    const userAgent = await getUserAgent();
    const visitorId = await getOrCreateVisitor(data.sessionId);

    await prisma.analyticsEvent.create({
      data: {
        eventType: data.eventType,
        category: data.category,
        action: data.action,
        label: data.label,
        value: data.value,
        metadata: data.metadata,
        sessionId: data.sessionId,
        visitorId,
        ipAddress,
        userAgent,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error tracking event:', error);
    return { success: false, error };
  }
}

// ============================================
// Contact Form Tracking
// ============================================

export async function trackContactSubmission(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  enquiryType: string;
  message: string;
  sessionId?: string;
  referrer?: string;
}) {
  try {
    const ipAddress = await getClientIp();
    const userAgent = await getUserAgent();

    await prisma.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        enquiryType: data.enquiryType,
        message: data.message,
        ipAddress,
        userAgent,
        referrer: data.referrer,
        sessionId: data.sessionId,
        status: 'new',
      },
    });

    // Also create an analytics event
    await trackEvent({
      eventType: 'contact_form',
      category: 'Contact',
      action: 'submit',
      label: data.enquiryType,
      sessionId: data.sessionId,
      metadata: { email: data.email },
    });

    return { success: true };
  } catch (error) {
    console.error('Error tracking contact submission:', error);
    return { success: false, error };
  }
}

// ============================================
// Download Tracking
// ============================================

export async function trackDownload(data: {
  fileType: string;
  fileName: string;
  productId?: string;
  sessionId?: string;
}) {
  try {
    const ipAddress = await getClientIp();
    const visitorId = await getOrCreateVisitor(data.sessionId);

    await prisma.downloadEvent.create({
      data: {
        fileType: data.fileType,
        fileName: data.fileName,
        productId: data.productId,
        sessionId: data.sessionId,
        visitorId,
        ipAddress,
      },
    });

    // Also create an analytics event
    await trackEvent({
      eventType: 'download',
      category: 'Download',
      action: data.fileType,
      label: data.fileName,
      sessionId: data.sessionId,
      metadata: { productId: data.productId },
    });

    return { success: true };
  } catch (error) {
    console.error('Error tracking download:', error);
    return { success: false, error };
  }
}

// ============================================
// Datasheet Download Tracking
// ============================================

export async function trackDatasheetDownload(data: {
  email: string;
  productName: string;
  productSlug: string;
  datasheetUrl: string;
  sessionId?: string;
  userAgent?: string;
  referrer?: string;
}) {
  try {
    const ipAddress = await getClientIp();
    const visitorId = await getOrCreateVisitor(data.sessionId);

    await prisma.datasheetDownload.create({
      data: {
        email: data.email,
        productName: data.productName,
        productSlug: data.productSlug,
        datasheetUrl: data.datasheetUrl,
        sessionId: data.sessionId,
        visitorId,
        ipAddress,
        userAgent: data.userAgent,
        referrer: data.referrer,
      },
    });

    // Also create an analytics event
    await trackEvent({
      eventType: 'datasheet_download',
      category: 'Datasheet',
      action: 'download',
      label: data.productName,
      sessionId: data.sessionId,
      metadata: {
        email: data.email,
        productSlug: data.productSlug,
        datasheetUrl: data.datasheetUrl,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error tracking datasheet download:', error);
    return { success: false, error };
  }
}

// ============================================
// Datasheet Share Tracking
// ============================================

export async function trackDatasheetShare(data: {
  senderEmail?: string;
  recipientEmail: string;
  productName: string;
  productSlug: string;
  datasheetUrl: string;
  sessionId?: string;
  userAgent?: string;
  referrer?: string;
}) {
  try {
    const ipAddress = await getClientIp();
    const visitorId = await getOrCreateVisitor(data.sessionId);

    await prisma.datasheetShare.create({
      data: {
        senderEmail: data.senderEmail,
        recipientEmail: data.recipientEmail,
        productName: data.productName,
        productSlug: data.productSlug,
        datasheetUrl: data.datasheetUrl,
        sessionId: data.sessionId,
        visitorId,
        ipAddress,
        userAgent: data.userAgent,
        referrer: data.referrer,
      },
    });

    // Also create an analytics event
    await trackEvent({
      eventType: 'datasheet_share',
      category: 'Datasheet',
      action: 'share',
      label: data.productName,
      sessionId: data.sessionId,
      metadata: {
        senderEmail: data.senderEmail,
        recipientEmail: data.recipientEmail,
        productSlug: data.productSlug,
        datasheetUrl: data.datasheetUrl,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error tracking datasheet share:', error);
    return { success: false, error };
  }
}

// ============================================
// Session Management
// ============================================

export async function updateVisitorSession(data: {
  sessionId: string;
  visitorId: string;
  endTime?: Date;
  duration?: number;
  pageViews?: number;
  events?: number;
  exitPage?: string;
}) {
  try {
    await prisma.visitorSession.upsert({
      where: { sessionId: data.sessionId },
      update: {
        endTime: data.endTime,
        duration: data.duration,
        pageViews: data.pageViews,
        events: data.events,
        exitPage: data.exitPage,
      },
      create: {
        sessionId: data.sessionId,
        visitorId: data.visitorId,
        pageViews: data.pageViews || 1,
        events: data.events || 0,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating visitor session:', error);
    return { success: false, error };
  }
}
