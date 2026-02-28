'use client';

import { H2 } from '@saa/shared/components/saa/headings';
import { Layers, Sparkles } from 'lucide-react';

const DIVISIONS = [
  'Residential',
  'Commercial',
  'Luxury',
  'Land & Ranch',
  'Sports & Entertainment',
  'Referral-only',
];

const SOLUTIONS = [
  'Healthcare options for agents and families',
  'Lending, warranty, and renovation partners',
  'Branded and discounted signage',
  'Utility and closing services',
  'Continuing education',
];

export default function AdditionalAreasSection() {
  return (
    <section className="px-4 sm:px-8 md:px-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-10">
          <H2>ADDITIONAL AREAS AGENTS EXPLORE</H2>
          <p className="text-body mt-4 max-w-[600px] mx-auto" style={{ color: 'var(--color-body-text)', opacity: 0.8 }}>
            As agents grow, specialize, or shift focus, these areas often become relevant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Divisions Card */}
          <div
            id="division"
            className="group relative rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(20,25,35,0.95), rgba(10,15,25,0.98))',
              border: '1px solid rgba(0,191,255,0.2)',
              boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,191,255,0.1) 0%, transparent 70%)' }} />
            <div className="px-6 pt-6 pb-4 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(0,191,255,0.1)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(0,191,255,0.2), rgba(0,120,200,0.1))', border: '1px solid rgba(0,191,255,0.3)' }}>
                <Layers size={20} style={{ color: '#00bfff' }} />
              </div>
              <h3 className="text-h4">DIVISIONS</h3>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {DIVISIONS.map((division) => (
                  <li key={division} className="text-body text-sm flex items-center gap-3" style={{ color: 'var(--color-body-text)' }}>
                    <span className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'rgba(0,191,255,0.1)', border: '1px solid rgba(0,191,255,0.2)' }}>
                      <span style={{ color: '#00bfff', fontSize: '8px' }}>◆</span>
                    </span>
                    {division}
                  </li>
                ))}
              </ul>
              <a href="/about-exp-realty/divisions" className="inline-flex items-center gap-1 transition-opacity duration-200 hover:opacity-90" style={{ color: 'var(--color-body-text, #dcdbd5)', textDecoration: 'none', fontSize: '13px', opacity: 0.7, marginTop: '16px', display: 'block' }}>Learn more about divisions →</a>
            </div>
          </div>

          {/* Solutions Card */}
          <div
            id="solutions"
            className="group relative rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(20,25,35,0.95), rgba(10,15,25,0.98))',
              border: '1px solid rgba(0,191,255,0.2)',
              boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,191,255,0.1) 0%, transparent 70%)' }} />
            <div className="px-6 pt-6 pb-4 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(0,191,255,0.1)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(0,191,255,0.2), rgba(0,120,200,0.1))', border: '1px solid rgba(0,191,255,0.3)' }}>
                <Sparkles size={20} style={{ color: '#00bfff' }} />
              </div>
              <h3 className="text-h4">SOLUTIONS</h3>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {SOLUTIONS.map((solution) => (
                  <li key={solution} className="text-body text-sm flex items-center gap-3" style={{ color: 'var(--color-body-text)' }}>
                    <span className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'rgba(0,191,255,0.1)', border: '1px solid rgba(0,191,255,0.2)' }}>
                      <span style={{ color: '#00bfff', fontSize: '8px' }}>◆</span>
                    </span>
                    {solution}
                  </li>
                ))}
              </ul>
              <a href="/about-exp-realty/solutions" className="inline-flex items-center gap-1 transition-opacity duration-200 hover:opacity-90" style={{ color: 'var(--color-body-text, #dcdbd5)', textDecoration: 'none', fontSize: '13px', opacity: 0.7, marginTop: '16px', display: 'block' }}>Learn more about solutions →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
