'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

export interface GoldenAmbientBackgroundProps {
  /** Only animate when visible (e.g., panel is open) */
  isVisible: boolean;
}

// ---------- Hex grid types & constants ----------

interface HexCell {
  cx: number;
  cy: number;
  /** Pre-computed flat-top hex vertices */
  verts: { x: number; y: number }[];
  /** Column index (for stagger) */
  col: number;
  row: number;
}

interface Pulse {
  /** Origin coordinates */
  ox: number;
  oy: number;
  /** Current radius of the expanding ring */
  radius: number;
  /** Maximum radius before pulse is retired */
  maxRadius: number;
  /** Speed: pixels per frame */
  speed: number;
  /** Ring thickness */
  width: number;
}

const HEX_RADIUS = 32;
const PULSE_RING_WIDTH = 90;
const PULSE_SPEED_MIN = 1.8;
const PULSE_SPEED_MAX = 2.8;
const PULSE_INTERVAL_MIN = 80;   // frames (~1.3s at 60fps)
const PULSE_INTERVAL_MAX = 200;  // frames (~3.3s)
const MAX_CONCURRENT_PULSES = 3;

// Flat-top hexagon vertices
function hexVertices(cx: number, cy: number, r: number): { x: number; y: number }[] {
  const verts: { x: number; y: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    verts.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
  }
  return verts;
}

// ---------- Component ----------

