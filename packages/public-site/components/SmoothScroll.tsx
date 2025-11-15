'use client';

import { useEffect } from 'react';

/**
 * SmoothScroll Component
 *
 * Provides smooth momentum-based scrolling for mouse wheel events
 * across the entire website. Uses requestAnimationFrame for optimal performance.
 *
 * Based on high-performance vanilla JS solution from Stack Overflow
 * with cross-browser support and Safari compatibility.
 */
export default function SmoothScroll() {
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    class SmoothScrollHandler {
      private target: HTMLElement;
      private speed: number;
      private smooth: number;
      private moving: boolean = false;
      private pos: number = 0;
      private frame: HTMLElement;

      constructor(target: HTMLElement | Document, speed: number, smooth: number) {
        // Handle document target
        if (target === document) {
          this.target = (document.scrollingElement ||
                        document.documentElement ||
                        document.body.parentNode ||
                        document.body) as HTMLElement;
        } else {
          this.target = target as HTMLElement;
        }

        this.speed = speed;
        this.smooth = smooth;
        this.pos = this.target.scrollTop;
        this.frame = this.target === document.body && document.documentElement
                     ? document.documentElement : this.target;

        // Use modern 'wheel' event for all browsers
        this.target.addEventListener('wheel', this.scrolled.bind(this), { passive: false } as EventListenerOptions);
      }

      private scrolled(e: Event) {
        e.preventDefault();
        const wheelEvent = e as WheelEvent;

        // Normalize deltaY across browsers
        // Different browsers report wildly different deltaY values
        let delta = wheelEvent.deltaY;
        const originalDelta = delta;

        if (wheelEvent.deltaMode === 1) {
          // Firefox: deltaMode = 1 (lines) - typically reports ~3 per scroll
          // Multiply by larger value to compensate for small line values
          delta = delta * 120; // 3 lines * 120 = 360px (similar to Chrome's ~100px)
        } else if (wheelEvent.deltaMode === 2) {
          // Safari: deltaMode = 2 (pages) - convert to pixels
          delta = delta * this.frame.clientHeight;
        } else {
          // Chrome/Edge: deltaMode = 0 (pixels)
          // But Edge reports much larger values than Chrome
          // Apply browser-specific adjustment
          const isEdge = /Edg/.test(navigator.userAgent);
          if (isEdge) {
            delta = delta * 0.3; // Reduce Edge's large values
          }
        }

        // Debug logging (remove after testing)
        if (Math.random() < 0.1) { // Log 10% of events to avoid spam
          console.log('Scroll:', {
            browser: /Firefox/.test(navigator.userAgent) ? 'Firefox' : /Edg/.test(navigator.userAgent) ? 'Edge' : 'Chrome',
            deltaMode: wheelEvent.deltaMode,
            originalDelta,
            normalizedDelta: delta,
            finalSpeed: delta * this.speed
          });
        }

        this.pos += delta * this.speed;
        this.pos = Math.max(0, Math.min(this.pos, this.target.scrollHeight - this.frame.clientHeight));
        if (!this.moving) this.update();
      }

      private update() {
        this.moving = true;
        const delta = (this.pos - this.target.scrollTop) / this.smooth;
        this.target.scrollTop += delta;
        if (Math.abs(delta) > 0.5)
          requestAnimationFrame(this.update.bind(this));
        else
          this.moving = false;
      }

      public destroy() {
        this.target.removeEventListener('wheel', this.scrolled.bind(this));
      }
    }

    // Initialize smooth scrolling
    // speed: 1.5 (multiplier for deltaY, higher = faster)
    // smooth: 10 (smoothness factor, higher = smoother but slower to start/stop)
    const smoothScroll = new SmoothScrollHandler(document, 1.5, 10);

    // Cleanup on unmount
    return () => {
      smoothScroll.destroy();
    };
  }, []);

  return null; // No UI rendered
}
