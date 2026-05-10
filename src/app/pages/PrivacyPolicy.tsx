'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  const sections = [
    {
      title: '1. Information We Collect',
      content: [
        'We collect information that you provide directly to us, including:',
        '• Personal identification information (name, email address, phone number, company name)',
        '• Technical information about your use of our website',
        '• Information provided when you request quotes, contact us, or subscribe to our communications',
        '• Business information related to your sealing requirements and applications',
      ],
    },
    {
      title: '2. How We Use Your Information',
      content: [
        'We use the information we collect to:',
        '• Respond to your inquiries and provide customer support',
        '• Process your orders and deliver products or services',
        '• Send you technical information, updates, and marketing communications',
        '• Improve our website, products, and services',
        '• Comply with legal obligations and protect our rights',
      ],
    },
    {
      title: '3. Information Sharing and Disclosure',
      content: [
        'We do not sell or rent your personal information to third parties. We may share your information with:',
        '• Service providers who assist in our business operations',
        '• Business partners for joint marketing or product offerings',
        '• Legal authorities when required by law or to protect our rights',
        '• In connection with a business transaction such as a merger or acquisition',
      ],
    },
    {
      title: '4. Data Security',
      content: [
        'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.',
      ],
    },
    {
      title: '5. Your Rights and Choices',
      content: [
        'You have the right to:',
        '• Access, correct, or delete your personal information',
        '• Object to or restrict certain processing of your data',
        '• Opt-out of marketing communications',
        '• Request data portability',
        '• Withdraw consent where processing is based on consent',
        'To exercise these rights, please contact us at info@inmarco.ae',
      ],
    },
    {
      title: '6. Cookies and Tracking Technologies',
      content: [
        'We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. For more information, please see our Cookie Policy.',
      ],
    },
    {
      title: '7. International Data Transfers',
      content: [
        'Your information may be transferred to and processed in countries other than your country of residence. We ensure that appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.',
      ],
    },
    {
      title: '8. Children\'s Privacy',
      content: [
        'Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.',
      ],
    },
    {
      title: '9. Changes to This Privacy Policy',
      content: [
        'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. Your continued use of our services after any changes indicates your acceptance of the updated policy.',
      ],
    },
    {
      title: '10. Contact Us',
      content: [
        'If you have any questions about this Privacy Policy, please contact us:',
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
              Privacy Policy
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
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              At Inmarco FZC ("we," "us," or "our"), we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
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
              href="/"
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
