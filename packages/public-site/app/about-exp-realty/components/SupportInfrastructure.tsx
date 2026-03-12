'use client';

import { useEffect, useRef, useState } from 'react';
import { H2 } from '@saa/shared/components/saa/headings';
import { Sparkles, GraduationCap, Handshake, Building2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useScrambleCounter } from './hooks';

/* ═══ SVG Illustrations per module ═══ */

function RobotAssistant() {
  return (
    <svg viewBox="0 0 200 160" fill="none" className="si-module-svg">
      {/* Robot head */}
      <rect x="50" y="20" width="80" height="65" rx="16" fill="rgba(0,191,255,0.12)" stroke="rgba(0,191,255,0.6)" strokeWidth="2" />
      {/* Antenna */}
      <line x1="90" y1="20" x2="90" y2="6" stroke="rgba(0,191,255,0.5)" strokeWidth="2" />
      <circle cx="90" cy="4" r="4" fill="rgba(0,191,255,0.4)" stroke="rgba(0,191,255,0.7)" strokeWidth="1.5" className="si-led" />
      {/* Eyes */}
      <circle cx="72" cy="46" r="8" fill="rgba(0,191,255,0.3)" stroke="rgba(0,191,255,0.65)" strokeWidth="1.5" />
      <circle cx="72" cy="44" r="3.5" fill="#00bfff" />
      <circle cx="108" cy="46" r="8" fill="rgba(0,191,255,0.3)" stroke="rgba(0,191,255,0.65)" strokeWidth="1.5" />
      <circle cx="108" cy="44" r="3.5" fill="#00bfff" />
      {/* Mouth - friendly smile */}
      <path d="M75 66 Q 90 76 105 66" stroke="rgba(0,191,255,0.55)" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Ear panels */}
      <rect x="36" y="38" width="14" height="24" rx="4" fill="rgba(0,191,255,0.1)" stroke="rgba(0,191,255,0.4)" strokeWidth="1" />
      <rect x="130" y="38" width="14" height="24" rx="4" fill="rgba(0,191,255,0.1)" stroke="rgba(0,191,255,0.4)" strokeWidth="1" />
      {/* Chat bubble coming from robot */}
      <rect x="105" y="95" width="70" height="32" rx="8" fill="rgba(0,191,255,0.1)" stroke="rgba(0,191,255,0.4)" strokeWidth="1" />
      <path d="M115 95 L110 88 L123 95" fill="rgba(0,191,255,0.1)" stroke="rgba(0,191,255,0.4)" strokeWidth="1" />
      <line x1="115" y1="108" x2="165" y2="108" stroke="rgba(0,191,255,0.3)" strokeWidth="1.5" />
      <line x1="115" y1="118" x2="155" y2="118" stroke="rgba(0,191,255,0.2)" strokeWidth="1.5" />
      {/* Label */}
      <text x="100" y="150" textAnchor="middle" fill="rgba(0,191,255,0.6)" fontSize="13">AI-powered Mira</text>
    </svg>
  );
}

function OnboardingPipeline() {
  return (
    <svg viewBox="0 0 220 160" fill="none" className="si-module-svg">
      {/* Step boxes - larger with clear labels */}
      {[
        { x: 8, label: '1', sub: 'Welcome', fill: 0.15 },
        { x: 60, label: '2', sub: 'Setup', fill: 0.2 },
        { x: 112, label: '3', sub: 'Training', fill: 0.25 },
        { x: 164, label: '4', sub: 'Launch', fill: 0.35 },
      ].map((step, i) => (
        <g key={step.label}>
          <rect x={step.x} y="30" width="40" height="40" rx="8" fill={`rgba(0,191,255,${step.fill})`} stroke="rgba(0,191,255,0.6)" strokeWidth="1.5" />
          <text x={step.x + 20} y="56" textAnchor="middle" fill="#00bfff" fontSize="14" fontWeight="bold">{step.label}</text>
          <text x={step.x + 20} y="90" textAnchor="middle" fill="rgba(0,191,255,0.65)" fontSize="13">{step.sub}</text>
          {i < 3 && (
            <>
              <line x1={step.x + 42} y1="50" x2={step.x + 56} y2="50" stroke="rgba(0,191,255,0.5)" strokeWidth="1.5" />
              <path d={`M${step.x + 52} 46 L${step.x + 58} 50 L${step.x + 52} 54`} stroke="rgba(0,191,255,0.5)" strokeWidth="1" fill="none" />
            </>
          )}
        </g>
      ))}
      {/* Checkmark on step 4 */}
      <circle cx="184" cy="120" r="10" fill="rgba(0,255,136,0.2)" stroke="rgba(0,255,136,0.6)" strokeWidth="1" />
      <path d="M178 120 L182 124 L190 116" stroke="#00ff88" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Progress bar */}
      <rect x="8" y="115" width="155" height="7" rx="3.5" fill="rgba(0,191,255,0.1)" />
      <rect x="8" y="115" width="116" height="7" rx="3.5" fill="rgba(0,191,255,0.35)" />
      {/* Bottom label */}
      <text x="110" y="150" textAnchor="middle" fill="rgba(0,191,255,0.6)" fontSize="13">Fast-track onboarding</text>
    </svg>
  );
}

