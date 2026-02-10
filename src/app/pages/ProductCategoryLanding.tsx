import { motion } from 'motion/react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import productsData from '@/data/productsData.json';

export default function ProductCategoryLanding() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();

  const category = productsData.categories.find((cat) => cat.slug === categorySlug);

  if (!category) {
    return (
      <div className="min-h-screen bg-[#2b2a29] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-4xl mb-4">Category Not Found</h1>
          <Link to="/products" className="text-[#e31e24] hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Get all subcategories for this category
  const subcategories = productsData.subcategories.filter(
    (sub) => sub.categoryId === category.id
  );

  // Get all products for this category (across all subcategories)
  const subcategoryIds = subcategories.map((sub) => sub.id);
  const categoryProducts = productsData.products.filter((product) =>
    subcategoryIds.includes(product.subcategoryId)
  );

  return (
    <main className="bg-[#2b2a29]">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <ImageWithFallback
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2b2a29]/95 via-[#2b2a29]/85 to-[#2b2a29]/70"></div>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => navigate('/products')}
          className="absolute top-25 left-6 lg:left-12 z-20 flex items-center space-x-2 text-white hover:text-[#e31e24] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </motion.button>

        <div className="absolute inset-0 flex items-center mt-30">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="h-[2px] w-12 bg-[#e31e24] mb-6"></div>
              <h1
                className="text-white mb-6"
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                  lineHeight: '1.1',
                  letterSpacing: '-0.02em',
                  maxWidth: '900px',
                }}
              >
                {category.name}
              </h1>
              <p className="text-gray-300 text-xl max-w-2xl leading-relaxed">
                {category.description}
              </p>
              <div className="mt-8 flex items-center space-x-3 text-gray-400">
                <span className="text-sm">{subcategories.length} Subcategories</span>
                <span>•</span>
                <span className="text-sm">{categoryProducts.length} Products</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Subcategories & Products Section */}
      <section className="py-24 bg-[#1a1918]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          {subcategories.map((subcategory, subIndex) => {
            const subcategoryProducts = productsData.products.filter(
              (product) => product.subcategoryId === subcategory.id
            );

            if (subcategoryProducts.length === 0) return null;

            return (
              <motion.div
                key={subcategory.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: subIndex * 0.1 }}
                className="mb-20 last:mb-0"
              >
                {/* Subcategory Header */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="h-[2px] w-12 bg-[#e31e24]"></div>
                        <span className="text-sm tracking-widest text-gray-400 uppercase">
                          Subcategory
                        </span>
                      </div>
                      <h2 className="text-white text-3xl lg:text-4xl tracking-tight mb-3">
                        {subcategory.name}
                      </h2>
                      <p className="text-gray-400 text-lg">{subcategory.description}</p>
                    </div>
                    <Link
                      to={`/products/${category.slug}/${subcategory.slug}`}
                      className="hidden md:flex items-center space-x-2 text-[#e31e24] hover:text-white transition-colors"
                    >
                      <span>View All</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subcategoryProducts.map((product, productIndex) => (
                    <Link
                      key={product.id}
                      to={`/products/${category.slug}/${subcategory.slug}/${product.slug}`}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: productIndex * 0.05 }}
                        className="group relative bg-[#2b2a29] border border-gray-800 hover:border-[#e31e24]/50 transition-all duration-300 overflow-hidden h-full"
                      >
                        {/* Top accent line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#e31e24] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

                        <div className="p-6">
                          {/* Product Header */}
                          <div className="mb-4">
                            <h3 className="text-white text-xl mb-2 tracking-tight group-hover:text-[#e31e24] transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                              {product.description}
                            </p>
                          </div>

                          {/* Key Features */}
                          {product.features && product.features.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                                Key Features
                              </h4>
                              <ul className="space-y-1">
                                {product.features.slice(0, 3).map((feature, idx) => (
                                  <li
                                    key={idx}
                                    className="text-gray-400 text-sm flex items-start"
                                  >
                                    <span className="text-[#e31e24] mr-2">•</span>
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* View Details Link */}
                          <div className="mt-6 pt-4 border-t border-gray-800">
                            <div className="flex items-center justify-between text-[#e31e24] group-hover:text-white transition-colors">
                              <span className="text-sm font-medium">View Details</span>
                              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>

                        {/* Hover glow effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-[#e31e24]/5 to-transparent pointer-events-none transition-opacity duration-300"></div>
                      </motion.div>
                    </Link>
                  ))}
                </div>

                {/* Mobile View All Link */}
                <Link
                  to={`/products/${category.slug}/${subcategory.slug}`}
                  className="md:hidden flex items-center justify-center space-x-2 text-[#e31e24] hover:text-white transition-colors mt-6"
                >
                  <span>View All {subcategory.name}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#2b2a29]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-[#1a1918] to-[#0f0f0f] border-2 border-[#e31e24]/30 rounded-xl p-12 lg:p-16 text-center"
          >
            <h2 className="text-white text-3xl lg:text-4xl mb-4 tracking-tight">
              Need Help Selecting the Right Product?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Our technical team can help you find the perfect {category.name.toLowerCase()} solution for your specific application.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-[#e31e24] text-white tracking-wide hover:bg-[#c41a20] transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Contact Technical Support</span>
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <a href="tel:+971559487218">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#2b2a29] transition-all duration-300"
                >
                  Call +971 55 948 7218
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Other Categories Section */}
      <section className="py-24 bg-[#1a1918]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-[2px] w-12 bg-[#e31e24]"></div>
              <span className="text-sm tracking-widest text-gray-400 uppercase">
                Other Categories
              </span>
            </div>
            <h2 className="text-white text-3xl lg:text-4xl tracking-tight">
              Explore More Products
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsData.categories
              .filter((cat) => cat.id !== category.id)
              .slice(0, 3)
              .map((otherCategory, index) => (
                <Link key={otherCategory.id} to={`/products/${otherCategory.slug}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative h-[300px] overflow-hidden cursor-pointer"
                  >
                    <ImageWithFallback
                      src={otherCategory.image}
                      alt={otherCategory.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2b2a29] via-[#2b2a29]/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <h3 className="text-xl text-white mb-2 tracking-tight group-hover:text-[#e31e24] transition-colors">
                        {otherCategory.name}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {otherCategory.description}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
