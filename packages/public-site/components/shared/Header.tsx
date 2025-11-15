'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './GlassShimmer.module.css';
import { CTAButton } from '@saa/shared/components/saa';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href?: string;
  dropdown?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About eXp', href: '/about-exp-realty/' },
  {
    label: 'Our Team',
    dropdown: [
      { label: 'Team Value', href: '/exp-realty-sponsor/' },
      { label: 'About Us', href: '/our-exp-team/' },
    ],
  },
  {
    label: 'Resources',
    dropdown: [
      { label: 'Commission & Fees Calc', href: '/agent-tools/exp-commission-and-fees-calculator/' },
      { label: 'RevShare Calc', href: '/agent-tools/exp-realty-revenue-share-calculator/' },
      { label: 'Compare Brokerages', href: '/best-real-estate-brokerage/' },
      { label: 'Agent Success Hub', href: '/real-estate-agent-job/' },
      { label: 'Agent Freebies', href: '/freebies/' },
      { label: 'Become an Agent', href: '/become-real-estate-agent/' },
    ],
  },
  { label: 'Agent Portal', href: '/agent-portal' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [hoveredDropdown, setHoveredDropdown] = useState<number | null>(null);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollAnchor, setScrollAnchor] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [isPortalClicked, setIsPortalClicked] = useState(false);
  const [is404Page, setIs404Page] = useState(false);
  const [isHamburgerFixed, setIsHamburgerFixed] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Initialize shouldAnimate - NEVER animate after first page load
  // Use sessionStorage to track across page navigations
  const [shouldAnimate, setShouldAnimate] = useState(() => {
    if (typeof window !== 'undefined') {
      const hasAnimated = sessionStorage.getItem('headerAnimated');
      return hasAnimated !== 'true'; // Only animate if never animated before
    }
    return true; // Server-side default: assume first visit
  });

  const portalClickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hamburgerUnfixTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track mount state
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Wait for fonts to load before showing header to prevent text flashes
  // Only on first visit - subsequent navigations show header immediately
  useEffect(() => {
    const hasAnimated = sessionStorage.getItem('headerAnimated');

    if (hasAnimated === 'true') {
      // Header already animated in this session, show immediately (no animation)
      setFontsLoaded(true);
      // shouldAnimate already false from useState initialization
    } else {
      // First time in session - wait for fonts, then animate
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          setFontsLoaded(true);
          // Mark as animated so subsequent page navigations skip animation
          sessionStorage.setItem('headerAnimated', 'true');
        });
      } else {
        // Fallback if Font Loading API not supported
        setFontsLoaded(true);
        sessionStorage.setItem('headerAnimated', 'true');
      }
    }
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
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

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
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, scrollAnchor, scrollDirection]);

  // Lock body scroll when mobile menu is open (without position fixed to keep background)
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    const willBeOpen = !isMobileMenuOpen;

    setIsMobileMenuOpen(willBeOpen);
    setOpenDropdown(null);

    // Clear any pending unfix timeout
    if (hamburgerUnfixTimeoutRef.current) {
      clearTimeout(hamburgerUnfixTimeoutRef.current);
      hamburgerUnfixTimeoutRef.current = null;
    }

    if (willBeOpen) {
      // Opening menu: make hamburger fixed immediately
      setIsHamburgerFixed(true);
    } else {
      // Closing menu: unfix after 1.5 second delay
      hamburgerUnfixTimeoutRef.current = setTimeout(() => {
        setIsHamburgerFixed(false);
      }, 1500);
    }
  };

  const toggleDropdown = (index: number) => {
    setOpenDropdown(openDropdown === index ? null : index);
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
      if (hamburgerUnfixTimeoutRef.current) {
        clearTimeout(hamburgerUnfixTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Header */}
      <header
        role="banner"
        className={`fixed top-0 left-0 right-0 z-[10010] ${shouldAnimate ? 'header-slide-in' : ''}`}
        style={{
          background: 'transparent',
          overflow: 'visible',
          opacity: 1, // Always visible - no black flash on refresh
          transform: shouldAnimate ? 'translateY(-100%)' : 'translateY(0)',
          willChange: shouldAnimate ? 'transform' : 'auto',
        }}
      >
        {/* Sliding container for background and content */}
        <div
          className={`${hasMounted ? 'transition-transform duration-500' : ''} ease-in-out ${
            isMobileMenuOpen || isHidden ? '-translate-y-full' : 'translate-y-0'
          }`}
          style={{
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            borderRadius: '0 0 20px 20px',
            borderBottom: '2px solid rgba(60, 60, 60, 0.8)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            willChange: 'transform',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            contain: 'layout style',
          }}
        >
          {/* Enhanced Glassmorphism Background with Prismatic Shimmer Effect */}
          <div className={styles['glassContainer']}>
            <div className={styles['glassBase']} />
            <div className={styles['shimmerLayer']} />
            <div className={styles['refractionLayer']} />
            <div className={styles['textureLayer']} />
            <div className={styles['edgeHighlight']} />
          </div>

          <div
            className="header-container"
            style={{
              width: '100%',
              maxWidth: is404Page ? 'min(400px, 95%)' : '100%',
              margin: is404Page ? '0 auto' : '0',
              padding: '8px 15px',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: is404Page ? 'center' : 'space-between',
              height: 'auto',
              minHeight: 'clamp(60px, 8vh, 90px)',
              transition: 'justify-content 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Logo - Hidden on 404 */}
            {!is404Page && (
            <Link
              href="/"
              className="logo-container"
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

            {/* Desktop Navigation - Hidden on 404 */}
            {!is404Page && (
            <nav className="nav hidden xlg:flex items-center gap-0" role="navigation" aria-label="Main navigation">
            {navItems.map((item, index) => (
              <div
                key={index}
                className="nav-item relative"
                onMouseEnter={() => item.dropdown && setHoveredDropdown(index)}
                onMouseLeave={() => item.dropdown && setHoveredDropdown(null)}
              >
                {item.dropdown ? (
                  <>
                    <button
                      className="nav-link flex items-center px-5 py-3 text-white transition-all duration-300 rounded-md mx-[2px] bg-transparent hover:bg-[rgba(42,42,42,0.8)] hover:text-white"
                      style={{
                        fontSize: 'var(--font-size-menuMainItem)',
                        fontFamily: 'var(--font-family-menuMainItem)',
                        fontWeight: 'var(--font-weight-menuMainItem)',
                        letterSpacing: 'var(--letter-spacing-menuMainItem)',
                        lineHeight: 'var(--line-height-menuMainItem)',
                        color: 'var(--text-color-menuMainItem)',
                        willChange: 'background-color, color',
                      }}
                      aria-expanded={hoveredDropdown === index}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <span
                        className="dropdown-arrow ml-2 inline-block transition-all duration-[400ms] ease-[ease] transform-gpu"
                        style={{
                          width: 0,
                          height: 0,
                          borderLeft: '6px solid #ffffff',
                          borderTop: '4px solid transparent',
                          borderBottom: '4px solid transparent',
                          transform: hoveredDropdown === index ? 'rotate(90deg) translateZ(0)' : 'rotate(0deg) translateZ(0)',
                          transformOrigin: 'center',
                          willChange: 'transform, border-left-color',
                        }}
                      />
                    </button>
                    <div
                      className="dropdown absolute top-full left-0 mt-[7px] min-w-[270px] bg-[rgba(26,26,26,0.8)] rounded-xl p-[11px] transition-all duration-300 z-[1001] overflow-hidden"
                      style={{
                        opacity: hoveredDropdown === index ? 1 : 0,
                        visibility: hoveredDropdown === index ? 'visible' : 'hidden',
                        transform: hoveredDropdown === index ? 'translateY(0) translateZ(0)' : 'translateY(-10px) translateZ(0)',
                        willChange: 'opacity, visibility, transform',
                      }}
                    >
                      {item.dropdown.map((dropdownItem, dropdownIndex) => (
                        <Link
                          key={dropdownIndex}
                          href={dropdownItem.href}
                          className="dropdown-item block px-4 py-3 transition-all duration-300 bg-[rgba(42,42,42,0.8)] rounded-lg my-[5.5px] hover:bg-[rgba(58,58,58,0.8)] hover:text-white"
                          style={{
                            fontSize: 'var(--font-size-menuSubItem)',
                            fontFamily: 'var(--font-family-menuSubItem)',
                            fontWeight: 'var(--font-weight-menuSubItem)',
                            letterSpacing: 'var(--letter-spacing-menuSubItem)',
                            lineHeight: 'var(--line-height-menuSubItem)',
                            color: 'var(--text-color-menuSubItem)',
                            willChange: 'background-color, color',
                          }}
                        >
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : item.label === 'Agent Portal' ? (
                  <Link
                    href={item.href!}
                    onClick={handlePortalClick}
                    className={`nav-link agent-portal flex items-center px-5 py-3 transition-all duration-300 rounded-md mx-[2px] bg-transparent text-white ${isPortalClicked ? 'clicked' : ''}`}
                    style={{
                      fontSize: 'var(--font-size-menuMainItem)',
                      fontFamily: 'var(--font-taskor), Taskor, system-ui, sans-serif',
                      fontWeight: 'var(--font-weight-menuMainItem)',
                      letterSpacing: 'var(--letter-spacing-menuMainItem)',
                      lineHeight: 'var(--line-height-menuMainItem)',
                      color: 'var(--text-color-menuMainItem)',
                      willChange: 'background-color, color',
                    }}
                  >
                    <span className="agent-portal-styled">
                      ag<span className="alt-glyph">e</span>
                      <span className="alt-glyph">n</span>
                      <span>t</span> po<span className="alt-glyph">r</span>
                      <span>t</span>al
                    </span>
                  </Link>
                ) : (
                  <Link
                    href={item.href!}
                    className="nav-link flex items-center px-5 py-3 text-white transition-all duration-300 rounded-md mx-[2px] bg-transparent hover:bg-[rgba(42,42,42,0.8)] hover:text-white"
                    style={{
                      fontSize: 'var(--font-size-menuMainItem)',
                      fontFamily: 'var(--font-family-menuMainItem)',
                      fontWeight: 'var(--font-weight-menuMainItem)',
                      letterSpacing: 'var(--letter-spacing-menuMainItem)',
                      lineHeight: 'var(--line-height-menuMainItem)',
                      color: 'var(--text-color-menuMainItem)',
                    }}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
          )}

          {/* CTA Button (Desktop) - Hidden on 404 */}
          {!is404Page && (
          <div className="header-btn hidden xlg:flex items-center">
            <CTAButton href="/join-exp-sponsor-team/">
              GET STARTED
            </CTAButton>
          </div>
          )}

          {/* Go Home Button - Only on 404 */}
          {is404Page && (
            <CTAButton href="/">
              GO HOME
            </CTAButton>
          )}
          </div>
        </div>

        {/* Mobile Menu Toggle - Absolute when closed, fixed when menu open - Hidden on 404 */}
        {!is404Page && (
        <button
          className={`hamburger xlg:hidden cursor-pointer z-[10030] flex items-center justify-center ${isMobileMenuOpen ? 'menu-open' : ''}`}
          onClick={toggleMobileMenu}
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
      </header>

      {/* Mobile Menu Overlay - Slides down from top */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-label="Mobile navigation menu"
          className="mobile-menu-overlay fixed top-0 left-0 right-0 z-[9990] h-screen overflow-hidden"
          style={{
            background: 'rgba(15, 15, 15, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            willChange: 'transform',
            transform: 'translateZ(0)',
            overscrollBehavior: 'contain',
            animation: 'slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
          }}
        >
          <div
            className="mobile-menu-content h-full overflow-y-auto overflow-x-hidden pt-24 pb-32"
            style={{
              touchAction: 'pan-y',
              WebkitOverflowScrolling: 'touch',
              animation: 'fadeIn 0.3s ease-out 0.1s both',
            }}
          >
              <nav className="px-6 space-y-2" role="navigation" aria-label="Mobile navigation">
                {navItems.map((item, index) => (
                  <div key={index}>
                    {item.dropdown ? (
                      <>
                        <button
                          onClick={() => toggleDropdown(index)}
                          className="w-full flex items-center justify-between px-6 py-4 text-white transition-all duration-300 rounded-lg hover:bg-[rgba(42,42,42,0.8)]"
                          style={{
                            fontSize: 'var(--font-size-menuMainItem)',
                            fontFamily: 'var(--font-family-menuMainItem)',
                            fontWeight: 'var(--font-weight-menuMainItem)',
                            letterSpacing: 'var(--letter-spacing-menuMainItem)',
                            lineHeight: 'var(--line-height-menuMainItem)',
                            color: 'var(--text-color-menuMainItem)',
                          }}
                        >
                          {item.label}
                          <span
                            className="inline-block transition-all duration-[400ms]"
                            style={{
                              width: 0,
                              height: 0,
                              borderLeft: '8px solid #ffffff',
                              borderTop: '5px solid transparent',
                              borderBottom: '5px solid transparent',
                              transform: openDropdown === index ? 'rotate(90deg) translateZ(0)' : 'rotate(0deg) translateZ(0)',
                              borderLeftColor: openDropdown === index ? '#ffe000' : '#ffffff',
                              filter: openDropdown === index ? 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.8))' : 'none',
                            }}
                          />
                        </button>
                        {openDropdown === index && (
                          <div
                            className="mobile-dropdown overflow-hidden pl-4"
                            style={{
                              animation: 'expandHeight 0.3s ease-out forwards',
                            }}
                          >
                              {item.dropdown.map((dropdownItem, dropdownIndex) => (
                                <Link
                                  key={dropdownIndex}
                                  href={dropdownItem.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block px-6 py-3 transition-all duration-300 rounded-lg my-1 hover:bg-[rgba(42,42,42,0.8)]"
                                  style={{
                                    fontSize: 'var(--font-size-menuSubItem)',
                                    fontFamily: 'var(--font-family-menuSubItem)',
                                    fontWeight: 'var(--font-weight-menuSubItem)',
                                    letterSpacing: 'var(--letter-spacing-menuSubItem)',
                                    lineHeight: 'var(--line-height-menuSubItem)',
                                    color: 'var(--color-body-text)',
                                  }}
                                >
                                  {dropdownItem.label}
                                </Link>
                              ))}
                            </div>
                        )}
                      </>
                    ) : item.label === 'Agent Portal' ? (
                      <Link
                        href={item.href!}
                        onClick={() => {
                          handlePortalClick();
                          setIsMobileMenuOpen(false);
                        }}
                        className={`agent-portal-mobile block px-6 py-4 transition-all duration-300 rounded-lg relative text-white ${isPortalClicked ? 'clicked' : ''}`}
                        style={{
                          fontSize: 'var(--font-size-menuMainItem)',
                          fontFamily: 'var(--font-taskor), Taskor, system-ui, sans-serif',
                          fontWeight: 'var(--font-weight-menuMainItem)',
                          letterSpacing: 'var(--letter-spacing-menuMainItem)',
                          lineHeight: 'var(--line-height-menuMainItem)',
                          color: 'var(--text-color-menuMainItem)',
                        }}
                      >
                        <span className="agent-portal-styled">
                          ag<span className="alt-glyph">e</span>
                          <span className="alt-glyph">n</span>
                          <span>t</span> po<span className="alt-glyph">r</span>
                          <span>t</span>al
                        </span>
                      </Link>
                    ) : (
                      <Link
                        href={item.href!}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-6 py-4 text-white transition-all duration-300 rounded-lg hover:bg-[rgba(42,42,42,0.8)]"
                        style={{
                          fontSize: 'var(--font-size-menuMainItem)',
                          fontFamily: 'var(--font-family-menuMainItem)',
                          fontWeight: 'var(--font-weight-menuMainItem)',
                          letterSpacing: 'var(--letter-spacing-menuMainItem)',
                          lineHeight: 'var(--line-height-menuMainItem)',
                          color: 'var(--text-color-menuMainItem)',
                        }}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}

                {/* Mobile CTA Button */}
                <div className="pt-8 pb-4 text-center">
                  <CTAButton href="/join-exp-sponsor-team/">
                    GET STARTED
                  </CTAButton>
                </div>
              </nav>
            </div>
          </div>
      )}

      {/* Custom CSS for animations matching WordPress exactly */}
      <style jsx global>{`
        /* CSS Animations (replacing framer-motion) */

        /* Header slide-in animation - first visit only, 0.8s duration */
        @keyframes headerSlideDown {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .header-slide-in {
          animation: headerSlideDown 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* Mobile menu slide down animation */
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
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

        @keyframes expandHeight {
          from {
            max-height: 0;
            opacity: 0;
          }
          to {
            max-height: 500px;
            opacity: 1;
          }
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

        /* Mobile menu main item hover states (exclude CTAButton) */
        .mobile-menu-overlay nav > div > a:not(.agent-portal-mobile):not([class*="text-button"]):hover,
        .mobile-menu-overlay nav > div > button:not([class*="text-button"]):hover {
          color: #ffe000 !important;
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
          /* Center vertically within header: clamp(60px, 8vh, 90px) + 16px padding (8px top + 8px bottom) */
          /* Total height: clamp(76px, calc(8vh + 16px), 106px) */
          /* Button is 60px tall, so center = (total height - button height) / 2 */
          top: calc((clamp(76px, calc(8vh + 16px), 106px) - 60px) / 2);
          right: 15px;
          width: 60px;
          height: 60px;
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
          height: 3.75em;
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

        @media (max-width: 90.625rem) {
          .header-container {
            min-height: calc(clamp(60px, 8vh, 90px) + 15px) !important;
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
      `}</style>
    </>
  );
}
