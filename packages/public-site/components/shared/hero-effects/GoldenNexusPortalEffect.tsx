'use client';

import { useRef, useEffect } from 'react';

/**
 * Golden Nexus Portal Effect — Canvas 2D hero background
 *
 * Gold particles spiral inward along orbital paths toward a glowing golden ring,
 * bursting outward as sparks on arrival. Metaphor: "everything converges here."
 *
 * Architecture mirrors AuroraNetworkEffect.tsx:
 * - Three useEffect hooks (IntersectionObserver, unmount cleanup, init-once)
 * - stateRef holds all mutable animation state (no React re-renders)
 * - Own rAF loop with inline scroll-boost logic
 */

// --- Types ---
interface SpiralParticle {
  theta: number;
  radius: number;
  startRadius: number;
  dTheta: number;
  dRadius: number;
  phase: number;
  size: number;
  trail: { x: number; y: number; alpha: number }[];
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  active: boolean;
}

interface DustMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
}

interface AnimState {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  dpr: number;
  cx: number;
  cy: number;
  ringRadius: number;
  particles: SpiralParticle[];
  sparks: Spark[];
  dust: DustMote[];
  time: number;
  lastTimestamp: number;
  scrollBoost: number;
  paused: boolean;
  frameId: number;
  isMobile: boolean;
  trailLength: number;
  sparksPerBurst: [number, number];
  hotspotCount: number;
  animateFn: ((ts: number) => void) | null;
}

// --- Colors ---
const GOLD_PRIMARY = '#ffd700';
const GOLD_WARM = '#ffb347';
const AMBER_DEEP = '#ffb400';
const GOLD_HOT = '#fff0b4';
const GOLD_PALE = '#ffe680';
const WHITE_GOLD = '#fff8e0';
const AMBER_DUST = '#cc9500';

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const val = parseInt(hex.slice(1), 16);
  return { r: (val >> 16) & 255, g: (val >> 8) & 255, b: val & 255 };
}

const RGB_GOLD_PRIMARY = hexToRgb(GOLD_PRIMARY);
const RGB_GOLD_WARM = hexToRgb(GOLD_WARM);
const RGB_AMBER_DEEP = hexToRgb(AMBER_DEEP);
const RGB_GOLD_HOT = hexToRgb(GOLD_HOT);
const RGB_GOLD_PALE = hexToRgb(GOLD_PALE);
const RGB_WHITE_GOLD = hexToRgb(WHITE_GOLD);
const RGB_AMBER_DUST = hexToRgb(AMBER_DUST);

// --- Helpers ---
function createParticle(w: number, h: number, ringRadius: number): SpiralParticle {
  const minSpawn = ringRadius * 2.5;
  const maxSpawn = Math.max(w, h) * 0.7;
  const startRadius = minSpawn + Math.random() * (maxSpawn - minSpawn);
  return {
    theta: Math.random() * Math.PI * 2,
    radius: startRadius,
    startRadius,
    dTheta: (0.4 + Math.random() * 0.6) * (Math.random() < 0.5 ? 1 : -1),
    dRadius: 30 + Math.random() * 50,
    phase: Math.random() * Math.PI * 2,
    size: 1.5 + Math.random() * 2,
    trail: [],
  };
}

function resetParticle(p: SpiralParticle, w: number, h: number, ringRadius: number): void {
  const minSpawn = ringRadius * 2.5;
  const maxSpawn = Math.max(w, h) * 0.7;
  p.startRadius = minSpawn + Math.random() * (maxSpawn - minSpawn);
  p.radius = p.startRadius;
  p.theta = Math.random() * Math.PI * 2;
  p.dTheta = (0.4 + Math.random() * 0.6) * (Math.random() < 0.5 ? 1 : -1);
  p.dRadius = 30 + Math.random() * 50;
  p.phase = Math.random() * Math.PI * 2;
  p.size = 1.5 + Math.random() * 2;
  p.trail.length = 0;
}

function createDustMote(w: number, h: number): DustMote {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 8,
    vy: (Math.random() - 0.5) * 8,
    size: 0.5 + Math.random() * 1.5,
    phase: Math.random() * Math.PI * 2,
  };
}

function spawnSpark(spark: Spark, x: number, y: number): void {
  const angle = Math.random() * Math.PI * 2;
  const speed = 80 + Math.random() * 120;
  spark.x = x;
  spark.y = y;
  spark.vx = Math.cos(angle) * speed;
  spark.vy = Math.sin(angle) * speed;
  spark.maxLife = 0.4 + Math.random() * 0.4;
  spark.life = spark.maxLife;
  spark.size = 1 + Math.random() * 2;
  spark.active = true;
}

