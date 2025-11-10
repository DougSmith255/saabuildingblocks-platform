'use client';

import { useEffect, useRef, useCallback } from 'react';
import styles from './StarBackground.module.css';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  baseOpacity: number;
  layer: number;
  twinkleSpeed: number;
}

interface DebugConfig {
  enabled: boolean;
  logLevel: 'info' | 'warn' | 'error';
}

const DEBUG_CONFIG: DebugConfig = {
  enabled: process.env.NODE_ENV === 'development',
  logLevel: 'info',
};

const debugLog = (message: string, data?: any) => {
  if (DEBUG_CONFIG.enabled && DEBUG_CONFIG.logLevel === 'info') {
    const timestamp = new Date().toISOString().slice(11, 23);
    console.log(`[STAR-DEBUG ${timestamp}] ${message}`, data || '');
  }
};

const debugError = (message: string, error?: any) => {
  if (DEBUG_CONFIG.enabled) {
    console.error(`[STAR-ERROR] ${message}`, error || '');
  }
};

export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastAnimationTimeRef = useRef<number>(0);
  const animationErrorsRef = useRef<number>(0);
  const frameSkipCounterRef = useRef<number>(0);
  const isMobileRef = useRef<boolean>(false);
  const isLowPerformanceRef = useRef<boolean>(false);

  // Configuration constants
  const LAYER_COUNT = 3;
  const SPEEDS = [0.08, 0.15, 0.25]; // Slower parallax speeds to match WordPress
  const BASE_STAR_COUNT = typeof window !== 'undefined' &&
    (window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    ? 8 // Reduced from 12 for mobile performance
    : 21; // 10% more than 19 (rounded)
  const MOBILE_FRAME_SKIP = 2; // Skip every other frame on mobile
  const LOW_PERF_FRAME_SKIP = 3; // Skip 2 out of 3 frames on low-performance devices

  // Create stars for all layers
  const createStars = useCallback((canvas: HTMLCanvasElement) => {
    const stars: Star[] = [];
    const scalingFactor = Math.max(canvas.width, canvas.height) / 1000;

    debugLog('🌟 Creating stars', {
      canvasSize: { width: canvas.width, height: canvas.height },
      scalingFactor,
      baseStarCount: BASE_STAR_COUNT,
    });

    for (let i = 0; i < LAYER_COUNT; i++) {
      const starCount = Math.floor(BASE_STAR_COUNT * scalingFactor * (i + 1));
      for (let j = 0; j < starCount; j++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * (i * 0.8 + 1) + 0.3, // WordPress size
          speed: SPEEDS[i] ?? 0.1,
          opacity: Math.random(),
          baseOpacity: Math.random() * 0.4 + 0.4, // Slightly dimmer
          layer: i,
          twinkleSpeed: Math.random() * 0.0008 + 0.0004, // Slower twinkle
        });
      }
    }

    starsRef.current = stars;
    debugLog('✅ Stars created', { count: stars.length });
  }, [BASE_STAR_COUNT]);

  // Update star positions and opacity
  const updateStars = useCallback((canvas: HTMLCanvasElement) => {
    const stars = starsRef.current;
    const now = Date.now();

    stars.forEach((star) => {
      // Move stars upward (floating like stars)
      star.y -= star.speed;

      // Smooth twinkling effect using sin wave
      star.opacity = star.baseOpacity + Math.sin(now * star.twinkleSpeed) * 0.3;

      // Wrap around when star goes off top edge
      if (star.y < -star.size) {
        star.y = canvas.height + star.size;
        // Slight horizontal randomization to prevent patterns
        star.x += (Math.random() - 0.5) * 20;
        // Keep within bounds
        star.x = Math.max(0, Math.min(canvas.width - star.size, star.x));
      }
    });
  }, []);

  // Draw stars on canvas with batch rendering optimization
  const drawStars = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // Clear canvas completely (transparent background - gradient is on body element)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Batch drawing by opacity for better performance
    const stars = starsRef.current;

    // Use requestIdleCallback for non-critical work if available
    if (isMobileRef.current && isLowPerformanceRef.current) {
      // Simplified rendering for low-performance devices
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      stars.forEach((star) => {
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });
    } else {
      // Full rendering with varying opacity
      stars.forEach((star) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(star.opacity, 0.4)})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });
    }
  }, []);

  // Animation loop with frame skipping for mobile
  const animate = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    try {
      const now = performance.now();
      const deltaTime = now - lastAnimationTimeRef.current;

      // Track slow frames and enable performance mode
      if (deltaTime > 33.33 && lastAnimationTimeRef.current > 0) {
        const fps = 1000 / deltaTime;

        // Enable low-performance mode if FPS < 30 consistently
        if (fps < 30 && !isLowPerformanceRef.current) {
          isLowPerformanceRef.current = true;
          debugLog('🔧 Low performance detected, enabling frame skipping', {
            fps: fps.toFixed(1),
          });
        }

        debugLog('⚠️ Slow frame detected', {
          deltaTime: deltaTime.toFixed(2),
          fps: fps.toFixed(1),
        });
      }

      // Frame skipping logic
      frameSkipCounterRef.current++;
      const shouldRender = isLowPerformanceRef.current
        ? frameSkipCounterRef.current % LOW_PERF_FRAME_SKIP === 0
        : isMobileRef.current
        ? frameSkipCounterRef.current % MOBILE_FRAME_SKIP === 0
        : true;

      if (shouldRender) {
        updateStars(canvas);
        drawStars(canvas, ctx);
        lastAnimationTimeRef.current = now;
      }

      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(() => animate(canvas, ctx));
    } catch (error) {
      animationErrorsRef.current++;
      debugError(`❌ Animation error #${animationErrorsRef.current}`, error);

      // Retry animation with backoff if errors < 5
      if (animationErrorsRef.current < 5) {
        setTimeout(() => {
          animationFrameRef.current = requestAnimationFrame(() => animate(canvas, ctx));
        }, 100);
      } else {
        debugError('❌ Too many animation errors, stopping');
      }
    }
  }, [updateStars, drawStars]);

  // Resize canvas to match viewport
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const oldWidth = canvas.width;
    const oldHeight = canvas.height;

    debugLog('📐 Resizing canvas', {
      oldSize: { width: oldWidth, height: oldHeight },
      newSize: { width: window.innerWidth, height: window.innerHeight },
      starCount: starsRef.current.length,
    });

    try {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Reposition existing stars proportionally
      if (starsRef.current.length > 0 && oldWidth > 0 && oldHeight > 0) {
        const scaleX = canvas.width / oldWidth;
        const scaleY = canvas.height / oldHeight;

        starsRef.current.forEach((star) => {
          star.x = Math.min(star.x * scaleX, canvas.width - star.size);
          star.y = Math.min(star.y * scaleY, canvas.height - star.size);
        });
      } else {
        createStars(canvas);
      }

      debugLog('✅ Canvas resized successfully', {
        finalSize: { width: canvas.width, height: canvas.height },
        starCount: starsRef.current.length,
      });
    } catch (error) {
      debugError('❌ Canvas resize failed', error);
    }
  }, [createStars]);

  // Debounced resize handler
  const handleResize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    resizeTimeoutRef.current = setTimeout(() => {
      resizeCanvas();
    }, 150);
  }, [resizeCanvas]);

  // Initialize canvas and start animation
  useEffect(() => {
    debugLog('🌟 Initializing starfield system');

    const canvas = canvasRef.current;
    if (!canvas) {
      debugError('❌ Canvas ref not available');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      debugError('❌ Failed to get 2D context');
      return;
    }

    debugLog('✅ Canvas found', {
      width: canvas.width,
      height: canvas.height,
      clientWidth: canvas.clientWidth,
      clientHeight: canvas.clientHeight,
    });

    // Detect mobile device
    isMobileRef.current = window.innerWidth <= 768 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobileRef.current) {
      debugLog('📱 Mobile device detected, enabling optimizations');
    }

    // Initial setup
    resizeCanvas();
    debugLog('🚀 Starting animation loop');

    // Mark canvas as ready after stars are created
    requestAnimationFrame(() => {
      canvas.classList.add('stars-ready');
      debugLog('⭐ Stars ready, triggering fade-in');
    });

    animate(canvas, ctx);

    // Setup resize listeners
    window.addEventListener('resize', handleResize, { passive: true });

    // Mobile-specific listeners
    if (isMobileRef.current) {
      debugLog('📱 Setting up mobile listeners');
      window.addEventListener('orientationchange', () => {
        setTimeout(handleResize, 500);
      }, { passive: true });
    }

    // Cleanup
    return () => {
      debugLog('🧹 Cleaning up starfield');
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [resizeCanvas, animate, handleResize]);

  return (
    <canvas
      ref={canvasRef}
      id="starfield"
      className={styles['starfieldCanvas']}
      aria-hidden="true"
    />
  );
}
