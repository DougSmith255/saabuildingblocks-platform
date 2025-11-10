'use client';

import { useEffect } from 'react';

/**
 * Client component to trigger hero animations after page is ready
 * Prevents animations from starting during page load (before visible)
 */
export function WolfPackAnimation() {
  useEffect(() => {
    // Wait for page to be fully ready and visible
    const triggerAnimations = () => {
      // Trigger wolf pack background fade
      const wolfPack = document.querySelector('.hero-animate-bg');
      if (wolfPack) {
        wolfPack.classList.add('animate-in');
      }

      // Trigger profile image fade
      const profileImg = document.querySelector('.profile-image');
      if (profileImg) {
        profileImg.classList.add('animate-in');
      }
    };

    // Trigger after a tiny delay to ensure page is painted
    requestAnimationFrame(() => {
      setTimeout(triggerAnimations, 50);
    });
  }, []);

  return null;
}
