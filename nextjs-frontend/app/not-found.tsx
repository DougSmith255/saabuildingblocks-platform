'use client';

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import StarBackground from '@/components/StarBackground';
import { CTAButton } from '@/components/saa';
import type { GameState } from '@/components/games/DinoGame';

// Dynamic import DinoGame to avoid SSR issues with Image during build
const DinoGame = dynamic(() => import('@/components/games/DinoGame'), {
  ssr: false,
  loading: () => <div className="text-center py-20 text-[#dcdbd5]">Loading game...</div>
});

// Dynamic import DinoLeaderboard with explicit default resolution
const DinoLeaderboard = dynamic(
  () => import('@/components/games/DinoLeaderboard').then(mod => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="text-center py-8">
        <p className="text-[#dcdbd5] font-['Synonym'] text-lg">Loading leaderboard...</p>
      </div>
    ),
  }
);

export default function NotFound() {
  const [currentScore, setCurrentScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>('menu');
  const [refreshLeaderboard, setRefreshLeaderboard] = useState(0);
  const [groundColor, setGroundColor] = useState('rgba(55, 65, 81, 0.5)');

  // Handle score changes during gameplay
  const handleScoreChange = useCallback((score: number) => {
    setCurrentScore(score);
  }, []);

  // Handle game state changes
  const handleGameStateChange = useCallback((state: GameState) => {
    setGameState(state);
  }, []);

  // Handle game over
  const handleGameOver = useCallback((score: number) => {
    setFinalScore(score);
  }, []);

  // Handle score submission from leaderboard
  const handleScoreSubmit = useCallback(async (playerName: string) => {
    try {
      const response = await fetch('/api/dino-high-scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player_name: playerName,
          score: finalScore,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit score');
      }

      // Refresh leaderboard after successful submission
      setRefreshLeaderboard(prev => prev + 1);
    } catch (error) {
      console.error('Error submitting score:', error);
      throw error;
    }
  }, [finalScore]);

  // Handle ground color changes from leaderboard
  const handleColorChange = useCallback((color: string) => {
    setGroundColor(color);
  }, []);

  useEffect(() => {
    // Disable arrow key and spacebar scrolling on 404 page only
    const preventArrowScroll = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', preventArrowScroll);
    return () => {
      window.removeEventListener('keydown', preventArrowScroll);
      document.body.classList.remove('is-404-page');
    };
  }, []);

  return (
    <>
      {/* Inline script to set 404 class BEFORE any React rendering */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.body.classList.add('is-404-page');`,
        }}
      />
      <div className="relative min-h-screen w-full overflow-hidden">
        {/* Star Background */}
        <StarBackground />

      {/* Main Content */}
      <div id="main-content" className="relative z-10 flex flex-col items-center justify-center min-h-screen px-2 sm:px-4 py-8 sm:py-12 pt-12 sm:pt-16">

        {/* RESTORED: Original 404 Display - 3D Neon with Yellow Gold Glow & Flickering */}
        <div className="text-center mb-4 sm:mb-6" style={{ perspective: '1000px' }}>
          <h1
            className="text-display font-bold mb-2"
            style={{
              fontSize: 'min(30vw, 400px)',
              whiteSpace: 'nowrap',
              transformStyle: 'preserve-3d',
              transform: 'rotateX(15deg)',
            }}
          >
            {/* First 4 - tilted counterclockwise for broken look */}
            <span className="neon-char" data-char="4" style={{
              animation: 'neonFlicker1 4s infinite alternate',
              transform: 'rotateZ(-8deg)',
              display: 'inline-block'
            }}>4</span>
            {/* Slanted broken Ø - tilted counterclockwise */}
            <span className="neon-char neon-char-middle" data-char="Ø" style={{
              animation: 'neonFlicker2 3.5s infinite alternate',
              transform: 'rotateZ(-22deg)',
              display: 'inline-block'
            }}>Ø</span>
            {/* Second 4 - tilted clockwise for broken look */}
            <span className="neon-char" data-char="4" style={{
              animation: 'neonFlicker3 5s infinite alternate',
              transform: 'rotateZ(8deg)',
              display: 'inline-block'
            }}>4</span>
          </h1>
          {/* Tagline Section - Two lines with different effects */}
          <div className="text-center mt-4 sm:mt-6" style={{ perspective: '1000px' }}>
            {/* Line 1: "You've drifted off course, Captain." with 3D effect + glow */}
            <p
              className="text-tagline mb-0.5 sm:mb-1"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'rotateX(15deg) translateZ(20px)',
                color: '#dcdbd5',
                textShadow: `
                  -1px -1px 0 rgba(255,255,255, 0.4),
                  1px -1px 0 rgba(255,255,255, 0.4),
                  -1px 1px 0 rgba(255,255,255, 0.4),
                  1px 1px 0 rgba(255,255,255, 0.4),
                  0 -2px 8px #dcdbd5,
                  0 0 2px #dcdbd5,
                  0 0 5px #dcdbd5,
                  0 0 15px rgba(220,219,213,0.5),
                  0 0 2px #dcdbd5,
                  0 2px 3px #000
                `,
              }}
            >
              You&apos;ve drifted off course, Captain.
            </p>

            {/* Line 2: "This page doesn't exist in this galaxy." with body text styling */}
            <p className="text-body text-center">
              This page doesn&apos;t exist in this galaxy.
            </p>
          </div>
        </div>

        {/* RESTORED: GO HOME Button - Centered below tagline */}
        <div className="mt-6 sm:mt-8 mb-8 sm:mb-12">
          <CTAButton href="/">
            GO HOME
          </CTAButton>
        </div>

        {/* Full Featured Dino Game with Leaderboard - Responsive: leaderboard first on mobile, side-by-side on desktop */}
        {/* Hide leaderboard until game starts (gameState !== 'menu'), center dino game horizontally when hidden */}
        <div className={`relative mb-4 sm:mb-8 w-full flex flex-col xl:flex-row items-center ${gameState === 'menu' ? 'justify-center' : 'justify-center'} mt-8 sm:mt-12 gap-6 xl:gap-8 -mx-2 sm:mx-0`}>
          {/* Leaderboard - Hidden until game starts */}
          {gameState !== 'menu' && (
            <div className="flex-shrink-0 w-full xl:w-auto flex justify-center px-2 sm:px-0 xl:order-2">
              <DinoLeaderboard
                currentScore={currentScore}
                finalScore={finalScore}
                gameState={gameState}
                onScoreSubmit={handleScoreSubmit}
                refreshTrigger={refreshLeaderboard}
                onColorChange={handleColorChange}
              />
            </div>
          )}
          {/* Dino game - Centered horizontally when leaderboard is hidden */}
          <div className="flex-shrink-0 w-[calc(90vw)] xl:w-auto flex justify-center px-0 sm:px-0 xl:order-1">
            <div className="w-full xl:max-w-[clamp(300px,39.02vw,800px)]">
              <DinoGame
                onScoreChange={handleScoreChange}
                onGameStateChange={handleGameStateChange}
                onGameOver={handleGameOver}
                groundColor={groundColor}
              />
            </div>
          </div>
        </div>

      </div>

      {/* RESTORED: CSS Animations - Original Yellow Gold Neon Effects */}
      <style jsx>{`
        /* Grain texture overlay */
        .relative.min-h-screen.w-full.overflow-hidden::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E");
          opacity: 0.15;
          pointer-events: none;
          z-index: 1;
          mix-blend-mode: overlay;
        }

        /* RESTORED: Flicker effect based on texteffects.dev technique */
        @keyframes neonFlicker1 {
          0%, 19.9%, 22%, 62.9%, 64%, 64.9%, 70%, 100% {
            color: #ffd700;
            opacity: 0.99;
            text-shadow:
              -1px -1px 0 rgba(255,255,255, 0.4),
              1px -1px 0 rgba(255,255,255, 0.4),
              -1px 1px 0 rgba(255,255,255, 0.4),
              1px 1px 0 rgba(255,255,255, 0.4),
              0 -2px 8px #ffd700,
              0 0 2px #ffd700,
              0 0 5px #ffd700,
              0 0 8px #ffb347,
              0 2px 3px #000;
          }
          20%, 21.9%, 63%, 63.9%, 65%, 69.9% {
            color: rgba(45,45,45,1);
            opacity: 0.4;
            text-shadow: none;
          }
        }

        @keyframes neonFlicker2 {
          0%, 18%, 21%, 60%, 63%, 66%, 72%, 100% {
            color: #ffd700;
            opacity: 0.99;
            text-shadow:
              -1px -1px 0 rgba(255,255,255, 0.4),
              1px -1px 0 rgba(255,255,255, 0.4),
              -1px 1px 0 rgba(255,255,255, 0.4),
              1px 1px 0 rgba(255,255,255, 0.4),
              0 -2px 8px #ffd700,
              0 0 2px #ffd700,
              0 0 5px #ffd700,
              0 0 8px #ffb347,
              0 2px 3px #000;
          }
          19%, 20%, 61%, 62%, 64%, 65%, 71% {
            color: rgba(45,45,45,1);
            opacity: 0.4;
            text-shadow: none;
          }
        }

        @keyframes neonFlicker3 {
          0%, 21%, 23%, 64%, 66%, 68%, 74%, 100% {
            color: #ffd700;
            opacity: 0.99;
            text-shadow:
              -1px -1px 0 rgba(255,255,255, 0.4),
              1px -1px 0 rgba(255,255,255, 0.4),
              -1px 1px 0 rgba(255,255,255, 0.4),
              1px 1px 0 rgba(255,255,255, 0.4),
              0 -2px 8px #ffd700,
              0 0 2px #ffd700,
              0 0 5px #ffd700,
              0 0 8px #ffb347,
              0 2px 3px #000;
          }
          22%, 22.5%, 65%, 65.5%, 67%, 67.5%, 73% {
            color: rgba(45,45,45,1);
            opacity: 0.4;
            text-shadow: none;
          }
        }

        /* RESTORED: 3D Neon Character Structure */
        .neon-char {
          position: relative;
          display: inline-block;
          transform-style: preserve-3d;
        }

        /* RESTORED: Metal backing plate - SOLID 3D metal casing with chrome finish */
        .neon-char::before {
          content: attr(data-char);
          position: absolute;
          top: 2px;
          left: 2px;
          width: 100%;
          height: 100%;
          background: linear-gradient(145deg,
            #5a5240 0%,
            #4a4238 15%,
            #3a3228 35%,
            #2a2218 50%,
            #3a3228 65%,
            #4a4238 85%,
            #5a5240 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          z-index: -2;
          transform: translateZ(-25px);
          opacity: 1.0;
          text-shadow:
            1px 1px 0 #2a2a2a,
            2px 2px 0 #1a1a1a,
            3px 3px 0 #0f0f0f,
            4px 4px 0 #0a0a0a,
            5px 5px 0 #050505,
            -1px -1px 0 #4a4a4a,
            -1px 0 0 #3a3a3a,
            0 -1px 0 #3a3a3a,
            6px 6px 12px rgba(0,0,0,0.9),
            8px 8px 20px rgba(0,0,0,0.8),
            10px 10px 30px rgba(0,0,0,0.6);
          filter: contrast(1.1) brightness(1.05);
          pointer-events: none;
        }

        /* RESTORED: Main letter - dark gray (backlit look) */
        .neon-char {
          color: rgba(45,45,45,1);
          text-shadow:
            1px 1px 0 #1a1a1a,
            2px 2px 0 #0f0f0f,
            3px 3px 0 #0a0a0a,
            4px 4px 0 #050505,
            5px 5px 12px rgba(0, 0, 0, 0.8);
        }

      `}</style>
      </div>
    </>
  );
}
