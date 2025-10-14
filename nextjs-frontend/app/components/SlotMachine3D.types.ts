/**
 * Type definitions for SlotMachine3D component
 * @module SlotMachine3D.types
 */

/**
 * SlotMachine3D Component Props
 */
export interface SlotMachine3DProps {
  /** Target value to animate to */
  value: number;
  /** Animation duration in seconds (default: 3) */
  duration?: number;
  /** Start animation automatically (default: true) */
  autoStart?: boolean;
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Custom className for container */
  className?: string;
  /** Enable 3D effects (default: true) */
  enable3D?: boolean;
  /** Glow intensity (0-1, default: 1) */
  glowIntensity?: number;
  /** Show '+' symbol (default: true) */
  showPlus?: boolean;
  /** Label text (default: 'AGENTS') */
  label?: string;
  /** Custom color (default: #ffd700) */
  color?: string;
  /** Disable animations for reduced motion (auto-detected) */
  reduceMotion?: boolean;
  /** Aria label for accessibility */
  ariaLabel?: string;
}

/**
 * Animation state
 */
export interface AnimationState {
  isAnimating: boolean;
  currentValue: number;
  startTime: number | null;
}

/**
 * Glow effect configuration
 */
export interface GlowConfig {
  innerGlow: string[];
  midGlow: string[];
  outerGlow: string[];
  depthShadow: string;
}

/**
 * 3D transform configuration
 */
export interface Transform3DConfig {
  perspective: string;
  transformStyle: 'preserve-3d' | 'flat';
  translateZ?: string;
  rotateY?: string;
  rotateX?: string;
}

/**
 * Easing function type
 */
export type EasingFunction = (t: number) => number;

/**
 * Animation callback type
 */
export type AnimationCallback = () => void;
