import { Metadata } from 'next';
import AboutUsPage from '@/app/pages/AboutUs';

export const metadata: Metadata = {
  title: 'About Us - Engineering Excellence Since 1982',
  description: 'Inmarco has been engineering reliability and delivering precision in industrial fluid sealing solutions since 1982. Learn about our commitment to quality, innovation, and customer service across oil & gas, power generation, chemical processing, and marine industries.',
  keywords: [
    'about inmarco',
    'industrial sealing manufacturer',
    'fluid sealing company',
    'compression packing manufacturer',
    'gasket manufacturer',
    'sealing solutions provider',
  ],
  openGraph: {
    title: 'About Inmarco - Engineering Excellence Since 1982',
    description: 'Learn about Inmarco - Engineering reliability and delivering precision in industrial fluid sealing solutions since 1982.',
    url: 'https://www.inmarco.com/about-us',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Inmarco - Engineering Excellence Since 1982',
    description: 'Learn about Inmarco - Engineering reliability and delivering precision in industrial fluid sealing solutions since 1982.',
  },
  alternates: {
    canonical: 'https://www.inmarco.com/about-us',
  },
};

export default function AboutUs() {
  return <AboutUsPage />;
}
