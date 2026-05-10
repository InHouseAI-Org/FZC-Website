'use client';

import { motion } from 'motion/react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

export function Industries() {
  const industries = [
    {
      title: 'Oil & Gas',
      description: 'Sealing solutions for upstream, midstream, and downstream operations',
      image: 'https://images.unsplash.com/photo-1655763161700-8f284f0ceca9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvaWwlMjBnYXMlMjBpbmR1c3RyaWFsJTIwcGxhbnR8ZW58MXx8fHwxNzY5NjI2ODU2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      title: 'Power Generation',
      description: 'High-temperature sealing for turbines, boilers, and generation equipment',
      image: 'https://images.unsplash.com/photo-1675114424808-72a0b86030ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGdlbmVyYXRpb24lMjB0dXJiaW5lfGVufDF8fHx8MTc2OTYyNjg1Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      title: 'Petrochemical',
      description: 'Chemical-resistant sealing for reactors, pumps, and processing units',
      image: 'https://images.unsplash.com/photo-1768564206500-5cddb1fea679?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXRyb2NoZW1pY2FsJTIwcGxhbnQlMjBpbmR1c3RyeXxlbnwxfHx8fDE3Njk2MjY4NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      title: 'Mining',
      description: 'Durable sealing solutions for extreme mining environments and heavy equipment',
      image: 'https://images.unsplash.com/photo-1759850425285-46f70357253d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbmclMjBlcXVpcG1lbnQlMjBoZWF2eSUyMG1hY2hpbmVyeXxlbnwxfHx8fDE3Njk1MzM2MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      title: 'Heavy Industry',
      description: 'Industrial sealing for process plants, refineries, and manufacturing facilities',
      image: 'https://images.unsplash.com/photo-1768779611359-c4bb38ba3c1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwcHVtcCUyMGVxdWlwbWVudHxlbnwxfHx8fDE3Njk2MjY4NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  return (
    <section id="industries" className="bg-[#1a1918] py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-3 mb-4"
          >
            <div className="h-[2px] w-12 bg-[#e31e24]"></div>
            <span className="text-sm tracking-widest text-gray-400 uppercase">Industries We Serve</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: '1.2', letterSpacing: '-0.01em' }}
          >
            Engineering Excellence Across Critical Sectors
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-lg"
          >
            Trusted by industry leaders worldwide for mission-critical sealing applications.
          </motion.p>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
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
                transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="transform transition-transform duration-300 group-hover:translate-y-[-10px]">
                  <h3 className="text-2xl text-white mb-3 tracking-tight">{industry.title}</h3>
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
          ))}
        </div>
      </div>
    </section>
  );
}
