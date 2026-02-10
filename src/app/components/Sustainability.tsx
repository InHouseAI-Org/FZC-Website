import { motion } from 'motion/react';
import { Leaf, Droplets, Shield, Zap, Sparkles } from 'lucide-react';

export function Sustainability() {
  const sustainabilityFeatures = [
    {
      icon: Droplets,
      title: 'API 622 Low-Emission Certification',
      description: 'Graphite packings achieving <20 ppm fugitive emissions-setting regional standards for environmental compliance',
      metric: '<20 ppm',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: Shield,
      title: 'Non-Asbestos Eco-Friendly Materials',
      description: 'Sustainable material compositions without compromising thermal or chemical performance',
      metric: '100%',
      color: 'from-teal-500 to-cyan-600',
    },
    {
      icon: Zap,
      title: 'Extended Service Life',
      description: 'Engineered durability reduces replacement frequency, waste generation, and lifecycle environmental impact',
      metric: '3x Longer',
      color: 'from-lime-500 to-green-600',
    },
  ];

  const impactStats = [
    { value: '85%', label: 'Emission Reduction', color: 'text-green-400' },
    { value: '60%', label: 'Energy Conservation', color: 'text-emerald-400' },
    { value: 'API 622', label: 'Certified Standards', color: 'text-teal-400' },
  ];

  return (
    <section id="sustainability" className="relative py-32 overflow-hidden bg-[#2b2a29]">
      {/* Background Video/Image with Green Gradient Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#2b2a29]/95 via-green-900/20 to-[#2b2a29]/90"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#2b2a29] via-transparent to-[#2b2a29]/50"></div>
      </div>

      {/* Animated Green Floating Elements */}
      <motion.div
        className="absolute top-20 right-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Animated Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-green-400/30 rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}

      <div className="relative z-30 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-green-500"></div>
            <Sparkles className="w-5 h-5 text-green-400" />
            <span className="text-sm tracking-widest text-green-400 uppercase font-medium">Sustainability & Responsibility</span>
            <Sparkles className="w-5 h-5 text-green-400" />
            <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-green-500"></div>
          </div>
          <h2
            className="text-white mb-6"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: '1.2', letterSpacing: '-0.01em' }}
          >
            Leakage Control is<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400">
              Environmental Responsibility
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
            Reducing emissions, conserving energy, and supporting global sustainability goals through engineered sealing solutions that perform reliably under pressure - because every seal protects people, processes, and the planet.
          </p>
        </motion.div>

        {/* Impact Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
          {impactStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
              <div className="relative bg-[#1a1918]/60 backdrop-blur-sm border border-green-500/20 group-hover:border-green-500/50 rounded-lg p-8 text-center transition-all">
                <motion.div
                  className={`text-5xl font-light mb-2 ${stat.color}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Sustainability Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {sustainabilityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className="relative group"
              >
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`}></div>

                <div className="relative bg-[#1a1918]/80 backdrop-blur-sm border border-gray-800 group-hover:border-green-500/50 rounded-lg p-8 h-full transition-all duration-300">
                  {/* Icon with gradient background */}
                  <motion.div
                    className={`w-16 h-16 rounded-lg bg-gradient-to-br ${feature.color} p-0.5 mb-6`}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="w-full h-full bg-[#1a1918] rounded-lg flex items-center justify-center">
                      <Icon className="w-8 h-8 text-green-400" />
                    </div>
                  </motion.div>

                  {/* Metric Badge */}
                  <div className="inline-block mb-4">
                    <div className={`px-4 py-1 rounded-full bg-gradient-to-r ${feature.color} text-white text-sm font-medium`}>
                      {feature.metric}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl text-white mb-3 font-light">{feature.title}</h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>

                  {/* Animated underline */}
                  <motion.div
                    className={`h-1 bg-gradient-to-r ${feature.color} mt-6 origin-left`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                  ></motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 backdrop-blur-sm border border-green-500/20 rounded-lg p-8">
            <Leaf className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <p className="text-gray-300 text-lg mb-4 max-w-2xl">
              Investing in <span className="text-green-400 font-medium">digital transformation</span> and <span className="text-green-400 font-medium">AI integration</span> to enhance reliability forecasting and support sustainable industrial operations worldwide.
            </p>
            <motion.div
              className="h-[2px] w-32 mx-auto bg-gradient-to-r from-transparent via-green-500 to-transparent"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            ></motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#2b2a29] to-transparent z-20"></div>
    </section>
  );
}