export function GoldenAmbientBackground({ isVisible }: GoldenAmbientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hexGridRef = useRef<HexCell[]>([]);
  const pulsesRef = useRef<Pulse[]>([]);
  const rafRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });
  const frameCountRef = useRef(0);
  const nextPulseRef = useRef(0);
  const [fadedIn, setFadedIn] = useState(false);

  // ---- build hex grid ----

  const buildGrid = useCallback((w: number, h: number) => {
    const cells: HexCell[] = [];
    const r = HEX_RADIUS;
    const colWidth = r * 1.5;
    const rowHeight = r * Math.sqrt(3);
    const cols = Math.ceil(w / colWidth) + 2;
    const rows = Math.ceil(h / rowHeight) + 2;

    for (let col = -1; col < cols; col++) {
      for (let row = -1; row < rows; row++) {
        const cx = col * colWidth;
        const cy = row * rowHeight + (col % 2 === 0 ? 0 : rowHeight * 0.5);
        cells.push({
          cx,
          cy,
          verts: hexVertices(cx, cy, r),
          col,
          row,
        });
      }
    }
    hexGridRef.current = cells;
  }, []);

  // ---- spawn a pulse ----

  const spawnPulse = useCallback(() => {
    const { w, h } = sizeRef.current;
    if (w === 0 || h === 0) return;
    const grid = hexGridRef.current;
    if (grid.length === 0) return;

    // Pick a random hex as the origin
    const origin = grid[Math.floor(Math.random() * grid.length)];
    const maxR = Math.sqrt(w * w + h * h);

    pulsesRef.current.push({
      ox: origin.cx,
      oy: origin.cy,
      radius: 0,
      maxRadius: maxR,
      speed: PULSE_SPEED_MIN + Math.random() * (PULSE_SPEED_MAX - PULSE_SPEED_MIN),
      width: PULSE_RING_WIDTH,
    });

    // Limit concurrency
    if (pulsesRef.current.length > MAX_CONCURRENT_PULSES) {
      pulsesRef.current.shift();
    }
  }, []);

  // ---- draw frame ----

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const { w, h } = sizeRef.current;
    if (w === 0 || h === 0) return;

    const grid = hexGridRef.current;
    const pulses = pulsesRef.current;

    // --- Background: deep space ---
    ctx.fillStyle = '#06060a';
    ctx.fillRect(0, 0, w, h);

    // Subtle radial vignette
    const vig = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.7);
    vig.addColorStop(0, 'rgba(20, 16, 8, 0.4)');
    vig.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);

    // --- Advance pulses ---
    for (let i = pulses.length - 1; i >= 0; i--) {
      pulses[i].radius += pulses[i].speed;
      if (pulses[i].radius > pulses[i].maxRadius + pulses[i].width) {
        pulses.splice(i, 1);
      }
    }

    // --- Draw hex grid ---
    for (let i = 0; i < grid.length; i++) {
      const cell = grid[i];

      // Calculate pulse intensity for this cell
      let intensity = 0;
      for (let p = 0; p < pulses.length; p++) {
        const pulse = pulses[p];
        const dx = cell.cx - pulse.ox;
        const dy = cell.cy - pulse.oy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ringDist = Math.abs(dist - pulse.radius);

        if (ringDist < pulse.width) {
          // Smooth falloff within the ring
          const ringIntensity = 1 - ringDist / pulse.width;
          // Fade out as pulse expands
          const ageFade = 1 - pulse.radius / pulse.maxRadius;
          intensity = Math.max(intensity, ringIntensity * ringIntensity * ageFade);
        }
      }

      const v = cell.verts;

      // Hex fill glow (only when pulsed)
      if (intensity > 0.05) {
        ctx.beginPath();
        ctx.moveTo(v[0].x, v[0].y);
        for (let j = 1; j < 6; j++) ctx.lineTo(v[j].x, v[j].y);
        ctx.closePath();
        ctx.fillStyle = `rgba(255, 215, 0, ${intensity * 0.12})`;
        ctx.fill();
      }

      // Hex edge
      ctx.beginPath();
      ctx.moveTo(v[0].x, v[0].y);
      for (let j = 1; j < 6; j++) ctx.lineTo(v[j].x, v[j].y);
      ctx.closePath();

      // Base edge: very dim gold. Pulsed: brighter gold
      const baseAlpha = 0.06;
      const edgeAlpha = baseAlpha + intensity * 0.45;
      ctx.strokeStyle = `rgba(255, 215, 0, ${edgeAlpha})`;
      ctx.lineWidth = intensity > 0.1 ? 1.2 : 0.6;
      ctx.stroke();

      // Bright node dots at vertices when pulsed
      if (intensity > 0.2) {
        const dotAlpha = intensity * 0.7;
        const dotRadius = 1.5 + intensity * 1.5;
        ctx.fillStyle = `rgba(255, 230, 100, ${dotAlpha})`;
        for (let j = 0; j < 6; j++) {
          ctx.beginPath();
          ctx.arc(v[j].x, v[j].y, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // --- Pulse origin glow ---
    for (let p = 0; p < pulses.length; p++) {
      const pulse = pulses[p];
      const ageFade = Math.max(0, 1 - pulse.radius / (pulse.width * 3));
      if (ageFade > 0) {
        const glow = ctx.createRadialGradient(pulse.ox, pulse.oy, 0, pulse.ox, pulse.oy, HEX_RADIUS * 2);
        glow.addColorStop(0, `rgba(255, 215, 0, ${ageFade * 0.25})`);
        glow.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(pulse.ox, pulse.oy, HEX_RADIUS * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, []);

  // ---- animation loop ----

  const loop = useCallback((ctx: CanvasRenderingContext2D) => {
    const tick = () => {
      frameCountRef.current++;

      // Spawn pulses on schedule
      if (frameCountRef.current >= nextPulseRef.current) {
        spawnPulse();
        nextPulseRef.current = frameCountRef.current +
          PULSE_INTERVAL_MIN + Math.floor(Math.random() * (PULSE_INTERVAL_MAX - PULSE_INTERVAL_MIN));
      }

      draw(ctx);
      rafRef.current = requestAnimationFrame(tick);
    };
    // Kick off first pulse quickly
    nextPulseRef.current = frameCountRef.current + 20;
    rafRef.current = requestAnimationFrame(tick);
  }, [draw, spawnPulse]);

  // ---- sizing ----

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      sizeRef.current = { w, h };
      buildGrid(w, h);
    };

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    return () => ro.disconnect();
  }, [buildGrid]);

  // ---- start / stop animation based on visibility ----

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (isVisible) {
      const { w, h } = sizeRef.current;
      if (hexGridRef.current.length === 0 && w > 0 && h > 0) {
        buildGrid(w, h);
      }
      frameCountRef.current = 0;
      pulsesRef.current = [];
      loop(ctx);

      requestAnimationFrame(() => setFadedIn(true));
    } else {
      cancelAnimationFrame(rafRef.current);
      setFadedIn(false);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible, loop, buildGrid]);

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
