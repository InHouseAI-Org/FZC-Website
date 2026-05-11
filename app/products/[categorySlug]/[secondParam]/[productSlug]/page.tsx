import { Metadata } from 'next';
import ProductDetailPage from '@/app/pages/ProductDetail';
import productsData from '@/data/productsData.json';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string; secondParam: string; productSlug: string }>;
}): Promise<Metadata> {
  const { categorySlug, secondParam, productSlug } = await params;
  const category = productsData.categories.find((cat: any) => cat.slug === categorySlug);
  const product = (productsData as any).products?.find((prod: any) => prod.slug === productSlug);

  if (!category || !product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  const productDescription = product.description || product.shortDescription || `${product.name} - ${category.name} from Inmarco. High-performance industrial sealing solution.`;

  return {
    title: `${product.name} | ${category.name}`,
    description: productDescription,
    keywords: [
      product.name,
      category.name,
      product.material || '',
      'industrial sealing',
      'fluid sealing',
    ],
    openGraph: {
      title: `${product.name} | ${category.name} | Inmarco`,
      description: productDescription,
      url: `https://www.inmarco.com/products/${categorySlug}/${secondParam}/${productSlug}`,
      type: 'website',
      images: product.image
        ? [
            {
              url: product.image,
              width: 1200,
              height: 630,
              alt: product.name,
            },
          ]
        : [{ url: '/og-image.jpg', width: 1200, height: 630, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | ${category.name} | Inmarco`,
      description: productDescription,
    },
    alternates: {
      canonical: `https://www.inmarco.com/products/${categorySlug}/${secondParam}/${productSlug}`,
    },
  };
}

export async function generateStaticParams() {
  const params: Array<{ categorySlug: string; secondParam: string; productSlug: string }> = [];

  const products = (productsData as any).products || [];
  const subcategories = (productsData as any).subcategories || [];

  products.forEach((product: any) => {
    const subcategory = subcategories.find((sub: any) => sub.id === product.subcategoryId);
    const category = productsData.categories.find((cat: any) => cat.id === subcategory?.categoryId);

    if (category && subcategory) {
      params.push({
        categorySlug: category.slug,
        secondParam: subcategory.slug,
        productSlug: product.slug,
      });
    }
  });

  return params;
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ categorySlug: string; secondParam: string; productSlug: string }>;
}) {
  const { categorySlug, secondParam, productSlug } = await params;
  return <ProductDetailPage />;
}
