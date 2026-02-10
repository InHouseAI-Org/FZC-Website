import { motion } from 'motion/react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react';
import industriesData from '@/data/industries.json';

export default function IndustryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const industry = industriesData.industries.find((ind) => ind.slug === slug);

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

  // Get related industries (exclude current one)
  const relatedIndustries = industriesData.industries
    .filter((ind) => ind.id !== industry.id)
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
        <div className="absolute inset-0 bg-gradient-to-r from-[#2b2a29]/95 via-[#2b2a29]/80 to-[#2b2a29]/60"></div>

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
                    className="flex items-start space-x-3 text-gray-300"
                  >
                    <div className="w-2 h-2 bg-[#e31e24] rounded-full mt-2 flex-shrink-0"></div>
                    <span className="leading-relaxed">{challenge}</span>
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
      <section className="py-24 bg-[#1a1918]">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industry.applications.map((application, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-[#2b2a29] border border-gray-800 hover:border-[#e31e24]/50 p-6 transition-all duration-300"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedIndustries.map((relatedIndustry, index) => (
              <Link key={relatedIndustry.id} to={`/industries/${relatedIndustry.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative h-[300px] overflow-hidden cursor-pointer"
                >
                  <ImageWithFallback
                    src={relatedIndustry.image}
                    alt={relatedIndustry.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2b2a29] via-[#2b2a29]/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-xl text-white mb-2 tracking-tight group-hover:text-[#e31e24] transition-colors">
                      {relatedIndustry.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {relatedIndustry.description}
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
