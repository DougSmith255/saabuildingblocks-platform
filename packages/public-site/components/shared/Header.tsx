'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from './GlassShimmer.module.css';
import { usePathname } from 'next/navigation';
import { CTAButton } from '@saa/shared/components/saa';
import MobileMenu from './MobileMenu';

// Lazy load DesktopNav - only imported on desktop viewports
const DesktopNav = dynamic(() => import('./DesktopNav'), { ssr: false });

// Breakpoint: 1450px (90.625rem) - matches xlg breakpoint
// Desktop nav shows at ≥1450px, mobile menu shows at <1450px
const DESKTOP_BREAKPOINT = 1450;

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shouldLoadMobileMenu, setShouldLoadMobileMenu] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollAnchor, setScrollAnchor] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [isPortalClicked, setIsPortalClicked] = useState(false);
  const [is404Page, setIs404Page] = useState(false);
  // Initialize hasMounted based on whether animation already played
  // This ensures proper transition behavior on client-side navigation
  const [hasMounted, setHasMounted] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (window as any).__headerSlideInPlayed === true;
  });
  const [fontsLoaded, setFontsLoaded] = useState(false);
  // Track viewport for conditional rendering - only render DesktopNav on desktop
  const [isDesktop, setIsDesktop] = useState(false);
  // Track first page load for slide-in animation
  // Use a global flag to ensure animation only plays once per session
  // This persists across client-side navigations even if component remounts
  const [isFirstLoad, setIsFirstLoad] = useState(() => {
    if (typeof window === 'undefined') return true;
    // Check if we've already played the slide-in animation this session
    if ((window as any).__headerSlideInPlayed) {
      return false; // Animation already played, skip it
    }
    return true;
  });
  // Initialize hasSlideIn based on whether animation already played
  // This prevents a flash of hidden header on client-side navigation
  const [hasSlideIn, setHasSlideIn] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (window as any).__headerSlideInPlayed === true;
  });

  // Track pathname for route change detection
  const pathname = usePathname();

  const portalClickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track mount state and trigger slide-in animation on actual page loads only
  useEffect(() => {
    setHasMounted(true);

    // Only trigger slide-in animation on actual page loads (not client-side navigation)
    // isFirstLoad is false when __headerSlideInPlayed is already set
    if (isFirstLoad) {
      // Mark that we're playing the animation - prevents replay on client-side nav
      (window as any).__headerSlideInPlayed = true;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setHasSlideIn(true);
          // After slide-in animation completes (500ms), switch to normal scroll behavior
          setTimeout(() => {
            setIsFirstLoad(false);
          }, 500);
        });
      });
    } else {
      // For client-side navigation, immediately show header without animation
      setHasSlideIn(true);
    }
  }, []);

  // Reset header visibility on route change - ensures header is visible on new pages
  useEffect(() => {
    setIsHidden(false);
    setLastScrollY(0);
    setScrollAnchor(0);
    setScrollDirection(null);
  }, [pathname]);

  // Font loading handled by page-level settling mask
  useEffect(() => {
    setFontsLoaded(true);
  }, []);

  // Track viewport width for conditional rendering of DesktopNav
  // This prevents rendering ~37 DOM nodes on mobile
  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    };

    // Check immediately
    checkViewport();

    // Listen for resize
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Detect 404 page
  useEffect(() => {
    const check404 = () => {
      setIs404Page(document.body.classList.contains('is-404-page'));
    };

    // Check initially
    check404();

    // Set up observer for body class changes
    const observer = new MutationObserver(check404);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Handle scroll for header hide/show (500px down to hide, 250px up to show)
  // Throttled to 100ms to reduce CPU usage (was running every frame at 60fps)
  useEffect(() => {
    let ticking = false;
    let lastKnownScrollY = window.scrollY;

    const updateHeader = () => {
      const currentScrollY = lastKnownScrollY;

      // Always show header at top of page (with small buffer for mobile bounce)
      // This takes priority over all other logic
      if (currentScrollY <= 50) {
        if (isHidden) {
          setIsHidden(false);
        }
        // Reset anchor and direction when at top
        setScrollAnchor(0);
        setScrollDirection(null);
        setLastScrollY(currentScrollY);
        ticking = false;
        return;
      }

      // Detect scroll direction
      const currentDirection = currentScrollY > lastScrollY ? 'down' : 'up';

      // If direction changed, reset anchor point
      if (currentDirection !== scrollDirection) {
        setScrollAnchor(lastScrollY);
        setScrollDirection(currentDirection);
      }

      // Calculate scroll distance from anchor
      const scrollDistance = Math.abs(currentScrollY - scrollAnchor);

      // Apply thresholds: 500px down to hide, 250px up to show
      if (currentDirection === 'down' && scrollDistance >= 500) {
        setIsHidden(true);
      } else if (currentDirection === 'up' && scrollDistance >= 250) {
        setIsHidden(false);
      }

      setLastScrollY(currentScrollY);
      ticking = false;
    };

    const handleScroll = () => {
      lastKnownScrollY = window.scrollY;
      if (!ticking) {
        // Use requestAnimationFrame for smooth throttling
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, scrollAnchor, scrollDirection, isHidden]);


  // Handle hamburger menu click - lazy load mobile menu on first click
  const handleHamburgerClick = () => {
    if (!shouldLoadMobileMenu) {
      setShouldLoadMobileMenu(true);
      // Give it a moment to load before opening
      setTimeout(() => setIsMobileMenuOpen(true), 50);
    } else {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
  };

  // Handle Agent Portal click with 3-second green state
  const handlePortalClick = () => {
    setIsPortalClicked(true);

    if (portalClickTimeoutRef.current) {
      clearTimeout(portalClickTimeoutRef.current);
    }

    portalClickTimeoutRef.current = setTimeout(() => {
      setIsPortalClicked(false);
    }, 3000);
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (portalClickTimeoutRef.current) {
        clearTimeout(portalClickTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Header */}
      <header
        role="banner"
        className="fixed top-0 left-0 right-0 z-[10010]"
        style={{
          background: 'transparent',
          overflow: 'visible',
        }}
      >
        {/* Sliding container for background and content */}
        {/* First load: starts off-screen (-translate-y-full), slides down when hasSlideIn becomes true */}
        {/* Subsequent loads: no slide animation, just normal scroll hide/show behavior */}
        {/* Fades out when mobile menu is open */}
        <div
          className={`header-bg-container ${hasMounted ? 'transition-all duration-300' : ''} ease-in-out`}
          style={{
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            borderRadius: '0 0 20px 20px',
            borderBottom: isMobileMenuOpen ? '2px solid transparent' : '2px solid rgba(60, 60, 60, 0.8)',
            boxShadow: isMobileMenuOpen ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.3)',
            willChange: 'transform',
            contain: 'layout style',
            // First load: start hidden, slide down; After: normal scroll behavior
            transform: isFirstLoad
              ? (hasSlideIn ? 'translateY(0) translateZ(0)' : 'translateY(-100%) translateZ(0)')
              : (isHidden ? 'translateY(-100%) translateZ(0)' : 'translateY(0) translateZ(0)'),
          }}
        >
          {/* Glass Background - 3 layers only - Fades when mobile menu opens */}
          <div
            className={`${styles['glassContainer']} ${hasMounted ? 'transition-opacity duration-300' : ''}`}
            style={{
              opacity: isMobileMenuOpen ? 0 : 1,
            }}
          >
            <div className={styles['glassBase']} />
            <div className={styles['shimmerGradient']} />
          </div>

          <div
            className="header-container"
            style={{
              width: '100%',
              maxWidth: is404Page ? 'min(400px, 95%)' : '100%',
              margin: is404Page ? '0 auto' : '0',
              padding: '8px 32px',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: is404Page ? 'center' : 'space-between',
              height: '85px', // Fixed height for desktop
              transition: 'justify-content 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Logo - Hidden on 404, fades when mobile menu opens */}
            {!is404Page && (
            <Link
              href="/"
              className={`logo-container ${hasMounted ? 'transition-opacity duration-300' : ''}`}
              aria-label="Smart Agent Alliance Home"
              style={{
                width: '126px',
                height: '45px',
                minWidth: '0',
                minHeight: '45px',
                maxWidth: '126px',
                maxHeight: '45px',
                borderRadius: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'visible',
                willChange: 'transform',
                transform: 'translateZ(0)',
                opacity: isMobileMenuOpen ? 0 : 1,
                pointerEvents: isMobileMenuOpen ? 'none' : 'auto',
              }}
            >
              <svg width="126px" height="45px" viewBox="0 0 201.96256 75.736626" version="1.1" style={{width: '100%', height: '100%', objectFit: 'contain'}} className="hover:scale-110 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation">
                <defs>
                  <linearGradient id="headerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#fff3b0', stopOpacity: 1}} />
                    <stop offset="40%" style={{stopColor: '#ffd700', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#e6ac00', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                <g transform="translate(-5.5133704,-105.97189)">
                  <path fill="url(#headerLogoGradient)" d="M 21.472273,180.56058 C 11.316147,178.12213 1.9355119,166.45773 6.8673475,154.38101 c 0.2284985,-0.55952 1.4152886,-0.30887 8.5218335,-0.25364 6.089186,0.0474 11.528887,-0.54887 11.563021,0.35268 0.12172,3.21493 1.548705,4.66069 2.560443,5.07358 1.092535,0.44586 18.027365,0.14064 18.956531,-0.51505 2.086142,-1.47214 2.326164,-6.74 -0.732868,-6.70809 -1.893125,0.0197 -16.677992,0.18141 -18.724365,-0.11743 -4.043916,-0.59058 -5.591737,-1.59981 -9.49172,-4.13883 -8.077325,-5.25858 -10.5671578,-12.68416 -8.96983,-21.28238 0,0 6.234294,-0.12184 10.651176,-0.37024 4.312501,-0.24253 8.14686,-0.34782 8.671149,0.65635 1.028138,1.96921 2.764824,2.67171 3.10468,3.73011 0.296847,0.92448 1.558671,0.84083 5.661272,0.85056 4.303079,0.01 9.549862,0.24636 14.627167,0.65835 6.271917,0.50893 12.606804,1.04447 18.1587,14.09205 1.256383,2.95263 -0.05146,7.82433 2.707298,0.89052 0.906748,-2.27902 1.363355,-2.02044 15.012644,-2.13873 7.507113,-0.065 13.649301,-0.23577 13.649301,-0.37936 0,-0.1436 -0.28095,-0.89482 -0.62433,-1.66938 -0.34338,-0.77455 -1.02601,-2.31327 -1.51695,-3.41938 -0.49094,-1.10612 -2.062126,-4.92722 -3.491523,-8.49135 -1.429397,-3.56413 -2.857843,-7.08356 -3.174329,-7.82097 -0.316495,-0.7374 -1.226445,-2.94962 -2.022113,-4.91605 -0.795667,-1.96641 -4.043105,-11.29798 -3.693629,-11.88325 0.458064,-0.76712 -0.18677,-0.40385 12.337194,-0.40385 9.84423,0 9.65274,0.24739 9.65274,0.24739 1.2078,1.06083 2.78957,6.78964 3.34621,8.01751 0.55721,1.22913 1.27686,2.83788 1.59864,3.57529 0.60465,1.38564 1.79312,3.9863 4.28898,9.38518 0.79543,1.72061 2.34948,5.13949 3.45345,7.59751 2.67446,5.95472 3.04484,6.75259 5.91254,12.73702 2.46283,5.1395 2.46283,5.1395 3.20091,3.24636 2.23698,-5.73776 1.98186,-5.7611 4.28454,-5.95219 1.54958,-0.1286 24.51316,0.54777 24.82611,0.0215 0,0 -3.59658,-6.2074 -5.83995,-10.49576 -8.26158,-15.79266 -13.92752,-27.26401 -13.81355,-28.2205 0.0424,-0.35537 5.59171,-0.19826 13.73661,-0.17244 11.92585,0.0378 11.19138,0.12582 11.45775,0.44068 0.7756,0.9168 5.56816,10.25269 6.3956,11.61578 0.82745,1.36309 2.32581,3.98669 3.32968,5.83019 1.00389,1.84351 2.17996,3.95518 2.61353,4.69258 0.43356,0.7374 1.35628,2.34629 2.0505,3.5753 0.6942,1.22901 3.48408,6.15623 6.19971,10.94936 2.71564,4.79315 6.57201,11.63091 8.5697,15.19503 1.99772,3.56414 3.98079,6.98302 4.40686,7.59753 1.75557,2.53202 7.19727,12.85738 7.19727,13.65646 0,1.35047 -1.83096,1.53856 -14.97656,1.53856 -15.12194,0 -11.00005,0.41867 -13.10487,-0.35263 -2.71179,-0.99372 -7.4667,-12.35312 -8.24465,-13.49738 -0.5144,-0.75665 -20.11115,-0.50211 -20.85813,0.10747 -0.30114,0.24573 -4.74222,12.87268 -5.21806,13.18149 -0.51253,0.33263 1.56565,0.31373 -13.12083,0.46948 -14.37638,0.15246 -12.92516,-0.20864 -13.7378,-0.46876 -1.39249,-0.44578 -3.05836,-6.3221 -3.28223,-6.8137 -0.2239,-0.4916 -1.69614,-6.08358 -2.6942,-7.30424 -0.46821,-0.57263 -22.000524,-0.10018 -22.427167,0.30027 -0.495999,0.46555 -2.403531,4.97746 -3.536292,7.45088 -3.647579,7.96455 -0.798091,6.48322 -14.189162,6.21687 -7.764148,-0.15444 -10.944164,0.0682 -12.663388,-0.49314 -2.370345,-0.7739 -1.493164,-2.84033 -1.713395,-2.39718 -2.970363,5.97706 -32.338174,3.84174 -36.236923,2.90565 z m 12.24087,-53.49377 c -0.644922,-0.55276 -1.868417,-1.61286 -2.718877,-2.35578 C 28.5887,122.6096 17.54033,106.32825 20.700077,106.24689 c 18.520277,-0.47684 31.530155,-0.22018 43.622587,-0.0695 12.878883,18.49983 14.110357,21.6067 12.221476,21.31699 -20.587891,-5.5e-4 -41.658407,0.57749 -42.830997,-0.42752 z" />
                </g>
              </svg>
            </Link>
            )}

            {/* Desktop Navigation - Only render on desktop viewports (≥1450px) - Hidden on 404 */}
            {/* This prevents ~37 DOM nodes from being rendered on mobile */}
            {!is404Page && isDesktop && (
              <DesktopNav isPortalClicked={isPortalClicked} handlePortalClick={handlePortalClick} is404Page={is404Page} />
            )}

          {/* Go Home Button - Only on 404 */}
          {is404Page && (
            <CTAButton href="/">
              GO HOME
            </CTAButton>
          )}

            {/* Hamburger Menu Button - Inside header container so it animates with header */}
            {!is404Page && (
              <button
                className={`hamburger xlg:hidden cursor-pointer z-[10030] flex items-center justify-center ${isMobileMenuOpen ? 'menu-open' : ''}`}
                onClick={handleHamburgerClick}
                style={{ marginTop: '3px' }}
                aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <svg viewBox="0 0 32 32" className="hamburger-svg" aria-hidden="true" focusable="false">
                  <path
                    className="line line-top-bottom"
                    d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
                    stroke="none"
                    fill="none"
                  />
                  <path
                    className="line"
                    d="M7 16 27 16"
                    stroke="none"
                    fill="none"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Component - Only loaded when hamburger is clicked */}
      {!is404Page && shouldLoadMobileMenu && (
        <MobileMenu
          isPortalClicked={isPortalClicked}
          handlePortalClick={handlePortalClick}
          is404Page={is404Page}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      )}

      {/* Custom CSS for animations matching WordPress exactly */}
      <style jsx global>{`
        /* Mobile menu slide animations - GPU accelerated with translate3d */
        @keyframes slideDown {
          from {
            transform: translate3d(0, -100%, 0);
          }
          to {
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes slideUp {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(0, -100%, 0);
          }
        }

        .menu-opening {
          animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .menu-closing {
          animation: slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* Menu transition overlay - fades out to mask scroll restoration */
        @keyframes menuTransitionFadeOut {
          from {
            opacity: 1;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
          }
          to {
            opacity: 0;
            backdrop-filter: blur(0px);
            -webkit-backdrop-filter: blur(0px);
          }
        }

        /* Dark mode scrollbar for mobile menu */
        .mobile-menu-overlay {
          scrollbar-width: thin; /* Firefox */
          scrollbar-color: #3a3a3a #1a1a1a; /* Firefox: thumb track */
        }

        .mobile-menu-overlay::-webkit-scrollbar {
          width: 12px; /* Chrome, Safari, Edge */
        }

        .mobile-menu-overlay::-webkit-scrollbar-track {
          background: #1a1a1a;
        }

        .mobile-menu-overlay::-webkit-scrollbar-thumb {
          background: #3a3a3a;
          border-radius: 6px;
        }

        .mobile-menu-overlay::-webkit-scrollbar-thumb:hover {
          background: #4a4a4a;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Mobile dropdown animations - CSS Grid for smooth height transitions */
        /* This animates actual height, pushing content below smoothly */
        .mobile-dropdown {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
        }

        .mobile-dropdown > * {
          overflow: hidden;
        }

        .dropdown-open {
          grid-template-rows: 1fr;
          opacity: 1;
        }

        .dropdown-closing {
          grid-template-rows: 0fr;
          opacity: 0;
        }

        .dropdown-closed {
          grid-template-rows: 0fr;
          opacity: 0;
        }

        /* Header Navigation Links - Override global green link color */
        header .nav-link,
        header .nav-link a {
          color: var(--text-color-menuMainItem, #e5e4dd) !important;
        }

        /* Keep hover states white */
        header .nav-link:hover {
          color: #ffffff !important;
        }

        header .dropdown-item:hover {
          color: #ffffff !important;
        }

        /* Dropdown buttons should use Synonym, not Taskor from critical.css */
        header .nav-link button,
        header button.nav-link:not(.agent-portal) {
          font-family: var(--font-synonym) !important;
        }

        /* Mobile Menu Main Item Colors - Override global green (exclude CTAButton and dropdown items) */
        .mobile-menu-overlay nav > div > a:not(.agent-portal-mobile):not([class*="text-button"]),
        .mobile-menu-overlay nav > div > button:not([class*="text-button"]) {
          color: #ffffff !important;
          font-family: var(--font-synonym) !important;
        }

        /* Mobile menu main item hover states (exclude CTAButton and Agent Portal) */
        /* No yellow hover for regular nav items - keep white */
        .mobile-menu-overlay nav > div > a:not(.agent-portal-mobile):not([class*="text-button"]):hover,
        .mobile-menu-overlay nav > div > button:not([class*="text-button"]):hover {
          color: #ffffff !important;
        }

        /* Mobile menu dropdown/sub-items should use body text color */
        .mobile-menu-overlay nav a[class*="block px-6 py-3"] {
          color: var(--color-body-text) !important;
        }

        /* Sweeping holographic light animation - THE signature effect */
        @keyframes saa-cyber-holographic {
          0% {
            background-position: 0% 0%;
            filter: brightness(1) contrast(1);
          }
          25% {
            background-position: 100% 50%;
            filter: brightness(1.4) contrast(1.2);
          }
          50% {
            background-position: 200% 100%;
            filter: brightness(2.2) contrast(1.4);
          }
          75% {
            background-position: 300% 50%;
            filter: brightness(1.4) contrast(1.2);
          }
          100% {
            background-position: 400% 0%;
            filter: brightness(1) contrast(1);
          }
        }

        .animate-saa-cyber-holographic {
          animation: saa-cyber-holographic 12s linear infinite;
        }

        /* Alt glyph styling for Agent Portal */
        .alt-glyph {
          font-feature-settings: 'ss01' on;
          font-variant-alternates: stylistic(alt);
        }

        /* Dropdown arrow - ensure transition is defined on base element */
        .dropdown-arrow {
          transition: transform 0.4s ease, border-left-color 0.4s ease, filter 0.4s ease !important;
        }

        /* Dropdown arrow hover animation */
        .nav-item:hover .dropdown-arrow {
          transform: rotate(90deg) translateZ(0) !important;
          border-left-color: #ffe000 !important;
          filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.8)) !important;
        }

        /* Agent Portal - Default: White */
        .agent-portal-styled,
        .agent-portal-styled span,
        .agent-portal-styled .alt-glyph {
          color: #ffffff;
          transition: all 0.3s ease;
          text-shadow: none;
        }

        /* Hover - Primary yellow/gold with glow */
        .agent-portal:hover .agent-portal-styled,
        .agent-portal:hover .agent-portal-styled span,
        .agent-portal:hover .agent-portal-styled .alt-glyph {
          color: #ffd700;
          text-shadow:
            0 0 15px rgba(255, 215, 0, 0.6),
            0 0 30px rgba(255, 215, 0, 0.4),
            0 0 45px rgba(255, 215, 0, 0.2);
        }

        /* Clicked - Secondary green with glow (persists for 3 seconds) */
        .agent-portal.clicked .agent-portal-styled,
        .agent-portal.clicked .agent-portal-styled span,
        .agent-portal.clicked .agent-portal-styled .alt-glyph {
          color: #00ff88 !important;
          text-shadow:
            0 0 15px rgba(0, 255, 136, 0.6),
            0 0 30px rgba(0, 255, 136, 0.4),
            0 0 45px rgba(0, 255, 136, 0.2) !important;
        }

        /* Gray background hover */
        .agent-portal:hover {
          background-color: rgba(42, 42, 42, 0.8) !important;
        }

        /* Mobile version - same styling */
        .agent-portal-mobile .agent-portal-styled,
        .agent-portal-mobile .agent-portal-styled span,
        .agent-portal-mobile .agent-portal-styled .alt-glyph {
          color: #ffffff;
          transition: all 0.3s ease;
          text-shadow: none;
        }

        .agent-portal-mobile:hover .agent-portal-styled,
        .agent-portal-mobile:hover .agent-portal-styled span,
        .agent-portal-mobile:hover .agent-portal-styled .alt-glyph {
          color: #ffd700;
          text-shadow:
            0 0 15px rgba(255, 215, 0, 0.6),
            0 0 30px rgba(255, 215, 0, 0.4),
            0 0 45px rgba(255, 215, 0, 0.2);
        }

        .agent-portal-mobile.clicked .agent-portal-styled,
        .agent-portal-mobile.clicked .agent-portal-styled span,
        .agent-portal-mobile.clicked .agent-portal-styled .alt-glyph {
          color: #00ff88 !important;
          text-shadow:
            0 0 15px rgba(0, 255, 136, 0.6),
            0 0 30px rgba(0, 255, 136, 0.4),
            0 0 45px rgba(0, 255, 136, 0.2) !important;
        }

        .agent-portal-mobile:hover {
          background-color: rgba(42, 42, 42, 0.8) !important;
        }

        /* Hamburger Menu Animation */
        .hamburger {
          cursor: pointer;
          font-family: var(--font-taskor), Taskor, system-ui, sans-serif !important;
          color: inherit !important;
          background-color: transparent !important;
          /* Fixed positioning so it stays in place when header slides up */
          position: fixed;
          /* Center vertically within 80px mobile header height */
          /* Button is 65px tall, so center = (80px - 65px) / 2 = 7.5px */
          top: 7.5px;
          right: 15px;
          width: 65px;
          height: 65px;
          will-change: transform;
        }

        /* Prevent color change on hover */
        .hamburger:hover {
          color: inherit !important;
          background-color: transparent !important;
        }

        /* Mobile: consistent positioning (fixed by using 100% instead of 100vw above) */
        @media (max-width: 550px) {
          .hamburger {
            right: 15px;
          }
        }

        .hamburger-svg {
          width: 65px;
          height: 65px;
          transition: transform 600ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .line {
          fill: none;
          stroke: #ffd700;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 3;
          transition: stroke-dasharray 600ms cubic-bezier(0.4, 0, 0.2, 1),
                      stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Force gold stroke at all times - prevent black flash */
        .hamburger .line,
        .hamburger.menu-open .line,
        .hamburger-svg .line {
          stroke: #ffd700 !important;
        }

        .line-top-bottom {
          stroke-dasharray: 12 63;
        }

        /* Animate to X when menu is open */
        .hamburger.menu-open .hamburger-svg {
          transform: rotate(-45deg);
        }

        .hamburger.menu-open .line-top-bottom {
          stroke-dasharray: 20 300;
          stroke-dashoffset: -32.42;
        }

        /* Responsive adjustments */
        @media (max-width: 75rem) {
          .logo-container {
            width: 110px !important;
            height: 39px !important;
          }
        }

        @media (max-width: 50rem) {
          .logo-container {
            width: 95px !important;
            height: 34px !important;
          }
        }

        /* Mobile header height - fixed 80px below 1450px breakpoint */
        @media (max-width: 90.625rem) {
          .header-container {
            height: 80px !important;
          }
        }

        @media (max-width: 550px) {
          .header-container {
            padding-left: 15px !important;
            padding-right: 15px !important;
          }
          .header-container .header-btn,
          .header-container .cta-button {
            display: none !important;
          }
        }

        /* Ensure header container maintains flexbox on desktop */
        @media (min-width: 90.625rem) {
          .header-container {
            padding-left: 32px !important;
            padding-right: 32px !important;
          }
        }
      `}</style>
    </>
  );
}
