'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DinoGame, { GameState } from './DinoGame';
import { createClient } from '@/lib/supabase/client';

interface LeaderboardEntry {
  id: string;
  player_name: string;
  score: number;
  created_at: string;
}

export default function DinoGameWithLeaderboard() {
  const supabase = createClient();

  // Game state
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentScore, setCurrentScore] = useState(0);

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);

  // Game over state - persists score and position
  const [gameOverScore, setGameOverScore] = useState<number | null>(null);
  const [gameOverPosition, setGameOverPosition] = useState<number | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [savedPlayerName, setSavedPlayerName] = useState('');

  // Image preloading state
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload all dinosaur images
  useEffect(() => {
    const images = [
      '/games/dino/DinoRun1.png',
      '/games/dino/DinoRun2.png',
      '/games/dino/DinoDuck1.png',
      '/games/dino/DinoDuck2.png',
      '/games/dino/DinoJump.png',
      '/games/dino/DinoStart.png',
      '/games/dino/SmallCactus1.png',
      '/games/dino/SmallCactus2.png',
      '/games/dino/SmallCactus3.png',
      '/games/dino/LargeCactus1.png',
      '/games/dino/LargeCactus2.png',
      '/games/dino/LargeCactus3.png',
      '/games/dino/Bird1.png',
      '/games/dino/Bird2.png'
    ];

    let loadedCount = 0;
    const totalImages = images.length;

    const loadPromises = images.map(src => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          resolve();
        };
        img.onerror = () => {
          console.warn(`Failed to load image: ${src}`);
          loadedCount++;
          resolve(); // Still resolve to not block
        };
        img.src = src;
      });
    });

    Promise.all(loadPromises).then(() => {
      console.log(`Loaded ${loadedCount}/${totalImages} images`);
      setImagesLoaded(true);
    });
  }, []);

  // Load leaderboard from Supabase
  const loadLeaderboard = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('dino_high_scores')
        .select('id, player_name, score, created_at')
        .order('score', { ascending: false })
        .limit(5);

      if (error) throw error;
      setLeaderboard(data || []);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setLeaderboard([]);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  // Calculate position of a score in leaderboard
  const calculatePosition = useCallback((score: number): number => {
    // If leaderboard has less than 5 entries, any score makes it
    if (leaderboard.length < 5) {
      for (let i = 0; i < leaderboard.length; i++) {
        if (score > leaderboard[i].score) {
          return i;
        }
      }
      return leaderboard.length; // Position at the end if lower than all existing
    }

    // Leaderboard has 5 entries - check if score beats any of them
    for (let i = 0; i < leaderboard.length; i++) {
      if (score > leaderboard[i].score) {
        return i; // Position where it would be inserted
      }
    }
    
    // Score doesn't beat any of the top 5
    return 5; // Position 5 means it didn't make top 5
  }, [leaderboard]);

  // Calculate the position ONCE when game ends, outside useMemo
  // FIX: Also depend on leaderboard to recalculate when leaderboard changes
  useEffect(() => {
    if (gameOverScore !== null && leaderboard.length >= 0) {
      const position = calculatePosition(gameOverScore);
      console.log('[POSITION CALC] Score:', gameOverScore, '| Position:', position, '| Makes top 5:', position < 5, '| Leaderboard length:', leaderboard.length);
      setGameOverPosition(position);
    }
  }, [gameOverScore, leaderboard, calculatePosition]);

  // Merged leaderboard with current game score - ALWAYS MAX 5 ENTRIES
  const mergedLeaderboard = useMemo(() => {
    // During playing: show live score if it would make top 5
    if (gameState === 'playing' && currentScore > 0) {
      const merged = [...leaderboard];
      const position = calculatePosition(currentScore);

      // Only show current score if it would make top 5
      if (position < 5) {
        merged.splice(position, 0, {
          id: 'current-game',
          player_name: 'PLAYING...',
          score: currentScore,
          created_at: new Date().toISOString()
        });

        // CRITICAL: Always limit to exactly 5 entries
        return merged.slice(0, 5);
      }

      // Current score doesn't make top 5, show regular leaderboard
      return merged.slice(0, 5);
    }

    // During gameover: show gameOverScore with name input if it makes top 5
    // Use the pre-calculated gameOverPosition to avoid race conditions
    if (gameOverScore !== null && gameOverPosition !== null && gameOverPosition < 5) {
      const merged = [...leaderboard];
      merged.splice(gameOverPosition, 0, {
        id: 'game-over-score',
        player_name: '', // Will show input inline
        score: gameOverScore,
        created_at: new Date().toISOString()
      });

      // CRITICAL: Always limit to exactly 5 entries
      return merged.slice(0, 5);
    }

    // Menu/default or score doesn't make top 5: only show saved scores (max 5)
    return leaderboard.slice(0, 5);
  }, [gameState, currentScore, gameOverScore, gameOverPosition, leaderboard, calculatePosition]);

  // Handle game state changes
  const handleGameStateChange = useCallback((newState: GameState) => {
    setGameState(newState);

    if (newState === 'menu') {
      // Reset game over state when returning to menu
      setGameOverScore(null);
      setGameOverPosition(null);
      setPlayerName('');
      setScoreSaved(false);
      setSavedPlayerName('');
    }
  }, []);

  // Handle game over
  const handleGameOver = useCallback((finalScore: number) => {
    console.log('[GAME OVER] Score:', finalScore);
    setGameOverScore(finalScore);
    setCurrentScore(0);
    // Position will be calculated by useEffect when gameOverScore changes
  }, []);

  // Handle score changes during gameplay
  const handleScoreChange = useCallback((score: number) => {
    if (gameState === 'playing') {
      setCurrentScore(score);
    }
  }, [gameState]);

  // Save score to leaderboard
  const handleSaveScore = useCallback(async () => {
    if (!playerName.trim() || gameOverScore === null || isSaving) return;

    // CRITICAL FIX: Validate score makes top 5 BEFORE saving to database
    const position = calculatePosition(gameOverScore);
    if (position >= 5) {
      console.error('[VALIDATION] Score does not make top 5 (position:', position, '), refusing to save');
      alert('This score does not make the top 5 leaderboard.');
      return;
    }

    setIsSaving(true);
    console.log('[VALIDATION] Score makes top 5 at position', position, '- saving:', gameOverScore, 'for player:', playerName);

    try {
      // Insert new score (only if it made top 5)
      const { error: insertError } = await supabase
        .from('dino_high_scores')
        .insert({
          player_name: playerName.trim(),
          score: gameOverScore
        });

      if (insertError) throw insertError;

      console.log('[VALIDATION] Score inserted at position', position, '- now ensuring only top 5 remain...');

      // Ensure only top 5 remain in database
      // First get all scores ordered by score descending
      const { data: allScores, error: fetchError } = await supabase
        .from('dino_high_scores')
        .select('id, score')
        .order('score', { ascending: false });

      if (fetchError) throw fetchError;

      // If more than 5 entries, delete everything after the 5th
      if (allScores && allScores.length > 5) {
        const idsToDelete = allScores.slice(5).map(entry => entry.id);
        console.log('[FIX 2] Deleting', idsToDelete.length, 'entries beyond top 5:', idsToDelete);

        const { error: deleteError } = await supabase
          .from('dino_high_scores')
          .delete()
          .in('id', idsToDelete);

        if (deleteError) throw deleteError;
        console.log('[FIX 2] Successfully deleted old entries');
      } else {
        console.log('[FIX 2] No entries to delete, total entries:', allScores?.length || 0);
      }

      // Reload leaderboard
      await loadLeaderboard();

      // Show "Play Again" state
      const savedName = playerName; // Capture before clearing
      console.log('[SAVE SUCCESS] Score saved for:', savedName, '| Setting scoreSaved to true');
      
      setSavedPlayerName(savedName);
      setPlayerName('');
      setGameOverScore(null);
      setGameOverPosition(null);
      setScoreSaved(true);
      
      console.log('[SAVE SUCCESS] Play Again button should now be visible');
    } catch (error) {
      console.error('Error saving score:', error);
      alert('Failed to save score. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [playerName, gameOverScore, isSaving, supabase, loadLeaderboard, calculatePosition]);

  // Handle skip (restart without saving)
  const handleSkip = useCallback(() => {
    setGameOverScore(null);
    setGameOverPosition(null);
    setPlayerName('');
    setScoreSaved(false);
    setSavedPlayerName('');
    setGameState('menu');
  }, []);

  // Handle play again after saving
  const handlePlayAgain = useCallback(() => {
    console.log('[PLAY AGAIN] Restarting game');
    setScoreSaved(false);
    setSavedPlayerName('');
    setGameState('playing');
    handleGameStateChange('playing');
  }, [handleGameStateChange]);

  // Keyboard listener for SPACE key when scoreSaved is true
  useEffect(() => {
    if (!scoreSaved) {
      return;
    }

    console.log('[PLAY AGAIN] SPACE key listener active');

    const handleSpaceKey = (e: KeyboardEvent) => {
      // Check if user is in an input field
      const target = e.target as HTMLElement;
      const activeElement = document.activeElement;

      if (
        (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'BUTTON')) ||
        (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA'))
      ) {
        return;
      }

      if (e.key === ' ') {
        console.log('[PLAY AGAIN] SPACE key pressed, restarting game');
        e.preventDefault();
        e.stopPropagation();
        handlePlayAgain();
      }
    };

    window.addEventListener('keydown', handleSpaceKey);

    return () => {
      window.removeEventListener('keydown', handleSpaceKey);
    };
  }, [scoreSaved, handlePlayAgain]);

  // Handle Enter key in name input
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Stop event propagation to prevent game from receiving keyboard events
    e.stopPropagation();

    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveScore();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleSkip();
    }
  }, [handleSaveScore, handleSkip]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center w-full max-w-7xl mx-auto p-4">
      {/* Game Canvas */}
      <div className="flex-shrink-0">
        <div className="relative">
          {!imagesLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 rounded-lg">
              <div className="text-white text-xl font-orbitron">Loading images...</div>
            </div>
          )}
          <DinoGame
            onScoreChange={handleScoreChange}
            onGameStateChange={handleGameStateChange}
            onGameOver={handleGameOver}
          />
        </div>
      </div>

      {/* Leaderboard */}
      <div className="w-full lg:w-96 flex-shrink-0">
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 shadow-2xl">
          <h2 className="text-2xl font-bold font-orbitron text-[#ffd700] mb-6 text-center">
            TOP SCORES
          </h2>

          {isLoadingLeaderboard ? (
            <div className="text-center text-gray-400 py-8">Loading...</div>
          ) : mergedLeaderboard.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No scores yet. Be the first!
            </div>
          ) : (
            <div className="space-y-2">
              {mergedLeaderboard.map((entry, index) => {
                const isCurrentGame = entry.id === 'current-game';
                const isGameOver = entry.id === 'game-over-score';
                const isTop3 = index < 3 && !isCurrentGame && !isGameOver;

                return (
                  <div
                    key={entry.id}
                    className={`
                      flex items-center justify-between p-3 rounded-lg transition-all
                      ${isCurrentGame ? 'bg-blue-600/30 border-2 border-blue-400 animate-pulse' : ''}
                      ${isGameOver ? 'bg-yellow-600/30 border-2 border-yellow-400' : ''}
                      ${!isCurrentGame && !isGameOver ? 'bg-gray-800/50 border border-gray-700/30' : ''}
                      ${isTop3 ? 'border-[#ffd700]/50' : ''}
                    `}
                  >
                    {/* Rank */}
                    <div className={`
                      w-8 h-8 flex items-center justify-center rounded-full font-bold font-orbitron text-sm
                      ${isTop3 ? 'bg-[#ffd700] text-gray-900' : 'bg-gray-700 text-gray-300'}
                    `}>
                      {index + 1}
                    </div>

                    {/* Player Name or Input */}
                    <div className="flex-1 mx-3">
                      {isGameOver ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={playerName}
                            onChange={(e) => {
                              e.stopPropagation();
                              setPlayerName(e.target.value);
                            }}
                            onKeyDown={handleKeyDown}
                            onKeyUp={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                            onFocus={(e) => e.stopPropagation()}
                            placeholder="Enter your name"
                            maxLength={20}
                            autoFocus
                            className="
                              flex-1 bg-gray-900/80 border border-yellow-400 rounded px-3 py-1
                              text-white font-synonym text-sm
                              focus:outline-none focus:ring-2 focus:ring-yellow-400
                              placeholder-gray-500
                            "
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveScore();
                            }}
                            onKeyDown={(e) => e.stopPropagation()}
                            onKeyUp={(e) => e.stopPropagation()}
                            disabled={!playerName.trim() || isSaving}
                            className="
                              px-3 py-1 bg-[#ffd700] text-gray-900 rounded font-bold text-xs
                              hover:bg-[#ffed4e] disabled:opacity-50 disabled:cursor-not-allowed
                              transition-colors
                            "
                          >
                            {isSaving ? '...' : 'SAVE'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSkip();
                            }}
                            onKeyDown={(e) => e.stopPropagation()}
                            onKeyUp={(e) => e.stopPropagation()}
                            disabled={isSaving}
                            className="
                              px-3 py-1 bg-gray-700 text-white rounded font-bold text-xs
                              hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed
                              transition-colors
                            "
                          >
                            SKIP
                          </button>
                        </div>
                      ) : (
                        <div className={`
                          font-synonym truncate
                          ${isCurrentGame ? 'text-blue-300 font-bold' : 'text-gray-300'}
                        `}>
                          {entry.player_name || 'Anonymous'}
                        </div>
                      )}
                    </div>

                    {/* Score */}
                    <div className={`
                      font-orbitron font-bold text-lg
                      ${isCurrentGame ? 'text-blue-300' : ''}
                      ${isGameOver ? 'text-yellow-300' : ''}
                      ${!isCurrentGame && !isGameOver ? 'text-[#ffd700]' : ''}
                    `}>
                      {entry.score.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Instructions */}
          {gameState === 'menu' && !gameOverScore && (
            <div className="mt-6 pt-6 border-t border-gray-700/50">
              <p className="text-gray-400 text-sm text-center font-synonym">
                Press <span className="text-[#ffd700]">SPACE</span> to start<br />
                <span className="text-xs text-gray-500 mt-2 block">
                  ↑ or Space to jump • ↓ to duck
                </span>
              </p>
            </div>
          )}

          {/* Game Over Instructions */}
          {gameOverScore !== null && gameOverPosition !== null && gameOverPosition < 5 && (
            <div className="mt-6 pt-6 border-t border-gray-700/50">
              <p className="text-gray-400 text-sm text-center font-synonym">
                Enter name and press <span className="text-[#ffd700]">ENTER</span> to save<br />
                <span className="text-xs text-gray-500 mt-2 block">
                  Press <span className="text-[#ffd700]">ESC</span> to skip and restart
                </span>
              </p>
            </div>
          )}

          {/* Score Didn't Make Top 5 - FIX: Only show when position is CONFIRMED >= 5, not null */}
          {gameOverScore !== null && gameOverPosition !== null && gameOverPosition >= 5 && !scoreSaved && (
            <div className="mt-6 pt-6 border-t border-gray-700/50">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <p className="text-center text-gray-300 font-synonym text-sm mb-3">
                  Score: <span className="text-[#ffd700] font-bold">{gameOverScore.toLocaleString()}</span>
                </p>
                <p className="text-center text-gray-400 text-xs mb-4">
                  Keep trying to make the top 5!
                </p>
                <button
                  onClick={handleSkip}
                  className="
                    w-full py-2 px-4
                    bg-[#ffd700] hover:bg-[#ffed4e]
                    text-gray-900 font-orbitron font-bold
                    rounded-lg shadow-lg
                    transition-all duration-200
                    hover:scale-105
                    active:scale-95
                  "
                >
                  TRY AGAIN
                </button>
              </div>
            </div>
          )}

          {/* Play Again Section - After Score Saved */}
          {scoreSaved && (
              <div className="mt-6 pt-6 border-t border-[#ffd700]/50">
                <div className="bg-gradient-to-br from-[#ffd700]/20 to-yellow-600/20 rounded-lg p-4 border-2 border-[#ffd700]">
                  <p className="text-center text-[#ffd700] font-orbitron font-bold text-lg mb-3">
                    🎉 Score Saved!
                  </p>
                  <p className="text-center text-white font-synonym text-sm mb-4">
                    {savedPlayerName} - Your score is on the leaderboard!
                  </p>
                  <button
                    onClick={handlePlayAgain}
                    className="
                      w-full py-3 px-6
                      bg-[#ffd700] hover:bg-[#ffed4e]
                      text-gray-900 font-orbitron font-bold text-lg
                      rounded-lg shadow-lg
                      transition-all duration-200
                      hover:scale-105 hover:shadow-[#ffd700]/50
                      active:scale-95
                    "
                  >
                    🎮 PLAY AGAIN
                  </button>
                  <p className="text-center text-gray-400 text-xs font-synonym mt-3">
                    Press <span className="text-[#ffd700]">SPACE</span> to Play Again
                  </p>
                </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
