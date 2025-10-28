/**
 * Animation Variants for Category Templates
 *
 * GPU-accelerated animation variants using Framer Motion.
 * All animations use transform and opacity only for optimal performance.
 *
 * @module animations/variants
 * @version 1.0.0
 */

import type { Variants, Transition } from 'framer-motion';

/**
 * Default transition configuration
 * Duration: 0.5-0.6s for smooth, perceptible animations
 * Easing: ease-out for natural deceleration
 */
const DEFAULT_TRANSITION: Transition = {
  duration: 0.6,
  ease: 'easeOut',
};

/**
 * Shorter transition for subtle animations
 */
const SUBTLE_TRANSITION: Transition = {
  duration: 0.5,
  ease: 'easeOut',
};

/**
 * Reduced motion configuration (respects prefers-reduced-motion)
 * Removes transforms, only animates opacity
 */
const REDUCED_MOTION_TRANSITION: Transition = {
  duration: 0.3,
  ease: 'linear',
};

/**
 * Fade In Animation
 * Simple opacity fade from 0 to 1
 *
 * @example
 * <motion.div variants={fadeIn} initial="hidden" animate="visible">
 *   Content
 * </motion.div>
 */
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: DEFAULT_TRANSITION,
  },
};

/**
 * Slide Up + Fade Animation
 * Slides element up from 50px below while fading in
 * Most common animation for scroll-triggered content
 *
 * @example
 * <motion.div variants={slideUpFade} initial="hidden" animate="visible">
 *   Content
 * </motion.div>
 */
export const slideUpFade: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: DEFAULT_TRANSITION,
  },
};

/**
 * Scale In + Fade Animation
 * Scales element from 0.8 to 1.0 while fading in
 * Great for cards, buttons, and emphasis
 *
 * @example
 * <motion.div variants={scaleInFade} initial="hidden" animate="visible">
 *   Card Content
 * </motion.div>
 */
export const scaleInFade: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: DEFAULT_TRANSITION,
  },
};

/**
 * Slide Left + Fade Animation
 * Slides element in from the right (50px) while fading
 * Good for timeline items or directional content
 *
 * @example
 * <motion.div variants={slideLeftFade} initial="hidden" animate="visible">
 *   Content
 * </motion.div>
 */
export const slideLeftFade: Variants = {
  hidden: {
    opacity: 0,
    x: 50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: DEFAULT_TRANSITION,
  },
};

/**
 * Slide Right + Fade Animation
 * Slides element in from the left (-50px) while fading
 * Good for alternating timeline items or directional content
 *
 * @example
 * <motion.div variants={slideRightFade} initial="hidden" animate="visible">
 *   Content
 * </motion.div>
 */
export const slideRightFade: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: DEFAULT_TRANSITION,
  },
};

/**
 * Stagger Container Variant
 * Used on parent elements to stagger child animations
 *
 * @param staggerDelay - Delay between each child animation (in seconds)
 * @returns Variants object with stagger configuration
 *
 * @example
 * <motion.div variants={stagger(0.1)} initial="hidden" animate="visible">
 *   <motion.div variants={fadeIn}>Child 1</motion.div>
 *   <motion.div variants={fadeIn}>Child 2</motion.div>
 *   <motion.div variants={fadeIn}>Child 3</motion.div>
 * </motion.div>
 */
export function stagger(staggerDelay: number = 0.1): Variants {
  return {
    hidden: {
      opacity: 1, // Parent stays visible
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };
}

/**
 * Pulse Animation
 * Subtle scale animation that loops
 * Great for attention-grabbing CTAs or "new" badges
 *
 * @example
 * <motion.div variants={pulse} initial="idle" animate="active">
 *   New Feature!
 * </motion.div>
 */
export const pulse: Variants = {
  idle: {
    scale: 1,
  },
  active: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Preset Animation Configurations
 * Pre-configured animation settings for different intensity levels
 */
export const ANIMATION_PRESETS = {
  /**
   * Subtle Preset
   * - Shorter duration (0.4s)
   * - Smaller transforms
   * - Best for frequent animations or secondary content
   */
  subtle: {
    duration: 0.4,
    ease: 'easeOut' as const,
    staggerDelay: 0.05,
    distance: 30, // pixels for slide animations
  },

  /**
   * Moderate Preset (Default)
   * - Medium duration (0.6s)
   * - Standard transforms
   * - Best for most content
   */
  moderate: {
    duration: 0.6,
    ease: 'easeOut' as const,
    staggerDelay: 0.1,
    distance: 50, // pixels for slide animations
  },

  /**
   * Dramatic Preset
   * - Longer duration (0.8s)
   * - Larger transforms
   * - Best for hero sections or key content
   */
  dramatic: {
    duration: 0.8,
    ease: 'easeInOut' as const,
    staggerDelay: 0.15,
    distance: 80, // pixels for slide animations
  },
} as const;

/**
 * Create custom slide animation with preset
 *
 * @param preset - Animation preset name
 * @param direction - Slide direction
 * @returns Custom Variants object
 *
 * @example
 * const customSlide = createSlideVariant('dramatic', 'up');
 * <motion.div variants={customSlide} initial="hidden" animate="visible">
 */
export function createSlideVariant(
  preset: keyof typeof ANIMATION_PRESETS = 'moderate',
  direction: 'up' | 'down' | 'left' | 'right' = 'up'
): Variants {
  const config = ANIMATION_PRESETS[preset];

  // Determine axis and distance
  const isVertical = direction === 'up' || direction === 'down';
  const distance = direction === 'down' || direction === 'right'
    ? config.distance
    : -config.distance;

  // Build variants based on direction
  if (isVertical) {
    return {
      hidden: {
        opacity: 0,
        y: distance,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: config.duration,
          ease: config.ease,
        },
      },
    };
  } else {
    return {
      hidden: {
        opacity: 0,
        x: distance,
      },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          duration: config.duration,
          ease: config.ease,
        },
      },
    };
  }
}

/**
 * Reduced Motion Variants
 * Accessible alternatives that respect prefers-reduced-motion
 * Only animates opacity, removes all transforms
 */
export const reducedMotion = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: REDUCED_MOTION_TRANSITION },
  },
  fadeInOut: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: REDUCED_MOTION_TRANSITION },
    exit: { opacity: 0, transition: REDUCED_MOTION_TRANSITION },
  },
} as const;

/**
 * Utility: Get animation variant with reduced motion support
 * Automatically returns reduced motion variant if user prefers reduced motion
 *
 * @param variant - Standard animation variant
 * @returns Variant (standard or reduced motion)
 *
 * @example
 * const variant = useReducedMotion(slideUpFade);
 * <motion.div variants={variant} initial="hidden" animate="visible">
 */
export function getVariantWithReducedMotion(variant: Variants): Variants {
  if (typeof window === 'undefined') return variant;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return reducedMotion.fadeIn;
  }

  return variant;
}

/**
 * Export all variants as a collection
 */
export const animationVariants = {
  fadeIn,
  slideUpFade,
  scaleInFade,
  slideLeftFade,
  slideRightFade,
  stagger,
  pulse,
} as const;

/**
 * Type exports for TypeScript
 */
export type AnimationPreset = keyof typeof ANIMATION_PRESETS;
export type AnimationVariantName = keyof typeof animationVariants;
export type SlideDirection = 'up' | 'down' | 'left' | 'right';
