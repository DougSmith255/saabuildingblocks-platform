'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Rotating symbols (Claude Code style)
const SYMBOLS = ['·', '✢', '✳', '✶', '✻', '✽'];

// Random loading words (Claude Code style)
const LOADING_WORDS = [
  'Accomplishing',
  'Actualizing',
  'Brewing',
  'Calculating',
  'Cerebrating',
  'Churning',
  'Cogitating',
  'Computing',
  'Concocting',
  'Considering',
  'Contemplating',
  'Crafting',
  'Creating',
  'Crunching',
  'Deciphering',
  'Deliberating',
  'Determining',
  'Effecting',
  'Elucidating',
  'Enchanting',
  'Envisioning',
  'Finagling',
  'Forging',
  'Forming',
  'Generating',
  'Germinating',
  'Hatching',
  'Ideating',
  'Imagining',
  'Incubating',
  'Inferring',
  'Materializing',
  'Musing',
  'Orchestrating',
  'Pondering',
  'Processing',
  'Reasoning',
  'Reflecting',
  'Ruminating',
  'Synthesizing',
  'Thinking',
  'Transmuting',
  'Weaving',
  'Wondering',
];

// CSS for the Claude Code style loader
const LOADING_STYLES = `
.page-loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 200ms ease-out;
}
.page-loader-overlay.visible {
  opacity: 1;
}
.page-loader-content {
  text-align: left;
  font-family: "Courier New", Courier, monospace;
  display: flex;
  align-items: center;
  gap: 8px;
}
.page-loader-symbol {
  color: #ffd700;
  font-size: 24px;
  line-height: 1.5em;
  height: 1.5em;
  text-align: center;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}
.page-loader-word {
  color: #ffd700;
  font-size: 24px;
  line-height: 1.5em;
  height: 1.5em;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}
`;

/**
 * PageTransition - Custom page transition effect with loading indicator
 *
 * Intercepts internal link clicks and applies a fade transition to main content.
 * Header, footer, star background remain static during transition.
 * Shows a loading bar if navigation takes longer than 100ms.
 *
 * How it works:
 * 1. Listens for clicks on internal links (same-origin, not hash-only)
 * 2. On click: prevents default, fades out #main-content
 * 3. After fade-out completes, uses Next.js router for client-side navigation
 * 4. If navigation takes >100ms, shows gold loading bar at top
 * 5. On new page render, content fades in via CSS animation
 *
 * Uses Next.js router.push() instead of window.location.href to maintain
 * client-side navigation. This keeps the star background and other layout
 * elements mounted between page transitions.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const isTransitioning = useRef(false);
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const symbolIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [currentSymbol, setCurrentSymbol] = useState(SYMBOLS[0]);
  const [currentWord, setCurrentWord] = useState(LOADING_WORDS[0]);

  // Inject loading styles once
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const existingStyle = document.getElementById('page-transition-styles');
    if (!existingStyle) {
      const style = document.createElement('style');
      style.id = 'page-transition-styles';
      style.textContent = LOADING_STYLES;
      document.head.appendChild(style);
    }
  }, []);

  // Animate symbol rotation when loading is visible
  useEffect(() => {
    if (showLoading) {
      // Pick a random word when loading starts
      setCurrentWord(LOADING_WORDS[Math.floor(Math.random() * LOADING_WORDS.length)]);

      let symbolIndex = 0;
      symbolIntervalRef.current = setInterval(() => {
        symbolIndex = (symbolIndex + 1) % SYMBOLS.length;
        setCurrentSymbol(SYMBOLS[symbolIndex]);
      }, 150); // Rotate symbol every 150ms
    } else {
      if (symbolIntervalRef.current) {
        clearInterval(symbolIntervalRef.current);
        symbolIntervalRef.current = null;
      }
    }

    return () => {
      if (symbolIntervalRef.current) {
        clearInterval(symbolIntervalRef.current);
      }
    };
  }, [showLoading]);

  // Check if we arrived here via client-side navigation (should animate in)
  // Re-runs whenever pathname changes (i.e., navigation occurred)
  useEffect(() => {
    // Clear loading timer and hide loading bar when navigation completes
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
    setShowLoading(false);

    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const shouldAnimate = sessionStorage.getItem('page-transitioning') === 'true';
    if (shouldAnimate) {
      sessionStorage.removeItem('page-transitioning');
      // Add class to trigger CSS animation
      mainContent.classList.add('page-transitioning');
      // Remove class after animation completes
      setTimeout(() => {
        mainContent.classList.remove('page-transitioning');
      }, 250);
    } else {
      // Ensure opacity is reset (handles browser back/forward navigation)
      mainContent.style.opacity = '1';
      mainContent.style.transition = '';
    }
  }, [pathname]);

  // Handle browser back/forward navigation (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        // Reset opacity immediately for back/forward navigation
        mainContent.style.opacity = '1';
        mainContent.style.transition = '';
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Don't intercept if already transitioning
      if (isTransitioning.current) return;

      // Find the closest anchor element
      const link = (e.target as HTMLElement).closest('a');
      if (!link) return;

      let href = link.getAttribute('href');
      if (!href) return;

      // Convert absolute same-origin URLs to relative paths
      // This ensures router.push() works correctly with static export
      if (href.startsWith(window.location.origin)) {
        href = href.slice(window.location.origin.length) || '/';
      }

      // Skip external links (different origin)
      if (href.startsWith('http://') || href.startsWith('https://')) {
        return;
      }

      // Skip hash-only links and special links
      if (
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        link.hasAttribute('download') ||
        link.target === '_blank'
      ) {
        return;
      }

      // Skip if modifier keys are pressed (user wants new tab/window)
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;

      // Skip if clicking on the same page we're already on
      const currentPath = window.location.pathname;
      const targetPath = href.split('?')[0].split('#')[0]; // Remove query/hash
      if (currentPath === targetPath || currentPath === targetPath + '/' || currentPath + '/' === targetPath) {
        return; // Don't transition, just let normal behavior happen (or do nothing)
      }

      // Get main content element
      const mainContent = document.getElementById('main-content');
      if (!mainContent) return;

      // Prevent default navigation
      e.preventDefault();
      isTransitioning.current = true;

      // Fade out main content
      mainContent.style.transition = 'opacity 150ms ease-out';
      mainContent.style.opacity = '0';

      // Start loading timer - show loading bar if navigation takes >100ms
      loadingTimerRef.current = setTimeout(() => {
        setShowLoading(true);
      }, 100);

      // Navigate after fade completes using Next.js router (keeps layout mounted)
      setTimeout(() => {
        // Set a flag so we know next page should animate in
        sessionStorage.setItem('page-transitioning', 'true');

        router.push(href);

        // Reset transition state
        setTimeout(() => {
          isTransitioning.current = false;
        }, 100);
      }, 150);
    };

    // Add click listener to document
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [router]);

  // Render Claude Code style loader (only visible when showLoading is true)
  return (
    <div className={`page-loader-overlay ${showLoading ? 'visible' : ''}`}>
      <div className="page-loader-content">
        <span className="page-loader-symbol">{currentSymbol}</span>
        <span className="page-loader-word">{currentWord}</span>
      </div>
    </div>
  );
}

export default PageTransition;
