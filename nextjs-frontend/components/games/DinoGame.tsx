'use client';

import React, { useEffect, useRef, useState } from 'react';

// Global Constants (matching Python lines 7-9)
const SCREEN_HEIGHT = 600;
const SCREEN_WIDTH = 1100;

// Dinosaur constants (matching Python lines 34-37) - SCALED 0.8x from previous 1.5x
const DINO_X_POS = 80;
const DINO_Y_POS = 267;  // 380 (ground) - 113 (0.8x of 1.5x height) = 267
const DINO_Y_POS_DUCK = 308;  // 380 (ground) - 72 (0.8x of 1.5x duck height) = 308
const DINO_JUMP_VEL = 8.5;

// Simple shape representations - Dino 0.8x of previous, others at default
const DINO_WIDTH = 106;  // 132 × 0.8 = 105.6 ≈ 106
const DINO_HEIGHT = 113; // 141 × 0.8 = 112.8 ≈ 113
const DINO_DUCK_WIDTH = 132;  // 165 × 0.8 = 132
const DINO_DUCK_HEIGHT = 72;  // 90 × 0.8 = 72
const SMALL_CACTUS_WIDTH = 34;  // Original default size
const SMALL_CACTUS_HEIGHT = 70; // Original default size
const LARGE_CACTUS_WIDTH = 50;  // Original default size
const LARGE_CACTUS_HEIGHT = 100; // Original default size
const BIRD_WIDTH = 46;  // Original default size
const BIRD_HEIGHT = 40; // Original default size
const CLOUD_WIDTH = 46;
const CLOUD_HEIGHT = 14;

// Dinosaur class (matching Python lines 33-104)
class Dinosaur {
  static X_POS = DINO_X_POS;
  static Y_POS = DINO_Y_POS;
  static Y_POS_DUCK = DINO_Y_POS_DUCK;
  static JUMP_VEL = DINO_JUMP_VEL;

  dino_duck: boolean;
  dino_run: boolean;
  dino_jump: boolean;
  step_index: number;
  jump_vel: number;
  dino_rect: { x: number; y: number; width: number; height: number };

  // Sprite images (matching Python lines 10-16)
  run_img: HTMLImageElement[];
  duck_img: HTMLImageElement[];
  jump_img: HTMLImageElement;
  imagesLoaded: boolean = false;

  constructor() {
    this.dino_duck = false;
    this.dino_run = true;
    this.dino_jump = false;
    this.step_index = 0;
    this.jump_vel = Dinosaur.JUMP_VEL;
    this.dino_rect = {
      x: Dinosaur.X_POS,
      y: Dinosaur.Y_POS,
      width: DINO_WIDTH,
      height: DINO_HEIGHT
    };

    // Load sprite images with preloading
    this.run_img = [new Image(), new Image()];
    this.duck_img = [new Image(), new Image()];
    this.jump_img = new Image();

    // Start loading images
    this.loadImages();
  }

