'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, FileText, Download, Info, Share2 } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { ProductImageGallery } from '@/app/components/ProductImageGallery';
import EmailModal from '@/app/components/EmailModal';
import productsData from '@/data/productsData.json';

export default function ProductDetail() {
  const params = useParams();
  const categorySlug = params.categorySlug;
  const subcategorySlug = params.subcategorySlug || params.secondParam;
  const productSlug = params.productSlug;

  // Email modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'download' | 'share'>('download');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const category = productsData.categories.find(c => c.slug === categorySlug);

  // Helper function to convert HTML datasheet path to CloudFront PDF URL
  const getDatasheetPdfUrl = (datasheetPath: string) => {
    // Extract filename from path (e.g., "datasheets/new_generated_html/ULTRA_FE_1003.html" -> "ULTRA_FE_1003")
    const filename = datasheetPath.split('/').pop()?.replace('.html', '') || '';
    return `https://d24gq0kplkhyxr.cloudfront.net/datasheets/pdf/${filename}.pdf`;
  };

  // Handle both URL patterns: with and without subcategory
  let subcategory = null;
  let product = null;

  if (subcategorySlug && productSlug) {
    // Pattern: /products/:categorySlug/:subcategorySlug/:productSlug
    subcategory = productsData.subcategories.find(s => s.slug === subcategorySlug);
    product = productsData.products.find(p => p.slug === productSlug);
  } else if (subcategorySlug && !productSlug) {
    // Pattern: /products/:categorySlug/:productSlug (no subcategory)
    // In this case, subcategorySlug is actually the productSlug
    product = productsData.products.find(p => p.slug === subcategorySlug && p.categoryId === category?.id);
  }

  if (!category || !product) {
    return (
      <main className="bg-[#2b2a29] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-4xl mb-4">Product Not Found</h1>
          <Link href="/products" className="text-[#e31e24] hover:underline">
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  // Handle download datasheet
  const handleDownload = async (email: string) => {
    if (!product.datasheet) return;

    setIsLoading(true);
    const datasheetUrl = getDatasheetPdfUrl(product.datasheet);

    try {
      // Track the download
      const response = await fetch('/api/datasheet/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          productName: product.name,
          productSlug: product.slug,
          datasheetUrl,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Open the datasheet in a new tab
        window.open(datasheetUrl, '_blank');
        setNotification({ type: 'success', message: 'Datasheet download started!' });
        setIsModalOpen(false);
      } else {
        setNotification({ type: 'error', message: data.message || 'Failed to process download' });
      }
    } catch (error) {
      console.error('Download error:', error);
      setNotification({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
      // Clear notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    }
  };

  // Handle share datasheet
  const handleShare = async (email: string) => {
    if (!product.datasheet) return;

    setIsLoading(true);
    const datasheetUrl = getDatasheetPdfUrl(product.datasheet);

    try {
      // Send the datasheet via email
      const response = await fetch('/api/datasheet/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: email,
          productName: product.name,
          productSlug: product.slug,
          datasheetUrl,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNotification({ type: 'success', message: 'Datasheet shared successfully!' });
        setIsModalOpen(false);
      } else {
        setNotification({ type: 'error', message: data.message || 'Failed to share datasheet' });
      }
    } catch (error) {
      console.error('Share error:', error);
      setNotification({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
      // Clear notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    }
  };

  // Handle modal submit based on mode
  const handleModalSubmit = (email: string) => {
    if (modalMode === 'download') {
      handleDownload(email);
    } else {
      handleShare(email);
    }
  };

  // Open download modal
  const openDownloadModal = () => {
    setModalMode('download');
    setIsModalOpen(true);
  };

  // Open share modal
  const openShareModal = () => {
    setModalMode('share');
    setIsModalOpen(true);
  };

  return (
    <main className="bg-[#2b2a29]">
      {/* Hero Section */}
      <section className="relative py-16 bg-[#1a1918]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              href={subcategory ? `/products/${categorySlug}/${subcategorySlug}` : `/products/${categorySlug}`}
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-[#e31e24] transition-colors mt-32 mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to {subcategory ? subcategory.name : category.name}</span>
            </Link>

            <div className="flex items-center space-x-3 text-sm text-gray-400 mb-6">
              <Link href="/products" className="hover:text-[#e31e24] transition-colors">
                Products
              </Link>
              <span>/</span>
              <Link href={`/products/${categorySlug}`} className="hover:text-[#e31e24] transition-colors">
                {category.name}
              </Link>
              {subcategory && (
                <>
                  <span>/</span>
                  <Link
                    href={`/products/${categorySlug}/${subcategorySlug}`}
                    className="hover:text-[#e31e24] transition-colors"
                  >
                    {subcategory.name}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="text-[#e31e24]">{product.name}</span>
            </div>

            <h1 className="text-white mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: '1.2', letterSpacing: '-0.01em' }}>
              {product.name}
            </h1>

          </motion.div>
        </div>
      </section>

      {/* Product Overview */}
      <section className="py-12 bg-[#2b2a29]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className={`grid ${(product.images?.length > 0 || product.gallery?.length > 0 || product.image) ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-12`}>
            {/* Image Gallery - Only show if images exist */}
            {(product.images?.length > 0 || product.gallery?.length > 0 || product.image) && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <ProductImageGallery
                  images={product.images || product.gallery || [product.image]}
                  productName={product.name}
                />
              </motion.div>
            )}

            {/* Description & Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col"
            >
              <div className="flex-1">
                <h2 className="text-white text-2xl mb-4 tracking-tight">Product Description</h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                  {product.description}
                </p>

                {/* Quick Specs */}
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <div className="bg-[#1a1918] p-6 rounded-lg border border-gray-800 mb-8">
                    <h3 className="text-white text-lg mb-4 tracking-tight">Quick Specifications</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {(() => {
                        // Handle new byEquipmentType structure
                        if ((product.specifications as any).byEquipmentType && (product.specifications as any).common) {
                          const commonSpecs = Object.entries((product.specifications as any).common).slice(0, 4);
                          return commonSpecs.map(([key, value]) => (
                            <div key={key}>
                              <div className="text-gray-500 text-xs uppercase mb-1">{key}</div>
                              <div className="text-white text-sm">{value as string}</div>
                            </div>
                          ));
                        }
                        // Handle legacy structure
                        return Object.entries(product.specifications).slice(0, 4).map(([key, value]) => {
                          if (typeof value === 'object') return null;
                          return (
                            <div key={key}>
                              <div className="text-gray-500 text-xs uppercase mb-1">{key}</div>
                              <div className="text-white text-sm">{value as string}</div>
                            </div>
                          );
                        }).filter(Boolean);
                      })()}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-[#e31e24] text-white rounded-lg hover:bg-[#c41a20] transition-colors duration-300 font-medium"
                >
                  Request Quote
                </Link>
                {product.datasheet && (
                  <>
                    <button
                      onClick={openDownloadModal}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-transparent border-2 border-[#e31e24] text-[#e31e24] rounded-lg hover:bg-[#e31e24] hover:text-white transition-colors duration-300 font-medium"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Datasheet</span>
                    </button>
                    <button
                      onClick={openShareModal}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-transparent border-2 border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 hover:border-gray-500 transition-colors duration-300 font-medium"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share Datasheet</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-24 right-6 z-50 animate-fadeIn">
          <div className={`px-6 py-4 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          } text-white`}>
            <p className="font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Email Modal */}
      <EmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        mode={modalMode}
        productName={product.name}
        isLoading={isLoading}
      />

      {/* Detailed Specifications */}
      <section className="py-12 bg-[#1a1918]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Technical Specifications */}
            {(product.specifications || product.technicalData) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <>
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                      <div className="h-[2px] w-8 sm:w-12 bg-[#e31e24]"></div>
                      <span className="text-xs sm:text-sm tracking-widest text-gray-400 uppercase">Technical Data</span>
                    </div>
                    <h2 className="text-white text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6 tracking-tight">Specifications</h2>

                    {/* Equipment-Specific Specifications Table */}
                    {(product.specifications as any).byEquipmentType ? (
                      <div className="space-y-4 sm:space-y-6">
                        {/* Equipment Type Table */}
                        <div className="overflow-x-auto -mx-4 sm:mx-0">
                          <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                            <table className="min-w-full bg-[#2b2a29] border border-gray-800 rounded-lg overflow-hidden">
                              <thead>
                                <tr className="bg-[#1a1918]">
                                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-gray-400 text-xs sm:text-sm font-medium border-b border-gray-800 whitespace-nowrap">Equipment Type</th>
                                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-gray-400 text-xs sm:text-sm font-medium border-b border-gray-800 whitespace-nowrap">Pressure</th>
                                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-gray-400 text-xs sm:text-sm font-medium border-b border-gray-800 whitespace-nowrap">Velocity</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(product.specifications as any).byEquipmentType.rotating && (
                                  <tr className="border-b border-gray-800">
                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-white text-xs sm:text-base font-medium whitespace-nowrap">Rotating</td>
                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-300 text-xs sm:text-base">{(product.specifications as any).byEquipmentType.rotating.pressure || '---'}</td>
                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-300 text-xs sm:text-base">{(product.specifications as any).byEquipmentType.rotating.velocity || '---'}</td>
                                  </tr>
                                )}
                                {(product.specifications as any).byEquipmentType.reciprocating && (
                                  <tr className="border-b border-gray-800">
                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-white text-xs sm:text-base font-medium whitespace-nowrap">Reciprocating</td>
                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-300 text-xs sm:text-base">{(product.specifications as any).byEquipmentType.reciprocating.pressure || '---'}</td>
                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-300 text-xs sm:text-base">{(product.specifications as any).byEquipmentType.reciprocating.velocity || '---'}</td>
                                  </tr>
                                )}
                                {(product.specifications as any).byEquipmentType.static && (
                                  <tr>
                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-white text-xs sm:text-base font-medium whitespace-nowrap">Static</td>
                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-300 text-xs sm:text-base">{(product.specifications as any).byEquipmentType.static.pressure || '---'}</td>
                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-300 text-xs sm:text-base">{(product.specifications as any).byEquipmentType.static.velocity || '---'}</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Common Specifications */}
                        {(product.specifications as any).common && Object.keys((product.specifications as any).common).length > 0 && (
                          <div className="space-y-3 sm:space-y-4 pt-4">
                            <h3 className="text-white text-base sm:text-lg mb-3 sm:mb-4 tracking-tight">Common Specifications</h3>
                            {Object.entries((product.specifications as any).common).map(([key, value]) => (
                              <div key={key} className="flex flex-col sm:grid sm:grid-cols-2 gap-1 sm:gap-4 py-2 sm:py-3 border-b border-gray-800">
                                <span className="text-gray-400 text-xs sm:text-base break-words">{key}</span>
                                <span className="text-white text-sm sm:text-base font-medium break-words sm:text-right">{value as string}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Standard Specifications Display */
                      <div className="space-y-3 sm:space-y-4">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="flex flex-col sm:grid sm:grid-cols-2 gap-1 sm:gap-4 py-2 sm:py-3 border-b border-gray-800">
                            <span className="text-gray-400 text-xs sm:text-base break-words">{key}</span>
                            <span className="text-white text-sm sm:text-base font-medium break-words sm:text-right">{value as string}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {product.technicalData && Object.keys(product.technicalData).length > 0 && (
                  <div className="mt-6 sm:mt-8 bg-[#2b2a29] p-4 sm:p-6 rounded-lg">
                    <h3 className="text-white text-base sm:text-lg mb-3 sm:mb-4 tracking-tight">Additional Technical Data</h3>
                    <div className="space-y-2 sm:space-y-3">
                      {Object.entries(product.technicalData).map(([key, value]) => (
                        <div key={key} className="flex flex-col sm:grid sm:grid-cols-2 gap-1 sm:gap-4">
                          <span className="text-gray-400 text-xs sm:text-sm break-words">{key}</span>
                          <span className="text-white text-sm font-medium break-words sm:text-right">{value as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Features & Applications */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Key Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-8 sm:mb-12">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                    <div className="h-[2px] w-8 sm:w-12 bg-[#e31e24]"></div>
                    <span className="text-xs sm:text-sm tracking-widest text-gray-400 uppercase">Benefits</span>
                  </div>
                  <h2 className="text-white text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6 tracking-tight">Key Features</h2>

                  <div className="space-y-2 sm:space-y-3">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-2 sm:space-x-3">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#e31e24] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm sm:text-base">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Applications */}
              {product.applications && product.applications.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                    <div className="h-[2px] w-8 sm:w-12 bg-[#e31e24]"></div>
                    <span className="text-xs sm:text-sm tracking-widest text-gray-400 uppercase">Use Cases</span>
                  </div>
                  <h2 className="text-white text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-6 tracking-tight">Applications</h2>

                  <div className="space-y-2 sm:space-y-3">
                    {product.applications.map((application, idx) => (
                      <div key={idx} className="flex items-start space-x-2 sm:space-x-3">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#e31e24] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm sm:text-base">{application}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      {product.advantages && product.advantages.length > 0 && (
        <section className="py-12 bg-[#2b2a29]">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-white text-3xl lg:text-4xl tracking-tight">Why Choose This Product?</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.advantages.map((advantage, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="bg-[#1a1918] p-6 rounded-lg border-l-2 border-[#e31e24]"
                >
                  <CheckCircle2 className="w-8 h-8 text-[#e31e24] mb-3" />
                  <p className="text-white">{advantage}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Variant Notices */}
      <section className="py-12 bg-[#2b2a29]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="space-y-4">
            {(product as any).economicalVariant && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-[#e31e24]/5 border-l-4 border-[#e31e24] p-6 rounded-r-lg"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-5 h-5 text-[#e31e24] flex-shrink-0" />
                <p className="text-gray-300 text-sm leading-relaxed">
                  This product is also available in an Economical version as <strong className="text-[#e31e24]">{(product as any).economicalVariant}</strong>, offering cost-effective sealing solutions while maintaining reliable performance standards.
                </p>
                </div>
              </motion.div>
            )}
            {(product as any).elastomericCoreVariant && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-[#e31e24]/5 border-l-4 border-[#e31e24] p-6 rounded-r-lg"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-5 h-5 text-[#e31e24] flex-shrink-0" />
                <p className="text-gray-300 text-sm leading-relaxed">
                  This product is also available with an elastomeric core as <strong className="text-[#e31e24]">{(product as any).elastomericCoreVariant}</strong>, designed for rugged and resilient operations in demanding service conditions.
                </p>
                </div>
              </motion.div>
            )}
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
                Additional Support?
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Contact our sales team for pricing, availability, and technical specifications.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-4 bg-[#e31e24] text-white rounded-lg hover:bg-[#c41a20] transition-colors duration-300 text-sm uppercase tracking-wide font-semibold"
                >
                  Request Quote
                </Link>
                <a
                  href="tel:+971559487218"
                  className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-[#e31e24] text-[#e31e24] rounded-lg hover:bg-[#e31e24] hover:text-white transition-colors duration-300 text-sm uppercase tracking-wide font-semibold"
                >
                  Call Sales Team
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
