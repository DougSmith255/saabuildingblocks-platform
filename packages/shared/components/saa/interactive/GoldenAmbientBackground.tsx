'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

export interface GoldenAmbientBackgroundProps {
  /** Only animate when visible (e.g., panel is open) */
  isVisible: boolean;
}

// ---------- Particle types & constants ----------

interface BokehParticle {
  x: number;
  y: number;
  radius: number;
  /** Base opacity before pulse */
  baseOpacity: number;
  /** Current opacity (after pulse) */
  opacity: number;
  /** Drift speed – pixels per frame at 60 fps */
  vx: number;
  vy: number;
  /** Pulse phase offset (radians) */
  pulseOffset: number;
  /** Pulse speed multiplier */
  pulseSpeed: number;
  /** RGBA colour string (without alpha) */
  color: string;
}

const PARTICLE_COUNT = 70;

const COLORS = [
  '255, 215, 0',    // gold  #ffd700
  '255, 183, 0',    // amber #ffb700
  '255, 228, 181',  // champagne #ffe4b5
  '184, 134, 11',   // deep copper #b8860b
  '218, 165, 32',   // goldenrod #daa520
];

// ---------- Component ----------

export function GoldenAmbientBackground({ isVisible }: GoldenAmbientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<BokehParticle[]>([]);
  const rafRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });
  const [fadedIn, setFadedIn] = useState(false);

  // ---- helpers ----

  const rand = (min: number, max: number) => Math.random() * (max - min) + min;

  const createParticle = useCallback((w: number, h: number): BokehParticle => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x: rand(0, w),
      y: rand(0, h),
      radius: rand(5, 40),
      baseOpacity: rand(0.05, 0.25),
      opacity: 0,
      vx: rand(-0.25, 0.25),
      vy: rand(-0.15, 0.15),
      pulseOffset: rand(0, Math.PI * 2),
      pulseSpeed: rand(0.008, 0.025),
      color,
    };
  }, []);

  const initParticles = useCallback((w: number, h: number) => {
    const particles: BokehParticle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle(w, h));
    }
    particlesRef.current = particles;
  }, [createParticle]);

  // ---- animation loop ----

  const draw = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    const { w, h } = sizeRef.current;
    if (w === 0 || h === 0) return;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Base gradient: deep dark amber → black
    const baseGrad = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.75);
    baseGrad.addColorStop(0, 'rgba(40, 28, 8, 0.95)');
    baseGrad.addColorStop(0.5, 'rgba(18, 12, 4, 0.98)');
    baseGrad.addColorStop(1, 'rgba(6, 4, 2, 1)');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, w, h);

    // Draw bokeh particles
    const particles = particlesRef.current;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Pulse opacity
      const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.5 + 0.5; // 0-1
      p.opacity = p.baseOpacity * (0.5 + pulse * 0.5);

      // Drift
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges with padding
      if (p.x < -p.radius * 2) p.x = w + p.radius;
      if (p.x > w + p.radius * 2) p.x = -p.radius;
      if (p.y < -p.radius * 2) p.y = h + p.radius;
      if (p.y > h + p.radius * 2) p.y = -p.radius;

      // Draw soft bokeh circle with radial gradient
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
      grad.addColorStop(0, `rgba(${p.color}, ${p.opacity})`);
      grad.addColorStop(0.6, `rgba(${p.color}, ${p.opacity * 0.4})`);
      grad.addColorStop(1, `rgba(${p.color}, 0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Central golden glow overlay
    const glowGrad = ctx.createRadialGradient(w * 0.5, h * 0.35, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.6);
    glowGrad.addColorStop(0, 'rgba(255, 215, 0, 0.06)');
    glowGrad.addColorStop(0.4, 'rgba(255, 183, 0, 0.03)');
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, w, h);
  }, []);

  const loop = useCallback((ctx: CanvasRenderingContext2D) => {
    let frame = 0;
    const tick = () => {
      frame++;
      draw(ctx, frame);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [draw]);

  // ---- sizing ----

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap at 2x for perf
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      sizeRef.current = { w, h };

      // Re-init particles when size changes significantly
      if (particlesRef.current.length === 0) {
        initParticles(w, h);
      }
    };

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    return () => ro.disconnect();
  }, [initParticles]);

  // ---- start / stop animation based on visibility ----

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (isVisible) {
      // Ensure particles exist
      const { w, h } = sizeRef.current;
      if (particlesRef.current.length === 0 && w > 0 && h > 0) {
        initParticles(w, h);
      }
      loop(ctx);

      // Trigger fade-in after first frame
      requestAnimationFrame(() => setFadedIn(true));
    } else {
      cancelAnimationFrame(rafRef.current);
      setFadedIn(false);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible, loop, initParticles]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        borderRadius: 'inherit',
        opacity: fadedIn ? 1 : 0,
        transition: 'opacity 0.6s ease-out',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}

export default GoldenAmbientBackground;
