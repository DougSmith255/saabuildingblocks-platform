'use client';

import { useRef, useEffect } from 'react';

/**
 * Golden Rain Effect — Canvas 2D hero background
 *
 * 3D gold coins tumble and fall. Each coin has visible rim thickness
 * rendered via stacked offset layers of a darker rim sprite behind the
 * face sprite — the classic 2D game coin technique. Coins fade out at
 * the top and bottom edges for seamless blending.
 *
 * Architecture: three useEffect hooks, stateRef, own rAF loop with scroll boost.
 */

// --- Types ---

interface Coin {
  x: number;
  y: number;
  vy: number;
  vx: number;
  spin: number;
  spinSpeed: number;
  size: number;
  wobblePhase: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  depth: number;       // 0.3–1.0: affects brightness, size, speed
}

interface AnimState {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  dpr: number;
  coins: Coin[];
  faceSprite: HTMLCanvasElement;
  rimSprite: HTMLCanvasElement;
  spriteR: number;
  time: number;
  lastTimestamp: number;
  scrollBoost: number;
  paused: boolean;
  frameId: number;
  isMobile: boolean;
  animateFn: ((ts: number) => void) | null;
}

// --- Pre-render bright coin face sprite ---

function createFaceSprite(radius: number): HTMLCanvasElement {
  const size = radius * 2 + 4;
  const oc = document.createElement('canvas');
  oc.width = size;
  oc.height = size;
  const c = oc.getContext('2d')!;
  const cx = size / 2;
  const cy = size / 2;
  const r = radius;

  // Metallic face gradient (offset highlight = upper-left light source)
  const face = c.createRadialGradient(cx - r * 0.25, cy - r * 0.25, 0, cx, cy, r);
  face.addColorStop(0, '#fff5cc');
  face.addColorStop(0.15, '#ffe066');
  face.addColorStop(0.45, '#ffd700');
  face.addColorStop(0.70, '#e6ac00');
  face.addColorStop(1.0, '#b8860b');

  c.beginPath();
  c.arc(cx, cy, r, 0, Math.PI * 2);
  c.fillStyle = face;
  c.fill();

  // Outer rim ring — thicker for definition
  c.beginPath();
  c.arc(cx, cy, r, 0, Math.PI * 2);
  c.strokeStyle = 'rgba(140,100,0,0.55)';
  c.lineWidth = 2;
  c.stroke();

  // Inner raised rim
  c.beginPath();
  c.arc(cx, cy, r * 0.78, 0, Math.PI * 2);
  c.strokeStyle = 'rgba(255,240,180,0.28)';
  c.lineWidth = 1.2;
  c.stroke();

  // Embossed star detail in center (subtle relief)
  c.globalCompositeOperation = 'lighter';
  const starR = r * 0.32;
  const innerR = starR * 0.42;
  const points = 5;
  c.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const pr = i % 2 === 0 ? starR : innerR;
    const sx = cx + Math.cos(angle) * pr;
    const sy = cy + Math.sin(angle) * pr;
    if (i === 0) c.moveTo(sx, sy);
    else c.lineTo(sx, sy);
  }
  c.closePath();
  c.fillStyle = 'rgba(255,250,220,0.10)';
  c.fill();
  c.strokeStyle = 'rgba(255,240,180,0.06)';
  c.lineWidth = 0.5;
  c.stroke();

  // Specular crescent (upper-left)
  const spec = c.createRadialGradient(
    cx - r * 0.3, cy - r * 0.3, 0,
    cx - r * 0.15, cy - r * 0.15, r * 0.6
  );
  spec.addColorStop(0, 'rgba(255,255,240,0.45)');
  spec.addColorStop(0.5, 'rgba(255,255,200,0.12)');
  spec.addColorStop(1, 'rgba(255,255,200,0)');
  c.beginPath();
  c.arc(cx - r * 0.15, cy - r * 0.15, r * 0.6, 0, Math.PI * 2);
  c.fillStyle = spec;
  c.fill();

  return oc;
}

// --- Pre-render darker rim/edge sprite ---

function createRimSprite(radius: number): HTMLCanvasElement {
  const size = radius * 2 + 4;
  const oc = document.createElement('canvas');
  oc.width = size;
  oc.height = size;
  const c = oc.getContext('2d')!;
  const cx = size / 2;
  const cy = size / 2;
  const r = radius;

  // Darker metallic gradient for the rim/edge
  const rim = c.createRadialGradient(cx - r * 0.2, cy - r * 0.2, 0, cx, cy, r);
  rim.addColorStop(0, '#c9a200');
  rim.addColorStop(0.3, '#a68600');
  rim.addColorStop(0.7, '#8B6914');
  rim.addColorStop(1.0, '#6B4F0A');

  c.beginPath();
  c.arc(cx, cy, r, 0, Math.PI * 2);
  c.fillStyle = rim;
  c.fill();

  // Rim detail rings
  c.beginPath();
  c.arc(cx, cy, r, 0, Math.PI * 2);
  c.strokeStyle = 'rgba(90,65,0,0.5)';
  c.lineWidth = 1.5;
  c.stroke();

  c.beginPath();
  c.arc(cx, cy, r * 0.90, 0, Math.PI * 2);
  c.strokeStyle = 'rgba(180,140,20,0.25)';
  c.lineWidth = 0.8;
  c.stroke();

  return oc;
}

