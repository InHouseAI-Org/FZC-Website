// Analytics data utilities - Fetch real data from database
import prisma from './prisma';

export interface AnalyticsData {
  pageViews: {
    total: number;
    trend: number;
    data: { date: string; views: number }[];
  };
  uniqueVisitors: {
    total: number;
    trend: number;
    data: { date: string; visitors: number }[];
  };
  topPages: {
    path: string;
    views: number;
    percentage: number;
  }[];
  topProducts: {
    name: string;
    views: number;
    percentage: number;
  }[];
  topIndustries: {
    name: string;
    views: number;
    percentage: number;
  }[];
  geographicData: {
    country: string;
    visitors: number;
    percentage: number;
  }[];
  deviceData: {
    device: string;
    visitors: number;
    percentage: number;
  }[];
  trafficSources: {
    source: string;
    visitors: number;
    percentage: number;
  }[];
  conversionMetrics: {
    contactForms: number;
    quoteRequests: number;
    productInquiries: number;
    downloads: number;
  };
  performanceMetrics: {
    avgLoadTime: number;
    bounceRate: number;
    avgSessionDuration: number;
    pagesPerSession: number;
  };
}

// ============================================
// Helper Functions
// ============================================

function getDaysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function calculateTrend(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

// ============================================
// Analytics Data Fetcher
// ============================================

export async function getAnalyticsData(days: number = 30): Promise<AnalyticsData> {
  try {
    const startDate = getDaysAgo(days);
    const previousStartDate = getDaysAgo(days * 2);
    const previousEndDate = getDaysAgo(days);

    // ====== PAGE VIEWS ======
    const pageViewsData = await getPageViewsData(startDate, days);

    // ====== UNIQUE VISITORS ======
    const uniqueVisitorsData = await getUniqueVisitorsData(startDate, days);

    // ====== TOP PAGES ======
    const topPages = await getTopPages(startDate);

    // ====== TOP PRODUCTS ======
    const topProducts = await getTopProducts(startDate);

    // ====== TOP INDUSTRIES ======
    const topIndustries = await getTopIndustries(startDate);

    // ====== GEOGRAPHIC DATA ======
    const geographicData = await getGeographicData(startDate);

    // ====== DEVICE DATA ======
    const deviceData = await getDeviceData(startDate);

    // ====== TRAFFIC SOURCES ======
    const trafficSources = await getTrafficSources(startDate);

    // ====== CONVERSION METRICS ======
    const conversionMetrics = await getConversionMetrics(startDate);

    // ====== PERFORMANCE METRICS ======
    const performanceMetrics = await getPerformanceMetrics(startDate);

    return {
      pageViews: pageViewsData,
      uniqueVisitors: uniqueVisitorsData,
      topPages,
      topProducts,
      topIndustries,
      geographicData,
      deviceData,
      trafficSources,
      conversionMetrics,
      performanceMetrics,
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
}

// ============================================
// Individual Data Fetchers
// ============================================

async function getPageViewsData(startDate: Date, days: number) {
  const currentPeriodViews = await prisma.pageView.count({
    where: {
      createdAt: { gte: startDate },
    },
  });

  const previousStartDate = getDaysAgo(days * 2);
  const previousEndDate = getDaysAgo(days);
  const previousPeriodViews = await prisma.pageView.count({
    where: {
      createdAt: {
        gte: previousStartDate,
        lt: previousEndDate,
      },
    },
  });

  const trend = calculateTrend(currentPeriodViews, previousPeriodViews);

  // Get daily page views
  const dailyData = await prisma.$queryRaw<{ date: Date; count: bigint }[]>`
    SELECT DATE(created_at) as date, COUNT(*)::int as count
    FROM page_views
    WHERE created_at >= ${startDate}
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `;

  const data = Array.from({ length: days }, (_, i) => {
    const date = getDaysAgo(days - 1 - i);
    const dateStr = formatDate(date);
    const dayData = dailyData.find(d => formatDate(new Date(d.date)) === dateStr);
    return {
      date: dateStr,
      views: dayData ? Number(dayData.count) : 0,
    };
  });

  return {
    total: currentPeriodViews,
    trend,
    data,
  };
}

async function getUniqueVisitorsData(startDate: Date, days: number) {
  const currentPeriodVisitors = await prisma.pageView.groupBy({
    by: ['visitorId'],
    where: {
      createdAt: { gte: startDate },
      visitorId: { not: null },
    },
  });

  const previousStartDate = getDaysAgo(days * 2);
  const previousEndDate = getDaysAgo(days);
  const previousPeriodVisitors = await prisma.pageView.groupBy({
    by: ['visitorId'],
    where: {
      createdAt: {
        gte: previousStartDate,
        lt: previousEndDate,
      },
      visitorId: { not: null },
    },
  });

  const currentCount = currentPeriodVisitors.length;
  const previousCount = previousPeriodVisitors.length;
  const trend = calculateTrend(currentCount, previousCount);

  // Get daily unique visitors
  const dailyData = await prisma.$queryRaw<{ date: Date; count: bigint }[]>`
    SELECT DATE(created_at) as date, COUNT(DISTINCT visitor_id)::int as count
    FROM page_views
    WHERE created_at >= ${startDate} AND visitor_id IS NOT NULL
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `;

  const data = Array.from({ length: days }, (_, i) => {
    const date = getDaysAgo(days - 1 - i);
    const dateStr = formatDate(date);
    const dayData = dailyData.find(d => formatDate(new Date(d.date)) === dateStr);
    return {
      date: dateStr,
      visitors: dayData ? Number(dayData.count) : 0,
    };
  });

  return {
    total: currentCount,
    trend,
    data,
  };
}

async function getTopPages(startDate: Date) {
  const pageViews = await prisma.pageView.groupBy({
    by: ['path'],
    where: {
      createdAt: { gte: startDate },
    },
    _count: true,
    orderBy: {
      _count: {
        path: 'desc',
      },
    },
    take: 8,
  });

  const totalViews = await prisma.pageView.count({
    where: { createdAt: { gte: startDate } },
  });

  return pageViews.map(p => ({
    path: p.path,
    views: p._count,
    percentage: totalViews > 0 ? (p._count / totalViews) * 100 : 0,
  }));
}

async function getTopProducts(startDate: Date) {
  const productViews = await prisma.productView.groupBy({
    by: ['productName', 'category'],
    where: {
      createdAt: { gte: startDate },
    },
    _count: true,
    orderBy: {
      _count: {
        productName: 'desc',
      },
    },
    take: 7,
  });

  const totalViews = await prisma.productView.count({
    where: { createdAt: { gte: startDate } },
  });

  return productViews.map(p => ({
    name: p.productName,
    views: p._count,
    percentage: totalViews > 0 ? (p._count / totalViews) * 100 : 0,
  }));
}

async function getTopIndustries(startDate: Date) {
  const industryViews = await prisma.industryView.groupBy({
    by: ['industryName'],
    where: {
      createdAt: { gte: startDate },
    },
    _count: true,
    orderBy: {
      _count: {
        industryName: 'desc',
      },
    },
    take: 7,
  });

  const totalViews = await prisma.industryView.count({
    where: { createdAt: { gte: startDate } },
  });

  return industryViews.map(i => ({
    name: i.industryName,
    views: i._count,
    percentage: totalViews > 0 ? (i._count / totalViews) * 100 : 0,
  }));
}

async function getGeographicData(startDate: Date) {
  const countryData = await prisma.pageView.groupBy({
    by: ['country'],
    where: {
      createdAt: { gte: startDate },
      country: { not: null },
    },
    _count: true,
    orderBy: {
      _count: {
        country: 'desc',
      },
    },
    take: 10,
  });

  const totalVisitors = countryData.reduce((sum, c) => sum + c._count, 0);

  return countryData.map(c => ({
    country: c.country || 'Unknown',
    visitors: c._count,
    percentage: totalVisitors > 0 ? (c._count / totalVisitors) * 100 : 0,
  }));
}

async function getDeviceData(startDate: Date) {
  const deviceData = await prisma.pageView.groupBy({
    by: ['device'],
    where: {
      createdAt: { gte: startDate },
      device: { not: null },
    },
    _count: true,
  });

  const totalVisitors = deviceData.reduce((sum, d) => sum + d._count, 0);

  return deviceData.map(d => ({
    device: d.device || 'Unknown',
    visitors: d._count,
    percentage: totalVisitors > 0 ? (d._count / totalVisitors) * 100 : 0,
  }));
}

async function getTrafficSources(startDate: Date) {
  const referrerData = await prisma.pageView.groupBy({
    by: ['referrer'],
    where: {
      createdAt: { gte: startDate },
      referrer: { not: null },
    },
    _count: true,
    orderBy: {
      _count: {
        referrer: 'desc',
      },
    },
    take: 5,
  });

  const totalVisitors = referrerData.reduce((sum, r) => sum + r._count, 0);

  return referrerData.map(r => {
    let source = 'Direct';
    if (r.referrer) {
      if (r.referrer.includes('google')) source = 'Organic Search';
      else if (r.referrer.includes('facebook') || r.referrer.includes('linkedin')) source = 'Social Media';
      else source = 'Referral';
    }

    return {
      source,
      visitors: r._count,
      percentage: totalVisitors > 0 ? (r._count / totalVisitors) * 100 : 0,
    };
  });
}

async function getConversionMetrics(startDate: Date) {
  const contactForms = await prisma.contactSubmission.count({
    where: { createdAt: { gte: startDate } },
  });

  const quoteRequests = await prisma.contactSubmission.count({
    where: {
      createdAt: { gte: startDate },
      enquiryType: 'sales',
    },
  });

  const productInquiries = await prisma.analyticsEvent.count({
    where: {
      createdAt: { gte: startDate },
      eventType: 'view_product',
    },
  });

  const downloads = await prisma.downloadEvent.count({
    where: { createdAt: { gte: startDate } },
  });

  return {
    contactForms,
    quoteRequests,
    productInquiries,
    downloads,
  };
}

async function getPerformanceMetrics(startDate: Date) {
  // Average load time
  const pageViewsWithLoadTime = await prisma.pageView.aggregate({
    where: {
      createdAt: { gte: startDate },
      loadTime: { not: null },
    },
    _avg: {
      loadTime: true,
    },
  });

  // Bounce rate (sessions with only 1 page view)
  const totalSessions = await prisma.visitorSession.count({
    where: { startTime: { gte: startDate } },
  });

  const bouncedSessions = await prisma.visitorSession.count({
    where: {
      startTime: { gte: startDate },
      pageViews: 1,
    },
  });

  const bounceRate = totalSessions > 0 ? (bouncedSessions / totalSessions) * 100 : 0;

  // Average session duration
  const avgDuration = await prisma.visitorSession.aggregate({
    where: {
      startTime: { gte: startDate },
      duration: { not: null },
    },
    _avg: {
      duration: true,
    },
  });

  // Pages per session
  const avgPageViews = await prisma.visitorSession.aggregate({
    where: { startTime: { gte: startDate } },
    _avg: {
      pageViews: true,
    },
  });

  return {
    avgLoadTime: pageViewsWithLoadTime._avg.loadTime || 0,
    bounceRate,
    avgSessionDuration: avgDuration._avg.duration || 0,
    pagesPerSession: avgPageViews._avg.pageViews || 0,
  };
}
