'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CTAButton } from '@saa/shared/components/saa';

interface NavItem {
  label: string;
  href?: string;
  dropdown?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Team Value', href: '/exp-realty-sponsor/' },
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
  {
    label: 'About Us',
    dropdown: [
      { label: 'Our Team', href: '/our-exp-team/' },
      { label: 'About Doug Smart', href: '/about-doug-smart/' },
      { label: 'About Karrie Hill', href: '/about-karrie-hill/' },
    ],
  },
  { label: 'Agent Portal', href: '/agent-portal/login/' },
];

interface DesktopNavProps {
  isPortalClicked: boolean;
  handlePortalClick: () => void;
}

/**
 * Desktop Navigation (≥1600px)
 * Horizontal nav with hover dropdowns + CTA button
 */
export default function DesktopNav({ isPortalClicked, handlePortalClick }: DesktopNavProps) {
  const [hoveredDropdown, setHoveredDropdown] = useState<number | null>(null);
  const pathname = usePathname();
  const isAboutExpPage = pathname?.replace(/\/$/, '') === '/about-exp-realty';

  // Note: 404 pages hide the entire header via CSS :has() selector,
  // so this component won't be rendered on 404 pages at all.

  // Render all navigation items including Resources and Agent Portal
  const navigationItems = navItems;

  return (
    <>
      {/* Desktop Navigation - Centered with absolute positioning */}
      <nav
        className="nav hidden xlg:flex items-center gap-0 flex-nowrap"
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
        }}
      >
        {navigationItems.map((item, index) => (
          <div
            key={index}
            className="nav-item relative"
            onMouseEnter={() => item.dropdown && setHoveredDropdown(index)}
            onMouseLeave={() => item.dropdown && setHoveredDropdown(null)}
          >
            {item.dropdown ? (
              <>
                <button
                  className="nav-link flex items-center px-3 py-3 text-white transition-all duration-300 rounded-md mx-[2px] bg-transparent hover:bg-[rgba(42,42,42,0.8)] hover:text-white whitespace-nowrap"
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
                      borderLeft: `6px solid ${hoveredDropdown === index && isAboutExpPage ? '#00bfff' : '#ffffff'}`,
                      borderTop: '4px solid transparent',
                      borderBottom: '4px solid transparent',
                      transform: hoveredDropdown === index ? 'rotate(90deg) translateZ(0)' : 'rotate(0deg) translateZ(0)',
                      transformOrigin: 'center',
                      filter: hoveredDropdown === index && isAboutExpPage ? 'drop-shadow(0 0 6px rgba(0, 191, 255, 0.8))' : 'none',
                      willChange: 'transform, border-left-color, filter',
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
                className={`nav-link agent-portal flex items-center px-3 py-3 transition-all duration-300 rounded-md mx-[2px] bg-transparent text-white whitespace-nowrap ${isPortalClicked ? 'clicked' : ''}`}
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
                className="nav-link flex items-center px-3 py-3 text-white transition-all duration-300 rounded-md mx-[2px] bg-transparent hover:bg-[rgba(42,42,42,0.8)] hover:text-white whitespace-nowrap"
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

      {/* CTA Button (Desktop) - Right-aligned */}
      <div className="header-btn hidden xlg:flex items-center">
        <CTAButton href="/join-exp-sponsor-team/">
          JOIN THE ALLIANCE
        </CTAButton>
      </div>
    </>
  );
}
