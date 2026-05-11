'use client';

import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useState } from 'react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { ChevronDown, ChevronUp } from 'lucide-react';
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
  const categories: Category[] = productsData.categories;
  const subcategories: Subcategory[] = productsData.subcategories;

  const getSubcategories = (categoryId: number) => {
    return subcategories.filter(sub => sub.categoryId === categoryId);
  };

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
          </motion.div>
        </div>
      </section>

      {/* Product Categories Grid */}
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
