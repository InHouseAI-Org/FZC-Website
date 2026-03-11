import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Package, Layers, Settings, Flame, Circle, Maximize2 } from 'lucide-react';

// 3D CSS Diagrams for each product
const CompressionPackingDiagram = () => (
  <div className="w-full h-full flex items-center justify-center" style={{ perspective: '600px' }}>
    <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
      {/* Central shaft */}
      <div className="absolute w-8 h-32 bg-[#e31e24]/20 border-2 border-[#e31e24] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ transformStyle: 'preserve-3d' }} />

      {/* Packing rings */}
      {[-40, -20, 0, 20, 40].map((y, i) => (
        <div
          key={i}
          className="absolute w-24 h-4 border-2 border-[#e31e24] left-1/2 top-1/2 -translate-x-1/2"
          style={{
            transform: `translate(-50%, ${y}px) rotateX(75deg)`,
            transformStyle: 'preserve-3d',
            background: `linear-gradient(135deg, rgba(227, 30, 36, 0.3), rgba(227, 30, 36, 0.1))`,
            borderRadius: '50%',
          }}
        />
      ))}

      {/* Front and back caps */}
      <div className="absolute w-10 h-10 rounded-full border-2 border-[#e31e24] bg-[#e31e24]/20 left-1/2 top-1/2 -translate-x-1/2" style={{ transform: 'translate(-50%, -64px) rotateX(75deg)', transformStyle: 'preserve-3d' }} />
      <div className="absolute w-10 h-10 rounded-full border-2 border-[#e31e24] bg-[#e31e24]/10 left-1/2 top-1/2 -translate-x-1/2" style={{ transform: 'translate(-50%, 64px) rotateX(75deg)', transformStyle: 'preserve-3d' }} />
    </div>
  </div>
);

const ValveSealingDiagram = () => (
  <div className="w-full h-full flex items-center justify-center" style={{ perspective: '600px' }}>
    <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
      {/* Valve body - octagonal shape */}
      <div className="absolute w-24 h-24 border-2 border-[#e31e24] bg-[#e31e24]/10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)', transformStyle: 'preserve-3d' }} />

      {/* Valve stem */}
      <div className="absolute w-2 h-12 bg-[#e31e24]/30 border border-[#e31e24] left-1/2 -translate-x-1/2" style={{ transform: 'translate(-50%, -56px)', transformStyle: 'preserve-3d' }} />
      <div className="absolute w-6 h-6 rounded-full border-2 border-[#e31e24] bg-[#e31e24]/40 left-1/2 -translate-x-1/2" style={{ transform: 'translate(-50%, -60px)', transformStyle: 'preserve-3d' }} />

      {/* Sealing rings */}
      <div className="absolute w-16 h-16 rounded-full border-2 border-[#e31e24] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ background: 'radial-gradient(circle, rgba(227, 30, 36, 0.2), transparent)', transformStyle: 'preserve-3d' }} />
      <div className="absolute w-10 h-10 rounded-full border-2 border-[#e31e24] bg-[#e31e24]/20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ transformStyle: 'preserve-3d' }} />

      {/* Port connections */}
      <div className="absolute w-12 h-3 bg-[#e31e24]/20 border border-[#e31e24] top-1/2 -translate-y-1/2" style={{ transform: 'translateY(-50%) translateX(-60px)', transformStyle: 'preserve-3d' }} />
      <div className="absolute w-12 h-3 bg-[#e31e24]/20 border border-[#e31e24] top-1/2 right-0 -translate-y-1/2" style={{ transform: 'translateY(-50%) translateX(60px)', transformStyle: 'preserve-3d' }} />
    </div>
  </div>
);

