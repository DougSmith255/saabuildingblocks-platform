'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './LoadingScreen.module.css';

interface LoadingScreenProps {
  /** Optional loading message */
  message?: string;
  /** Show the loading screen */
  isLoading?: boolean;
  /** Minimum display time in ms (prevents flash) */
  minDisplayTime?: number;
}

export function LoadingScreen({
  message = 'Loading Portal...',
  isLoading = true,
  minDisplayTime = 500
}: LoadingScreenProps) {
  const [shouldShow, setShouldShow] = useState(isLoading);
  const [hasMinTimePassed, setHasMinTimePassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasMinTimePassed(true);
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [minDisplayTime]);

  useEffect(() => {
    if (!isLoading && hasMinTimePassed) {
      setShouldShow(false);
    }
  }, [isLoading, hasMinTimePassed]);

  if (!shouldShow) return null;

  return (
    <div className={styles.loadingScreen}>
      {/* Glass shimmer background */}
      <div className={styles.glassContainer}>
        <div className={styles.glassBase} />
        <div className={styles.shimmerLayer} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* SAA Logo with breathing glow */}
        <div className={styles.logoContainer}>
          <div className={styles.logoGlow} />
          <Image
            src="/images/saa-logo-gold.png"
            alt="SAA Logo"
            width={200}
            height={75}
            className={styles.logo}
            priority
          />
        </div>

        {/* Loading bar */}
        <div className={styles.loadingBarContainer}>
          <div className={styles.loadingBarTrack}>
            <div className={styles.loadingBarFill} />
          </div>
        </div>

        {/* Loading message */}
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
}

export default LoadingScreen;
