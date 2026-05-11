// Google Analytics helper functions

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Custom events for better tracking
export const trackProductView = (productName: string, category: string) => {
  event({
    action: 'view_product',
    category: 'Product',
    label: `${category} - ${productName}`,
  });
};

export const trackIndustryView = (industryName: string) => {
  event({
    action: 'view_industry',
    category: 'Industry',
    label: industryName,
  });
};

export const trackContactFormSubmit = () => {
  event({
    action: 'submit_contact_form',
    category: 'Contact',
    label: 'Contact Form Submission',
  });
};

export const trackCatalogDownload = (catalogName: string) => {
  event({
    action: 'download_catalog',
    category: 'Download',
    label: catalogName,
  });
};

export const trackVideoPlay = (videoName: string) => {
  event({
    action: 'play_video',
    category: 'Engagement',
    label: videoName,
  });
};

export const trackSearch = (searchTerm: string) => {
  event({
    action: 'search',
    category: 'Search',
    label: searchTerm,
  });
};

export const trackOutboundLink = (url: string) => {
  event({
    action: 'click_outbound_link',
    category: 'Outbound',
    label: url,
  });
};

// Add TypeScript definitions for gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: any
    ) => void;
    dataLayer?: any[];
  }
}
