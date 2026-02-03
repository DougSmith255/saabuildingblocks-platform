'use client';

import { useRef, useEffect } from 'react';

/**
 * Aurora Network Effect — Canvas 2D hero background
 *
 * Aurora energy ribbons + constellation network with signal pulses.
 * Uses Canvas 2D (not Three.js) to guarantee transparent background —
 * clearRect() preserves alpha so the star background shows through.
 *
 * Architecture mirrors NeuralNetworkCloud.tsx:
 * - Three useEffect hooks (IntersectionObserver, unmount cleanup, init-once)
 * - stateRef holds all mutable animation state (no React re-renders)
 * - Own rAF loop with inline scroll-boost logic
 */

// --- Types ---
interface AuroraRibbon {
  frequency: number;
  amplitude: number;
  phase: number;
  yOffset: number;
  driftSpeed: number;
  color: { r: number; g: number; b: number };
}

interface NetworkNode {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  driftPhaseX: number;
  driftPhaseY: number;
  driftSpeedX: number;
  driftSpeedY: number;
  driftAmplitude: number;
  breathPhase: number;
  breathSpeed: number;
  radius: number;
}

interface Connection {
  from: number;
  to: number;
}

interface SignalPulse {
  connectionIndex: number;
  progress: number;
  speed: number;
  trail: { x: number; y: number }[];
}

interface AnimState {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  dpr: number;
  ribbons: AuroraRibbon[];
  nodes: NetworkNode[];
  connections: Connection[];
  adjacency: number[][];
  pulses: SignalPulse[];
  time: number;
  lastTimestamp: number;
  scrollBoost: number;
  paused: boolean;
  frameId: number;
  isMobile: boolean;
  trailGhosts: number;
  animateFn: ((ts: number) => void) | null;
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

    // --- Configuration ---
    const ribbonCount = isMobile ? 2 : 3;
    const nodeCount = isMobile ? 40 : 80;
    const maxConnsPerNode = isMobile ? 2 : 3;
    const connDistance = isMobile ? 150 : 200;
    const pulseCount = isMobile ? 10 : 20;
    const trailGhosts = isMobile ? 1 : 3;

    // --- Create Aurora Ribbons ---
    const ribbonColors = [
      { r: 0, g: 191, b: 255 },  // Bright cyan #00bfff
      { r: 0, g: 102, b: 204 },  // Deep blue #0066cc
      { r: 0, g: 221, b: 170 },  // Teal-green #00ddaa
    ];

    const ribbons: AuroraRibbon[] = [];
    for (let i = 0; i < ribbonCount; i++) {
      ribbons.push({
        frequency: 0.003 + i * 0.001,
        amplitude: h * (0.08 + i * 0.04),
        phase: i * Math.PI * 0.7,
        yOffset: h * (0.3 + i * 0.2),
        driftSpeed: 0.3 + i * 0.15,
        color: ribbonColors[i % ribbonColors.length],
      });
    }

    // --- Create Nodes (Gaussian distribution with center void) ---
    const nodes: NetworkNode[] = [];
    const voidW = w * 0.4;
    const voidH = h * 0.3;
    const cx = w / 2;
    const cy = h / 2;

    function gaussianRandom(): number {
      let u = 0, v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }

    let placed = 0;
    while (placed < nodeCount) {
      const x = cx + gaussianRandom() * (w * 0.3);
      const y = cy + gaussianRandom() * (h * 0.3);

      // Reject nodes inside center void ellipse
      const dx = (x - cx) / (voidW / 2);
      const dy = (y - cy) / (voidH / 2);
      if (dx * dx + dy * dy < 1) continue;

      // Reject nodes outside canvas bounds (with padding)
      if (x < 20 || x > w - 20 || y < 20 || y > h - 20) continue;

      nodes.push({
        x, y,
        baseX: x,
        baseY: y,
        driftPhaseX: Math.random() * Math.PI * 2,
        driftPhaseY: Math.random() * Math.PI * 2,
        driftSpeedX: 0.2 + Math.random() * 0.3,
        driftSpeedY: 0.2 + Math.random() * 0.3,
        driftAmplitude: 3 + Math.random() * 5,
        breathPhase: Math.random() * Math.PI * 2,
        breathSpeed: 0.5 + Math.random() * 0.5,
        radius: 1.5 + Math.random() * 1.5,
      });
      placed++;
    }

