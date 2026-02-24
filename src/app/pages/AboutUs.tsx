import { motion } from 'motion/react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { CheckCircle2, Target, Eye, Lightbulb, Users, Recycle, TrendingUp, Shield, Award } from 'lucide-react';

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
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Industrial Manufacturing"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute top-0 left-0 w-full h-1 bg-[#e31e24]"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-[#2b2a29]">
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
                <span className="text-sm tracking-widest text-gray-400 uppercase">Our Story</span>
              </div>

              <h2 className="text-white text-4xl lg:text-5xl mb-8 tracking-tight">
                Since 1982
              </h2>

              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <p>
                  Founded with the vision to bridge the gap between international standards and regional industrial needs, Inmarco FZC has grown from a family-led enterprise into a globally trusted partner for advanced sealing applications.
                </p>
                <p>
                  Through years of field experience and collaboration with OEMs, maintenance teams, and process engineers, we have developed a portfolio of tested, certified, and high-performance sealing products built for operational endurance and environmental responsibility.
                </p>
                <p>
                  From our strategic base in Sharjah Free Zone, we support customers across the Middle East, Africa, Central Asia, and beyond - combining geographical advantage with deep engineering competence.
                </p>
              </div>
            </motion.div>
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
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Global Network"
                className="w-full h-[400px] object-cover"
              />
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
