'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { H2, Icon3D } from '@saa/shared/components/saa';
import { Building2, Wrench, Shield, Settings, GraduationCap, Users, Layers } from 'lucide-react';

// ============================================================================
// SHARED CONTENT — same constants as the sponsor page
// ============================================================================

const PANELS = [
  {
    id: 'different',
    label: 'Built Differently',
    icon: Building2,
    color: '#ffd700',
    items: [
      { icon: Building2, text: 'Built as a sponsor organization, not an individual sponsor' },
      { icon: Wrench, text: 'Delivers real systems, training, and income infrastructure' },
      { icon: Shield, text: 'No commission splits or loss of control' },
    ],
    tagline: null,
  },
  {
    id: 'cost',
    label: 'Zero Cost',
    icon: Shield,
    color: '#ffd700',
    items: [
      { icon: Shield, text: 'Agents pay Smart Agent Alliance nothing.' },
      { icon: Shield, text: 'We are compensated from eXp\'s company revenue only when agents close transactions.' },
    ],
    tagline: 'When our agents succeed, we succeed.',
  },
  {
    id: 'org',
    label: 'Organization',
    icon: Layers,
    color: '#ffd700',
    items: [
      { icon: Settings, text: 'Systems are designed, maintained, and updated' },
      { icon: GraduationCap, text: 'Training is structured, repeatable, and current' },
      { icon: Users, text: 'Community is active and intentional' },
      { icon: Layers, text: 'Infrastructure exists independently of any single leader' },
    ],
    tagline: null,
  },
];

function PanelContent({ panel }: { panel: typeof PANELS[number] }) {
  return (
    <div className="flex flex-col gap-3">
      {panel.items.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <Icon3D><item.icon size={18} /></Icon3D>
          <p className="text-body" style={{ color: '#dcdbd5' }}>{item.text}</p>
        </div>
      ))}
      {panel.tagline && (
        <p style={{ color: '#ffd700', fontFamily: 'var(--font-taskor)', fontWeight: 600, fontSize: '16px', marginTop: '0.5rem' }}>
          {panel.tagline}
        </p>
      )}
    </div>
  );
}

function SectionWrapper({ title, number, children }: { title: string; number: number; children: React.ReactNode }) {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ color: '#ffd700', fontFamily: 'var(--font-taskor)', fontWeight: 700, fontSize: '14px', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
            PATTERN {number}
          </p>
          <H2 theme="gold" style={{ marginBottom: '0.5rem', textAlign: 'left' }}>{title}</H2>
        </div>
        {children}
      </div>
    </section>
  );
}

// ============================================================================
// PATTERN 1: Depth Stack (Z-Axis Card Deck)
// ============================================================================