    // --- Build Connections ---
    const connections: Connection[] = [];
    const connCounts = new Uint8Array(nodeCount);
    const adjacency: number[][] = Array.from({ length: nodeCount }, () => []);

    // Sort nodes by x for spatial optimization
    const sortedIndices = Array.from({ length: nodeCount }, (_, i) => i);
    sortedIndices.sort((a, b) => nodes[a].baseX - nodes[b].baseX);

    for (let si = 0; si < sortedIndices.length; si++) {
      const a = sortedIndices[si];
      if (connCounts[a] >= maxConnsPerNode) continue;

      for (let sj = si + 1; sj < sortedIndices.length; sj++) {
        const b = sortedIndices[sj];
        // Early exit: if x-distance alone exceeds threshold, no further nodes can connect
        if (nodes[b].baseX - nodes[a].baseX > connDistance) break;

        if (connCounts[b] >= maxConnsPerNode) continue;

        const dx = nodes[a].baseX - nodes[b].baseX;
        const dy = nodes[a].baseY - nodes[b].baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connDistance) {
          const connIdx = connections.length;
          connections.push({ from: a, to: b });
          connCounts[a]++;
          connCounts[b]++;
          adjacency[a].push(connIdx);
          adjacency[b].push(connIdx);

          if (connCounts[a] >= maxConnsPerNode) break;
        }
      }
    }

    // --- Create Signal Pulses ---
    const pulses: SignalPulse[] = [];
    if (connections.length > 0) {
      for (let i = 0; i < pulseCount; i++) {
        pulses.push({
          connectionIndex: Math.floor(Math.random() * connections.length),
          progress: Math.random(),
          speed: 0.3 + Math.random() * 0.5,
          trail: [],
        });
      }
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
      canvas, ctx, w, h, dpr,
      ribbons, nodes, connections, adjacency, pulses,
      time: 0,
      lastTimestamp: 0,
      scrollBoost: 0,
      paused: false,
      frameId: 0,
      isMobile,
      trailGhosts,
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

      // Regenerate ribbons for new dimensions
      for (let i = 0; i < s.ribbons.length; i++) {
        s.ribbons[i].amplitude = newH * (0.08 + i * 0.04);
        s.ribbons[i].yOffset = newH * (0.3 + i * 0.2);
      }

      // Regenerate nodes
      const newNodeCount = s.isMobile ? 40 : 80;
      const newVoidW = newW * 0.4;
      const newVoidH = newH * 0.3;
      const newCx = newW / 2;
      const newCy = newH / 2;
      const newMaxConns = s.isMobile ? 2 : 3;
      const newConnDist = s.isMobile ? 150 : 200;

      s.nodes.length = 0;
      let p = 0;
      while (p < newNodeCount) {
        const x = newCx + gaussianRandom() * (newW * 0.3);
        const y = newCy + gaussianRandom() * (newH * 0.3);
        const ddx = (x - newCx) / (newVoidW / 2);
        const ddy = (y - newCy) / (newVoidH / 2);
        if (ddx * ddx + ddy * ddy < 1) continue;
        if (x < 20 || x > newW - 20 || y < 20 || y > newH - 20) continue;

        s.nodes.push({
          x, y, baseX: x, baseY: y,
          driftPhaseX: Math.random() * Math.PI * 2,
          driftPhaseY: Math.random() * Math.PI * 2,
          driftSpeedX: 0.2 + Math.random() * 0.3,
          driftSpeedY: 0.2 + Math.random() * 0.3,
          driftAmplitude: 3 + Math.random() * 5,
          breathPhase: Math.random() * Math.PI * 2,
          breathSpeed: 0.5 + Math.random() * 0.5,
          radius: 1.5 + Math.random() * 1.5,
        });
        p++;
      }

      // Rebuild connections
      s.connections.length = 0;
      s.adjacency.length = 0;
      for (let i = 0; i < newNodeCount; i++) s.adjacency.push([]);
      const newConnCounts = new Uint8Array(newNodeCount);
      const newSorted = Array.from({ length: newNodeCount }, (_, i) => i);
      newSorted.sort((a, b) => s.nodes[a].baseX - s.nodes[b].baseX);

      for (let si = 0; si < newSorted.length; si++) {
        const a = newSorted[si];
        if (newConnCounts[a] >= newMaxConns) continue;
        for (let sj = si + 1; sj < newSorted.length; sj++) {
          const b = newSorted[sj];
          if (s.nodes[b].baseX - s.nodes[a].baseX > newConnDist) break;
          if (newConnCounts[b] >= newMaxConns) continue;
          const ddx2 = s.nodes[a].baseX - s.nodes[b].baseX;
          const ddy2 = s.nodes[a].baseY - s.nodes[b].baseY;
          const dist = Math.sqrt(ddx2 * ddx2 + ddy2 * ddy2);
          if (dist < newConnDist) {
            const ci = s.connections.length;
            s.connections.push({ from: a, to: b });
            newConnCounts[a]++;
            newConnCounts[b]++;
            s.adjacency[a].push(ci);
            s.adjacency[b].push(ci);
            if (newConnCounts[a] >= newMaxConns) break;
          }
        }
      }

      // Reset pulses
      const newPulseCount = s.isMobile ? 10 : 20;
      s.pulses.length = 0;
      s.trailGhosts = s.isMobile ? 1 : 3;
      if (s.connections.length > 0) {
        for (let i = 0; i < newPulseCount; i++) {
          s.pulses.push({
            connectionIndex: Math.floor(Math.random() * s.connections.length),
            progress: Math.random(),
            speed: 0.3 + Math.random() * 0.5,
            trail: [],
          });
        }
      }
    });
    ro.observe(container);

    // Store animate function reference for IntersectionObserver resume
    state.animateFn = animate;

    // Start animation
    state.frameId = requestAnimationFrame(animate);

    // Cleanup scroll listener stored on state for unmount
    const cleanup = () => {
      window.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };
    // Attach cleanup to dispose
    const origDispose = () => {
      cancelAnimationFrame(state.frameId);
      cleanup();
      canvas.remove();
    };
    // Store for unmount
    (stateRef as any)._cleanup = origDispose;

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

      // Clear — transparent background
      c.clearRect(0, 0, cw, ch);

      // ═══════════════════════════════════════
      // 1. AURORA RIBBONS
      // ═══════════════════════════════════════
      c.globalCompositeOperation = 'lighter';
      const ribbonLineWidth = s.isMobile ? 60 : 120;

      for (const ribbon of s.ribbons) {
        const { frequency, amplitude, phase, yOffset, driftSpeed, color } = ribbon;
        const passes = 4;

        for (let pass = 0; pass < passes; pass++) {
          const widthMul = 1 + pass * 0.8;
          const opacityMul = 0.02 / (pass + 1);

          c.beginPath();
          c.lineWidth = ribbonLineWidth * widthMul;
          c.strokeStyle = `rgba(${color.r},${color.g},${color.b},${opacityMul})`;
          c.lineCap = 'round';

          for (let px = -50; px <= cw + 50; px += 4) {
            const xNorm = px / cw;
            const y = yOffset
              + Math.sin(px * frequency + t * driftSpeed + phase) * amplitude
              + Math.sin(px * frequency * 1.7 + t * driftSpeed * 0.6 + phase * 2.3) * amplitude * 0.3;

            // Reduce opacity in center zone for text readability
            if (px === -50) {
              c.moveTo(px, y);
            } else {
              c.lineTo(px, y);
            }
          }
          c.stroke();
        }
      }

      // ═══════════════════════════════════════
      // 2. CONNECTIONS (faint curved bezier lines)
      // ═══════════════════════════════════════
      c.globalCompositeOperation = 'source-over';

      for (const conn of s.connections) {
        const nA = s.nodes[conn.from];
        const nB = s.nodes[conn.to];

        // Check if connection crosses center — reduce opacity
        const midX = (nA.x + nB.x) / 2;
        const midY = (nA.y + nB.y) / 2;
        const dcx = (midX - cw / 2) / (cw * 0.2);
        const dcy = (midY - ch / 2) / (ch * 0.15);
        const inCenter = dcx * dcx + dcy * dcy < 1;
        const opacity = inCenter ? 0.04 : 0.08;

        // Bezier curve with slight arc
        const cpX = midX + (nA.y - nB.y) * 0.15;
        const cpY = midY - (nA.x - nB.x) * 0.15;

        c.beginPath();
        c.moveTo(nA.x, nA.y);
        c.quadraticCurveTo(cpX, cpY, nB.x, nB.y);
        c.strokeStyle = `rgba(51,85,119,${opacity})`;
        c.lineWidth = 1;
        c.stroke();
      }

      // ═══════════════════════════════════════
      // 3. NODES (glowing dots with radial gradients)
      // ═══════════════════════════════════════
      c.globalCompositeOperation = 'lighter';

      for (const node of s.nodes) {
        // Update drift
        node.x = node.baseX + Math.sin(t * node.driftSpeedX + node.driftPhaseX) * node.driftAmplitude;
        node.y = node.baseY + Math.cos(t * node.driftSpeedY + node.driftPhaseY) * node.driftAmplitude;

        // Breathing pulse
        const breath = 0.6 + Math.sin(t * node.breathSpeed + node.breathPhase) * 0.4;
        const r = node.radius * (1 + breath * 0.3);
        const glowRadius = r * 6;

        // Radial gradient halo
        const grad = c.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowRadius);
        grad.addColorStop(0, `rgba(68,204,255,${0.7 * breath})`);
        grad.addColorStop(0.3, `rgba(68,204,255,${0.2 * breath})`);
        grad.addColorStop(1, 'rgba(68,204,255,0)');

        c.beginPath();
        c.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
        c.fillStyle = grad;
        c.fill();

        // Core dot
        c.beginPath();
        c.arc(node.x, node.y, r, 0, Math.PI * 2);
        c.fillStyle = `rgba(136,238,255,${0.8 * breath})`;
        c.fill();
      }

      // ═══════════════════════════════════════
      // 4. SIGNAL PULSES
      // ═══════════════════════════════════════
      if (s.connections.length > 0) {
        for (const pulse of s.pulses) {
          pulse.progress += pulse.speed * dt;

          // Route to next connection on arrival
          if (pulse.progress >= 1.0) {
            const conn = s.connections[pulse.connectionIndex];
            const destNode = conn.to;
            const outgoing = s.adjacency[destNode];

            if (outgoing && outgoing.length > 0) {
              if (outgoing.length > 1) {
                const candidates = outgoing.filter(ci => ci !== pulse.connectionIndex);
                pulse.connectionIndex = candidates.length > 0
                  ? candidates[Math.floor(Math.random() * candidates.length)]
                  : outgoing[Math.floor(Math.random() * outgoing.length)];
              } else {
                pulse.connectionIndex = outgoing[0];
              }
            } else {
              pulse.connectionIndex = Math.floor(Math.random() * s.connections.length);
            }
            pulse.progress = 0;
            pulse.speed = 0.3 + Math.random() * 0.5;
          }

          // Interpolate position
          const conn = s.connections[pulse.connectionIndex];
          if (!conn) continue;
          const nFrom = s.nodes[conn.from];
          const nTo = s.nodes[conn.to];
          if (!nFrom || !nTo) continue;

          const px = nFrom.x + (nTo.x - nFrom.x) * pulse.progress;
          const py = nFrom.y + (nTo.y - nFrom.y) * pulse.progress;

          // Store trail position
          pulse.trail.unshift({ x: px, y: py });
          if (pulse.trail.length > s.trailGhosts + 1) {
            pulse.trail.length = s.trailGhosts + 1;
          }

          // Draw trail ghosts
          for (let g = pulse.trail.length - 1; g >= 1; g--) {
            const ghost = pulse.trail[g];
            const ghostOpacity = 0.3 * (1 - g / (s.trailGhosts + 1));
            const ghostRadius = 3 - g * 0.5;

            if (ghostRadius > 0) {
              const gGrad = c.createRadialGradient(ghost.x, ghost.y, 0, ghost.x, ghost.y, ghostRadius * 3);
              gGrad.addColorStop(0, `rgba(136,238,255,${ghostOpacity})`);
              gGrad.addColorStop(1, 'rgba(136,238,255,0)');

              c.beginPath();
              c.arc(ghost.x, ghost.y, ghostRadius * 3, 0, Math.PI * 2);
              c.fillStyle = gGrad;
              c.fill();
            }
          }

          // Draw pulse head
          const headGrad = c.createRadialGradient(px, py, 0, px, py, 12);
          headGrad.addColorStop(0, 'rgba(200,245,255,0.9)');
          headGrad.addColorStop(0.3, 'rgba(136,238,255,0.4)');
          headGrad.addColorStop(1, 'rgba(136,238,255,0)');

          c.beginPath();
          c.arc(px, py, 12, 0, Math.PI * 2);
          c.fillStyle = headGrad;
          c.fill();

          // Bright core
          c.beginPath();
          c.arc(px, py, 2, 0, Math.PI * 2);
          c.fillStyle = 'rgba(220,250,255,0.9)';
          c.fill();
        }
      }

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
