'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { H2 } from '@saa/shared/components/saa/headings';
import { Icon3D } from '@saa/shared/components/saa/icons';
import { Users, Laptop, UserPlus, Calendar, Globe, MessageSquare, Share2, Contact, ClipboardCheck, BarChart3, Palette, Zap, DollarSign, Link, ChevronDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const COMMUNITY_BULLETS: { icon: LucideIcon; text: string }[] = [
  { icon: Users, text: 'Live interaction inside eXp World' },
  { icon: Calendar, text: 'Cross-market masterminds and events' },
  { icon: Globe, text: 'Global referral opportunities' },
  { icon: MessageSquare, text: 'Direct access to leadership' },
  { icon: MessageSquare, text: 'Internal communication tools \u2013 eXp Hub' },
  { icon: Share2, text: 'A culture of sharing strategies that are working now' },
];

const TECHNOLOGY_BULLETS: { icon: LucideIcon; text: string; guestPass?: boolean }[] = [
  { icon: Contact, text: 'Choice of CRM: BoldTrail, Lofty, or Cloze' },
  { icon: Globe, text: 'IDX website options, eXp-branded or custom' },
  { icon: Laptop, text: 'eXp World virtual campus', guestPass: true },
  { icon: ClipboardCheck, text: 'Transaction and compliance management' },
  { icon: BarChart3, text: 'Performance tracking and analytics' },
  { icon: Palette, text: 'Canva Pro marketing tools' },
  { icon: Zap, text: 'Automation tools included for capped agents' },
];

const LEADS_BULLETS: { icon: LucideIcon; text: string }[] = [
  { icon: UserPlus, text: 'Revenos — referral-based programs powered by company-run teams' },
  { icon: DollarSign, text: 'Making It Rain — paid lead programs with ready-to-use ad infrastructure' },
  { icon: Link, text: 'My Link My Lead - organic lead tool' },
  { icon: DollarSign, text: 'ExpressOffers — quick cash offers for home sellers' },
  { icon: UserPlus, text: 'Zoocasa — qualified leads with this referral-based program' },
];

export default function WhatExpProvidesVersionB() {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const desktopFlexRef = useRef<HTMLDivElement>(null);
  const providesSectionRef = useRef<HTMLElement>(null);
  const hasAutoSwitched = useRef(false);
  const [desktopContentW, setDesktopContentW] = useState(0);

  const measureDesktop = useCallback(() => {
    if (desktopFlexRef.current) {
      const w = desktopFlexRef.current.offsetWidth;
      setDesktopContentW(Math.floor((w - 32) * 3 / 4.4));
    }
  }, []);

  useEffect(() => {
    measureDesktop();
    const ro = new ResizeObserver(measureDesktop);
    if (desktopFlexRef.current) ro.observe(desktopFlexRef.current);
    return () => ro.disconnect();
  }, [measureDesktop]);

  useEffect(() => {
    const el = providesSectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAutoSwitched.current) {
          hasAutoSwitched.current = true;
          setExpandedIndex(1);
          io.disconnect();
        }
      },
      { threshold: 0.7 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const panels = [
    { id: 'community', label: 'COMMUNITY', icon: Users, bullets: COMMUNITY_BULLETS, color: '#a855f7', rgb: '168,85,247', h2Theme: 'purple' as const },
    { id: 'technology', label: 'TECHNOLOGY', icon: Laptop, bullets: TECHNOLOGY_BULLETS, color: '#00bfff', rgb: '0,191,255', h2Theme: 'blue' as const },
    { id: 'leads', label: 'LEADS', icon: UserPlus, bullets: LEADS_BULLETS, color: '#10b981', rgb: '16,185,129', h2Theme: 'emerald' as const },
  ];

  const desktopContentStyle = desktopContentW > 0
    ? { width: `${desktopContentW}px` }
    : { minWidth: '500px' };

  const grainBg = `
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"),
    linear-gradient(180deg, rgba(18, 18, 18, 0.85) 0%, rgba(12, 12, 12, 0.92) 100%)
  `;
  const inactiveBg = 'linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(12,12,12,0.98) 100%)';

  return (
    <div
      className="relative overflow-visible lg:overflow-hidden rounded-3xl"
      style={{
        boxShadow: `
          0 8px 32px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.25),
          inset 0 1px 0 0 rgba(0,0,0,0.7), inset 0 2px 6px 0 rgba(0,0,0,0.5),
          inset 0 10px 25px -8px rgba(0,0,0,0.6), inset 0 25px 50px -20px rgba(0,0,0,0.45),
          inset 0 -1px 0 0 rgba(255,255,255,0.35), inset 0 -2px 4px 0 rgba(255,255,255,0.2),
          inset 0 -20px 40px -20px rgba(255,255,255,0.15)
        `,
      }}
    >
      {panels.map((p, idx) => (
        <div
          key={p.id}
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, ${
              idx === 0
                ? `rgba(${p.rgb},0.07) 0%, rgba(${p.rgb},0.03) 40%, transparent 70%`
                : idx === 1
                ? `transparent 20%, rgba(${p.rgb},0.06) 40%, rgba(${p.rgb},0.06) 60%, transparent 80%`
                : `transparent 30%, rgba(${p.rgb},0.03) 60%, rgba(${p.rgb},0.07) 100%`
            })`,
            opacity: expandedIndex === idx ? 1 : 0.15,
            transition: 'opacity 0.8s ease',
          }}
        />
      ))}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, transparent 1px, transparent 6px),
            repeating-linear-gradient(-45deg, rgba(255,255,255,0.03) 0px, transparent 1px, transparent 6px)
          `,
          backgroundSize: '16px 16px',
        }}
      />
      <section ref={providesSectionRef} className="relative z-10 py-[50px] px-4 sm:px-8 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          {/* Mobile: stacked panels */}
          <div className="lg:hidden space-y-4">
            {panels.map((panel, i) => {
              const isExpanded = expandedIndex === i;
              return (
                <div key={panel.id} className="relative">
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: isExpanded ? grainBg : inactiveBg,
                      backgroundBlendMode: isExpanded ? 'overlay, normal' : 'normal',
                      border: isExpanded ? `2px solid rgba(${panel.rgb},0.5)` : `1px solid rgba(${panel.rgb},0.2)`,
                      boxShadow: isExpanded
                        ? `0 0 30px rgba(${panel.rgb},0.2), 0 8px 32px rgba(0,0,0,0.4)`
                        : '0 0 0 1px rgba(255,255,255,0.02), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
                      transition: 'border 0.35s ease, box-shadow 0.35s ease',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedIndex(i)}
                      className="w-full flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div style={{ opacity: isExpanded ? 1 : 0.4, transition: 'opacity 0.4s ease' }}>
                          <Icon3D color={panel.color} size={isExpanded ? 44 : 36}>
                            <panel.icon size={isExpanded ? 22 : 18} />
                          </Icon3D>
                        </div>
                        <H2 theme={panel.h2Theme} style={{ marginBottom: 0 }}>
                          {panel.label}
                        </H2>
                      </div>
                      <ChevronDown
                        size={24}
                        style={{
                          color: panel.color,
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                          transition: 'transform 0.3s ease',
                        }}
                      />
                    </button>

                    <div
                      style={{
                        maxHeight: isExpanded ? '500px' : '0px',
                        overflow: 'hidden',
                        transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        willChange: 'max-height',
                      }}
                    >
                      <ul className="pt-4 space-y-3">
                        {panel.bullets.map((bullet, j) => (
                          <li
                            key={bullet.text}
                            className="text-body text-sm flex items-start gap-3"
                            style={{
                              color: 'var(--color-body-text)',
                              opacity: isExpanded ? 1 : 0,
                              transition: `opacity 0.3s ease ${j * 80}ms`,
                            }}
                          >
                            <span
                              className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center mt-0.5"
                              style={{
                                background: `rgba(${panel.rgb},0.15)`,
                                border: `1px solid rgba(${panel.rgb},0.3)`,
                              }}
                            >
                              <bullet.icon size={14} style={{ color: panel.color }} />
                            </span>
                            <span>
                              {bullet.text}
                              {'guestPass' in bullet && bullet.guestPass && (
                                <>
                                  {' - '}
                                  <button
                                    type="button"
                                    onClick={() => window.dispatchEvent(new Event('open-vip-guest-pass'))}
                                    className="cursor-pointer font-bold hover:underline"
                                    style={{ color: '#00bfff' }}
                                  >
                                    Guest Pass
                                  </button>
                                </>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                      {isExpanded && <a href={`/about-exp-realty/${panel.id}`} className="inline-flex items-center gap-1 transition-opacity duration-200 hover:opacity-90" style={{ color: 'var(--color-body-text, #dcdbd5)', textDecoration: 'none', fontSize: '13px', opacity: 0.7, display: 'block', marginTop: '16px' }}>Learn more about {panel.label.toLowerCase()} →</a>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop: horizontal accordion */}
          <div ref={desktopFlexRef} className="hidden lg:flex gap-4 h-[500px]">
            {panels.map((panel, i) => {
              const isExpanded = expandedIndex === i;
              return (
                <div
                  key={panel.id}
                  id={`${panel.id}-desktop`}
                  className="relative overflow-hidden rounded-xl cursor-pointer transition-all"
                  style={{
                    flex: isExpanded ? '3' : '0.7',
                    transitionDuration: '900ms',
                    transitionTimingFunction: 'cubic-bezier(0.3, 0.1, 0.3, 1)',
                    border: isExpanded ? `2px solid rgba(${panel.rgb},0.5)` : '1px solid rgba(255,255,255,0.06)',
                    boxShadow: isExpanded
                      ? `0 0 40px rgba(${panel.rgb},0.25), 0 8px 32px rgba(0,0,0,0.4)`
                      : '0 0 0 1px rgba(255,255,255,0.02), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
                    background: isExpanded ? grainBg : inactiveBg,
                    backgroundBlendMode: isExpanded ? 'overlay, normal' : 'normal',
                    backdropFilter: isExpanded ? 'blur(16px) saturate(120%)' : 'none',
                    WebkitBackdropFilter: isExpanded ? 'blur(16px) saturate(120%)' : 'none',
                  }}
                  onClick={() => setExpandedIndex(i)}
                >
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      right: '-30px',
                      bottom: '-30px',
                      opacity: isExpanded ? 0.08 : 0.03,
                      transition: 'opacity 0.7s ease',
                      color: panel.color,
                    }}
                  >
                    <panel.icon size={200} strokeWidth={1} />
                  </div>

                  <div className="relative z-10 h-full p-6 flex flex-col" style={desktopContentStyle}>
                    <div style={{ position: 'relative', minHeight: '44px', marginBottom: isExpanded ? '34px' : '0' }}>
                      <div style={{ opacity: isExpanded ? 1 : 0, transition: 'opacity 0.7s ease' }}>
                        <Icon3D color={panel.color} size={44}>
                          <panel.icon size={22} />
                        </Icon3D>
                      </div>
                      <div style={{
                        position: 'absolute',
                        left: '56px',
                        top: '8px',
                        transform: isExpanded ? 'rotate(0deg)' : 'rotate(90deg)',
                        transformOrigin: '0 0',
                        transition: 'transform 0.7s ease',
                        whiteSpace: 'nowrap',
                      }}>
                        <H2 theme={panel.h2Theme} style={{ marginBottom: 0, textAlign: 'left' }}>
                          {panel.label}
                        </H2>
                      </div>
                    </div>

                    <ul
                      className="flex-1 space-y-3 overflow-hidden"
                      style={{ opacity: isExpanded ? 1 : 0, transition: 'opacity 0.7s ease 0.2s' }}
                    >
                      {panel.bullets.map((bullet, j) => (
                        <li
                          key={bullet.text}
                          className="text-body text-sm flex items-start gap-3"
                          style={{
                            color: 'var(--color-body-text)',
                            opacity: isExpanded ? 1 : 0,
                            transition: `opacity 0.7s ease ${j * 150}ms`,
                          }}
                        >
                          <span
                            className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center mt-0.5"
                            style={{
                              background: `rgba(${panel.rgb},0.15)`,
                              border: `1px solid rgba(${panel.rgb},0.3)`,
                            }}
                          >
                            <bullet.icon size={14} style={{ color: panel.color }} />
                          </span>
                          <span>
                            {bullet.text}
                            {'guestPass' in bullet && bullet.guestPass && (
                              <>
                                {' - '}
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new Event('open-vip-guest-pass')); }}
                                  className="cursor-pointer font-bold hover:underline"
                                  style={{ color: '#00bfff' }}
                                >
                                  Guest Pass
                                </button>
                              </>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {isExpanded && <a href={`/about-exp-realty/${panel.id}`} onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 transition-opacity duration-200 hover:opacity-90" style={{ color: 'var(--color-body-text, #dcdbd5)', textDecoration: 'none', fontSize: '13px', opacity: 0.7, display: 'block', marginTop: '16px' }}>Learn more about {panel.label.toLowerCase()} →</a>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