function Pattern1_DepthStack() {
  const [active, setActive] = useState(0);

  return (
    <SectionWrapper title="Depth Stack" number={1}>
      <style>{`
        @keyframes depthFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
      <div style={{ perspective: '1200px', height: '420px', position: 'relative' }}>
        {PANELS.map((panel, i) => {
          const offset = i - active;
          const absOffset = Math.abs(offset);
          return (
            <div
              key={panel.id}
              onClick={() => setActive(i)}
              style={{
                position: 'absolute',
                inset: 0,
                maxWidth: '700px',
                margin: '0 auto',
                padding: '2rem',
                borderRadius: '1rem',
                cursor: offset === 0 ? 'default' : 'pointer',
                transform: `translateZ(${offset * -120}px) translateY(${offset * 30}px) scale(${1 - absOffset * 0.06})`,
                opacity: offset === 0 ? 1 : 0.4 + (absOffset === 1 ? 0.15 : 0),
                filter: `blur(${absOffset * 3}px)`,
                zIndex: 10 - absOffset,
                background: offset === 0
                  ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"), linear-gradient(180deg, rgba(18,18,18,0.85) 0%, rgba(12,12,12,0.92) 100%)`
                  : 'linear-gradient(180deg, rgba(18,18,18,0.95) 0%, rgba(12,12,12,0.98) 100%)',
                backgroundBlendMode: offset === 0 ? 'overlay, normal' : 'normal',
                border: offset === 0 ? `2px solid ${panel.color}` : '1px solid rgba(255,255,255,0.06)',
                boxShadow: offset === 0
                  ? `0 0 30px rgba(255,215,0,0.15), 0 20px 60px rgba(0,0,0,0.5)`
                  : '0 10px 40px rgba(0,0,0,0.4)',
                transition: 'all 0.7s cubic-bezier(0.34, 1.2, 0.64, 1)',
                animation: offset === 0 ? 'depthFloat 3s ease-in-out infinite' : 'none',
              }}
            >
              <div style={{ opacity: offset === 0 ? 1 : 0, transition: 'opacity 0.4s ease 0.2s' }}>
                <p style={{ color: panel.color, fontFamily: 'var(--font-taskor)', fontWeight: 700, fontSize: '22px', marginBottom: '1.25rem' }}>
                  {panel.label}
                </p>
                <PanelContent panel={panel} />
              </div>
            </div>
          );
        })}
      </div>
      {/* Navigation dots */}
      <div className="flex justify-center gap-3 mt-6">
        {PANELS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setActive(i)}
            style={{
              width: active === i ? '32px' : '10px',
              height: '10px',
              borderRadius: '5px',
              background: active === i ? '#ffd700' : 'rgba(255,255,255,0.2)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.4s ease',
            }}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}

// ============================================================================
// PATTERN 2: Spotlight Reveal
// ============================================================================

