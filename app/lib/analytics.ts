// Analytics data utilities
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

// Mock data generator - Replace with real analytics API
export async function getAnalyticsData(): Promise<AnalyticsData> {
  // This would typically fetch from Google Analytics API or your analytics database
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  return {
    pageViews: {
      total: 45678,
      trend: 12.5,
      data: last30Days.map((date, i) => ({
        date,
        views: Math.floor(1200 + Math.random() * 500 + i * 10),
      })),
    },
    uniqueVisitors: {
      total: 12345,
      trend: 8.3,
      data: last30Days.map((date, i) => ({
        date,
        visitors: Math.floor(300 + Math.random() * 150 + i * 5),
      })),
    },
    topPages: [
      { path: '/', views: 8234, percentage: 18 },
      { path: '/products', views: 6543, percentage: 14.3 },
      { path: '/products/compression-packings', views: 4321, percentage: 9.5 },
      { path: '/industries/oil-and-gas', views: 3456, percentage: 7.6 },
      { path: '/about-us', views: 2987, percentage: 6.5 },
      { path: '/contact', views: 2654, percentage: 5.8 },
      { path: '/products/metallic-gaskets', views: 2341, percentage: 5.1 },
      { path: '/industries/power-generation', views: 2123, percentage: 4.6 },
    ],
    topProducts: [
      { name: 'Ultra FE 1002 (Fugitive Emission)', views: 2345, percentage: 15.2 },
      { name: 'Spiral Wound Gaskets', views: 2123, percentage: 13.8 },
      { name: 'RTJ Gaskets (Ring Type Joint)', views: 1987, percentage: 12.9 },
      { name: 'HY 105 (PTFE Graphite Hybrid)', views: 1654, percentage: 10.7 },
      { name: 'Isolation Gasket Kits (API 6FB)', views: 1432, percentage: 9.3 },
      { name: 'PE 504 (PTFE Packing)', views: 1234, percentage: 8.0 },
      { name: 'Graphite Sheet Gaskets', views: 1098, percentage: 7.1 },
    ],
    topIndustries: [
      { name: 'Oil & Gas', views: 5432, percentage: 22.1 },
      { name: 'Power Generation', views: 4321, percentage: 17.6 },
      { name: 'Chemical Processing', views: 3654, percentage: 14.9 },
      { name: 'Marine', views: 2987, percentage: 12.2 },
      { name: 'Pharmaceutical', views: 2345, percentage: 9.5 },
      { name: 'Petrochemical', views: 2123, percentage: 8.6 },
      { name: 'Water Treatment', views: 1876, percentage: 7.6 },
    ],
    geographicData: [
      { country: 'United Arab Emirates', visitors: 2543, percentage: 20.6 },
      { country: 'Saudi Arabia', visitors: 1987, percentage: 16.1 },
      { country: 'India', visitors: 1654, percentage: 13.4 },
      { country: 'United States', visitors: 1432, percentage: 11.6 },
      { country: 'Qatar', visitors: 987, percentage: 8.0 },
      { country: 'Kuwait', visitors: 876, percentage: 7.1 },
      { country: 'Singapore', visitors: 765, percentage: 6.2 },
      { country: 'United Kingdom', visitors: 654, percentage: 5.3 },
      { country: 'Oman', visitors: 543, percentage: 4.4 },
      { country: 'Others', visitors: 904, percentage: 7.3 },
    ],
    deviceData: [
      { device: 'Desktop', visitors: 7407, percentage: 60 },
      { device: 'Mobile', visitors: 3704, percentage: 30 },
      { device: 'Tablet', visitors: 1234, percentage: 10 },
    ],
    trafficSources: [
      { source: 'Organic Search', visitors: 6173, percentage: 50 },
      { source: 'Direct', visitors: 2469, percentage: 20 },
      { source: 'Referral', visitors: 2469, percentage: 20 },
      { source: 'Social Media', visitors: 741, percentage: 6 },
      { source: 'Email', visitors: 493, percentage: 4 },
    ],
    conversionMetrics: {
      contactForms: 234,
      quoteRequests: 187,
      productInquiries: 432,
      downloads: 156,
    },
    performanceMetrics: {
      avgLoadTime: 1.2,
      bounceRate: 42.5,
      avgSessionDuration: 245,
      pagesPerSession: 3.2,
    },
  };
}
