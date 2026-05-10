'use client';

import ProductCategoryPage from '@/app/pages/ProductCategory';

export default function ProductCategory({
  params
}: {
  params: { categorySlug: string; secondParam: string }
}) {
  return <ProductCategoryPage />;
}
