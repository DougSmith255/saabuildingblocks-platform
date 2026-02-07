'use client';

import React from 'react';
import { Zap, Star, Shield, Gem, Rocket, Crown } from 'lucide-react';

/**
 * Card Examples Page
 * Visual showcase of 10 CyberCard redesign variations
 */

// Example 1: Subtle Corner Accents
function CardExample1({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative rounded-2xl p-6 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(20,25,35,0.95), rgba(10,15,25,0.98))',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      {/* Corner accent - top left */}
      <div className="absolute top-0 left-0 w-12 h-12">
        <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: 'linear-gradient(to right, rgba(0,191,255,0.5), transparent)' }} />
        <div className="absolute top-0 left-0 h-full w-[2px]" style={{ background: 'linear-gradient(to bottom, rgba(0,191,255,0.5), transparent)' }} />
      </div>
      {/* Corner accent - bottom right */}
      <div className="absolute bottom-0 right-0 w-12 h-12">
        <div className="absolute bottom-0 right-0 w-full h-[2px]" style={{ background: 'linear-gradient(to left, rgba(0,191,255,0.5), transparent)' }} />
        <div className="absolute bottom-0 right-0 h-full w-[2px]" style={{ background: 'linear-gradient(to top, rgba(0,191,255,0.5), transparent)' }} />
      </div>
      {children}
    </div>
  );
}

// Example 2: Frosted Glass Inner Panel
function CardExample2({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative rounded-2xl p-6 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(20,25,35,0.95), rgba(10,15,25,0.98))',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Frosted glass inner panel */}
      <div
        className="absolute inset-3 rounded-xl pointer-events-none"
        style={{
          background: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.04)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Example 3: Glowing Border on Hover
function CardExample3({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-500"
      style={{
        background: 'linear-gradient(180deg, rgba(20,25,35,0.95), rgba(10,15,25,0.98))',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Animated border glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'transparent',
          boxShadow: 'inset 0 0 0 1px rgba(0,191,255,0.3), 0 0 20px rgba(0,191,255,0.1)',
        }}
      />
      {children}
    </div>
  );
}

// Example 4: Diagonal Stripe Accent
function CardExample4({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative rounded-2xl p-6 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(20,25,35,0.95), rgba(10,15,25,0.98))',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Diagonal stripe in corner */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, transparent 45%, rgba(0,191,255,0.08) 45%, rgba(0,191,255,0.08) 55%, transparent 55%)',
        }}
      />
      {children}
    </div>
  );
}

// Example 5: Top Highlight Bar
function CardExample5({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative rounded-2xl p-6 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(20,25,35,0.95), rgba(10,15,25,0.98))',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Glowing top bar */}
      <div
        className="absolute top-0 left-6 right-6 h-[2px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.5), transparent)',
          boxShadow: '0 0 10px rgba(255,215,0,0.3)',
        }}
      />
      {children}
    </div>
  );
}

// Example 6: Subtle Grid Pattern
function CardExample6({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative rounded-2xl p-6 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(20,25,35,0.95), rgba(10,15,25,0.98))',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />
      {children}
    </div>
  );
}

// Example 7: Radial Glow Background
function CardExample7({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative rounded-2xl p-6 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(20,25,35,0.95), rgba(10,15,25,0.98))',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Radial glow at center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,191,255,0.06) 0%, transparent 70%)',
        }}
      />
      {children}
    </div>
  );
}

// Example 8: Double Border Effect
function CardExample8({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative rounded-2xl p-6"
      style={{
        background: 'linear-gradient(180deg, rgba(20,25,35,0.95), rgba(10,15,25,0.98))',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Inner border */}
      <div
        className="absolute inset-2 rounded-xl pointer-events-none"
        style={{
          border: '1px solid rgba(255,255,255,0.03)',
        }}
      />
      {children}
    </div>
  );
}

// Example 9: Shimmer Line Animation
function CardExample9({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative rounded-2xl p-6 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(20,25,35,0.95), rgba(10,15,25,0.98))',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Shimmer line that moves across top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] overflow-hidden pointer-events-none">
        <div
          className="w-1/3 h-full"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            animation: 'shimmer 3s ease-in-out infinite',
          }}
        />
      </div>
      {children}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}

// Example 10: Gradient Border
function CardExample10({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl p-[1px] overflow-hidden">
      {/* Gradient border wrapper */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(0,191,255,0.3), rgba(160,80,255,0.2), rgba(255,215,0,0.2))',
        }}
      />
      {/* Inner content */}
      <div
        className="relative rounded-2xl p-6"
        style={{
          background: 'linear-gradient(180deg, rgba(20,25,35,0.98), rgba(10,15,25,0.99))',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Sample card content
function SampleContent({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="text-center">
      <div
        className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, rgba(0,191,255,0.15), rgba(0,120,200,0.1))',
          border: '1px solid rgba(0,191,255,0.25)',
        }}
      >
        <Icon size={24} style={{ color: '#00bfff' }} />
      </div>
      <h3 className="text-lg font-bold mb-2" style={{ color: '#e5e4dd' }}>{title}</h3>
      <p className="text-sm" style={{ color: '#bfbdb0', opacity: 0.8 }}>{description}</p>
    </div>
  );
}

export default function CardExamplesPage() {
  const examples = [
    { Component: CardExample1, name: '1. Subtle Corner Accents', icon: Zap },
    { Component: CardExample2, name: '2. Frosted Glass Inner', icon: Star },
    { Component: CardExample3, name: '3. Hover Glow Border', icon: Shield },
    { Component: CardExample4, name: '4. Diagonal Stripe', icon: Gem },
    { Component: CardExample5, name: '5. Top Highlight Bar', icon: Rocket },
    { Component: CardExample6, name: '6. Subtle Grid Pattern', icon: Crown },
    { Component: CardExample7, name: '7. Radial Glow', icon: Zap },
    { Component: CardExample8, name: '8. Double Border', icon: Star },
    { Component: CardExample9, name: '9. Shimmer Animation', icon: Shield },
    { Component: CardExample10, name: '10. Gradient Border', icon: Gem },
  ];

  return (
    <main className="min-h-screen py-20 px-4 sm:px-8" style={{ background: '#0a0a0f' }}>
      <div className="max-w-[1400px] mx-auto">
        <h1
          className="text-4xl md:text-5xl font-bold text-center mb-4"
          style={{ color: '#ffd700', fontFamily: 'var(--font-taskor)' }}
        >
          CyberCard Design Examples
        </h1>
        <p className="text-center mb-12" style={{ color: '#bfbdb0', opacity: 0.8 }}>
          10 variations blending GenericCard simplicity with subtle flare
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {examples.map(({ Component, name, icon }) => (
            <div key={name}>
              <p className="text-xs mb-2 font-mono" style={{ color: '#00bfff' }}>{name}</p>
              <Component>
                <SampleContent
                  icon={icon}
                  title="Feature Title"
                  description="Brief description of this amazing feature."
                />
              </Component>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm" style={{ color: '#bfbdb0', opacity: 0.6 }}>
            Hover over Example 3 to see the glow effect. Example 9 has a shimmer animation.
          </p>
        </div>
      </div>
    </main>
  );
}
