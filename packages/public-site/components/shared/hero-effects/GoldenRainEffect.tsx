'use client';

import { useRef, useEffect } from 'react';

/**
 * Benjamin Franklin Engraving Effect
 *
 * Large engraved portrait rendered with intricate variable-width lines in the
 * style of currency intaglio printing. A gold shimmer pulse periodically
 * illuminates the portrait diagonally. Pre-rendered to offscreen canvas for
 * performance — animation loop only composites the static engraving with a
 * moving additive shimmer band.
 */

// --- Types ---

interface EngravingState {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  engravingLayer: HTMLCanvasElement;
  w: number;
  h: number;
  dpr: number;
  time: number;
  lastTimestamp: number;
  paused: boolean;
  frameId: number;
  animateFn: ((ts: number) => void) | null;
}

// --- Portrait luminance map ---

function createPortraitMap(mapW: number, mapH: number): ImageData {
  const c = document.createElement('canvas');
  c.width = mapW;
  c.height = mapH;
  const ctx = c.getContext('2d')!;

  // White = no lines
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, mapW, mapH);

  const cx = mapW * 0.5;
  const cy = mapH * 0.42;
  const r = Math.min(mapW, mapH) * 0.42;

  // Head base — lighter center, darker edges
  const headGrad = ctx.createRadialGradient(cx, cy - r * 0.08, r * 0.1, cx, cy, r * 0.85);
  headGrad.addColorStop(0, '#aaa');
  headGrad.addColorStop(0.4, '#999');
  headGrad.addColorStop(0.7, '#777');
  headGrad.addColorStop(0.9, '#666');
  headGrad.addColorStop(1, '#fff');
  ctx.fillStyle = headGrad;
  ctx.beginPath();
  ctx.ellipse(cx, cy, r * 0.7, r * 0.85, 0, 0, Math.PI * 2);
  ctx.fill();

  // Jaw / lower face
  const jawGrad = ctx.createRadialGradient(cx, cy + r * 0.35, 0, cx, cy + r * 0.35, r * 0.5);
  jawGrad.addColorStop(0, '#888');
  jawGrad.addColorStop(0.6, '#777');
  jawGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = jawGrad;
  ctx.beginPath();
  ctx.ellipse(cx, cy + r * 0.25, r * 0.6, r * 0.55, 0, 0, Math.PI);
  ctx.fill();

  // Forehead highlight
  const fhGrad = ctx.createRadialGradient(cx, cy - r * 0.38, 0, cx, cy - r * 0.38, r * 0.35);
  fhGrad.addColorStop(0, '#ccc');
  fhGrad.addColorStop(0.5, '#bbb');
  fhGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = fhGrad;
  ctx.fillRect(0, 0, mapW, mapH);

  // Eye sockets + highlights
  const eyeY = cy - r * 0.06;
  for (const side of [-1, 1]) {
    const ex = cx + side * r * 0.24;
    const eyeGrad = ctx.createRadialGradient(ex, eyeY, 0, ex, eyeY, r * 0.12);
    eyeGrad.addColorStop(0, '#444');
    eyeGrad.addColorStop(0.6, '#555');
    eyeGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = eyeGrad;
    ctx.beginPath();
    ctx.ellipse(ex, eyeY, r * 0.12, r * 0.065, 0, 0, Math.PI * 2);
    ctx.fill();

    // Small eye highlight
    const ehGrad = ctx.createRadialGradient(
      ex + side * r * 0.02, eyeY - r * 0.01, 0, ex, eyeY, r * 0.04
    );
    ehGrad.addColorStop(0, '#999');
    ehGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = ehGrad;
    ctx.fillRect(0, 0, mapW, mapH);
  }

  // Eyebrows
  ctx.strokeStyle = '#555';
  ctx.lineWidth = r * 0.025;
  ctx.lineCap = 'round';
  for (const side of [-1, 1]) {
    const bx = cx + side * r * 0.24;
    const by = eyeY - r * 0.1;
    ctx.beginPath();
    ctx.arc(bx, by + r * 0.04, r * 0.13, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }

  // Nose bridge highlight
  const nbGrad = ctx.createRadialGradient(cx, cy + r * 0.05, 0, cx, cy + r * 0.05, r * 0.07);
  nbGrad.addColorStop(0, '#bbb');
  nbGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = nbGrad;
  ctx.fillRect(0, 0, mapW, mapH);

  // Nose sides shadow
  for (const side of [-1, 1]) {
    const nsGrad = ctx.createRadialGradient(
      cx + side * r * 0.09, cy + r * 0.12, 0,
      cx + side * r * 0.09, cy + r * 0.12, r * 0.07
    );
    nsGrad.addColorStop(0, '#555');
    nsGrad.addColorStop(0.6, '#666');
    nsGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = nsGrad;
    ctx.fillRect(0, 0, mapW, mapH);
  }

  // Nose tip
  const ntGrad = ctx.createRadialGradient(cx, cy + r * 0.16, 0, cx, cy + r * 0.16, r * 0.09);
  ntGrad.addColorStop(0, '#666');
  ntGrad.addColorStop(0.5, '#777');
  ntGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = ntGrad;
  ctx.beginPath();
  ctx.ellipse(cx, cy + r * 0.16, r * 0.09, r * 0.05, 0, 0, Math.PI * 2);
  ctx.fill();

  // Mouth
  ctx.strokeStyle = '#555';
  ctx.lineWidth = r * 0.018;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.15, cy + r * 0.28);
  ctx.quadraticCurveTo(cx - r * 0.05, cy + r * 0.3, cx, cy + r * 0.29);
  ctx.quadraticCurveTo(cx + r * 0.05, cy + r * 0.3, cx + r * 0.15, cy + r * 0.28);
  ctx.stroke();

  // Lower lip shadow
  const llGrad = ctx.createRadialGradient(cx, cy + r * 0.32, 0, cx, cy + r * 0.32, r * 0.08);
  llGrad.addColorStop(0, '#666');
  llGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = llGrad;
  ctx.fillRect(0, 0, mapW, mapH);

  // Chin highlight
  const chinGrad = ctx.createRadialGradient(cx, cy + r * 0.45, 0, cx, cy + r * 0.45, r * 0.15);
  chinGrad.addColorStop(0, '#aaa');
  chinGrad.addColorStop(0.5, '#999');
  chinGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = chinGrad;
  ctx.fillRect(0, 0, mapW, mapH);

  // Cheek shadows
  for (const side of [-1, 1]) {
    const cGrad = ctx.createRadialGradient(
      cx + side * r * 0.38, cy + r * 0.08, 0,
      cx + side * r * 0.38, cy + r * 0.08, r * 0.2
    );
    cGrad.addColorStop(0, '#666');
    cGrad.addColorStop(0.4, '#777');
    cGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = cGrad;
    ctx.fillRect(0, 0, mapW, mapH);
  }

  // Hair — Franklin's distinctive long side hair
  ctx.fillStyle = '#555';

  // Left hair
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.55, cy - r * 0.25);
  ctx.bezierCurveTo(
    cx - r * 0.78, cy - r * 0.05,
    cx - r * 0.82, cy + r * 0.3,
    cx - r * 0.62, cy + r * 0.68
  );
  ctx.lineTo(cx - r * 0.42, cy + r * 0.58);
  ctx.bezierCurveTo(
    cx - r * 0.56, cy + r * 0.2,
    cx - r * 0.56, cy,
    cx - r * 0.45, cy - r * 0.18
  );
  ctx.closePath();
  ctx.fill();

  // Right hair
  ctx.beginPath();
  ctx.moveTo(cx + r * 0.55, cy - r * 0.25);
  ctx.bezierCurveTo(
    cx + r * 0.78, cy - r * 0.05,
    cx + r * 0.82, cy + r * 0.3,
    cx + r * 0.62, cy + r * 0.68
  );
  ctx.lineTo(cx + r * 0.42, cy + r * 0.58);
  ctx.bezierCurveTo(
    cx + r * 0.56, cy + r * 0.2,
    cx + r * 0.56, cy,
    cx + r * 0.45, cy - r * 0.18
  );
  ctx.closePath();
  ctx.fill();

  // Hair texture strands
  ctx.strokeStyle = '#444';
  ctx.lineWidth = r * 0.012;
  ctx.lineCap = 'round';
  for (let i = 0; i < 10; i++) {
    const t = i / 10;
    for (const side of [-1, 1]) {
      const sx = cx + side * r * (0.48 + t * 0.22);
      ctx.beginPath();
      ctx.moveTo(sx, cy - r * 0.22 + t * r * 0.06);
      ctx.bezierCurveTo(
        sx + side * r * 0.15, cy + r * 0.1,
        sx + side * r * 0.08, cy + r * 0.35,
        sx - side * r * 0.05, cy + r * 0.55
      );
      ctx.stroke();
    }
  }

  // Top of head — slight highlight
  const topGrad = ctx.createRadialGradient(cx, cy - r * 0.75, 0, cx, cy - r * 0.75, r * 0.25);
  topGrad.addColorStop(0, '#aaa');
  topGrad.addColorStop(0.5, '#bbb');
  topGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, mapW, mapH);

  // Collar / clothing
  ctx.fillStyle = '#555';
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.55, cy + r * 0.62);
  ctx.bezierCurveTo(
    cx - r * 0.3, cy + r * 0.72,
    cx + r * 0.3, cy + r * 0.72,
    cx + r * 0.55, cy + r * 0.62
  );
  ctx.lineTo(cx + r * 0.85, mapH);
  ctx.lineTo(cx - r * 0.85, mapH);
  ctx.closePath();
  ctx.fill();

  // Collar V-neckline
  ctx.strokeStyle = '#777';
  ctx.lineWidth = r * 0.02;
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.18, cy + r * 0.6);
  ctx.lineTo(cx, cy + r * 0.78);
  ctx.lineTo(cx + r * 0.18, cy + r * 0.6);
  ctx.stroke();

  // Glasses — adds recognizability
  ctx.strokeStyle = '#555';
  ctx.lineWidth = r * 0.022;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.ellipse(cx - r * 0.22, eyeY + r * 0.01, r * 0.14, r * 0.09, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx + r * 0.22, eyeY + r * 0.01, r * 0.14, r * 0.09, 0, 0, Math.PI * 2);
  ctx.stroke();
  // Bridge
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.08, eyeY);
  ctx.quadraticCurveTo(cx, eyeY - r * 0.03, cx + r * 0.08, eyeY);
  ctx.stroke();

  return ctx.getImageData(0, 0, mapW, mapH);
}

