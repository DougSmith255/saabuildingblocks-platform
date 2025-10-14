'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface TRexRunnerProps {
  onGameOver?: (score: number) => void;
  onScoreUpdate?: (score: number) => void;
}

export default function TRexRunner({ onGameOver, onScoreUpdate }: TRexRunnerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Game state refs
  const dinoRef = useRef({ y: 0, velocity: 0, jumping: false });
  const obstaclesRef = useRef<Array<{ x: number; y: number; width: number; height: number; type: 'cactus' | 'bird'; scored?: boolean }>>([]);
  const gameLoopRef = useRef<number | null>(null);
  const scoreRef = useRef(0);
  const gameSpeedRef = useRef(6);
  const frameCountRef = useRef(0);

  // Game constants
  const GRAVITY = 0.6;
  const JUMP_FORCE = -13;
  const GROUND_Y = 150;
  const DINO_SIZE = 44;
  const INITIAL_OBSTACLE_SPEED = 6;

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('trex-high-score');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // Save high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('trex-high-score', score.toString());
    }
  }, [score, highScore]);

  // Create obstacle
  const createObstacle = useCallback((canvasWidth: number) => {
    const type: 'cactus' | 'bird' = Math.random() > 0.3 ? 'cactus' : 'bird';
    let width = 20;
    let height = 40;
    let y = GROUND_Y - height;

    if (type === 'bird') {
      width = 46;
      height = 40;
      y = GROUND_Y - height - (Math.random() > 0.5 ? 20 : 50);
    }

    return {
      x: canvasWidth,
      y,
      width,
      height,
      type,
      speed: INITIAL_OBSTACLE_SPEED * gameSpeedRef.current,
    };
  }, []);

  // Jump handler
  const jump = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true);
      setGameOver(false);
      setScore(0);
      scoreRef.current = 0;
      gameSpeedRef.current = 1;
      obstaclesRef.current = [];
      dinoRef.current = { y: GROUND_Y - DINO_SIZE, velocity: 0, jumping: false };
      return;
    }

    if (gameOver) {
      setGameStarted(false);
      return;
    }

    const dino = dinoRef.current;
    if (!dino.jumping) {
      dino.velocity = JUMP_FORCE;
      dino.jumping = true;
    }
  }, [gameStarted, gameOver]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  // Draw T-Rex with modern 2D styling and color
  const drawDino = useCallback((ctx: CanvasRenderingContext2D, y: number) => {
    const x = 50;

    // Add shadow for depth
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // Body - olive green
    ctx.fillStyle = '#7a9b76';
    ctx.fillRect(x + 6, y + 20, 30, 24);

    // Head - lighter green
    ctx.fillStyle = '#8fb88a';
    ctx.fillRect(x + 26, y, 18, 20);

    // Eye - white with black pupil
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 36, y + 6, 6, 6);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 38, y + 8, 2, 2);

    // Legs - darker green
    ctx.fillStyle = '#658761';
    const legPhase = Math.sin(Date.now() / 100) * 4;
    ctx.fillRect(x + 12, y + 44, 6, 12 + legPhase);
    ctx.fillRect(x + 24, y + 44, 6, 12 - legPhase);

    // Arm
    ctx.fillRect(x + 6, y + 24, 8, 6);

    // Tail - accent color
    ctx.fillStyle = '#a8c9a3';
    ctx.fillRect(x, y + 28, 10, 8);

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }, []);

  // Draw obstacle with 2D styling and color
  const drawObstacle = useCallback((ctx: CanvasRenderingContext2D, obstacle: typeof obstaclesRef.current[0]) => {
    // Add shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    if (obstacle.type === 'cactus') {
      // Cactus - desert tan/green
      ctx.fillStyle = '#6b8e6b';
      ctx.fillRect(obstacle.x, obstacle.y, 12, obstacle.height);
      ctx.fillRect(obstacle.x + 4, obstacle.y + 10, 16, 10);

      // Highlights
      ctx.fillStyle = '#7da47d';
      ctx.fillRect(obstacle.x + 2, obstacle.y, 2, obstacle.height);
    } else {
      // Bird - blue-gray
      ctx.fillStyle = '#6a8caf';
      // Body
      ctx.fillRect(obstacle.x + 10, obstacle.y + 15, 26, 12);
      // Wings
      const wingPhase = Math.sin(Date.now() / 100) * 6;
      ctx.fillRect(obstacle.x, obstacle.y + 10 + wingPhase, 46, 6);

      // Highlights
      ctx.fillStyle = '#8ab4d5';
      ctx.fillRect(obstacle.x + 12, obstacle.y + 17, 2, 8);
    }

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }, []);

  // Check collision
  const checkCollision = useCallback((dino: { y: number }, obstacle: typeof obstaclesRef.current[0]): boolean => {
    const dinoX = 50;
    const dinoY = dino.y;
    const padding = 4; // Collision padding for better gameplay

    return (
      dinoX + padding < obstacle.x + obstacle.width &&
      dinoX + DINO_SIZE - padding > obstacle.x &&
      dinoY + padding < obstacle.y + obstacle.height &&
      dinoY + DINO_SIZE - padding > obstacle.y
    );
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      // Clear with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#e8f4f8');
      gradient.addColorStop(1, '#d5e8ef');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw ground line with shadow
      ctx.strokeStyle = '#8b9d83';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y);
      ctx.lineTo(canvas.width, GROUND_Y);
      ctx.stroke();

      // Update dino
      const dino = dinoRef.current;
      dino.velocity += GRAVITY;
      dino.y += dino.velocity;

      if (dino.y >= GROUND_Y - DINO_SIZE) {
        dino.y = GROUND_Y - DINO_SIZE;
        dino.velocity = 0;
        dino.jumping = false;
      }

      // Draw dino
      drawDino(ctx, dino.y);

      // Update and draw obstacles
      frameCountRef.current++;

      // Spawn obstacles
      if (frameCountRef.current % 80 === 0 && obstaclesRef.current.length < 2) {
        obstaclesRef.current.push(createObstacle(canvas.width));
      }

      // Increase difficulty
      if (frameCountRef.current % 500 === 0) {
        gameSpeedRef.current = Math.min(gameSpeedRef.current + 0.1, 2);
      }

      obstaclesRef.current = obstaclesRef.current.filter(obstacle => {
        obstacle.x -= INITIAL_OBSTACLE_SPEED * gameSpeedRef.current;

        // Check collision
        if (checkCollision(dino, obstacle)) {
          setGameOver(true);
          onGameOver?.(scoreRef.current);
          return false;
        }

        // Score point
        if (obstacle.x + obstacle.width < 50 && !obstacle.scored) {
          scoreRef.current += 1;
          setScore(scoreRef.current);
          onScoreUpdate?.(scoreRef.current);
          obstacle.scored = true;
        }

        // Draw obstacle
        if (obstacle.x + obstacle.width > 0) {
          drawObstacle(ctx, obstacle);
          return true;
        }
        return false;
      });

      gameLoopRef.current = requestAnimationFrame(animate);
    };

    gameLoopRef.current = requestAnimationFrame(animate);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver, drawDino, drawObstacle, checkCollision, createObstacle, onGameOver, onScoreUpdate]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = Math.min(window.innerWidth - 40, 800);
      canvas.height = 200;
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div className="relative">
      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        onClick={jump}
        className="rounded-2xl cursor-pointer"
        style={{
          border: 'none',
          background: 'transparent',
        }}
      />

      {/* Score Display */}
      {gameStarted && (
        <div
          className="absolute top-4 right-4 px-4 py-2 rounded-lg text-xl font-['var(--font-taskor)'] font-bold"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            color: '#ffffff',
          }}
        >
          {score}
        </div>
      )}

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl">
          <div className="text-center space-y-4 px-6 py-8 rounded-xl"
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              border: '2px solid rgba(255, 215, 0, 0.3)',
            }}
          >
            <h2 className="text-4xl font-['var(--font-taskor)'] font-bold text-gold-500">
              Game Over!
            </h2>
            <p className="text-xl text-white/90">Score: {score}</p>
            <p className="text-lg text-white/70">High Score: {highScore}</p>
            <button
              onClick={jump}
              className="px-6 py-2 rounded-lg text-base font-['var(--font-taskor)'] font-semibold transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #ffd700 0%, #ffa500 100%)',
                color: '#1a1a1a',
              }}
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Start Instructions */}
      {!gameStarted && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2 animate-pulse">
            <p className="text-xl font-['var(--font-taskor)'] font-bold text-gold-500">
              Press SPACE or Click to Start
            </p>
            <p className="text-base text-white/70">
              Jump over obstacles!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
