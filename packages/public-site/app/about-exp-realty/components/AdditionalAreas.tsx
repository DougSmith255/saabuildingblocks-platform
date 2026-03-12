'use client';

import { useState, useEffect, useRef } from 'react';
import { H2 } from '@saa/shared/components/saa/headings';
import { Home, Building2, Gem, Mountain, Trophy, Share2, HeartPulse, Handshake, PenTool, Wrench, GraduationCap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const DIVISIONS: { name: string; Icon: LucideIcon }[] = [
  { name: 'Residential', Icon: Home },
  { name: 'Commercial', Icon: Building2 },
  { name: 'Luxury', Icon: Gem },
  { name: 'Land & Ranch', Icon: Mountain },
  { name: 'Sports & Entertainment', Icon: Trophy },
  { name: 'Referral-only', Icon: Share2 },
];

const SOLUTIONS: { name: string; Icon: LucideIcon }[] = [
  { name: 'Healthcare options for agents and families', Icon: HeartPulse },
  { name: 'Lending, warranty, and renovation partners', Icon: Handshake },
  { name: 'Branded and discounted signage', Icon: PenTool },
  { name: 'Utility and closing services', Icon: Wrench },
  { name: 'Continuing education', Icon: GraduationCap },
];

export default function AdditionalAreasSection() {
  const [activeTab, setActiveTab] = useState<'divisions' | 'solutions'>('divisions');
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="px-4 sm:px-8 md:px-12">
      <div ref={sectionRef} className="max-w-[1400px] mx-auto">
        <div className="text-center mb-6">
          <H2>ADDITIONAL AREAS AGENTS EXPLORE</H2>
          <p className="text-body mt-4 max-w-[600px] mx-auto" style={{ color: 'var(--color-body-text)', opacity: 0.8 }}>
            As agents grow, specialize, or shift focus, these areas often become relevant.
          </p>
        </div>

        {/* Tab pills with sliding indicator */}
        <div className="flex justify-center mb-8">
          <div
            className="relative inline-flex rounded-full p-1"
            style={{
              background: 'rgba(15,18,25,0.9)',
              border: '1px solid rgba(0,191,255,0.15)',
            }}
          >
            <div
              className="absolute top-1 bottom-1 rounded-full"
              style={{
                left: '4px',
                width: 'calc(50% - 4px)',
                transform: activeTab === 'solutions' ? 'translateX(100%)' : 'translateX(0)',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: '#00bfff',
                boxShadow: '0 0 16px rgba(0,191,255,0.4), 0 0 32px rgba(0,191,255,0.15)',
              }}
            />
            {(['divisions', 'solutions'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className="relative z-10 px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wider cursor-pointer transition-colors duration-300"
                style={{
                  color: activeTab === tab ? '#0a1520' : 'rgba(229,228,221,0.6)',
                  background: 'transparent',
                }}
              >
                {tab === 'divisions' ? 'Divisions' : 'Solutions'}
              </button>
            ))}
          </div>
        </div>

        {/* Content area - fixed height to prevent layout shift */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(12,16,24,0.95), rgba(8,10,18,0.98))',
            border: '1px solid rgba(0,191,255,0.12)',
            boxShadow: '0 4px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)',
            minHeight: '420px',
          }}
        >
          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,191,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,191,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
            }}
          />

          {/* Both tabs rendered, positioned absolutely for smooth cross-fade */}
          <div className="relative" style={{ minHeight: '420px' }}>
            {/* Divisions grid view */}
            <div
              className="p-6 sm:p-8"
              style={{
                position: activeTab === 'divisions' ? 'relative' : 'absolute',
                top: 0, left: 0, right: 0,
                opacity: activeTab === 'divisions' ? 1 : 0,
                pointerEvents: activeTab === 'divisions' ? 'auto' : 'none',
                transition: 'opacity 0.4s ease',
              }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {DIVISIONS.map((division, i) => (
                    <div
                      key={division.name}
                      className="aa-tile group relative rounded-xl p-5 flex flex-col items-center text-center gap-3 cursor-default"
                      style={{
                        background: 'rgba(20,24,35,0.8)',
                        border: '1px solid rgba(0,191,255,0.1)',
                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.95)',
                        transitionDelay: visible ? `${i * 80}ms` : '0ms',
                        transitionProperty: 'opacity, transform, border-color, box-shadow',
                        transitionDuration: '0.5s, 0.5s, 0.3s, 0.3s',
                      }}
                    >
                      <div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-400"
                        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(0,191,255,0.06) 0%, transparent 70%)' }}
                      />
                      <div
                        className="relative aa-tile-icon w-14 h-14 rounded-xl flex items-center justify-center"
                        style={{
                          background: 'rgba(0,191,255,0.08)',
                          border: '1px solid rgba(0,191,255,0.2)',
                          transition: 'transform 0.3s ease, border-color 0.3s ease',
                        }}
                      >
                        <division.Icon size={28} style={{ color: '#00bfff' }} />
                      </div>
                      <span
                        className="text-lg font-semibold relative"
                        style={{ color: '#e5e4dd' }}
                      >
                        {division.name}
                      </span>
                    </div>
                ))}
              </div>
              <a
                href="/about-exp-realty/divisions"
                className="inline-flex items-center gap-1 transition-opacity duration-200 hover:opacity-90"
                style={{ color: 'var(--color-body-text, #dcdbd5)', textDecoration: 'none', fontSize: '14px', opacity: 0.85, marginTop: '20px', display: 'block', textAlign: 'center' }}
              >
                Learn more about divisions →
              </a>
            </div>

            {/* Solutions grid view */}
            <div
              className="p-6 sm:p-8"
              style={{
                position: activeTab === 'solutions' ? 'relative' : 'absolute',
                top: 0, left: 0, right: 0,
                opacity: activeTab === 'solutions' ? 1 : 0,
                pointerEvents: activeTab === 'solutions' ? 'auto' : 'none',
                transition: 'opacity 0.4s ease',
              }}
            >
              <div className="aa-solutions-grid gap-4">
                {SOLUTIONS.map((solution, i) => (
                    <div
                      key={solution.name}
                      className="aa-tile group relative rounded-xl p-5 flex flex-col items-center text-center gap-3 cursor-default"
                      style={{
                        background: 'rgba(20,24,35,0.8)',
                        border: '1px solid rgba(0,191,255,0.1)',
                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.95)',
                        transitionDelay: visible ? `${i * 80}ms` : '0ms',
                        transitionProperty: 'opacity, transform, border-color, box-shadow',
                        transitionDuration: '0.5s, 0.5s, 0.3s, 0.3s',
                      }}
                    >
                      <div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-400"
                        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(0,191,255,0.06) 0%, transparent 70%)' }}
                      />
                      <div
                        className="relative aa-tile-icon w-14 h-14 rounded-xl flex items-center justify-center"
                        style={{
                          background: 'rgba(0,191,255,0.08)',
                          border: '1px solid rgba(0,191,255,0.2)',
                          transition: 'transform 0.3s ease, border-color 0.3s ease',
                        }}
                      >
                        <solution.Icon size={28} style={{ color: '#00bfff' }} />
                      </div>
                      <span
                        className="text-lg font-semibold relative"
                        style={{ color: '#e5e4dd' }}
                      >
                        {solution.name}
                      </span>
                    </div>
                ))}
              </div>
              <a
                href="/about-exp-realty/solutions"
                className="inline-flex items-center gap-1 transition-opacity duration-200 hover:opacity-90"
                style={{ color: 'var(--color-body-text, #dcdbd5)', textDecoration: 'none', fontSize: '14px', opacity: 0.85, marginTop: '20px', display: 'block', textAlign: 'center' }}
              >
                Learn more about solutions →
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .aa-tile:hover {
          border-color: rgba(0,191,255,0.3) !important;
          box-shadow: 0 0 20px rgba(0,191,255,0.1), 0 4px 16px rgba(0,0,0,0.2) !important;
          transform: translateY(-2px) scale(1) !important;
        }
        .aa-tile:hover .aa-tile-icon {
          transform: scale(1.08) !important;
        }
        .aa-solutions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
        }
        .aa-solutions-grid > *:last-child:nth-child(odd) {
          grid-column: 1 / -1;
        }
        @media (min-width: 640px) {
          .aa-solutions-grid {
            grid-template-columns: repeat(6, 1fr);
          }
          .aa-solutions-grid > * {
            grid-column: span 2;
          }
          .aa-solutions-grid > *:nth-child(n+4) {
            grid-column: span 3;
          }
          .aa-solutions-grid > *:last-child:nth-child(odd) {
            grid-column: span 3;
          }
        }
      `}</style>
    </section>
  );
}
