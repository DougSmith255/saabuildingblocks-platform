/**
 * Shared IntersectionObserver Hook
 *
 * Creates a single shared IntersectionObserver for all blog cards,
 * instead of each card creating its own observer instance.
 *
 * Performance benefit:
 * - 20 cards = 1 observer (instead of 20 observers)
 * - Reduced memory usage
 * - Better scroll performance
 */

import { useEffect, useState, useRef } from 'react';

// Singleton observer instance shared across all hook consumers
let sharedObserver: IntersectionObserver | null = null;
const callbacks = new Map<Element, (isVisible: boolean) => void>();

function getSharedObserver(): IntersectionObserver {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const callback = callbacks.get(entry.target);
          if (callback && entry.isIntersecting) {
            callback(true);
            // Unobserve after triggering - element stays visible
            sharedObserver?.unobserve(entry.target);
            callbacks.delete(entry.target);
          }
        });
      },
      {
        rootMargin: '200px', // Start loading 200px before entering viewport
        threshold: 0,
      }
    );
  }
  return sharedObserver;
}

/**
 * Hook to track if an element is visible in viewport using shared observer
 *
 * @returns [ref, isVisible] - Attach ref to element, isVisible becomes true when visible
 */
export function useSharedVisibility<T extends HTMLElement>(): [
  React.RefObject<T | null>,
  boolean
] {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || isVisible) return;

    const observer = getSharedObserver();

    callbacks.set(element, setIsVisible);
    observer.observe(element);

    return () => {
      observer.unobserve(element);
      callbacks.delete(element);
    };
  }, [isVisible]);

  return [elementRef, isVisible];
}

export default useSharedVisibility;
