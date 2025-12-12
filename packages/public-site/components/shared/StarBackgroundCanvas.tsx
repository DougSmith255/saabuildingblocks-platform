'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

/**
 * StarBackgroundCanvas - Canvas-based star background
 *
 * PERFORMANCE BENEFITS:
 * - Single <canvas> DOM element instead of 200+ divs
 * - GPU-accelerated rendering via requestAnimationFrame
 * - Lower memory usage
 * - No CSS animation overhead per-star
 *
 * MOBILE BROWSER FIX:
 * - Uses visualViewport API to handle address bar show/hide
 * - Prevents "jumping" when mobile browser chrome changes
 * - Canvas sized to layout viewport, not visual viewport
 *
 * Star counts: Desktop 275, Mobile 150
 */
export default function StarBackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  // Store logical dimensions (without DPR scaling)
  const dimensionsRef = useRef({ width: 0, height: 0 });
  // Track initial viewport height to prevent address bar resize issues
  const initialHeightRef = useRef(0);

  // Generate stars once on mount
  const generateStars = useCallback((width: number, height: number) => {
    const isMobile = width < 768;
    // Star counts: Desktop 275, Mobile 150
    const starCount = isMobile ? 150 : 275;
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      // 3 layers with different speeds (parallax effect)
      const layer = i % 3;
      // Speeds in pixels per second (extremely slow, barely perceptible motion)
      const speeds = [0.08, 0.15, 0.25]; // px/s - very gentle drift

      stars.push({
        x: Math.random() * width,
        y: Math.random() * height, // Start randomly distributed
        size: Math.random() * (layer * 0.4 + 0.6) + 0.3, // Smaller size range: 0.3-1.5px
        speed: speeds[layer],
        opacity: Math.random() * 0.4 + 0.4, // 0.4 to 0.8
      });
    }

    starsRef.current = stars;
  }, []);

  // Draw all stars on canvas
  const drawStars = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw each star
    for (const star of starsRef.current) {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fill();
    }
  }, []);

  // Animation loop
  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate delta time for frame-rate independent movement
    const deltaTime = lastTimeRef.current ? (timestamp - lastTimeRef.current) / 1000 : 0;
    lastTimeRef.current = timestamp;

    // Get logical dimensions (not scaled by DPR)
    const { width, height } = dimensionsRef.current;

    // Always update positions (removed scroll pause - was causing stars to disappear on mobile)
    if (deltaTime > 0 && deltaTime < 0.1) {
      // Update star positions (move upward)
      for (const star of starsRef.current) {
        star.y -= star.speed * deltaTime * 60; // Normalize to ~60fps base

        // Wrap around when star goes off top - use logical dimensions
        if (star.y < -star.size) {
          star.y = height + star.size;
          star.x = Math.random() * width; // New random X position
        }
      }
    }

    // Draw stars using logical dimensions
    drawStars(ctx, width, height);

    // Continue animation loop
    animationRef.current = requestAnimationFrame(animate);
  }, [drawStars]);

  // Handle resize - use initial height to prevent mobile address bar issues
  const handleResize = useCallback((forceRegenerate = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size to match viewport
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // On first resize, capture the initial height
    // This prevents stars from regenerating when mobile address bar hides/shows
    if (initialHeightRef.current === 0) {
      initialHeightRef.current = height;
    }

    // Use the larger of current or initial height to cover full possible area
    // This prevents "jumping" when mobile address bar hides
    const stableHeight = Math.max(height, initialHeightRef.current);

    // Store logical dimensions for animation loop
    dimensionsRef.current = { width, height: stableHeight };

    canvas.width = width * dpr;
    canvas.height = stableHeight * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${stableHeight}px`;

    // Scale context for retina displays
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    // Only regenerate stars on actual width changes or forced regenerate
    // Skip regeneration for height-only changes (mobile address bar)
    if (forceRegenerate || starsRef.current.length === 0) {
      generateStars(width, stableHeight);
    }
  }, [generateStars]);

  // Initialize canvas and start animation
  useEffect(() => {
    // Force regenerate on initial mount
    handleResize(true);

    // Start animation loop
    animationRef.current = requestAnimationFrame(animate);

    // Handle window resize - don't regenerate stars, just resize canvas
    const onResize = () => handleResize(false);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [handleResize, animate]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        backgroundColor: 'transparent',
      }}
    />
  );
}
