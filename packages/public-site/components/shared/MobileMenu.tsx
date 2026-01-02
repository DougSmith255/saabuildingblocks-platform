'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CTAButton } from '@saa/shared/components/saa';

interface NavItem {
  label: string;
  href?: string;
  dropdown?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Our Team',
    dropdown: [
      { label: 'Team Value', href: '/exp-realty-sponsor/' },
      { label: 'About Us', href: '/our-exp-team/' },
      { label: 'About Karrie Hill', href: '/about-karrie-hill/' },
      { label: 'About Doug Smart', href: '/about-doug-smart/' },
    ],
  },
  { label: 'About eXp', href: '/about-exp-realty/' },
  {
    label: 'Resources',
    dropdown: [
      { label: 'Freebies', href: '/freebies/' },
      { label: 'Commission & Fees Calc', href: '/exp-commission-calculator/' },
      { label: 'RevShare Visualized', href: '/exp-realty-revenue-share-calculator/' },
      { label: 'Compare Brokerages', href: '/best-real-estate-brokerage/' },
      { label: 'Agent Success Hub', href: '/blog/' },
      { label: 'eXp Locations', href: '/locations/' },
      { label: 'eXp Awards', href: '/awards/' },
    ],
  },
  { label: 'Agent Portal', href: '/agent-portal/login/' },
];

interface MobileMenuProps {
  isPortalClicked: boolean;
  handlePortalClick: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

/**
 * Mobile Menu (<1450px)
 * Fullscreen menu overlay with Lenis smooth scrolling (hamburger button in Header)
 */
export default function MobileMenu({ isPortalClicked, handlePortalClick, isMobileMenuOpen, setIsMobileMenuOpen }: MobileMenuProps) {
  const [shouldRenderMenu, setShouldRenderMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [closingDropdown, setClosingDropdown] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const savedScrollY = useRef<number>(0);

  // Scroll lock - simplified without Lenis for better mobile performance
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Save current scroll position
      savedScrollY.current = window.scrollY;

      // Simple scroll lock using overflow hidden + touch-action
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      // Prevent iOS Safari bounce
      document.documentElement.style.overflow = 'hidden';

      return () => {
        // Cleanup handled in the else branch
      };
    } else {
      // Show transition overlay to mask scroll restoration
      setIsTransitioning(true);

      // Restore body styles
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.documentElement.style.overflow = '';

      // Restore scroll position instantly (no animation)
      window.scrollTo({ top: savedScrollY.current, behavior: 'instant' });

      // Fade out the transition overlay after scroll is restored
      requestAnimationFrame(() => {
        setTimeout(() => {
          setIsTransitioning(false);
        }, 100);
      });
    }
  }, [isMobileMenuOpen]);

  // Manage shouldRenderMenu based on isMobileMenuOpen prop
  useEffect(() => {
    if (isMobileMenuOpen) {
      setShouldRenderMenu(true);
      setOpenDropdown(null);
    } else {
      // Delay hiding to allow close animation
      const timer = setTimeout(() => setShouldRenderMenu(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isMobileMenuOpen]);

  const toggleDropdown = (index: number) => {
    const previousDropdown = openDropdown;

    if (previousDropdown === index) {
      // Closing the same dropdown - animate close
      setClosingDropdown(index);
      setOpenDropdown(null);
      // Clear closing state after animation completes
      setTimeout(() => setClosingDropdown(null), 250);
    } else {
      // Opening a different dropdown
      if (previousDropdown !== null) {
        // Close the previous one with animation
        setClosingDropdown(previousDropdown);
        setTimeout(() => setClosingDropdown(null), 250);
      }
      // Open the new one
      setOpenDropdown(index);
    }
  };

  // Note: 404 pages hide the entire header via CSS :has() selector,
  // so this component won't be rendered on 404 pages at all.

  return (
    <>
      {/* Transition overlay - masks scroll restoration when menu closes */}
      {isTransitioning && (
        <div
          className="menu-transition-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9985,
            background: 'rgba(15, 15, 15, 0.95)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            animation: 'menuTransitionFadeOut 200ms ease-out forwards',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />
      )}
      <div
          id="mobile-menu"
          role="dialog"
          aria-label="Mobile navigation menu"
          className={`mobile-menu-overlay fixed top-0 left-0 right-0 bottom-0 z-[9990] overflow-y-auto overflow-x-hidden ${
            isMobileMenuOpen ? 'menu-opening' : 'menu-closing'
          }`}
          style={{
            background: 'rgba(15, 15, 15, 0.98)',
            // Reduced blur for better performance (was 20px)
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            // GPU acceleration with translate3d
            transform: isMobileMenuOpen ? 'translate3d(0, 0, 0)' : 'translate3d(0, -100%, 0)',
            // Prevent flickering on webkit
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            WebkitPerspective: 1000,
            perspective: 1000,
            overscrollBehavior: 'contain',
            pointerEvents: isMobileMenuOpen ? 'auto' : 'none',
            WebkitOverflowScrolling: 'touch',
            display: shouldRenderMenu ? undefined : 'none',
          }}
        >
        <div className="mobile-menu-content pt-24 pb-32 min-h-screen">
          <nav className="px-6 space-y-2" role="navigation" aria-label="Mobile navigation">
            {navItems.map((item, index) => (
              <div key={index}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(index)}
                      className="w-full flex items-center justify-between px-6 py-4 transition-all duration-300 rounded-lg hover:bg-[rgba(42,42,42,0.8)]"
                      style={{
                        fontSize: 'var(--font-size-menuMainItem)',
                        fontFamily: 'var(--font-family-menuMainItem)',
                        fontWeight: 'var(--font-weight-menuMainItem)',
                        letterSpacing: 'var(--letter-spacing-menuMainItem)',
                        lineHeight: 'var(--line-height-menuMainItem)',
                        color: openDropdown === index ? '#ffd700' : '#ffffff',
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
                    <div
                      className={`mobile-dropdown pl-4 ${
                        openDropdown === index ? 'dropdown-open' : closingDropdown === index ? 'dropdown-closing' : 'dropdown-closed'
                      }`}
                    >
                      <div className="dropdown-content">
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
                    </div>
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
              <CTAButton href="/join-exp-sponsor-team/" onClick={() => setIsMobileMenuOpen(false)}>
                GET STARTED
              </CTAButton>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
