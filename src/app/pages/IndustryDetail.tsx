import { motion } from 'motion/react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { ArrowLeft, CheckCircle2, ChevronRight, Hexagon } from 'lucide-react';
import industriesData from '@/data/industries.json';
import { useRef } from 'react';

// OEM Applications Component with categories and sub-items
function OEMApplications({ scrollToCTA }: { scrollToCTA: () => void }) {
  const categorySubItems: Record<string, string[]> = {
    'Control Valves': (industriesData as any)._comments?.oem_control_valves || [],
    'Isolation Valves': (industriesData as any)._comments?.oem_isolation_valves || [],
    'Centrifugal Pumps': (industriesData as any)._comments?.oem_centrifugal_pumps || [],
    'Reciprocating Pumps': (industriesData as any)._comments?.oem_reciprocating_pumps || [],
  };

  const categories = ['Control Valves', 'Isolation Valves', 'Centrifugal Pumps', 'Reciprocating Pumps'];

  return (
    <div className="space-y-6">
      {categories.map((category, index) => {
        const subItems = categorySubItems[category] || [];
        const hasSubItems = subItems.length > 0;

        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={!hasSubItems ? scrollToCTA : undefined}
            className={`bg-[#2b2a29] border border-gray-800 ${!hasSubItems ? 'cursor-pointer hover:border-[#e31e24]/50 transition-all duration-300' : ''}`}
          >
            {/* Category Header */}
            <div className={`group relative p-6 ${hasSubItems ? 'border-b border-gray-800' : ''}`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-[#e31e24]"></div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#e31e24]/10 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-[#e31e24] text-sm font-bold">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-white text-xl font-medium">{category}</h3>
              </div>
            </div>

            {/* Sub-items - only show if there are sub-items */}
            {hasSubItems && (
              <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subItems.map((subItem, subIndex) => (
                    <motion.div
                      key={subIndex}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: subIndex * 0.05 }}
                      onClick={scrollToCTA}
                      className="flex items-start space-x-2 text-gray-400 hover:text-white transition-colors cursor-pointer group/item"
                    >
                      <span className="text-[#e31e24] mt-1">•</span>
                      <span className="text-sm leading-relaxed group-hover/item:translate-x-1 transition-transform">
                        {subItem}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export default function IndustryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const ctaSectionRef = useRef<HTMLElement>(null);

  const industry = industriesData.industries.find((ind) => ind.slug === slug);

  // Map industry slugs to their product images
  const industryImages: Record<string, string> = {
    'oil-gas': 'public/industries/Oil .webp',
    'power-generation': 'public/industries/Power Gen.webp',
    'chemical': 'public/industries/Chemical.webp',
    'water-wastewater-treatment': 'public/industries/Water & Wastewater Treatment.webp',
    'marine': 'public/industries/Marine.webp',
    'cement': 'public/industries/Cement.webp',
    'fertilizers': 'public/industries/Fertlisers.webp',
    'metallurgy': 'public/industries/Metal.webp',
    'pulp-paper': 'public/industries/Pulp.webp',
    'food-pharmaceutical': 'public/industries/Food & Pharma.webp',
    'sugar': 'public/industries/Sugar.webp',
    'oem': 'public/industries/OEM.webp',
  };

  const scrollToCTA = () => {
    ctaSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };

  if (!industry) {
    return (
      <div className="min-h-screen bg-[#2b2a29] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-4xl mb-4">Industry Not Found</h1>
          <Link to="/industries" className="text-[#e31e24] hover:underline">
            Back to Industries
          </Link>
        </div>
      </div>
    );
  }

  // Get related industries (exclude current one) - randomly selected
  const relatedIndustries = industriesData.industries
    .filter((ind) => ind.id !== industry.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return (
    <main className="bg-[#2b2a29]">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <ImageWithFallback
          src={industry.image}
          alt={industry.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2b2a29]/95 via-[#2b2a29]/80 to-transparent"></div>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => navigate('/industries')}
          className="absolute top-25 left-6 lg:left-12 z-20 flex items-center space-x-2 text-white hover:text-[#e31e24] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Industries</span>
        </motion.button>

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {industry.subtitle && (
                <div className="text-[#e31e24] text-sm tracking-widest uppercase mb-4">
                  {industry.subtitle}
                </div>
              )}
              <h1
                className="text-white mb-6"
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                  lineHeight: '1.1',
                  letterSpacing: '-0.02em',
                  maxWidth: '900px',
                }}
              >
                {industry.title}
              </h1>
              <p className="text-gray-300 text-xl max-w-2xl leading-relaxed">
                {industry.description}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-24 bg-[#1a1918]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-[2px] w-12 bg-[#e31e24]"></div>
              <span className="text-sm tracking-widest text-gray-400 uppercase">Overview</span>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed max-w-4xl">
              {industry.fullDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Challenges & Solutions Section */}
      <section className="py-24 bg-[#2b2a29]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Challenges */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-[2px] w-12 bg-[#e31e24]"></div>
                <span className="text-sm tracking-widest text-gray-400 uppercase">
                  Industry Challenges
                </span>
              </div>
              <h2 className="text-white text-3xl lg:text-4xl mb-8 tracking-tight">
                Critical Sealing Challenges
              </h2>
              <ul className="space-y-4">
                {industry.challenges.map((challenge, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <Hexagon className="w-4 h-4 text-[#e31e24] fill-[#e31e24]/20 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 leading-relaxed">{challenge}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Solutions */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-[2px] w-12 bg-[#e31e24]"></div>
                <span className="text-sm tracking-widest text-gray-400 uppercase">
                  Our Solutions
                </span>
              </div>
              <h2 className="text-white text-3xl lg:text-4xl mb-8 tracking-tight">
                Proven Sealing Solutions
              </h2>
              <ul className="space-y-4">
                {industry.solutions.map((solution, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <CheckCircle2 className="w-6 h-6 text-[#e31e24] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 leading-relaxed">{solution}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="pt-24 bg-[#1a1918]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-[2px] w-12 bg-[#e31e24]"></div>
              <span className="text-sm tracking-widest text-gray-400 uppercase">Applications</span>
            </div>
            <h2 className="text-white text-3xl lg:text-4xl tracking-tight">
              Typical Applications
            </h2>
          </motion.div>

          {industry.slug === 'oem' ? (
            <OEMApplications scrollToCTA={scrollToCTA} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industry.applications.map((application, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={scrollToCTA}
                  className="group relative bg-[#2b2a29] border border-gray-800 hover:border-[#e31e24]/50 p-6 transition-all duration-300 cursor-pointer"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#e31e24] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#e31e24]/10 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-[#e31e24] text-sm font-bold">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <p className="text-gray-300 group-hover:text-white transition-colors">
                      {application}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Industry Product Showcase - Only show if image exists */}
      {slug && industryImages[slug] && (
        <section className="relative py-32 bg-[#1a1918] overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(45deg, #e31e24 0px, #e31e24 2px, transparent 2px, transparent 20px)`,
            }}></div>
          </div>

          <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="flex items-center justify-center space-x-3 mb-6">
              </div>
              <h2 className="text-white text-4xl lg:text-5xl tracking-tight mb-4">
                {industry.title} Solutions
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Precision-engineered sealing systems designed for the most demanding applications
              </p>
            </motion.div>

            {/* Main Image with Parallax Effect */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Main large image */}
              <div className="relative group">
                <div className="aspect-[16/8] overflow-hidden">
                  <ImageWithFallback
                    src={industryImages[slug]}
                    alt={`${industry.title} Sealing Solutions`}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                  />

                  {/* Gradient overlays for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1918] via-transparent to-transparent opacity-60"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1a1918]/40 via-transparent to-[#1a1918]/40"></div>

                  {/* Top border accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#e31e24] to-transparent"></div>

                  {/* Bottom content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#1a1918]/95 to-transparent">
                    <div className="max-w-4xl">
                      <h3 className="text-white text-2xl lg:text-3xl font-bold mb-3">
                        Industry-Leading Performance
                      </h3>
                      <p className="text-gray-300 text-sm lg:text-base">
                        Engineered for extreme conditions, tested for reliability, trusted worldwide
                      </p>
                    </div>
                  </div>
                </div>

                {/* Corner decorative elements */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#e31e24]"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#e31e24]"></div>
              </div>

            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section ref={ctaSectionRef} className="py-24 bg-[#2b2a29]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-[#1a1918] to-[#0f0f0f] border-2 border-[#e31e24]/30 rounded-xl p-12 lg:p-16 text-center"
          >
            <h2 className="text-white text-3xl lg:text-4xl mb-4 tracking-tight">
              Need a Custom Sealing Solution?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Our engineering team is ready to help you find the perfect sealing solution for your {industry.title.toLowerCase()} application.
            </p>
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-[#e31e24] text-white tracking-wide hover:bg-[#c41a20] transition-all duration-300 flex items-center space-x-2 mx-auto"
              >
                <span>Contact Our Engineers</span>
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Related Industries */}
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
                Related Industries
              </span>
            </div>
            <h2 className="text-white text-3xl lg:text-4xl tracking-tight">
              Explore Other Industries
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedIndustries.map((relatedIndustry, index) => (
              <Link key={relatedIndustry.id} to={`/industries/${relatedIndustry.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="group relative h-[400px] overflow-hidden cursor-pointer"
                >
                  {/* Image */}
                  <ImageWithFallback
                    src={relatedIndustry.image}
                    alt={relatedIndustry.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2b2a29] via-[#2b2a29]/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

                  {/* Top-Left Corner Gradient for Title Contrast */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#2b2a29]/70 via-[#2b2a29]/40 to-transparent opacity-90"></div>

                  {/* Red Accent Line */}
                  <motion.div
                    className="absolute top-0 left-0 w-full h-1 bg-[#e31e24] origin-left"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.05 + 0.3 }}
                  />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col px-8 py-4">
                    <div className="flex flex-col justify-content transition-transform duration-300 group-hover:translate-y-[-3px]" style={{justifyContent: 'space-between', height: '90%'}}>
                      <h3 className="text-2xl text-white mb-2 tracking-tight" style={{ fontSize: '2rem', width: '85%' }}>{relatedIndustry.title}</h3>
                      {relatedIndustry.subtitle && (
                        <p className="text-[#e31e24] text-sm mb-3 tracking-wide">{relatedIndustry.subtitle}</p>
                      )}
                      <p className="text-gray-300 leading-relaxed opacity-90" style={{textAlign: 'center'}}>{relatedIndustry.description}</p>
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
    </main>
  );
}