function MentorConnection() {
  return (
    <svg viewBox="0 0 200 160" fill="none" className="si-module-svg">
      {/* Mentor figure */}
      <circle cx="50" cy="45" r="16" fill="rgba(0,191,255,0.15)" stroke="rgba(0,191,255,0.55)" strokeWidth="1.5" />
      <circle cx="50" cy="40" r="7" fill="rgba(0,191,255,0.25)" stroke="rgba(0,191,255,0.5)" strokeWidth="1" />
      <path d="M35 58 L50 50 L65 58 L65 76 L35 76 Z" fill="rgba(0,191,255,0.12)" stroke="rgba(0,191,255,0.45)" strokeWidth="1" />
      <text x="50" y="96" textAnchor="middle" fill="rgba(0,191,255,0.8)" fontSize="13" fontWeight="600">Mentor</text>
      {/* Agent figure */}
      <circle cx="150" cy="45" r="16" fill="rgba(0,191,255,0.15)" stroke="rgba(0,191,255,0.55)" strokeWidth="1.5" />
      <circle cx="150" cy="40" r="7" fill="rgba(0,191,255,0.25)" stroke="rgba(0,191,255,0.5)" strokeWidth="1" />
      <path d="M135 58 L150 50 L165 58 L165 76 L135 76 Z" fill="rgba(0,191,255,0.12)" stroke="rgba(0,191,255,0.45)" strokeWidth="1" />
      <text x="150" y="96" textAnchor="middle" fill="rgba(0,191,255,0.8)" fontSize="13" fontWeight="600">Agent</text>
      {/* Connection arc with knowledge flow */}
      <path d="M72 38 Q 100 5 128 38" stroke="rgba(0,191,255,0.6)" strokeWidth="2" fill="none" />
      <path d="M72 34 L72 42 L78 38" stroke="rgba(0,191,255,0.6)" strokeWidth="1.5" fill="none" />
      <path d="M128 34 L128 42 L122 38" stroke="rgba(0,191,255,0.6)" strokeWidth="1.5" fill="none" />
      {/* Knowledge dots flowing */}
      <circle cx="85" cy="18" r="3" fill="rgba(0,191,255,0.5)" />
      <circle cx="100" cy="10" r="4" fill="#00bfff" style={{ filter: 'drop-shadow(0 0 4px rgba(0,191,255,0.5))' }} />
      <circle cx="115" cy="18" r="3" fill="rgba(0,191,255,0.5)" />
      {/* Support badge */}
      <rect x="30" y="115" width="140" height="28" rx="8" fill="rgba(0,191,255,0.08)" stroke="rgba(0,191,255,0.35)" strokeWidth="1" />
      <text x="100" y="134" textAnchor="middle" fill="rgba(0,191,255,0.7)" fontSize="13" fontWeight="500">First Deals Support</text>
    </svg>
  );
}

