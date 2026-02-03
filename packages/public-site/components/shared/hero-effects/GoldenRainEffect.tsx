'use client';

import { useRef, useEffect } from 'react';

/**
 * Liquid Gold Streams Effect — Canvas 2D hero background
 *
 * Viscous golden streams flow and branch across the canvas, simulating
 * liquid gold / molten metal. Streams have variable thickness with
 * surface tension (bulge/narrow), hard specular highlights, and small
 * droplets that break off and follow gravity.
 *
 * Distinct from AuroraNetworkEffect: this is fluid/liquid (thick, gravity-
 * influenced, metallic specular) vs gaseous/ethereal (thin ribbons, additive glow).
 *
 * Architecture: three useEffect hooks, stateRef, own rAF loop with scroll boost.
 */

// --- Types ---

interface StreamPoint {
  x: number;
  y: number;
  thickness: number;
}

interface Stream {
  points: StreamPoint[];
  baseY: number;           // entry Y position (left edge)
  speed: number;           // horizontal flow speed
  phaseOffset: number;     // wave uniqueness
  amplitude: number;       // vertical wave size
  frequency: number;       // wave frequency
  freq2: number;           // second harmonic
  amp2: number;            // second harmonic amplitude
  baseThickness: number;   // average thickness
  branchAt: number;        // X fraction where this stream branches
  opacity: number;         // base opacity
  tier: 'primary' | 'secondary' | 'accent';
}

interface Droplet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface AnimState {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  dpr: number;
  streams: Stream[];
  droplets: Droplet[];
  time: number;
  lastTimestamp: number;
  scrollBoost: number;
  paused: boolean;
  frameId: number;
  isMobile: boolean;
  animateFn: ((ts: number) => void) | null;
}

// --- Color helpers ---

function goldColor(lightness: number, alpha: number): string {
  // lightness 0 = deep amber, 0.5 = gold, 1.0 = bright highlight
  const r = Math.round(180 + lightness * 75);
  const g = Math.round(120 + lightness * 100);
  const b = Math.round(10 + lightness * 40);
  return `rgba(${r},${g},${b},${alpha})`;
}

// --- Stream factory ---

function buildStreams(w: number, h: number, isMobile: boolean): Stream[] {
  const streams: Stream[] = [];

  // Primary streams: thick, bright, dominant flow
  const primaryCount = isMobile ? 2 : 3;
  const primaryYs = isMobile
    ? [0.30, 0.65]
    : [0.22, 0.48, 0.75];

  for (let i = 0; i < primaryCount; i++) {
    streams.push({
      points: [],
      baseY: primaryYs[i],
      speed: 0.015 + Math.random() * 0.008,
      phaseOffset: Math.random() * Math.PI * 2,
      amplitude: h * (0.04 + Math.random() * 0.025),
      frequency: 0.003 + Math.random() * 0.001,
      freq2: 0.007 + Math.random() * 0.003,
      amp2: h * (0.015 + Math.random() * 0.01),
      baseThickness: isMobile ? 14 : 20,
      branchAt: 0.35 + Math.random() * 0.25,
      opacity: 1.0,
      tier: 'primary',
    });
  }

  // Secondary streams: thinner, offset, fill visual space
  const secondaryCount = isMobile ? 2 : 3;
  const secondaryYs = isMobile
    ? [0.15, 0.82]
    : [0.12, 0.38, 0.88];

  for (let i = 0; i < secondaryCount; i++) {
    streams.push({
      points: [],
      baseY: secondaryYs[i],
      speed: 0.012 + Math.random() * 0.006,
      phaseOffset: Math.random() * Math.PI * 2,
      amplitude: h * (0.03 + Math.random() * 0.02),
      frequency: 0.004 + Math.random() * 0.002,
      freq2: 0.009 + Math.random() * 0.003,
      amp2: h * (0.01 + Math.random() * 0.008),
      baseThickness: isMobile ? 8 : 12,
      branchAt: 0.4 + Math.random() * 0.3,
      opacity: 0.7,
      tier: 'secondary',
    });
  }

  // Accent streams: thin, subtle, background depth
  if (!isMobile) {
    const accentYs = [0.05, 0.55, 0.95];
    for (let i = 0; i < 3; i++) {
      streams.push({
        points: [],
        baseY: accentYs[i],
        speed: 0.010 + Math.random() * 0.005,
        phaseOffset: Math.random() * Math.PI * 2,
        amplitude: h * (0.02 + Math.random() * 0.015),
        frequency: 0.005 + Math.random() * 0.002,
        freq2: 0.011 + Math.random() * 0.004,
        amp2: h * (0.008 + Math.random() * 0.006),
        baseThickness: 5,
        branchAt: 0.5 + Math.random() * 0.3,
        opacity: 0.35,
        tier: 'accent',
      });
    }
  }

  return streams;
}

