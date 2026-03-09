'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { CategorySlug } from './templates/templateConfig';

const FreebieDownloadModal = dynamic(
  () => import('@saa/shared/components/saa/interactive').then(m => ({ default: m.FreebieDownloadModal })),
  { ssr: false }
);

interface BlogSidebarProps {
  categorySlug: string;
  isDarkMode: boolean;
}

// Freebie data matching the freebies page exactly
const FREEBIES = {
  brokerageQuestions: {
    title: 'Top 10 Brokerage Questions (+ 24 More)',
    fileName: 'Brokerage-Interview-Questions.pdf',
    fileUrl: '/freebies/brokerage-interview-questions.pdf',
    type: 'download' as const,
    label: 'Top 10 Brokerage Questions',
    description: 'The essential questions to ask before choosing your next brokerage.',
  },
  thisOrThat: {
    title: '"This or That" Posts',
    fileName: 'This-or-That-Posts.canva',
    fileUrl: 'https://www.canva.com/design/DAG9-31Bilg/k1JVE9ThGFrunUkHUAkj9A/view?utm_content=DAG9-31Bilg&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview',
    type: 'canva' as const,
    label: '"This or That" Posts',
    description: 'Boost engagement with fun social media posts. Canva template.',
  },
  openHouse: {
    title: 'Open House Sign-in Sheets',
    fileName: 'Open-House-Sign-In-Sheets.canva',
    fileUrl: 'https://www.canva.com/design/DAGiYencGxg/SL6_rJR3hFb9t7G477qPxg/view?utm_content=DAGiYencGxg&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview',
    type: 'canva' as const,
    label: 'Open House Sign-in Sheets',
    description: 'Professional sign-in sheets to impress clients. Canva template.',
  },
  businessCards: {
    title: 'Business Card Templates',
    fileName: 'Business-Card-Templates.canva',
    fileUrl: 'https://www.canva.com/design/DAGsotBSd5w/2AzNUwuAw_7j0c0EuRsD6g/view?utm_content=DAGsotBSd5w&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview',
    type: 'canva' as const,
    label: 'Business Card Templates',
    description: 'Professional Canva business card designs.',
  },
  prospectingScripts: {
    title: 'Prospecting Scripts & Objection Handlers',
    fileName: 'Prospecting-Scripts-Playbook.pdf',
    fileUrl: '/freebies/prospecting-scripts-playbook.pdf',
    type: 'download' as const,
    label: 'Prospecting Scripts Playbook',
    description: '17 proven scripts with 26 objection handlers across 8 categories.',
  },
  ninetyDayPlan: {
    title: 'New Agent First 90 Days',
    fileName: 'New-Agent-90-Day-Plan.pdf',
    fileUrl: '/freebies/new-agent-90-day-plan.pdf',
    type: 'download' as const,
    label: 'New Agent 90-Day Plan',
    description: 'Week-by-week action plan for building a real estate business.',
  },
} as const;

// Map each category to its best-fit freebie
const CATEGORY_FREEBIE_MAP: Record<string, keyof typeof FREEBIES> = {
  'brokerage-comparison': 'brokerageQuestions',
  'about-exp-realty': 'thisOrThat',
  'exp-realty-sponsor': 'brokerageQuestions',
  'marketing-mastery': 'thisOrThat',
  'agent-career-info': 'prospectingScripts',
  'winning-clients': 'prospectingScripts',
  'real-estate-schools': 'ninetyDayPlan',
  'become-an-agent': 'ninetyDayPlan',
  'industry-trends': 'businessCards',
  'fun-for-agents': 'businessCards',
};

// Categories that show the calculator CTA
const CALCULATOR_CATEGORIES = new Set([
  'about-exp-realty',
  'exp-realty-sponsor',
  'brokerage-comparison',
]);

// Categories that show the eXp World Guest Pass card
const GUEST_PASS_CATEGORIES = new Set([
  'about-exp-realty',
  'exp-realty-sponsor',
  'brokerage-comparison',
]);

// All 10 blog categories with emoji icons
const CATEGORIES: { slug: CategorySlug; name: string; icon: string }[] = [
  { slug: 'about-exp-realty', name: 'About eXp Realty', icon: '🏢' },
  { slug: 'exp-realty-sponsor', name: 'eXp Realty Sponsor', icon: '🤝' },
  { slug: 'brokerage-comparison', name: 'Brokerage Comparison', icon: '⚖️' },
  { slug: 'become-an-agent', name: 'Become an Agent', icon: '🎓' },
  { slug: 'agent-career-info', name: 'Agent Career Info', icon: '💼' },
  { slug: 'marketing-mastery', name: 'Marketing Mastery', icon: '📣' },
  { slug: 'winning-clients', name: 'Winning Clients', icon: '🏆' },
  { slug: 'real-estate-schools', name: 'Real Estate Schools', icon: '🏫' },
  { slug: 'industry-trends', name: 'Industry Trends', icon: '📈' },
  { slug: 'fun-for-agents', name: 'Fun for Agents', icon: '🎉' },
];

