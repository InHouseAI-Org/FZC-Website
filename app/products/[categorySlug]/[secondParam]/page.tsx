import { Metadata } from 'next';
import ProductCategoryPage from '@/app/pages/ProductCategory';
import productsData from '@/data/productsData.json';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string; secondParam: string }>;
}): Promise<Metadata> {
  const { categorySlug, secondParam } = await params;
  const category = productsData.categories.find((cat: any) => String(cat.id) === categorySlug);
  const subcategory = (productsData as any).subcategories?.find((sub: any) => String(sub.id) === secondParam);

  if (!category || !subcategory) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
    };
  }

  const subcategoryDescription = subcategory.description || `${subcategory.name} products from Inmarco. High-performance industrial sealing solutions.`;

  return {
    title: `${subcategory.name} | ${category.name}`,
    description: subcategoryDescription,
    keywords: [
      subcategory.name,
      category.name,
      'industrial sealing',
      'fluid sealing solutions',
    ],
    openGraph: {
      title: `${subcategory.name} | ${category.name} | Inmarco`,
      description: subcategoryDescription,
      url: `https://www.inmarco.com/products/${categorySlug}/${secondParam}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${subcategory.name} | ${category.name} | Inmarco`,
      description: subcategoryDescription,
    },
    alternates: {
      canonical: `https://www.inmarco.com/products/${categorySlug}/${secondParam}`,
    },
  };
}

export async function generateStaticParams() {
  const params: Array<{ categorySlug: string; secondParam: string }> = [];
  const subcategories = (productsData as any).subcategories || [];

  subcategories.forEach((subcategory: any) => {
    const category = productsData.categories.find((cat: any) => cat.id === subcategory.categoryId);

    if (category && subcategory.id) {
      params.push({
        categorySlug: String(category.id),
        secondParam: String(subcategory.id),
      });
    }
  });

  return params;
}

export default async function ProductCategory({
  params
}: {
  params: Promise<{ categorySlug: string; secondParam: string }>
}) {
  return <ProductCategoryPage />;
}
