'use client';

import { motion } from 'motion/react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { CheckCircle2, Target, Eye, Lightbulb, Users, Recycle, TrendingUp, Shield, Award } from 'lucide-react';
import inmarcoLogo from '@/assets/inmarco-tagline-logo1.webp';

export default function AboutUs() {
  const coreValues = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We continuously push boundaries by combining materials science and engineering expertise to deliver high-performance sealing solutions for mission-critical applications.',
    },
    {
      icon: Users,
      title: 'Customer Partnership',
      description: 'We work hand-in-hand with our customers, understanding their needs and delivering tailored solutions that drive their success.',
    },
    {
      icon: Recycle,
      title: 'Sustainability',
      description: 'We are committed to developing eco-friendly sealing technologies that protect resources and reduce environmental impact.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Our culture thrives on technical, operational, and service excellence, ensuring reliability and quality in every product.',
    },
    {
      icon: Shield,
      title: 'Integrity',
      description: 'We uphold transparency, trust, and ethical practices in all our dealings.',
    },
    {
      icon: TrendingUp,
      title: 'Continuous Improvement',
      description: 'We embrace a mindset of learning and growth, striving to improve processes, products, and performance every day in partnership with our customers and business associates.',
    },
    {
      icon: Target,
      title: 'Visionary Leadership',
      description: 'Guided by the foresight of our leadership, we set industry benchmarks and inspire progress across global markets.',
    },
  ];

  const differentiators = [
    {
      title: 'Low Emission Technology',
      description: 'Our API/ISO compliant graphite and PTFE packings uplift the regional standard for emission control.',
    },
    {
      title: 'Certified Quality',
      description: 'Products tested to international standards such as EN 16752, API 622, 624, 641, 607, emission & fire-safe performance benchmarks.',
    },
    {
      title: 'Application Expertise',
      description: 'Decades of experience across pumps, valves, mixers, and other static & dynamic seals - supported by on-site engineering advice.',
    },
    {
      title: 'Local Presence, Global Standards',
      description: 'Manufactured and distributed from the UAE, ensuring fast access and world-class reliability.',
    },
  ];

  return (
    <main className="bg-[#2b2a29]">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
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
              <h1 className="text-white mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: '1.1', letterSpacing: '-0.02em', maxWidth: '800px' }}>
                Engineering Reliability. <span className="text-[#e31e24]">Delivering Precision.</span>
              </h1>
              <p className="text-gray-300 text-xl max-w-2xl">
                Every Inmarco product reflects our belief that reliability is engineered - not assumed.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-24 bg-[#1a1918]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-white text-4xl lg:text-5xl mb-6 tracking-tight">
                Who We Are
              </h2>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                Inmarco FZC is an engineering-led manufacturer and solution provider specializing in industrial fluid sealing systems - from compression packings and gaskets to custom-engineered sealing materials for pumps, valves, and other critical process equipment.
              </p>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                Headquartered in the UAE, we serve a broad spectrum of industries including Oil & Gas, Petrochemical, Power Generation, Chemical Porcessing, Fertilizer, Mining and other process industries and utilities, providing performance-driven sealing solutions designed to meet the challenges of heat, pressure, chemical compatibility, and emission control.
              </p>
              <div className="space-y-3">
                {[
                  '30+ years of industrial sealing expertise',
                  'Mission-critical solutions for extreme conditions',
                  'ISO certified manufacturing and quality standards',
                  'Rigorous testing and proven application field performance',
                ].map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <CheckCircle2 className="w-6 h-6 text-[#e31e24] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{point}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative w-full h-[500px] bg-[#1a1918] overflow-hidden flex items-center justify-center">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, #e31e24 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                  }}></div>
                </div>

                {/* Animated Logo */}
                <div className="relative z-10">
                  {/* Animated particles/fragments */}
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{
                        opacity: 0,
                        x: (i % 4 - 1.5) * 100,
                        y: (Math.floor(i / 4) - 1.5) * 100,
                        scale: 0
                      }}
                      whileInView={{
                        opacity: [0, 0.6, 0],
                        x: 0,
                        y: 0,
                        scale: [0, 1, 0]
                      }}
                      viewport={{ once: true, amount: 1, margin: "-200px 0px -200px 0px" }}
                      transition={{
                        duration: 2,
                        delay: i * 0.05,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      className="absolute left-1/2 top-1/2 w-1 h-1 bg-[#e31e24] rounded-full"
                      style={{ transformOrigin: 'center' }}
                    />
                  ))}

                  {/* Logo with sophisticated reveal */}
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 0.92,
                      filter: 'blur(40px) brightness(0.3)',
                    }}
                    whileInView={{
                      opacity: 1,
                      scale: 1,
                      filter: 'blur(0px) brightness(1)',
                    }}
                    viewport={{ once: true, amount: 1, margin: "-200px 0px -200px 0px" }}
                    transition={{
                      duration: 2.5,
                      delay: 0.4,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="relative"
                  >
                    <motion.div
                      initial={{ clipPath: 'polygon(0 50%, 100% 50%, 100% 50%, 0 50%)' }}
                      whileInView={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
                      viewport={{ once: true, amount: 1, margin: "-200px 0px -200px 0px" }}
                      transition={{
                        duration: 2,
                        delay: 0.6,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                    >
                      <img
                        src={inmarcoLogo.src || inmarcoLogo}
                        alt="Inmarco FZC"
                        className="h-80 md:h-80 w-auto object-contain"
                      />
                    </motion.div>

                    {/* Subtle light sweep */}
                    <motion.div
                      initial={{ x: '-100%', opacity: 0 }}
                      whileInView={{ x: '200%', opacity: [0, 0.3, 0] }}
                      viewport={{ once: true, amount: 1, margin: "-200px 0px -200px 0px" }}
                      transition={{
                        duration: 1.5,
                        delay: 2,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                      style={{ mixBlendMode: 'overlay' }}
                    />
                  </motion.div>

                </div>

                {/* Subtle glow effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.5, delay: 0.5 }}
                  className="absolute inset-0 bg-gradient-radial from-[#e31e24]/20 via-transparent to-transparent"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(227, 30, 36, 0.15) 0%, transparent 70%)'
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-[#2b2a29]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left side - Timeline */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="h-[2px] w-12 bg-[#e31e24]"></div>
                  <span className="text-sm tracking-widest text-gray-400 uppercase">Our Story</span>
                </div>

                <h2 className="text-white text-4xl lg:text-5xl mb-12 tracking-tight">
                  Since 1982
                </h2>
              </motion.div>

              {/* Timeline */}
              <div className="relative pl-8 space-y-6">
                {/* Vertical line */}
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                  className="absolute left-0 top-0 w-[2px] bg-gradient-to-b from-[#e31e24] to-transparent"
                />

                {/* Milestones */}
                {[
                  { year: '1982', text: 'Founded as a family-led enterprise' },
                  { year: '1990s', text: 'Expanded into Middle East markets' },
                  { year: '2000s', text: 'Achieved API certifications' },
                  { year: 'Today', text: 'Global partner serving 50+ countries' },
                ].map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.15 }}
                    className="relative group"
                  >
                    {/* Dot */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.15 }}
                      className="absolute -left-[33px] top-1 w-3 h-3 bg-[#e31e24] rounded-full border-4 border-[#2b2a29] group-hover:scale-125 transition-transform"
                    />

                    <div className="bg-[#1a1918] p-4 border-l-2 border-transparent group-hover:border-[#e31e24] transition-all duration-300">
                      <div className="text-[#e31e24] font-bold text-sm mb-1">{milestone.year}</div>
                      <div className="text-gray-300 text-sm">{milestone.text}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right side - Story paragraphs */}
            <div className="space-y-6">
              {[
                'Founded with the vision to bridge the gap between international standards and regional industrial needs, Inmarco FZC has grown from a family-led enterprise into a globally trusted partner for advanced sealing applications.',
                'Through years of field experience and collaboration with OEMs, maintenance teams, and process engineers, we have developed a portfolio of tested, certified, and high-performance sealing products built for operational endurance and environmental responsibility.',
                'From our strategic base in Sharjah Free Zone, we support customers across the Middle East, Africa, Central Asia, and beyond - combining geographical advantage with deep engineering competence.',
              ].map((text, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                >
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {text}
                  </p>
                </motion.div>
              ))}

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-800"
              >
                {[
                  { number: '30+', label: 'Years Experience' },
                  { number: '12+', label: 'Industries Served' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                    className="text-center group"
                  >
                    <div className="text-3xl font-bold text-[#e31e24] mb-2 group-hover:scale-110 transition-transform">
                      {stat.number}
                    </div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-[#1a1918]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#2b2a29] p-10 border-t-4 border-[#e31e24]"
            >
              <Target className="w-12 h-12 text-[#e31e24] mb-6" />
              <h3 className="text-white text-2xl mb-4 tracking-tight">Our Mission</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                To engineer sealing solutions that deliver long-term reliability, ensure process safety, and align with evolving environmental and emission standards worldwide.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[#2b2a29] p-10 border-t-4 border-[#e31e24]"
            >
              <Eye className="w-12 h-12 text-[#e31e24] mb-6" />
              <h3 className="text-white text-2xl mb-4 tracking-tight">Our Vision</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                To become a globally recognized industrial sealing brand from the Middle East - integrating technology, materials science, and digital intelligence to redefine reliability.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Difference */}
      <section className="py-24 bg-[#2b2a29]">
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
              <span className="text-sm tracking-widest text-gray-400 uppercase">What Sets Us Apart</span>
            </div>
            <h2 className="text-white text-4xl lg:text-5xl tracking-tight">
              Our Difference
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {differentiators.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-[#1a1918] p-8 border-l-2 border-[#e31e24] hover:bg-[#252423] transition-colors duration-300"
              >
                <h3 className="text-white text-xl mb-3 tracking-tight">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
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
              <span className="text-sm tracking-widest text-gray-400 uppercase">Our Foundation</span>
            </div>
            <h2 className="text-white text-4xl lg:text-5xl tracking-tight">
              Core Values
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-[#2b2a29] p-8 hover:bg-[#252423] transition-colors duration-300 group"
                >
                  <Icon className="w-10 h-10 text-[#e31e24] mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-white text-xl mb-3 tracking-tight">{value.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Footprint */}
      <section className="py-24 bg-[#2b2a29]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-[2px] w-12 bg-[#e31e24]"></div>
                <span className="text-sm tracking-widest text-gray-400 uppercase">Global Reach</span>
              </div>

              <h2 className="text-white text-4xl lg:text-5xl mb-6 tracking-tight">
                Our Footprint
              </h2>

              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                With an expanding network across <span className="text-[#e31e24]">Central Asia, Africa and the GCC</span>, Inmarco FZC delivers regional support backed by centralized technical excellence.
              </p>

              <p className="text-gray-300 text-lg leading-relaxed">
                We are actively building partnerships with distributors, maintenance contractors, and valve service houses to bring sealing technology closer to end users - with local stock, engineering support, and training.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* World Map */}
              <div className="w-full h-[400px] rounded-lg overflow-hidden relative">
                <img
                  src="/worldwide-global-map-outline-black-background/sl_070722_51460_20.jpg"
                  alt="World Map"
                  className="w-full h-full object-contain"
                  style={{
                    filter: 'brightness(0.7) contrast(1.1) sepia(0.3) hue-rotate(-10deg) saturate(1.2)',
                  }}
                />



                {/* Headquarters Marker */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="absolute top-1/2 left-[63%] transform -translate-x-1/2 -translate-y-1/2"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 0.3, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute w-16 h-16 bg-[#e31e24] rounded-full -translate-x-1/2 -translate-y-1/2"
                  />
                  <div className="relative w-8 h-8 bg-[#e31e24] rounded-full border-4 border-white shadow-lg flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </motion.div>

                {/* Overlay text */}

                {/* Legend */}
                <div className="absolute bottom-15 left-1 bg-transparent rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-4 h-4 bg-[#e31e24] rounded-full"></div>
                    <span className="text-white text-[12px] font-semibold">Headquarters - UAE</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sustainability & Future */}
      <section className="py-24 bg-[#1a1918]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-[2px] w-12 bg-[#e31e24]"></div>
                <span className="text-sm tracking-widest text-gray-400 uppercase">Looking Ahead</span>
              </div>

              <h2 className="text-white text-4xl lg:text-5xl mb-8 tracking-tight">
                Sustainability & Future
              </h2>

              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <p>
                  Leakage control is not just about efficiency - it's about responsibility.
                </p>
                <p>
                  Inmarco FZC is committed to reducing emissions, conserving energy, and supporting global sustainability goals through engineered sealing solutions that perform reliably under pressure.
                </p>
                <p>
                  Looking ahead, we are pioneering the integration of artificial intelligence and digital technologies into industrial sealing. Through AI-powered product selection tools, predictive analytics for reliability forecasting, and intelligent recommendation systems, we're transforming how engineers specify, select, and maintain critical sealing components.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </main>
  );
}
