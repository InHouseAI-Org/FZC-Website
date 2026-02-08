import { motion } from 'motion/react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { ChevronRight, Play } from 'lucide-react';

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center bg-[#2b2a29] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1759148414485-5f624fe9d1ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwdmFsdmUlMjBtYWNoaW5lcnl8ZW58MXx8fHwxNzY5NjI2ODU1fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Industrial valve and machinery"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2b2a29]/95 via-[#2b2a29]/85 to-[#2b2a29]/70"></div>
      </div>

      {/* Animated Grid Pattern */}
      <motion.div
        className="absolute inset-0 opacity-10"
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </motion.div>

      {/* Animated Red Accent Line */}
      <motion.div
        className="absolute top-0 left-0 w-1 bg-[#e31e24] origin-top"
        initial={{ height: 0 }}
        animate={{ height: '100%' }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 py-20 w-full">
        <div className="max-w-4xl">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-3 mb-6"
          >
            <div className="h-[2px] w-12 bg-[#e31e24]"></div>
            <span className="text-sm tracking-widest text-gray-400 uppercase">Innovation in Industrial Fluid Sealing</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 text-white"
            style={{ 
              fontSize: 'clamp(2.5rem, 6vw, 5rem)', 
              lineHeight: '1.1',
              letterSpacing: '-0.02em'
            }}
          >
            Engineering Reliability for a{' '}
            <motion.span
              className="inline-block text-[#e31e24]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0 }}
              whileHover={{
                textShadow: "0 0 20px rgba(227, 30, 36, 0.5)"
              }}
            >
              Fluid World
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-300 mb-10 max-w-2xl"
            style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', lineHeight: '1.6' }}
          >
            Advanced fluid sealing solutions designed for extreme pressure, temperature, and performance.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <button className="group px-8 py-4 bg-[#e31e24] text-white tracking-wide hover:bg-[#c41a20] transition-all duration-300 flex items-center space-x-2">
              <span>Talk to an Engineer</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="group px-8 py-4 border-2 border-white text-white tracking-wide hover:bg-white hover:text-[#2b2a29] transition-all duration-300 flex items-center space-x-2">
              <Play className="w-4 h-4" />
              <span>Explore Solutions</span>
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: '30+', label: 'Years Experience' },
              { value: '12', label: 'Core Industries' },
              { value: '1000+', label: 'Custom Solutions' },
              { value: '99.8%', label: 'Reliability Rate' },
            ].map((stat, index) => (
              <div key={index} className="border-l-2 border-[#e31e24] pl-4">
                <div className="text-3xl text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400 tracking-wide uppercase">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <span className="text-xs text-gray-400 tracking-widest uppercase">Scroll</span>
        <motion.div
          className="w-[2px] h-12 bg-gradient-to-b from-[#e31e24] to-transparent"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Bottom Gradient for Smooth Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#2b2a29] to-transparent z-10"></div>
    </section>
  );
}