function OfficeLounge() {
  return (
    <svg viewBox="0 0 220 180" fill="none" className="si-module-svg">
      {/* Floor */}
      <rect x="5" y="130" width="210" height="30" rx="4" fill="rgba(0,191,255,0.04)" stroke="rgba(0,191,255,0.12)" strokeWidth="0.8" />
      {/* Large window with blinds */}
      <rect x="55" y="8" width="110" height="55" rx="4" fill="rgba(0,191,255,0.03)" stroke="rgba(0,191,255,0.25)" strokeWidth="1.5" />
      {[16, 24, 32, 40, 48, 56].map(y => (
        <line key={y} x1="58" y1={y} x2="162" y2={y} stroke="rgba(0,191,255,0.1)" strokeWidth="0.8" />
      ))}
      {/* Window cross frame */}
      <line x1="110" y1="8" x2="110" y2="63" stroke="rgba(0,191,255,0.2)" strokeWidth="1" />
      {/* Desk - large, prominent */}
      <rect x="45" y="90" width="130" height="8" rx="2" fill="rgba(0,191,255,0.2)" stroke="rgba(0,191,255,0.5)" strokeWidth="1.5" />
      <line x1="60" y1="98" x2="60" y2="130" stroke="rgba(0,191,255,0.35)" strokeWidth="2" />
      <line x1="160" y1="98" x2="160" y2="130" stroke="rgba(0,191,255,0.35)" strokeWidth="2" />
      {/* Monitor on desk */}
      <rect x="85" y="68" width="50" height="22" rx="3" fill="rgba(0,191,255,0.08)" stroke="rgba(0,191,255,0.5)" strokeWidth="1.5" />
      <rect x="88" y="71" width="44" height="16" rx="2" fill="rgba(0,191,255,0.2)" />
      <rect x="105" y="90" width="10" height="3" rx="1" fill="rgba(0,191,255,0.3)" />
      {/* Keyboard */}
      <rect x="92" y="83" width="36" height="6" rx="1.5" fill="rgba(0,191,255,0.1)" stroke="rgba(0,191,255,0.3)" strokeWidth="0.8" />
      {/* Office chair (front view) */}
      <path d="M90 108 Q 85 105 85 112 L85 128 Q 85 130 90 130 L130 130 Q 135 130 135 128 L135 112 Q 135 105 130 108 Z" fill="rgba(0,191,255,0.08)" stroke="rgba(0,191,255,0.35)" strokeWidth="1" />
      <rect x="95" y="116" width="30" height="4" rx="1.5" fill="rgba(0,191,255,0.12)" />
      {/* Chair backrest */}
      <rect x="92" y="100" width="36" height="10" rx="3" fill="rgba(0,191,255,0.06)" stroke="rgba(0,191,255,0.3)" strokeWidth="0.8" />
      {/* Coffee cup on desk */}
      <rect x="140" y="82" width="10" height="10" rx="2" fill="rgba(0,191,255,0.15)" stroke="rgba(0,191,255,0.4)" strokeWidth="0.8" />
      <path d="M150 84 Q 155 84 155 89 Q 155 92 150 92" stroke="rgba(0,191,255,0.3)" strokeWidth="0.8" fill="none" />
      <path d="M143 79 Q 145 74 147 79" stroke="rgba(0,191,255,0.25)" strokeWidth="0.8" fill="none" />
      {/* Plant (tall, left side) */}
      <rect x="14" y="90" width="14" height="40" rx="3" fill="rgba(0,191,255,0.08)" stroke="rgba(0,191,255,0.3)" strokeWidth="0.8" />
      <circle cx="21" cy="78" r="14" fill="rgba(0,255,136,0.12)" stroke="rgba(0,255,136,0.35)" strokeWidth="1" />
      <circle cx="14" cy="72" r="9" fill="rgba(0,255,136,0.1)" stroke="rgba(0,255,136,0.3)" strokeWidth="0.8" />
      <circle cx="28" cy="74" r="8" fill="rgba(0,255,136,0.08)" stroke="rgba(0,255,136,0.25)" strokeWidth="0.6" />
      {/* Side table (right) */}
      <rect x="185" y="105" width="24" height="4" rx="1" fill="rgba(0,191,255,0.15)" stroke="rgba(0,191,255,0.3)" strokeWidth="0.8" />
      <line x1="190" y1="109" x2="190" y2="130" stroke="rgba(0,191,255,0.25)" strokeWidth="1.2" />
      <line x1="204" y1="109" x2="204" y2="130" stroke="rgba(0,191,255,0.25)" strokeWidth="1.2" />
      {/* Stack of papers on side table */}
      <rect x="188" y="98" width="18" height="7" rx="1" fill="rgba(0,191,255,0.08)" stroke="rgba(0,191,255,0.2)" strokeWidth="0.6" />
      {/* Regus label inside floor */}
      <text x="110" y="149" textAnchor="middle" fill="rgba(0,191,255,0.7)" fontSize="13" fontWeight="500">Regus Business Lounges</text>
    </svg>
  );
}

/* ═══ Data ═══ */

