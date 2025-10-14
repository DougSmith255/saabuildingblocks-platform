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

    // Load sprite images
    this.run_img = [new Image(), new Image()];
    this.run_img[0].src = '/games/dino/DinoRun1.png';
    this.run_img[1].src = '/games/dino/DinoRun2.png';

    this.duck_img = [new Image(), new Image()];
    this.duck_img[0].src = '/games/dino/DinoDuck1.png';
    this.duck_img[1].src = '/games/dino/DinoDuck2.png';

    this.jump_img = new Image();
    this.jump_img.src = '/games/dino/DinoJump.png';
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

// Main game component
export default function DinoGamePython() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing'>('menu');
  const [deathCount, setDeathCount] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

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

    // Keyboard event handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'menu') {
        // Matching Python lines 264-265: any key starts game
        setGameState('playing');
        startGame();
        return;
      }

      if (e.key === 'ArrowUp' || e.key === ' ') userInput.up = true; // Arrow up or spacebar to jump
      if (e.key === 'ArrowDown') userInput.down = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === ' ') userInput.up = false; // Release jump on spacebar up
      if (e.key === 'ArrowDown') userInput.down = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Score function (matching Python lines 181-190)
    function score() {
      points += 1;
      if (points % 100 === 0) {
        game_speed += 1;
      }

      ctx.fillStyle = '#ffd700'; // headingText from Master Controller
      // Typography: H3 Display Text (Orbitron 28px bold) - Master Controller managed
      ctx.font = 'bold 28px "Orbitron", Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`Points: ${points}`, SCREEN_WIDTH - 100, 40);
    }

    // Background function (matching Python lines 192-200) - drawing only
    function background() {
      // Draw ground line at y=380 - transparent/invisible to match page background
      // Keeping the scrolling pattern for game floor effect
      const patternWidth = 100;
      for (let i = x_pos_bg; i < SCREEN_WIDTH + patternWidth; i += patternWidth) {
        ctx.fillStyle = 'rgba(220, 219, 213, 0.1)'; // Very subtle bodyText color pattern
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
            // Death sequence (matching Python lines 225-227)
            setTimeout(() => {
              setDeathCount(prev => prev + 1);
              setFinalScore(points);
              setGameState('menu');
              cancelAnimationFrame(animationFrameId);
            }, 2000); // 2 second delay matching pygame.time.delay(2000)
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

        // Draw score
        ctx.fillStyle = '#ffd700'; // headingText from Master Controller
        ctx.font = 'bold 28px "Orbitron", Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`Points: ${points}`, SCREEN_WIDTH - 100, 40);
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    }

    function startGame() {
      // Reset game state (matching Python lines 171-179)
      player = new Dinosaur();
      cloud = new Cloud();
      game_speed = 20;
      x_pos_bg = 0;
      points = 0;
      obstacles.length = 0;
      userInput.up = false;
      userInput.down = false;
      lastFrameTime = 0;
      lastUpdateTime = 0;

      animationFrameId = requestAnimationFrame(gameLoop);
    }

    if (gameState === 'playing') {
      startGame();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [gameState]);

  // Menu screen (matching Python lines 240-266)
  const renderMenu = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with transparent background
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Load and draw dino start sprite (scaled 1.5x)
    const startSprite = new Image();
    startSprite.src = '/games/dino/DinoStart.png';

    if (startSprite.complete && startSprite.naturalHeight !== 0) {
      ctx.drawImage(
        startSprite,
        SCREEN_WIDTH / 2 - 66,
        SCREEN_HEIGHT / 2 - 140,
        DINO_WIDTH,
        DINO_HEIGHT
      );
    } else {
      // Fallback to rectangle if image not loaded yet
      ctx.fillStyle = '#535353';
      ctx.fillRect(SCREEN_WIDTH / 2 - 66, SCREEN_HEIGHT / 2 - 140, DINO_WIDTH, DINO_HEIGHT);
    }

    // Draw text with brand colors and typography from Master Controller
    ctx.textAlign = 'center';

    if (deathCount === 0) {
      // Typography: H2 Display Text (Orbitron 36px bold) - Primary menu heading (gold)
      ctx.fillStyle = '#ffd700'; // headingText/brandGold
      ctx.font = 'bold 36px "Orbitron", Arial';
      ctx.fillText('Press any Key to Start', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
      // Typography: Body Text (Synonym 24px) - Secondary controls text (bodyText color)
      ctx.fillStyle = '#dcdbd5'; // bodyText (off-white)
      ctx.font = '24px "Synonym", Arial';
      ctx.fillText('Up Arrow or Spacebar to Jump, Down Arrow to Crouch', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 50);
    } else {
      // "Press any Key to Restart" - White (bodyText color) with Taskor font
      ctx.fillStyle = '#dcdbd5'; // bodyText (primary text brand white)
      ctx.font = 'bold 36px "Orbitron", Arial'; // Taskor (using Orbitron as fallback)
      ctx.fillText('Press any Key to Restart', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);

      // "Your Score:" - White Taskor and score number - Yellow Taskor
      ctx.font = 'bold 28px "Orbitron", Arial'; // Taskor font
      ctx.fillStyle = '#dcdbd5'; // White (bodyText)
      ctx.fillText('Your Score: ', SCREEN_WIDTH / 2 - 50, SCREEN_HEIGHT / 2 + 50);
      ctx.fillStyle = '#ffd700'; // Yellow (brandGold)
      ctx.fillText(`${finalScore}`, SCREEN_WIDTH / 2 + 80, SCREEN_HEIGHT / 2 + 50);

      // Controls text - Synonym font and bodyText color (secondary text)
      ctx.fillStyle = '#dcdbd5'; // bodyText (off-white)
      ctx.font = '24px "Synonym", Arial';
      ctx.fillText('Up Arrow or Spacebar to Jump, Down Arrow to Crouch', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 100);
    }
  };

  useEffect(() => {
    if (gameState === 'menu') {
      renderMenu();
    }
  }, [gameState, deathCount, finalScore]);

  return (
    <canvas
      ref={canvasRef}
      width={SCREEN_WIDTH}
      height={SCREEN_HEIGHT}
      className="max-w-full h-auto"
    />
  );
}
