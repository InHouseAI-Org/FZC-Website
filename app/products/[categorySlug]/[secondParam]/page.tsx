import { Metadata } from 'next';
import ProductCategoryPage from '@/app/pages/ProductCategory';
import productsData from '@/data/productsData.json';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string; secondParam: string }>;
}): Promise<Metadata> {
  const { categorySlug, secondParam } = await params;
  const category = productsData.categories.find((cat: any) => cat.slug === categorySlug);
  const subcategory = (productsData as any).subcategories?.find((sub: any) => sub.slug === secondParam);

  // Check if secondParam is a direct product (no subcategory)
  const directProduct = (productsData as any).products?.find((prod: any) =>
    prod.slug === secondParam && prod.categoryId === category?.id
  );

  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
    };
  }

  // Handle direct product metadata
  if (directProduct && !subcategory) {
    const productDescription = directProduct.description || directProduct.shortDescription || `${directProduct.name} - ${category.name} from Inmarco. High-performance industrial sealing solution.`;

    return {
      title: `${directProduct.name} | ${category.name}`,
      description: productDescription,
      keywords: [
        directProduct.name,
        category.name,
        directProduct.material || '',
        'industrial sealing',
        'fluid sealing',
      ],
      openGraph: {
        title: `${directProduct.name} | ${category.name} | Inmarco`,
        description: productDescription,
        url: `https://www.inmarco.com/products/${category.slug}/${directProduct.slug}`,
        type: 'website',
        images: directProduct.image
          ? [
              {
                url: directProduct.image,
                width: 1200,
                height: 630,
                alt: directProduct.name,
              },
            ]
          : [{ url: '/og-image.jpg', width: 1200, height: 630, alt: directProduct.name }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${directProduct.name} | ${category.name} | Inmarco`,
        description: productDescription,
      },
      alternates: {
        canonical: `https://www.inmarco.com/products/${category.slug}/${directProduct.slug}`,
      },
    };
  }

  // Handle subcategory metadata
  if (!subcategory) {
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
      url: `https://www.inmarco.com/products/${category.slug}/${subcategory.slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${subcategory.name} | ${category.name} | Inmarco`,
      description: subcategoryDescription,
    },
    alternates: {
      canonical: `https://www.inmarco.com/products/${category.slug}/${subcategory.slug}`,
    },
  };
}

export async function generateStaticParams() {
  const params: Array<{ categorySlug: string; secondParam: string }> = [];
  const subcategories = (productsData as any).subcategories || [];
  const products = (productsData as any).products || [];

  // Add all subcategories
  subcategories.forEach((subcategory: any) => {
    const category = productsData.categories.find((cat: any) => cat.id === subcategory.categoryId);

    if (category && subcategory.slug) {
      params.push({
        categorySlug: category.slug,
        secondParam: subcategory.slug,
      });
    }
  });

  // Add direct products (products without subcategoryId)
  products.forEach((product: any) => {
    if (!product.subcategoryId && product.categoryId && product.slug) {
      const category = productsData.categories.find((cat: any) => cat.id === product.categoryId);
      if (category) {
        params.push({
          categorySlug: category.slug,
          secondParam: product.slug,
        });
      }
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