function Pattern2_Spotlight() {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [spotPos, setSpotPos] = useState({ x: 0.165, y: 0.5 });

  const positions = [
    { x: 0.165, y: 0.5 },
    { x: 0.5, y: 0.5 },
    { x: 0.835, y: 0.5 },
  ];

  useEffect(() => {
    setSpotPos(positions[active]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <SectionWrapper title="Spotlight Reveal" number={2}>
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          borderRadius: '1rem',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, rgba(8,8,8,1) 0%, rgba(5,5,5,1) 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
          minHeight: '400px',
        }}
      >
        {/* Content grid — always rendered, dimmed */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative z-10" style={{ minHeight: '400px' }}>
          {PANELS.map((panel, i) => (
            <div
              key={panel.id}
              onClick={() => setActive(i)}
              className="p-6 md:p-8 cursor-pointer"
              style={{
                opacity: active === i ? 1 : 0.15,
                transition: 'opacity 0.6s ease',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <panel.icon size={24} style={{ color: panel.color }} />
                <p style={{ color: panel.color, fontFamily: 'var(--font-taskor)', fontWeight: 700, fontSize: '20px' }}>
                  {panel.label}
                </p>
              </div>
              <PanelContent panel={panel} />
            </div>
          ))}
        </div>

        {/* Spotlight overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `radial-gradient(ellipse 35% 80% at ${spotPos.x * 100}% ${spotPos.y * 100}%, transparent 0%, rgba(0,0,0,0.85) 100%)`,
            transition: 'background 0.8s ease',
            zIndex: 20,
          }}
        />

        {/* Glow ring */}
        <div
          style={{
            position: 'absolute',
            left: `${spotPos.x * 100}%`,
            top: `${spotPos.y * 100}%`,
            width: '300px',
            height: '300px',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            boxShadow: '0 0 80px 40px rgba(255,215,0,0.06)',
            pointerEvents: 'none',
            transition: 'left 0.8s ease, top 0.8s ease',
            zIndex: 15,
          }}
        />
      </div>
      {/* Tab selector below */}
      <div className="flex justify-center gap-4 mt-4">
        {PANELS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setActive(i)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: active === i ? 'rgba(255,215,0,0.1)' : 'transparent',
              border: active === i ? '1px solid rgba(255,215,0,0.3)' : '1px solid rgba(255,255,255,0.1)',
              color: active === i ? '#ffd700' : '#666',
              fontFamily: 'var(--font-taskor)',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
    </SectionWrapper>
  );
}

// ============================================================================
// PATTERN 3: Morphing Blob
// ============================================================================

function Pattern3_MorphingBlob() {
  const [active, setActive] = useState(0);

  const blobShapes = [
    '60% 40% 30% 70% / 60% 30% 70% 40%',
    '40% 60% 70% 30% / 30% 70% 40% 60%',
    '70% 30% 50% 50% / 50% 50% 30% 70%',
  ];

  return (
    <SectionWrapper title="Morphing Blob" number={3}>
      <style>{`
        @keyframes blobBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.01); }
        }
      `}</style>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        {/* Blob container */}
        <div
          style={{
            width: '100%',
            maxWidth: '700px',
            minHeight: '350px',
            padding: '2.5rem',
            borderRadius: blobShapes[active],
            background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"), linear-gradient(180deg, rgba(18,18,18,0.85) 0%, rgba(12,12,12,0.92) 100%)`,
            backgroundBlendMode: 'overlay, normal',
            border: '1px solid rgba(255,215,0,0.15)',
            boxShadow: '0 0 60px rgba(255,215,0,0.05), 0 20px 60px rgba(0,0,0,0.4)',
            transition: 'border-radius 1s cubic-bezier(0.65, 0, 0.35, 1)',
            animation: 'blobBreathe 4s ease-in-out infinite',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {PANELS.map((panel, i) => (
            <div
              key={panel.id}
              style={{
                position: i === 0 ? 'relative' : 'absolute',
                inset: i === 0 ? undefined : 0,
                padding: i === 0 ? 0 : '2.5rem',
                opacity: active === i ? 1 : 0,
                transform: active === i ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
                pointerEvents: active === i ? 'auto' : 'none',
              }}
            >
              <p style={{ color: panel.color, fontFamily: 'var(--font-taskor)', fontWeight: 700, fontSize: '22px', marginBottom: '1.25rem' }}>
                {panel.label}
              </p>
              <PanelContent panel={panel} />
            </div>
          ))}
        </div>

        {/* Trigger labels */}
        <div className="flex gap-3">
          {PANELS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActive(i)}
              style={{
                padding: '10px 20px',
                borderRadius: '24px',
                background: active === i ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.03)',
                border: active === i ? '1px solid rgba(255,215,0,0.4)' : '1px solid rgba(255,255,255,0.08)',
                color: active === i ? '#ffd700' : '#888',
                fontFamily: 'var(--font-taskor)',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.4s ease',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

// ============================================================================
// PATTERN 4: Orbital Ring
// ============================================================================

function Pattern4_OrbitalRing() {
  const [active, setActive] = useState(0);
  const baseAngles = [270, 30, 150]; // top, bottom-right, bottom-left

  const getAngle = (idx: number) => {
    const rotation = -((active - 0) * 120);
    return baseAngles[idx] + rotation;
  };

  return (
    <SectionWrapper title="Orbital Ring" number={4}>
      <div style={{ position: 'relative', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
        {/* Central content */}
        <div
          style={{
            minHeight: '320px',
            padding: '2rem',
            borderRadius: '1rem',
            background: 'linear-gradient(180deg, rgba(14,14,14,0.9) 0%, rgba(10,10,10,0.95) 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {PANELS.map((panel, i) => (
            <div
              key={panel.id}
              style={{
                position: i === 0 ? 'relative' : 'absolute',
                inset: i === 0 ? undefined : 0,
                padding: i === 0 ? 0 : '2rem',
                opacity: active === i ? 1 : 0,
                transform: active === i ? 'scale(1)' : 'scale(0.96)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
                pointerEvents: active === i ? 'auto' : 'none',
              }}
            >
              <PanelContent panel={panel} />
            </div>
          ))}
        </div>

        {/* Orbital buttons — positioned around the box */}
        <div className="flex justify-center gap-4 mt-6">
          {PANELS.map((panel, i) => {
            const isActive = active === i;
            return (
              <button
                key={panel.id}
                onClick={() => setActive(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '999px',
                  background: isActive ? 'rgba(255,215,0,0.1)' : 'rgba(12,12,12,0.8)',
                  border: isActive ? '2px solid rgba(255,215,0,0.5)' : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: isActive ? '0 0 20px rgba(255,215,0,0.15)' : 'none',
                  color: isActive ? '#ffd700' : '#666',
                  fontFamily: 'var(--font-taskor)',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.5s cubic-bezier(0.34, 1.2, 0.64, 1)',
                  transform: isActive ? 'scale(1.08)' : 'scale(1)',
                }}
              >
                <panel.icon size={16} />
                {panel.label}
              </button>
            );
          })}
        </div>

        {/* SVG connecting lines */}
        <svg
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
          viewBox="0 0 800 320"
          preserveAspectRatio="none"
        >
          <line x1="133" y1="160" x2="400" y2="160" stroke="rgba(255,215,0,0.08)" strokeWidth="1" />
          <line x1="400" y1="160" x2="667" y2="160" stroke="rgba(255,215,0,0.08)" strokeWidth="1" />
        </svg>
      </div>
    </SectionWrapper>
  );
}

// ============================================================================
// PATTERN 5: Parallax Depth Layers
// ============================================================================

function Pattern5_ParallaxLayers() {
  const [active, setActive] = useState(0);

  return (
    <SectionWrapper title="Parallax Depth Layers" number={5}>
      <div style={{ perspective: '800px', position: 'relative', minHeight: '440px' }}>
        {PANELS.map((panel, i) => {
          const offset = i - active;
          const absOffset = Math.abs(offset);
          return (
            <div
              key={panel.id}
              onClick={() => setActive(i)}
              style={{
                position: i === 0 ? 'relative' : 'absolute',
                inset: i === 0 ? undefined : 0,
                padding: '2rem',
                borderRadius: '1rem',
                cursor: offset === 0 ? 'default' : 'pointer',
                transform: `translateZ(${offset * -60}px) translateY(${offset * 25}px) rotateX(${offset * 2}deg)`,
                opacity: offset === 0 ? 1 : 0.25,
                background: offset === 0
                  ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"), linear-gradient(180deg, rgba(18,18,18,0.85) 0%, rgba(12,12,12,0.92) 100%)`
                  : `linear-gradient(180deg, rgba(${15 + i * 3},${15 + i * 3},${15 + i * 3},0.95) 0%, rgba(10,10,10,0.98) 100%)`,
                backgroundBlendMode: offset === 0 ? 'overlay, normal' : 'normal',
                border: offset === 0 ? `2px solid ${panel.color}` : '1px solid rgba(255,255,255,0.04)',
                boxShadow: offset === 0
                  ? `0 0 40px rgba(255,215,0,0.1), 0 25px 60px rgba(0,0,0,0.5)`
                  : '0 10px 30px rgba(0,0,0,0.3)',
                transition: 'all 0.8s cubic-bezier(0.34, 1.2, 0.64, 1)',
                zIndex: 10 - absOffset,
                backdropFilter: offset === 0 ? 'blur(16px) saturate(120%)' : 'none',
              }}
            >
              <div style={{ opacity: offset === 0 ? 1 : 0, transition: 'opacity 0.4s ease 0.3s' }}>
                <p style={{ color: panel.color, fontFamily: 'var(--font-taskor)', fontWeight: 700, fontSize: '22px', marginBottom: '1.25rem' }}>
                  {panel.label}
                </p>
                <PanelContent panel={panel} />
              </div>
              {offset !== 0 && (
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 1, transition: 'opacity 0.3s ease',
                }}>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-taskor)', fontWeight: 700, fontSize: '18px' }}>
                    {panel.label}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-center gap-3 mt-6">
        {PANELS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setActive(i)}
            style={{
              width: active === i ? '32px' : '10px',
              height: '10px',
              borderRadius: '5px',
              background: active === i ? '#ffd700' : 'rgba(255,255,255,0.2)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.4s ease',
            }}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}

// ============================================================================
// PATTERN 6: Expanding Bento Grid
// ============================================================================

function Pattern6_BentoGrid() {
  const [active, setActive] = useState(0);

  const gridTemplates = [
    '3fr 0.5fr 0.5fr',
    '0.5fr 3fr 0.5fr',
    '0.5fr 0.5fr 3fr',
  ];

  return (
    <SectionWrapper title="Expanding Bento Grid" number={6}>
      {/* Desktop */}
      <div
        className="hidden md:grid gap-3"
        style={{
          gridTemplateColumns: gridTemplates[active],
          transition: 'grid-template-columns 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          minHeight: '380px',
        }}
      >
        {PANELS.map((panel, i) => {
          const isActive = active === i;
          return (
            <div
              key={panel.id}
              onClick={() => setActive(i)}
              style={{
                borderRadius: '1rem',
                padding: isActive ? '2rem' : '1rem',
                cursor: isActive ? 'default' : 'pointer',
                background: isActive
                  ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"), linear-gradient(180deg, rgba(18,18,18,0.85) 0%, rgba(12,12,12,0.92) 100%)`
                  : 'linear-gradient(180deg, rgba(18,18,18,0.95) 0%, rgba(12,12,12,0.98) 100%)',
                backgroundBlendMode: isActive ? 'overlay, normal' : 'normal',
                border: isActive ? `2px solid ${panel.color}` : '1px solid rgba(255,255,255,0.06)',
                boxShadow: isActive ? `0 0 30px rgba(255,215,0,0.1), 0 8px 32px rgba(0,0,0,0.4)` : '0 8px 32px rgba(0,0,0,0.3)',
                transition: 'all 0.5s ease',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: isActive ? 'flex-start' : 'center',
                alignItems: isActive ? 'flex-start' : 'center',
                minWidth: 0,
              }}
            >
              {isActive ? (
                <div style={{ opacity: 1, animation: 'fadeIn 0.4s ease 0.2s both' }}>
                  <p style={{ color: panel.color, fontFamily: 'var(--font-taskor)', fontWeight: 700, fontSize: '22px', marginBottom: '1.25rem' }}>
                    {panel.label}
                  </p>
                  <PanelContent panel={panel} />
                </div>
              ) : (
                <div style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                  <p style={{ color: panel.color, fontFamily: 'var(--font-taskor)', fontWeight: 700, fontSize: '18px', opacity: 0.7 }}>
                    {panel.label}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Mobile — stacked */}
      <div className="md:hidden flex flex-col gap-3">
        {PANELS.map((panel, i) => {
          const isActive = active === i;
          return (
            <div
              key={panel.id}
              onClick={() => setActive(i)}
              style={{
                borderRadius: '1rem',
                padding: '1rem 1.25rem',
                cursor: 'pointer',
                background: isActive ? 'rgba(255,215,0,0.04)' : 'linear-gradient(180deg, rgba(18,18,18,0.95) 0%, rgba(12,12,12,0.98) 100%)',
                border: isActive ? `2px solid ${panel.color}` : '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.3s ease',
              }}
            >
              <div className="flex items-center gap-3">
                <panel.icon size={20} style={{ color: panel.color }} />
                <p style={{ color: isActive ? '#ffd700' : '#888', fontFamily: 'var(--font-taskor)', fontWeight: 700, fontSize: '16px', flex: 1 }}>
                  {panel.label}
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateRows: isActive ? '1fr' : '0fr', transition: 'grid-template-rows 0.35s ease' }}>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ paddingTop: '1rem' }}><PanelContent panel={panel} /></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </SectionWrapper>
  );
}

// ============================================================================
// PATTERN 7: Typewriter Prose Reveal
// ============================================================================

function Pattern7_Typewriter() {
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState<number[]>([0]);

  const handleAdvance = (idx: number) => {
    setActive(idx);
    if (!revealed.includes(idx)) {
      setRevealed(prev => [...prev, idx]);
    }
  };

  return (
    <SectionWrapper title="Typewriter Prose" number={7}>
      <style>{`
        @keyframes typewriterBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes typeReveal {
          from { max-width: 0; }
          to { max-width: 100%; }
        }
      `}</style>
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        padding: '2rem',
        borderRadius: '1rem',
        background: 'linear-gradient(180deg, rgba(12,12,12,0.95) 0%, rgba(8,8,8,0.98) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        fontFamily: 'var(--font-amulya, sans-serif)',
        minHeight: '400px',
      }}>
        {PANELS.map((panel, i) => {
          const isRevealed = revealed.includes(i);
          const isCurrent = active === i;
          return (
            <div
              key={panel.id}
              style={{
                marginBottom: '2rem',
                opacity: isRevealed ? (isCurrent ? 1 : 0.4) : 0.1,
                transition: 'opacity 0.6s ease',
                cursor: isRevealed ? 'pointer' : 'default',
              }}
              onClick={() => isRevealed && setActive(i)}
            >
              <div className="flex items-center gap-2 mb-3">
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: isCurrent ? '#ffd700' : 'rgba(255,215,0,0.3)',
                  boxShadow: isCurrent ? '0 0 8px rgba(255,215,0,0.5)' : 'none',
                  transition: 'all 0.3s ease',
                }} />
                <p style={{
                  color: isCurrent ? '#ffd700' : 'rgba(255,215,0,0.5)',
                  fontFamily: 'var(--font-taskor)',
                  fontWeight: 700,
                  fontSize: '18px',
                  transition: 'color 0.3s ease',
                }}>
                  {panel.label}
                </p>
                {isCurrent && (
                  <span style={{
                    display: 'inline-block',
                    width: '2px',
                    height: '18px',
                    background: '#ffd700',
                    marginLeft: '4px',
                    animation: 'typewriterBlink 1s step-end infinite',
                  }} />
                )}
              </div>
              {isRevealed && (
                <div style={{
                  paddingLeft: '20px',
                  borderLeft: '2px solid rgba(255,215,0,0.1)',
                }}>
                  {panel.items.map((item, j) => (
                    <p
                      key={j}
                      className="text-body"
                      style={{
                        color: '#dcdbd5',
                        marginBottom: '0.5rem',
                        opacity: isCurrent ? 1 : 0.6,
                        transform: isCurrent ? 'translateX(0)' : 'translateX(-4px)',
                        transition: `opacity 0.3s ease ${j * 0.1}s, transform 0.3s ease ${j * 0.1}s`,
                      }}
                    >
                      {item.text}
                    </p>
                  ))}
                  {panel.tagline && (
                    <p style={{ color: '#ffd700', fontFamily: 'var(--font-taskor)', fontWeight: 600, fontSize: '15px', marginTop: '0.75rem', opacity: isCurrent ? 1 : 0.4 }}>
                      {panel.tagline}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Advance buttons */}
        <div className="flex gap-3 mt-4">
          {PANELS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => handleAdvance(i)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                background: active === i ? 'rgba(255,215,0,0.1)' : 'transparent',
                border: `1px solid ${active === i ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.1)'}`,
                color: active === i ? '#ffd700' : '#555',
                fontFamily: 'var(--font-taskor)',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

// ============================================================================
// PATTERN 8: Magnetic Constellation
// ============================================================================

function Pattern8_Constellation() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  const nodePositions = [
    { left: '15%', top: '50%' },
    { left: '50%', top: '50%' },
    { left: '85%', top: '50%' },
  ];

  return (
    <SectionWrapper title="Magnetic Constellation" number={8}>
      <style>{`
        @keyframes constellationFloat0 { 0%, 100% { transform: translate(-50%, -50%) translateY(0); } 50% { transform: translate(-50%, -50%) translateY(-6px); } }
        @keyframes constellationFloat1 { 0%, 100% { transform: translate(-50%, -50%) translateY(0); } 50% { transform: translate(-50%, -50%) translateY(6px); } }
        @keyframes constellationFloat2 { 0%, 100% { transform: translate(-50%, -50%) translateY(0); } 50% { transform: translate(-50%, -50%) translateY(-4px); } }
        @keyframes linePulse { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.4; } }
      `}</style>
      <div style={{ position: 'relative', minHeight: '500px' }}>
        {/* SVG connecting lines */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
        >
          <line x1="15%" y1="50%" x2="50%" y2="50%" stroke="rgba(255,215,0,0.15)" strokeWidth="1" strokeDasharray="4 4" style={{ animation: 'linePulse 3s ease infinite' }} />
          <line x1="50%" y1="50%" x2="85%" y2="50%" stroke="rgba(255,215,0,0.15)" strokeWidth="1" strokeDasharray="4 4" style={{ animation: 'linePulse 3s ease infinite 0.5s' }} />
        </svg>

        {/* Nodes */}
        {PANELS.map((panel, i) => {
          const isActive = active === i;
          const isHovered = hovered === i;
          return (
            <div
              key={panel.id}
              onClick={() => setActive(i)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: 'absolute',
                left: nodePositions[i].left,
                top: nodePositions[i].top,
                transform: 'translate(-50%, -50%)',
                zIndex: isActive ? 10 : 5,
                animation: `constellationFloat${i} ${3 + i * 0.5}s ease-in-out infinite`,
                cursor: 'pointer',
              }}
            >
              {/* Node circle */}
              <div style={{
                width: isActive ? '180px' : isHovered ? '90px' : '72px',
                height: isActive ? '180px' : isHovered ? '90px' : '72px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '4px',
                background: isActive
                  ? 'radial-gradient(circle, rgba(255,215,0,0.08) 0%, rgba(12,12,12,0.95) 70%)'
                  : 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, rgba(12,12,12,0.95) 70%)',
                border: isActive ? '2px solid rgba(255,215,0,0.5)' : '1px solid rgba(255,255,255,0.1)',
                boxShadow: isActive
                  ? '0 0 40px rgba(255,215,0,0.2), 0 0 80px rgba(255,215,0,0.05)'
                  : isHovered ? '0 0 20px rgba(255,215,0,0.1)' : 'none',
                transition: 'all 0.5s cubic-bezier(0.34, 1.2, 0.64, 1)',
              }}>
                <panel.icon size={isActive ? 28 : 20} style={{ color: isActive ? '#ffd700' : 'rgba(255,255,255,0.4)', transition: 'all 0.3s ease' }} />
                <p style={{
                  color: isActive ? '#ffd700' : 'rgba(255,255,255,0.5)',
                  fontFamily: 'var(--font-taskor)',
                  fontWeight: 700,
                  fontSize: isActive ? '13px' : '10px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap',
                }}>
                  {panel.label}
                </p>
              </div>
            </div>
          );
        })}

        {/* Content panel — below nodes */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '600px',
          padding: '1.5rem 2rem',
          borderRadius: '1rem',
          background: 'linear-gradient(180deg, rgba(14,14,14,0.95) 0%, rgba(10,10,10,0.98) 100%)',
          border: '1px solid rgba(255,215,0,0.15)',
          zIndex: 15,
        }}>
          {PANELS.map((panel, i) => (
            <div
              key={panel.id}
              style={{
                display: active === i ? 'block' : 'none',
              }}
            >
              <PanelContent panel={panel} />
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function PatternTests() {
  return (
    <main id="main-content" style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', padding: '3rem 1rem 1rem' }}>
        <H2 theme="gold">Interactive Pattern Showcase</H2>
        <p className="text-body" style={{ color: '#888', maxWidth: '600px', margin: '0.75rem auto 0' }}>
          8 genuinely different interaction patterns for Section 2 content. Click through each to compare.
        </p>
      </div>

      <Pattern1_DepthStack />
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

      <Pattern2_Spotlight />
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

      <Pattern3_MorphingBlob />
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

      <Pattern4_OrbitalRing />
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

      <Pattern5_ParallaxLayers />
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

      <Pattern6_BentoGrid />
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

      <Pattern7_Typewriter />
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

      <Pattern8_Constellation />
    </main>
  );
}
