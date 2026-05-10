'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import productsData from '@/data/productsData.json';
import ProductDetail from './ProductDetail';

interface Product {
  id: number;
  subcategoryId: number;
  name: string;
  slug: string;
  shortDescription: string;
  image?: string;
  specifications?: Record<string, string>;
  features?: string[];
  material?: string;
  apiCertified?: boolean;
  description?: string;
}

export default function ProductCategory() {
  const { categorySlug, secondParam } = useParams();
  const subcategorySlug = secondParam; // Alias for clarity

  const category = productsData.categories.find(c => c.slug === categorySlug);

  // Check if secondParam is a subcategory or a product
  const subcategory = productsData.subcategories.find(s => s.slug === secondParam);
  const directProduct = productsData.products.find(p =>
    p.slug === secondParam && p.categoryId === category?.id
  );

  // If it's a direct product (no subcategory), render ProductDetail
  if (directProduct && !subcategory) {
    return <ProductDetail />;
  }

  const products: Product[] = subcategory
    ? productsData.products.filter(p => p.subcategoryId === subcategory.id)
    : [];

  if (!category || !subcategory) {
    return (
      <main className="bg-[#2b2a29] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-4xl mb-4">Category Not Found</h1>
          <Link href="/products" className="text-[#e31e24] hover:underline">
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#2b2a29]">
      {/* Hero Section */}
      <section className="relative py-16 bg-[#1a1918]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mt-15">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              href="/products"
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-[#e31e24] transition-colors mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to All Products</span>
            </Link>

            <div className="flex items-center space-x-3 text-sm text-gray-400 mb-6">
              <Link href="/products" className="hover:text-[#e31e24] transition-colors">
                Products
              </Link>
              <span>/</span>
              <Link href={`/products/${category.slug}`} className="hover:text-[#e31e24] transition-colors">
                {category.name}
              </Link>
              <span>/</span>
              <span className="text-[#e31e24]">{subcategory.name}</span>
            </div>

            <h1 className="text-white mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: '1.2', letterSpacing: '-0.01em' }}>
              {subcategory.name}
            </h1>
            <p className="text-gray-300 text-xl max-w-3xl">
              {subcategory.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24 bg-[#2b2a29]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          {products.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link
                    href={`/products/${categorySlug}/${subcategorySlug}/${product.slug}`}
                    className="block bg-[#1a1918] rounded-lg overflow-hidden border border-gray-800 hover:border-[#e31e24] transition-all duration-300 group h-full flex flex-col"
                  >
                    {/* Image */}
                    {(product.images?.[0] || product.image) && (
                      <div className="relative h-64 overflow-hidden">
                        <ImageWithFallback
                          src={product.images?.[0] || product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1918] to-transparent opacity-60"></div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-white text-xl mb-3 tracking-tight group-hover:text-[#e31e24] transition-colors">
                        {product.name}
                      </h3>

                      <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">
                        {product.shortDescription}
                      </p>

                      {/* Key Features */}
                      {product.features && product.features.length > 0 && (
                        <div className="space-y-2 mb-4">
                          {product.features.slice(0, 3).map((feature, idx) => (
                            <div key={idx} className="flex items-start space-x-2 text-xs text-gray-500">
                              <CheckCircle2 className="w-4 h-4 text-[#e31e24] flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="pt-4 border-t border-gray-800">
                        <span className="text-[#e31e24] text-sm font-medium group-hover:underline">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No products available in this category yet.</p>
              <Link href="/products" className="text-[#e31e24] hover:underline mt-4 inline-block">
                Browse other categories
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#1a1918]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-white text-3xl lg:text-4xl mb-6 tracking-tight">
                Need Technical Assistance?
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Our engineers can help you select the right product for your specific application requirements.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-[#e31e24] text-white rounded-lg hover:bg-[#c41a20] transition-colors duration-300 text-sm uppercase tracking-wide font-semibold"
              >
                Contact Technical Support
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