// --- Coin factory ---

function createCoin(w: number, h: number, isMobile: boolean, initialSpread: boolean): Coin {
  const depth = 0.3 + Math.random() * 0.7;
  const baseSize = isMobile ? 7 : 9;
  const size = baseSize + depth * (isMobile ? 9 : 14);
  return {
    x: Math.random() * w,
    y: initialSpread
      ? Math.random() * (h + 100) - 50
      : -size * 2 - Math.random() * h * 0.4,
    vy: (35 + depth * 55) * (isMobile ? 0.8 : 1),
    vx: (Math.random() - 0.5) * 12,
    spin: Math.random() * Math.PI * 2,
    spinSpeed: (1.5 + Math.random() * 3) * (Math.random() < 0.5 ? 1 : -1),
    size,
    wobblePhase: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.4 + Math.random() * 0.8,
    wobbleAmp: 8 + Math.random() * 18,
    depth,
  };
}

function buildCoins(w: number, h: number, isMobile: boolean): Coin[] {
  const count = isMobile ? 22 : 42;
  return Array.from({ length: count }, () => createCoin(w, h, isMobile, true));
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
    const spriteR = 24;
    const faceSprite = createFaceSprite(spriteR);
    const rimSprite = createRimSprite(spriteR);
    const coins = buildCoins(w, h, isMobile);

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
      coins, faceSprite, rimSprite, spriteR,
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
      s.coins = buildCoins(newW, newH, s.isMobile);
    });
    ro.observe(container);

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

      const { ctx: c, w: cw, h: ch, time: t } = s;

      c.clearRect(0, 0, cw, ch);

      // Sort back-to-front so closer coins draw on top
      s.coins.sort((a, b) => a.depth - b.depth);

      // Rim thickness: number of stacked layers for 3D effect
      const RIM_LAYERS = s.isMobile ? 4 : 6;

      for (const coin of s.coins) {
        // --- Update physics ---
        coin.y += coin.vy * dt * (1 + s.scrollBoost * 0.5);
        coin.spin += coin.spinSpeed * dt;

        const wobbleX = Math.sin(t * coin.wobbleSpeed + coin.wobblePhase) * coin.wobbleAmp;
        const drawX = coin.x + wobbleX + coin.vx * Math.sin(t * 0.3 + coin.wobblePhase);
        const drawY = coin.y;

        // Respawn above viewport when fallen past bottom
        if (drawY > ch + coin.size * 3) {
          coin.x = Math.random() * cw;
          coin.y = -coin.size * 2 - Math.random() * 60;
          coin.wobblePhase = Math.random() * Math.PI * 2;
        }

        // Skip if above viewport
        if (drawY < -coin.size * 3) continue;

        // --- Rotation ---
        const facingRatio = Math.cos(coin.spin);
        const absFacing = Math.abs(facingRatio);
        const scaleX = Math.max(absFacing, 0.08);

        const depthAlpha = 0.25 + coin.depth * 0.75;
        const drawSize = coin.size * 2;
        // Rim offset per layer in px (scaled by coin size for consistency)
        const rimStep = coin.size * 0.06;

        // --- Glow halo (additive) ---
        c.globalCompositeOperation = 'lighter';
        c.globalAlpha = 1;
        const glowR = coin.size * 2.5;
        const glow = c.createRadialGradient(drawX, drawY, 0, drawX, drawY, glowR);
        glow.addColorStop(0, `rgba(255,215,0,${(0.12 * depthAlpha).toFixed(3)})`);
        glow.addColorStop(0.4, `rgba(255,180,0,${(0.04 * depthAlpha).toFixed(3)})`);
        glow.addColorStop(1, 'rgba(255,150,0,0)');
        c.beginPath();
        c.arc(drawX, drawY, glowR, 0, Math.PI * 2);
        c.fillStyle = glow;
        c.fill();

        // --- Motion trail ---
        c.globalCompositeOperation = 'lighter';
        c.beginPath();
        c.moveTo(drawX, drawY);
        c.lineTo(drawX - coin.vx * 0.05, drawY - coin.vy * 0.06);
        c.strokeStyle = `rgba(255,215,0,${(0.10 * depthAlpha).toFixed(3)})`;
        c.lineWidth = coin.size * 0.35;
        c.lineCap = 'round';
        c.stroke();

        // --- Coin body (source-over for solid coins) ---
        c.globalCompositeOperation = 'source-over';

        if (absFacing < 0.12) {
          // Edge-on view: thick gold band with shading
          c.globalAlpha = depthAlpha;
          const edgeW = coin.size * 0.18;
          const edgeH = coin.size * 0.95;

          // Dark edge body
          c.beginPath();
          c.ellipse(drawX, drawY, edgeW, edgeH, 0, 0, Math.PI * 2);
          c.fillStyle = '#8B6914';
          c.fill();

          // Rim groove lines
          c.strokeStyle = 'rgba(107,79,10,0.6)';
          c.lineWidth = 0.6;
          const grooves = 5;
          for (let g = 0; g < grooves; g++) {
            const gy = drawY - edgeH * 0.7 + (edgeH * 1.4 * g) / (grooves - 1);
            c.beginPath();
            c.moveTo(drawX - edgeW * 0.8, gy);
            c.lineTo(drawX + edgeW * 0.8, gy);
            c.stroke();
          }

          // Highlight on left edge
          c.beginPath();
          c.ellipse(drawX - edgeW * 0.3, drawY, edgeW * 0.3, edgeH * 0.85, 0, 0, Math.PI * 2);
          c.fillStyle = 'rgba(255,215,0,0.25)';
          c.fill();

          // Outer ring
          c.beginPath();
          c.ellipse(drawX, drawY, edgeW, edgeH, 0, 0, Math.PI * 2);
          c.strokeStyle = 'rgba(255,215,0,0.35)';
          c.lineWidth = 0.8;
          c.stroke();
        } else {
          // 3D coin: draw rim layers (back to front), then face on top

          // --- Rim layers (stacked below face for thickness) ---
          // More layers visible when coin is angled (rim shows more)
          const angleFactor = 1 - absFacing; // 0 when face-on, ~1 when edge-on
          const visibleLayers = Math.max(2, Math.round(RIM_LAYERS * (0.35 + angleFactor * 0.65)));

          for (let i = visibleLayers; i >= 1; i--) {
            const layerOffset = i * rimStep;
            // Each layer gets slightly darker toward the back
            const layerDim = 1 - (i / (visibleLayers + 1)) * 0.25;
            c.globalAlpha = depthAlpha * layerDim;

            c.save();
            c.translate(drawX, drawY + layerOffset);
            c.scale(scaleX, 1);
            c.drawImage(
              s.rimSprite,
              -drawSize / 2, -drawSize / 2,
              drawSize, drawSize
            );
            c.restore();
          }

          // --- Face (on top, at base position) ---
          c.globalAlpha = depthAlpha;
          c.save();
          c.translate(drawX, drawY);
          c.scale(scaleX, 1);

          c.drawImage(
            s.faceSprite,
            -drawSize / 2, -drawSize / 2,
            drawSize, drawSize
          );

          // Rotating specular highlight
          const hAngle = coin.spin * 0.4 + coin.wobblePhase;
          const hx = Math.cos(hAngle) * coin.size * 0.2;
          const hy = Math.sin(hAngle) * coin.size * 0.2 - coin.size * 0.1;
          const hl = c.createRadialGradient(hx, hy, 0, hx, hy, coin.size * 0.5);
          hl.addColorStop(0, 'rgba(255,255,240,0.22)');
          hl.addColorStop(1, 'rgba(255,255,200,0)');
          c.beginPath();
          c.arc(0, 0, coin.size * 0.95, 0, Math.PI * 2);
          c.fillStyle = hl;
          c.fill();

          c.restore();
        }

        c.globalAlpha = 1;
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

      // --- Bottom edge fade (coins dissolve instead of hard cut) ---
      const bottomFade = ch * 0.18;
      const bFadeGrad = c.createLinearGradient(0, ch - bottomFade, 0, ch);
      bFadeGrad.addColorStop(0, 'rgba(0,0,0,0)');
      bFadeGrad.addColorStop(0.6, 'rgba(0,0,0,0.5)');
      bFadeGrad.addColorStop(1, 'rgba(0,0,0,0.95)');
      c.fillStyle = bFadeGrad;
      c.fillRect(0, ch - bottomFade, cw, bottomFade);

      // --- Top edge fade (coins appear gradually) ---
      const topFade = ch * 0.10;
      const tFadeGrad = c.createLinearGradient(0, 0, 0, topFade);
      tFadeGrad.addColorStop(0, 'rgba(0,0,0,0.85)');
      tFadeGrad.addColorStop(0.5, 'rgba(0,0,0,0.3)');
      tFadeGrad.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = tFadeGrad;
      c.fillRect(0, 0, cw, topFade);

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
