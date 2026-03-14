'use client';

import { useEffect, useRef, useState } from 'react';
import { CTAButton } from '@saa/shared/components/saa/buttons';
import { H2 } from '@saa/shared/components/saa/headings';
import { Building2, Link, Settings, Handshake } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const nodes: {
  icon: LucideIcon;
  title: string;
  text: string;
  color: string;
  rgb: string;
  highlight?: boolean;
  prominence: 1 | 2 | 3 | 4;
}[] = [
  {
    icon: Building2,
    title: 'eXp',
    text: 'eXp provides the brokerage, compensation model, technology, and global infrastructure.',
    color: '#00bfff',
    rgb: '0,191,255',
    prominence: 1,
  },
  {
    icon: Link,
    title: 'Sponsorship',
    text: 'Sponsorship is separate from the brokerage. Compensation comes from transactions, not recruiting.',
    color: '#9933ff',
    rgb: '153,51,255',
    prominence: 2,
  },
  {
    icon: Settings,
    title: 'Freedom',
    text: "Sponsors aren't required to provide support. Those who do decide what to offer and whether to charge.",
    color: '#00ff88',
    rgb: '0,255,136',
    prominence: 3,
  },
  {
    icon: Handshake,
    title: 'SAA',
    text: 'SAA provides systems, training, and community at no cost to agents - funded by sponsor compensation from eXp.',
    color: '#ffd700',
    rgb: '255,215,0',
    highlight: true,
    prominence: 4,
  },
];

