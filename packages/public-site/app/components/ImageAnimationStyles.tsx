'use client';

/**
 * Image Animation Styles - Client Component
 * Contains @keyframes for image fade-in animation
 */
export function ImageAnimationStyles() {
  return (
    <style jsx global>{`
      @keyframes imgFadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `}</style>
  );
}