// --- Engraving line renderer ---

function fillLinePoly(ctx: CanvasRenderingContext2D, topPts: number[], botPts: number[]) {
  ctx.beginPath();
  ctx.moveTo(topPts[0], topPts[1]);
  for (let j = 2; j < topPts.length; j += 2) {
    ctx.lineTo(topPts[j], topPts[j + 1]);
  }
  for (let j = botPts.length - 2; j >= 0; j -= 2) {
    ctx.lineTo(botPts[j], botPts[j + 1]);
  }
  ctx.closePath();
  ctx.fill();
}

function renderEngraving(
  canvas: HTMLCanvasElement,
  w: number,
  h: number,
  dpr: number,
  mapData: ImageData,
  mapW: number,
  mapH: number
) {
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);

  // Sample darkness from luminance map (0 = white, 1 = black)
  function darkness(x: number, y: number): number {
    const mx = Math.min(mapW - 1, Math.max(0, Math.round((x / w) * mapW)));
    const my = Math.min(mapH - 1, Math.max(0, Math.round((y / h) * mapH)));
    const idx = (my * mapW + mx) * 4;
    return 1 - (mapData.data[idx] / 255);
  }

  const goldColor = '#c4a94d';
  ctx.fillStyle = goldColor;

  // --- Horizontal engraving lines ---
  const numLines = 130;
  const spacing = h / numLines;
  const maxHalf = spacing * 0.38;
  const step = 2;

  for (let i = 0; i < numLines; i++) {
    const baseY = spacing * (i + 0.5);
    const topPts: number[] = [];
    const botPts: number[] = [];

    for (let x = 0; x <= w; x += step) {
      const d = darkness(x, baseY);
      if (d < 0.05) {
        if (topPts.length >= 4) fillLinePoly(ctx, topPts, botPts);
        topPts.length = 0;
        botPts.length = 0;
        continue;
      }

      // Contour curve — deflect based on vertical darkness gradient
      const dUp = darkness(x, baseY - spacing * 0.5);
      const dDown = darkness(x, baseY + spacing * 0.5);
      const curve = (dDown - dUp) * spacing * 1.5;

      // Organic wobble for hand-engraved feel
      const wobble = Math.sin(x * 0.025 + i * 1.73) * maxHalf * 0.12;

      const hw = d * maxHalf;
      const y = baseY + curve + wobble;

      topPts.push(x, y - hw);
      botPts.push(x, y + hw);
    }

    if (topPts.length >= 4) fillLinePoly(ctx, topPts, botPts);
  }

  // --- Cross-hatch lines (diagonal, darkest areas only) ---
  ctx.fillStyle = goldColor;
  const crossAngle = Math.PI * 0.28;
  const cosA = Math.cos(crossAngle);
  const sinA = Math.sin(crossAngle);
  const diag = Math.sqrt(w * w + h * h);
  const crossSpacing = spacing * 1.3;
  const crossMaxHalf = crossSpacing * 0.22;
  const crossStep = 3;
  const numCross = Math.ceil(diag / crossSpacing);

  for (let i = -numCross; i < numCross; i++) {
    const offset = i * crossSpacing;
    const topPts: number[] = [];
    const botPts: number[] = [];

    for (let t = -diag; t < diag; t += crossStep) {
      const x = w / 2 + cosA * t - sinA * offset;
      const y = h / 2 + sinA * t + cosA * offset;

      if (x < -10 || x > w + 10 || y < -10 || y > h + 10) continue;

      const d = darkness(x, y);
      const crossD = Math.max(0, (d - 0.4) / 0.6);

      if (crossD < 0.04) {
        if (topPts.length >= 4) fillLinePoly(ctx, topPts, botPts);
        topPts.length = 0;
        botPts.length = 0;
        continue;
      }

      const hw = crossD * crossMaxHalf;
      const px = -sinA * hw;
      const py = cosA * hw;

      topPts.push(x + px, y + py);
      botPts.push(x - px, y - py);
    }

    if (topPts.length >= 4) fillLinePoly(ctx, topPts, botPts);
  }
}

