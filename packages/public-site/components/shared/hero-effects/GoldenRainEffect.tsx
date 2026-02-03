'use client';

import { useRef, useEffect } from 'react';

/**
 * Raining Benjamins Effect — Canvas 2D hero background
 *
 * Cinematic slow-motion $100 bills falling with 3D rotation (affine-
 * approximated), golden rim lighting, and depth-layered parallax.
 * Bills are pre-rendered to offscreen canvases (front + back faces)
 * for performance.
 *
 * Architecture: three useEffect hooks, stateRef, own rAF loop with scroll boost.
 */

// --- Types ---

type DepthLayer = 'near' | 'mid' | 'far';

interface Bill {
  x: number;
  y: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  rotXSpeed: number;
  rotYSpeed: number;
  rotZSpeed: number;
  hFreq: number;         // horizontal flutter frequency
  hPhase: number;        // horizontal flutter phase offset
  hAmplitude: number;    // horizontal flutter amplitude
  layer: DepthLayer;
  scale: number;
  baseOpacity: number;
  fallSpeed: number;     // base vertical speed (px/s)
}

interface BillSprites {
  front: HTMLCanvasElement;
  back: HTMLCanvasElement;
  width: number;
  height: number;
}

interface AnimState {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  dpr: number;
  bills: Bill[];
  sprites: BillSprites;
  time: number;
  lastTimestamp: number;
  scrollBoost: number;
  paused: boolean;
  frameId: number;
  isMobile: boolean;
  animateFn: ((ts: number) => void) | null;
}

// --- Depth layer config ---

const LAYER_CONFIG: Record<DepthLayer, { scale: number; opacity: number; speedMul: number }> = {
  near: { scale: 1.2, opacity: 0.9, speedMul: 1.4 },
  mid:  { scale: 0.8, opacity: 0.6, speedMul: 1.0 },
  far:  { scale: 0.4, opacity: 0.3, speedMul: 0.6 },
};

// --- Bill sprite renderer ---

