import { motion } from 'motion/react';
import { ArrowRight, Mail, Phone } from 'lucide-react';

export function CTASection() {
  return (
    <section id="contact" className="relative bg-[#1a1918] py-32 overflow-hidden">
      {/* Animated Background Lines */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-[2px] bg-gradient-to-r from-transparent via-[#e31e24] to-transparent"
            style={{ 
              top: `${20 + i * 20}%`,
              width: '200%',
            }}
            animate={{ 
              x: ['-100%', '0%'],
            }}
            transition={{ 
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 
              className="text-white mb-6"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: '1.1', letterSpacing: '-0.02em' }}
            >
              Let's Solve Your{' '}
              <span className="relative inline-block">
                Sealing Challenge
                <motion.span
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-[#e31e24]"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto"
          >
            Whether you need a standard solution or custom engineering, our team is ready to deliver 
            precision-engineered sealing systems for your critical applications.
          </motion.p>

          {/* Primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12"
          >
            <button className="group inline-flex items-center space-x-3 px-10 py-5 bg-[#e31e24] text-white text-lg tracking-wide hover:bg-[#c41a20] transition-all duration-300 hover:scale-105">
              <span>Talk to an Engineer</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>

          {/* Contact Options */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-400"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-[#2b2a29]">
                <Phone className="w-5 h-5 text-[#e31e24]" />
              </div>
              <div className="text-left">
                <div className="text-xs text-gray-500 uppercase tracking-wide">Call Us</div>
                <div className="text-white">+971 55 948 7218</div>
              </div>
            </div>

            <div className="hidden sm:block w-[2px] h-12 bg-gray-700"></div>

            <div className="flex items-center space-x-3">
              <div className="p-3 bg-[#2b2a29]">
                <Mail className="w-5 h-5 text-[#e31e24]" />
              </div>
              <div className="text-left">
                <div className="text-xs text-gray-500 uppercase tracking-wide">Email Us</div>
                <div className="text-white">info@inmarco.ae</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Decorative Elements */}
        <div className="mt-20 flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-[#e31e24]"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
