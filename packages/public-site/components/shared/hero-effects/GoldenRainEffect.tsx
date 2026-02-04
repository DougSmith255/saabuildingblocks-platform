'use client';

import { useRef, useEffect } from 'react';

/**
 * Golden Scan Effect
 *
 * A large $100 bill image revealed by a sweeping light-beam mask.
 * The image is invisible except where the beam passes — gradient
 * edges on the beam simulate natural light falloff. A subtle
 * glow follows the beam center.
 *
 * Pre-renders the tinted bill to an offscreen canvas so the
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
 * Pre-render the $100 bill with a warm-white tint onto an offscreen canvas.
 * Image is drawn at 80% size, centered.
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

  // Calculate "cover" dimensions — fill the canvas entirely, then scale to 80%
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

  // Scale to 80% and center
  const scale = 0.8;
  const sdw = dw * scale;
  const sdh = dh * scale;
  const sdx = dx + (dw - sdw) / 2;
  const sdy = dy + (dh - sdh) / 2;

  // Draw the bill at full opacity
  oc.globalAlpha = 1;
  oc.drawImage(img, sdx, sdy, sdw, sdh);

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
      // Start time offset so beam is already visible within ~1s of image load
      time: 1.5,
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
    // Eager-load for fast first paint
    img.fetchPriority = 'high';
    img.src = '/images/hero/100-dollar-bill.png';

    // --- Animation constants ---
    const SWEEP_ANGLE = 15 * Math.PI / 180; // 15-degree diagonal sweep
    const cosA = Math.cos(SWEEP_ANGLE);
    const sinA = Math.sin(SWEEP_ANGLE);

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

      // Narrower beam — 18% of canvas width per side
      const beamHalf = cw * 0.18;

      // The diagonal sweep distance (hypotenuse accounting for angle)
      const sweepDist = cw / cosA + beamHalf * 3;

      // Compute beam center along the diagonal sweep axis
      let progress = -beamHalf * 1.5; // off-screen default during pause
      let isSweeping = false;

      if (cycleTime < sweepDuration) {
        isSweeping = true;
        const t = cycleTime / sweepDuration;
        // Smooth ease-in-out
        const eased = t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;
        progress = -beamHalf * 1.5 + eased * sweepDist;
      }

      // Beam center in screen coordinates — sweep along the angled path
      const beamX = progress * cosA;
      const beamY = -progress * sinA + ch * 0.5 * sinA; // offset to center vertically

      // ── 1. Draw bill revealed by beam mask ──
      c.globalAlpha = 0.35;
      c.globalCompositeOperation = 'source-over';
      c.drawImage(bill, 0, 0, cw, ch);

      // ── 2. Apply beam mask (destination-in) ──
      c.globalCompositeOperation = 'destination-in';
      c.globalAlpha = 1;

      // Create gradient perpendicular to the beam angle
      // Gradient axis is along the sweep direction (the angle)
      const gx1 = beamX - beamHalf * cosA;
      const gy1 = beamY + beamHalf * sinA;
      const gx2 = beamX + beamHalf * cosA;
      const gy2 = beamY - beamHalf * sinA;

      const beamGrad = c.createLinearGradient(gx1, gy1, gx2, gy2);
      // Flat plateau in center with sharp falloff at edges
      beamGrad.addColorStop(0, 'rgba(255,255,255,0)');
      beamGrad.addColorStop(0.06, 'rgba(255,255,255,0)');
      beamGrad.addColorStop(0.14, 'rgba(255,255,255,0.9)');
      beamGrad.addColorStop(0.20, 'rgba(255,255,255,1.0)');
      beamGrad.addColorStop(0.80, 'rgba(255,255,255,1.0)');
      beamGrad.addColorStop(0.86, 'rgba(255,255,255,0.9)');
      beamGrad.addColorStop(0.94, 'rgba(255,255,255,0)');
      beamGrad.addColorStop(1, 'rgba(255,255,255,0)');

      c.fillStyle = beamGrad;
      // Fill entire canvas — gradient controls visibility
      c.fillRect(-cw * 0.2, -ch * 0.2, cw * 1.4, ch * 1.4);

      // ── 3. White-light glow bloom along the beam ──
      c.globalCompositeOperation = 'lighter';

      if (isSweeping) {
        c.globalAlpha = 0.10;
        const glowHalf = beamHalf * 0.5;
        const glx1 = beamX - glowHalf * cosA;
        const gly1 = beamY + glowHalf * sinA;
        const glx2 = beamX + glowHalf * cosA;
        const gly2 = beamY - glowHalf * sinA;

        const glowGrad = c.createLinearGradient(glx1, gly1, glx2, gly2);
        glowGrad.addColorStop(0, 'rgba(220,230,240,0)');
        glowGrad.addColorStop(0.20, 'rgba(230,240,250,0.4)');
        glowGrad.addColorStop(0.50, 'rgba(245,250,255,1)');
        glowGrad.addColorStop(0.80, 'rgba(230,240,250,0.4)');
        glowGrad.addColorStop(1, 'rgba(220,230,240,0)');

        c.fillStyle = glowGrad;
        c.fillRect(-cw * 0.2, -ch * 0.2, cw * 1.4, ch * 1.4);
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
