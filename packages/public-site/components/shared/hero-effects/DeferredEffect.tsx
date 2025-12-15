'use client';

import { useState, useEffect, ReactNode } from 'react';

interface DeferredEffectProps {
  children: ReactNode;
  delay?: number; // No longer used - renders immediately
}

/**
 * DeferredEffect - Now renders immediately (no delay)
 *
 * Previously deferred rendering to improve page speed scores,
 * but this caused visible pop-in. Now renders immediately.
 */
export function DeferredEffect({ children }: DeferredEffectProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Render immediately on mount
    setShouldRender(true);
  }, []);

  if (!shouldRender) {
    return null;
  }

  return <>{children}</>;
}
