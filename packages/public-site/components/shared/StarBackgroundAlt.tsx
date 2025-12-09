'use client';

import { useEffect, useState } from 'react';
import styles from './StarBackgroundAlt.module.css';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  layer: number;
  opacity: number;
}

/**
 * StarBackgroundAlt - Light mode variant of StarBackground
 *
 * Differences from default StarBackground:
 * - Background: Off-white/cream gradient (heading text -> body text colors)
 * - Stars: Brand green (#00ff88) instead of white
 *
 * Used on blog pages when light mode is active.
 */
export default function StarBackgroundAlt() {
  // Initialize stars immediately to prevent flash on page navigation
  // Stars only generate once per session using sessionStorage
  const [stars, setStars] = useState<Star[]>(() => {
    // Server-side: return empty array (will populate on client)
    if (typeof window === 'undefined') return [];

    // Check if we have cached stars from this session (use different key for alt version)
    const cachedStars = sessionStorage.getItem('starBackgroundAlt');
    if (cachedStars) {
      try {
        return JSON.parse(cachedStars);
      } catch {
        // If parsing fails, regenerate below
      }
    }
    return [];
  });

  useEffect(() => {
    // Only generate stars if we don't have them already
    if (stars.length > 0) return;

    // Generate stars on mount - scale with screen size
    const screenArea = window.innerWidth * window.innerHeight;
    const baseArea = 1920 * 1080; // Full HD reference
    const scalingFactor = Math.max(screenArea / baseArea, 0.5); // At least 50% of base count

    const starCount = Math.floor(255 * scalingFactor); // Scale star count based on screen area
    const layers = 3; // 3 parallax layers
    const generatedStars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      const layer = i % layers;

      // Fixed durations for each layer (faster layers = closer stars)
      const durations = [138, 92, 58]; // seconds - consistent speed regardless of screen size

      generatedStars.push({
        id: i,
        x: Math.random() * 100, // Percentage
        y: 100, // Start from bottom (animation will move them up)
        size: Math.random() * (layer * 0.8 + 1) + 0.3,
        duration: durations[layer],
        delay: -Math.random() * durations[layer], // Negative delay = start mid-animation (fills entire screen)
        layer,
        opacity: Math.random() * 0.4 + 0.4, // Random opacity between 0.4 and 0.8
      });
    }

    setStars(generatedStars);

    // Cache stars in sessionStorage so they persist across page navigations
    // This prevents the flash when navigating between pages
    try {
      sessionStorage.setItem('starBackgroundAlt', JSON.stringify(generatedStars));
    } catch {
      // Ignore storage errors (e.g., quota exceeded)
    }
  }, [stars.length]);

  return (
    <div className={styles.starfieldContainerAlt} aria-hidden="true">
      {stars.map((star) => (
        <div
          key={star.id}
          className={styles.starAlt}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`, // Negative delay starts animation mid-cycle
            opacity: star.opacity,
            zIndex: star.layer,
          }}
        />
      ))}
    </div>
  );
}
