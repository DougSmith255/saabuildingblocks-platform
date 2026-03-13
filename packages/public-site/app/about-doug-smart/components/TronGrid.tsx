'use client';

import { useRef, useEffect, type MutableRefObject } from 'react';
import type { AudioBands } from './useTronAudio';

interface TronGridProps {
  bandsRef: MutableRefObject<AudioBands>;
  initTimeRef: MutableRefObject<number>;
}

export function TronGrid({ bandsRef, initTimeRef }: TronGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const observer = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(canvas);

    // Blue dot atmosphere - varied sizes, brighter, audio-reactive
    const particles = Array.from({ length: 120 }, (_, i) => ({
      a: i * 137.508,
      s: 0.06 + (i % 9) * 0.025,
      r: 1.0 + (i % 5) * 0.35,       // radius 1.0 - 2.4
      alpha: 0.18 + (i % 7) * 0.035,  // alpha 0.18 - 0.39
    }));

    // Each colored line tracks its own position 0-1 independently
    // They reset to 0 when transitioning to active so they start from the back
    let purplePos = -1; // -1 = not yet started
    let greenPos = -1;
    let goldPos = -1;
    let cyanPos = 0;
    let wasActive = false;
    let time = 0;

    const draw = () => {
      if (!isVisibleRef.current) { raf = requestAnimationFrame(draw); return; }

      const { bass, mids, highs } = bandsRef.current;
      const hasAudio = bass > 0.01 || mids > 0.01 || highs > 0.01;
      ctx.clearRect(0, 0, w, h);

      const horizon = h * 0.38;
      const vanishX = w / 2;
      const vLines = 22;
      const spread = w * 1.3;
      const hLines = 40;

      // ── Init animation ──────────────────────────────────
      const initAge = initTimeRef.current > 0 ? (Date.now() - initTimeRef.current) / 1000 : 999;
      const isInit = initAge < 2.0;
      const initDone = initAge >= 2.0;
      let initBright = 0, initPulse = 0;
      if (isInit) {
        initPulse = Math.min(initAge / 1.5, 1);
        initBright = initAge < 0.15 ? initAge / 0.15 : Math.max(0, 1 - (initAge - 0.15) / 1.35);
      }

      const isActive = hasAudio && initDone;

      // When transitioning from idle to active, reset colored lines to start from back
      if (isActive && !wasActive) {
        purplePos = 0;
        greenPos = 0;
        goldPos = 0;
      }
      // When transitioning from active to idle, reset everything
      if (!isActive && wasActive) {
        purplePos = -1;
        greenPos = -1;
        goldPos = -1;
        cyanPos = 0; // cyan resumes from the back
      }
      wasActive = isActive;

      // ── Helper ──────────────────────────────────────────
      const xBounds = (y: number) => {
        const tl = Math.max(0, (y - horizon) / (h - horizon));
        return { xl: vanishX - spread * tl, xr: vanishX + spread * tl };
      };

      // Perspective curve: accelerates toward the bottom
      const perspY = (t: number) => horizon + (h - horizon) * (t * t);

      // Bass pulse - subtle blue hue wash over grid, not bright lines
      const bassPulse = hasAudio ? bass * 0.35 : 0;
      // Idle: clearly visible grid. During music: grid stays subdued so scan lines pop
      const baseAlpha = 0.32 + bassPulse;

      // ── Horizontal grid lines (ALWAYS CYAN) ─────────────
      // Pass 1: normal crisp lines
      for (let i = 0; i <= hLines; i++) {
        const t = i / hLines;
        const y = perspY(t);
        const { xl, xr } = xBounds(y);
        const fade = 0.3 + 0.7 * (1 - t);

        ctx.strokeStyle = `rgba(0,212,255,${baseAlpha * fade})`;
        ctx.lineWidth = 0.5 + bassPulse * 3 * (1 - t * 0.6);
        ctx.beginPath();
        ctx.moveTo(xl, y);
        ctx.lineTo(xr, y);
        ctx.stroke();

        // Init shockwave
        if (isInit) {
          const tLinear = (y - horizon) / (h - horizon);
          if (Math.abs(tLinear - initPulse) < 0.15) {
            const wi = initBright * (1 - Math.abs(tLinear - initPulse) / 0.15);
            ctx.save();
            ctx.strokeStyle = `rgba(255,255,255,${wi * 0.9})`;
            ctx.lineWidth = 2 + wi * 6;
            ctx.shadowBlur = 15 + wi * 30;
            ctx.shadowColor = `rgba(0,212,255,${wi})`;
            ctx.beginPath();
            ctx.moveTo(xl, y);
            ctx.lineTo(xr, y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // ── Vertical grid lines (ALWAYS CYAN) ───────────────
      for (let i = -vLines; i <= vLines; i++) {
        const bottomX = vanishX + (i / vLines) * spread;
        const intensity = 1 - Math.abs(i / vLines) * 0.5;
        ctx.strokeStyle = `rgba(0,212,255,${baseAlpha * intensity})`;
        ctx.lineWidth = 0.5 + bassPulse * 3 * intensity;
        ctx.beginPath();
        ctx.moveTo(vanishX, horizon);
        ctx.lineTo(bottomX, h);
        ctx.stroke();
      }

      // ── Blue hue wash over grid area (pulses with bass) ──────
      // Single gradient fill - cheap alternative to per-line shadowBlur
      if (hasAudio && bass > 0.08) {
        const washGrad = ctx.createLinearGradient(0, horizon, 0, h);
        washGrad.addColorStop(0, `rgba(0,212,255,${bass * 0.12})`);
        washGrad.addColorStop(0.5, `rgba(0,212,255,${bass * 0.06})`);
        washGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = washGrad;
        ctx.fillRect(0, horizon, w, h - horizon);
      }

      // ── Horizon glow (cyan, capped so it doesn't take over the screen) ──
      const glowR = Math.min(200 + bassPulse * 280 + initBright * 200, 380);
      const grad = ctx.createRadialGradient(vanishX, horizon, 0, vanishX, horizon, glowR);
      grad.addColorStop(0, `rgba(0,212,255,${0.2 + bassPulse * 0.8 + initBright * 0.5})`);
      grad.addColorStop(0.4, `rgba(0,212,255,${0.06 + bassPulse * 0.25})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Colored horizon glows when active
      if (isActive) {
        const pGrad = ctx.createRadialGradient(vanishX, horizon, 0, vanishX, horizon, glowR * 0.6);
        pGrad.addColorStop(0, `rgba(160,80,255,${bass * 0.25})`);
        pGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = pGrad;
        ctx.fillRect(0, 0, w, h);

        const gGrad = ctx.createRadialGradient(vanishX, horizon + 40, 0, vanishX, horizon + 40, glowR * 0.4);
        gGrad.addColorStop(0, `rgba(0,255,136,${mids * 0.15})`);
        gGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = gGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // Init flash
      if (isInit && initAge < 0.3) {
        const fa = initAge < 0.1 ? initAge / 0.1 * 0.4 : Math.max(0, 0.4 - (initAge - 0.1) / 0.2 * 0.4);
        ctx.fillStyle = `rgba(0,212,255,${fa})`;
        ctx.fillRect(0, 0, w, h);
      }

      // ── SCAN LINES ─────────────────────────────────────
      time += 0.016; // ~60fps frame time for consistent particle movement

      // Base speed for scan lines, music slightly modulates
      const baseSpeed = 0.004;
      const musicSpeedBoost = hasAudio ? (bass * 0.003 + mids * 0.002) : 0;
      const scanSpeed = baseSpeed + musicSpeedBoost;

      if (!isActive) {
        // ── IDLE / INIT: Cyan scan line ───────────────────
        cyanPos = (cyanPos + scanSpeed) % 1;
        const cyanY = perspY(cyanPos);
        const cb = xBounds(cyanY);

        ctx.save();
        ctx.strokeStyle = 'rgba(0,212,255,0.5)';
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 18;
        ctx.shadowColor = 'rgba(0,212,255,0.7)';
        ctx.beginPath();
        ctx.moveTo(cb.xl, cyanY);
        ctx.lineTo(cb.xr, cyanY);
        ctx.stroke();
        ctx.restore();
      } else {
        // ── ACTIVE: Three colored scan lines ──────────────
        // Each advances independently at different speeds for staggered flow
        purplePos = (purplePos + scanSpeed * 1.0) % 1;
        greenPos = (greenPos + scanSpeed * 0.85) % 1;
        goldPos = (goldPos + scanSpeed * 0.7) % 1;

        // Purple - thick glowing scan line
        const pY = perspY(purplePos);
        const pb = xBounds(pY);
        ctx.save();
        ctx.strokeStyle = 'rgb(160,80,255)';
        ctx.lineWidth = 2 + bass * 3;
        ctx.shadowBlur = 25 + bass * 50;
        ctx.shadowColor = 'rgba(160,80,255,1)';
        ctx.beginPath();
        ctx.moveTo(pb.xl, pY);
        ctx.lineTo(pb.xr, pY);
        ctx.stroke();
        ctx.restore();

        // Green - thick glowing scan line
        const gY = perspY(greenPos);
        const gb = xBounds(gY);
        ctx.save();
        ctx.strokeStyle = 'rgb(0,255,136)';
        ctx.lineWidth = 2 + mids * 3;
        ctx.shadowBlur = 25 + mids * 50;
        ctx.shadowColor = 'rgba(0,255,136,1)';
        ctx.beginPath();
        ctx.moveTo(gb.xl, gY);
        ctx.lineTo(gb.xr, gY);
        ctx.stroke();
        ctx.restore();

        // Gold - thick glowing scan line
        const yY = perspY(goldPos);
        const yb = xBounds(yY);
        ctx.save();
        ctx.strokeStyle = 'rgb(255,215,0)';
        ctx.lineWidth = 2 + highs * 3;
        ctx.shadowBlur = 25 + highs * 50;
        ctx.shadowColor = 'rgba(255,215,0,1)';
        ctx.beginPath();
        ctx.moveTo(yb.xl, yY);
        ctx.lineTo(yb.xr, yY);
        ctx.stroke();
        ctx.restore();
      }

      // ── Edge vignette (only when active) ────────────────
      if (isActive && bass > 0.15) {
        const va = (bass - 0.15) * 0.5;
        const lG = ctx.createLinearGradient(0, 0, w * 0.12, 0);
        lG.addColorStop(0, `rgba(160,80,255,${va})`);
        lG.addColorStop(1, 'transparent');
        ctx.fillStyle = lG;
        ctx.fillRect(0, 0, w * 0.12, h);

        const rG = ctx.createLinearGradient(w, 0, w * 0.88, 0);
        rG.addColorStop(0, `rgba(0,255,136,${va})`);
        rG.addColorStop(1, 'transparent');
        ctx.fillStyle = rG;
        ctx.fillRect(w * 0.88, 0, w * 0.12, h);
      }

      // ── Blue dot atmosphere (always present, pulses with music) ──
      // No shadowBlur - use double-circle technique for fake glow
      const audioBoost = hasAudio ? 0.3 + bass * 0.5 : 0;
      for (const p of particles) {
        const px = (Math.sin(p.a + time * p.s * 0.06) * 0.46 + 0.5) * w;
        const py = (Math.cos(p.a * 1.3 + time * p.s * 0.04) * 0.38 + 0.3) * h;
        const pa = p.alpha + audioBoost * (0.5 + 0.5 * Math.sin(time * 0.8 + p.a));
        const pr = p.r + (hasAudio ? bass * 1.2 : 0);

        // Outer glow circle (larger, dimmer)
        ctx.fillStyle = `rgba(0,212,255,${pa * 0.3})`;
        ctx.beginPath();
        ctx.arc(px, py, pr * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Inner bright dot
        ctx.fillStyle = `rgba(0,212,255,${pa})`;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, [bandsRef, initTimeRef]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
