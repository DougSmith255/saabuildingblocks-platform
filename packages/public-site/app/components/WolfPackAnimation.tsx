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

      // Trigger profile image fade with delay to ensure user sees full animation
      const profileImg = document.querySelector('.profile-image');
      if (profileImg) {
        // Use requestAnimationFrame twice to ensure paint has happened
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(() => {
              profileImg.classList.add('animate-in');
            }, 200); // Additional 200ms delay after paint
          });
        });
      }
    };

    // Trigger immediately - no delay
    triggerAnimations();
  }, []);

  return null;
}
