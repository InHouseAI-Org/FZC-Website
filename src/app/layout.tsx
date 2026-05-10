import type { Metadata } from 'next';
import './globals.css';
import '@/styles/fonts.css';

export const metadata: Metadata = {
  title: {
    default: 'Inmarco - Industrial Fluid Sealing Solutions',
    template: '%s | Inmarco',
  },
  description: 'Leading manufacturer of industrial fluid sealing solutions including compression packings, gaskets, and thermal insulation products.',
  keywords: ['fluid sealing', 'industrial gaskets', 'compression packing', 'thermal insulation', 'metallic gaskets'],
  authors: [{ name: 'Inmarco' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Inmarco',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
