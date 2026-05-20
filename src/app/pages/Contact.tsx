'use client';

import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Mail, Clock, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    enquiryType: 'sales',
    message: '',
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const enquiryTypes = [
    { value: 'sales', label: 'Sales Enquiry' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'general', label: 'General Information' },
    { value: 'partnership', label: 'Partnership Opportunities' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Thank you for contacting us! We will get back to you shortly.',
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          enquiryType: 'sales',
          message: '',
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.message || 'Failed to send message. Please try again.',
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEnquiryTypeSelect = (value: string) => {
    setFormData({
      ...formData,
      enquiryType: value,
    });
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Registered Office',
      details: ['P.O. Box 120284', 'SAIF-Zone, Sharjah', 'United Arab Emirates'],
    },
    {
      icon: Phone,
      title: 'Phone',
      details: ['+971 55 948 7218', '+971 65 578 378'],
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['sales@inmarco.ae'],
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: ['Monday - Saturday', '8:30 AM - 5:30 PM GST'],
    },
  ];

  return (
    <main className="bg-[#2b2a29]">
      {/* Hero Section */}
      <section className="relative py-24 bg-[#1a1918]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="h-[2px] w-12 bg-[#e31e24] mb-6"></div>
            <h1 className="text-white mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: '1.1', letterSpacing: '-0.02em' }}>
              Get in Touch
            </h1>
            <p className="text-gray-300 text-xl">
              Have a question about our sealing solutions? Our team of experts is here to help you find the right solution for your application.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 bg-[#1a1918]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-[2px] w-12 bg-[#e31e24]"></div>
                <span className="text-sm tracking-widest text-gray-400 uppercase">Send us a message</span>
              </div>

              <h2 className="text-white text-3xl lg:text-4xl mb-8 tracking-tight">
                Contact Form
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-300 mb-2 text-sm font-medium">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-[#2b2a29] border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#e31e24] focus:ring-1 focus:ring-[#e31e24] transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-gray-300 mb-2 text-sm font-medium">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-[#2b2a29] border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#e31e24] focus:ring-1 focus:ring-[#e31e24] transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-gray-300 mb-2 text-sm font-medium">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-[#2b2a29] border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#e31e24] focus:ring-1 focus:ring-[#e31e24] transition-all"
                      placeholder="+971 XXX XXXX"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-gray-300 mb-2 text-sm font-medium">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full bg-[#2b2a29] border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#e31e24] focus:ring-1 focus:ring-[#e31e24] transition-all"
                      placeholder="Your Company"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="enquiryType" className="block text-gray-300 mb-2 text-sm font-medium">
                    Enquiry Type *
                  </label>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full bg-[#2b2a29] border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#e31e24] focus:ring-1 focus:ring-[#e31e24] transition-all flex items-center justify-between"
                    >
                      <span>{enquiryTypes.find(type => type.value === formData.enquiryType)?.label}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#e31e24] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-10 w-full mt-2 bg-[#2b2a29] border border-gray-700 rounded-lg shadow-lg overflow-hidden"
                        >
                          {enquiryTypes.map((type, index) => (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() => handleEnquiryTypeSelect(type.value)}
                              className={`w-full px-4 py-3 text-left text-white hover:bg-[#e31e24] transition-colors duration-200 ${
                                formData.enquiryType === type.value ? 'bg-[#e31e24]/20' : ''
                              } ${index !== enquiryTypes.length - 1 ? 'border-b border-gray-700' : ''}`}
                            >
                              {type.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-300 mb-2 text-sm font-medium">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full bg-[#2b2a29] border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#e31e24] focus:ring-1 focus:ring-[#e31e24] transition-all resize-none"
                    placeholder="Tell us about your requirements..."
                  />
                </div>

                {/* Status Message */}
                <AnimatePresence>
                  {submitStatus.type && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`p-4 rounded-lg border ${
                        submitStatus.type === 'success'
                          ? 'bg-green-900/20 border-green-600 text-green-400'
                          : 'bg-red-900/20 border-red-600 text-red-400'
                      }`}
                    >
                      {submitStatus.message}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#e31e24] text-white px-8 py-4 rounded-lg hover:bg-[#c41a20] transition-colors duration-300 tracking-wide text-sm uppercase font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>

            {/* Additional Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:pl-12"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-[2px] w-12 bg-[#e31e24]"></div>
                <span className="text-sm tracking-widest text-gray-400 uppercase">Need Help?</span>
              </div>

              <h2 className="text-white text-3xl lg:text-4xl mb-8 tracking-tight">
                How Can We Assist You?
              </h2>

              <div className="space-y-8">
                <div className="bg-[#2b2a29] p-6 border-l-2 border-[#e31e24]">
                  <h3 className="text-white text-xl mb-3 tracking-tight">Sales Enquiries</h3>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Need a quote or want to discuss your sealing requirements? Our sales team is ready to provide expert guidance and competitive pricing.
                  </p>
                  <a href="mailto:sales@inmarco.ae" className="text-[#e31e24] hover:underline">
                    sales@inmarco.ae
                  </a>
                </div>

                <div className="bg-[#2b2a29] p-6 border-l-2 border-[#e31e24]">
                  <h3 className="text-white text-xl mb-3 tracking-tight">Technical Support</h3>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Get expert technical assistance for product selection, installation guidance, or troubleshooting from our engineering team.
                  </p>
                </div>

                <div className="bg-[#2b2a29] p-6 border-l-2 border-[#e31e24]">
                  <h3 className="text-white text-xl mb-3 tracking-tight">Visit Our Office</h3>
                  <p className="text-gray-400 leading-relaxed">
                    We welcome you to visit our facility in Sharjah to discuss your requirements in person and see our manufacturing capabilities firsthand.
                  </p>
                </div>

                <div className="bg-[#2b2a29] p-6">
                  <h3 className="text-white text-xl mb-4 tracking-tight">Connect With Us</h3>
                  <div className="flex space-x-4">
                    <a
                      href="https://www.linkedin.com/company/inmarco/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-[#1a1918] flex items-center justify-center hover:bg-[#e31e24] transition-colors duration-300"
                    >
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 bg-[#2b2a29]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-[#1a1918] p-8 border-t-2 border-[#e31e24] rounded-lg"
                >
                  <Icon className="w-10 h-10 text-[#e31e24] mb-4" />
                  <h3 className="text-white text-lg mb-3 tracking-tight">{info.title}</h3>
                  <div className="space-y-1">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-400 text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
