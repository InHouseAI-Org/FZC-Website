import { Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import inmarcoLogo from '@/assets/inmarco-tagline-logo.png';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about-us' },
      { label: 'Contact', href: '/contact' },
    ],
    products: [
      { label: 'Compression Packing', href: '/products/compression-packing' },
      { label: 'Valve Sealing', href: '/products/valve-sealing' },
      { label: 'Industrial Gaskets', href: '/products/industrial-gaskets' },
      { label: 'Thermal Insulation', href: '/products/thermal-insulation' },
      { label: 'Elastomeric Sealing', href: '/products/elastomeric-sealing' },
      { label: 'Expansion Joints', href: '/products/expansion-joints' },
    ],
    industries: [
      { label: 'Oil & Gas', href: '/industries/oil-gas' },
      { label: 'Power Generation', href: '/industries/power-generation' },
      { label: 'Metallurgy', href: '/industries/metallurgy' },
      { label: 'Chemical', href: '/industries/chemical' },
      { label: 'Marine', href: '/industries/marine' },
      { label: 'Cement', href: '/industries/cement' },
      { label: 'Fertilizers', href: '/industries/fertilizers' },
      { label: 'Pulp & Paper', href: '/industries/pulp-paper' },
      { label: 'Sugar', href: '/industries/sugar' },
      { label: 'Food & Pharmaceutical', href: '/industries/food-pharmaceutical' },
      { label: 'OEM', href: '/industries/oem' },
    ]
  };

  return (
    <footer className="bg-[#2b2a29]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="relative flex items-center mb-6">
              <div className="relative overflow-hidden" style={{ width: '180px', height: '125px' }}>
                <img
                  src={inmarcoLogo}
                  alt="INMARCO"
                  className="absolute"
                  style={{
                    height: '100%',
                    top: '0px',
                    left: '0',
                    borderRadius: '0px'
                  }}
                />
                {/* <span className="absolute text-white" style={{ fontSize: '18px', top: '-2px', right: '60px' }}>®</span> */}
              </div>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed max-w-sm">
              Engineering precision fluid sealing solutions for the world's most demanding industrial applications.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a
                href="https://www.linkedin.com/company/inmarco/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
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
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
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
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
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
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-500 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-500 text-sm">
              © {currentYear} Inmarco FZC. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy-policy" className="text-gray-500 hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <span className="text-gray-700">|</span>
              <Link to="/terms-of-service" className="text-gray-500 hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
              <span className="text-gray-700">|</span>
              <Link to="/cookie-policy" className="text-gray-500 hover:text-white transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Red Accent Line at Bottom */}
        <div className="h-1 bg-gradient-to-r from-transparent via-[#e31e24] to-transparent"></div>
      </div>
    </footer>
  );
}