  async loadImages(): Promise<void> {
    const imagePromises: Promise<void>[] = [];

    // Helper to create a load promise for an image
    const loadImage = (img: HTMLImageElement, src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load ${src}`));
        img.src = src;
      });
    };

    imagePromises.push(loadImage(this.run_img[0], '/games/dino/DinoRun1.png'));
    imagePromises.push(loadImage(this.run_img[1], '/games/dino/DinoRun2.png'));
    imagePromises.push(loadImage(this.duck_img[0], '/games/dino/DinoDuck1.png'));
    imagePromises.push(loadImage(this.duck_img[1], '/games/dino/DinoDuck2.png'));
    imagePromises.push(loadImage(this.jump_img, '/games/dino/DinoJump.png'));

    try {
      await Promise.all(imagePromises);
      this.imagesLoaded = true;
    } catch (error) {
      console.error('Error loading dinosaur images:', error);
    }
  }

  update(userInput: { up: boolean; down: boolean }) {
    if (this.dino_duck) {
      this.duck();
    }
    if (this.dino_run) {
      this.run();
    }
    if (this.dino_jump) {
      this.jump();
    }

    if (this.step_index >= 10) {
      this.step_index = 0;
    }

    // Matching Python lines 66-77
    if (userInput.up && !this.dino_jump) {
      this.dino_duck = false;
      this.dino_run = false;
      this.dino_jump = true;
    } else if (userInput.down && !this.dino_jump) {
      this.dino_duck = true;
      this.dino_run = false;
      this.dino_jump = false;
    } else if (!(this.dino_jump || userInput.down)) {
      this.dino_duck = false;
      this.dino_run = true;
      this.dino_jump = false;
    }
  }

  duck() {
    // Matching Python lines 79-84
    this.dino_rect = {
      x: Dinosaur.X_POS,
      y: Dinosaur.Y_POS_DUCK,
      width: DINO_DUCK_WIDTH,
      height: DINO_DUCK_HEIGHT
    };
    this.step_index += 1;
  }

  run() {
    // Matching Python lines 86-91
    this.dino_rect = {
      x: Dinosaur.X_POS,
      y: Dinosaur.Y_POS,
      width: DINO_WIDTH,
      height: DINO_HEIGHT
    };
    this.step_index += 1;
  }

  jump() {
    // Matching Python lines 93-100
    if (this.dino_jump) {
      this.dino_rect.y -= this.jump_vel * 4;
      this.jump_vel -= 0.8;
    }
    if (this.jump_vel < -Dinosaur.JUMP_VEL) {
      this.dino_jump = false;
      this.jump_vel = Dinosaur.JUMP_VEL;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Get frame index for animation (matching Python line 89: self.run_img[self.step_index // 5])
    const frameIndex = Math.floor(this.step_index / 5) % 2;

    let currentImage: HTMLImageElement;

    if (this.dino_duck) {
      // Use duck sprite with animation
      currentImage = this.duck_img[frameIndex];
    } else if (this.dino_jump) {
      // Use jump sprite (static)
      currentImage = this.jump_img;
    } else {
      // Use run sprite with animation
      currentImage = this.run_img[frameIndex];
    }

    // Draw the sprite image (matching Python line 102: screen.blit(self.image, self.rect))
    if (currentImage.complete && currentImage.naturalHeight !== 0) {
      ctx.drawImage(
        currentImage,
        this.dino_rect.x,
        this.dino_rect.y,
        this.dino_rect.width,
        this.dino_rect.height
      );
    } else {
      // Fallback to rectangle if image not loaded yet
      ctx.fillStyle = '#535353';
      ctx.fillRect(this.dino_rect.x, this.dino_rect.y, this.dino_rect.width, this.dino_rect.height);
    }
  }
}

// Cloud class (matching Python lines 106-121)
class Cloud {
  x: number;
  y: number;
  width: number;

  constructor() {
    this.x = SCREEN_WIDTH + this.random(800, 1000);
    this.y = this.random(50, 100);
    this.width = CLOUD_WIDTH;
  }

  random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  update(game_speed: number) {
    this.x -= game_speed;
    if (this.x < -this.width) {
      this.x = SCREEN_WIDTH + this.random(2500, 3000);
      this.y = this.random(50, 100);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Simple cloud shape
    ctx.fillStyle = '#c0c0c0';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
    ctx.arc(this.x + 15, this.y, 12, 0, Math.PI * 2);
    ctx.arc(this.x + 30, this.y, 10, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Obstacle base class (matching Python lines 123-137)
class Obstacle {
  type: number;
  rect: { x: number; y: number; width: number; height: number };

  constructor(type: number, y: number, width: number, height: number) {
    this.type = type;
    this.rect = {
      x: SCREEN_WIDTH,
      y: y,
      width: width,
      height: height
    };
  }

  update(game_speed: number, obstacles: Obstacle[]): boolean {
    this.rect.x -= game_speed;
    if (this.rect.x < -this.rect.width) {
      return true; // Signal to remove
    }
    return false;
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Override in subclasses
  }
}

// SmallCactus class (matching Python lines 139-143)
class SmallCactus extends Obstacle {
  private static sprites: HTMLImageElement[] = [];
  private static spritesLoaded = false;
  // Actual sprite widths: [40, 68, 105] for types [0, 1, 2]
  private static spriteWidths = [40, 68, 105];

  static {
    if (typeof window !== 'undefined') {
      for (let i = 1; i <= 3; i++) {
        const img = new Image();
        img.src = `/games/dino/SmallCactus${i}.png`;
        img.onload = () => {
          if (SmallCactus.sprites.filter(s => s.complete).length === 3) {
            SmallCactus.spritesLoaded = true;
          }
        };
        SmallCactus.sprites.push(img);
      }
    }
  }

  constructor() {
    const type = Math.floor(Math.random() * 3); // random.randint(0, 2)
    const width = SmallCactus.spriteWidths[type]; // Use actual sprite width
    super(type, 310, width, SMALL_CACTUS_HEIGHT); // 380 - 70 = 310
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (SmallCactus.spritesLoaded && SmallCactus.sprites[this.type]) {
      ctx.drawImage(SmallCactus.sprites[this.type], this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    } else {
      // Fallback rectangles
      ctx.fillStyle = '#83D332';
      if (this.type === 0) {
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
      } else if (this.type === 1) {
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        ctx.fillRect(this.rect.x - 5, this.rect.y + 10, 5, 10);
      } else {
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        ctx.fillRect(this.rect.x + this.rect.width, this.rect.y + 10, 5, 10);
      }
    }
  }
}

// LargeCactus class (matching Python lines 146-150)
class LargeCactus extends Obstacle {
  private static sprites: HTMLImageElement[] = [];
  private static spritesLoaded = false;
  // Actual sprite widths: [48, 99, 102] for types [0, 1, 2]
  private static spriteWidths = [48, 99, 102];

  static {
    if (typeof window !== 'undefined') {
      for (let i = 1; i <= 3; i++) {
        const img = new Image();
        img.src = `/games/dino/LargeCactus${i}.png`;
        img.onload = () => {
          if (LargeCactus.sprites.filter(s => s.complete).length === 3) {
            LargeCactus.spritesLoaded = true;
          }
        };
        LargeCactus.sprites.push(img);
      }
    }
  }

  constructor() {
    const type = Math.floor(Math.random() * 3); // random.randint(0, 2)
    const width = LargeCactus.spriteWidths[type]; // Use actual sprite width
    super(type, 280, width, LARGE_CACTUS_HEIGHT); // 380 - 100 = 280
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (LargeCactus.spritesLoaded && LargeCactus.sprites[this.type]) {
      ctx.drawImage(LargeCactus.sprites[this.type], this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    } else {
      // Fallback rectangles
      ctx.fillStyle = '#83D332';
      if (this.type === 0) {
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
      } else if (this.type === 1) {
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        ctx.fillRect(this.rect.x - 8, this.rect.y + 15, 8, 15);
        ctx.fillRect(this.rect.x + this.rect.width, this.rect.y + 15, 8, 15);
      } else {
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        ctx.fillRect(this.rect.x - 8, this.rect.y + 10, 8, 20);
      }
    }
  }
}

// Bird class (matching Python lines 153-165)
class Bird extends Obstacle {
  index: number;
  private static sprites: HTMLImageElement[] = [];
  private static spritesLoaded = false;

  static {
    if (typeof window !== 'undefined') {
      for (let i = 1; i <= 2; i++) {
        const img = new Image();
        img.src = `/games/dino/Bird${i}.png`;
        img.onload = () => {
          if (Bird.sprites.filter(s => s.complete).length === 2) {
            Bird.spritesLoaded = true;
          }
        };
        Bird.sprites.push(img);
      }
    }
  }

  constructor() {
    const type = 0;
    super(type, 250, BIRD_WIDTH, BIRD_HEIGHT); // Use default bird dimensions (46x40)
    this.index = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.index >= 9) {
      this.index = 0;
    }

    const wingFrame = Math.floor(this.index / 5);

    if (Bird.spritesLoaded && Bird.sprites[wingFrame]) {
      ctx.drawImage(Bird.sprites[wingFrame], this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    } else {
      // Fallback rectangles
      ctx.fillStyle = '#000000';
      // Body
      ctx.fillRect(this.rect.x + 10, this.rect.y + 10, 26, 20);
      // Wings (animated)
      if (wingFrame === 0) {
        ctx.fillRect(this.rect.x, this.rect.y + 15, 10, 10);
        ctx.fillRect(this.rect.x + 36, this.rect.y + 15, 10, 10);
      } else {
        ctx.fillRect(this.rect.x, this.rect.y + 5, 10, 10);
        ctx.fillRect(this.rect.x + 36, this.rect.y + 5, 10, 10);
      }
    }

    this.index += 1;
  }
}

// Game state and score export types
export type GameState = 'menu' | 'playing' | 'gameover';

export interface DinoGameProps {
  onScoreChange?: (score: number) => void;
  onGameStateChange?: (state: GameState) => void;
  onGameOver?: (finalScore: number) => void;
  groundColor?: string; // Dynamic ground line color based on leaderboard position
}

// Main game component
export default function DinoGamePython({
  onScoreChange,
  onGameStateChange,
  onGameOver,
  groundColor = 'rgba(55, 65, 81, 0.5)', // Default gray
}: DinoGameProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>('menu');
  const [deathCount, setDeathCount] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [startImageLoaded, setStartImageLoaded] = useState(false);
  const startImageRef = useRef<HTMLImageElement | null>(null);

  // Preload menu start image once
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      startImageRef.current = img;
      setStartImageLoaded(true);
    };
    img.onerror = () => {
      console.error('Failed to load DinoStart.png');
      setStartImageLoaded(true); // Allow render even if failed
    };
    img.src = '/games/dino/DinoStart.png';
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game variables (matching Python lines 168-179)
    let game_speed = 20;
    let x_pos_bg = 0;
    const y_pos_bg = 380;
    let points = 0;
    const obstacles: Obstacle[] = [];

    let player: Dinosaur;
    let cloud: Cloud;
    let animationFrameId: number;
    let lastFrameTime = 0;
    let lastUpdateTime = 0;
    const renderFPS = 60; // Smooth rendering at 60 FPS
    const updateFPS = 30; // Game logic updates at 30 FPS (original speed)
    const renderInterval = 1000 / renderFPS;
    const updateInterval = 1000 / updateFPS;

    // Keyboard state
    const userInput = { up: false, down: false };

    // Keyboard event handlers with proper event isolation
    const handleKeyDown = (e: KeyboardEvent) => {
      // Enhanced input field detection - check both e.target and document.activeElement
      const target = e.target as HTMLElement;
      const activeElement = document.activeElement;

      // Block if typing in any input field or button
      if (
        (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'BUTTON')) ||
        (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA'))
      ) {
        // Don't process game events when user is interacting with form elements
        return;
      }

      // Additional defensive check: if the event target is not the window or document, ignore
      if (target && target !== document.body && target.closest('input, textarea, button, [role="button"]')) {
        return;
      }

      if (gameState === 'menu') {
        // Only restart on SPACEBAR or ENTER, not any key (to prevent accidental restart while naming score)
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          setGameState('playing');
          onGameStateChange?.('playing');
          startGame();
        }
        return;
      }

      // Only process arrow keys and spacebar for game controls
      if (e.key === 'ArrowUp' || e.key === ' ') {
        e.preventDefault();
        userInput.up = true;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        userInput.down = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Same defensive checks as handleKeyDown
      const target = e.target as HTMLElement;
      const activeElement = document.activeElement;

      if (
        (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'BUTTON')) ||
        (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA'))
      ) {
        return;
      }

      if (e.key === 'ArrowUp' || e.key === ' ') {
        e.preventDefault();
        userInput.up = false;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        userInput.down = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Touch event handlers for mobile support with swipe detection
    let touchStartY = 0;
    let touchStartTime = 0;
    const SWIPE_THRESHOLD = 30; // Minimum pixels to count as swipe
    const SWIPE_MAX_TIME = 300; // Maximum milliseconds for swipe

    const handleTouchStart = (e: TouchEvent) => {
      // Prevent default to avoid double-firing with mouse events
      e.preventDefault();

      // If in menu, start game
      if (gameState === 'menu') {
        onGameStateChange?.('playing');
        startGame();
        return;
      }

      // During gameplay, record touch position for swipe detection
      if (gameState === 'playing' && e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();

      if (gameState === 'playing' && e.touches.length > 0) {
        const touchCurrentY = e.touches[0].clientY;
        const swipeDistance = touchCurrentY - touchStartY;
        const swipeTime = Date.now() - touchStartTime;

        // Detect swipe down for crouch
        if (swipeDistance > SWIPE_THRESHOLD && swipeTime < SWIPE_MAX_TIME) {
          userInput.down = true;
          userInput.up = false;
        }
        // Detect swipe up for jump
        else if (swipeDistance < -SWIPE_THRESHOLD && swipeTime < SWIPE_MAX_TIME) {
          userInput.up = true;
          userInput.down = false;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();

      if (gameState === 'playing') {
        const touchEndY = e.changedTouches[0].clientY;
        const swipeDistance = touchEndY - touchStartY;
        const swipeTime = Date.now() - touchStartTime;

        // If it was a quick tap (not a swipe), jump
        if (Math.abs(swipeDistance) < SWIPE_THRESHOLD && swipeTime < SWIPE_MAX_TIME) {
          userInput.up = true;
          // Reset jump after a short delay
          setTimeout(() => {
            userInput.up = false;
          }, 100);
        } else {
          // Reset all inputs after swipe
          userInput.up = false;
          userInput.down = false;
        }
      }
    };

    // Add touch event listeners to canvas (using existing canvas variable)
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Background function (matching Python lines 192-200) - drawing only
    function background() {
      // Draw HORIZONTAL ground line at y=380 - dynamic color based on leaderboard position
      ctx.strokeStyle = groundColor; // Dynamic color from leaderboard position
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, y_pos_bg);
      ctx.lineTo(SCREEN_WIDTH, y_pos_bg);
      ctx.stroke();

      // Add glow effect for special positions
      if (groundColor !== 'rgba(55, 65, 81, 0.5)') {
        ctx.shadowBlur = 10;
        ctx.shadowColor = groundColor;
        ctx.strokeStyle = groundColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, y_pos_bg);
        ctx.lineTo(SCREEN_WIDTH, y_pos_bg);
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow
      }

      // Keep the scrolling vertical pattern for visual effect
      const patternWidth = 100;
      for (let i = x_pos_bg; i < SCREEN_WIDTH + patternWidth; i += patternWidth) {
        ctx.fillStyle = 'rgba(55, 65, 81, 0.3)'; // Lighter vertical lines
        ctx.fillRect(i, y_pos_bg, 2, 20);
      }
    }

    // Collision detection (matching Python line 224)
    function checkCollision(rect1: { x: number; y: number; width: number; height: number },
                           rect2: { x: number; y: number; width: number; height: number }): boolean {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
      );
    }

    // Game loop - decoupled rendering (60 FPS) from game logic (30 FPS)
    function gameLoop(currentTime: number) {
      if (gameState !== 'playing') {
        return;
      }

      const renderDelta = currentTime - lastFrameTime;
      const updateDelta = currentTime - lastUpdateTime;

      // Update game logic at 30 FPS (original speed)
      if (updateDelta >= updateInterval) {
        lastUpdateTime = currentTime - (updateDelta % updateInterval);

        // Update player
        player.update(userInput);

        // Obstacle spawning (matching Python lines 213-219)
        if (obstacles.length === 0) {
          const randomType = Math.floor(Math.random() * 3); // random.randint(0, 2)
          if (randomType === 0) {
            obstacles.push(new SmallCactus());
          } else if (randomType === 1) {
            obstacles.push(new LargeCactus());
          } else if (randomType === 2) {
            obstacles.push(new Bird());
          }
        }

        // Update obstacles (matching Python lines 221-227)
        for (let i = obstacles.length - 1; i >= 0; i--) {
          const obstacle = obstacles[i];
          const shouldRemove = obstacle.update(game_speed, obstacles);

          if (shouldRemove) {
            obstacles.splice(i, 1);
          }

          // Collision detection (matching Python line 224)
          if (checkCollision(player.dino_rect, obstacle.rect)) {
            // Death sequence - stay in gameover state until user action
            const finalPoints = points;
            setGameState('gameover');
            onGameStateChange?.('gameover');
            onGameOver?.(finalPoints);
            setDeathCount(prev => prev + 1);
            setFinalScore(finalPoints);
            cancelAnimationFrame(animationFrameId);
            return;
          }
        }

        // Update cloud
        cloud.update(game_speed);

        // Update background position at 30 FPS (same as obstacles)
        const patternWidth = 100;
        if (x_pos_bg <= -patternWidth) {
          x_pos_bg = 0;
        }
        x_pos_bg -= game_speed;

        // Update score
        points += 1;
        if (points % 100 === 0) {
          game_speed += 1;
        }

        // Notify parent of score change
        setCurrentScore(points);
        onScoreChange?.(points);
      }

      // Render at 60 FPS (smooth drawing)
      if (renderDelta >= renderInterval) {
        lastFrameTime = currentTime - (renderDelta % renderInterval);

        // Clear canvas with transparent background
        ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        // Draw everything
        player.draw(ctx);

        for (const obstacle of obstacles) {
          obstacle.draw(ctx);
        }

        background();
        cloud.draw(ctx);

        // Score display removed - now only visible in leaderboard
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    }

    async function startGame() {
      // Reset game state (matching Python lines 171-179)
      player = new Dinosaur();

      // Wait for dinosaur images to load before starting
      await player.loadImages();

      cloud = new Cloud();
      game_speed = 20;
      x_pos_bg = 0;
      points = 0;
      obstacles.length = 0;
      userInput.up = false;
      userInput.down = false;
      lastFrameTime = 0;
      lastUpdateTime = 0;

      // Reset score tracking
      setCurrentScore(0);
      onScoreChange?.(0);

      animationFrameId = requestAnimationFrame(gameLoop);
    }

    if (gameState === 'playing') {
      startGame();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);

      // Remove touch event listeners (using existing canvas variable)
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [gameState]); // Only restart on gameState change, NOT groundColor (visual only)

  // Menu screen (matching Python lines 240-266)
  const renderMenu = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with transparent background
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Draw preloaded dino start sprite
    if (startImageLoaded && startImageRef.current) {
      ctx.drawImage(
        startImageRef.current,
        SCREEN_WIDTH / 2 - 66,
        SCREEN_HEIGHT / 2 - 140 - 20, // Move up 20px
        DINO_WIDTH,
        DINO_HEIGHT
      );
    }
    // No fallback square - just don't draw until loaded

    // Draw text with brand colors and typography from Master Controller
    ctx.textAlign = 'center';

    if (deathCount === 0) {
      // Typography: H2 Display Text (Orbitron 36px bold) - Primary menu heading (gold)
      ctx.fillStyle = '#ffd700'; // headingText/brandGold
      ctx.font = 'bold 36px "Orbitron", Arial';
      ctx.fillText('TAP Or Press Enter to Start', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
      // Typography: Body Text (Synonym 24px) - Secondary controls text (bodyText color)
      ctx.fillStyle = '#dcdbd5'; // bodyText (off-white)
      ctx.font = '24px "Synonym", Arial';
      ctx.fillText('TAP to Jump • SWIPE DOWN to Duck', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 50);
    } else {
      // "Press Enter to Restart" - White (bodyText color) with Taskor font
      ctx.fillStyle = '#dcdbd5'; // bodyText (primary text brand white)
      ctx.font = 'bold 36px "Orbitron", Arial'; // Taskor (using Orbitron as fallback)
      ctx.fillText('TAP Or Press Enter to Restart', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);

      // Controls text - Synonym font and bodyText color (secondary text) - Moved closer
      ctx.fillStyle = '#dcdbd5'; // bodyText (off-white)
      ctx.font = '24px "Synonym", Arial';
      ctx.fillText('TAP to Jump • SWIPE DOWN to Duck', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 50);
    }
  };

  useEffect(() => {
    if (gameState === 'menu' && startImageLoaded) {
      renderMenu();
    }
  }, [gameState, deathCount, finalScore, startImageLoaded]);

  return (
    <canvas
      ref={canvasRef}
      width={SCREEN_WIDTH}
      height={SCREEN_HEIGHT}
      className="max-w-full h-auto"
    />
  );
}
