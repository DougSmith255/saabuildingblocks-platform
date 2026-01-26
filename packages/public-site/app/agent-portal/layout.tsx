'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

// Global styles to disable tap highlight on ALL elements in agent portal
const globalTapHighlightFix = `
  /* Disable tap highlight completely for agent portal */
  #agent-portal-wrapper,
  #agent-portal-wrapper * {
    -webkit-tap-highlight-color: transparent !important;
    -webkit-touch-callout: none !important;
    tap-highlight-color: transparent !important;
  }
`;

// Dynamic import for PWA loading screen (only loads in standalone mode)
const PWALoadingScreen = dynamic(
  () => import('@/components/pwa/PWALoadingScreen').then(mod => mod.PWALoadingScreen),
  { ssr: false }
);

/**
 * Agent Portal Layout
 * - Shows PWA loading screen on app launch (standalone mode)
 * - Provides transition overlay for login -> dashboard navigation
 */
export default function AgentPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showReveal, setShowReveal] = useState(false);
  const [showPWALoading, setShowPWALoading] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const prevPathRef = useRef(pathname);
  const hasShownPWALoadingRef = useRef(false);

  // Detect PWA standalone mode and show loading screen on first launch
  useEffect(() => {
    // Check if running as installed PWA
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    setIsPWA(isStandalone);

    // Only show loading screen once per session in PWA mode
    // and only on the main portal page (not login, activate, etc.)
    if (isStandalone && !hasShownPWALoadingRef.current && pathname === '/agent-portal') {
      // Check if we've already shown loading this session
      const hasShownThisSession = sessionStorage.getItem('pwa_loading_shown');
      if (!hasShownThisSession) {
        setShowPWALoading(true);
        hasShownPWALoadingRef.current = true;
        sessionStorage.setItem('pwa_loading_shown', 'true');
      }
    }
  }, [pathname]);

  // Detect navigation from login to dashboard
  useEffect(() => {
    const wasLogin = prevPathRef.current === '/agent-portal/login';
    const isDashboard = pathname === '/agent-portal';

    if (wasLogin && isDashboard) {
      // Coming from login page - show reveal animation
      setShowReveal(true);
    }

    prevPathRef.current = pathname;
  }, [pathname]);

  // Handle reveal completion
  const handleRevealComplete = () => {
    setShowReveal(false);
  };

  // Handle PWA loading complete
  const handlePWALoadComplete = () => {
    setShowPWALoading(false);
  };

  // Inject tap highlight fix CSS on mount
  useEffect(() => {
    const styleId = 'agent-portal-tap-highlight-fix';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = globalTapHighlightFix;
      document.head.appendChild(style);
    }
  }, []);

  // Override manifest for agent portal PWA installation
  // This ensures installing from any agent portal page opens to /agent-portal/login
  useEffect(() => {
    const existingManifest = document.querySelector('link[rel="manifest"]');
    if (existingManifest) {
      existingManifest.setAttribute('href', '/manifest-portal.json');
    }

    // Cleanup: restore original manifest when leaving agent portal
    return () => {
      if (existingManifest) {
        existingManifest.setAttribute('href', '/manifest.json');
      }
    };
  }, []);

  return (
    <div id="agent-portal-wrapper">
      {children}
      {showReveal && (
        <RevealOverlay onComplete={handleRevealComplete} />
      )}
      {showPWALoading && (
        <PWALoadingScreen
          minDisplayTime={3500}
          maxDisplayTime={8000}
          onLoadComplete={handlePWALoadComplete}
        />
      )}
    </div>
  );
}

/**
 * Reveal Overlay Component
 * Shows the end of the tunnel animation fading out to reveal the dashboard
 * Starts at the "zoomed in" state and fades out
 */
function RevealOverlay({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const REVEAL_DURATION = 800;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const rawProgress = Math.min(elapsed / REVEAL_DURATION, 1);
      // Ease out cubic for smooth fade
      const eased = 1 - Math.pow(1 - rawProgress, 3);
      setProgress(eased);

      if (rawProgress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    // Small delay to ensure dashboard is rendered
    setTimeout(() => {
      animationRef.current = requestAnimationFrame(animate);
    }, 50);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [onComplete]);

  // Generate matrix rain columns
  const columns = [...Array(20)].map((_, i) => ({
    x: i * 5,
    speed: 0.5 + (i % 4) * 0.3,
    chars: [...Array(22)].map(() => String.fromCharCode(0x30A0 + Math.random() * 96)),
  }));

  // Start at zoomed-in state (end of tunnel) and fade out
  const scale = 3 - progress * 2; // 3 -> 1
  const opacity = 1 - progress; // 1 -> 0
  const brightness = 0.5 + progress * 0.3; // Dim -> slightly brighter as it fades

  // Don't render if fully faded
  if (opacity <= 0) return null;

  return (
    <div
      className="fixed inset-0 z-[10030] pointer-events-none overflow-hidden"
      style={{
        backgroundColor: `rgba(10, 10, 10, ${opacity})`,
      }}
    >
      <div
        className="absolute inset-0"
        lang="en"
        translate="no"
        style={{
          transform: `scale(${scale})`,
          opacity: opacity,
        }}
      >
        {/* Green data columns */}
        {columns.map((col, i) => {
          const colProgress = 0.8 * col.speed * 2; // Fixed position (end of tunnel)
          const yOffset = colProgress * 100;

          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${col.x}%`,
                top: 0,
                width: '3%',
                height: '100%',
                overflow: 'hidden',
                fontFamily: 'monospace',
                fontSize: '14px',
                lineHeight: '1.2',
              }}
            >
              {col.chars.map((char, j) => {
                const charY = ((j * 5 + yOffset) % 105);
                const isHead = j === Math.floor(colProgress * col.chars.length) % col.chars.length;
                const charBrightness = (isHead ? 1 : Math.max(0, 1 - j * 0.06)) * brightness;
                const fadeAtBottom = charY > 70 ? Math.max(0, 1 - (charY - 70) / 30) : 1;

                return (
                  <div
                    key={j}
                    style={{
                      position: 'absolute',
                      top: 0,
                      transform: `translateY(${charY}vh)`,
                      color: isHead
                        ? `rgba(255,255,255,${Math.min(0.95 * fadeAtBottom * brightness, 1)})`
                        : `rgba(100,255,100,${Math.min(charBrightness * 0.7 * fadeAtBottom, 1)})`,
                      textShadow: isHead
                        ? `0 0 25px rgba(100,255,100,${Math.min(0.8 * fadeAtBottom * brightness, 1)})`
                        : `0 0 10px rgba(100,255,100,${Math.min(charBrightness * 0.3 * fadeAtBottom, 1)})`,
                    }}
                  >
                    {char}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Gradient overlay for depth - tight focus like end of tunnel */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 30% 20% at 50% 50%, transparent 0%, rgba(0,0,0,0.8) 100%)',
          }}
        />
      </div>
    </div>
  );
}