const IndustrialGasketDiagram = () => (
  <div className="w-full h-full flex items-center justify-center" style={{ perspective: '600px' }}>
    <div className="relative w-32 h-32" style={{ transformStyle: 'preserve-3d' }}>
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-2 border-[#e31e24]" style={{ background: 'radial-gradient(circle, transparent 40%, rgba(227, 30, 36, 0.1) 40%, rgba(227, 30, 36, 0.2) 100%)', transform: 'rotateX(65deg)', transformStyle: 'preserve-3d' }} />

      {/* Inner hole */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-[#e31e24] bg-black/20" style={{ transform: 'translate(-50%, -50%) rotateX(65deg)', transformStyle: 'preserve-3d' }} />

      {/* Spiral wound pattern */}
      <div className="absolute inset-4 rounded-full border-2 border-dashed border-[#e31e24] opacity-50" style={{ transform: 'rotateX(65deg)', transformStyle: 'preserve-3d' }} />

      {/* Bolt holes */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 50 + 48 * Math.cos(rad);
        const y = 50 + 48 * Math.sin(rad);
        return (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full border border-[#e31e24] bg-[#e31e24]/30"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%) rotateX(65deg)',
              transformStyle: 'preserve-3d',
            }}
          />
        );
      })}

      {/* Depth shadow */}
      <div className="absolute inset-0 rounded-full opacity-20" style={{ background: 'radial-gradient(ellipse 60% 15% at 50% 50%, rgba(227, 30, 36, 0.3), transparent)', transform: 'rotateX(65deg) translateZ(-2px)', transformStyle: 'preserve-3d' }} />
    </div>
  </div>
);

const ThermalInsulationDiagram = () => (
  <div className="w-full h-full flex items-center justify-center" style={{ perspective: '800px' }}>
    <div className="relative w-28 h-32" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-20deg) rotateY(-30deg)' }}>
      {/* Isometric box with layers */}
      {[0, 8, 16, 24, 32].map((z, i) => (
        <div
          key={i}
          className="absolute w-full h-6 border border-[#e31e24]"
          style={{
            top: `${i * 20}%`,
            background: `linear-gradient(135deg, rgba(227, 30, 36, ${0.3 - i * 0.05}), rgba(227, 30, 36, ${0.1 - i * 0.02}))`,
            transform: `translateZ(${z}px)`,
            transformStyle: 'preserve-3d',
            opacity: 0.8 - i * 0.1,
          }}
        />
      ))}

      {/* Side faces */}
      <div className="absolute w-full h-full border-l-2 border-[#e31e24] bg-[#e31e24]/10" style={{ transform: 'rotateY(-90deg) translateX(-56px)', transformOrigin: 'right', transformStyle: 'preserve-3d' }} />
      <div className="absolute w-full h-full border-r-2 border-[#e31e24] bg-[#e31e24]/5" style={{ transform: 'rotateY(90deg) translateX(56px)', transformOrigin: 'left', transformStyle: 'preserve-3d' }} />

      {/* Fiber texture lines */}
      {[20, 40, 60, 80].map((top, i) => (
        <div key={i} className="absolute w-1 h-0.5 bg-[#e31e24] opacity-30" style={{ top: `${top}%`, left: '30%', transform: 'translateZ(34px)', transformStyle: 'preserve-3d' }} />
      ))}
    </div>
  </div>
);

