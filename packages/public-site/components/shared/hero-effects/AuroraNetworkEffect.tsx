'use client';

import { useRef, useEffect } from 'react';

/**
 * Aurora Effect — Canvas 2D hero background
 *
 * Wide, flowing curtains of light inspired by aurora borealis.
 * 6-pass additive rendering per band creates vibrant, glowing ribbons
 * with bright cyan/green cores that bloom outward into purple/magenta edges.
 * Bands sweep at different tilts to create depth — as if arcing overhead.
 *
 * Uses Canvas 2D with clearRect() to preserve alpha so the star
 * background shows through.
 *
 * Architecture: three useEffect hooks, stateRef holds all mutable
 * animation state (no React re-renders), own rAF loop with scroll boost.
 */

// --- Types ---

interface Harmonic {
  freq: number;
  amp: number;
  phaseOff: number;
  speedMul: number;
}

interface AuroraBand {
  tier: 'primary' | 'secondary' | 'accent';
  baseY: number;
  tilt: number;         // Y shift across canvas width (creates diagonal sweep)
  coreColor: string;    // bright inner color (cyan/green)
  edgeColor: string;    // outer glow color (purple/magenta shift)
  harmonics: Harmonic[];
  driftPhase: number;
  driftSpeed: number;
  driftAmp: number;
}

interface AnimState {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  dpr: number;
  bands: AuroraBand[];
  time: number;
  lastTimestamp: number;
  scrollBoost: number;
  paused: boolean;
  frameId: number;
  isMobile: boolean;
  animateFn: ((ts: number) => void) | null;
}

// --- Pass configs: [lineWidth, opacityMultiplier, colorBlend] ---
// colorBlend: 0 = pure edge color, 1 = pure core color
const DESKTOP_PASSES: [number, number, number][] = [
  [70, 0.030, 0.0],   // far glow — purple/edge
  [45, 0.050, 0.15],  // outer glow
  [28, 0.080, 0.35],  // mid glow
  [14, 0.140, 0.65],  // inner glow
  [6,  0.280, 0.88],  // core
  [2,  0.500, 1.0],   // hot core — whitened
];

const MOBILE_PASSES: [number, number, number][] = [
  [70, 0.030, 0.0],   // match desktop widths so streams look full-size
  [45, 0.050, 0.15],
  [28, 0.080, 0.35],
  [14, 0.140, 0.65],
  [6,  0.280, 0.88],
  [2,  0.500, 1.0],
];

const TIER_MUL: Record<string, number> = { primary: 1.0, secondary: 0.65, accent: 0.40 };
const TIER_ORDER: Record<string, number> = { accent: 0, secondary: 1, primary: 2 };

// --- Helpers ---

