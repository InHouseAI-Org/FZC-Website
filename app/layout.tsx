import type { Metadata } from 'next';
import './globals.css';
import '../src/styles/fonts.css';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Providers } from './providers';
import Analytics from './components/Analytics';
import { LayoutContent } from './LayoutContent';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.inmarco.com'), // Replace with your actual domain
  title: {
    default: 'Inmarco - Industrial Fluid Sealing Solutions | Compression Packings & Gaskets',
    template: '%s | Inmarco',
  },
  description: 'Leading manufacturer of industrial fluid sealing solutions including API-certified compression packings, high-performance gaskets, and thermal insulation products for oil & gas, power generation, chemical, and marine industries.',
  keywords: [
    'fluid sealing solutions',
    'compression packing',
    'industrial gaskets',
    'fugitive emission packing',
    'API 622 packing',
    'ISO 15848 packing',
    'PTFE packing',
    'graphite packing',
    'spiral wound gaskets',
    'RTJ gaskets',
    'metallic gaskets',
    'thermal insulation',
    'flange isolation gaskets',
    'API 6FB gaskets',
    'low emission packing',
    'valve stem packing',
    'pump packing',
    'oil and gas sealing',
    'power generation sealing',
    'chemical process sealing',
    'marine sealing solutions',
  ],
  authors: [{ name: 'Inmarco', url: 'https://www.inmarco.com' }],
  creator: 'Inmarco',
  publisher: 'Inmarco',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.inmarco.com',
    siteName: 'Inmarco',
    title: 'Inmarco - Industrial Fluid Sealing Solutions',
    description: 'Leading manufacturer of API-certified compression packings, high-performance gaskets, and thermal insulation products for critical industrial applications.',
    images: [
      {
        url: '/og-image.jpg', // You'll need to create this image
        width: 1200,
        height: 630,
        alt: 'Inmarco Industrial Fluid Sealing Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inmarco - Industrial Fluid Sealing Solutions',
    description: 'Leading manufacturer of API-certified compression packings, high-performance gaskets, and thermal insulation products.',
    images: ['/og-image.jpg'], // You'll need to create this image
    creator: '@inmarco', // Replace with your actual Twitter handle if available
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  alternates: {
    canonical: 'https://www.inmarco.com',
  },
  category: 'Industrial Manufacturing',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Structured Data (JSON-LD) for Organization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Inmarco',
    description: 'Leading manufacturer of industrial fluid sealing solutions including compression packings, gaskets, and thermal insulation products.',
    url: 'https://www.inmarco.com',
    logo: 'https://www.inmarco.com/logo.png',
    sameAs: [
      // Add your social media profiles here
      // 'https://www.linkedin.com/company/inmarco',
      // 'https://twitter.com/inmarco',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Sales',
      availableLanguage: ['English'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AE', // Update with your actual country
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Inmarco',
    url: 'https://www.inmarco.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.inmarco.com/products?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        <Analytics />
        <Providers>
          <LayoutContent>
            {children}
          </LayoutContent>
        </Providers>
      </body>
    </html>
  );
}