export default function WhereSAAFitsVersionA() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="px-4 sm:px-8 md:px-12 relative overflow-x-clip">
      <div ref={sectionRef} className="max-w-[1500px] mx-auto">
        <div className="text-center mb-6">
          <H2>WHERE SMART AGENT ALLIANCE FITS</H2>
        </div>

        {/* Desktop horizontal */}
        <div className="hidden lg:block relative mb-12">
          {/* Gradient timeline line */}
          <svg
            className="absolute top-[60px] left-[10%] right-[10%] w-[80%] h-[8px]"
            preserveAspectRatio="none"
            viewBox="0 0 100 8"
          >
            <defs>
              <linearGradient id="timeline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00bfff" />
                <stop offset="33%" stopColor="#9933ff" />
                <stop offset="66%" stopColor="#00ff88" />
                <stop offset="100%" stopColor="#ffd700" />
              </linearGradient>
              <filter id="timeline-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <polygon
              points="0,4 3,1 97,1 100,4 97,7 3,7"
              fill="url(#timeline-gradient)"
              filter="url(#timeline-glow)"
            />
          </svg>

          <div className="grid grid-cols-4 gap-6">
            {nodes.map((node, i) => (
              <div
                key={node.title}
                className="flex flex-col items-center text-center"
                style={{
                  height: '100%',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 0.5s ease ${i * 150}ms, transform 0.5s ease ${i * 150}ms`,
                }}
              >
                {/* Station dot */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-6 relative z-10"
                  style={{
                    background: node.highlight
                      ? `linear-gradient(135deg, rgba(${node.rgb},0.3), rgba(${node.rgb},0.15))`
                      : 'linear-gradient(180deg, rgba(30,30,30,0.95), rgba(15,15,15,0.98))',
                    border: `3px solid ${node.color}`,
                    boxShadow: `0 0 20px ${node.color}60`,
                  }}
                >
                  <node.icon size={20} style={{ color: node.color }} />
                </div>

                {/* Card - equal height */}
                <div
                  className={`saa-fits-card saa-fits-p${node.prominence} w-full flex-1`}
                  style={{
                    '--accent': node.color,
                    '--accent-rgb': node.rgb,
                    display: 'flex',
                    flexDirection: 'column',
                  } as React.CSSProperties}
                >
                  <h3 className="text-h5 mb-3" style={{ color: node.color }}>{node.title}</h3>
                  <p
                    className="text-body text-sm leading-relaxed"
                    style={{
                      color: node.highlight ? '#ffd700' : 'var(--color-body-text)',
                      fontWeight: node.highlight ? 500 : 400,
                    }}
                  >
                    {node.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile vertical */}
        <div className="lg:hidden relative mb-12">
          <svg
            className="absolute left-[22px] top-4 bottom-4 w-[8px]"
            style={{ height: 'calc(100% - 32px)' }}
            preserveAspectRatio="none"
            viewBox="0 0 8 100"
          >
            <defs>
              <linearGradient id="timeline-gradient-mobile" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00bfff" />
                <stop offset="33%" stopColor="#9933ff" />
                <stop offset="66%" stopColor="#00ff88" />
                <stop offset="100%" stopColor="#ffd700" />
              </linearGradient>
            </defs>
            <polygon
              points="4,0 7,3 7,97 4,100 1,97 1,3"
              fill="url(#timeline-gradient-mobile)"
            />
          </svg>

          <div className="space-y-6">
            {nodes.map((node, i) => (
              <div
                key={node.title}
                className="flex gap-6"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateX(0)' : 'translateX(-16px)',
                  transition: `opacity 0.5s ease ${i * 120}ms, transform 0.5s ease ${i * 120}ms`,
                }}
              >
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center relative z-10"
                  style={{
                    background: 'linear-gradient(180deg, rgba(30,30,30,0.95), rgba(15,15,15,0.98))',
                    border: `3px solid ${node.color}`,
                    boxShadow: `0 0 15px ${node.color}50`,
                  }}
                >
                  <node.icon size={20} style={{ color: node.color }} />
                </div>

                <div className="flex-1">
                  <div
                    className={`saa-fits-card saa-fits-p${node.prominence}`}
                    style={{
                      '--accent': node.color,
                      '--accent-rgb': node.rgb,
                    } as React.CSSProperties}
                  >
                    <h3 className="text-h5 mb-2" style={{ color: node.color }}>{node.title}</h3>
                    <p
                      className="text-body text-sm leading-relaxed"
                      style={{
                        color: node.highlight ? '#ffd700' : 'var(--color-body-text)',
                        fontWeight: node.highlight ? 500 : 400,
                      }}
                    >
                      {node.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Standalone CTA below timeline */}
        <div
          className="flex flex-col items-center gap-3 mt-2 mb-4"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.6s ease 600ms, transform 0.6s ease 600ms',
          }}
        >
          <CTAButton href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('open-join-modal')); }}>
            Join the Alliance
          </CTAButton>
          <a href="/about-exp-realty/fit" className="inline-flex items-center gap-1 transition-opacity duration-200 hover:opacity-90" style={{ color: 'var(--color-body-text, #dcdbd5)', textDecoration: 'none', fontSize: '14px', opacity: 0.85 }}>Learn more about where SAA fits →</a>
        </div>
      </div>

      <style>{`
        /* Base card */
        .saa-fits-card {
          border-radius: 16px;
          padding: 20px;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
        }

        /* P1 - Understated but visible */
        .saa-fits-p1 {
          background: linear-gradient(180deg, rgba(18,20,28,0.9), rgba(12,14,20,0.95));
          border: 1px solid rgba(var(--accent-rgb), 0.2);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .saa-fits-p1:hover {
          border-color: rgba(var(--accent-rgb), 0.35);
          box-shadow: 0 0 12px rgba(var(--accent-rgb), 0.06), 0 4px 12px rgba(0,0,0,0.2);
        }

        /* P2 - Subtle border */
        .saa-fits-p2 {
          background: linear-gradient(180deg, rgba(20,18,30,0.92), rgba(12,12,20,0.96));
          border: 1px solid rgba(var(--accent-rgb), 0.2);
          box-shadow: 0 2px 12px rgba(0,0,0,0.2);
        }
        .saa-fits-p2:hover {
          border-color: rgba(var(--accent-rgb), 0.35);
          box-shadow: 0 0 16px rgba(var(--accent-rgb), 0.08), 0 4px 16px rgba(0,0,0,0.3);
        }

        /* P3 - Prominent glow */
        .saa-fits-p3 {
          background: linear-gradient(180deg, rgba(16,24,20,0.92), rgba(10,14,12,0.96));
          border: 1px solid rgba(var(--accent-rgb), 0.25);
          box-shadow: 0 0 16px rgba(var(--accent-rgb), 0.06), 0 4px 16px rgba(0,0,0,0.25);
        }
        .saa-fits-p3:hover {
          border-color: rgba(var(--accent-rgb), 0.4);
          box-shadow: 0 0 24px rgba(var(--accent-rgb), 0.12), 0 4px 20px rgba(0,0,0,0.3);
        }

        /* P4 - Gold glow, pulsing border (SAA payoff) */
        .saa-fits-p4 {
          background: linear-gradient(180deg, rgba(28,24,12,0.94), rgba(14,12,8,0.97));
          border: 2px solid rgba(var(--accent-rgb), 0.4);
          box-shadow: 0 0 20px rgba(var(--accent-rgb), 0.15), 0 0 40px rgba(var(--accent-rgb), 0.06), 0 4px 20px rgba(0,0,0,0.3);
          animation: saaFitsPulse 3s ease-in-out infinite;
        }
        .saa-fits-p4:hover {
          border-color: rgba(var(--accent-rgb), 0.6);
          box-shadow: 0 0 30px rgba(var(--accent-rgb), 0.2), 0 0 50px rgba(var(--accent-rgb), 0.1), 0 4px 24px rgba(0,0,0,0.35);
        }

        @keyframes saaFitsPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.2), 0 0 40px rgba(255,215,0,0.08), 0 4px 20px rgba(0,0,0,0.3); }
          50% { box-shadow: 0 0 35px rgba(255,215,0,0.35), 0 0 60px rgba(255,215,0,0.15), 0 4px 20px rgba(0,0,0,0.3); }
        }
      `}</style>
    </section>
  );
}
