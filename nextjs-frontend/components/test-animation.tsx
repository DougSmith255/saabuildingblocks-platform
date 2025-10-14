'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, scaleIn } from '@/lib/animations';

/**
 * Test component to verify Framer Motion installation
 * Can be removed after verification
 */
export function TestAnimation() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-4 p-8"
    >
      <motion.h1
        variants={fadeInUp}
        className="text-4xl font-bold"
      >
        Framer Motion Test
      </motion.h1>

      <motion.p
        variants={fadeInUp}
        className="text-lg text-gray-600"
      >
        Animation library successfully installed!
      </motion.p>

      <motion.div
        variants={scaleIn}
        className="p-4 bg-blue-500 text-white rounded-lg"
      >
        Scale In Animation
      </motion.div>
    </motion.div>
  );
}
