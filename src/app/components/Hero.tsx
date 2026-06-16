'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { ChevronRight, Play } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: -9999, y: -9999 });
  const [heroImage, setHeroImage] = useState('https://d24gq0kplkhyxr.cloudfront.net/assets/images/Hero.webp');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);

  useEffect(() => {
    const updateImage = () => {
      const width = window.innerWidth;
      if (width < 768) {
        // Mobile
        setHeroImage('https://d24gq0kplkhyxr.cloudfront.net/assets/images/Hero_mob.webp');
      } else if (width < 1024) {
        // Tablet
        setHeroImage('https://d24gq0kplkhyxr.cloudfront.net/assets/images/Hero_tab.webp');
      } else {
        // Desktop
        setHeroImage('https://d24gq0kplkhyxr.cloudfront.net/assets/images/Hero.webp');
      }
    };

    updateImage();
    window.addEventListener('resize', updateImage);
    return () => window.removeEventListener('resize', updateImage);
  }, []);

  return (
    <section ref={containerRef} id="home" className="relative min-h-screen flex items-center bg-[#2b2a29] overflow-hidden">
      {/* Background Images with X-Ray Effect */}
      <div className="absolute inset-0">
        {/* Bottom Image (base layer) - Image #1 */}
        <div className="absolute inset-0 pointer-events-none">
          <ImageWithFallback
            src={heroImage}
            alt="Industrial valve and machinery"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />











        </div>

        {/* Top Image (with cursor reveal effect) - Image #2 */}
        {/* <div
          className="absolute inset-0 pointer-events-none"
          style={{
            maskImage: mousePosition.x > 0
              ? `radial-gradient(circle 250px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, transparent 40%, black 70%, black 100%)`
              : 'none',
            WebkitMaskImage: mousePosition.x > 0
              ? `radial-gradient(circle 250px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, transparent 40%, black 70%, black 100%)`
              : 'none',
          }}
        >
          <ImageWithFallback
            src="Gemini_Generated_Image_5h4dsy5h4dsy5h4d.png"
            alt="Industrial machinery revealed"
            className="w-full h-full object-cover"
            style={{width: '200%'}}
          />
        </div> */}

        {/* Gradient Overlay - below content but above images */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-[#2b2a29]/95 via-[#2b2a29]/45 to-[#2b2a29]/2 pointer-events-none"></div> */}
      </div>


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
            Innovations in Industrial{' '}
            <br/>
            <motion.span
              className="inline-block text-[#e31e24]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0 }}
              whileHover={{
                textShadow: "0 0 20px rgba(227, 30, 36, 0.5)"
              }}
            >
              Fluid Sealing
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-300 mb-10"
            style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', lineHeight: '1.6', width: '60%' }}
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
            <Link href="/contact" className="group px-8 py-4 bg-[#e31e24] text-white tracking-wide hover:bg-[#c41a20] transition-all duration-300 flex items-center space-x-2">
              <span>Talk to an Engineer</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link href="/products" className="group px-8 py-4 border-2 border-white text-white tracking-wide hover:bg-white hover:text-[#2b2a29] transition-all duration-300 flex items-center space-x-2">
              <Play className="w-4 h-4" />
              <span>Explore Solutions</span>
            </Link>
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
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#2b2a29]/3 to-transparent z-10"></div>
    </section>
  );
}