const ElastomericSealingDiagram = () => (
  <div className="w-full h-full flex items-center justify-center" style={{ perspective: '600px' }}>
    <div className="relative w-32 h-32" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(70deg)' }}>
      {/* O-ring torus shape */}
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-2 border-[#e31e24]" style={{ background: 'radial-gradient(circle, transparent 35%, rgba(227, 30, 36, 0.3) 35%, rgba(227, 30, 36, 0.2) 65%, transparent 65%)', transformStyle: 'preserve-3d' }} />

      {/* Inner hole */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-2 border-[#e31e24] bg-black/20" style={{ transformStyle: 'preserve-3d' }} />

      {/* Ring depth layers */}
      {[-2, 0, 2].map((z, i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-full border border-[#e31e24]"
          style={{
            background: `radial-gradient(circle, transparent 35%, rgba(227, 30, 36, ${0.2 - i * 0.05}) 35%, rgba(227, 30, 36, ${0.15 - i * 0.05}) 65%, transparent 65%)`,
            transform: `translateZ(${z * 4}px)`,
            transformStyle: 'preserve-3d',
            opacity: 0.6 - Math.abs(i) * 0.2,
          }}
        />
      ))}

      {/* Cross-section indicator */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[#e31e24] bg-[#e31e24]/40" style={{ transform: 'translateY(-50%) translateX(16px)', transformStyle: 'preserve-3d' }} />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#e31e24]/60" style={{ transform: 'translateY(-50%) translateX(16px)', transformStyle: 'preserve-3d' }} />
    </div>
  </div>
);

const ExpansionJointDiagram = () => (
  <div className="w-full h-full flex items-center justify-center" style={{ perspective: '600px' }}>
    <div className="relative w-40 h-20" style={{ transformStyle: 'preserve-3d' }}>
      {/* Left flange */}
      <div className="absolute left-0 w-8 h-full border-2 border-[#e31e24] bg-[#e31e24]/20" style={{ transformStyle: 'preserve-3d' }}>
        {[25, 50, 75].map((top, i) => (
          <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-[#e31e24] left-1/2 -translate-x-1/2" style={{ top: `${top}%` }} />
        ))}
      </div>

      {/* Right flange */}
      <div className="absolute right-0 w-8 h-full border-2 border-[#e31e24] bg-[#e31e24]/20" style={{ transformStyle: 'preserve-3d' }}>
        {[25, 50, 75].map((top, i) => (
          <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-[#e31e24] left-1/2 -translate-x-1/2" style={{ top: `${top}%` }} />
        ))}
      </div>

      {/* Bellows sections */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute h-full border-t-2 border-b-2 border-[#e31e24]"
          style={{
            left: `${32 + i * 16}%`,
            width: '12%',
            background: `linear-gradient(to bottom, transparent, rgba(227, 30, 36, 0.2) 20%, rgba(227, 30, 36, 0.3) 50%, rgba(227, 30, 36, 0.2) 80%, transparent)`,
            borderRadius: i === 1 ? '0' : '50%',
            transform: i === 1 ? 'scaleY(1.1)' : 'scaleY(0.95)',
            transformStyle: 'preserve-3d',
          }}
        />
      ))}

      {/* Connecting ribs */}
      <div className="absolute w-24 h-0.5 bg-[#e31e24] top-0 left-8 opacity-60" style={{ transformStyle: 'preserve-3d' }} />
      <div className="absolute w-24 h-0.5 bg-[#e31e24] bottom-0 left-8 opacity-60" style={{ transformStyle: 'preserve-3d' }} />

      {/* Movement arrows */}
      <div className="absolute -left-4 top-1/2 -translate-y-1/2 text-[#e31e24] text-xs opacity-60">←</div>
      <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-[#e31e24] text-xs opacity-60">→</div>
    </div>
  </div>
);

export function ProductCategories() {
  const products = [
    {
      icon: Package,
      title: 'Compression Packings',
      description: 'High-performance compression packings for rotating and reciprocating equipment.',
      specs: ['Fugitive Emission','Carbon / Grpahite','PTFE','Polymide','Hybrid'],
      diagram: CompressionPackingDiagram,
    },
    {
      icon: Package,
      title: 'Graphite Moulded Products',
      description: 'Precision-engineered moulded graphite components delivering exceptional thermal stability and chemical resistance for critical static and dynamic sealing applications.',
      specs: ['Grafoil Moulded Ring', 'Pressure Seal Gasket', 'Laminated Graphite'],
      diagram: CompressionPackingDiagram,
    },
    {
      icon: Package,
      title: 'Flange Joint Gaskets',
      description: 'Different Material sheet gaskets, providing reliable sealing solutions for flanged connections.',
      specs: ['CNAF', 'Graphite', 'PTFE', 'Expanded PTFE'],
      diagram: CompressionPackingDiagram,
    },
    {
      icon: Settings,
      title: 'Flange Isolation Gaskets',
      description: 'Precision-engineered, corrosion resistant, fire safe gaskets for flange isolation and cathodic protection applications.',
      specs: ['API 6FB Fire Safe', 'ASTM B117 Salt Spray Corrossion','Methane Emission Compliance', 'Helium Nitrogen Leak Compliance'],
      diagram: CompressionPackingDiagram,
    },
    {
      icon: Layers,
      title: 'Metallic Gaskets',
      description: 'High-performance metallic gaskets for extreme temperature and pressure applications.',
      specs: ['Laminar Gasket', 'Kammprofile Gasket', 'Shim Joint', 'Double Jacketted Gasket', 'Ring Type Joint Gasket', 'Corrugated Gasket', 'Soft Iron Ring'],
      diagram: CompressionPackingDiagram,
    },
    {
      icon: Flame,
      title: 'Thermal Insulation',
      description: 'High-temperature insulation materials for heat management and energy conservation.',
      specs: ['EGlass', 'Ceramic', 'Silica','Welding Blanket'],
      diagram: ThermalInsulationDiagram,
    },
    {
      icon: Flame,
      title: 'Wiping Pad',
      description: 'Exceptionally strong and durable wiping pads for Wire Drawing Industry',
      specs: ['Aramid based wiping pad', 'High temperature wiping pad'],
      diagram: ThermalInsulationDiagram,
    }
  ];

  return (
    <section id="products" className="bg-[#2b2a29] py-24">
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
            <span className="text-sm tracking-widest text-gray-400 uppercase">Our Products</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: '1.2', letterSpacing: '-0.01em' }}
          >
            Fluid Sealing Solutions
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-lg"
          >
            Precision-engineered sealing products built to perform under the most demanding conditions.
          </motion.p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {products.map((product, index) => {
            const Icon = product.icon;
            const Diagram = product.diagram;
            return (
              <Link
                key={index}
                to="/products"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative bg-[#1a1918] border-l-4 border-transparent hover:border-[#e31e24] p-8 transition-all duration-500 hover:bg-[#252423] overflow-visible cursor-pointer"
                >
                {/* Icon */}
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 bg-[#2b2a29] group-hover:bg-[#e31e24] transition-colors duration-300">
                    <Icon className="w-8 h-8 text-[#e31e24] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="text-6xl text-[#e31e24] group-hover:text-[#e31e24]/10 transition-colors duration-300">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl text-white mb-3 tracking-tight">{product.title}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">{product.description}</p>

                {/* 3D Diagram Section - Expands on Hover */}
                {/* <div className="h-0 group-hover:h-64 transition-all duration-500 ease-in-out overflow-hidden flex items-center justify-center mb-0 group-hover:mb-6">
                  <motion.div
                    className="w-70 h-70 text-[#e31e24] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    animate={{
                      rotateZ: [0, 360],
                      rotateX: [0, 15, 0],
                      rotateY: [0, 15, 0],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <Diagram />
                  </motion.div>
                </div> */}

                {/* Image Section - Expands on Hover */}
                <div className="h-0 group-hover:h-64 transition-all duration-500 ease-in-out overflow-hidden flex items-center justify-center mb-0 group-hover:mb-6">
                  <img
                    src="/images copy.jpeg"
                    alt={product.title}
                    className="w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                </div>

                {/* Specs */}
                <div className="flex flex-wrap gap-2">
                  {product.specs.map((spec, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 bg-[#2b2a29] text-gray-400 tracking-wide uppercase border border-gray-700"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Hover Indicator */}
                <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center space-x-2 text-[#e31e24] text-sm">
                    <span>Learn More</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
