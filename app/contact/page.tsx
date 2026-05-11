import { Metadata } from 'next';
import ContactPage from '@/app/pages/Contact';

export const metadata: Metadata = {
  title: 'Contact Us - Get In Touch With Our Experts',
  description: 'Get in touch with Inmarco for sales enquiries, technical support, custom sealing solutions, or partnership opportunities. Our team of experts is ready to help with your industrial fluid sealing needs.',
  keywords: [
    'contact inmarco',
    'sealing solutions enquiry',
    'technical support',
    'sales contact',
    'custom sealing solutions',
    'industrial sealing experts',
  ],
  openGraph: {
    title: 'Contact Inmarco - Get In Touch With Our Experts',
    description: 'Get in touch with Inmarco for sales enquiries, technical support, or partnership opportunities.',
    url: 'https://www.inmarco.com/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contact Inmarco - Get In Touch With Our Experts',
    description: 'Get in touch with Inmarco for sales enquiries, technical support, or partnership opportunities.',
  },
  alternates: {
    canonical: 'https://www.inmarco.com/contact',
  },
};

export default function Contact() {
  return <ContactPage />;
}
