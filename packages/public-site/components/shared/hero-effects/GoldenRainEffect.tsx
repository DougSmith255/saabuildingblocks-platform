'use client';

import { useRef, useEffect } from 'react';

/**
 * Golden Flashlight Effect
 *
 * A large $100 bill image revealed by a circular flashlight.
 * Desktop: light follows the mouse cursor with smooth interpolation.
 * Mobile:  light wanders autonomously in a gentle organic path.
 */

interface FlashlightState {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  goldBillLayer: HTMLCanvasElement | null;
  w: number;
  h: number;
  dpr: number;
  paused: boolean;
  frameId: number;
  animateFn: ((ts: number) => void) | null;
  // Smoothed flashlight position (CSS pixels, relative to canvas)
  lightX: number;
  lightY: number;
  // Raw mouse target (or autonomous target on mobile)
  targetX: number;
  targetY: number;
  isMobile: boolean;
  // Autonomous wander state
  wanderTime: number;
  lastTimestamp: number;
}

/**
 * Pre-render the $100 bill with a warm-white tint onto an offscreen canvas.
 * Image drawn at 80% size, centered.
 */
function renderGoldBill(
  img: HTMLImageElement,
  w: number,
  h: number,
  dpr: number
): HTMLCanvasElement {
  const offscreen = document.createElement('canvas');
  offscreen.width = Math.round(w * dpr);
  offscreen.height = Math.round(h * dpr);
  const oc = offscreen.getContext('2d')!;
  oc.scale(dpr, dpr);

  const imgAspect = img.naturalWidth / img.naturalHeight;
  const canvasAspect = w / h;
  let dw: number, dh: number, dx: number, dy: number;

  if (canvasAspect > imgAspect) {
    dw = w;
    dh = w / imgAspect;
    dx = 0;
    dy = (h - dh) / 2;
  } else {
    dh = h;
    dw = h * imgAspect;
    dx = (w - dw) / 2;
    dy = 0;
  }

  const scale = 0.8;
  const sdw = dw * scale;
  const sdh = dh * scale;
  const sdx = dx + (dw - sdw) / 2;
  const sdy = dy + (dh - sdh) / 2;

  oc.globalAlpha = 1;
  oc.drawImage(img, sdx, sdy, sdw, sdh);

  // Subtle warm-white tint
  oc.globalCompositeOperation = 'source-atop';
  oc.globalAlpha = 0.25;
  oc.fillStyle = '#d0cfc8';
  oc.fillRect(0, 0, w, h);

  // Light contrast boost
  oc.globalCompositeOperation = 'multiply';
  oc.globalAlpha = 0.15;
  oc.fillStyle = '#e0ddd0';
  oc.fillRect(0, 0, w, h);

  oc.globalCompositeOperation = 'source-over';
  oc.globalAlpha = 1;

  return offscreen;
}