// --- Compute stream Y at a given X ---

function streamY(stream: Stream, x: number, time: number, h: number): number {
  const t = time;
  const baseY = stream.baseY * h;
  const wave1 = Math.sin(x * stream.frequency + t * stream.speed * 60 + stream.phaseOffset) * stream.amplitude;
  const wave2 = Math.sin(x * stream.freq2 + t * stream.speed * 40 + stream.phaseOffset * 1.7) * stream.amp2;
  const drift = Math.sin(t * 0.15 + stream.phaseOffset) * h * 0.015;
  return baseY + wave1 + wave2 + drift;
}

// --- Compute surface-tension thickness variation ---

function streamThickness(stream: Stream, x: number, time: number, w: number): number {
  const base = stream.baseThickness;
  // Slow bulge/narrow cycle (surface tension)
  const bulge = Math.sin(x * 0.008 + time * 0.4 + stream.phaseOffset) * base * 0.35;
  // Faster subtle ripple
  const ripple = Math.sin(x * 0.025 + time * 1.2 + stream.phaseOffset * 2.3) * base * 0.12;
  // Thin near edges for natural flow look
  const edgeFade = Math.min(x / (w * 0.08), 1) * Math.min((w - x) / (w * 0.08), 1);
  return Math.max(2, (base + bulge + ripple) * edgeFade);
}

// --- Component ---

