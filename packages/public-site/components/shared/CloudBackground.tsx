'use client';

import { useEffect, useState } from 'react';
import styles from './CloudBackground.module.css';

interface Cloud {
  id: number;
  x: number;
  y: number;
  scale: number;
  duration: number;
  delay: number;
  layer: number;
  opacity: number;
  variant: number; // Different cloud shapes
}

/**
 * CloudBackground - Light mode daylight sky scene
 *
 * Features:
 * - Blue sky gradient background (lighter at horizon, deeper blue at top)
 * - Animated fluffy white clouds drifting across the screen
 * - Multiple cloud layers for depth/parallax effect
 * - Soft, dreamy atmosphere that complements yellow "sunlight" text
 *
 * Used on blog pages when light mode is active.
 */
export default function CloudBackground() {
  const [clouds, setClouds] = useState<Cloud[]>(() => {
    if (typeof window === 'undefined') return [];

    const cachedClouds = sessionStorage.getItem('cloudBackground');
    if (cachedClouds) {
      try {
        return JSON.parse(cachedClouds);
      } catch {
        // If parsing fails, regenerate below
      }
    }
    return [];
  });

  useEffect(() => {
    if (clouds.length > 0) return;

    // Generate fewer clouds than stars - they're larger elements
    const screenWidth = window.innerWidth;
    const baseCount = screenWidth < 768 ? 8 : 15; // Fewer on mobile
    const layers = 3;
    const generatedClouds: Cloud[] = [];

    for (let i = 0; i < baseCount; i++) {
      const layer = i % layers;

      // Layer speeds: back clouds slower, front clouds faster
      const durations = [120, 80, 50]; // seconds

      // Layer opacity: back clouds more transparent
      const opacities = [0.4, 0.6, 0.85];

      // Layer scales: back clouds smaller
      const scales = [0.5, 0.8, 1.2];

      generatedClouds.push({
        id: i,
        x: -30, // Start off-screen left
        y: 5 + Math.random() * 60, // Spread across top 65% of screen
        scale: scales[layer] * (0.7 + Math.random() * 0.6),
        duration: durations[layer] * (0.8 + Math.random() * 0.4),
        delay: -Math.random() * durations[layer], // Negative = start mid-animation
        layer,
        opacity: opacities[layer] * (0.8 + Math.random() * 0.2),
        variant: Math.floor(Math.random() * 4), // 4 cloud shape variants
      });
    }

    setClouds(generatedClouds);

    try {
      sessionStorage.setItem('cloudBackground', JSON.stringify(generatedClouds));
    } catch {
      // Ignore storage errors
    }
  }, [clouds.length]);

  return (
    <div className={styles.skyContainer} aria-hidden="true">
      {/* Sun glow effect in top-right area */}
      <div className={styles.sunGlow} />

      {/* Clouds */}
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className={`${styles.cloud} ${styles[`cloudVariant${cloud.variant}`]}`}
          style={{
            top: `${cloud.y}%`,
            left: `${cloud.x}%`,
            transform: `scale(${cloud.scale})`,
            animationDuration: `${cloud.duration}s`,
            animationDelay: `${cloud.delay}s`,
            opacity: cloud.opacity,
            zIndex: cloud.layer,
          }}
        />
      ))}
    </div>
  );
}
