import { Linkedin } from 'lucide-react';
import inmarcoLogo from '@/assets/inmarco-logo.png';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', href: '#about' },
      { label: 'Contact', href: '#' },
    ],
    products: [
      { label: 'Compression Packing', href: '#products' },
      { label: 'Valve Sealing', href: '#products' },
      { label: 'Industrial Gaskets', href: '#products' },
      { label: 'Thermal Insulation', href: '#products' },
      { label: 'Elastomeric Sealing', href: '#products' },
      { label: 'Expansion Joints', href: '#products' },
    ],
    industries: [
      { label: 'Oil & Gas', href: '#industries' },
      { label: 'Power Generation', href: '#industries' },
      { label: 'Metallurgy', href: '#industries' },
      { label: 'Chemical', href: '#industries' },
      { label: 'Marine', href: '#industries' },
      { label: 'Cement', href: '#industries' },
      { label: 'Fertilizers', href: '#industries' },
      { label: 'Pulp & Paper', href: '#industries' },
      { label: 'Sugar', href: '#industries' },
      { label: 'Food & Pharmaceutical', href: '#industries' },
      { label: 'OEM', href: '#industries' },
    ]
  };

  return (
    <footer className="bg-[#2b2a29] border-t border-gray-800">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <a href="#home" className="relative flex items-center mb-6">
              <div className="relative overflow-hidden" style={{ width: '180px', height: '64px' }}>
                <img
                  src={inmarcoLogo}
                  alt="INMARCO"
                  className="absolute"
                  style={{
                    height: '75px',
                    top: '0px',
                    left: '0',
                    borderRadius: '33px'
                  }}
                />
                <span className="absolute text-white" style={{ fontSize: '18px', top: '-2px', right: '60px' }}>®</span>
              </div>
            </a>
            <p className="text-gray-400 mb-6 leading-relaxed max-w-sm">
              Engineering precision fluid sealing solutions for the world's most demanding industrial applications.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a 
                href="#" 
                className="p-3 bg-[#1a1918] text-gray-400 hover:bg-[#e31e24] hover:text-white transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white text-sm tracking-widest uppercase mb-6">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Links */}
          <div>
            <h3 className="text-white text-sm tracking-widest uppercase mb-6">Products</h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries Links */}
          <div>
            <h3 className="text-white text-sm tracking-widest uppercase mb-6">Industries</h3>
            <ul className="space-y-3">
              {footerLinks.industries.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-500 text-sm">
              © {currentYear} Inmarco FZC. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <span className="text-gray-700">|</span>
              <a href="#" className="text-gray-500 hover:text-white transition-colors duration-200">
                Terms of Service
              </a>
              <span className="text-gray-700">|</span>
              <a href="#" className="text-gray-500 hover:text-white transition-colors duration-200">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>

        {/* Red Accent Line at Bottom */}
        <div className="h-1 bg-gradient-to-r from-transparent via-[#e31e24] to-transparent"></div>
      </div>
    </footer>
  );
}
