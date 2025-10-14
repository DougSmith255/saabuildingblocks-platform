'use client';

import { useState } from 'react';
import Link from 'next/link';
import StarBackground from '@/components/StarBackground';
import TRexRunner from '@/components/games/TRexRunner';

export default function NotFound() {
  const [showInstructions, setShowInstructions] = useState(true);
  const [highScore, setHighScore] = useState(0);

  const handleGameOver = (score: number) => {
    if (score > highScore) {
      setHighScore(score);
    }
  };

  const handleScoreUpdate = (_score: number) => {
    // Score updates are handled internally by the game component
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Star Background */}
      <StarBackground />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">

        {/* Static 404 Text - Taskor font, tight glow, no animation */}
        <h1
          className="text-[20rem] md:text-[30rem] font-['var(--font-taskor)'] leading-none mb-8"
          style={{
            background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffa500 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 25px rgba(255, 215, 0, 0.4))',
            textShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
          }}
        >
          404
        </h1>

        {/* T-Rex Game Container */}
        <div className="relative mb-8 w-full max-w-3xl">
          <TRexRunner
            onGameOver={handleGameOver}
            onScoreUpdate={handleScoreUpdate}
          />
        </div>

        {/* High Score Display */}
        {highScore > 0 && (
          <div
            className="mb-6 px-6 py-3 rounded-xl"
            style={{
              background: 'rgba(26, 26, 26, 0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
            }}
          >
            <p className="text-lg text-white/80">
              High Score: <span className="text-gold-500 font-bold">{highScore}</span>
            </p>
          </div>
        )}

        {/* Instructions Panel */}
        {showInstructions && (
          <div
            className="mb-8 px-8 py-6 rounded-2xl max-w-md relative"
            style={{
              background: 'rgba(26, 26, 26, 0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}
          >
            <button
              onClick={() => setShowInstructions(false)}
              className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
              aria-label="Close instructions"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-display text-xl font-bold text-gold-500 mb-4">
              How to Play
            </h3>
            <ul className="space-y-2 text-white/80">
              <li className="flex items-start">
                <span className="text-gold-500 mr-2">•</span>
                <span>Press SPACEBAR or click to jump</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold-500 mr-2">•</span>
                <span>Avoid cacti and flying birds</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold-500 mr-2">•</span>
                <span>Game speed increases over time</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold-500 mr-2">•</span>
                <span>Beat your high score!</span>
              </li>
            </ul>
          </div>
        )}

        {/* Home Button */}
        <Link
          href="/"
          className="text-display px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105 hover:shadow-2xl"
          style={{
            background: 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '2px solid rgba(255, 215, 0, 0.4)',
            boxShadow: '0 4px 24px rgba(255, 215, 0, 0.2)',
            color: '#ffd700',
          }}
        >
          Return Home
        </Link>

      </div>
    </div>
  );
}
