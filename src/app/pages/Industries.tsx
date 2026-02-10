import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import industriesData from '@/data/industries.json';

export default function IndustriesPage() {
  const industries = industriesData.industries;

  return (
    <main className="bg-[#2b2a29]">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          alt="Industrial Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2b2a29]/95 via-[#2b2a29]/80 to-transparent"></div>

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="h-[2px] w-12 bg-[#e31e24] mb-6"></div>
              <h1 className="text-white mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: '1.1', letterSpacing: '-0.02em', maxWidth: '900px' }}>
                Engineering Excellence Across Critical Sectors
              </h1>
              <p className="text-gray-300 text-xl max-w-2xl">
                Trusted by industry leaders worldwide for mission-critical sealing applications in the most demanding environments.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-24 bg-[#1a1918]">
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
              <span className="text-sm tracking-widest text-gray-400 uppercase">Industries We Serve</span>
            </div>
            <h2 className="text-white text-4xl lg:text-5xl tracking-tight max-w-3xl">
              Delivering reliability across diverse industrial applications
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, index) => (
              <Link key={industry.id} to={`/industries/${industry.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="group relative h-[400px] overflow-hidden cursor-pointer"
                >
                {/* Image */}
                <ImageWithFallback
                  src={industry.image}
                  alt={industry.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2b2a29] via-[#2b2a29]/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

                {/* Red Accent Line */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-1 bg-[#e31e24] origin-left"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.05 + 0.3 }}
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="transform transition-transform duration-300 group-hover:translate-y-[-10px]">
                    <h3 className="text-2xl text-white mb-2 tracking-tight">{industry.title}</h3>
                    {industry.subtitle && (
                      <p className="text-[#e31e24] text-sm mb-3 tracking-wide">{industry.subtitle}</p>
                    )}
                    <p className="text-gray-300 leading-relaxed opacity-90">{industry.description}</p>
                  </div>

                  {/* Number Indicator */}
                  <div className="absolute top-8 right-8 text-6xl text-white/10 group-hover:text-[#e31e24]/20 transition-colors duration-300">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Hover Indicator */}
                  <div className="mt-4 flex items-center space-x-2 text-[#e31e24] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm tracking-wide">Explore Applications</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Inmarco for Your Industry */}
      <section className="py-24 bg-[#2b2a29]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="h-[2px] w-12 bg-[#e31e24]"></div>
                <span className="text-sm tracking-widest text-gray-400 uppercase">Industry Leadership</span>
                <div className="h-[2px] w-12 bg-[#e31e24]"></div>
              </div>

              <h2 className="text-white text-4xl lg:text-5xl mb-8 tracking-tight">
                Why Choose Inmarco
              </h2>

              <div className="grid md:grid-cols-3 gap-8 mt-12">
                {[
                  {
                    title: 'Proven Expertise',
                    description: '30+ years of experience delivering sealing solutions for the world\'s most demanding applications.',
                  },
                  {
                    title: 'Certified Quality',
                    description: 'ISO certified manufacturing with products tested to international standards including API, EN, and fire-safe benchmarks.',
                  },
                  {
                    title: 'On-Site Support',
                    description: 'Field engineering expertise and technical support to ensure optimal performance and reliability.',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-left"
                  >
                    <h3 className="text-white text-xl mb-3 tracking-tight">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
