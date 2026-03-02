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

const cardStyleLight = (gold?: boolean) => ({
  background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,245,240,0.98))',
  border: `1px solid ${gold ? 'rgba(180,150,0,0.25)' : 'rgba(0,0,0,0.08)'}`,
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
  const freebieKey = CATEGORY_FREEBIE_MAP[categorySlug] || 'brokerageQuestions';
  const freebie = FREEBIES[freebieKey];
  const getCardStyle = isDarkMode ? cardStyle : cardStyleLight;

  const handleFreebieClick = () => {
    setSelectedFreebie(freebie);
    setShowModal(true);
  };

  return (
    <>
      <aside className="hidden lg:block">
        <div ref={stickyRef} className="sticky space-y-4" style={{ height: 'fit-content', top: `${HEADER_OFFSET}px` }}>

          {/* Widget 1: Calculator CTA (eXp categories only) */}
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
                  color: isDarkMode ? '#e5e4dd' : '#1a1a1a',
                  letterSpacing: '0.02em',
                }}>
                  Commission Calculator
                </h3>
              </div>
              <p className="text-xs mb-4" style={{
                fontFamily: 'var(--font-amulya)',
                color: isDarkMode ? '#888' : '#666',
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

          {/* Widget 2: Contextual Freebie */}
          <div className="p-5" style={getCardStyle(true)}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium px-2 py-0.5 rounded" style={{
                background: isDarkMode ? 'rgba(0,255,136,0.1)' : 'rgba(0,180,80,0.1)',
                color: isDarkMode ? '#00ff88' : '#008844',
                fontFamily: 'var(--font-taskor)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Free
              </span>
            </div>
            <h3 className="text-sm font-semibold mt-2 mb-1" style={{
              fontFamily: 'var(--font-taskor)',
              color: isDarkMode ? '#e5e4dd' : '#1a1a1a',
              letterSpacing: '0.02em',
            }}>
              {freebie.label}
            </h3>
            <p className="text-xs mb-4" style={{
              fontFamily: 'var(--font-amulya)',
              color: isDarkMode ? '#888' : '#666',
              lineHeight: 1.5,
            }}>
              {freebie.description}
            </p>
            <button
              onClick={handleFreebieClick}
              className="block w-full text-center py-2.5 px-4 text-sm font-semibold rounded-lg transition-all duration-200 hover:brightness-110 cursor-pointer"
              style={{
                fontFamily: 'var(--font-taskor)',
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))'
                  : 'linear-gradient(135deg, rgba(0,0,0,0.08), rgba(0,0,0,0.04))',
                color: isDarkMode ? '#e5e4dd' : '#1a1a1a',
                border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              {freebie.type === 'canva' ? 'Get Template' : 'Download Free'}
            </button>
          </div>

          {/* Widget 3: Category Navigation */}
          <div className="p-5" style={getCardStyle()}>
            <style>{`
              .sidebar-cat-link:not(.sidebar-cat-active):hover {
                background: ${isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'};
                color: ${isDarkMode ? '#ccc' : '#333'};
                border-radius: 6px;
              }
            `}</style>
            <h3 className="text-sm font-semibold mb-3" style={{
              fontFamily: 'var(--font-taskor)',
              color: isDarkMode ? '#e5e4dd' : '#1a1a1a',
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
                          color: isActive
                            ? '#ffd700'
                            : isDarkMode ? '#999' : '#555',
                          background: isActive
                            ? isDarkMode ? 'rgba(255,215,0,0.08)' : 'rgba(255,215,0,0.12)'
                            : 'transparent',
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

          {/* Widget 4: Team Promo */}
          <div className="p-5" style={getCardStyle(true)}>
            <div className="mb-3 overflow-hidden" style={{ borderRadius: '8px' }}>
              <img
                src="https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/doug-and-karrie-co-founders/desktop"
                alt="Doug & Karrie - Smart Agent Alliance co-founders"
                width={320}
                height={200}
                loading="lazy"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
            <p className="text-xs mb-4" style={{
              fontFamily: 'var(--font-amulya)',
              color: isDarkMode ? '#999' : '#666',
              lineHeight: 1.6,
            }}>
              Join Doug & Karrie and 4,000+ agents building their business with Smart Agent Alliance at eXp Realty.
            </p>
            <button
              onClick={() => window.dispatchEvent(new Event('open-join-modal'))}
              className="block w-full text-center py-2.5 px-4 text-sm font-semibold rounded-lg transition-all duration-200 hover:brightness-110 cursor-pointer"
              style={{
                fontFamily: 'var(--font-taskor)',
                background: 'linear-gradient(135deg, #ffd700, #ffaa00)',
                color: '#0a0a0a',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Join The Alliance
            </button>
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
