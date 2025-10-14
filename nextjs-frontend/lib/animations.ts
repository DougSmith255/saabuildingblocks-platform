/**
 * Framer Motion Animation Utilities
 *
 * Common animation variants for consistent motion design across the application.
 * These variants follow modern web animation best practices for performance and UX.
 */

import type { Variants } from 'framer-motion';

/**
 * Fade in with upward motion
 * Perfect for cards, sections, and content blocks
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

/**
 * Stagger container for animating children sequentially
 * Use with direct children that have fadeInUp or similar variants
 */
export const staggerContainer: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

/**
 * Scale in animation with fade
 * Great for modals, popovers, and feature highlights
 */
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

/**
 * Slide in from left
 * Useful for side panels and navigation elements
 */
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -50
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
};

/**
 * Slide in from right
 * Useful for side panels and navigation elements
 */
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 50
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
};

/**
 * Bounce animation for attention-grabbing elements
 * Use sparingly for CTAs or important notifications
 */
export const bounce: Variants = {
  hidden: {
    scale: 1
  },
  visible: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
      times: [0, 0.5, 1]
    }
  }
};

/**
 * Rotate and fade in
 * Perfect for icons and decorative elements
 */
export const rotateIn: Variants = {
  hidden: {
    opacity: 0,
    rotate: -10
  },
  visible: {
    opacity: 1,
    rotate: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

/**
 * Page transition variants
 * Use with AnimatePresence for route changes
 */
export const pageTransition: Variants = {
  hidden: {
    opacity: 0,
    x: -20
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.3,
      ease: 'easeIn'
    }
  }
};
