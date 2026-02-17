import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Award, Target, Users, Zap } from 'lucide-react';

export function WhyInmarco() {
  const differentiators = [
    {
      icon: Zap,
      title: 'Low Emission Technology',
      description: 'Advanced sealing designs that reduce fugitive emissions and support environmental compliance.',
      number: '01',
    },
    {
      icon: Award,
      title: 'Certified Quality',
      description: 'ISO-certified manufacturing with rigorous testing protocols and quality assurance at every stage.',
      number: '02',
    },
    {
      icon: Target,
      title: 'Application Expertise',
      description: 'Deep technical knowledge across industries with proven solutions for the most demanding applications.',
      number: '03',
    },
    {
      icon: Users,
      title: 'Engineering Support',
      description: 'Dedicated technical team providing consultation, field support, and custom solution development.',
      number: '04',
    },
  ];

  return (
    <section className="relative bg-[#1a1918] py-32 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-[#e31e24]/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-[#e31e24]/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Floating geometric shapes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 border-2 border-[#e31e24]/20"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 30}%`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 180, 360],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center space-x-3 mb-4"
          >
            <div className="h-[2px] w-12 bg-[#e31e24]"></div>
            <span className="text-sm tracking-widest text-gray-400 uppercase">Why Inmarco</span>
            <div className="h-[2px] w-12 bg-[#e31e24]"></div>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: '1.2', letterSpacing: '-0.01em' }}
          >
            The <span className="text-red-500 uppercase" style={{fontFamily: 'SwitzerlandCondBlack, Switzerland, sans-serif', fontWeight: 800}}>Inmarco</span> Difference
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-lg"
          >
            Combining engineering precision with decades of field-proven reliability
          </motion.p>
        </div>

        {/* Differentiators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {differentiators.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group relative"
              >
                {/* Card Background with Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#2b2a29] to-[#1a1918] rounded-xl border border-gray-800 group-hover:border-[#e31e24]/50 transition-all duration-500"></div>
                <div className="absolute inset-0 bg-[#e31e24]/0 group-hover:bg-[#e31e24]/5 rounded-xl transition-all duration-500"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-[#e31e24]/10 to-transparent rounded-xl blur-xl transition-opacity duration-500"></div>

                <div className="relative p-8 text-center">
                  {/* Number Badge */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 + 0.3 }}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#e31e24]/10 group-hover:bg-[#e31e24]/20 flex items-center justify-center border border-[#e31e24]/30 transition-all duration-300"
                  >
                    <span className="text-[#e31e24] text-sm font-bold">{item.number}</span>
                  </motion.div>

                  {/* Icon Container */}
                  <motion.div
                    className="relative inline-flex items-center justify-center mb-6 p-10"
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                  >
                    {/* Background Circle */}
                    <div className="absolute w-20 h-20 bg-[#2b2a29] rounded-full group-hover:bg-[#e31e24] transition-all duration-500 group-hover:scale-110"></div>

                    {/* Pulsing Ring */}
                    <motion.div
                      className="absolute w-20 h-20 border-2 border-[#e31e24] rounded-full"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                    />

                    {/* Icon */}
                    <motion.div
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="relative w-9 h-9 text-[#e31e24] group-hover:text-white transition-colors duration-300" />
                    </motion.div>
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl text-white mt-10 mb-3 tracking-tight font-light group-hover:text-[#e31e24] transition-colors duration-300">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors duration-300">{item.description}</p>

                  {/* Accent Line with Animation */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.15 + 0.5 }}
                    className="mt-6 h-[2px] bg-gradient-to-r from-transparent via-[#e31e24] to-transparent origin-center"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6, type: "spring" }}
          className="relative mt-24 overflow-hidden rounded-xl"
        >
          {/* Animated Background Gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#e31e24]/10 via-[#e31e24]/5 to-[#e31e24]/10"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: "200% 100%"
            }}
          />

          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#e31e24]/20 via-transparent to-[#e31e24]/10"></div>

          <div className="relative bg-[#2b2a29] border-l-4 border-[#e31e24] p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-6 lg:mb-0">
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-3xl text-white mb-2 font-light"
              >
                Ready to discuss your sealing challenge?
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="text-gray-400 flex items-center space-x-2"
              >
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>Our engineering team is standing by to help.</span>
              </motion.p>
            </div>

            <Link to="/contact">
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.1, delay: 0 }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(227, 30, 36, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="relative px-10 py-4 bg-[#e31e24] text-white tracking-wide overflow-hidden whitespace-nowrap group"
              >
                {/* Button shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                />
                <span className="relative z-10">Contact Our Engineers</span>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
