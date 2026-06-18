'use client';

import { motion } from 'motion/react';
import { Award, Shield, Gauge, FileCheck } from 'lucide-react';

export function CompanyOverview() {
  const expertise = [
    {
      area: "Low Emission Technology",
      detail: "API 622 compliant graphite packings achieving <20 ppm fugitive emissions"
    },
    {
      area: "Application Engineering",
      detail: "Technical support for valve, pump,agitator and other dynamic & static seal selection"
    },
    {
      area: "Emerging Sectors",
      detail: "Support for renewable energy, hydrogen, carbon capture and other advanced manufacturing applications"
    },
    {
      area: "Extreme Conditions",
      detail: "Sealing solutions rated for temperatures up to 650°C and pressures to 350 bar. Static sealing upto 1360°C temperature"
    },
    {
      area: "Certified Manufacturing",
      detail: "API 622, API 607, EN 16752 and ISO standards with full traceability"
    }
  ];

  const differentiators = [
    {
      icon: Shield,
      metric: "API Certified",
      value: "622, 624, 641, 607",
      description: "Low emission & fire-safe qualifications"
    },
    {
      icon: Gauge,
      metric: "Performance Range",
      value: "-196°C to 538°C / 425 Bar",
      description: "Extreme temperature & pressure rated"
    },
    {
      icon: FileCheck,
      metric: "Compliance",
      value: "ISO 15848 / EN 16752 / TA-Luft",
      description: "European emission standards certified"
    },
    {
      icon: Award,
      metric: "Management System",
      value: "ISO 9001 Certified",
      description: "Defined quality management system"
    }
  ];

  return (
    <section id="about" className="relative py-32 overflow-hidden">
      

      {/* Background Video with Gradient Overlay */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="https://d24gq0kplkhyxr.cloudfront.net/assets/products/GB2-poster.jpg"
          className="w-full h-full object-cover"
        >
          <source src="https://d24gq0kplkhyxr.cloudfront.net/assets/products/GB2.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-[#2b2a29]/10 via-[#2b2a29]/20 to-[#2b2a29]/30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2b2a29]/20 to-[#2b2a29]/75"></div>
      </div>

      {/* Animated Floating Elements */}
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 bg-[#e31e24]/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-96 h-96 bg-[#e31e24]/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      <div className="relative z-30 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Header - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="h-[2px] w-12 bg-[#e31e24]"></div>
            <span className="text-sm tracking-widest text-gray-300 uppercase" style={{ fontFamily: 'SwitzerlandCondBlack, Switzerland, sans-serif', fontSize:'15px' }}>INMARCO</span>
            <div className="h-[2px] w-12 bg-[#e31e24]"></div>
          </div>
          <h2
            className="text-white mb-6"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: '1.2', letterSpacing: '-0.01em' }}
          >
            Where Reliability is Engineered,<br />Not Assumed
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
            Specialized manufacturer of compression packings, gaskets, and sealing systems for critical industrial applications.
            From API-certified low emission solutions to fire-safe rated products-engineered for heat, pressure, and chemical compatibility.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20">
          {/* Left: Technical Expertise */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl text-white mb-8 font-light">Core Technical Capabilities</h3>

            {/* Expertise Areas */}
            <div className="space-y-6 mb-12">
              {expertise.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative pl-6 border-l-2 border-[#e31e24]/30 hover:border-[#e31e24] transition-colors group"
                >
                  <div className="absolute -left-[5px] top-2 w-2 h-2 bg-[#e31e24] rounded-full group-hover:scale-150 transition-transform" />
                  <h4 className="text-white text-base mb-2 font-medium">{item.area}</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{item.detail}</p>
                </motion.div>
              ))}
            </div>

            {/* Key Milestones */}
            <div className="flex justify-center sm:justify-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-center p-6 bg-[#1a1918]/40 backdrop-blur-sm border border-[#e31e24] rounded w-full sm:w-auto min-w-[200px]"
              >
                <div className="text-3xl md:text-2xl text-white mb-2 font-light">Since 1982</div>
                <div className="text-sm md:text-xs text-[#e31e24] uppercase tracking-wider">Established</div>
              </motion.div>


              {/*<motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-center p-4 bg-[#1a1918]/40 backdrop-blur-sm border border-[#e31e24] rounded"
              >
                <div className="text-2xl text-white mb-1 font-light">GCC + Asia</div>
                <div className="text-xs text-[#e31e24] uppercase tracking-wider">Regional Reach</div>
              </motion.div>*/}
            </div>
          </motion.div>

        </div>

        {/* Technical Differentiators - Full Width */}
        <div>
          <h3 className="text-2xl text-white mb-8 text-center font-light">Technical Standards & Certifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {differentiators.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative group"
                >
                  {/* Subtle glow on hover */}
                  <div className="absolute inset-0 bg-[#e31e24]/5 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity blur-xl" />

                  <div className="relative bg-[#1a1918]/60 backdrop-blur-sm border border-gray-800 rounded-lg p-6 hover:border-[#e31e24]/50 transition-all h-full">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded bg-[#e31e24]/10 flex items-center justify-center mb-4 group-hover:bg-[#e31e24]/20 transition-colors">
                      <Icon className="w-6 h-6 text-[#e31e24]" />
                    </div>

                    {/* Metric Label */}
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{item.metric}</div>

                    {/* Value */}
                    <div className="text-xl text-white mb-3 font-light">{item.value}</div>

                    {/* Description */}
                    <p className="text-gray-400 text-xs leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