export function GoldenRainEffect() {
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
    const streams = buildStreams(w, h, isMobile);
    const droplets: Droplet[] = [];

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
      streams, droplets,
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
      s.streams = buildStreams(newW, newH, s.isMobile);
      s.droplets.length = 0;
    });
    ro.observe(container);

    // Droplet spawn timer
    let dropletTimer = 0;

    state.animateFn = animate;
    state.frameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };

    // --- Animation frame ---
    function animate(timestamp: number) {
      const s = stateRef.current;
      if (!s || s.paused) return;

      if (s.lastTimestamp === 0) s.lastTimestamp = timestamp;
      const rawDt = (timestamp - s.lastTimestamp) / 1000;
      const dt = Math.min(rawDt, 0.1);
      s.lastTimestamp = timestamp;

      s.scrollBoost = scrollBoost;
      scrollBoost *= 0.92;

      s.time += dt * (1 + s.scrollBoost);

      const { ctx: c, w: cw, h: ch, time: t, streams: stms, droplets: drops } = s;

      c.clearRect(0, 0, cw, ch);

      // --- Spawn droplets from streams ---
      dropletTimer += dt;
      if (dropletTimer > 0.08) {
        dropletTimer = 0;
        const maxDroplets = s.isMobile ? 25 : 50;
        if (drops.length < maxDroplets) {
          // Pick a random primary/secondary stream
          const candidates = stms.filter(st => st.tier !== 'accent');
          if (candidates.length > 0) {
            const src = candidates[Math.floor(Math.random() * candidates.length)];
            const spawnX = Math.random() * cw;
            const spawnY = streamY(src, spawnX, t, ch);
            const thick = streamThickness(src, spawnX, t, cw);
            drops.push({
              x: spawnX + (Math.random() - 0.5) * thick,
              y: spawnY + (Math.random() - 0.5) * thick * 0.5,
              vx: (Math.random() - 0.5) * 15,
              vy: 20 + Math.random() * 40,  // gravity pull
              radius: 1.5 + Math.random() * 3,
              opacity: 0.5 + Math.random() * 0.5,
              life: 0,
              maxLife: 1.5 + Math.random() * 2,
            });
          }
        }
      }

      // --- Draw streams (back to front: accent → secondary → primary) ---
      const tierOrder: Array<'accent' | 'secondary' | 'primary'> = ['accent', 'secondary', 'primary'];

      for (const tier of tierOrder) {
        const tierStreams = stms.filter(st => st.tier === tier);

        for (const stream of tierStreams) {
          const step = s.isMobile ? 4 : 3;
          const opMul = stream.opacity;

          // Build path points
          const pts: { x: number; y: number; thick: number }[] = [];
          for (let x = 0; x <= cw; x += step) {
            const y = streamY(stream, x, t, ch);
            const thick = streamThickness(stream, x, t, cw);
            pts.push({ x, y, thick });
          }

          if (pts.length < 2) continue;

          // --- Pass 1: Outer glow (wide, low opacity, warm amber) ---
          c.globalCompositeOperation = 'lighter';
          c.globalAlpha = 1;

          c.beginPath();
          c.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) {
            c.lineTo(pts[i].x, pts[i].y);
          }
          c.strokeStyle = goldColor(0.2, 0.04 * opMul);
          c.lineWidth = pts[Math.floor(pts.length / 2)].thick * 4;
          c.lineCap = 'round';
          c.lineJoin = 'round';
          c.stroke();

          // --- Pass 2: Mid glow (warm gold) ---
          c.beginPath();
          c.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) {
            c.lineTo(pts[i].x, pts[i].y);
          }
          c.strokeStyle = goldColor(0.4, 0.08 * opMul);
          c.lineWidth = pts[Math.floor(pts.length / 2)].thick * 2.2;
          c.stroke();

          // --- Pass 3: Main body (source-over for solid liquid look) ---
          c.globalCompositeOperation = 'source-over';

          // Draw as a filled shape using thickness envelope
          c.beginPath();
          // Top edge (left to right)
          c.moveTo(pts[0].x, pts[0].y - pts[0].thick * 0.5);
          for (let i = 1; i < pts.length; i++) {
            c.lineTo(pts[i].x, pts[i].y - pts[i].thick * 0.5);
          }
          // Bottom edge (right to left)
          for (let i = pts.length - 1; i >= 0; i--) {
            c.lineTo(pts[i].x, pts[i].y + pts[i].thick * 0.5);
          }
          c.closePath();

          // Metallic gradient fill across the thickness
          const midIdx = Math.floor(pts.length / 2);
          const midY = pts[midIdx].y;
          const midThick = pts[midIdx].thick;
          const bodyGrad = c.createLinearGradient(0, midY - midThick, 0, midY + midThick);
          bodyGrad.addColorStop(0, `rgba(90,65,10,${0.35 * opMul})`);
          bodyGrad.addColorStop(0.2, `rgba(160,120,20,${0.55 * opMul})`);
          bodyGrad.addColorStop(0.4, `rgba(220,175,40,${0.70 * opMul})`);
          bodyGrad.addColorStop(0.5, `rgba(255,215,60,${0.80 * opMul})`);
          bodyGrad.addColorStop(0.6, `rgba(220,175,40,${0.70 * opMul})`);
          bodyGrad.addColorStop(0.8, `rgba(140,100,15,${0.50 * opMul})`);
          bodyGrad.addColorStop(1, `rgba(80,55,5,${0.30 * opMul})`);
          c.fillStyle = bodyGrad;
          c.fill();

          // --- Pass 4: Specular highlight (bright line along top edge) ---
          c.globalCompositeOperation = 'lighter';

          // Animated specular position shifts over time
          const specShift = Math.sin(t * 0.3 + stream.phaseOffset) * 0.15;

          c.beginPath();
          c.moveTo(pts[0].x, pts[0].y - pts[0].thick * (0.25 + specShift));
          for (let i = 1; i < pts.length; i++) {
            const specY = pts[i].y - pts[i].thick * (0.25 + specShift);
            c.lineTo(pts[i].x, specY);
          }
          c.strokeStyle = `rgba(255,250,220,${0.25 * opMul})`;
          c.lineWidth = Math.max(1, stream.baseThickness * 0.15);
          c.lineCap = 'round';
          c.stroke();

          // Brighter core specular (thinner, more intense)
          c.beginPath();
          c.moveTo(pts[0].x, pts[0].y - pts[0].thick * (0.3 + specShift));
          for (let i = 1; i < pts.length; i++) {
            c.lineTo(pts[i].x, pts[i].y - pts[i].thick * (0.3 + specShift));
          }
          c.strokeStyle = `rgba(255,255,245,${0.15 * opMul})`;
          c.lineWidth = Math.max(0.5, stream.baseThickness * 0.06);
          c.stroke();

          // --- Pass 5: Bottom shadow edge ---
          c.globalCompositeOperation = 'source-over';
          c.beginPath();
          c.moveTo(pts[0].x, pts[0].y + pts[0].thick * 0.45);
          for (let i = 1; i < pts.length; i++) {
            c.lineTo(pts[i].x, pts[i].y + pts[i].thick * 0.45);
          }
          c.strokeStyle = `rgba(60,40,0,${0.20 * opMul})`;
          c.lineWidth = Math.max(1, stream.baseThickness * 0.12);
          c.stroke();

          // --- Branch rendering ---
          // At the branch point, draw a thinner tributary splitting downward
          if (stream.tier !== 'accent') {
            const branchX = cw * stream.branchAt;
            const branchStartY = streamY(stream, branchX, t, ch);
            const branchLen = cw * (0.25 + Math.random() * 0.01); // consistent per frame via seed
            const branchThick = stream.baseThickness * 0.5;

            c.globalCompositeOperation = 'lighter';
            c.beginPath();

            const branchPts: { x: number; y: number }[] = [];
            for (let bx = 0; bx <= branchLen; bx += step) {
              const progress = bx / branchLen;
              const bxAbs = branchX + bx;
              if (bxAbs > cw) break;
              // Branch curves downward (gravity)
              const by = branchStartY
                + progress * progress * ch * 0.15
                + Math.sin(bxAbs * 0.01 + t * 0.5 + stream.phaseOffset * 3) * 12;
              branchPts.push({ x: bxAbs, y: by });
            }

            if (branchPts.length > 1) {
              // Branch glow
              c.beginPath();
              c.moveTo(branchPts[0].x, branchPts[0].y);
              for (let i = 1; i < branchPts.length; i++) {
                c.lineTo(branchPts[i].x, branchPts[i].y);
              }
              c.strokeStyle = goldColor(0.3, 0.06 * opMul);
              c.lineWidth = branchThick * 2;
              c.stroke();

              // Branch body
              c.globalCompositeOperation = 'source-over';
              c.beginPath();
              c.moveTo(branchPts[0].x, branchPts[0].y);
              for (let i = 1; i < branchPts.length; i++) {
                c.lineTo(branchPts[i].x, branchPts[i].y);
              }
              // Taper the branch
              c.strokeStyle = goldColor(0.5, 0.45 * opMul);
              c.lineWidth = branchThick;
              c.stroke();

              // Branch specular
              c.globalCompositeOperation = 'lighter';
              c.beginPath();
              c.moveTo(branchPts[0].x, branchPts[0].y - branchThick * 0.3);
              for (let i = 1; i < branchPts.length; i++) {
                c.lineTo(branchPts[i].x, branchPts[i].y - branchThick * 0.3);
              }
              c.strokeStyle = `rgba(255,250,220,${0.12 * opMul})`;
              c.lineWidth = 1;
              c.stroke();
            }
          }
        }
      }

      // --- Update and draw droplets ---
      c.globalCompositeOperation = 'lighter';
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.life += dt;
        if (d.life > d.maxLife || d.y > ch + 20) {
          drops.splice(i, 1);
          continue;
        }

        d.vy += 60 * dt; // gravity
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        d.vx *= 0.98; // drag

        const lifeRatio = d.life / d.maxLife;
        const fadeAlpha = lifeRatio < 0.1
          ? lifeRatio / 0.1
          : lifeRatio > 0.7
            ? 1 - (lifeRatio - 0.7) / 0.3
            : 1;

        const alpha = d.opacity * fadeAlpha;

        // Droplet glow
        const glowR = d.radius * 3;
        const glow = c.createRadialGradient(d.x, d.y, 0, d.x, d.y, glowR);
        glow.addColorStop(0, `rgba(255,200,50,${(0.15 * alpha).toFixed(3)})`);
        glow.addColorStop(1, 'rgba(255,180,30,0)');
        c.beginPath();
        c.arc(d.x, d.y, glowR, 0, Math.PI * 2);
        c.fillStyle = glow;
        c.fill();

        // Droplet body
        c.globalCompositeOperation = 'source-over';
        c.beginPath();
        c.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        c.fillStyle = `rgba(255,215,60,${(0.7 * alpha).toFixed(3)})`;
        c.fill();

        // Specular dot on droplet
        c.globalCompositeOperation = 'lighter';
        c.beginPath();
        c.arc(d.x - d.radius * 0.3, d.y - d.radius * 0.3, d.radius * 0.4, 0, Math.PI * 2);
        c.fillStyle = `rgba(255,255,240,${(0.4 * alpha).toFixed(3)})`;
        c.fill();
      }

      // --- Center void mask (text readability) ---
      c.globalCompositeOperation = 'destination-out';

      const voidW = cw * (s.isMobile ? 0.30 : 0.35);
      const voidH = ch * (s.isMobile ? 0.22 : 0.28);
      const vcx = cw / 2;
      const vcy = ch / 2;

      const voidGrad = c.createRadialGradient(vcx, vcy, 0, vcx, vcy, 1);
      voidGrad.addColorStop(0, 'rgba(0,0,0,0.80)');
      voidGrad.addColorStop(0.5, 'rgba(0,0,0,0.35)');
      voidGrad.addColorStop(1, 'rgba(0,0,0,0)');

      c.save();
      c.translate(vcx, vcy);
      c.scale(voidW, voidH);
      c.beginPath();
      c.arc(0, 0, 1, 0, Math.PI * 2);
      c.fillStyle = voidGrad;
      c.fill();
      c.restore();

      // --- Edge fades ---
      const bottomFade = ch * 0.15;
      const bGrad = c.createLinearGradient(0, ch - bottomFade, 0, ch);
      bGrad.addColorStop(0, 'rgba(0,0,0,0)');
      bGrad.addColorStop(0.6, 'rgba(0,0,0,0.5)');
      bGrad.addColorStop(1, 'rgba(0,0,0,0.95)');
      c.fillStyle = bGrad;
      c.fillRect(0, ch - bottomFade, cw, bottomFade);

      const topFade = ch * 0.08;
      const tGrad = c.createLinearGradient(0, 0, 0, topFade);
      tGrad.addColorStop(0, 'rgba(0,0,0,0.80)');
      tGrad.addColorStop(0.5, 'rgba(0,0,0,0.25)');
      tGrad.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = tGrad;
      c.fillRect(0, 0, cw, topFade);

      // Left/right edge fades
      const sideFade = cw * 0.06;
      const lGrad = c.createLinearGradient(0, 0, sideFade, 0);
      lGrad.addColorStop(0, 'rgba(0,0,0,0.70)');
      lGrad.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = lGrad;
      c.fillRect(0, 0, sideFade, ch);

      const rGrad = c.createLinearGradient(cw - sideFade, 0, cw, 0);
      rGrad.addColorStop(0, 'rgba(0,0,0,0)');
      rGrad.addColorStop(1, 'rgba(0,0,0,0.70)');
      c.fillStyle = rGrad;
      c.fillRect(cw - sideFade, 0, sideFade, ch);

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

export default GoldenRainEffect;
