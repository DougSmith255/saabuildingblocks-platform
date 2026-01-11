'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import styles from './LoadingScreen.module.css';
import { preloadAppData, isAuthenticated, PreloadResult } from './PreloadService';

interface PWALoadingScreenProps {
  /** Minimum display time in ms (allows user to see the beautiful loading screen) */
  minDisplayTime?: number;
  /** Maximum display time in ms (failsafe) */
  maxDisplayTime?: number;
  /** Callback when loading is complete */
  onLoadComplete?: (result: PreloadResult) => void;
}

/**
 * PWA Launch Loading Screen
 *
 * Shows the beautiful SAA loading screen with glass shimmer effect
 * while preloading critical app data and assets.
 *
 * - Minimum 3 second display to show off the design
 * - Maximum 8 second display as failsafe
 * - Preloads user data, agent page, and critical images
 */
export function PWALoadingScreen({
  minDisplayTime = 3000,
  maxDisplayTime = 8000,
  onLoadComplete,
}: PWALoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading Portal...');

  const handleLoadComplete = useCallback((result: PreloadResult) => {
    // Start fade out animation
    setIsFadingOut(true);

    // Wait for fade animation, then hide completely
    setTimeout(() => {
      setIsVisible(false);
      onLoadComplete?.(result);
    }, 500); // Match CSS transition duration
  }, [onLoadComplete]);

  useEffect(() => {
    let minTimeElapsed = false;
    let preloadComplete = false;
    let preloadResult: PreloadResult = { success: true, errors: [] };

    // Track minimum time
    const minTimer = setTimeout(() => {
      minTimeElapsed = true;
      if (preloadComplete) {
        handleLoadComplete(preloadResult);
      }
    }, minDisplayTime);

    // Failsafe maximum time
    const maxTimer = setTimeout(() => {
      handleLoadComplete(preloadResult);
    }, maxDisplayTime);

    // Start preloading
    const runPreload = async () => {
      // Update loading message based on auth state
      if (isAuthenticated()) {
        setLoadingMessage('Loading your dashboard...');
      }

      try {
        // Small delay to ensure loading screen is visible
        await new Promise(resolve => setTimeout(resolve, 500));

        setLoadingMessage('Loading assets...');

        // Run preload
        preloadResult = await preloadAppData();

        if (preloadResult.userData) {
          setLoadingMessage(`Welcome back, ${preloadResult.userData.firstName || 'Agent'}...`);
          // Give user time to see the welcome message
          await new Promise(resolve => setTimeout(resolve, 800));
        }

        setLoadingMessage('Almost ready...');

      } catch (err) {
        console.warn('Preload error:', err);
        preloadResult.errors.push('Preload failed');
      }

      preloadComplete = true;

      if (minTimeElapsed) {
        handleLoadComplete(preloadResult);
      }
    };

    runPreload();

    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, [minDisplayTime, maxDisplayTime, handleLoadComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`${styles.loadingScreen} ${isFadingOut ? styles.fadeOut : ''}`}
      style={{
        transition: 'opacity 0.5s ease-out',
        opacity: isFadingOut ? 0 : 1,
      }}
    >
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
        <p className={styles.message}>{loadingMessage}</p>
      </div>
    </div>
  );
}

export default PWALoadingScreen;