export function GoldenRainEffect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<FlashlightState | null>(null);
  const initedRef = useRef(false);

  // Pause / resume on visibility
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
      initedRef.current = false;
    };
  }, []);

  // Initialise
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

    const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;

    const state: FlashlightState = {
      canvas,
      ctx,
      goldBillLayer: null,
      w,
      h,
      dpr,
      paused: false,
      frameId: 0,
      animateFn: null,
      lightX: w * 0.5,
      lightY: h * 0.5,
      targetX: w * 0.5,
      targetY: h * 0.5,
      isMobile,
      wanderTime: Math.random() * 100,
      lastTimestamp: 0,
    };
    stateRef.current = state;

    // Mouse tracking — convert page coords to canvas-relative coords
    const onMouseMove = (e: MouseEvent) => {
      const s = stateRef.current;
      if (!s || s.isMobile) return;
      const rect = container.getBoundingClientRect();
      s.targetX = e.clientX - rect.left;
      s.targetY = e.clientY - rect.top;
    };

    if (!isMobile) {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
    }

    // Load the $100 bill image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      state.goldBillLayer = renderGoldBill(img, state.w, state.h, state.dpr);

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
        s.goldBillLayer = renderGoldBill(img, nw, nh, nd);
      });
      ro.observe(container);

      state.animateFn = animate;
      state.frameId = requestAnimationFrame(animate);
    };
    img.fetchPriority = 'high';
    img.src = '/images/hero/100-dollar-bill.png';

    // --- Lerp constant ---
    const LERP_SPEED = 0.07;

    // --- Flashlight radius ---
    // Scales with canvas size — roughly 25% of the smaller dimension
    function getRadius(cw: number, ch: number) {
      return Math.min(cw, ch) * 0.28;
    }

    // --- Animation frame ---
    function animate(timestamp: number) {
      const s = stateRef.current;
      if (!s || s.paused || !s.goldBillLayer) return;

      if (s.lastTimestamp === 0) s.lastTimestamp = timestamp;
      const dt = Math.min((timestamp - s.lastTimestamp) / 1000, 0.1);
      s.lastTimestamp = timestamp;

      const { ctx: c, w: cw, h: ch, goldBillLayer: bill } = s;

      // --- Update autonomous wander for mobile ---
      if (s.isMobile) {
        s.wanderTime += dt;
        const t = s.wanderTime;
        // Lissajous-like path with slow irrational frequencies
        s.targetX = cw * 0.5 + cw * 0.32 * Math.sin(t * 0.23 + 1.7) * Math.cos(t * 0.11);
        s.targetY = ch * 0.5 + ch * 0.25 * Math.cos(t * 0.19 + 0.5) * Math.sin(t * 0.13);
      }

      // --- Smooth interpolation toward target ---
      s.lightX += (s.targetX - s.lightX) * LERP_SPEED;
      s.lightY += (s.targetY - s.lightY) * LERP_SPEED;

      const lx = s.lightX;
      const ly = s.lightY;
      const radius = getRadius(cw, ch);

      c.clearRect(0, 0, cw, ch);

      // ── 1. Draw bill at low base opacity ──
      c.globalAlpha = 0.35;
      c.globalCompositeOperation = 'source-over';
      c.drawImage(bill, 0, 0, cw, ch);

      // ── 2. Circular flashlight mask (destination-in) ──
      c.globalCompositeOperation = 'destination-in';
      c.globalAlpha = 1;

      const radGrad = c.createRadialGradient(lx, ly, 0, lx, ly, radius);
      radGrad.addColorStop(0, 'rgba(255,255,255,1)');
      radGrad.addColorStop(0.5, 'rgba(255,255,255,0.85)');
      radGrad.addColorStop(0.75, 'rgba(255,255,255,0.4)');
      radGrad.addColorStop(1, 'rgba(255,255,255,0)');

      c.fillStyle = radGrad;
      c.fillRect(0, 0, cw, ch);

      // ── 3. Subtle white glow bloom at center ──
      c.globalCompositeOperation = 'lighter';
      c.globalAlpha = 0.08;

      const glowGrad = c.createRadialGradient(lx, ly, 0, lx, ly, radius * 0.5);
      glowGrad.addColorStop(0, 'rgba(245,250,255,1)');
      glowGrad.addColorStop(0.4, 'rgba(230,240,250,0.5)');
      glowGrad.addColorStop(1, 'rgba(220,230,240,0)');

      c.fillStyle = glowGrad;
      c.fillRect(0, 0, cw, ch);

      // ── 4. Edge fades for seamless blend into dark background ──
      c.globalCompositeOperation = 'destination-out';
      c.globalAlpha = 1;

      // Center void — keep heading text readable
      const voidW = cw * 0.30;
      const voidH = ch * 0.18;
      const vcx = cw / 2;
      const vcy = ch / 2;
      const voidGrad = c.createRadialGradient(vcx, vcy, 0, vcx, vcy, 1);
      voidGrad.addColorStop(0, 'rgba(0,0,0,0.50)');
      voidGrad.addColorStop(0.5, 'rgba(0,0,0,0.15)');
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
      const bfh = ch * 0.20;
      const bGrad = c.createLinearGradient(0, ch - bfh, 0, ch);
      bGrad.addColorStop(0, 'rgba(0,0,0,0)');
      bGrad.addColorStop(0.5, 'rgba(0,0,0,0.4)');
      bGrad.addColorStop(1, 'rgba(0,0,0,0.9)');
      c.fillStyle = bGrad;
      c.fillRect(0, ch - bfh, cw, bfh);

      // Top fade
      const tfh = ch * 0.10;
      const tGrad = c.createLinearGradient(0, 0, 0, tfh);
      tGrad.addColorStop(0, 'rgba(0,0,0,0.7)');
      tGrad.addColorStop(0.5, 'rgba(0,0,0,0.25)');
      tGrad.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = tGrad;
      c.fillRect(0, 0, cw, tfh);

      // Side fades
      const sfw = cw * 0.08;
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

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
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
