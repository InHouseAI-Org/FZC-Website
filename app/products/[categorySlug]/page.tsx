import { Metadata } from 'next';
import ProductCategoryLandingPage from '@/app/pages/ProductCategoryLanding';
import productsData from '@/data/productsData.json';

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string }> }): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = productsData.categories.find((cat) => String(cat.id) === categorySlug);

  if (!category) {
    return {
      title: 'Product Category Not Found',
      description: 'The requested product category could not be found.',
    };
  }

  return {
    title: `${category.name} | Industrial Sealing Solutions`,
    description: category.description,
    keywords: [
      category.name,
      'industrial sealing',
      'fluid sealing solutions',
      'high-performance gaskets',
    ],
    openGraph: {
      title: `${category.name} | Inmarco`,
      description: category.description,
      url: `https://www.inmarco.com/products/${category.id}`,
      type: 'website',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: category.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} | Inmarco`,
      description: category.description,
    },
    alternates: {
      canonical: `https://www.inmarco.com/products/${category.id}`,
    },
  };
}

export async function generateStaticParams() {
  return productsData.categories.map((category) => ({
    categorySlug: String(category.id),
  }));
}

export default async function ProductCategoryLanding({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;
  return <ProductCategoryLandingPage />;
}
