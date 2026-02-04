'use client';

import { useRef, useEffect } from 'react';

/**
 * Golden Scan Effect
 *
 * A large $100 bill image revealed by a sweeping light-beam mask.
 * The image is invisible except where the beam passes — gradient
 * edges on the beam simulate natural light falloff. A subtle golden
 * glow follows the beam center.
 *
 * Pre-renders the gold-tinted bill to an offscreen canvas so the
 * animation loop only composites the static layer with a moving mask.
 */

interface ScanState {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  goldBillLayer: HTMLCanvasElement | null;
  w: number;
  h: number;
  dpr: number;
  time: number;
  lastTimestamp: number;
  paused: boolean;
  frameId: number;
  animateFn: ((ts: number) => void) | null;
}

/**
 * Pre-render the $100 bill with a gold tint onto an offscreen canvas.
 * Called once on load and again on resize.
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

  // Calculate "cover" dimensions — fill the canvas entirely
  const imgAspect = img.naturalWidth / img.naturalHeight;
  const canvasAspect = w / h;
  let dw: number, dh: number, dx: number, dy: number;

  if (canvasAspect > imgAspect) {
    // Canvas is wider — fit width, overflow height
    dw = w;
    dh = w / imgAspect;
    dx = 0;
    dy = (h - dh) / 2;
  } else {
    // Canvas is taller — fit height, overflow width
    dh = h;
    dw = h * imgAspect;
    dx = (w - dw) / 2;
    dy = 0;
  }

  // Draw the bill at full opacity
  oc.globalAlpha = 1;
  oc.drawImage(img, dx, dy, dw, dh);

  // Apply a subtle warm-white tint (source-atop only tints existing pixels)
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

// --- Component ---

export function GoldenRainEffect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<ScanState | null>(null);
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

  // Cleanup (reset initedRef so re-mount in Strict Mode works)
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

    const state: ScanState = {
      canvas,
      ctx,
      goldBillLayer: null,
      w,
      h,
      dpr,
      time: 0,
      lastTimestamp: 0,
      paused: false,
      frameId: 0,
      animateFn: null,
    };
    stateRef.current = state;

    // Load the $100 bill image, then pre-render gold layer
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      state.goldBillLayer = renderGoldBill(img, state.w, state.h, state.dpr);

      // Resize handler (needs img reference)
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

      // Start animation
      state.animateFn = animate;
      state.frameId = requestAnimationFrame(animate);
    };
    img.src = '/images/hero/100-dollar-bill.png';

    // --- Animation frame ---
    function animate(timestamp: number) {
      const s = stateRef.current;
      if (!s || s.paused || !s.goldBillLayer) return;

      if (s.lastTimestamp === 0) s.lastTimestamp = timestamp;
      const dt = Math.min((timestamp - s.lastTimestamp) / 1000, 0.1);
      s.lastTimestamp = timestamp;
      s.time += dt;

      const { ctx: c, w: cw, h: ch, goldBillLayer: bill } = s;
      c.clearRect(0, 0, cw, ch);

      // Beam timing: sweep + pause
      const sweepDuration = 13;
      const pauseDuration = 0.15;
      const totalCycle = sweepDuration + pauseDuration;
      const cycleTime = s.time % totalCycle;

      const beamHalf = cw * 0.35; // half-width of the beam

      // Compute beam position (shared by mask + glow)
      let beamX = -beamHalf * 1.5; // off-screen default during pause
      let isSweeping = false;

      if (cycleTime < sweepDuration) {
        isSweeping = true;
        const t = cycleTime / sweepDuration;
        // Smooth ease-in-out
        const eased = t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;
        beamX = -beamHalf * 1.5 + eased * (cw + beamHalf * 3);
      }

      // ── 1. Draw bill revealed by beam mask ──
      // Draw bill at full opacity, then use destination-in to mask it
      c.globalAlpha = 0.35;
      c.globalCompositeOperation = 'source-over';
      c.drawImage(bill, 0, 0, cw, ch);

      // ── 2. Apply beam mask (destination-in) ──
      // Only keeps pixels where the mask is non-transparent.
      c.globalCompositeOperation = 'destination-in';
      c.globalAlpha = 1;

      // Always draw the mask — during pause it's off-screen so nothing shows
      const beamGrad = c.createLinearGradient(
        beamX - beamHalf, 0,
        beamX + beamHalf, 0
      );
      // Brighter beam with softer edges
      beamGrad.addColorStop(0, 'rgba(255,255,255,0)');
      beamGrad.addColorStop(0.05, 'rgba(255,255,255,0.02)');
      beamGrad.addColorStop(0.15, 'rgba(255,255,255,0.15)');
      beamGrad.addColorStop(0.30, 'rgba(255,255,255,0.55)');
      beamGrad.addColorStop(0.50, 'rgba(255,255,255,1.0)');
      beamGrad.addColorStop(0.70, 'rgba(255,255,255,0.55)');
      beamGrad.addColorStop(0.85, 'rgba(255,255,255,0.15)');
      beamGrad.addColorStop(0.95, 'rgba(255,255,255,0.02)');
      beamGrad.addColorStop(1, 'rgba(255,255,255,0)');

      // Draw beam at a slight angle (~6 degrees)
      c.save();
      c.translate(cw / 2, ch / 2);
      c.rotate(6 * Math.PI / 180);
      c.translate(-cw / 2, -ch / 2);
      c.fillStyle = beamGrad;
      // Expand fill rect to cover corners after rotation
      c.fillRect(-cw * 0.1, -ch * 0.1, cw * 1.2, ch * 1.2);
      c.restore();

      // ── 3. White-light glow bloom along the beam ──
      c.globalCompositeOperation = 'lighter';

      if (isSweeping) {
        c.globalAlpha = 0.10;
        const glowGrad = c.createLinearGradient(
          beamX - beamHalf * 0.6, 0,
          beamX + beamHalf * 0.6, 0
        );
        glowGrad.addColorStop(0, 'rgba(220,230,240,0)');
        glowGrad.addColorStop(0.25, 'rgba(230,240,250,0.4)');
        glowGrad.addColorStop(0.50, 'rgba(245,250,255,1)');
        glowGrad.addColorStop(0.75, 'rgba(230,240,250,0.4)');
        glowGrad.addColorStop(1, 'rgba(220,230,240,0)');

        // Match the beam angle for glow
        c.save();
        c.translate(cw / 2, ch / 2);
        c.rotate(6 * Math.PI / 180);
        c.translate(-cw / 2, -ch / 2);
        c.fillStyle = glowGrad;
        c.fillRect(-cw * 0.1, -ch * 0.1, cw * 1.2, ch * 1.2);
        c.restore();
      }

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
