'use client';

import { useEffect, useState } from 'react';
import styles from './StarBackground.module.css';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  layer: number;
}

export default function StarBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
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
      });
    }

    setStars(generatedStars);
  }, []);

  return (
    <div className={styles.starfieldContainer} aria-hidden="true">
      {stars.map((star) => (
        <div
          key={star.id}
          className={styles.star}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`, // Negative delay starts animation mid-cycle
            opacity: Math.random() * 0.4 + 0.4,
            zIndex: star.layer,
          }}
        />
      ))}
    </div>
  );
}
