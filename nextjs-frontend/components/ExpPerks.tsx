'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  TrendingUp,
  Users,
  DollarSign,
  Globe,
  BookOpen,
  Zap,
  Shield,
  Target,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Perk {
  title: string;
  description: string;
}

interface ExpPerksData {
  perks: Perk[];
}

// Icon mapping for each perk based on common eXp benefits
const perkIcons = [
  Award,
  TrendingUp,
  Users,
  DollarSign,
  Globe,
  BookOpen,
  Zap,
  Shield,
  Target,
];

export default function ExpPerks() {
  const [perks, setPerks] = useState<Perk[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Fetch perks data from WordPress API
  useEffect(() => {
    const fetchPerks = async () => {
      try {
        const response = await fetch(
          `${process.env['NEXT_PUBLIC_API_URL']}/wp-json/saa/v1/homepage`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch perks data');
        }

        const data: ExpPerksData = await response.json();

        // Ensure we have exactly 9 perks
        if (data.perks && Array.isArray(data.perks)) {
          setPerks(data.perks.slice(0, 9));
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching perks:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchPerks();
  }, []);

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  // Individual card animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  if (loading) {
    return (
      <section className="py-16 px-4 bg-neutral-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <div className="h-8 bg-neutral-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-neutral-200 rounded w-48 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, index) => (
              <div
                key={index}
                className="h-48 bg-white border border-neutral-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 bg-neutral-50">
        <div className="container mx-auto max-w-7xl text-center">
          <p className="text-red-600">Failed to load eXp Realty benefits</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="py-16 px-4 bg-neutral-50"
      aria-labelledby="exp-perks-heading"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2
            id="exp-perks-heading"
            className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4"
          >
            eXp Realty Benefits
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Why join our team at eXp
          </p>
        </div>

        {/* Perks Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {perks.map((perk, index) => {
            const IconComponent = perkIcons[index] || Award;

            return (
              <motion.div
                key={`${perk.title}-${index}`}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.2 },
                }}
              >
                <Card className="h-full bg-white border-neutral-200 hover:border-yellow-500 transition-all duration-300 hover:shadow-lg group">
                  <CardHeader>
                    <div className="mb-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-neutral-100 group-hover:bg-yellow-50 transition-colors duration-300">
                        <IconComponent className="w-6 h-6 text-neutral-700 group-hover:text-yellow-600 transition-colors duration-300" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-neutral-900 group-hover:text-yellow-600 transition-colors duration-300">
                      {perk.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-neutral-600 leading-relaxed">
                      {perk.description}
                    </CardDescription>
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