const STATS = [
  { targetNumber: 2000, suffix: '+', label: 'Staff', status: 'ACTIVE' },
  { targetNumber: 24, suffix: '/7', label: 'Help Desk', status: 'ONLINE' },
  { targetNumber: 50, suffix: '+', label: 'Trainings', status: 'WEEKLY' },
];

const MODULES: {
  icon: LucideIcon;
  title: string;
  text: string;
  Illustration: () => React.JSX.Element;
  gridArea: string;
  gridAreaMobile: string;
}[] = [
  {
    icon: Sparkles,
    title: 'AI Support',
    text: 'AI-assisted support through Mira for instant answers',
    Illustration: RobotAssistant,
    gridArea: '1 / 1 / 2 / 2',
    gridAreaMobile: 'auto',
  },
  {
    icon: GraduationCap,
    title: 'Onboarding',
    text: 'Live onboarding that gets agents operational quickly',
    Illustration: OnboardingPipeline,
    gridArea: '1 / 2 / 2 / 4',
    gridAreaMobile: 'auto',
  },
  {
    icon: Handshake,
    title: 'Mentor Program',
    text: 'Structured mentor program for newer agents through first transactions',
    Illustration: MentorConnection,
    gridArea: '2 / 1 / 3 / 3',
    gridAreaMobile: 'auto',
  },
  {
    icon: Building2,
    title: 'Physical Access',
    text: 'Access to Regus business lounges worldwide',
    Illustration: OfficeLounge,
    gridArea: '2 / 3 / 3 / 4',
    gridAreaMobile: 'auto',
  },
];

/* ═══ Gauge Stat Readout ═══ */

