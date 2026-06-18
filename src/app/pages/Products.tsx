'use client';

import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useState } from 'react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import productsData from '@/data/productsData.json';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image?: string;
  images?: string[];
}

interface Subcategory {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  description: string;
}

export default function Products() {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const categories: Category[] = productsData.categories;
  const subcategories: Subcategory[] = productsData.subcategories;
  const products = productsData.products;

  const getSubcategories = (categoryId: number) => {
    return subcategories.filter(sub => sub.categoryId === categoryId);
  };

  // Comprehensive search function
  const searchProducts = () => {
    if (!searchQuery.trim()) {
      return { categories: [], subcategories: [], products: [] };
    }

    const query = searchQuery.toLowerCase().trim();
    const matchedProducts: any[] = [];
    const matchedSubcategories: any[] = [];
    const matchedCategories: any[] = [];

    // Search products
    products.forEach((product: any) => {
      const matchFields = [
        product.name,
        product.description,
        product.shortDescription,
        product.material,
        ...(product.features || []),
        ...(product.applications || []),
        ...(product.advantages || []),
      ].filter(Boolean);

      const matches = matchFields.some(field =>
        String(field).toLowerCase().includes(query)
      );

      if (matches) {
        // Find subcategory first
        const subcategory = subcategories.find(s => s.id === product.subcategoryId);
        // Find category either directly from product or through subcategory
        const category = categories.find(c =>
          c.id === product.categoryId || c.id === subcategory?.categoryId
        );
        matchedProducts.push({ ...product, category, subcategory });
      }
    });

    // Search subcategories
    subcategories.forEach(subcategory => {
      const matches = [subcategory.name, subcategory.description]
        .some(field => field.toLowerCase().includes(query));

      if (matches) {
        const category = categories.find(c => c.id === subcategory.categoryId);
        matchedSubcategories.push({ ...subcategory, category });
      }
    });

    // Search categories
    categories.forEach(category => {
      const matches = [category.name, category.description]
        .some(field => field.toLowerCase().includes(query));

      if (matches) {
        matchedCategories.push(category);
      }
    });

    return { categories: matchedCategories, subcategories: matchedSubcategories, products: matchedProducts };
  };

  const searchResults = searchProducts();
  const hasSearchResults = searchQuery.trim() && (
    searchResults.categories.length > 0 ||
    searchResults.subcategories.length > 0 ||
    searchResults.products.length > 0
  );

  return (
    <main className="bg-[#2b2a29]">
      {/* Hero Section */}
      <section className="relative py-24 bg-[#1a1918]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="h-[2px] w-12 bg-[#e31e24] mb-6" style={{marginTop:"40px"}}></div>
            <h1 className="text-white mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: '1.1', letterSpacing: '-0.02em' }}>
              Our Products
            </h1>
            <p className="text-gray-300 text-xl">
              Comprehensive range of sealing solutions engineered for reliability, performance, and compliance with international standards.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-8"
            >
              <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products, categories, materials, applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-[#2b2a29] border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#e31e24] focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              {searchQuery.trim() && !hasSearchResults && (
                <p className="mt-3 text-gray-400 text-sm">
                  No results found for "{searchQuery}"
                </p>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Search Results Section */}
      {hasSearchResults && (
        <section className="py-24 bg-[#2b2a29]">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-[2px] w-12 bg-[#e31e24]"></div>
                <span className="text-sm tracking-widest text-gray-400 uppercase">Search Results</span>
              </div>
              <h2 className="text-white text-3xl lg:text-4xl tracking-tight">
                Found {searchResults.categories.length + searchResults.subcategories.length + searchResults.products.length} Results
              </h2>
            </motion.div>

            {/* Matched Products */}
            {searchResults.products.length > 0 && (
              <div className="mb-16">
                <h3 className="text-white text-2xl mb-6 tracking-tight">Products ({searchResults.products.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.products.map((product: any, index: number) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="h-full"
                    >
                      <Link
                        href={
                          product.subcategory
                            ? `/products/${product.category?.slug}/${product.subcategory?.slug}/${product.slug}`
                            : `/products/${product.category?.slug}/${product.slug}`
                        }
                        className="flex flex-col bg-[#1a1918] rounded-lg overflow-hidden border border-gray-800 hover:border-[#e31e24] transition-all duration-300 group h-full"
                      >
                        {(product.images?.[0] || product.image) && (
                          <div className="relative h-48 overflow-hidden flex-shrink-0">
                            <ImageWithFallback
                              src={product.images?.[0] || product.image}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1918] to-transparent opacity-60"></div>
                          </div>
                        )}
                        <div className="p-6 flex flex-col flex-1">
                          <div className="text-xs text-[#e31e24] mb-2">
                            {product.category?.name} {product.subcategory && `→ ${product.subcategory.name}`}
                          </div>
                          <h4 className="text-white text-lg mb-2 group-hover:text-[#e31e24] transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-gray-400 text-sm line-clamp-2 flex-1">
                            {product.description}
                          </p>
                          {product.material && (
                            <div className="mt-3 text-xs text-gray-500">
                              Material: <span className="text-gray-400">{product.material}</span>
                            </div>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Matched Subcategories */}
            {searchResults.subcategories.length > 0 && (
              <div className="mb-16">
                <h3 className="text-white text-2xl mb-6 tracking-tight">Subcategories ({searchResults.subcategories.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.subcategories.map((subcategory: any, index: number) => (
                    <motion.div
                      key={subcategory.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="h-full"
                    >
                      <Link
                        href={`/products/${subcategory.category?.slug}/${subcategory.slug}`}
                        className="flex flex-col bg-[#1a1918] rounded-lg border border-gray-800 hover:border-[#e31e24] transition-all duration-300 p-6 group h-full"
                      >
                        <div className="text-xs text-[#e31e24] mb-2">{subcategory.category?.name}</div>
                        <h4 className="text-white text-xl mb-2 group-hover:text-[#e31e24] transition-colors">
                          {subcategory.name}
                        </h4>
                        <p className="text-gray-400 text-sm flex-1">{subcategory.description}</p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Matched Categories */}
            {searchResults.categories.length > 0 && (
              <div>
                <h3 className="text-white text-2xl mb-6 tracking-tight">Categories ({searchResults.categories.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.categories.map((category: any, index: number) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="h-full"
                    >
                      <Link
                        href={`/products/${category.slug}`}
                        className="flex flex-col bg-[#1a1918] rounded-lg overflow-hidden border border-gray-800 hover:border-[#e31e24] transition-all duration-300 group h-full"
                      >
                        {category.image && (
                          <div className="relative h-48 overflow-hidden flex-shrink-0">
                            {category.image.endsWith('.webm') ? (
                              <video
                                src={category.image}
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="metadata"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            ) : (
                              <ImageWithFallback
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1918] to-transparent opacity-60"></div>
                          </div>
                        )}
                        <div className="p-6 flex flex-col flex-1">
                          <h4 className="text-white text-xl mb-2 group-hover:text-[#e31e24] transition-colors">
                            {category.name}
                          </h4>
                          <p className="text-gray-400 text-sm flex-1">{category.description}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Product Categories Grid */}
      {!hasSearchResults && (
        <section className="py-24 bg-[#2b2a29]">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-[2px] w-12 bg-[#e31e24]"></div>
                <span className="text-sm tracking-widest text-gray-400 uppercase">Product Categories</span>
              </div>
              <h2 className="text-white text-4xl lg:text-5xl tracking-tight">
                Engineered for Excellence
              </h2>
            </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const categorySubcategories = getSubcategories(category.id);

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredCategory(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className="relative group"
                >
                  {/* Category Card */}
                  <Link href={`/products/${category.slug}`}>
                    <div className="bg-[#1a1918] rounded-lg overflow-hidden border border-gray-800 hover:border-[#e31e24] transition-all duration-300 h-full cursor-pointer">
                    {/* Image/Video */}
                    <div className="relative h-64 overflow-hidden">
                      {category.image?.endsWith('.webm') ? (
                        <video
                          src={category.image}
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <ImageWithFallback
                          src={category.image || ''}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1918] via-[#1a1918]/60 to-transparent"></div>

                      {/* Category Title Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-white text-2xl tracking-tight mb-2 group-hover:text-[#e31e24] transition-colors">
                          {category.name}
                        </h3>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        {category.description}
                      </p>

                      {categorySubcategories.length > 0 && (
                        <div className="flex items-center justify-between text-[#e31e24] text-sm font-medium">
                          <span>{categorySubcategories.length} Subcategories</span>
                          {hoveredCategory === category.id ? (
                            <ChevronUp className="w-5 h-5 transition-transform" />
                          ) : (
                            <ChevronDown className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  </Link>

                  {/* Subcategories Dropdown */}
                  <AnimatePresence>
                    {hoveredCategory === category.id && categorySubcategories.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 right-0 top-full mt-2 z-20 bg-[#1a1918] border border-[#e31e24] rounded-lg shadow-2xl overflow-hidden"
                      >
                        <div className="p-4">
                          <div className="text-xs uppercase tracking-wider text-gray-500 mb-3 px-3">
                            Select Subcategory
                          </div>
                          {categorySubcategories.map((subcategory, idx) => (
                            <Link
                              key={subcategory.id}
                              href={`/products/${category.slug}/${subcategory.slug}`}
                              className={`block px-4 py-3 text-white hover:bg-[#e31e24] transition-colors duration-200 rounded ${
                                idx !== categorySubcategories.length - 1 ? 'mb-1' : ''
                              }`}
                            >
                              <div className="font-medium mb-1">{subcategory.name}</div>
                              <div className="text-xs text-gray-400">{subcategory.description}</div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      )}

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
                Need Help Selecting the Right Product?
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Our technical experts are ready to assist you with product selection, specifications, and application guidance.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-4 bg-[#e31e24] text-white rounded-lg hover:bg-[#c41a20] transition-colors duration-300 text-sm uppercase tracking-wide font-semibold"
                >
                  Contact Technical Support
                </Link>
                <a
                  href="tel:+971559487218"
                  className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#2b2a29] transition-all duration-300 text-sm uppercase tracking-wide font-semibold"
                >
                  Call +971 55 948 7218
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
