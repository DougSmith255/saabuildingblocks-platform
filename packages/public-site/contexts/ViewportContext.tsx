'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Counter breakpoint: 500px (counter in corner on desktop, in tagline on mobile)
const COUNTER_BREAKPOINT = 500;

interface ViewportContextType {
  /** True when viewport >= 500px (show corner counter) */
  isCounterDesktop: boolean;
  /** True after client-side hydration */
  hasMounted: boolean;
}

const ViewportContext = createContext<ViewportContextType>({
  isCounterDesktop: true, // Default to desktop (prevents flash on desktop)
  hasMounted: false,
});

export function ViewportProvider({ children }: { children: ReactNode }) {
  // Default to true (desktop) - prevents flash for majority of users
  const [isCounterDesktop, setIsCounterDesktop] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsCounterDesktop(window.innerWidth >= COUNTER_BREAKPOINT);
    };

    // Check immediately on mount
    checkViewport();
    setHasMounted(true);

    // Listen for resize
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  return (
    <ViewportContext.Provider value={{ isCounterDesktop, hasMounted }}>
      {children}
    </ViewportContext.Provider>
  );
}

export function useViewport() {
  return useContext(ViewportContext);
}
