'use client';

import { Linkedin, Youtube } from 'lucide-react';
import Link from 'next/link';
import inmarcoLogo from '@/assets/inmarco-tagline-logo1.png';
import industriesData from '@/data/industries.json';
import productsData from '@/data/productsData.json';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about-us' },
      { label: 'Contact', href: '/contact' },
    ],
    products: productsData.categories.map((product: { name: string; href: string }) => ({
      label: product.name,
      href: product.href
    })),
    industries: industriesData.industries.map((industry: { title: string; href: string }) => ({
      label: industry.title,
      href: industry.href
    }))
  };

  return (
    <footer className="bg-[#2b2a29]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="relative flex items-center mb-6"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="relative overflow-hidden" style={{ width: '230px', height: '180px' }}>
                <img
                  src={inmarcoLogo.src || inmarcoLogo}
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
              <a
                href="https://www.youtube.com/@inmarco"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#1a1918] text-gray-400 hover:bg-[#e31e24] hover:text-white transition-colors duration-300"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
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
                    href={link.href}
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
                    href={link.href}
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
                    href={link.href}
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
              <Link href="/privacy-policy" className="text-gray-500 hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <span className="text-gray-700">|</span>
              <Link href="/terms-of-service" className="text-gray-500 hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
              <span className="text-gray-700">|</span>
              <Link href="/cookie-policy" className="text-gray-500 hover:text-white transition-colors duration-200">
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
