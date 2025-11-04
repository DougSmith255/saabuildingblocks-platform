'use client';

import { useState, useEffect } from 'react';
import { useLiveCSS } from '../hooks/useLiveCSS';

interface CSSProviderProps {
  children: React.ReactNode;
}

/**
 * CSS Provider Component
 * Wraps the Master Controller page and ensures CSS is injected on mount
 * and updated on all store changes
 *
 * Features:
 * - Automatic CSS injection on mount
 * - Live updates when any store changes
 * - Loading state while CSS is being generated
 * - Performance metrics tracking
 */
export function CSSProvider({ children }: CSSProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const { getMetrics } = useLiveCSS();

  useEffect(() => {
    // Small delay to ensure CSS injection completes
    const timer = setTimeout(() => {
      setIsReady(true);

      // Log initial metrics
      if (process.env.NODE_ENV === 'development') {
        const metrics = getMetrics();
        console.log('🎨 CSS Provider initialized', metrics);
      }
    }, 200); // Slightly longer than debounce delay (150ms)

    return () => clearTimeout(timer);
  }, [getMetrics]);

  // Show loading state briefly while CSS generates
  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-pulse mb-2">
            <div className="h-2 w-48 bg-gray-200 rounded"></div>
          </div>
          <p className="text-sm text-gray-500">Loading design system...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
