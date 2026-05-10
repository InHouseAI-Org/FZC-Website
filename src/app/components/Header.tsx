import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Play } from 'lucide-react';
import inmarcoLogo from '@/assets/inmarco-tagline-logo1.png';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInSustainability, setIsInSustainability] = useState(false);
  const [showTransitionAnimation, setShowTransitionAnimation] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Check if we're in the sustainability section
      const sustainabilitySection = document.getElementById('sustainability');
      if (sustainabilitySection) {
        const rect = sustainabilitySection.getBoundingClientRect();
        // Header is in sustainability section if section top is above header bottom (80px)
        const inSection = rect.top < 80 && rect.bottom > 0;

        // Trigger transition animation when entering section
        if (inSection && !isInSustainability) {
          setShowTransitionAnimation(true);
          setTimeout(() => setShowTransitionAnimation(false), 1500);
        }

        setIsInSustainability(inSection);
      }

      // Check if footer is in view
      const footer = document.querySelector('footer');
      if (footer) {
        const rect = footer.getBoundingClientRect();
        const footerInView = rect.top < window.innerHeight;
        setIsFooterVisible(footerInView);
      }
    };

    // Call once on mount
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isInSustainability]);

  const location = useLocation();

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about-us' },
    { label: 'Industries', href: '/industries' },
    { label: 'Products', href: '/products' },
    { label: 'Contact', href: '/contact' },
  ];

  // Define accent colors based on section
  const accentColor = isInSustainability ? 'bg-green-500' : 'bg-[#e31e24]';
  const accentHoverColor = isInSustainability ? 'hover:bg-green-600' : 'hover:bg-[#c41a20]';
  const accentTextColor = isInSustainability ? 'hover:text-green-400' : 'hover:text-[#e31e24]';
  const buttonBgColor = isInSustainability ? 'bg-green-500' : 'bg-[#e31e24]';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-gradient-to-b from-[#2b2a29] to-[#2b2a29]/80 shadow-lg' : 'bg-gradient-to-b from-[#2b2a29] to-transparent'
      } ${isInSustainability ? 'shadow-[0_4px_20px_rgba(16,185,129,0.3)]' : ''}`}
      style={{
        transform: isFooterVisible ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.5s ease-in-out'
      }}
    >
      {/* Green glow effect overlay when in Sustainability section */}
      {isInSustainability && (
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent pointer-events-none"></div>
      )}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="relative flex items-center space-x-4">
            <div className="relative overflow-hidden" style={{ width: '180px', height: '64px' }}>
              <img
                src={inmarcoLogo.src || inmarcoLogo}
                alt="INMARCO"
                className="absolute"
                style={{
                  height: '77px',
                  top: '0px',
                  left: '0',
                  borderRadius: '0px'
                }}
              />
              {/*<span className="absolute text-white" style={{ fontSize: '18px', top: '-2px', right: '60px' }}>®</span>*/}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = item.href.startsWith('#') ? false : location.pathname === item.href;
              const isHashLink = item.href.startsWith('#') || item.href.includes('#');

              if (isHashLink) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-sm tracking-wide text-white hover: transition-colors duration-200 relative group"
                  >
                    {item.label}
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] ${accentColor} transition-all duration-500 ${
                        showTransitionAnimation ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    ></span>
                  </a>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm tracking-wide text-white hover: transition-colors duration-200 relative group"
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] ${accentColor} transition-all duration-500 ${
                      isActive || showTransitionAnimation ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  ></span>
                </Link>
              );
            })}
          </nav>

          <Link
            href="/fluid-sealing-simplified"
            className={`hidden md:flex items-center space-x-2 text-sm tracking-wide border-l border-white/70 pl-4 transition-all duration-500 group ${
              showTransitionAnimation
                ? 'text-green-400'
                : `text-white ${accentTextColor}`
            }`}
          >
            <Play className={`w-4 h-4 transition-all duration-500 ${showTransitionAnimation ? 'scale-110' : 'group-hover:scale-110'}`} />
            <span>Fluid Sealing Simplified</span>
          </Link>

          {/* CTA Button */}
          <Link href="/contact" className={`hidden lg:block px-6 py-3 ${buttonBgColor} text-white text-sm tracking-wide ${accentHoverColor} transition-all duration-500`}>
            Get in Touch
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-20 left-0 right-0 backdrop-blur-sm border-t transition-all duration-500 ${
          isInSustainability ? 'bg-[#1f2e1f]/95 border-green-500/30' : 'bg-[#2b2a29]/95 border-gray-700'
        } ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
      >
        <nav className="px-6 py-6 space-y-4">
          {navItems.map((item) => {
            const isHashLink = item.href.startsWith('#') || item.href.includes('#');

            if (isHashLink) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-gray-300 hover:text-white transition-colors duration-200 py-2 border-l-2 pl-4 ${
                    isInSustainability ? 'border-green-500' : 'border-transparent hover:border-[#e31e24]'
                  }`}
                >
                  {item.label}
                </a>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block text-gray-300 hover:text-white transition-colors duration-200 py-2 border-l-2 pl-4 ${
                  isInSustainability ? 'border-green-500' : 'border-transparent hover:border-[#e31e24]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link href="/contact" className={`block w-full px-6 py-3 ${buttonBgColor} text-white text-sm tracking-wide ${accentHoverColor} transition-all duration-500 mt-4 text-center`}>
            Get in Touch
          </Link>
        </nav>
      </div>
    </header>
  );
}
