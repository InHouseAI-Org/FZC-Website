import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: [
        'By accessing and using the Inmarco FZC website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.',
      ],
    },
    {
      title: '2. Use of Services',
      content: [
        'You may use our services only for lawful purposes and in accordance with these Terms. You agree not to:',
        '• Use our services in any way that violates applicable laws or regulations',
        '• Attempt to gain unauthorized access to our systems or networks',
        '• Interfere with or disrupt the integrity or performance of our services',
        '• Transmit any viruses, malware, or other harmful code',
        '• Collect or harvest any information from our services without authorization',
      ],
    },
    {
      title: '3. Products and Services',
      content: [
        'We provide industrial fluid sealing solutions including compression packing, gaskets, mechanical seals, and related products. Product specifications, availability, and pricing are subject to change without notice. We reserve the right to limit quantities and refuse service to any customer.',
      ],
    },
    {
      title: '4. Orders and Pricing',
      content: [
        'All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason. Prices are quoted in the specified currency and do not include shipping, handling, taxes, or duties unless otherwise stated. Payment terms will be specified in your quotation or invoice.',
      ],
    },
    {
      title: '5. Product Information and Specifications',
      content: [
        'We strive to provide accurate product information and technical specifications. However, we do not warrant that product descriptions, specifications, pricing, or other content on our website is accurate, complete, reliable, current, or error-free. Product images are for illustration purposes and may not represent actual products.',
      ],
    },
    {
      title: '6. Technical Recommendations',
      content: [
        'Any technical recommendations, application guidance, or engineering support provided by Inmarco is based on our experience and knowledge. However, the final selection and application of products remains the responsibility of the customer. We recommend independent testing and validation for critical applications.',
      ],
    },
    {
      title: '7. Intellectual Property',
      content: [
        'All content on our website, including text, graphics, logos, images, and software, is the property of Inmarco FZC or its licensors and is protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our prior written consent.',
      ],
    },
    {
      title: '8. Warranty and Disclaimers',
      content: [
        'Our products are subject to the warranties specified in our product documentation or purchase agreements. TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL OTHER WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.',
      ],
    },
    {
      title: '9. Limitation of Liability',
      content: [
        'TO THE MAXIMUM EXTENT PERMITTED BY LAW, INMARCO FZC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, DATA LOSS, OR BUSINESS INTERRUPTION, ARISING FROM YOUR USE OF OUR SERVICES OR PRODUCTS.',
        'Our total liability for any claims related to our services or products shall not exceed the amount paid by you for the specific product or service giving rise to the claim.',
      ],
    },
    {
      title: '10. Indemnification',
      content: [
        'You agree to indemnify, defend, and hold harmless Inmarco FZC and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, or expenses arising from your use of our services, violation of these Terms, or infringement of any third-party rights.',
      ],
    },
    {
      title: '11. Governing Law and Jurisdiction',
      content: [
        'These Terms shall be governed by and construed in accordance with the laws of the United Arab Emirates. Any disputes arising from these Terms or your use of our services shall be subject to the exclusive jurisdiction of the courts of Dubai, UAE.',
      ],
    },
    {
      title: '12. Returns and Cancellations',
      content: [
        'Returns and cancellations are subject to our returns policy. Custom-manufactured or specially ordered products may not be returnable. Please contact us for specific return authorization and instructions.',
      ],
    },
    {
      title: '13. Force Majeure',
      content: [
        'We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, including acts of God, war, terrorism, labor disputes, governmental actions, or natural disasters.',
      ],
    },
    {
      title: '14. Modifications to Terms',
      content: [
        'We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after changes are posted constitutes acceptance of the modified Terms.',
      ],
    },
    {
      title: '15. Severability',
      content: [
        'If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.',
      ],
    },
    {
      title: '16. Contact Information',
      content: [
        'If you have questions about these Terms of Service, please contact us:',
        '• Email: info@inmarco.ae',
        '• Phone: +971 55 948 7218',
        '• Address: Dubai, United Arab Emirates',
      ],
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
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-[2px] w-12 bg-[#e31e24]"></div>
              <span className="text-sm tracking-widest text-gray-400 uppercase">Legal</span>
            </div>
            <h1
              className="text-white mb-6"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                lineHeight: '1.1',
                letterSpacing: '-0.02em',
              }}
            >
              Terms of Service
            </h1>
            <p className="text-gray-400 text-lg">
              Last Updated: February 9, 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-[#2b2a29]">
        <div className="max-w-[900px] mx-auto px-6 lg:px-12">
          <motion.div
            className="mb-12"
          >
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Welcome to Inmarco FZC. These Terms of Service ("Terms") govern your access to and use of our website, products, and services. Please read these Terms carefully before using our services.
            </p>
          </motion.div>

          {sections.map((section, index) => (
            <motion.div
              key={index}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-white text-2xl mb-4 tracking-tight">{section.title}</h2>
              {section.content.map((paragraph, pIndex) => (
                <p key={pIndex} className="text-gray-300 leading-relaxed mb-3">
                  {paragraph}
                </p>
              ))}
            </motion.div>
          ))}

          {/* Back to Home Link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 pt-8 border-t border-gray-800"
          >
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-[#e31e24] hover:text-white transition-colors"
            >
              <span>← Back to Home</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
