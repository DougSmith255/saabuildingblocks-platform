'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import confetti from 'canvas-confetti';

interface LeaderboardEntry {
  id: string;
  player_name: string;
  score: number;
  created_at: string;
}

interface DinoLeaderboardProps {
  currentScore: number;
  finalScore: number;
  gameState: 'menu' | 'playing' | 'gameover';
  onScoreSubmit?: (playerName: string) => Promise<void>;
  refreshTrigger?: number;
  onColorChange?: (color: string) => void; // New prop to notify parent of color changes
}

export default function DinoLeaderboard({
  currentScore,
  finalScore,
  gameState,
  onScoreSubmit,
  refreshTrigger = 0,
  onColorChange,
}: DinoLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [dyingScoreId, setDyingScoreId] = useState<string | null>(null);

  // Track previous position for confetti trigger detection
  const prevPositionRef = useRef<number | null>(null);

  // Fetch leaderboard on mount and when refresh trigger changes
  useEffect(() => {
    fetchLeaderboard();
  }, [refreshTrigger]);

  // Reset states when game restarts (only if user already submitted)
  // FIXED: Don't reset if name input is showing and user hasn't submitted
  // This prevents the input from disappearing when gameState changes to 'menu'
  useEffect(() => {
    if (gameState === 'menu' && hasSubmitted) {
      setHasSubmitted(false);
      setShowNameInput(false);
      setPlayerName('');
      setDyingScoreId(null);
      prevPositionRef.current = null;
    }
  }, [gameState, hasSubmitted]);

  // Calculate game over position for conditional rendering
  const gameOverPosition = useMemo(() => {
    if (gameState !== 'gameover' || finalScore === 0) return null;

    let position = leaderboard.findIndex(entry => finalScore > entry.score);
    if (position === -1 && leaderboard.length < 5) {
      position = leaderboard.length;
    } else if (position === -1) {
      return 999; // Doesn't qualify (beyond top 5)
    }

    const calculatedPosition = position + 1;
    console.log('[GAME OVER] Final score:', finalScore, 'Position:', calculatedPosition);
    return calculatedPosition;
  }, [gameState, finalScore, leaderboard]);

  // Show name input when game ends with a TOP 5 qualifying score
  useEffect(() => {
    if (gameState === 'gameover' && finalScore > 0 && !hasSubmitted) {
      const wouldQualify = leaderboard.length < 5 || finalScore > leaderboard[4]?.score;
      if (wouldQualify) {
        console.log('[NAME INPUT] Showing name input for top 5 score');
        setShowNameInput(true);
      } else {
        console.log('[NAME INPUT] Score does not qualify for top 5, no name input');
      }
    }
  }, [gameState, finalScore, hasSubmitted, leaderboard]);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/dino-high-scores');
      if (!response.ok) throw new Error('Failed to fetch leaderboard');

      const data = await response.json();
      if (data && data.scores) {
        setLeaderboard(data.scores);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  // Calculate live player position (FIXED: Added leaderboard dependency)
  const livePlayerPosition = useMemo(() => {
    if (gameState !== 'playing' || currentScore === 0) return null;

    let position = leaderboard.findIndex(entry => currentScore > entry.score);
    if (position === -1 && leaderboard.length < 5) {
      position = leaderboard.length;
    } else if (position === -1) {
      return null; // Not in top 5
    }

    console.log('[POSITION CALC] Current score:', currentScore, 'Position:', position + 1);
    return position + 1;
  }, [currentScore, leaderboard, gameState]);

  // Determine color based on position with new color scheme
  const getColorForPosition = (position: number | null) => {
    if (position === null) return 'default';
    if (position === 1) return 'diamond'; // 1st place: Diamond (cyan/prismatic)
    if (position === 2) return 'gold';     // 2nd place: Gold
    if (position === 3) return 'platinum'; // 3rd place: Platinum (silver-ish)
    return 'default';
  };

  const currentColor = getColorForPosition(livePlayerPosition);

  // Notify parent component when color changes (for ground line in DinoGame)
  useEffect(() => {
    if (onColorChange && currentColor !== 'default') {
      const colorMap = {
        diamond: '#00ffff',   // Bright cyan for 1st place
        gold: '#ffd700',      // Gold for 2nd place
        platinum: '#e5e4dd',  // Platinum/silver for 3rd place
      };
      onColorChange(colorMap[currentColor as keyof typeof colorMap] || 'rgba(55, 65, 81, 0.5)');
    } else if (onColorChange) {
      onColorChange('rgba(55, 65, 81, 0.5)'); // Default gray
    }
  }, [currentColor, onColorChange]);

  // Trigger confetti ONLY when crossing into 1st place (not when staying in 1st)
  useEffect(() => {
    const prevPosition = prevPositionRef.current;

    // Trigger confetti ONLY when transitioning from NOT-1st to 1st
    if (
      livePlayerPosition === 1 &&
      prevPosition !== 1 &&
      gameState === 'playing' &&
      !showConfetti
    ) {
      setShowConfetti(true);

      // Use canvas-confetti library for better effect
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 0,
        colors: ['#ffd700', '#00ffff', '#e5e4dd', '#00ff88']
      };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          setShowConfetti(false);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        // Burst from left and right sides
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);
    }

    // Update the ref to current position for next comparison
    prevPositionRef.current = livePlayerPosition;
  }, [livePlayerPosition, gameState]);

  // Create merged leaderboard with live score inserted at correct position
  const mergedLeaderboard = useMemo(() => {
    // Show live entry during playing OR during gameover (until submitted)
    const shouldShowLiveEntry =
      (gameState === 'playing' && currentScore > 0) ||
      (gameState === 'gameover' && finalScore > 0 && !hasSubmitted);

    if (!shouldShowLiveEntry) {
      return leaderboard.slice(0, 5); // Only show top 5 when not playing
    }

    // Use finalScore for gameover, currentScore for playing
    const scoreToUse = gameState === 'gameover' ? finalScore : currentScore;

    // Calculate position for the score
    let position = leaderboard.findIndex(entry => scoreToUse > entry.score);
    if (position === -1 && leaderboard.length < 5) {
      position = leaderboard.length; // Goes at end if board not full
    } else if (position === -1) {
      // Score doesn't beat top 5, show as 6th place during playing
      if (gameState === 'playing') {
        const merged = [...leaderboard.slice(0, 5)];
        const liveEntry: LeaderboardEntry = {
          id: 'live-player',
          player_name: 'YOU',
          score: scoreToUse,
          created_at: new Date().toISOString(),
        };
        merged.push(liveEntry); // Add as 6th place
        return merged;
      } else {
        // During gameover, show as 6th even if doesn't qualify
        const merged = [...leaderboard.slice(0, 5)];
        const liveEntry: LeaderboardEntry = {
          id: 'live-player',
          player_name: 'YOU',
          score: scoreToUse,
          created_at: new Date().toISOString(),
        };
        merged.push(liveEntry);
        return merged;
      }
    }

    const merged = [...leaderboard.slice(0, 5)];
    const liveEntry: LeaderboardEntry = {
      id: 'live-player',
      player_name: 'YOU',
      score: scoreToUse,
      created_at: new Date().toISOString(),
    };

    // Insert live entry at correct position within top 5
    merged.splice(position, 0, liveEntry);

    // Check if 5th place will be knocked off (only during playing)
    if (gameState === 'playing' && merged.length > 5 && merged[5].id !== 'live-player') {
      const dyingScore = merged[5];
      if (dyingScore.id !== dyingScoreId) {
        setDyingScoreId(dyingScore.id);
        setTimeout(() => setDyingScoreId(null), 1000);
      }
    }

    // Return top 5 + dying score OR top 6 if live entry is at 6th
    return merged.slice(0, dyingScoreId ? 6 : (merged[5]?.id === 'live-player' ? 6 : 5));
  }, [currentScore, finalScore, leaderboard, gameState, livePlayerPosition, dyingScoreId, hasSubmitted]);

  const handleSubmitScore = async () => {
    if (!playerName.trim() || isSubmitting || hasSubmitted) return;

    setIsSubmitting(true);
    console.log('[SUBMIT] Submitting score:', finalScore, 'Name:', playerName.trim());

    try {
      if (onScoreSubmit) {
        await onScoreSubmit(playerName.trim());
      }

      console.log('[SAVE SUCCESS] Score saved successfully');
      setHasSubmitted(true);
      setShowNameInput(false);
    } catch (error) {
      console.error('[SUBMIT ERROR] Error submitting score:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Play Again (restart game after successful save)
  const handlePlayAgain = () => {
    console.log('[PLAY AGAIN] User clicked Play Again, reloading page');
    window.location.reload();
  };

  // Handle Try Again (for non-top-5 scores)
  const handleTryAgain = () => {
    console.log('[TRY AGAIN] User clicked Try Again, reloading page');
    window.location.reload();
  };

  // Global SPACE key listener for PLAY AGAIN / TRY AGAIN
  useEffect(() => {
    const handleSpaceKeyPress = (e: KeyboardEvent) => {
      // Only handle SPACE key when game is over
      if (gameState !== 'gameover') return;

      // Don't trigger if user is typing in input field
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();

        // PLAY AGAIN: If user has submitted (top 5 score)
        if (hasSubmitted) {
          handlePlayAgain();
        }
        // TRY AGAIN: If score doesn't qualify for top 5
        else if (gameOverPosition !== null && gameOverPosition >= 5) {
          handleTryAgain();
        }
      }
    };

    window.addEventListener('keydown', handleSpaceKeyPress);
    return () => window.removeEventListener('keydown', handleSpaceKeyPress);
  }, [gameState, hasSubmitted, gameOverPosition]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmitScore();
    }
  };

  // Get color classes for leaderboard background with new color scheme
  const getBackgroundColor = () => {
    if (currentColor === 'diamond') return 'bg-gradient-to-b from-[#00ffff]/20 to-transparent';
    if (currentColor === 'gold') return 'bg-gradient-to-b from-[#ffd700]/20 to-transparent';
    if (currentColor === 'platinum') return 'bg-gradient-to-b from-[#e5e4dd]/20 to-transparent';
    return '';
  };

  const getBorderColor = () => {
    if (currentColor === 'diamond') return 'border-[#00ffff] shadow-[0_0_20px_rgba(0,255,255,0.5)]';
    if (currentColor === 'gold') return 'border-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.4)]';
    if (currentColor === 'platinum') return 'border-[#e5e4dd] shadow-[0_0_15px_rgba(229,228,221,0.4)]';
    return 'border-[#dcdbd5]/30';
  };

  return (
    <div className="relative w-full max-w-md min-w-[300px] mx-auto">
      {/* Leaderboard */}
      <div className={`border-2 ${getBorderColor()} rounded-lg bg-black/40 backdrop-blur-sm overflow-hidden transition-all duration-500 ${getBackgroundColor()}`}>
        <LayoutGroup>
          <AnimatePresence mode="popLayout">
            {mergedLeaderboard.length === 0 && gameState !== 'playing' ? (
              <div className="p-8 text-center">
                <div className="text-[#dcdbd5]/50 font-['Synonym'] text-lg">
                  No scores yet. Be the first!
                </div>
              </div>
            ) : (
              mergedLeaderboard.map((entry, index) => {
                const isLive = entry.id === 'live-player';
                const isDying = entry.id === dyingScoreId;
                const isEditing = showNameInput && gameState === 'gameover' && isLive;

                return (
                  <motion.div
                    key={entry.id}
                    layout
                    layoutId={entry.id}
                    initial={{ opacity: isLive ? 0 : 1, y: isLive ? 50 : 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={isDying ? {
                      scale: [1, 1.2, 0],
                      rotate: [0, 10, 45],
                      opacity: [1, 0.5, 0],
                    } : { opacity: 0 }}
                    transition={{
                      layout: { duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: index * 0.02 },
                      opacity: { duration: 0.3 },
                      scale: { duration: 1.0 },
                      rotate: { duration: 1.0 },
                    }}
                    className={`border-b border-[#dcdbd5]/20 ${
                      !isLive && index === 0 ? 'bg-[#00ffff]/10' :
                      !isLive && index === 1 ? 'bg-[#ffd700]/10' :
                      !isLive && index === 2 ? 'bg-[#e5e4dd]/10' : ''
                    }`}
                  >
                    {isEditing ? (
                      // Inline editing for game over
                      <div className="px-4 py-3 bg-[#00ff88]/10">
                        <div className="flex items-center gap-2">
                          <div className={`font-['Taskor'] font-bold text-4xl w-16 flex-shrink-0 text-[#00ff88] ${
                            index === 0 ? 'glow-diamond' :
                            index === 1 ? 'glow-gold' :
                            index === 2 ? 'glow-platinum' : ''
                          }`}>
                            {index + 1}.
                          </div>
                          <input
                            type="text"
                            placeholder="Your name"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            onKeyPress={handleKeyPress}
                            maxLength={20}
                            disabled={isSubmitting}
                            autoFocus
                            className="flex-1 px-3 py-2 bg-black/50 border border-[#00ff88] rounded text-[#dcdbd5] font-['Synonym'] text-base placeholder-[#dcdbd5]/50 focus:border-[#00ff88] focus:outline-none focus:ring-1 focus:ring-[#00ff88] disabled:opacity-50"
                          />
                          <div className="text-display font-bold text-[#00ff88] text-3xl tabular-nums">
                            {finalScore.toLocaleString()}
                          </div>
                        </div>
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={handleSubmitScore}
                            disabled={!playerName.trim() || isSubmitting}
                            className="px-4 py-1.5 bg-[#00ff88] hover:bg-[#00ff88]/90 disabled:bg-[#dcdbd5]/30 disabled:cursor-not-allowed text-black font-['Synonym'] font-bold text-sm rounded transition-all"
                          >
                            {isSubmitting ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Normal score display
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-1 flex-1 min-w-0">
                          <div
                            className={`font-['Taskor'] font-bold text-4xl w-12 flex-shrink-0
                              ${isLive ? (
                                currentColor === 'diamond' ? 'text-[#00ffff] glow-diamond' :
                                currentColor === 'gold' ? 'text-[#ffd700] glow-gold' :
                                currentColor === 'platinum' ? 'text-[#e5e4dd] glow-platinum' :
                                'text-[#00ff88]'
                              ) : (
                                index === 0 ? 'text-[#00ffff] glow-diamond' :
                                index === 1 ? 'text-[#ffd700] glow-gold' :
                                index === 2 ? 'text-[#e5e4dd] glow-platinum' :
                                'text-[#dcdbd5]'
                              )}`}
                          >
                            {isLive ? (livePlayerPosition ? `${livePlayerPosition}.` : '—') : `${index + 1}.`}
                          </div>
                          <div className={`font-['Synonym'] text-lg truncate ${isLive ? 'text-[#00ff88] font-bold animate-pulse' : 'text-[#dcdbd5]'}`}>
                            {entry.player_name}
                          </div>
                        </div>
                        <div className="text-display font-bold text-[#00ff88] text-3xl tabular-nums ml-4">
                          {entry.score.toLocaleString()}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}

            {/* Success message + PLAY AGAIN button after submission (TOP 5) */}
            {hasSubmitted && gameState === 'gameover' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 bg-[#00ff88]/10 border-t-2 border-[#00ff88] text-center"
              >
                <div className="text-[#00ff88] font-['Orbitron'] font-bold text-base mb-3">
                  {gameOverPosition === 1 ? '🏆 NEW HIGH SCORE! 🏆' : '✅ Score Saved!'}
                </div>
                <button
                  onClick={handlePlayAgain}
                  className="px-6 py-2 bg-[#ffd700] hover:bg-[#ffd700]/90 text-black font-['Orbitron'] font-bold text-sm rounded transition-all"
                >
                  PLAY AGAIN (SPACE)
                </button>
              </motion.div>
            )}

            {/* TRY AGAIN button for non-top-5 scores (FIXED: Show when position >= 5) */}
            {gameState === 'gameover' && gameOverPosition !== null && gameOverPosition >= 5 && !hasSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 bg-[#dcdbd5]/10 border-t-2 border-[#dcdbd5]/30 text-center"
              >
                <div className="text-[#dcdbd5] font-['Synonym'] text-base mb-3">
                  Score: {finalScore.toLocaleString()} - Keep trying for top 5!
                </div>
                <button
                  onClick={handleTryAgain}
                  className="px-6 py-2 bg-[#dcdbd5] hover:bg-[#dcdbd5]/90 text-black font-['Orbitron'] font-bold text-sm rounded transition-all"
                >
                  TRY AGAIN (SPACE)
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .animate-confetti {
          animation: confetti linear forwards;
        }

        /* Glow effects for medals */
        .glow-diamond {
          text-shadow:
            0 0 10px rgba(0, 255, 255, 0.8),
            0 0 20px rgba(0, 255, 255, 0.6),
            0 0 30px rgba(0, 255, 255, 0.4),
            0 0 40px rgba(0, 255, 255, 0.2);
        }

        .glow-platinum {
          text-shadow:
            0 0 10px rgba(229, 228, 221, 0.8),
            0 0 20px rgba(229, 228, 221, 0.6),
            0 0 30px rgba(229, 228, 221, 0.4),
            0 0 40px rgba(229, 228, 221, 0.2);
        }

        .glow-gold {
          text-shadow:
            0 0 10px rgba(255, 215, 0, 0.8),
            0 0 20px rgba(255, 215, 0, 0.6),
            0 0 30px rgba(255, 215, 0, 0.4),
            0 0 40px rgba(255, 215, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
