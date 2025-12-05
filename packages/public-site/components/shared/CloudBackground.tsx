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
// Version key to invalidate cache when cloud generation changes
const CLOUD_CACHE_VERSION = 'v2';

export default function CloudBackground() {
  const [clouds, setClouds] = useState<Cloud[]>(() => {
    if (typeof window === 'undefined') return [];

    const cacheKey = `cloudBackground_${CLOUD_CACHE_VERSION}`;
    const cachedClouds = sessionStorage.getItem(cacheKey);
    if (cachedClouds) {
      try {
        return JSON.parse(cachedClouds);
      } catch {
        // If parsing fails, regenerate below
      }
    }
    // Clear old cache versions
    sessionStorage.removeItem('cloudBackground');
    return [];
  });

  useEffect(() => {
    if (clouds.length > 0) return;

    // Generate fewer clouds than stars - they're larger elements
    const screenWidth = window.innerWidth;
    const isMobile = screenWidth < 768;
    const baseCount = isMobile ? 6 : 12; // Fewer on mobile for performance
    const layers = 3;
    const generatedClouds: Cloud[] = [];

    for (let i = 0; i < baseCount; i++) {
      const layer = i % layers;

      // Layer speeds: back clouds slower, front clouds faster
      // Mobile gets faster durations for smoother perceived movement
      const desktopDurations = [90, 60, 40]; // seconds
      const mobileDurations = [50, 35, 25]; // faster on mobile
      const durations = isMobile ? mobileDurations : desktopDurations;

      // Layer opacity: back clouds more transparent
      const opacities = [0.5, 0.7, 0.9];

      // Layer scales: back clouds smaller (only used on desktop)
      // Mobile scales handled by CSS media query
      const scales = isMobile ? [1, 1, 1] : [0.6, 0.85, 1.1];

      generatedClouds.push({
        id: i,
        x: 0, // Animation handles positioning via CSS
        y: 8 + Math.random() * 55, // Spread across top 63% of screen
        scale: scales[layer] * (0.8 + Math.random() * 0.4),
        duration: durations[layer] * (0.85 + Math.random() * 0.3),
        delay: -Math.random() * durations[layer], // Negative = start mid-animation
        layer,
        opacity: opacities[layer] * (0.85 + Math.random() * 0.15),
        variant: Math.floor(Math.random() * 4), // 4 cloud shape variants
      });
    }

    setClouds(generatedClouds);

    try {
      const cacheKey = `cloudBackground_${CLOUD_CACHE_VERSION}`;
      sessionStorage.setItem(cacheKey, JSON.stringify(generatedClouds));
    } catch {
      // Ignore storage errors
    }
  }, [clouds.length]);

  return (
    <div className={styles.skyContainer} aria-hidden="true">
      {/* Clouds */}
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className={`${styles.cloud} ${styles[`cloudVariant${cloud.variant}`]}`}
          style={{
            top: `${cloud.y}%`,
            // Left position handled by CSS animation - don't set inline
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
