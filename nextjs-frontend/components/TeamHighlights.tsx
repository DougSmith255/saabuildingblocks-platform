'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, TrendingUp, Users } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Highlight {
  title: string;
  description: string;
}

interface TeamHighlightsProps {
  highlights?: Highlight[];
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'Personalized Support': User,
  'Growth Tools': TrendingUp,
  'Community': Users,
};

const DEFAULT_HIGHLIGHTS: Highlight[] = [
  {
    title: 'Personalized Support',
    description: 'Tailored guidance and resources designed specifically for your unique journey and goals.',
  },
  {
    title: 'Growth Tools',
    description: 'Comprehensive toolkit to track progress, set milestones, and achieve sustainable growth.',
  },
  {
    title: 'Community',
    description: 'Connect with like-minded individuals in a supportive environment focused on mutual success.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 200,
      damping: 15,
      delay: 0.2,
    },
  },
};

export function TeamHighlights({ highlights = DEFAULT_HIGHLIGHTS }: TeamHighlightsProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Why Choose Our Team
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover the advantages that set us apart and help you succeed
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {highlights.map((highlight, index) => {
            const IconComponent = ICON_MAP[highlight.title] || User;

            return (
              <motion.div
                key={`${highlight.title}-${index}`}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3 },
                }}
                className="h-full"
              >
                <Card className="h-full bg-background border-2 border-border hover:border-[#D4AF37]/50 transition-all duration-300 shadow-md hover:shadow-xl">
                  <CardHeader className="space-y-4">
                    <motion.div
                      variants={iconVariants}
                      className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 flex items-center justify-center border-2 border-[#D4AF37]/30"
                    >
                      <IconComponent className="w-7 h-7 text-[#D4AF37]" />
                    </motion.div>
                    <CardTitle className="text-xl font-semibold">
                      {highlight.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed text-muted-foreground">
                      {highlight.description}
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

export default TeamHighlights;