function GaugeStat({ targetNumber, suffix, label, status, delay }: {
  targetNumber: number;
  suffix: string;
  label: string;
  status: string;
  delay: number;
}) {
  const { displayValue, elementRef, hasAnimated } = useScrambleCounter(targetNumber, 2000);

  return (
    <div
      className="si-gauge relative rounded-xl px-5 py-4 text-center"
      style={{
        background: 'linear-gradient(180deg, rgba(0,191,255,0.04) 0%, rgba(0,191,255,0.01) 100%)',
        border: '1px solid rgba(0,191,255,0.15)',
      }}
    >
      {/* Status LED */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="w-1.5 h-1.5 rounded-full si-led" style={{ background: '#00ff88', boxShadow: '0 0 6px #00ff88' }} />
        <span className="text-[9px] uppercase tracking-[0.2em]" style={{ color: 'rgba(0,255,136,0.7)', fontFamily: 'monospace' }}>{status}</span>
      </div>
      {/* Number */}
      <p
        className="text-3xl lg:text-4xl font-bold tabular-nums"
        style={{
          color: '#00bfff',
          fontFamily: 'monospace',
          textShadow: '-1px -1px 0 #80d4ff, 1px 1px 0 #3d8a9d, 2px 2px 0 #2d6a7d, 3px 3px 0 #1d4a5d, 4px 4px 0 #1d2a3d, 5px 5px 4px rgba(0,0,0,0.5)',
        }}
      >
        <span ref={elementRef}>
          {hasAnimated ? targetNumber.toLocaleString() : displayValue.toLocaleString()}
        </span>
        <span style={{ fontSize: '0.7em', opacity: 0.7 }}>{suffix}</span>
      </p>
      <p className="text-xs uppercase tracking-wider mt-1" style={{ color: 'var(--color-body-text)', opacity: 0.8, fontFamily: 'monospace' }}>
        {label}
      </p>
    </div>
  );
}

/* ═══ Main Component ═══ */

export default function SupportInfrastructureSection() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="support"
      ref={sectionRef}
      className="relative px-4 sm:px-8 md:px-12 overflow-hidden"
      style={{ margin: '-100px 0', paddingTop: '100px', paddingBottom: '100px' }}
    >
      {/* Blueprint grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,191,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,191,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          opacity: visible ? 0.5 : 0,
          transition: 'opacity 1s ease',
        }}
      />
      {/* Subtle radial overlay to soften edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(8,10,15,0.9) 100%)' }}
      />

      <div className="relative max-w-[1200px] mx-auto" style={{ zIndex: 1 }}>
        <div className="text-center mb-6">
          <H2>Support & Training</H2>
        </div>

        {/* Gauge stats row */}
        <div
          className="grid grid-cols-3 gap-3 md:gap-4 mb-10 max-w-[700px] mx-auto"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          {STATS.map((stat, i) => (
            <GaugeStat key={stat.label} {...stat} delay={i * 150} />
          ))}
        </div>

        {/* Module grid (non-uniform) with connecting lines */}
        <div className="relative">
          {/* Desktop: non-uniform 3-col grid */}
          <div className="hidden md:grid gap-4" style={{ gridTemplateColumns: '1fr 2fr', gridTemplateRows: 'auto auto' }}>
            {MODULES.map((mod, i) => (
              <div
                key={mod.title}
                className="si-module group relative rounded-2xl overflow-hidden"
                style={{
                  gridArea: i === 0 ? '1 / 1 / 2 / 2' : i === 1 ? '1 / 2 / 2 / 3' : i === 2 ? '2 / 1 / 3 / 2' : '2 / 2 / 3 / 3',
                  background: 'linear-gradient(180deg, rgba(12,16,24,0.95), rgba(8,10,16,0.98))',
                  border: '1px solid rgba(0,191,255,0.1)',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 0.6s ease ${200 + i * 120}ms, transform 0.6s ease ${200 + i * 120}ms`,
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
                  style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(0,191,255,0.06) 0%, transparent 70%)' }}
                />

                <div className="relative z-10 p-5 md:p-6 flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{
                        background: 'rgba(0,191,255,0.1)',
                        border: '1px solid rgba(0,191,255,0.25)',
                      }}
                    >
                      <mod.icon size={18} style={{ color: '#00bfff' }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-h6 mb-1" style={{ color: '#e5e4dd' }}>{mod.title}</h3>
                      <p className="text-body text-sm leading-relaxed" style={{ color: 'var(--color-body-text)', opacity: 0.8 }}>
                        {mod.text}
                      </p>
                    </div>
                  </div>

                  {/* SVG illustration */}
                  <div className="flex-1 flex items-end justify-center mt-2">
                    <mod.Illustration />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: 2-col grid */}
          <div className="md:hidden grid grid-cols-2 gap-3">
            {MODULES.map((mod, i) => (
              <div
                key={mod.title}
                className="si-module relative rounded-xl overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, rgba(12,16,24,0.95), rgba(8,10,16,0.98))',
                  border: '1px solid rgba(0,191,255,0.1)',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(16px)',
                  transition: `opacity 0.5s ease ${i * 100}ms, transform 0.5s ease ${i * 100}ms`,
                }}
              >
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <mod.icon size={16} style={{ color: '#00bfff' }} />
                    <h3 className="text-h6 text-sm" style={{ color: '#e5e4dd' }}>{mod.title}</h3>
                  </div>
                  <p className="text-body text-sm leading-relaxed mb-3" style={{ color: 'var(--color-body-text)', opacity: 0.85 }}>
                    {mod.text}
                  </p>
                  <div className="flex justify-center">
                    <mod.Illustration />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <a href="/about-exp-realty/support" className="inline-flex items-center gap-1 transition-opacity duration-200 hover:opacity-90" style={{ color: 'var(--color-body-text, #dcdbd5)', textDecoration: 'none', fontSize: '14px', opacity: 0.85 }}>Learn more about support & training →</a>
        </div>
      </div>

      <style>{`
        .si-module-svg {
          width: 200px;
          height: 170px;
          opacity: 1;
          transition: opacity 0.3s ease, transform 0.5s ease;
        }
        .si-module:hover .si-module-svg {
          opacity: 1;
          transform: scale(1.05);
        }
        @media (min-width: 768px) {
          .si-module-svg {
            width: 280px;
            height: 240px;
          }
        }
        .si-module {
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .si-module:hover {
          border-color: rgba(0,191,255,0.25) !important;
          box-shadow: 0 0 24px rgba(0,191,255,0.08), 0 8px 24px rgba(0,0,0,0.3);
        }
        .si-gauge {
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .si-gauge:hover {
          border-color: rgba(0,191,255,0.3);
          box-shadow: 0 0 20px rgba(0,191,255,0.1);
        }
        .si-led {
          animation: siLedPulse 2s ease-in-out infinite;
        }
        @keyframes siLedPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .si-ping {
          animation: siPing 2s ease-out infinite;
        }
        @keyframes siPing {
          0% { r: 3; opacity: 0.5; }
          100% { r: 10; opacity: 0; }
        }
      `}</style>
    </section>
  );
}
