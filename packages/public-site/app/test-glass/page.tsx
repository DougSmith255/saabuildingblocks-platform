'use client';

import React from 'react';

/**
 * Test page with 10 animated neon-lit emerald glass effects
 */
export default function TestGlassPage() {
  return (
    <main className="min-h-screen bg-black py-20 px-8">
      <h1 className="text-4xl font-bold text-white text-center mb-12">
        Animated Neon Emerald Glass Effects
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* 1. Pulsing Glow */}
        <div className="relative">
          <h2 className="text-white mb-4 text-xl">1. Pulsing Glow</h2>
          <div
            className="rounded-3xl p-8 relative overflow-hidden"
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              animation: 'pulseGlow 2s ease-in-out infinite',
            }}
          >
            <p className="text-white/80">Content goes here</p>
          </div>
        </div>

        {/* 2. Sweeping Light */}
        <div className="relative">
          <h2 className="text-white mb-4 text-xl">2. Sweeping Light</h2>
          <div
            className="rounded-3xl p-8 relative overflow-hidden"
            style={{
              background: 'rgba(16, 185, 129, 0.12)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.4) 50%, transparent 100%)',
                animation: 'sweepLight 3s ease-in-out infinite',
              }}
            />
            <p className="text-white/80 relative z-10">Content goes here</p>
          </div>
        </div>

        {/* 3. Border Glow Pulse */}
        <div className="relative">
          <h2 className="text-white mb-4 text-xl">3. Border Glow Pulse</h2>
          <div
            className="rounded-3xl p-8 relative overflow-hidden"
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              backdropFilter: 'blur(12px)',
              animation: 'borderPulse 2s ease-in-out infinite',
            }}
          >
            <p className="text-white/80">Content goes here</p>
          </div>
        </div>

        {/* 4. Rotating Gradient Border */}
        <div className="relative">
          <h2 className="text-white mb-4 text-xl">4. Rotating Gradient Border</h2>
          <div className="relative rounded-3xl p-[2px]" style={{ animation: 'rotateBorder 4s linear infinite' }}>
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'conic-gradient(from 0deg, transparent, rgba(16, 185, 129, 0.8), transparent, rgba(16, 185, 129, 0.8), transparent)',
                animation: 'rotateBorder 4s linear infinite',
              }}
            />
            <div
              className="rounded-3xl p-8 relative"
              style={{
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <p className="text-white/80">Content goes here</p>
            </div>
          </div>
        </div>

        {/* 5. Breathing Inner Glow */}
        <div className="relative">
          <h2 className="text-white mb-4 text-xl">5. Breathing Inner Glow</h2>
          <div
            className="rounded-3xl p-8 relative overflow-hidden"
            style={{
              background: 'rgba(16, 185, 129, 0.08)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
                animation: 'breathe 3s ease-in-out infinite',
              }}
            />
            <p className="text-white/80 relative z-10">Content goes here</p>
          </div>
        </div>

        {/* 6. Neon Flicker */}
        <div className="relative">
          <h2 className="text-white mb-4 text-xl">6. Neon Flicker</h2>
          <div
            className="rounded-3xl p-8 relative overflow-hidden"
            style={{
              background: 'rgba(16, 185, 129, 0.12)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.3), inset 0 0 20px rgba(16, 185, 129, 0.1)',
              animation: 'neonFlicker 0.1s ease-in-out infinite alternate',
            }}
          >
            <p className="text-white/80">Content goes here</p>
          </div>
        </div>

        {/* 7. Shimmer Effect */}
        <div className="relative">
          <h2 className="text-white mb-4 text-xl">7. Shimmer Effect</h2>
          <div
            className="rounded-3xl p-8 relative overflow-hidden"
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(120deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%)',
                animation: 'shimmer 2.5s ease-in-out infinite',
              }}
            />
            <p className="text-white/80 relative z-10">Content goes here</p>
          </div>
        </div>

        {/* 8. Edge Glow Trail */}
        <div className="relative">
          <h2 className="text-white mb-4 text-xl">8. Edge Glow Trail</h2>
          <div
            className="rounded-3xl p-8 relative overflow-hidden"
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                border: '2px solid transparent',
                background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.8), transparent, transparent, rgba(16, 185, 129, 0.8)) border-box',
                WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                animation: 'edgeTrail 3s linear infinite',
              }}
            />
            <p className="text-white/80 relative z-10">Content goes here</p>
          </div>
        </div>

        {/* 9. Multi-layer Glow */}
        <div className="relative">
          <h2 className="text-white mb-4 text-xl">9. Multi-layer Glow</h2>
          <div
            className="rounded-3xl p-8 relative overflow-hidden"
            style={{
              background: 'rgba(16, 185, 129, 0.08)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
            }}
          >
            <div
              className="absolute -inset-4 rounded-3xl pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at top left, rgba(16, 185, 129, 0.4) 0%, transparent 50%)',
                animation: 'multiGlow1 4s ease-in-out infinite',
              }}
            />
            <div
              className="absolute -inset-4 rounded-3xl pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at bottom right, rgba(16, 185, 129, 0.4) 0%, transparent 50%)',
                animation: 'multiGlow2 4s ease-in-out infinite',
              }}
            />
            <p className="text-white/80 relative z-10">Content goes here</p>
          </div>
        </div>

        {/* 10. Aurora Wave */}
        <div className="relative">
          <h2 className="text-white mb-4 text-xl">10. Aurora Wave</h2>
          <div
            className="rounded-3xl p-8 relative overflow-hidden"
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.3), rgba(52, 211, 153, 0.2), rgba(16, 185, 129, 0.3), rgba(6, 95, 70, 0.3))',
                backgroundSize: '400% 400%',
                animation: 'aurora 6s ease infinite',
              }}
            />
            <p className="text-white/80 relative z-10">Content goes here</p>
          </div>
        </div>

      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.3), 0 0 40px rgba(16, 185, 129, 0.2), inset 0 0 30px rgba(16, 185, 129, 0.1);
          }
          50% {
            box-shadow: 0 0 40px rgba(16, 185, 129, 0.5), 0 0 80px rgba(16, 185, 129, 0.3), inset 0 0 50px rgba(16, 185, 129, 0.2);
          }
        }

        @keyframes sweepLight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes borderPulse {
          0%, 100% {
            box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.3), 0 0 20px rgba(16, 185, 129, 0.2);
          }
          50% {
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.5), 0 0 40px rgba(16, 185, 129, 0.4);
          }
        }

        @keyframes rotateBorder {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes breathe {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }

        @keyframes neonFlicker {
          0%, 18%, 22%, 25%, 53%, 57%, 100% {
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.4), 0 0 40px rgba(16, 185, 129, 0.3), inset 0 0 20px rgba(16, 185, 129, 0.15);
          }
          20%, 24%, 55% {
            box-shadow: 0 0 5px rgba(16, 185, 129, 0.2), 0 0 10px rgba(16, 185, 129, 0.1), inset 0 0 5px rgba(16, 185, 129, 0.05);
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(15deg); }
          100% { transform: translateX(200%) rotate(15deg); }
        }

        @keyframes edgeTrail {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        @keyframes multiGlow1 {
          0%, 100% { opacity: 0.5; transform: translate(-10%, -10%); }
          50% { opacity: 1; transform: translate(10%, 10%); }
        }

        @keyframes multiGlow2 {
          0%, 100% { opacity: 1; transform: translate(10%, 10%); }
          50% { opacity: 0.5; transform: translate(-10%, -10%); }
        }

        @keyframes aurora {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </main>
  );
}
