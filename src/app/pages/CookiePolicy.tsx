import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function CookiePolicy() {
  const sections = [
    {
      title: '1. What Are Cookies?',
      content: [
        'Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.',
        'Cookies allow websites to remember your actions and preferences (such as login, language, font size, and other display preferences) over a period of time, so you don\'t have to keep re-entering them whenever you come back to the site or browse from one page to another.',
      ],
    },
    {
      title: '2. How We Use Cookies',
      content: [
        'Inmarco FZC uses cookies to:',
        '• Remember your preferences and settings',
        '• Understand how you use our website and improve user experience',
        '• Analyze website traffic and performance',
        '• Deliver relevant content and advertising',
        '• Ensure the security and proper functioning of our website',
        '• Remember your login information (if applicable)',
      ],
    },
    {
      title: '3. Types of Cookies We Use',
      content: [
        'Essential Cookies: These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt out of these cookies.',
        'Performance Cookies: These cookies collect information about how visitors use our website, such as which pages are visited most often. This helps us improve the performance and design of our website.',
        'Functionality Cookies: These cookies allow our website to remember choices you make (such as your username, language, or region) and provide enhanced, personalized features.',
        'Analytics Cookies: We use analytics cookies to understand how visitors interact with our website. This information helps us improve our website\'s functionality and content.',
        'Marketing Cookies: These cookies track your online activity to help us deliver more relevant advertising or limit how many times you see an advertisement. They may be set by us or third-party advertising partners.',
      ],
    },
    {
      title: '4. Third-Party Cookies',
      content: [
        'In addition to our own cookies, we may use third-party cookies to:',
        '• Analyze website usage (e.g., Google Analytics)',
        '• Provide social media features (e.g., LinkedIn)',
        '• Deliver targeted advertising',
        'These third parties may collect information about your online activities over time and across different websites. Their use of cookies is governed by their own privacy policies.',
      ],
    },
    {
      title: '5. Cookie Duration',
      content: [
        'Session Cookies: These are temporary cookies that expire when you close your browser. They are used to remember your actions during a single browsing session.',
        'Persistent Cookies: These cookies remain on your device for a set period or until you delete them. They are used to remember your preferences and settings across multiple visits.',
      ],
    },
    {
      title: '6. Managing Your Cookie Preferences',
      content: [
        'You have several options for managing cookies:',
        'Browser Settings: Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or delete certain cookies. Please note that if you block or delete cookies, some features of our website may not function properly.',
        'Opt-Out Tools: You can opt out of targeted advertising cookies by visiting:',
        '• Your Online Choices: www.youronlinechoices.com',
        '• Network Advertising Initiative: www.networkadvertising.org/choices',
        '• Digital Advertising Alliance: www.aboutads.info/choices',
        'Google Analytics Opt-Out: You can prevent Google Analytics from recognizing you on return visits by downloading and installing the Google Analytics Opt-out Browser Add-on: tools.google.com/dlpage/gaoptout',
      ],
    },
    {
      title: '7. Do Not Track Signals',
      content: [
        'Some web browsers have a "Do Not Track" (DNT) feature that signals to websites that you do not want to be tracked. Currently, there is no industry standard for how to respond to DNT signals. At this time, our website does not respond to DNT browser settings.',
      ],
    },
    {
      title: '8. Cookies We Use',
      content: [
        'Below is a list of the main cookies we use on our website:',
        '• Session ID: Essential cookie for maintaining your session',
        '• Preferences: Remembers your language and display preferences',
        '• Analytics: Google Analytics cookies (_ga, _gid, _gat) for website analytics',
        '• Security: Cookies to protect against fraudulent activity',
        'This list may be updated periodically. For the most current information, please check this policy regularly.',
      ],
    },
    {
      title: '9. Changes to This Cookie Policy',
      content: [
        'We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our business practices. We will notify you of any significant changes by posting the updated policy on our website with a new "Last Updated" date.',
      ],
    },
    {
      title: '10. Contact Us',
      content: [
        'If you have questions about our use of cookies or this Cookie Policy, please contact us:',
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
            animate={{opacity :1, y: 0}}
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
              Cookie Policy
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
              This Cookie Policy explains how Inmarco FZC ("we," "us," or "our") uses cookies and similar technologies on our website. By using our website, you consent to the use of cookies in accordance with this policy.
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
