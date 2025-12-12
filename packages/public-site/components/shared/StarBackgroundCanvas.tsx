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
 * Star counts: Desktop 275, Mobile 150
 */
export default function StarBackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>(0);
  const isScrollingRef = useRef(false);
  const lastTimeRef = useRef(0);

  // Generate stars once on mount
  const generateStars = useCallback((width: number, height: number) => {
    const isMobile = width < 768;
    // Star counts: Desktop 275, Mobile 150
    const starCount = isMobile ? 150 : 275;
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      // 3 layers with different speeds (parallax effect)
      const layer = i % 3;
      // Speeds in pixels per second (slower = more subtle floating motion)
      const speeds = [0.4, 0.6, 0.9]; // px/s - halved for gentler motion

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

    // Only update positions if not scrolling (matches CSS behavior)
    if (!isScrollingRef.current && deltaTime > 0 && deltaTime < 0.1) {
      const height = canvas.height;

      // Update star positions (move upward)
      for (const star of starsRef.current) {
        star.y -= star.speed * deltaTime * 60; // Normalize to ~60fps base

        // Wrap around when star goes off top
        if (star.y < -star.size) {
          star.y = height + star.size;
          star.x = Math.random() * canvas.width; // New random X position
        }
      }
    }

    // Draw stars
    drawStars(ctx, canvas.width, canvas.height);

    // Continue animation loop
    animationRef.current = requestAnimationFrame(animate);
  }, [drawStars]);

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size to match viewport
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Scale context for retina displays
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    // Regenerate stars for new dimensions
    generateStars(width, height);
  }, [generateStars]);

  // Set up scroll detection (pause animation during scroll for performance)
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      isScrollingRef.current = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrollingRef.current = false;
      }, 150); // Resume after 150ms of no scroll
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Initialize canvas and start animation
  useEffect(() => {
    handleResize();

    // Start animation loop
    animationRef.current = requestAnimationFrame(animate);

    // Handle window resize
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
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