// Shared card style
const cardStyle = (gold?: boolean) => ({
  background: 'linear-gradient(135deg, rgba(20,20,20,0.95), rgba(12,12,12,0.98))',
  border: `1px solid ${gold ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.06)'}`,
  borderRadius: '12px',
});

// Header height + gap below it (header is 75px on desktop)
const HEADER_OFFSET = 90;
const BOTTOM_PADDING = 24;

export function BlogSidebar({ categorySlug, isDarkMode }: BlogSidebarProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedFreebie, setSelectedFreebie] = useState<typeof FREEBIES[keyof typeof FREEBIES] | null>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const scrollState = useRef({ top: HEADER_OFFSET, lastY: 0 });

  // Direction-aware sticky: adjusts top incrementally by scroll delta,
  // clamped between header offset (top pinned) and bottom pinned.
  // On scroll direction change the sidebar immediately starts scrolling
  // with the page toward the opposite boundary.
  useEffect(() => {
    scrollState.current.lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const el = stickyRef.current;
        if (!el) { ticking = false; return; }

        const scrollY = window.scrollY;
        const delta = scrollY - scrollState.current.lastY;
        const sidebarH = el.offsetHeight;
        const vpH = window.innerHeight;

        if (sidebarH + HEADER_OFFSET + BOTTOM_PADDING <= vpH) {
          // Sidebar fits in viewport - simple pin below header
          scrollState.current.top = HEADER_OFFSET;
        } else {
          const bottomPin = vpH - sidebarH - BOTTOM_PADDING;
          // Move top by scroll delta, clamped between bottom-pin and header
          scrollState.current.top = Math.max(
            bottomPin,
            Math.min(HEADER_OFFSET, scrollState.current.top - delta)
          );
        }

        el.style.top = `${scrollState.current.top}px`;
        scrollState.current.lastY = scrollY;
        ticking = false;
      });
    };

    // Set initial position
    if (stickyRef.current) {
      stickyRef.current.style.top = `${HEADER_OFFSET}px`;
    }

    const onResize = () => {
      scrollState.current.top = HEADER_OFFSET;
      if (stickyRef.current) stickyRef.current.style.top = `${HEADER_OFFSET}px`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const showCalculator = CALCULATOR_CATEGORIES.has(categorySlug);
  const showGuestPass = GUEST_PASS_CATEGORIES.has(categorySlug);
  const freebieKey = CATEGORY_FREEBIE_MAP[categorySlug] || 'brokerageQuestions';
  const freebie = FREEBIES[freebieKey];
  const getCardStyle = cardStyle; // Always use dark style regardless of theme mode

  const handleFreebieClick = () => {
    setSelectedFreebie(freebie);
    setShowModal(true);
  };

  return (
    <>
      <aside className="blog-sidebar hidden lg:block">
        <div ref={stickyRef} className="sticky space-y-4" style={{ height: 'fit-content', top: `${HEADER_OFFSET}px` }}>

          {/* Widget 1: Contextual Freebie */}
          <div className="p-5" style={getCardStyle(true)}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium px-2 py-0.5 rounded" style={{
                background: 'rgba(0,255,136,0.1)',
                color: '#00ff88',
                fontFamily: 'var(--font-taskor)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Free
              </span>
            </div>
            <h3 className="text-sm font-semibold mt-2 mb-1" style={{
              fontFamily: 'var(--font-taskor)',
              color: '#e5e4dd',
              letterSpacing: '0.02em',
            }}>
              {freebie.label}
            </h3>
            <p className="text-xs mb-4" style={{
              fontFamily: 'var(--font-amulya)',
              color: '#888',
              lineHeight: 1.5,
            }}>
              {freebie.description}
            </p>
            <button
              onClick={handleFreebieClick}
              className="block w-full text-center py-2.5 px-4 text-sm font-semibold rounded-lg transition-all duration-200 hover:brightness-110 cursor-pointer"
              style={{
                fontFamily: 'var(--font-taskor)',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                color: '#e5e4dd',
                border: '1px solid rgba(255,255,255,0.1)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              {freebie.type === 'canva' ? 'Get Template' : 'Download Free'}
            </button>
          </div>

          {/* Widget 2: eXp World Guest Pass (eXp categories only) */}
          {showGuestPass && (
            <div className="p-5" style={getCardStyle(true)}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
                  background: 'linear-gradient(135deg, rgba(0,191,255,0.15), rgba(0,191,255,0.05))',
                  border: '1px solid rgba(0,191,255,0.2)',
                }}>
                  <img
                    src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/exp-x-logo-icon/public"
                    alt="eXp"
                    width={20}
                    height={20}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <h3 className="text-sm font-semibold" style={{
                  fontFamily: 'var(--font-taskor)',
                  color: '#e5e4dd',
                  letterSpacing: '0.02em',
                }}>
                  eXp World Guest Pass
                </h3>
              </div>
              <p className="text-xs mb-1" style={{
                fontFamily: 'var(--font-amulya)',
                color: '#bbb',
                lineHeight: 1.5,
              }}>
                Step inside the world&apos;s largest virtual real estate campus.
              </p>
              <p className="text-xs mb-4" style={{
                fontFamily: 'var(--font-amulya)',
                color: '#777',
                lineHeight: 1.5,
              }}>
                84,000+ agents. 29 countries. Live training, on-demand support, and direct access to leadership.
              </p>
              <button
                onClick={() => window.dispatchEvent(new Event('open-vip-guest-pass'))}
                className="block w-full text-center py-2.5 px-4 text-sm font-semibold rounded-lg transition-all duration-200 hover:brightness-110 cursor-pointer"
                style={{
                  fontFamily: 'var(--font-taskor)',
                  background: 'linear-gradient(135deg, #00bfff, #0099cc)',
                  color: '#fff',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  boxShadow: '0 0 15px rgba(0,191,255,0.15)',
                }}
              >
                Get Free Access
              </button>
            </div>
          )}

          {/* Widget 3: Category Navigation */}
          <div className="p-5" style={getCardStyle()}>
            <style>{`
              .sidebar-cat-link:not(.sidebar-cat-active) {
                cursor: pointer;
              }
              .sidebar-cat-link:not(.sidebar-cat-active):hover {
                background: rgba(255,215,0,0.06);
                color: #e5e4dd !important;
              }
            `}</style>
            <h3 className="text-sm font-semibold mb-3" style={{
              fontFamily: 'var(--font-taskor)',
              color: '#e5e4dd',
              letterSpacing: '0.02em',
            }}>
              Explore Topics
            </h3>
            <nav>
              <ul className="space-y-1">
                {CATEGORIES.map((cat) => {
                  const isActive = cat.slug === categorySlug;
                  return (
                    <li key={cat.slug}>
                      <a
                        href={`/blog#category=${cat.slug}`}
                        className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs sidebar-cat-link${isActive ? ' sidebar-cat-active' : ''}`}
                        style={{
                          fontFamily: 'var(--font-amulya)',
                          color: isActive ? '#ffd700' : '#999',
                          background: isActive ? 'rgba(255,215,0,0.08)' : 'transparent',
                          fontWeight: isActive ? 600 : 400,
                          transition: 'background 0.15s ease, color 0.15s ease',
                          borderRadius: '6px',
                        }}
                      >
                        <span className="text-sm leading-none">{cat.icon}</span>
                        <span>{cat.name}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Widget 4: Calculator CTA (eXp categories only) */}
          {showCalculator && (
            <div className="p-5" style={getCardStyle(true)}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
                  background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,215,0,0.05))',
                  border: '1px solid rgba(255,215,0,0.2)',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <line x1="8" y1="6" x2="16" y2="6" />
                    <line x1="8" y1="10" x2="10" y2="10" />
                    <line x1="14" y1="10" x2="16" y2="10" />
                    <line x1="8" y1="14" x2="10" y2="14" />
                    <line x1="14" y1="14" x2="16" y2="14" />
                    <line x1="8" y1="18" x2="10" y2="18" />
                    <line x1="14" y1="18" x2="16" y2="18" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold" style={{
                  fontFamily: 'var(--font-taskor)',
                  color: '#e5e4dd',
                  letterSpacing: '0.02em',
                }}>
                  Commission Calculator
                </h3>
              </div>
              <p className="text-xs mb-4" style={{
                fontFamily: 'var(--font-amulya)',
                color: '#888',
                lineHeight: 1.5,
              }}>
                What would your commission look like at eXp?
              </p>
              <a
                href="/exp-commission-calculator"
                className="block w-full text-center py-2.5 px-4 text-sm font-semibold rounded-lg transition-all duration-200 hover:brightness-110"
                style={{
                  fontFamily: 'var(--font-taskor)',
                  background: 'linear-gradient(135deg, #ffd700, #ffaa00)',
                  color: '#0a0a0a',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Calculate Now
              </a>
            </div>
          )}

          {/* Widget 5: SAA Team Promo */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(20,20,20,0.95), rgba(12,12,12,0.98))',
            border: '1px solid rgba(255,215,0,0.2)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
          }}>
            {/* Founders image with gradient overlay */}
            <div style={{ position: 'relative' }}>
              <img
                src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/doug-and-karrie-co-founders/mobile"
                alt="Doug Smart & Karrie Hill - Smart Agent Alliance co-founders"
                width={320}
                height={200}
                loading="lazy"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  borderBottom: '1px solid rgba(255,215,0,0.15)',
                }}
              />
              {/* Bottom fade into card */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '50%',
                background: 'linear-gradient(to top, rgba(12,12,12,0.98) 0%, rgba(12,12,12,0.6) 40%, transparent 100%)',
                pointerEvents: 'none',
              }} />
              {/* "Zero Cost" badge */}
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,215,0,0.3)',
                borderRadius: '6px',
                padding: '3px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span style={{
                  fontFamily: 'var(--font-taskor)',
                  fontSize: '9px',
                  color: '#ffd700',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}>Zero Cost</span>
              </div>
              {/* Founders label overlaid at bottom */}
              <div style={{
                position: 'absolute',
                bottom: '4px',
                left: '16px',
                right: '16px',
              }}>
                <div style={{
                  fontFamily: 'var(--font-taskor)',
                  fontSize: '11px',
                  color: '#ffd700',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  textShadow: '0 0 12px rgba(255,215,0,0.4)',
                }}>
                  Meet the Founders
                </div>
                <div style={{
                  fontFamily: 'var(--font-amulya)',
                  fontSize: '11px',
                  color: '#ccc',
                  marginTop: '1px',
                }}>
                  Doug Smart & Karrie Hill, JD
                </div>
              </div>
            </div>

            {/* Card body */}
            <div className="px-4 pt-3 pb-4">
              {/* Tagline */}
              <p className="mb-3" style={{
                fontFamily: 'var(--font-amulya)',
                fontSize: '12px',
                color: '#bbb',
                lineHeight: 1.55,
              }}>
                Premium systems and support for eXp agents - built by operators, not figureheads.
              </p>

              {/* Value stack highlights */}
              <div className="mb-3" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}>
                {[
                  'Guided onboarding & 1-on-1 strategy',
                  'Elite training courses (7 included)',
                  'Done-for-you marketing & templates',
                  'Agent attraction infrastructure',
                  'Private referral network',
                  'Weekly live masterminds',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <span className="flex-shrink-0 mt-[5px]" style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#ffd700',
                      boxShadow: '0 0 6px rgba(255,215,0,0.3)',
                    }} />
                    <span style={{
                      fontFamily: 'var(--font-amulya)',
                      fontSize: '11px',
                      color: '#aaa',
                      lineHeight: 1.4,
                    }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* Agent count */}
              <div className="text-center mb-3" style={{
                padding: '6px 0',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                <span style={{
                  fontFamily: 'var(--font-taskor)',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#ffd700',
                  textShadow: '0 0 15px rgba(255,215,0,0.25)',
                }}>4,000+</span>
                <span style={{
                  fontFamily: 'var(--font-amulya)',
                  fontSize: '11px',
                  color: '#777',
                  marginLeft: '6px',
                }}>agents strong</span>
              </div>

              {/* CTA */}
              <button
                onClick={() => window.dispatchEvent(new Event('open-join-modal'))}
                className="block w-full text-center py-2.5 px-4 text-sm font-semibold rounded-lg transition-all duration-200 hover:brightness-110 cursor-pointer"
                style={{
                  fontFamily: 'var(--font-taskor)',
                  background: 'linear-gradient(135deg, #ffd700, #ffaa00)',
                  color: '#0a0a0a',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  boxShadow: '0 0 20px rgba(255,215,0,0.15)',
                }}
              >
                Join The Alliance
              </button>

              {/* Learn more link */}
              <a
                href="/exp-realty-sponsor/"
                className="block text-center mt-2"
                style={{
                  fontFamily: 'var(--font-amulya)',
                  fontSize: '10px',
                  color: '#777',
                  textDecoration: 'none',
                  letterSpacing: '0.02em',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffd700')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#777')}
              >
                See everything included
              </a>
            </div>
          </div>

        </div>
      </aside>

      {/* Freebie Download Modal */}
      <FreebieDownloadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        freebie={selectedFreebie}
      />
    </>
  );
}

export default BlogSidebar;
