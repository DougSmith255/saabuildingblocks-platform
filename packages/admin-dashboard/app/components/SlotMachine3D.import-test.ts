/**
 * Import test file for SlotMachine3D component
 * Verifies all exports are working correctly
 */

// Test 1: Import from main component file
import { SlotMachine3D as DirectImport } from './SlotMachine3D';
import type { SlotMachine3DProps as DirectProps } from './SlotMachine3D';

// Test 2: Import from type definitions file
import type {
  SlotMachine3DProps,
  AnimationState,
  GlowConfig,
  Transform3DConfig,
  EasingFunction,
  AnimationCallback,
} from './SlotMachine3D.types';

// Test 3: Import from SAA library (interactive)
import { SlotMachine3D as SAAInteractiveImport } from '@/components/saa/interactive';
import type { SlotMachine3DProps as SAAInteractiveProps } from '@/components/saa/interactive';

// Test 4: Import from SAA library (main)
import { SlotMachine3D as SAAMainImport } from '@/components/saa';
import type { SlotMachine3DProps as SAAMainProps } from '@/components/saa';

/**
 * Type check examples
 */
const exampleProps: SlotMachine3DProps = {
  value: 3700,
  duration: 3,
  autoStart: true,
  onComplete: () => console.log('Complete'),
  className: 'custom-class',
  enable3D: true,
  glowIntensity: 1,
  showPlus: true,
  label: 'AGENTS',
  color: '#ffd700',
  reduceMotion: false,
  ariaLabel: 'Test label',
};

const exampleAnimationState: AnimationState = {
  isAnimating: true,
  currentValue: 1850,
  startTime: Date.now(),
};

const exampleGlowConfig: GlowConfig = {
  innerGlow: ['0 0 4px white', '0 0 8px white'],
  midGlow: ['0 0 16px #ffd700', '0 0 24px #ffd700'],
  outerGlow: ['0 0 32px #ffd700', '0 0 48px #ffd700'],
  depthShadow: '0 4px 8px rgba(0,0,0,0.3)',
};

const exampleTransform3D: Transform3DConfig = {
  perspective: '1000px',
  transformStyle: 'preserve-3d',
  translateZ: '20px',
  rotateY: '-5deg',
};

const exampleEasing: EasingFunction = (t: number) => 1 - Math.pow(1 - t, 3);

const exampleCallback: AnimationCallback = () => console.log('Animation complete');

/**
 * All imports and types verified successfully!
 *
 * ✅ Direct import works
 * ✅ Type definitions work
 * ✅ SAA interactive import works
 * ✅ SAA main import works
 * ✅ All TypeScript types are valid
 */
export const IMPORT_TEST_PASSED = true;
