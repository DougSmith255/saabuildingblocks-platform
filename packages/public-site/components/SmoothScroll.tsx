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

        // Bind event listeners with passive: false for Chrome 73+
        this.target.addEventListener('mousewheel', this.scrolled.bind(this), { passive: false } as EventListenerOptions);
        this.target.addEventListener('DOMMouseScroll', this.scrolled.bind(this), { passive: false } as EventListenerOptions);
      }

      private scrolled(e: Event) {
        e.preventDefault();
        const delta = this.normalizeWheelDelta(e as WheelEvent);
        this.pos += -delta * this.speed;
        this.pos = Math.max(0, Math.min(this.pos, this.target.scrollHeight - this.frame.clientHeight));
        if (!this.moving) this.update();
      }

      private normalizeWheelDelta(e: WheelEvent): number {
        // Handle Firefox
        if ((e as any).detail) {
          if (e.deltaY)
            return e.deltaY / (e as any).detail / 40 * ((e as any).detail > 0 ? 1 : -1);
          return -(e as any).detail / 3;
        }
        // Handle Chrome, Safari, IE
        return e.deltaY / 120;
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
        this.target.removeEventListener('mousewheel', this.scrolled.bind(this));
        this.target.removeEventListener('DOMMouseScroll', this.scrolled.bind(this));
      }
    }

    // Initialize smooth scrolling
    // speed: 180 (higher = faster), smooth: 1 (lower = quicker start/stop)
    const smoothScroll = new SmoothScrollHandler(document, 180, 1);

    // Cleanup on unmount
    return () => {
      smoothScroll.destroy();
    };
  }, []);

  return null; // No UI rendered
}
