'use client';

import { useEffect, useRef, useState } from 'react';

export default function GlassScrollbar() {
  const [isVisible, setIsVisible] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    let mouseMoveTimeout: NodeJS.Timeout;

    // Show scrollbar and reset hide timer
    const showScrollbar = () => {
      setIsVisible(true);

      // Clear existing timeout
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      // Set new timeout to hide after 2 seconds
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    };

    // Debounced scroll handler
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        showScrollbar();
      }, 10);
    };

    // Mouse position handler
    const handleMouseMove = (e: MouseEvent) => {
      clearTimeout(mouseMoveTimeout);
      mouseMoveTimeout = setTimeout(() => {
        const distanceFromRight = window.innerWidth - e.clientX;

        // Show if within 20px of right edge
        if (distanceFromRight <= 20) {
          showScrollbar();
        }
      }, 10);
    };

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Cleanup — runs only on unmount since deps are empty
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      clearTimeout(scrollTimeout);
      clearTimeout(mouseMoveTimeout);
    };
  }, []);

  useEffect(() => {
    // Inject global styles for scrollbar
    const style = document.createElement('style');
    style.id = 'glass-scrollbar-styles';
    style.textContent = `
      /* Scrollbar track */
      ::-webkit-scrollbar {
        width: 14px;
      }

      /* Scrollbar track background */
      ::-webkit-scrollbar-track {
        background: transparent;
      }

      /* Scrollbar thumb (the draggable part) */
      ::-webkit-scrollbar-thumb {
        background: rgba(128, 128, 128, 0.5);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-radius: 10px;
        border: 1px solid rgba(128, 128, 128, 0.3);
        transition: all 0.3s ease;
        opacity: ${isVisible ? '1' : '0'};
      }

      /* Scrollbar thumb on hover */
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(128, 128, 128, 0.7);
        border-color: rgba(128, 128, 128, 0.5);
      }

      /* Scrollbar thumb when active/dragging */
      ::-webkit-scrollbar-thumb:active {
        background: rgba(128, 128, 128, 0.9);
      }

      /* Firefox scrollbar support */
      * {
        scrollbar-width: thin;
        scrollbar-color: ${isVisible ? 'rgba(128, 128, 128, 0.5) transparent' : 'transparent transparent'};
      }
    `;

    // Remove existing style if present
    const existingStyle = document.getElementById('glass-scrollbar-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, [isVisible]);

  // This component doesn't render any visible elements
  // It only manages the scrollbar styling through global styles
  return null;
}