export function GoldenNexusPortalEffect() {
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

  // Dispose on unmount
  useEffect(() => {
    return () => {
      const s = stateRef.current;
      if (s) {
        cancelAnimationFrame(s.frameId);
        s.canvas.remove();
        stateRef.current = null;
      }
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
    const cx = w / 2;
    const cy = h / 2;
    const ringRadius = Math.min(w, h) * (isMobile ? 0.22 : 0.18);

    // --- Configuration ---
    const particleCount = isMobile ? 30 : 60;
    const trailLength = isMobile ? 3 : 5;
    const sparkPoolSize = isMobile ? 20 : 40;
    const sparksPerBurst: [number, number] = isMobile ? [2, 3] : [3, 5];
    const dustCount = isMobile ? 15 : 30;
    const hotspotCount = isMobile ? 2 : 4;

    // --- Create Spiral Particles ---
    const particles: SpiralParticle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(w, h, ringRadius));
    }

    // --- Create Spark Pool ---
    const sparks: Spark[] = [];
    for (let i = 0; i < sparkPoolSize; i++) {
      sparks.push({ x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0, size: 0, active: false });
    }

    // --- Create Dust Motes ---
    const dust: DustMote[] = [];
    for (let i = 0; i < dustCount; i++) {
      dust.push(createDustMote(w, h));
    }

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
      canvas, ctx, w, h, dpr, cx, cy, ringRadius,
      particles, sparks, dust,
      time: 0,
      lastTimestamp: 0,
      scrollBoost: 0,
      paused: false,
      frameId: 0,
      isMobile,
      trailLength,
      sparksPerBurst,
      hotspotCount,
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
      s.cx = newW / 2;
      s.cy = newH / 2;
      s.ringRadius = Math.min(newW, newH) * (s.isMobile ? 0.22 : 0.18);
      s.trailLength = s.isMobile ? 3 : 5;
      s.sparksPerBurst = s.isMobile ? [2, 3] : [3, 5];
      s.hotspotCount = s.isMobile ? 2 : 4;

      // Regenerate particles
      const newParticleCount = s.isMobile ? 30 : 60;
      s.particles.length = 0;
      for (let i = 0; i < newParticleCount; i++) {
        s.particles.push(createParticle(newW, newH, s.ringRadius));
      }

      // Reset sparks
      const newSparkPoolSize = s.isMobile ? 20 : 40;
      s.sparks.length = 0;
      for (let i = 0; i < newSparkPoolSize; i++) {
        s.sparks.push({ x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0, size: 0, active: false });
      }

      // Regenerate dust
      const newDustCount = s.isMobile ? 15 : 30;
      s.dust.length = 0;
      for (let i = 0; i < newDustCount; i++) {
        s.dust.push(createDustMote(newW, newH));
      }
    });
    ro.observe(container);

    // Store animate function reference for IntersectionObserver resume
    state.animateFn = animate;

    // Start animation
    state.frameId = requestAnimationFrame(animate);

    // Cleanup
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

      // Apply scroll boost
      s.scrollBoost = scrollBoost;
      scrollBoost *= 0.92;

      s.time += dt * (1 + s.scrollBoost);

      const { ctx: c, w: cw, h: ch, time: t, cx: ccx, cy: ccy, ringRadius: rr } = s;

      // ═══════════════════════════════════════
      // Pass 0: CLEAR (transparent background)
      // ═══════════════════════════════════════
      c.clearRect(0, 0, cw, ch);

      // ═══════════════════════════════════════
      // Pass 1: AMBIENT DUST MOTES
      // ═══════════════════════════════════════
      c.globalCompositeOperation = 'source-over';

      for (const mote of s.dust) {
        mote.x += mote.vx * dt;
        mote.y += mote.vy * dt;

        // Wrap around edges
        if (mote.x < -10) mote.x = cw + 10;
        if (mote.x > cw + 10) mote.x = -10;
        if (mote.y < -10) mote.y = ch + 10;
        if (mote.y > ch + 10) mote.y = -10;

        const flicker = 0.025 + Math.sin(t * 0.8 + mote.phase) * 0.015;

        c.beginPath();
        c.arc(mote.x, mote.y, mote.size, 0, Math.PI * 2);
        c.fillStyle = `rgba(${RGB_AMBER_DUST.r},${RGB_AMBER_DUST.g},${RGB_AMBER_DUST.b},${flicker})`;
        c.fill();
      }

      // ═══════════════════════════════════════
      // Pass 2: SPIRAL PARTICLES + TRAILS
      // ═══════════════════════════════════════
      c.globalCompositeOperation = 'lighter';

      for (const p of s.particles) {
        // Logarithmic spiral with sinusoidal wobble
        const wobble = Math.sin(t * 1.5 + p.phase) * 0.15
          + Math.sin(t * 0.7 + p.phase * 2.3) * 0.08;

        // Angular velocity increases near center
        const radiusRatio = p.radius / p.startRadius;
        const angularBoost = 1 + (1 - radiusRatio) * 3;

        p.theta += p.dTheta * dt * (1 + wobble) * angularBoost;

        // Radial decay accelerates as radius shrinks (gravity-well)
        const gravityPull = 1 + (p.startRadius - p.radius) * 0.002;
        p.radius -= p.dRadius * dt * gravityPull;

        // Position with elliptical squish
        const px = ccx + Math.cos(p.theta) * p.radius;
        const py = ccy + Math.sin(p.theta) * p.radius * 0.75;

        // Store trail ghost
        p.trail.unshift({ x: px, y: py, alpha: 1 });
        if (p.trail.length > s.trailLength + 1) {
          p.trail.length = s.trailLength + 1;
        }

        // Draw trail ghosts
        for (let g = p.trail.length - 1; g >= 1; g--) {
          const ghost = p.trail[g];
          const ghostAlpha = 0.3 * (1 - g / (s.trailLength + 1));
          const ghostSize = p.size * (1 - g * 0.15);

          if (ghostSize > 0 && ghostAlpha > 0.01) {
            c.beginPath();
            c.arc(ghost.x, ghost.y, ghostSize, 0, Math.PI * 2);
            c.fillStyle = `rgba(${RGB_GOLD_WARM.r},${RGB_GOLD_WARM.g},${RGB_GOLD_WARM.b},${ghostAlpha})`;
            c.fill();
          }
        }

        // Draw particle head with glow
        const headGlow = c.createRadialGradient(px, py, 0, px, py, p.size * 5);
        headGlow.addColorStop(0, `rgba(${RGB_GOLD_PRIMARY.r},${RGB_GOLD_PRIMARY.g},${RGB_GOLD_PRIMARY.b},0.7)`);
        headGlow.addColorStop(0.4, `rgba(${RGB_GOLD_PRIMARY.r},${RGB_GOLD_PRIMARY.g},${RGB_GOLD_PRIMARY.b},0.15)`);
        headGlow.addColorStop(1, `rgba(${RGB_GOLD_PRIMARY.r},${RGB_GOLD_PRIMARY.g},${RGB_GOLD_PRIMARY.b},0)`);

        c.beginPath();
        c.arc(px, py, p.size * 5, 0, Math.PI * 2);
        c.fillStyle = headGlow;
        c.fill();

        // Bright core
        c.beginPath();
        c.arc(px, py, p.size, 0, Math.PI * 2);
        c.fillStyle = `rgba(${RGB_GOLD_HOT.r},${RGB_GOLD_HOT.g},${RGB_GOLD_HOT.b},0.9)`;
        c.fill();

        // Check ring collision — spawn sparks and reset
        if (p.radius <= rr) {
          const hitX = ccx + Math.cos(p.theta) * rr;
          const hitY = ccy + Math.sin(p.theta) * rr * 0.75;

          // Spawn sparks
          const burstCount = s.sparksPerBurst[0]
            + Math.floor(Math.random() * (s.sparksPerBurst[1] - s.sparksPerBurst[0] + 1));

          let spawned = 0;
          for (const spark of s.sparks) {
            if (!spark.active && spawned < burstCount) {
              spawnSpark(spark, hitX, hitY);
              spawned++;
            }
            if (spawned >= burstCount) break;
          }

          // Reset particle to outer position
          resetParticle(p, cw, ch, rr);
        }
      }

      // ═══════════════════════════════════════
      // Pass 3: RING OUTER GLOW
      // ═══════════════════════════════════════
      const glowPulse = 1 + Math.sin(t * 1.2) * 0.15;
      const outerGlowRadius = rr * 1.8 * glowPulse;

      const outerGlow = c.createRadialGradient(ccx, ccy, rr * 0.7, ccx, ccy, outerGlowRadius);
      outerGlow.addColorStop(0, `rgba(${RGB_AMBER_DEEP.r},${RGB_AMBER_DEEP.g},${RGB_AMBER_DEEP.b},0)`);
      outerGlow.addColorStop(0.5, `rgba(${RGB_AMBER_DEEP.r},${RGB_AMBER_DEEP.g},${RGB_AMBER_DEEP.b},0.06)`);
      outerGlow.addColorStop(0.75, `rgba(${RGB_AMBER_DEEP.r},${RGB_AMBER_DEEP.g},${RGB_AMBER_DEEP.b},0.03)`);
      outerGlow.addColorStop(1, `rgba(${RGB_AMBER_DEEP.r},${RGB_AMBER_DEEP.g},${RGB_AMBER_DEEP.b},0)`);

      c.beginPath();
      c.arc(ccx, ccy, outerGlowRadius, 0, Math.PI * 2);
      c.fillStyle = outerGlow;
      c.fill();

      // ═══════════════════════════════════════
      // Pass 4: RING CORE + HOTSPOTS
      // ═══════════════════════════════════════

      // Multi-pass ring strokes (4 concentric arcs)
      const ringPasses = [
        { widthMul: 1, opacity: 0.35, color: RGB_GOLD_PRIMARY },
        { widthMul: 2.5, opacity: 0.12, color: RGB_GOLD_PRIMARY },
        { widthMul: 5, opacity: 0.05, color: RGB_GOLD_WARM },
        { widthMul: 9, opacity: 0.02, color: RGB_AMBER_DEEP },
      ];

      // Slight elliptical ring to match particle perspective
      c.save();
      c.translate(ccx, ccy);
      c.scale(1, 0.75);

      for (const pass of ringPasses) {
        const pulse = 1 + Math.sin(t * 1.8 + pass.widthMul) * 0.08;
        c.beginPath();
        c.arc(0, 0, rr, 0, Math.PI * 2);
        c.strokeStyle = `rgba(${pass.color.r},${pass.color.g},${pass.color.b},${pass.opacity * pulse})`;
        c.lineWidth = pass.widthMul * 2;
        c.stroke();
      }

      // Rotating bright hotspot arcs
      for (let i = 0; i < s.hotspotCount; i++) {
        const arcAngle = t * 0.3 + (i * Math.PI * 2) / s.hotspotCount;
        const arcLength = 0.3 + Math.sin(t * 0.8 + i * 1.7) * 0.15;
        const arcOpacity = 0.4 + Math.sin(t * 1.3 + i * 2.1) * 0.2;

        c.beginPath();
        c.arc(0, 0, rr, arcAngle, arcAngle + arcLength);
        c.strokeStyle = `rgba(${RGB_GOLD_PALE.r},${RGB_GOLD_PALE.g},${RGB_GOLD_PALE.b},${arcOpacity})`;
        c.lineWidth = 3;
        c.lineCap = 'round';
        c.stroke();
      }

      c.restore();

      // ═══════════════════════════════════════
      // Pass 5: OUTWARD SPARKS
      // ═══════════════════════════════════════
      for (const spark of s.sparks) {
        if (!spark.active) continue;

        spark.life -= dt;
        if (spark.life <= 0) {
          spark.active = false;
          continue;
        }

        // Apply drag
        spark.vx *= 0.97;
        spark.vy *= 0.97;
        spark.x += spark.vx * dt;
        spark.y += spark.vy * dt;

        const lifeRatio = spark.life / spark.maxLife;
        const sparkAlpha = lifeRatio * 0.9;
        const sparkSize = spark.size * lifeRatio;

        // Spark glow
        const sparkGrad = c.createRadialGradient(spark.x, spark.y, 0, spark.x, spark.y, sparkSize * 4);
        sparkGrad.addColorStop(0, `rgba(${RGB_WHITE_GOLD.r},${RGB_WHITE_GOLD.g},${RGB_WHITE_GOLD.b},${sparkAlpha})`);
        sparkGrad.addColorStop(0.3, `rgba(${RGB_GOLD_HOT.r},${RGB_GOLD_HOT.g},${RGB_GOLD_HOT.b},${sparkAlpha * 0.4})`);
        sparkGrad.addColorStop(1, `rgba(${RGB_AMBER_DEEP.r},${RGB_AMBER_DEEP.g},${RGB_AMBER_DEEP.b},0)`);

        c.beginPath();
        c.arc(spark.x, spark.y, sparkSize * 4, 0, Math.PI * 2);
        c.fillStyle = sparkGrad;
        c.fill();

        // Bright core
        c.beginPath();
        c.arc(spark.x, spark.y, sparkSize * 0.6, 0, Math.PI * 2);
        c.fillStyle = `rgba(${RGB_WHITE_GOLD.r},${RGB_WHITE_GOLD.g},${RGB_WHITE_GOLD.b},${sparkAlpha})`;
        c.fill();
      }

      // ═══════════════════════════════════════
      // Pass 6: CENTER FADE MASK
      // ═══════════════════════════════════════
      c.globalCompositeOperation = 'destination-out';

      const maskRadius = rr * 1.2;
      const mask = c.createRadialGradient(ccx, ccy, 0, ccx, ccy, maskRadius);
      mask.addColorStop(0, 'rgba(0,0,0,0.7)');
      mask.addColorStop(0.6, 'rgba(0,0,0,0.3)');
      mask.addColorStop(1, 'rgba(0,0,0,0)');

      c.beginPath();
      c.arc(ccx, ccy, maskRadius, 0, Math.PI * 2);
      c.fillStyle = mask;
      c.fill();

      // Next frame
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

export default GoldenNexusPortalEffect;
