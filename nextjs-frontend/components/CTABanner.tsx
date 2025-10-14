'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * CTA Banner Component
 *
 * Features:
 * - Full-width banner with parallax scroll effect
 * - Gold gradient background with overlay
 * - Framer Motion fade-in-up animation
 * - Responsive design (mobile-first to desktop)
 * - Accessibility compliant (ARIA labels, semantic HTML)
 * - Hover scale effect on CTA button
 *
 * @component
 */
export default function CTABanner() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Parallax effect: background moves slower than content
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 0.6]);

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden py-20 md:py-28 lg:py-32"
      aria-label="Call to action banner"
    >
      {/* Parallax Background with Gold Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-gold-600 via-gold-500 to-gold-400"
        style={{ y: backgroundY, opacity }}
        aria-hidden="true"
      >
        {/* Optional: Add background pattern or image */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.1)_0%,transparent_50%)]" />
      </motion.div>

      {/* Dark overlay for better text contrast */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-900/10 to-neutral-900/20"
        aria-hidden="true"
      />

      {/* Content Container */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col items-center justify-center text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {/* Heading */}
          <motion.h2
            className="heading-xl font-taskor font-bold tracking-tight text-neutral-900 md:display-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            Ready to Join Our Team?
          </motion.h2>

          {/* Subheading */}
          <motion.p
            className="body-xl mt-6 max-w-2xl font-amulya text-neutral-800 md:text-neutral-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            Let&apos;s discuss how we can support your growth
          </motion.p>

          {/* CTA Button with Icon */}
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          >
            <Button
              asChild
              size="lg"
              className="group bg-neutral-900 px-8 py-6 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-neutral-800 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] focus-visible:ring-neutral-900"
            >
              <Link
                href="/contact"
                aria-label="Schedule a call with our team"
                className="inline-flex items-center gap-2"
              >
                Schedule a Call
                <ArrowRight
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </motion.div>

          {/* Optional: Trust indicators */}
          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-700"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
          >
            <span className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-neutral-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Free Consultation
            </span>
            <span className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-neutral-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              No Commitment Required
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
