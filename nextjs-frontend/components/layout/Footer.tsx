'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Facebook,
  Linkedin,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

/**
 * Footer Component
 *
 * Features:
 * - 4-column responsive layout (1 col mobile, 2 col tablet, 4 col desktop)
 * - Company info, navigation, resources, contact sections
 * - Social media icons with hover effects
 * - Gold accent border at top
 * - Accessibility compliant (ARIA labels, semantic HTML)
 * - Dark background with light text
 *
 * @component
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Footer navigation data
  const footerData = {
    about: {
      title: 'Smart Agent Alliance',
      description:
        'Empowering businesses with intelligent solutions and expert consulting services.',
    },
    quickLinks: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
    resources: [
      { label: 'FAQs', href: '/faqs' },
      { label: 'Support', href: '/support' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
    contact: {
      email: 'hello@smartagentalliance.com',
      phone: '+1 (555) 123-4567',
      address: '123 Business Ave, Suite 100, San Francisco, CA 94102',
    },
    social: [
      {
        name: 'Facebook',
        href: 'https://facebook.com/smartagentalliance',
        icon: Facebook,
      },
      {
        name: 'LinkedIn',
        href: 'https://linkedin.com/company/smartagentalliance',
        icon: Linkedin,
      },
      {
        name: 'Instagram',
        href: 'https://instagram.com/smartagentalliance',
        icon: Instagram,
      },
      {
        name: 'Twitter',
        href: 'https://twitter.com/smartagentalliance',
        icon: Twitter,
      },
    ],
  };

  // Animation variants for stagger effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  return (
    <footer
      className="relative w-full border-t border-gold-500 bg-neutral-900 text-neutral-50"
      aria-label="Site footer"
    >
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Column 1: About */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-bold tracking-tight text-gold-400">
              {footerData.about.title}
            </h3>
            <p className="text-sm leading-relaxed text-neutral-300">
              {footerData.about.description}
            </p>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-lg font-semibold text-neutral-50">
              Quick Links
            </h4>
            <nav aria-label="Footer quick links">
              <ul className="space-y-2">
                {footerData.quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block text-sm text-neutral-300 transition-colors duration-200 hover:text-gold-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>

          {/* Column 3: Resources */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-lg font-semibold text-neutral-50">Resources</h4>
            <nav aria-label="Footer resources">
              <ul className="space-y-2">
                {footerData.resources.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block text-sm text-neutral-300 transition-colors duration-200 hover:text-gold-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>

          {/* Column 4: Contact */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-lg font-semibold text-neutral-50">
              Get in Touch
            </h4>
            <address className="not-italic">
              <ul className="space-y-3 text-sm text-neutral-300">
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold-400" />
                  <a
                    href={`mailto:${footerData.contact.email}`}
                    className="transition-colors duration-200 hover:text-gold-400"
                  >
                    {footerData.contact.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold-400" />
                  <a
                    href={`tel:${footerData.contact.phone.replace(/\s/g, '')}`}
                    className="transition-colors duration-200 hover:text-gold-400"
                  >
                    {footerData.contact.phone}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold-400" />
                  <span>{footerData.contact.address}</span>
                </li>
              </ul>
            </address>

            {/* Social Media Icons */}
            <div className="pt-4">
              <h5 className="mb-3 text-sm font-semibold text-neutral-50">
                Follow Us
              </h5>
              <div className="flex gap-4">
                {footerData.social.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                      aria-label={`Follow us on ${social.name}`}
                    >
                      <Icon
                        className="h-5 w-5 text-neutral-400 transition-colors duration-200 group-hover:text-gold-400"
                        aria-hidden="true"
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Bar: Copyright */}
      <div className="border-t border-neutral-800">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col items-center justify-between gap-4 text-sm text-neutral-400 sm:flex-row"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p>
              &copy; {currentYear} Smart Agent Alliance. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="transition-colors duration-200 hover:text-gold-400"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="transition-colors duration-200 hover:text-gold-400"
              >
                Terms
              </Link>
              <Link
                href="/cookies"
                className="transition-colors duration-200 hover:text-gold-400"
              >
                Cookies
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative gradient at bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-50"
        aria-hidden="true"
      />
    </footer>
  );
}
