'use client';

import ProductDetailPage from '@/app/pages/ProductDetail';

export default function ProductDetail({
  params
}: {
  params: { categorySlug: string; secondParam: string; productSlug: string }
}) {
  return <ProductDetailPage />;
}