function hexToRgb(hex: string): [number, number, number] {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function lerpColor(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function computeBandY(band: AuroraBand, x: number, w: number, h: number, time: number): number {
  // Base Y with tilt — band arcs diagonally across the canvas
  const xNorm = x / w;
  let y = (band.baseY + (xNorm - 0.5) * band.tilt) * h;

  // Sum 4 harmonics for organic non-repeating shape
  for (const harm of band.harmonics) {
    y += Math.sin(x * harm.freq / w + time * harm.speedMul + harm.phaseOff) * harm.amp * h;
  }

  // Slow vertical drift
  y += Math.sin(time * band.driftSpeed + band.driftPhase) * h * band.driftAmp;

  return y;
}

// --- Build bands ---

function buildBands(): AuroraBand[] {
  const bands: AuroraBand[] = [];
  const F = [1.0, 1.618, 2.718, 4.414];

  // Primary bands — brightest, widest sweep, "closest" to viewer
  // Opposite tilts create crisscross depth pattern
  const primaries = [
    { baseY: 0.38, tilt: -0.18, core: '#00e5ff', edge: '#8040c0', ph: 0,   dAmp: 0.03 },
    { baseY: 0.62, tilt:  0.15, core: '#00ffaa', edge: '#6050b0', ph: 2.1, dAmp: 0.025 },
  ];
  for (const cfg of primaries) {
    bands.push({
      tier: 'primary', baseY: cfg.baseY, tilt: cfg.tilt,
      coreColor: cfg.core, edgeColor: cfg.edge,
      harmonics: [
        { freq: F[0] * 2.0, amp: 0.12,  phaseOff: cfg.ph,       speedMul: 0.30 },
        { freq: F[1] * 2.0, amp: 0.06,  phaseOff: cfg.ph + 1.2, speedMul: 0.50 },
        { freq: F[2] * 2.0, amp: 0.028, phaseOff: cfg.ph + 3.7, speedMul: 0.75 },
        { freq: F[3] * 2.0, amp: 0.012, phaseOff: cfg.ph + 5.1, speedMul: 1.00 },
      ],
      driftPhase: cfg.ph * 0.7, driftSpeed: 0.12, driftAmp: cfg.dAmp,
    });
  }

  // Secondary bands — medium brightness, "mid-depth"
  const secondaries = [
    { baseY: 0.24, tilt: -0.10, core: '#00aaff', edge: '#7030a0', ph: 1.4, dAmp: 0.02 },
    { baseY: 0.76, tilt:  0.12, core: '#00ccaa', edge: '#5060c0', ph: 3.8, dAmp: 0.018 },
  ];
  for (const cfg of secondaries) {
    bands.push({
      tier: 'secondary', baseY: cfg.baseY, tilt: cfg.tilt,
      coreColor: cfg.core, edgeColor: cfg.edge,
      harmonics: [
        { freq: F[0] * 1.8, amp: 0.09,  phaseOff: cfg.ph,       speedMul: 0.22 },
        { freq: F[1] * 1.8, amp: 0.045, phaseOff: cfg.ph + 0.9, speedMul: 0.40 },
        { freq: F[2] * 1.8, amp: 0.020, phaseOff: cfg.ph + 2.8, speedMul: 0.60 },
        { freq: F[3] * 1.8, amp: 0.009, phaseOff: cfg.ph + 4.6, speedMul: 0.85 },
      ],
      driftPhase: cfg.ph * 0.5, driftSpeed: 0.08, driftAmp: cfg.dAmp,
    });
  }

  // Accent band — subtle, "furthest back"
  bands.push({
    tier: 'accent', baseY: 0.48, tilt: -0.06,
    coreColor: '#0088ff', edgeColor: '#6040a0',
    harmonics: [
      { freq: F[0] * 2.4, amp: 0.07,  phaseOff: 4.2,       speedMul: 0.18 },
      { freq: F[1] * 2.4, amp: 0.035, phaseOff: 4.2 + 1.5, speedMul: 0.35 },
      { freq: F[2] * 2.4, amp: 0.016, phaseOff: 4.2 + 3.3, speedMul: 0.52 },
      { freq: F[3] * 2.4, amp: 0.007, phaseOff: 4.2 + 5.8, speedMul: 0.72 },
    ],
    driftPhase: 2.9, driftSpeed: 0.06, driftAmp: 0.015,
  });

  return bands;
}

export function AuroraNetworkEffect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<AnimState | null>(null);
  const initedRef = useRef(false);

  // Pause/resume based on visibility
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const s = stateRef.current;
        if (!s) return;
        if (entries[0].isIntersecting) {
          if (s.paused && s.animateFn) {
            s.paused = false;
            s.lastTimestamp = 0;
            s.frameId = requestAnimationFrame(s.animateFn);
          }
        } else {
          s.paused = true;
          cancelAnimationFrame(s.frameId);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Dispose on unmount (reset initedRef so re-mount in Strict Mode works)
  useEffect(() => {
    return () => {
      const s = stateRef.current;
      if (s) {
        cancelAnimationFrame(s.frameId);
        s.canvas.remove();
        stateRef.current = null;
      }
      initedRef.current = false;
    };
  }, []);

  // Initialize once
  useEffect(() => {
    if (initedRef.current || !containerRef.current) return;
    initedRef.current = true;

    const container = containerRef.current;
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = container.clientWidth;
    const h = container.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const isMobile = w < 768;
    const bands = buildBands();

    // --- Scroll boost listener ---
    let lastScrollY = window.scrollY;
    let scrollBoost = 0;

    const onScroll = () => {
      const delta = Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
      scrollBoost = Math.min(delta * 0.02, 2);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // --- Store state ---
    const state: AnimState = {
      canvas, ctx, w, h, dpr,
      bands,
      time: 0,
      lastTimestamp: 0,
      scrollBoost: 0,
      paused: false,
      frameId: 0,
      isMobile,
      animateFn: null,
    };
    stateRef.current = state;

    // --- Resize handler ---
    const ro = new ResizeObserver(() => {
      if (!container.isConnected) return;
      const s = stateRef.current;
      if (!s) return;

      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW === s.w && newH === s.h) return;

      const newDpr = Math.min(window.devicePixelRatio, 2);
      s.canvas.width = newW * newDpr;
      s.canvas.height = newH * newDpr;
      s.ctx.setTransform(newDpr, 0, 0, newDpr, 0, 0);
      s.w = newW;
      s.h = newH;
      s.dpr = newDpr;
      s.isMobile = newW < 768;

      // Rebuild bands for new breakpoint
      s.bands = buildBands();
    });
    ro.observe(container);

    // Store animate function reference for IntersectionObserver resume
    state.animateFn = animate;

    // Start animation
    state.frameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };

    // --- Animation frame ---
    function animate(timestamp: number) {
      const s = stateRef.current;
      if (!s || s.paused) return;

      // Delta time
      if (s.lastTimestamp === 0) s.lastTimestamp = timestamp;
      const rawDt = (timestamp - s.lastTimestamp) / 1000;
      const dt = Math.min(rawDt, 0.1);
      s.lastTimestamp = timestamp;

      // Apply scroll boost from listener
      s.scrollBoost = scrollBoost;
      scrollBoost *= 0.92;

      s.time += dt * (1 + s.scrollBoost);

      const { ctx: c, w: cw, h: ch, time: t } = s;
      const step = s.isMobile ? 4 : 3;
      const passes = s.isMobile ? MOBILE_PASSES : DESKTOP_PASSES;

      // Clear — transparent background
      c.clearRect(0, 0, cw, ch);

      // ═══════════════════════════════════════
      // AURORA BANDS (back to front: accent → secondary → primary)
      // ═══════════════════════════════════════
      c.globalCompositeOperation = 'lighter';

      // Sort back-to-front
      const sorted = [...s.bands].sort(
        (a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier]
      );

      for (const band of sorted) {
        const coreRgb = hexToRgb(band.coreColor);
        const edgeRgb = hexToRgb(band.edgeColor);
        const tierMul = TIER_MUL[band.tier];

        // 6 passes from widest/dimmest to narrowest/brightest
        for (const [lw, opMul, blend] of passes) {
          // Blend between edge color (outer) and core color (inner)
          const [cr, cg, cb] = lerpColor(edgeRgb, coreRgb, blend);
          // For the hot core pass, push toward white
          const white: [number, number, number] = [255, 255, 255];
          const [fr, fg, fb] = blend >= 1.0
            ? lerpColor(coreRgb, white, 0.35)
            : [cr, cg, cb];

          const opacity = opMul * tierMul;

          c.beginPath();
          c.lineWidth = lw;
          c.strokeStyle = `rgba(${fr},${fg},${fb},${opacity})`;
          c.lineCap = 'round';
          c.lineJoin = 'round';

          let first = true;
          for (let px = -40; px <= cw + 40; px += step) {
            const y = computeBandY(band, px, cw, ch, t);
            if (first) {
              c.moveTo(px, y);
              first = false;
            } else {
              c.lineTo(px, y);
            }
          }
          c.stroke();
        }
      }

      // ═══════════════════════════════════════
      // CENTER VOID MASK (text readability)
      // ═══════════════════════════════════════
      c.globalCompositeOperation = 'destination-out';

      const voidW = cw * (s.isMobile ? 0.30 : 0.35);
      const voidH = ch * (s.isMobile ? 0.20 : 0.25);
      const vcx = cw / 2;
      const vcy = ch / 2;

      const voidGrad = c.createRadialGradient(vcx, vcy, 0, vcx, vcy, 1);
      voidGrad.addColorStop(0, 'rgba(0,0,0,0.85)');
      voidGrad.addColorStop(0.6, 'rgba(0,0,0,0.4)');
      voidGrad.addColorStop(1, 'rgba(0,0,0,0)');

      c.save();
      c.translate(vcx, vcy);
      c.scale(voidW, voidH);
      c.beginPath();
      c.arc(0, 0, 1, 0, Math.PI * 2);
      c.fillStyle = voidGrad;
      c.fill();
      c.restore();

      s.frameId = requestAnimationFrame(animate);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

export default AuroraNetworkEffect;
