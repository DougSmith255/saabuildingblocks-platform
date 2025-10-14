'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { Heart, Target, Users, TrendingUp, Shield, type LucideIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

/**
 * Team Value Data Interface
 * Fetched from WordPress API: GET /wp-json/saa/v1/homepage
 */
interface TeamValue {
  title: string;
  description: string;
}

/**
 * API Response Interface
 */
interface ApiResponse {
  values: TeamValue[];
}

/**
 * Icon mapping for each value position
 */
const VALUE_ICONS: LucideIcon[] = [Heart, Target, Users, TrendingUp, Shield];

/**
 * Team Values Section Component
 *
 * Features:
 * - Fetches values from WordPress API (5 values)
 * - Responsive grid: 1 col (mobile), 2 cols (tablet), 5 cols (desktop)
 * - Scroll-triggered slide-in animation from bottom
 * - Staggered timing (100ms delay per card)
 * - Minimal card design with gold accent hover
 * - TypeScript typed with error handling
 * - Accessibility compliant
 *
 * @component
 */
export default function TeamValues() {
  const [values, setValues] = useState<TeamValue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Intersection observer ref for scroll-triggered animation
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  useEffect(() => {
    const fetchValues = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const apiUrl = process.env['NEXT_PUBLIC_WORDPRESS_API_URL'];

        if (!apiUrl) {
          throw new Error('WordPress API URL is not configured');
        }

        // Construct the custom endpoint URL
        const baseUrl = apiUrl.replace('/wp/v2', '');
        const endpoint = `${baseUrl}/saa/v1/homepage`;

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          next: { revalidate: 3600 }, // 1 hour cache
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch values: ${response.status} ${response.statusText}`
          );
        }

        const data: ApiResponse = await response.json();

        if (!data.values || !Array.isArray(data.values)) {
          throw new Error('Invalid API response: values data missing or invalid');
        }

        // Ensure exactly 5 values
        setValues(data.values.slice(0, 5));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load team values';
        setError(errorMessage);
        console.error('Team Values Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchValues();
  }, []);

  // Loading State
  if (isLoading) {
    return (
      <section
        className="relative w-full bg-white py-16 md:py-24 lg:py-32"
        aria-label="Team values loading"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header Skeleton */}
          <div className="mb-12 text-center">
            <div className="mx-auto h-10 w-64 animate-pulse rounded-lg bg-neutral-200" />
            <div className="mx-auto mt-4 h-6 w-48 animate-pulse rounded-lg bg-neutral-200" />
          </div>

          {/* Values Grid Skeleton */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-xl border border-neutral-200 bg-neutral-50"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error State
  if (error || values.length === 0) {
    return (
      <section
        className="relative w-full bg-white py-16 md:py-24 lg:py-32"
        aria-label="Team values error"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div
              className="rounded-lg border border-red-200 bg-red-50 p-6"
              role="alert"
            >
              <p className="text-red-800">
                {error || 'No team values available'}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Container animation variants
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

  // Card slide-in from bottom variants
  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-white py-16 md:py-24 lg:py-32"
      aria-label="Team core values"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="display-lg font-taskor font-bold tracking-tight text-neutral-900">
            Our Core Values
          </h2>
          <p className="body-md mt-4 font-amulya text-neutral-600">
            What drives our team
          </p>
        </motion.div>

        {/* Values Grid */}
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {values.map((value, index) => {
            const IconComponent: LucideIcon = VALUE_ICONS[index] || Heart;

            return (
              <motion.div key={index} variants={cardVariants}>
                <Card className="group h-full border border-neutral-200 bg-transparent shadow-none transition-all duration-300 hover:border-gold-500 hover:shadow-md">
                  <CardHeader className="pb-4 text-center">
                    {/* Icon */}
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-50 transition-all duration-300 group-hover:bg-gold-100">
                        <IconComponent className="h-8 w-8 text-gold-600 transition-all duration-300 group-hover:scale-110" />
                      </div>
                    </div>

                    {/* Title */}
                    <CardTitle className="text-center">
                      <h3 className="text-xl font-semibold font-taskor text-neutral-900">
                        {value.title}
                      </h3>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0 text-center">
                    {/* Description */}
                    <p className="body-sm font-amulya text-neutral-600 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
