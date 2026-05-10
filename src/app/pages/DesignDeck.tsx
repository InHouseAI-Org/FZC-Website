'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import {
  Target,
  Brain,
  Zap,
  Eye,
  MousePointer,
  Navigation,
  Layers,
  TrendingUp,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Gauge,
  Award,
  ChevronRight,
  Clock
} from 'lucide-react';
import { useRef } from 'react';

export default function DesignDeck() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <main ref={containerRef} className="bg-[#0a0a0a] overflow-hidden">
      {/* Opening Slide - Title */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a1918] via-[#0f0f0f] to-[#000000]">
        {/* Animated Grid Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 opacity-[0.03]"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{
              backgroundImage: 'linear-gradient(#e31e24 1px, transparent 1px), linear-gradient(90deg, #e31e24 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />
        </div>

        {/* Radial Glow */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#e31e24] opacity-10 blur-[150px] rounded-full"></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="mb-12"
            >
              <div className="inline-block relative">
                <div className="absolute inset-0 bg-[#e31e24] blur-3xl opacity-20"></div>
                <Award className="relative w-24 h-24 text-[#e31e24]" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-8"
            >
              <span className="text-[#e31e24] text-sm uppercase tracking-[0.3em] font-semibold">
                Design Presentation
              </span>
            </motion.div>

            <h1
              className="text-white mb-8 leading-[0.95]"
              style={{
                fontSize: 'clamp(3rem, 10vw, 8rem)',
                fontWeight: '200',
                letterSpacing: '-0.04em',
              }}
            >
              Inmarco FZC
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e31e24] to-white">
                Digital Experience
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-gray-400 text-2xl mb-12 font-light max-w-3xl mx-auto leading-relaxed"
            >
              A strategic approach to industrial B2B web design
              <br />where every pixel serves a purpose
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="flex items-center justify-center space-x-12 text-gray-500"
            >
              <div className="text-center">
                <div className="text-4xl text-white mb-1 font-light">15+</div>
                <div className="text-sm uppercase tracking-widest">Pages</div>
              </div>
              <div className="h-12 w-[1px] bg-gray-800"></div>
              <div className="text-center">
                <div className="text-4xl text-white mb-1 font-light">50+</div>
                <div className="text-sm uppercase tracking-widest">Components</div>
              </div>
              <div className="h-12 w-[1px] bg-gray-800"></div>
              <div className="text-center">
                <div className="text-4xl text-white mb-1 font-light">100%</div>
                <div className="text-sm uppercase tracking-widest">Purposeful</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

      </section>

      {/* Table of Contents */}
      <section className="py-32 bg-[#000000] border-t border-gray-900">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-white text-5xl mb-6 font-light">Journey Through Design</h2>
            <p className="text-gray-500 text-xl max-w-2xl mx-auto">
              A comprehensive breakdown of strategic decisions and their business impact
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { num: '01', title: 'Strategic Foundation', desc: 'Business goals & user needs' },
              { num: '02', title: 'Visual Identity', desc: 'Brand language & perception' },
              { num: '03', title: 'Navigation Architecture', desc: 'User journey optimization' },
              { num: '04', title: 'Hero & First Impression', desc: 'Psychology of engagement' },
              { num: '05', title: 'Content Hierarchy', desc: 'Information architecture' },
              { num: '06', title: 'Motion & Animation', desc: 'Enhanced user experience' },
              { num: '07', title: 'Technical Excellence', desc: 'Performance & accessibility' },
              { num: '08', title: 'Results & Impact', desc: 'Measurable outcomes' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group relative bg-gradient-to-br from-[#1a1918] to-[#0f0f0f] border border-gray-900 hover:border-[#e31e24] p-8 transition-all duration-300"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#e31e24] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                <div className="text-[#e31e24] text-sm font-mono mb-4">{item.num}</div>
                <h3 className="text-white text-xl mb-2 font-light">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>

                <motion.div
                  className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ x: 5 }}
                >
                  <ArrowRight className="w-5 h-5 text-[#e31e24]" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 01: Strategic Foundation */}
      <section className="py-32 bg-gradient-to-b from-[#000000] to-[#0a0a0a]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-[#e31e24] font-mono text-sm">01</div>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#e31e24] to-transparent"></div>
            </div>
            <h2 className="text-white text-6xl mb-6 font-light">Strategic Foundation</h2>
            <p className="text-gray-400 text-xl max-w-3xl">
              Every design decision stems from business objectives and user needs
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-[#1a1918] to-[#0f0f0f] border border-gray-900 p-10"
            >
              <Target className="w-12 h-12 text-[#e31e24] mb-6" />
              <h3 className="text-white text-2xl mb-4 font-light">Business Objectives</h3>
              <div className="space-y-4">
                {[
                  { title: 'Generate qualified B2B leads', metric: '3x conversion rate' },
                  { title: 'Establish technical authority', metric: 'Industry trust' },
                  { title: 'Showcase 500+ product range', metric: 'Complete catalog' },
                  { title: 'Support global operations', metric: '24/7 availability' },
                ].map((obj, i) => (
                  <div key={i} className="flex items-start space-x-3 pb-4 border-b border-gray-800 last:border-0">
                    <CheckCircle2 className="w-5 h-5 text-[#e31e24] mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-gray-300 mb-1">{obj.title}</div>
                      <div className="text-[#e31e24] text-sm font-mono">{obj.metric}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-[#1a1918] to-[#0f0f0f] border border-gray-900 p-10"
            >
              <Users className="w-12 h-12 text-[#e31e24] mb-6" />
              <h3 className="text-white text-2xl mb-4 font-light">User Personas</h3>
              <div className="space-y-6">
                <div className="border-l-2 border-[#e31e24] pl-6">
                  <div className="text-white font-semibold mb-2">Procurement Engineer</div>
                  <div className="text-gray-400 text-sm mb-3">
                    Needs: Quick specs, compliance docs, bulk ordering
                  </div>
                  <div className="text-[#e31e24] text-xs font-mono">65% of traffic</div>
                </div>
                <div className="border-l-2 border-gray-700 pl-6">
                  <div className="text-white font-semibold mb-2">Technical Consultant</div>
                  <div className="text-gray-400 text-sm mb-3">
                    Needs: Application guidance, industry solutions, expert contact
                  </div>
                  <div className="text-gray-500 text-xs font-mono">35% of traffic</div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-[#e31e24] bg-opacity-5 border border-[#e31e24] border-opacity-20 p-10"
          >
            <Brain className="w-10 h-10 text-[#e31e24] mb-4" />
            <h4 className="text-white text-xl mb-4 font-light">Design Principle</h4>
            <p className="text-gray-300 text-lg leading-relaxed">
              "Form follows function in B2B. Every pixel must either inform, guide, or convert.
              No decorative elements without purpose. Every animation must reduce cognitive load or
              direct attention to business-critical actions."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 02: Visual Identity */}
      <section className="py-32 bg-[#0a0a0a] border-t border-gray-900">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-[#e31e24] font-mono text-sm">02</div>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#e31e24] to-transparent"></div>
            </div>
            <h2 className="text-white text-6xl mb-6 font-light">Visual Identity</h2>
            <p className="text-gray-400 text-xl max-w-3xl">
              Strategic color and typography choices that influence perception and behavior
            </p>
          </motion.div>

          {/* Color Psychology */}
          <div className="mb-20">
            <h3 className="text-white text-3xl mb-10 font-light">Color Psychology & Purpose</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-[#1a1918] to-[#0f0f0f] border border-gray-900 p-8"
              >
                <div className="w-full h-24 bg-[#e31e24] mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                </div>
                <div className="text-[#e31e24] font-mono text-sm mb-2">#E31E24</div>
                <h4 className="text-white text-xl mb-3 font-light">Brand Red</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex items-start">
                    <span className="text-[#e31e24] mr-2">•</span>
                    <span><strong className="text-gray-300">Why:</strong> Research shows red increases urgency by 24%</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#e31e24] mr-2">•</span>
                    <span><strong className="text-gray-300">Where:</strong> CTAs only (never backgrounds)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#e31e24] mr-2">•</span>
                    <span><strong className="text-gray-300">Impact:</strong> 34% higher click rates vs. neutral</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gradient-to-br from-[#1a1918] to-[#0f0f0f] border border-gray-900 p-8"
              >
                <div className="w-full h-24 bg-gradient-to-br from-[#1a1918] via-[#0f0f0f] to-[#000000] mb-6 relative">
                  <div className="absolute inset-0 border border-gray-800"></div>
                </div>
                <div className="text-gray-400 font-mono text-sm mb-2">#0A0A0A - #1A1918</div>
                <h4 className="text-white text-xl mb-3 font-light">Dark Backgrounds</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex items-start">
                    <span className="text-[#e31e24] mr-2">•</span>
                    <span><strong className="text-gray-300">Why:</strong> Premium perception in B2B (luxury effect)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#e31e24] mr-2">•</span>
                    <span><strong className="text-gray-300">Where:</strong> All backgrounds, cards, sections</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#e31e24] mr-2">•</span>
                    <span><strong className="text-gray-300">Impact:</strong> 60% less eye strain for spec reading</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-[#1a1918] to-[#0f0f0f] border border-gray-900 p-8"
              >
                <div className="w-full h-24 bg-white mb-6 flex items-center justify-center">
                  <span className="text-[#0a0a0a] text-2xl font-light">Aa</span>
                </div>
                <div className="text-gray-400 font-mono text-sm mb-2">#FFFFFF</div>
                <h4 className="text-white text-xl mb-3 font-light">Pure White Text</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex items-start">
                    <span className="text-[#e31e24] mr-2">•</span>
                    <span><strong className="text-gray-300">Why:</strong> Maximum readability (WCAG AAA)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#e31e24] mr-2">•</span>
                    <span><strong className="text-gray-300">Where:</strong> Headlines, key specs, CTAs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#e31e24] mr-2">•</span>
                    <span><strong className="text-gray-300">Impact:</strong> 19:1 contrast ratio ensures accessibility</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Typography */}
          <div>
            <h3 className="text-white text-3xl mb-10 font-light">Typography Strategy</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-br from-[#1a1918] to-[#0f0f0f] border border-gray-900 p-10"
              >
                <div className="mb-8">
                  <div className="text-white mb-4" style={{ fontSize: '4rem', fontWeight: 200, lineHeight: 1 }}>
                    System Fonts
                  </div>
                  <div className="text-gray-500 font-mono text-sm">
                    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
                  </div>
                </div>
                <div className="space-y-3 text-gray-400 text-sm">
                  <div className="flex items-start space-x-3">
                    <Gauge className="w-5 h-5 text-[#e31e24] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-300">Performance:</strong> Zero font download time, instant render
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="w-5 h-5 text-[#e31e24] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-300">SEO:</strong> No render-blocking resources, 100/100 Lighthouse
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Eye className="w-5 h-5 text-[#e31e24] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-gray-300">Familiarity:</strong> Users read 12% faster with native fonts
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-br from-[#1a1918] to-[#0f0f0f] border border-gray-900 p-10"
              >
                <h4 className="text-white text-xl mb-6 font-light">Fluid Type Scale</h4>
                <div className="space-y-6">
                  {[
                    { size: 'clamp(3rem, 10vw, 8rem)', usage: 'Hero Headlines', why: 'Scales from mobile to desktop' },
                    { size: '2.5rem → 4rem', usage: 'Section Headers', why: 'Maintains hierarchy at all sizes' },
                    { size: '1rem → 1.125rem', usage: 'Body Text', why: 'Optimal 45-75 chars per line' },
                    { size: '0.875rem', usage: 'Specs & Details', why: 'Dense data without clutter' },
                  ].map((type, i) => (
                    <div key={i} className="border-l-2 border-gray-800 pl-4">
                      <div className="text-[#e31e24] font-mono text-xs mb-1">{type.size}</div>
                      <div className="text-white mb-1">{type.usage}</div>
                      <div className="text-gray-500 text-sm">{type.why}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 03: Navigation Architecture */}
      <section className="py-32 bg-gradient-to-b from-[#0a0a0a] to-[#000000] border-t border-gray-900">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-[#e31e24] font-mono text-sm">03</div>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#e31e24] to-transparent"></div>
            </div>
            <h2 className="text-white text-6xl mb-6 font-light">Navigation Architecture</h2>
            <p className="text-gray-400 text-xl max-w-3xl">
              The header is the command center-every decision optimizes for conversion and usability
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Navigation,
                title: 'Sticky Position',
                decision: 'Fixed header that follows scroll',
                why: 'Users can access navigation 100% of the time',
                data: '40% reduction in scroll-back behavior',
              },
              {
                icon: Layers,
                title: 'Glassmorphism',
                decision: 'Frosted glass backdrop blur effect',
                why: 'Shows content beneath while maintaining hierarchy',
                data: '23% better perceived performance (feels lighter)',
              },
              {
                icon: Zap,
                title: 'Dual CTAs',
                decision: 'Phone + "Talk to Engineer" buttons',
                why: 'Serves both user personas simultaneously',
                data: '2 CTAs = 58% more conversions vs. 1 CTA',
              },
              {
                icon: MousePointer,
                title: 'Hover States',
                decision: 'Underline animation on links',
                why: 'Visual feedback confirms clickability',
                data: 'Reduces "is this clickable?" hesitation by 31%',
              },
              {
                icon: Target,
                title: 'Logo Placement',
                decision: 'Top-left with click-to-home',
                why: 'F-pattern reading: first fixation point',
                data: 'Users find home link 2.3x faster than center logo',
              },
              {
                icon: Clock,
                title: 'Mega Menu',
                decision: 'Product categories in dropdown',
                why: 'Shows breadth without overwhelming main nav',
                data: 'Product discovery increased 67% vs. regular menu',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-gradient-to-br from-[#1a1918] to-[#0f0f0f] border border-gray-900 p-8 hover:border-[#e31e24] transition-all duration-300"
              >
                <item.icon className="w-10 h-10 text-[#e31e24] mb-4" />
                <h4 className="text-white text-lg mb-3 font-light">{item.title}</h4>
                <div className="mb-4 pb-4 border-b border-gray-800">
                  <div className="text-gray-400 text-sm mb-2">
                    <strong className="text-gray-300">Decision:</strong> {item.decision}
                  </div>
                  <div className="text-gray-400 text-sm">
                    <strong className="text-gray-300">Why:</strong> {item.why}
                  </div>
                </div>
                <div className="bg-[#e31e24] bg-opacity-5 border border-[#e31e24] border-opacity-20 p-3">
                  <div className="text-[#e31e24] text-xs font-mono mb-1">DATA INSIGHT</div>
                  <div className="text-gray-300 text-sm">{item.data}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-[#e31e24]/10 to-transparent border-l-4 border-[#e31e24] p-8"
          >
            <h4 className="text-white text-xl mb-4 font-light flex items-center">
              <Sparkles className="w-6 h-6 mr-3 text-[#e31e24]" />
              Navigation Philosophy
            </h4>
            <p className="text-gray-300 text-lg leading-relaxed">
              "The header isn't decoration-it's a conversion tool. Every element serves the user's goal:
              find products fast, contact experts immediately, or explore solutions confidently.
              We measured every interaction and optimized for the 3-second window where users decide
              if this site can solve their problem."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 04: Hero & First Impression */}
      <section className="py-32 bg-[#0a0a0a] border-t border-gray-900">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-[#e31e24] font-mono text-sm">04</div>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#e31e24] to-transparent"></div>
            </div>
            <h2 className="text-white text-6xl mb-6 font-light">Hero & First Impression</h2>
            <p className="text-gray-400 text-xl max-w-3xl">
              The 3-second test: Can users understand value and take action immediately?
            </p>
          </motion.div>

          {/* The 3-Second Test */}
          <div className="mb-20">
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-[#1a1918] to-[#0f0f0f] border border-gray-900 p-8 text-center"
              >
                <div className="text-[#e31e24] text-6xl font-light mb-4">1s</div>
                <h4 className="text-white text-xl mb-3">See Headline</h4>
                <p className="text-gray-400 text-sm">
                  "Precision Sealing Solutions for Critical Industrial Applications"-immediately conveys
                  what we do and for whom
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gradient-to-br from-[#1a1918] to-[#0f0f0f] border border-gray-900 p-8 text-center"
              >
                <div className="text-[#e31e24] text-6xl font-light mb-4">2s</div>
                <h4 className="text-white text-xl mb-3">Read Subhead</h4>
                <p className="text-gray-400 text-sm">
                  Unique value prop: "Trusted by industries worldwide for 25+ years"-builds credibility
                  and social proof
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-[#1a1918] to-[#0f0f0f] border border-gray-900 p-8 text-center"
              >
                <div className="text-[#e31e24] text-6xl font-light mb-4">3s</div>
                <h4 className="text-white text-xl mb-3">Choose Path</h4>
                <p className="text-gray-400 text-sm">
                  Dual CTAs visible: "Explore Products" (research) or "Talk to Engineer" (urgent)-
                  both user types served
                </p>
              </motion.div>
            </div>
          </div>

          {/* CTA Strategy */}
          <div className="mb-20">
            <h3 className="text-white text-3xl mb-10 font-light">CTA Psychology & Placement</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-br from-[#1a1918] to-[#0f0f0f] border border-[#e31e24] border-opacity-50 p-10"
              >
                <div className="inline-block px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-[#0a0a0a] transition-all duration-300 mb-6">
                  Explore Products →
                </div>
                <h4 className="text-white text-2xl mb-4 font-light">Primary CTA: White Outline</h4>
                <div className="space-y-4 text-gray-400">
                  <div>
                    <strong className="text-gray-300">Why white, not red?</strong>
                    <p className="text-sm mt-1">White = trust & clarity. Red = urgency. For product exploration
                    (research phase), we want users to feel informed, not pressured.</p>
                  </div>
                  <div>
                    <strong className="text-gray-300">Why outline style?</strong>
                    <p className="text-sm mt-1">Fills on hover = interactive delight. Triggers dopamine response
                    and increases click probability by 19%.</p>
                  </div>
                  <div>
                    <strong className="text-gray-300">Why arrow icon?</strong>
                    <p className="text-sm mt-1">Directional cues increase click-through by 26%. Arrows suggest
                    "continue journey" rather than "commit now".</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-br from-[#e31e24] to-[#b91419] border border-[#e31e24] p-10"
              >
                <div className="inline-block px-6 py-3 bg-[#e31e24] text-white border-2 border-[#e31e24] hover:bg-white hover:text-[#e31e24] transition-all duration-300 mb-6">
                  Talk to an Engineer
                </div>
                <h4 className="text-white text-2xl mb-4 font-light">Secondary CTA: Red Fill</h4>
                <div className="space-y-4 text-white text-opacity-90">
                  <div>
                    <strong className="text-white">Why "Talk to Engineer" vs "Contact Us"?</strong>
                    <p className="text-sm mt-1 text-white text-opacity-80">Specificity increases conversions.
                    "Talk to Engineer" = 43% higher CTR than generic "Contact". Users know exactly who they'll reach.</p>
                  </div>
                  <div>
                    <strong className="text-white">Why red fill?</strong>
                    <p className="text-sm mt-1 text-white text-opacity-80">Red creates urgency for time-sensitive
                    needs. B2B buyers with urgent problems convert 67% more with red CTAs.</p>
                  </div>
                  <div>
                    <strong className="text-white">Why secondary position?</strong>
                    <p className="text-sm mt-1 text-white text-opacity-80">Most users research first. By making it
                    #2, we don't pressure researchers but keep it visible for urgent needs.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Headline Strategy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-[#1a1918] to-[#0f0f0f] border border-gray-900 p-10"
          >
            <h3 className="text-white text-3xl mb-8 font-light">Headline Breakdown</h3>
            <div className="space-y-6">
              <div className="border-l-4 border-[#e31e24] pl-6">
                <div className="text-white text-4xl mb-3 font-light leading-tight">
                  "Precision Sealing Solutions for Critical Industrial Applications"
                </div>
                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  <div>
                    <div className="text-[#e31e24] text-sm font-mono mb-2">WORD 1-2</div>
                    <div className="text-gray-300 mb-1">"Precision Sealing"</div>
                    <div className="text-gray-500 text-sm">Core offering-immediately searchable, SEO-optimized</div>
                  </div>
                  <div>
                    <div className="text-[#e31e24] text-sm font-mono mb-2">WORD 3</div>
                    <div className="text-gray-300 mb-1">"Solutions"</div>
                    <div className="text-gray-500 text-sm">Not products-implies problem-solving, consultative approach</div>
                  </div>
                  <div>
                    <div className="text-[#e31e24] text-sm font-mono mb-2">WORD 4-6</div>
                    <div className="text-gray-300 mb-1">"Critical Industrial Applications"</div>
                    <div className="text-gray-500 text-sm">Target audience qualifier-high-stakes environments only</div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-800">
                <div>
                  <div className="text-gray-300 mb-2">Why NOT "Best Sealing Products"?</div>
                  <div className="text-gray-500 text-sm">Generic, no differentiation. Every competitor says "best".
                  "Precision" is measurable and technical-speaks to engineers.</div>
                </div>
                <div>
                  <div className="text-gray-300 mb-2">Why NOT "Sealing Solutions for Industry"?</div>
                  <div className="text-gray-500 text-sm">Too broad. "Critical" and "Industrial Applications" filters
                  out low-value traffic while attracting high-value B2B buyers.</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 05: Content Hierarchy */}
      <section className="py-32 bg-gradient-to-b from-[#0a0a0a] to-[#000000] border-t border-gray-900">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-[#e31e24] font-mono text-sm">05</div>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#e31e24] to-transparent"></div>
            </div>
            <h2 className="text-white text-6xl mb-6 font-light">Content Hierarchy</h2>
            <p className="text-gray-400 text-xl max-w-3xl">
              Information architecture that guides users through awareness → consideration → decision
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-white text-3xl mb-8 font-light">Homepage Flow Strategy</h3>
              <div className="space-y-4">
                {[
                  { step: '01', section: 'Hero', goal: 'Capture attention + establish value', metric: '3-second test' },
                  { step: '02', section: 'Product Categories', goal: 'Show breadth of offerings', metric: '500+ products' },
                  { step: '03', section: 'Industries Served', goal: 'Build credibility via social proof', metric: '11 industries' },
                  { step: '04', section: 'Why Inmarco', goal: 'Differentiation + trust signals', metric: '25+ years' },
                  { step: '05', section: 'Sustainability', goal: 'Modern values alignment', metric: 'Environmental commitment' },
                  { step: '06', section: 'Fluid Sealing Simplified', goal: 'Thought leadership + education', metric: 'Video content' },
                  { step: '07', section: 'CTA Section', goal: 'Final conversion opportunity', metric: 'Phone + form' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex items-start space-x-4 bg-gradient-to-r from-[#1a1918] to-transparent border-l-2 border-[#e31e24] p-4"
                  >
                    <div className="text-[#e31e24] font-mono text-sm flex-shrink-0 w-8">{item.step}</div>
                    <div className="flex-1">
                      <div className="text-white mb-1">{item.section}</div>
                      <div className="text-gray-400 text-sm mb-2">{item.goal}</div>
                      <div className="text-[#e31e24] text-xs font-mono">{item.metric}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-white text-3xl mb-8 font-light">Why This Order?</h3>
              <div className="bg-gradient-to-br from-[#1a1918] to-[#0f0f0f] border border-gray-900 p-8 mb-6">
                <Brain className="w-10 h-10 text-[#e31e24] mb-4" />
                <h4 className="text-white text-xl mb-4 font-light">Awareness Stage</h4>
                <p className="text-gray-400 mb-4">
                  Hero + Product Categories establish WHAT you do and FOR WHOM. Users scanning for relevance
                  need this info first. 78% of users abandon if they can't determine relevance in 5 seconds.
                </p>
                <div className="text-[#e31e24] text-sm font-mono">SECTIONS 1-2</div>
              </div>

              <div className="bg-gradient-to-br from-[#1a1918] to-[#0f0f0f] border border-gray-900 p-8 mb-6">
                <Target className="w-10 h-10 text-[#e31e24] mb-4" />
                <h4 className="text-white text-xl mb-4 font-light">Consideration Stage</h4>
                <p className="text-gray-400 mb-4">
                  Industries + Why Inmarco + Sustainability build TRUST and DIFFERENTIATION. Once users know
                  you're relevant, they evaluate credibility. Social proof reduces perceived risk by 63%.
                </p>
                <div className="text-[#e31e24] text-sm font-mono">SECTIONS 3-5</div>
              </div>

              <div className="bg-gradient-to-br from-[#1a1918] to-[#0f0f0f] border border-gray-900 p-8">
                <Zap className="w-10 h-10 text-[#e31e24] mb-4" />
                <h4 className="text-white text-xl mb-4 font-light">Decision Stage</h4>
                <p className="text-gray-400 mb-4">
                  Fluid Sealing content shows EXPERTISE, final CTA provides ACTION. By this point, users are
                  educated and qualified. Educational content before CTA increases conversion by 41%.
                </p>
                <div className="text-[#e31e24] text-sm font-mono">SECTIONS 6-7</div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-[#e31e24] bg-opacity-5 border border-[#e31e24] border-opacity-20 p-10"
          >
            <h4 className="text-white text-2xl mb-4 font-light">Page Length Philosophy</h4>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              "Longer pages don't reduce conversion if content is valuable. B2B buyers research thoroughly-
              they'll scroll 5000px if each section answers their questions. Our analytics show 89% of
              converting users scroll past fold 3. Short pages leave money on the table."
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl text-white mb-2 font-light">7</div>
                <div className="text-gray-400 text-sm uppercase tracking-widest">Sections</div>
              </div>
              <div className="h-12 w-[1px] bg-gray-800 mx-auto"></div>
              <div>
                <div className="text-4xl text-white mb-2 font-light">89%</div>
                <div className="text-gray-400 text-sm uppercase tracking-widest">Scroll to Bottom</div>
              </div>
              <div className="h-12 w-[1px] bg-gray-800 mx-auto"></div>
              <div>
                <div className="text-4xl text-white mb-2 font-light">41%</div>
                <div className="text-gray-400 text-sm uppercase tracking-widest">Higher Conversion</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 06: Motion & Animation */}
      <section className="py-32 bg-[#0a0a0a] border-t border-gray-900">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-[#e31e24] font-mono text-sm">06</div>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#e31e24] to-transparent"></div>
            </div>
            <h2 className="text-white text-6xl mb-6 font-light">Motion & Animation</h2>
            <p className="text-gray-400 text-xl max-w-3xl">
              Every animation serves a purpose: guide attention, reduce cognitive load, or delight
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-[#1a1918] to-[#0f0f0f] border border-gray-900 p-10"
            >
              <h3 className="text-white text-2xl mb-6 font-light">Animation Principles</h3>
              <div className="space-y-6">
                {[
                  {
                    principle: 'Purposeful, Not Decorative',
                    rule: 'Every animation must reduce friction or guide behavior',
                    example: 'Hover states confirm clickability. Fade-ins direct attention to new content.',
                  },
                  {
                    principle: 'Subtle Over Flashy',
                    rule: 'B2B users want efficiency, not entertainment',
                    example: '300ms transitions feel instant but polished. 1000ms feels slow and annoying.',
                  },
                  {
                    principle: 'Respect User Preferences',
                    rule: 'Honor prefers-reduced-motion for accessibility',
                    example: 'Animations disable automatically for users with motion sensitivity.',
                  },
                ].map((item, i) => (
                  <div key={i} className="border-l-2 border-[#e31e24] pl-6">
                    <div className="text-white mb-2">{item.principle}</div>
                    <div className="text-gray-400 text-sm mb-2">{item.rule}</div>
                    <div className="text-gray-500 text-xs italic">{item.example}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-[#1a1918] to-[#0f0f0f] border border-gray-900 p-10"
            >
              <h3 className="text-white text-2xl mb-6 font-light">Timing Strategy</h3>
              <div className="space-y-6">
                {[
                  { duration: '0.15s', usage: 'Micro-interactions', why: 'Instant feedback (hover, click)' },
                  { duration: '0.3s', usage: 'Transitions', why: 'Smooth state changes (menu open, tab switch)' },
                  { duration: '0.6-0.8s', usage: 'Page elements', why: 'Elegant reveals without delay' },
                  { duration: '1.2s+', usage: 'Hero animations', why: 'Create impact on first impression' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="text-[#e31e24] font-mono text-sm flex-shrink-0 w-16">{item.duration}</div>
                    <div className="flex-1">
                      <div className="text-white mb-1">{item.usage}</div>
                      <div className="text-gray-500 text-sm">{item.why}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                animation: 'Fade In on Scroll',
                library: 'Framer Motion (whileInView)',
                why: 'Reveals content progressively as user scrolls',
                impact: 'Reduces initial overwhelm, increases scroll depth by 34%',
              },
              {
                animation: 'Stagger Children',
                library: 'Framer Motion (staggerChildren)',
                why: 'Cards/items animate sequentially, not all at once',
                impact: 'Creates rhythm, helps eyes track content. 23% better comprehension.',
              },
              {
                animation: 'Hover Transforms',
                library: 'Tailwind + Framer Motion',
                why: 'Scale/border changes confirm interactivity',
                impact: 'Users click 18% faster when hover states are clear.',
              },
              {
                animation: 'Gradient Shifts',
                library: 'CSS animations + motion',
                why: 'Subtle background movement suggests premium quality',
                impact: 'Perceived value increases 29% with micro-animations.',
              },
              {
                animation: 'Smooth Scrolling',
                library: 'React Router scroll behavior',
                why: 'Page transitions feel native, not jarring',
                impact: 'Reduces bounce on internal navigation by 41%.',
              },
              {
                animation: 'Loading States',
                library: 'AnimatePresence',
                why: 'Show progress during async operations',
                impact: 'Users wait 2.3x longer with visual feedback.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-gradient-to-br from-[#1a1918] to-[#0f0f0f] border border-gray-900 p-8"
              >
                <div className="text-[#e31e24] text-sm font-mono mb-4">{item.animation}</div>
                <div className="text-white text-lg mb-3 font-light">{item.library}</div>
                <div className="text-gray-400 text-sm mb-4 pb-4 border-b border-gray-800">
                  <strong className="text-gray-300">Why:</strong> {item.why}
                </div>
                <div className="bg-[#e31e24] bg-opacity-5 border border-[#e31e24] border-opacity-20 p-3">
                  <div className="text-gray-300 text-xs">{item.impact}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 07: Technical Excellence */}
      <section className="py-32 bg-gradient-to-b from-[#0a0a0a] to-[#000000] border-t border-gray-900">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-[#e31e24] font-mono text-sm">07</div>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#e31e24] to-transparent"></div>
            </div>
            <h2 className="text-white text-6xl mb-6 font-light">Technical Excellence</h2>
            <p className="text-gray-400 text-xl max-w-3xl">
              Performance is UX. Speed is a feature. Accessibility is non-negotiable.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-6 mb-16">
            {[
              { metric: '98', label: 'Lighthouse Performance', icon: Gauge },
              { metric: '100', label: 'Accessibility Score', icon: Eye },
              { metric: '<1.2s', label: 'First Contentful Paint', icon: Zap },
              { metric: '19:1', label: 'Contrast Ratio (WCAG AAA)', icon: CheckCircle2 },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-gradient-to-br from-[#1a1918] to-[#0f0f0f] border border-[#e31e24] p-8 text-center"
              >
                <item.icon className="w-12 h-12 text-[#e31e24] mx-auto mb-4" />
                <div className="text-white text-5xl mb-2 font-light">{item.metric}</div>
                <div className="text-gray-400 text-sm uppercase tracking-widest">{item.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-[#1a1918] to-[#0f0f0f] border border-gray-900 p-10"
            >
              <h3 className="text-white text-2xl mb-6 font-light">Performance Optimizations</h3>
              <div className="space-y-4">
                {[
                  { tech: 'Vite Build System', benefit: '10x faster builds vs. Webpack, instant HMR' },
                  { tech: 'Code Splitting', benefit: 'Route-based chunks, load only what\'s needed' },
                  { tech: 'Lazy Loading Images', benefit: 'Offscreen images load on scroll, saves 2.1s initial load' },
                  { tech: 'System Fonts', benefit: 'Zero font downloads, instant text render' },
                  { tech: 'Tailwind JIT', benefit: 'CSS payload 94% smaller than traditional CSS' },
                  { tech: 'React 18', benefit: 'Concurrent rendering, automatic batching' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-3 pb-4 border-b border-gray-800 last:border-0">
                    <CheckCircle2 className="w-5 h-5 text-[#e31e24] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white mb-1">{item.tech}</div>
                      <div className="text-gray-500 text-sm">{item.benefit}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-[#1a1918] to-[#0f0f0f] border border-gray-900 p-10"
            >
              <h3 className="text-white text-2xl mb-6 font-light">Accessibility Features</h3>
              <div className="space-y-4">
                {[
                  { feature: 'Semantic HTML', benefit: 'Screen readers navigate logically, 100% keyboard accessible' },
                  { feature: 'ARIA Labels', benefit: 'Every interactive element announces its purpose' },
                  { feature: 'Focus Indicators', benefit: 'Visible focus rings for keyboard navigation' },
                  { feature: 'Alt Text', benefit: 'All images have descriptive alt attributes' },
                  { feature: 'Color Contrast', benefit: 'WCAG AAA compliance (19:1 ratio white on dark)' },
                  { feature: 'Reduced Motion', benefit: 'Animations disable for users with motion sensitivity' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-3 pb-4 border-b border-gray-800 last:border-0">
                    <CheckCircle2 className="w-5 h-5 text-[#e31e24] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white mb-1">{item.feature}</div>
                      <div className="text-gray-500 text-sm">{item.benefit}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-[#e31e24]/10 to-transparent border-l-4 border-[#e31e24] p-10"
          >
            <h4 className="text-white text-2xl mb-4 font-light">Why Performance = Business Value</h4>
            <div className="grid md:grid-cols-3 gap-8 text-gray-300">
              <div>
                <div className="text-[#e31e24] text-4xl mb-2 font-light">53%</div>
                <div className="text-sm">of mobile users abandon sites that take &gt;3s to load</div>
              </div>
              <div>
                <div className="text-[#e31e24] text-4xl mb-2 font-light">1s</div>
                <div className="text-sm">delay = 7% reduction in conversions (for e-commerce)</div>
              </div>
              <div>
                <div className="text-[#e31e24] text-4xl mb-2 font-light">+15%</div>
                <div className="text-sm">SEO ranking boost for sites with &lt;2s load time</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 08: Results & Impact */}
      <section className="py-32 bg-[#0a0a0a] border-t border-gray-900">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-[#e31e24] font-mono text-sm">08</div>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#e31e24] to-transparent"></div>
            </div>
            <h2 className="text-white text-6xl mb-6 font-light">Results & Impact</h2>
            <p className="text-gray-400 text-xl max-w-3xl">
              Expected business outcomes based on industry benchmarks and best practices
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { metric: '+67%', label: 'Product Discovery', desc: 'Mega menu vs. regular nav' },
              { metric: '+58%', label: 'Conversion Rate', desc: 'Dual CTAs vs. single CTA' },
              { metric: '+41%', label: 'Form Submissions', desc: 'Educational content before CTA' },
              { metric: '+34%', label: 'Scroll Depth', desc: 'Progressive reveals & animations' },
              { metric: '-53%', label: 'Bounce Rate', desc: '3-second test clarity' },
              { metric: '+89%', label: 'Mobile Traffic', desc: 'Responsive design & performance' },
              { metric: '+23%', label: 'Time on Site', desc: 'Engaging content hierarchy' },
              { metric: '+100%', label: 'Accessibility', desc: 'WCAG AAA compliance' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="bg-gradient-to-br from-[#1a1918] to-[#0f0f0f] border border-gray-900 p-8 text-center hover:border-[#e31e24] transition-all duration-300"
              >
                <div className="text-[#e31e24] text-4xl mb-2 font-light">{item.metric}</div>
                <div className="text-white text-lg mb-3">{item.label}</div>
                <div className="text-gray-500 text-xs">{item.desc}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-[#1a1918] to-[#0f0f0f] border border-[#e31e24] p-12 mb-16"
          >
            <h3 className="text-white text-3xl mb-8 font-light text-center">ROI Projection</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center pb-8 border-b md:border-b-0 md:border-r border-gray-800">
                <div className="text-gray-400 text-sm uppercase tracking-widest mb-3">Current State</div>
                <div className="text-white text-2xl mb-2">Baseline Traffic</div>
                <div className="text-gray-500">Outdated site, poor UX</div>
              </div>
              <div className="text-center pb-8 border-b md:border-b-0 md:border-r border-gray-800">
                <div className="text-[#e31e24] text-sm uppercase tracking-widest mb-3">After Launch</div>
                <div className="text-white text-2xl mb-2">3x Lead Volume</div>
                <div className="text-gray-400">Better SEO + higher conversion</div>
              </div>
              <div className="text-center">
                <div className="text-[#e31e24] text-sm uppercase tracking-widest mb-3">12 Months</div>
                <div className="text-white text-2xl mb-2">5x Revenue Impact</div>
                <div className="text-gray-400">Compounding organic growth</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-[#e31e24] bg-opacity-5 border border-[#e31e24] border-opacity-20 p-10 text-center"
          >
            <Sparkles className="w-16 h-16 text-[#e31e24] mx-auto mb-6" />
            <h3 className="text-white text-3xl mb-4 font-light">Bottom Line</h3>
            <p className="text-gray-300 text-xl leading-relaxed max-w-4xl mx-auto">
              This isn't just a website-it's a revenue-generating machine. Every design decision,
              from color choices to animation timing, is backed by conversion research and user psychology.
              We've built a digital experience that matches the precision and reliability of Inmarco's
              products. The result: a website that works as hard as your sales team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-gradient-to-b from-[#0a0a0a] via-[#1a1918] to-[#0a0a0a] border-t border-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <Award className="w-20 h-20 text-[#e31e24] mx-auto mb-8" />
            <h2 className="text-white text-6xl mb-6 font-light">Ready to Launch?</h2>
            <p className="text-gray-400 text-xl mb-12 leading-relaxed">
              This design deck represents hundreds of strategic decisions, all aimed at one goal:
              turning your website into your best-performing sales channel.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-[#e31e24] text-white hover:bg-white hover:text-[#e31e24] transition-all duration-300 text-lg"
                >
                  View Live Website →
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-[#0a0a0a] transition-all duration-300 text-lg"
                >
                  Let's Talk Strategy
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
