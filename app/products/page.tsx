import { Metadata } from 'next';
import ProductsPage from '@/app/pages/Products';

export const metadata: Metadata = {
  title: 'Products | Industrial Sealing Solutions | Inmarco',
  description: 'Explore our comprehensive range of industrial fluid sealing solutions including compression packings, gaskets, and thermal insulation products.',
  keywords: [
    'industrial sealing products',
    'compression packings',
    'gaskets',
    'thermal insulation',
    'fluid sealing solutions',
    'Inmarco',
  ],
  openGraph: {
    title: 'Products | Inmarco - Industrial Sealing Solutions',
    description: 'Explore our comprehensive range of industrial fluid sealing solutions including compression packings, gaskets, and thermal insulation products.',
    url: 'https://www.inmarco.com/products',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Products | Inmarco - Industrial Sealing Solutions',
    description: 'Explore our comprehensive range of industrial fluid sealing solutions including compression packings, gaskets, and thermal insulation products.',
  },
  alternates: {
    canonical: 'https://www.inmarco.com/products',
  },
};

export default function Products() {
  return <ProductsPage />;
}
