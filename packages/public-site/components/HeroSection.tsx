'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@saa/shared/components/ui/button';
import Link from 'next/link';

/**
 * Hero Section Data Interface
 * Fetched from WordPress API: GET /wp-json/saa/v1/homepage
 */
interface HeroData {
  headline: string;
  subheadline: string;
  cta_text: string;
  cta_url: string;
}

/**
 * API Response Interface
 */
interface ApiResponse {
  hero: HeroData;
}

/**
 * Hero Section Component
 *
 * Features:
 * - Fetches hero content from WordPress API
 * - Responsive design (mobile-first to desktop)
 * - Gold brand colors with hover effects
 * - Framer Motion fade-in-up animation
 * - Accessibility compliant (ARIA labels, semantic HTML)
 * - Error handling and loading states
 *
 * @component
 */
export default function HeroSection() {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const apiUrl = process.env['NEXT_PUBLIC_WORDPRESS_API_URL'];

        if (!apiUrl) {
          throw new Error('WordPress API URL is not configured');
        }

        // Construct the custom endpoint URL
        // Remove /wp/v2 from the base URL and add /saa/v1/homepage
        const baseUrl = apiUrl.replace('/wp/v2', '');
        const endpoint = `${baseUrl}/saa/v1/homepage`;

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Use cache with revalidation for better performance
          next: { revalidate: 3600 }, // 1 hour
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch hero data: ${response.status} ${response.statusText}`
          );
        }

        const data: ApiResponse = await response.json();

        if (!data.hero) {
          throw new Error('Invalid API response: hero data missing');
        }

        setHeroData(data.hero);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load hero section';
        setError(errorMessage);
        console.error('Hero Section Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // Loading State
  if (isLoading) {
    return (
      <section
        className="relative w-full bg-neutral-50 py-16 md:py-24 lg:py-32"
        aria-label="Hero section loading"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="h-16 w-3/4 animate-pulse rounded-lg bg-neutral-200 md:h-20" />
            <div className="mt-6 h-6 w-2/3 animate-pulse rounded-lg bg-neutral-200" />
            <div className="mt-8 h-12 w-40 animate-pulse rounded-lg bg-neutral-200" />
          </div>
        </div>
      </section>
    );
  }

  // Error State
  if (error || !heroData) {
    return (
      <section
        className="relative w-full bg-neutral-50 py-16 md:py-24 lg:py-32"
        aria-label="Hero section error"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div
              className="rounded-lg border border-red-200 bg-red-50 p-6"
              role="alert"
            >
              <p className="text-red-800">
                {error || 'Failed to load hero section'}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Main Hero Section
  return (
    <section
      className="relative w-full overflow-hidden bg-gradient-to-b from-neutral-50 to-white py-16 md:py-24 lg:py-32"
      aria-label="Hero section"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col items-center justify-center text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Headline */}
          <motion.h1
            className="text-display display-xl font-taskor font-bold tracking-tight text-neutral-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            {heroData.headline}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="body-lg mt-6 max-w-3xl font-amulya text-neutral-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            {heroData.subheadline}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          >
            <Button
              asChild
              size="lg"
              className="text-display bg-gold-500 text-neutral-900 hover:bg-gold-600 focus-visible:ring-gold-500 transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              <Link
                href={heroData.cta_url}
                aria-label={heroData.cta_text}
              >
                {heroData.cta_text}
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative gradient overlay (optional) */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white opacity-50"
        aria-hidden="true"
      />
    </section>
  );
}
