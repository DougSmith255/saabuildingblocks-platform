/**
 * Shared Hero Effect Components
 *
 * All effects use continuous sine-wave animation that:
 * 1. Intro: Fast animation over 3 seconds
 * 2. Transition: Gradually slows to idle speed (2 seconds)
 * 3. Idle: Continuous animation that never stops (uses sine waves)
 * 4. Scroll: Speeds up when user scrolls
 */

export { useContinuousAnimation } from './useContinuousAnimation';
// Effects will be added as they are created
