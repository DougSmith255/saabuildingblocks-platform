'use client';

import { GenericCard } from '@saa/shared/components/saa/cards';
import { CTAButton } from '@saa/shared/components/saa/buttons';
import { H2 } from '@saa/shared/components/saa/headings';
import { Building2, Link, Settings, Handshake } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const nodes: { icon: LucideIcon; title: string; text: string; color: string; highlight?: boolean }[] = [
  { icon: Building2, title: 'eXp', text: 'eXp provides the brokerage, compensation model, technology, and global infrastructure.', color: '#00bfff' },
  { icon: Link, title: 'Sponsorship', text: 'Sponsorship is separate from the brokerage. Compensation comes from transactions, not recruiting.', color: '#a050ff' },
  { icon: Settings, title: 'Freedom', text: 'Sponsors aren\'t required to provide support. Those who do decide what to offer and whether to charge.', color: '#00ff88' },
  { icon: Handshake, title: 'SAA', text: 'SAA provides systems, training, and community at no cost to agents — funded by sponsor compensation from eXp.', color: '#ffd700', highlight: true },
];

export default function WhereSAAFitsVersionA() {
  return (
    <section className="px-4 sm:px-8 md:px-12 relative overflow-x-clip">
      <div className="max-w-[1500px] mx-auto">
        <div className="text-center mb-12">
          <H2>WHERE SMART AGENT ALLIANCE FITS</H2>
        </div>

          {/* Timeline - Desktop horizontal */}
          <div className="hidden lg:block relative mb-12">
            <svg
              className="absolute top-[60px] left-[10%] right-[10%] w-[80%] h-[8px]"
              preserveAspectRatio="none"
              viewBox="0 0 100 8"
            >
              <defs>
                <linearGradient id="timeline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00bfff" />
                  <stop offset="33%" stopColor="#a050ff" />
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
              {nodes.map((node) => (
                <div key={node.title} className="flex flex-col items-center text-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-6 relative z-10"
                    style={{
                      background: node.highlight
                        ? 'linear-gradient(135deg, rgba(255,215,0,0.3), rgba(200,160,0,0.15))'
                        : 'linear-gradient(180deg, rgba(30,30,30,0.95), rgba(15,15,15,0.98))',
                      border: `3px solid ${node.color}`,
                      boxShadow: `0 0 20px ${node.color}60`,
                    }}
                  >
                    <node.icon size={20} style={{ color: node.color }} />
                  </div>

                  <GenericCard
                    padding="md"
                    className="h-full"
                    style={{
                      borderColor: node.highlight ? 'rgba(255,215,0,0.4)' : 'rgba(255,255,255,0.08)',
                      boxShadow: node.highlight ? '0 0 30px rgba(255,215,0,0.15)' : undefined,
                    }}
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
                  </GenericCard>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline - Mobile vertical */}
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
                  <stop offset="33%" stopColor="#a050ff" />
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
              {nodes.map((node) => (
                <div key={node.title} className="flex gap-6">
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
                    <GenericCard
                      padding="md"
                      style={{
                        borderColor: node.highlight ? 'rgba(255,215,0,0.4)' : 'rgba(255,255,255,0.08)',
                        boxShadow: node.highlight ? '0 0 25px rgba(255,215,0,0.15)' : undefined,
                      }}
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
                    </GenericCard>
                  </div>
                </div>
              ))}
            </div>
          </div>

        <div className="text-center mb-4">
          <a href="/about-exp-realty/fit" className="inline-flex items-center gap-1 transition-opacity duration-200 hover:opacity-90" style={{ color: 'var(--color-body-text, #dcdbd5)', textDecoration: 'none', fontSize: '14px', opacity: 0.7 }}>Learn more about where SAA fits →</a>
        </div>
        <div className="flex justify-center items-center gap-6">
          <CTAButton href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('open-join-modal')); }}>Join the Alliance</CTAButton>
        </div>
      </div>
    </section>
  );
}