// --- Component ---

export function GoldenRainEffect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<EngravingState | null>(null);
  const initedRef = useRef(false);

  // Pause/resume on visibility
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

  // Cleanup
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

  // Initialize
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
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.scale(dpr, dpr);

    // Build portrait luminance map
    const mapW = 400;
    const mapH = 500;
    const mapData = createPortraitMap(mapW, mapH);

    // Pre-render engraving to offscreen canvas
    const engravingLayer = document.createElement('canvas');
    renderEngraving(engravingLayer, w, h, dpr, mapData, mapW, mapH);

    const state: EngravingState = {
      canvas, ctx, engravingLayer,
      w, h, dpr,
      time: Math.random() * 3,
      lastTimestamp: 0,
      paused: false,
      frameId: 0,
      animateFn: null,
    };
    stateRef.current = state;

    // Resize handler
    const ro = new ResizeObserver(() => {
      if (!container.isConnected) return;
      const s = stateRef.current;
      if (!s) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      if (nw === s.w && nh === s.h) return;

      const nd = Math.min(window.devicePixelRatio, 2);
      s.canvas.width = Math.round(nw * nd);
      s.canvas.height = Math.round(nh * nd);
      s.ctx.setTransform(nd, 0, 0, nd, 0, 0);
      s.w = nw;
      s.h = nh;
      s.dpr = nd;
      renderEngraving(s.engravingLayer, nw, nh, nd, mapData, mapW, mapH);
    });
    ro.observe(container);

    state.animateFn = animate;
    state.frameId = requestAnimationFrame(animate);

    return () => ro.disconnect();

    // --- Animation frame ---
    function animate(timestamp: number) {
      const s = stateRef.current;
      if (!s || s.paused) return;

      if (s.lastTimestamp === 0) s.lastTimestamp = timestamp;
      const dt = Math.min((timestamp - s.lastTimestamp) / 1000, 0.1);
      s.lastTimestamp = timestamp;
      s.time += dt;

      const { ctx: c, w: cw, h: ch, engravingLayer: eng } = s;
      c.clearRect(0, 0, cw, ch);

      // Subtle breathing — base alpha oscillates gently
      const breath = 0.22 + Math.sin(s.time * 0.4) * 0.03;

      // 1. Base engraving (subtle gold ghost)
      c.globalAlpha = breath;
      c.globalCompositeOperation = 'source-over';
      c.drawImage(eng, 0, 0, cw, ch);

      // 2. Shimmer pulse — diagonal sweep with additive blending
      const cycleDuration = 4.5;
      const pauseDuration = 2.5;
      const totalCycle = cycleDuration + pauseDuration;
      const cycleTime = s.time % totalCycle;

      if (cycleTime < cycleDuration) {
        const progress = cycleTime / cycleDuration;
        const bandAngle = Math.PI / 5;
        const diagLen = Math.sqrt(cw * cw + ch * ch);
        const bandPos = (-0.3 + progress * 1.6) * diagLen;
        const bandHalf = diagLen * 0.12;
        const cosB = Math.cos(bandAngle);
        const sinB = Math.sin(bandAngle);
        const gcx = cw * 0.5 + cosB * bandPos;
        const gcy = ch * 0.5 + sinB * bandPos;

        // Additive shimmer — brightens lines AND adds subtle golden bloom
        c.globalCompositeOperation = 'lighter';
        c.globalAlpha = 1;

        const grad = c.createLinearGradient(
          gcx - cosB * bandHalf, gcy - sinB * bandHalf,
          gcx + cosB * bandHalf, gcy + sinB * bandHalf
        );
        grad.addColorStop(0, 'rgba(196,169,77,0)');
        grad.addColorStop(0.2, 'rgba(220,190,90,0.08)');
        grad.addColorStop(0.4, 'rgba(255,225,120,0.18)');
        grad.addColorStop(0.5, 'rgba(255,240,160,0.25)');
        grad.addColorStop(0.6, 'rgba(255,225,120,0.18)');
        grad.addColorStop(0.8, 'rgba(220,190,90,0.08)');
        grad.addColorStop(1, 'rgba(196,169,77,0)');

        c.fillStyle = grad;
        c.fillRect(0, 0, cw, ch);
      }

      // 3. Edge fades + center content void
      c.globalCompositeOperation = 'destination-out';
      c.globalAlpha = 1;

      // Center void — keeps heading text area readable
      const voidW = cw * 0.30;
      const voidH = ch * 0.18;
      const vcx = cw / 2;
      const vcy = ch / 2;
      const voidGrad = c.createRadialGradient(vcx, vcy, 0, vcx, vcy, 1);
      voidGrad.addColorStop(0, 'rgba(0,0,0,0.60)');
      voidGrad.addColorStop(0.5, 'rgba(0,0,0,0.20)');
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
      const bfh = ch * 0.18;
      const bGrad = c.createLinearGradient(0, ch - bfh, 0, ch);
      bGrad.addColorStop(0, 'rgba(0,0,0,0)');
      bGrad.addColorStop(0.5, 'rgba(0,0,0,0.4)');
      bGrad.addColorStop(1, 'rgba(0,0,0,0.9)');
      c.fillStyle = bGrad;
      c.fillRect(0, ch - bfh, cw, bfh);

      // Top fade
      const tfh = ch * 0.08;
      const tGrad = c.createLinearGradient(0, 0, 0, tfh);
      tGrad.addColorStop(0, 'rgba(0,0,0,0.7)');
      tGrad.addColorStop(0.5, 'rgba(0,0,0,0.2)');
      tGrad.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = tGrad;
      c.fillRect(0, 0, cw, tfh);

      // Side fades
      const sfw = cw * 0.07;
      const lGrad = c.createLinearGradient(0, 0, sfw, 0);
      lGrad.addColorStop(0, 'rgba(0,0,0,0.6)');
      lGrad.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = lGrad;
      c.fillRect(0, 0, sfw, ch);

      const rGrad = c.createLinearGradient(cw - sfw, 0, cw, 0);
      rGrad.addColorStop(0, 'rgba(0,0,0,0)');
      rGrad.addColorStop(1, 'rgba(0,0,0,0.6)');
      c.fillStyle = rGrad;
      c.fillRect(cw - sfw, 0, sfw, ch);

      // Reset compositing
      c.globalCompositeOperation = 'source-over';
      c.globalAlpha = 1;

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