function renderBillSprite(
  width: number,
  height: number,
  dpr: number,
  side: 'front' | 'back'
): HTMLCanvasElement {
  const c = document.createElement('canvas');
  const pw = Math.round(width * dpr);
  const ph = Math.round(height * dpr);
  c.width = pw;
  c.height = ph;
  const ctx = c.getContext('2d')!;
  ctx.scale(dpr, dpr);

  const isFront = side === 'front';
  const baseGreen = isFront ? '#1a472a' : '#164025';
  const borderGreen = isFront ? '#2d6b3f' : '#245a35';
  const inset = 3;

  // Base fill
  ctx.fillStyle = baseGreen;
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, 4);
  ctx.fill();

  // Lighter inset border
  ctx.strokeStyle = borderGreen;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(inset, inset, width - inset * 2, height - inset * 2, 2);
  ctx.stroke();

  // Crosshatch engraving texture
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.strokeStyle = '#88bb88';
  ctx.lineWidth = 0.5;
  // Diagonal set 1
  for (let i = -height; i < width + height; i += 6) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + height, height);
    ctx.stroke();
  }
  // Diagonal set 2
  for (let i = -height; i < width + height; i += 6) {
    ctx.beginPath();
    ctx.moveTo(i + height, 0);
    ctx.lineTo(i, height);
    ctx.stroke();
  }
  ctx.restore();

  // Inner shadow gradient from edges
  const edgeShadow = ctx.createLinearGradient(0, 0, 0, height);
  edgeShadow.addColorStop(0, 'rgba(0,0,0,0.15)');
  edgeShadow.addColorStop(0.15, 'rgba(0,0,0,0)');
  edgeShadow.addColorStop(0.85, 'rgba(0,0,0,0)');
  edgeShadow.addColorStop(1, 'rgba(0,0,0,0.15)');
  ctx.fillStyle = edgeShadow;
  ctx.fillRect(0, 0, width, height);

  const sideShadow = ctx.createLinearGradient(0, 0, width, 0);
  sideShadow.addColorStop(0, 'rgba(0,0,0,0.1)');
  sideShadow.addColorStop(0.1, 'rgba(0,0,0,0)');
  sideShadow.addColorStop(0.9, 'rgba(0,0,0,0)');
  sideShadow.addColorStop(1, 'rgba(0,0,0,0.1)');
  ctx.fillStyle = sideShadow;
  ctx.fillRect(0, 0, width, height);

  // Large "100" centered
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#c4a34a';
  ctx.font = `bold ${Math.round(height * 0.41)}px Georgia, "Times New Roman", serif`;
  ctx.globalAlpha = 0.85;
  ctx.fillText('100', width / 2, height / 2 + 1);
  ctx.restore();

  if (isFront) {
    // Oval portrait placeholder
    ctx.save();
    const ovalCx = width * 0.5;
    const ovalCy = height * 0.48;
    const ovalRx = height * 0.22;
    const ovalRy = height * 0.28;
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#0d3018';
    ctx.beginPath();
    ctx.ellipse(ovalCx, ovalCy, ovalRx, ovalRy, 0, 0, Math.PI * 2);
    ctx.fill();
    // Highlight arc
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = '#88bb88';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(ovalCx, ovalCy, ovalRx - 1, ovalRy - 1, 0, -Math.PI * 0.6, Math.PI * 0.1);
    ctx.stroke();
    ctx.restore();

    // Corner "100" numerals
    ctx.save();
    ctx.fillStyle = '#c4a34a';
    ctx.globalAlpha = 0.5;
    const cornerSize = Math.round(height * 0.16);
    ctx.font = `bold ${cornerSize}px Georgia, "Times New Roman", serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('100', inset + 3, inset + 2);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText('100', width - inset - 3, height - inset - 2);
    ctx.restore();
  }

  return c;
}

// --- Build bill sprites ---

function buildSprites(dpr: number): BillSprites {
  const width = 160;
  const height = 68;
  return {
    front: renderBillSprite(width, height, dpr, 'front'),
    back: renderBillSprite(width, height, dpr, 'back'),
    width,
    height,
  };
}

// --- Build bill population ---

function buildBills(w: number, h: number, isMobile: boolean): Bill[] {
  const bills: Bill[] = [];
  const counts: Record<DepthLayer, number> = isMobile
    ? { near: 2 + Math.round(Math.random()), mid: 4 + Math.round(Math.random()), far: 4 }
    : { near: 4 + Math.round(Math.random()), mid: 8 + Math.round(Math.random() * 2), far: 6 + Math.round(Math.random()) };

  const layers: DepthLayer[] = ['far', 'mid', 'near'];
  for (const layer of layers) {
    const cfg = LAYER_CONFIG[layer];
    for (let i = 0; i < counts[layer]; i++) {
      const baseSpeed = 30 + Math.random() * 30; // 30-60 px/s
      bills.push({
        x: Math.random() * w,
        y: -Math.random() * h * 1.5, // spread above canvas
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: (Math.random() - 0.5) * 0.6,
        rotXSpeed: 0.2 + Math.random() * 0.6,
        rotYSpeed: 0.2 + Math.random() * 0.6,
        rotZSpeed: (Math.random() - 0.5) * 0.3,
        hFreq: 0.5 + Math.random() * 1.0,
        hPhase: Math.random() * Math.PI * 2,
        hAmplitude: 20 + Math.random() * 40,
        layer,
        scale: cfg.scale,
        baseOpacity: cfg.opacity,
        fallSpeed: baseSpeed * cfg.speedMul,
      });
    }
  }

  return bills;
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
    const sprites = buildSprites(dpr);
    const bills = buildBills(w, h, isMobile);

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
      bills, sprites,
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
      s.sprites = buildSprites(newDpr);
      s.bills = buildBills(newW, newH, s.isMobile);
    });
    ro.observe(container);

    state.animateFn = animate;
    state.frameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };

    // --- Draw a single bill with 3D affine transform ---
    function drawBill(
      c: CanvasRenderingContext2D,
      bill: Bill,
      sp: BillSprites,
      alpha: number
    ) {
      const cosY = Math.cos(bill.rotY);
      const cosX = Math.cos(bill.rotX);
      const sinY = Math.sin(bill.rotY);

      // Foreshortening
      const scaleX = Math.abs(cosY) * bill.scale;
      const scaleY = Math.abs(cosX) * bill.scale;

      // Skip if too thin to see
      if (scaleX < 0.05 || scaleY < 0.05) return;

      const skewFactor = sinY * 0.3;

      // Pick face
      const sprite = cosY >= 0 ? sp.front : sp.back;

      c.save();
      c.globalAlpha = alpha;
      c.translate(bill.x, bill.y);
      // Affine: [scaleX, skew, skew, scaleY, 0, 0] then rotZ
      c.transform(scaleX, skewFactor * scaleY, skewFactor * scaleX, scaleY, 0, 0);
      c.rotate(bill.rotZ);
      c.drawImage(sprite, -sp.width / 2, -sp.height / 2, sp.width, sp.height);
      c.restore();
    }

    // --- Draw golden rim glow behind a bill ---
    function drawGlow(
      c: CanvasRenderingContext2D,
      bill: Bill,
      sp: BillSprites,
      intensity: number
    ) {
      const cosY = Math.cos(bill.rotY);
      const absScale = bill.scale;
      // Diagonal of bill for glow radius
      const diag = Math.sqrt(sp.width * sp.width + sp.height * sp.height) * absScale;
      const radiusMul = bill.layer === 'near' ? 1.4 : 1.2;
      const r = diag * radiusMul * 0.5;

      // Brighter when nearly edge-on (rim light visible)
      const edgeFactor = 1 - Math.abs(cosY);
      const alpha = intensity * (0.3 + edgeFactor * 0.7);

      const grad = c.createRadialGradient(bill.x, bill.y, 0, bill.x, bill.y, r);
      grad.addColorStop(0, `rgba(255,200,50,${(alpha * 0.5).toFixed(3)})`);
      grad.addColorStop(0.5, `rgba(255,180,30,${(alpha * 0.2).toFixed(3)})`);
      grad.addColorStop(1, 'rgba(255,160,20,0)');

      c.beginPath();
      c.arc(bill.x, bill.y, r, 0, Math.PI * 2);
      c.fillStyle = grad;
      c.fill();

      // Edge highlight when nearly edge-on
      if (edgeFactor > 0.6) {
        const edgeAlpha = (edgeFactor - 0.6) * 2.5 * intensity;
        const edgeLen = sp.height * absScale * 0.5;
        c.save();
        c.translate(bill.x, bill.y);
        c.rotate(bill.rotZ);
        c.strokeStyle = `rgba(255,220,80,${edgeAlpha.toFixed(3)})`;
        c.lineWidth = 2 * absScale;
        c.beginPath();
        c.moveTo(0, -edgeLen);
        c.lineTo(0, edgeLen);
        c.stroke();
        c.restore();
      }
    }

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

      s.time += dt;

      const { ctx: c, w: cw, h: ch, bills: allBills, sprites: sp } = s;
      const t = s.time;
      const boost = 1 + s.scrollBoost;

      // --- Update bill positions ---
      const margin = sp.height * 1.5;
      for (const bill of allBills) {
        bill.y += bill.fallSpeed * boost * dt;
        bill.x += Math.sin(t * bill.hFreq + bill.hPhase) * bill.hAmplitude * dt;

        // Rotation with slight sine wobble
        bill.rotX += bill.rotXSpeed * dt + Math.sin(t * 0.7 + bill.hPhase) * 0.05 * dt;
        bill.rotY += bill.rotYSpeed * dt + Math.sin(t * 0.5 + bill.hPhase * 1.3) * 0.04 * dt;
        bill.rotZ += bill.rotZSpeed * dt;

        // Wrap when below canvas
        if (bill.y > ch + margin) {
          bill.y = -margin - Math.random() * margin;
          bill.x = Math.random() * cw;
        }
        // Wrap horizontal
        if (bill.x < -margin) bill.x = cw + margin * 0.5;
        if (bill.x > cw + margin) bill.x = -margin * 0.5;
      }

      // --- Separate by layer ---
      const farBills = allBills.filter(b => b.layer === 'far');
      const midBills = allBills.filter(b => b.layer === 'mid');
      const nearBills = allBills.filter(b => b.layer === 'near');

      c.clearRect(0, 0, cw, ch);

      // 1. Far bills (smallest, most transparent)
      c.globalCompositeOperation = 'source-over';
      for (const bill of farBills) {
        drawBill(c, bill, sp, bill.baseOpacity);
      }

      // 2. Mid-depth golden rim glow (additive)
      c.globalCompositeOperation = 'lighter';
      for (const bill of midBills) {
        drawGlow(c, bill, sp, 0.4);
      }

      // 3. Mid bills
      c.globalCompositeOperation = 'source-over';
      for (const bill of midBills) {
        drawBill(c, bill, sp, bill.baseOpacity);
      }

      // 4. Near golden rim glow (additive, brighter)
      c.globalCompositeOperation = 'lighter';
      for (const bill of nearBills) {
        drawGlow(c, bill, sp, 0.7);
      }

      // 5. Near bills (largest, sharpest)
      c.globalCompositeOperation = 'source-over';
      for (const bill of nearBills) {
        drawBill(c, bill, sp, bill.baseOpacity);
      }

      // 6. Edge fades + center void mask
      c.globalCompositeOperation = 'destination-out';

      // Center void
      const voidW = cw * (s.isMobile ? 0.30 : 0.35);
      const voidH = ch * (s.isMobile ? 0.20 : 0.25);
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

      // Bottom fade
      const bottomFade = ch * 0.15;
      const bGrad = c.createLinearGradient(0, ch - bottomFade, 0, ch);
      bGrad.addColorStop(0, 'rgba(0,0,0,0)');
      bGrad.addColorStop(0.6, 'rgba(0,0,0,0.5)');
      bGrad.addColorStop(1, 'rgba(0,0,0,0.95)');
      c.fillStyle = bGrad;
      c.fillRect(0, ch - bottomFade, cw, bottomFade);

      // Top fade
      const topFade = ch * 0.08;
      const tGrad = c.createLinearGradient(0, 0, 0, topFade);
      tGrad.addColorStop(0, 'rgba(0,0,0,0.80)');
      tGrad.addColorStop(0.5, 'rgba(0,0,0,0.25)');
      tGrad.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = tGrad;
      c.fillRect(0, 0, cw, topFade);

      // Side fades
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
