'use client';

import { useRef, useEffect } from 'react';
import type { Vector3 } from 'three';

/**
 * Neural Network Cloud — 3D hero background effect
 *
 * A field of glowing interconnected nodes with signal pulses traveling
 * between them. Uses Three.js with bloom post-processing.
 * Architecture mirrors HolographicGlobe.tsx exactly.
 */

// --- Types ---
interface NodeConnection {
  from: number;
  to: number;
}

interface SignalPulse {
  connectionIndex: number;
  progress: number;
  speed: number;
}

export function NeuralNetworkCloud() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    pause: () => void;
    resume: () => void;
    dispose: () => void;
  } | null>(null);
  const initedRef = useRef(false);

  // Pause/resume based on visibility (IntersectionObserver)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!sceneRef.current) return;
        if (entries[0].isIntersecting) {
          sceneRef.current.resume();
        } else {
          sceneRef.current.pause();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Full dispose on unmount only
  useEffect(() => {
    return () => {
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  // Initialize Three.js scene once
  useEffect(() => {
    if (initedRef.current || !containerRef.current) return;
    initedRef.current = true;

    const container = containerRef.current;

    (async () => {
      const THREE = await import('three');

      // Try to load bloom post-processing (graceful fallback if unavailable)
      let EffectComposer: any, RenderPass: any, UnrealBloomPass: any;
      try {
        const ec = await import('three/examples/jsm/postprocessing/EffectComposer.js');
        const rp = await import('three/examples/jsm/postprocessing/RenderPass.js');
        const bp = await import('three/examples/jsm/postprocessing/UnrealBloomPass.js');
        EffectComposer = ec.EffectComposer;
        RenderPass = rp.RenderPass;
        UnrealBloomPass = bp.UnrealBloomPass;
      } catch {
        // Bloom not available — renders without glow
      }

      if (!container || !container.isConnected) return;

      const width = container.clientWidth;
      const height = container.clientHeight;
      const isMobile = width < 768;

      // --- Configuration ---
      const CONFIG = {
        nodeCount: isMobile ? 200 : 500,
        maxConnectionsPerNode: isMobile ? 3 : 4,
        connectionDistance: isMobile ? 20 : 25,
        activePulses: isMobile ? 20 : 40,
        trailGhostsPerPulse: isMobile ? 0 : 2,
        ambientParticles: isMobile ? 60 : 150,
        bloomStrength: isMobile ? 1.2 : 1.8,
        spread: isMobile
          ? { x: 50, y: 35, z: 30 }
          : { x: 80, y: 45, z: 50 },
        centerVoid: { radius: 15, zDepth: 20 },
      };

      // --- Helpers ---
      function gaussianRandom(): number {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      }

      // ── Scene ──
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x000a14, 0.008);

      const aspect = width / height;
      const cameraZ = aspect < 0.6 ? 100 : aspect < 1 ? 85 : 65;
      const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 300);
      camera.position.z = cameraZ;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);

      // Bloom composer
      let composer: any = null;
      if (EffectComposer && RenderPass && UnrealBloomPass) {
        composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        const bloom = new UnrealBloomPass(
          new THREE.Vector2(width, height), CONFIG.bloomStrength, 0.8, 0.1
        );
        bloom.threshold = 0.1;
        bloom.strength = CONFIG.bloomStrength;
        bloom.radius = 0.8;
        composer.addPass(bloom);
      }

      // ══════════════════════════════════════════════
      // 1. NODES — Gaussian-distributed 3D cloud
      // ══════════════════════════════════════════════
      const nodePositions: Float32Array = new Float32Array(CONFIG.nodeCount * 3);
      const nodeVecs: Vector3[] = [];
      let placed = 0;

      while (placed < CONFIG.nodeCount) {
        const x = gaussianRandom() * CONFIG.spread.x;
        const y = gaussianRandom() * CONFIG.spread.y;
        const z = gaussianRandom() * CONFIG.spread.z;

        // Reject nodes in center void (text readability zone)
        const xyDist = Math.sqrt(x * x + y * y);
        if (xyDist < CONFIG.centerVoid.radius && Math.abs(z) < CONFIG.centerVoid.zDepth) {
          continue;
        }

        nodePositions[placed * 3] = x;
        nodePositions[placed * 3 + 1] = y;
        nodePositions[placed * 3 + 2] = z;
        nodeVecs.push(new THREE.Vector3(x, y, z));
        placed++;
      }

      const nodeGeo = new THREE.BufferGeometry();
      nodeGeo.setAttribute('position', new THREE.Float32BufferAttribute(nodePositions, 3));
      const nodeMat = new THREE.PointsMaterial({
        color: 0x00bfff,
        size: 2.5,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      scene.add(new THREE.Points(nodeGeo, nodeMat));

      // ══════════════════════════════════════════════
      // 2. CONNECTIONS — distance-based, max per node
      // ══════════════════════════════════════════════
      const connections: NodeConnection[] = [];
      const connectionCounts = new Uint8Array(CONFIG.nodeCount); // track per-node count
      const nodeAdjacency: number[][] = Array.from({ length: CONFIG.nodeCount }, () => []);

      for (let a = 0; a < CONFIG.nodeCount; a++) {
        if (connectionCounts[a] >= CONFIG.maxConnectionsPerNode) continue;

        // Find nearby nodes sorted by distance
        const candidates: { index: number; dist: number }[] = [];
        for (let b = a + 1; b < CONFIG.nodeCount; b++) {
          if (connectionCounts[b] >= CONFIG.maxConnectionsPerNode) continue;
          const dist = nodeVecs[a].distanceTo(nodeVecs[b]);
          if (dist < CONFIG.connectionDistance) {
            candidates.push({ index: b, dist });
          }
        }

        candidates.sort((x, y) => x.dist - y.dist);
        const maxNew = CONFIG.maxConnectionsPerNode - connectionCounts[a];

        for (let i = 0; i < Math.min(candidates.length, maxNew); i++) {
          const b = candidates[i].index;
          if (connectionCounts[b] >= CONFIG.maxConnectionsPerNode) continue;

          connections.push({ from: a, to: b });
          connectionCounts[a]++;
          connectionCounts[b]++;
          nodeAdjacency[a].push(connections.length - 1);
          nodeAdjacency[b].push(connections.length - 1);
        }
      }

      // Build line segments buffer
      const linePositions = new Float32Array(connections.length * 6);
      for (let i = 0; i < connections.length; i++) {
        const { from, to } = connections[i];
        linePositions[i * 6] = nodeVecs[from].x;
        linePositions[i * 6 + 1] = nodeVecs[from].y;
        linePositions[i * 6 + 2] = nodeVecs[from].z;
        linePositions[i * 6 + 3] = nodeVecs[to].x;
        linePositions[i * 6 + 4] = nodeVecs[to].y;
        linePositions[i * 6 + 5] = nodeVecs[to].z;
      }

      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x0066aa,
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      scene.add(new THREE.LineSegments(lineGeo, lineMat));

      // ══════════════════════════════════════════════
      // 3. SIGNAL PULSES — particles traveling along connections
      // ══════════════════════════════════════════════
      const totalPulsePoints = CONFIG.activePulses * (1 + CONFIG.trailGhostsPerPulse);
      const pulsePositions = new Float32Array(totalPulsePoints * 3);
      const pulseSizes = new Float32Array(totalPulsePoints);

      const pulses: SignalPulse[] = [];
      for (let i = 0; i < CONFIG.activePulses; i++) {
        pulses.push({
          connectionIndex: Math.floor(Math.random() * connections.length),
          progress: Math.random(),
          speed: 0.4 + Math.random() * 0.6,
        });
      }

      const pulseGeo = new THREE.BufferGeometry();
      pulseGeo.setAttribute('position', new THREE.Float32BufferAttribute(pulsePositions, 3));
      pulseGeo.setAttribute('size', new THREE.Float32BufferAttribute(pulseSizes, 1));
      const pulseMat = new THREE.PointsMaterial({
        color: 0x44ccff,
        size: 5,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      scene.add(new THREE.Points(pulseGeo, pulseMat));

      // ══════════════════════════════════════════════
      // 4. AMBIENT PARTICLES — tiny drifting atmosphere
      // ══════════════════════════════════════════════
      const ambientPositions = new Float32Array(CONFIG.ambientParticles * 3);
      const ambientVelocities: Vector3[] = [];

      for (let i = 0; i < CONFIG.ambientParticles; i++) {
        ambientPositions[i * 3] = (Math.random() - 0.5) * CONFIG.spread.x * 2.5;
        ambientPositions[i * 3 + 1] = (Math.random() - 0.5) * CONFIG.spread.y * 2.5;
        ambientPositions[i * 3 + 2] = (Math.random() - 0.5) * CONFIG.spread.z * 2.5;
        ambientVelocities.push(new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
        ));
      }

      const ambientGeo = new THREE.BufferGeometry();
      ambientGeo.setAttribute('position', new THREE.Float32BufferAttribute(ambientPositions, 3));
      const ambientMat = new THREE.PointsMaterial({
        color: 0x4488cc,
        size: 0.4,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      scene.add(new THREE.Points(ambientGeo, ambientMat));

      // ══════════════════════════════════════════════
      // ANIMATION LOOP
      // ══════════════════════════════════════════════
      let time = 0;
      let frameId = 0;
      let paused = false;

      const animate = () => {
        if (paused) return;
        frameId = requestAnimationFrame(animate);
        time += 0.016;

        // Camera drift — slow Lissajous orbit
        camera.position.x = Math.sin(time * 0.15) * 3;
        camera.position.y = Math.cos(time * 0.12) * 2;
        camera.lookAt(0, 0, 0);

        // Pulse node opacity subtly
        nodeMat.opacity = 0.5 + Math.sin(time * 0.8) * 0.08;

        // ── Update signal pulses ──
        const pPos = pulseGeo.attributes.position.array as Float32Array;
        const pSiz = pulseGeo.attributes.size.array as Float32Array;

        for (let i = 0; i < CONFIG.activePulses; i++) {
          const pulse = pulses[i];
          pulse.progress += pulse.speed * 0.016;

          // Route to next connection on arrival
          if (pulse.progress >= 1.0) {
            const conn = connections[pulse.connectionIndex];
            // Determine destination node
            const destNode = pulse.progress > 0 ? conn.to : conn.from;
            const outgoing = nodeAdjacency[destNode];

            if (outgoing.length > 0) {
              // Pick a random outgoing connection (avoid backtracking if possible)
              let nextConn: number;
              if (outgoing.length > 1) {
                const candidates = outgoing.filter(c => c !== pulse.connectionIndex);
                nextConn = candidates.length > 0
                  ? candidates[Math.floor(Math.random() * candidates.length)]
                  : outgoing[Math.floor(Math.random() * outgoing.length)];
              } else {
                nextConn = outgoing[0];
              }
              pulse.connectionIndex = nextConn;
            } else {
              // Dead end — pick a random connection
              pulse.connectionIndex = Math.floor(Math.random() * connections.length);
            }
            pulse.progress = 0;
            pulse.speed = 0.4 + Math.random() * 0.6;
          }

          // Interpolate position along connection
          const conn = connections[pulse.connectionIndex];
          const fromPos = nodeVecs[conn.from];
          const toPos = nodeVecs[conn.to];
          const t = pulse.progress;

          const baseIdx = i * (1 + CONFIG.trailGhostsPerPulse) * 3;

          // Head position
          pPos[baseIdx] = fromPos.x + (toPos.x - fromPos.x) * t;
          pPos[baseIdx + 1] = fromPos.y + (toPos.y - fromPos.y) * t;
          pPos[baseIdx + 2] = fromPos.z + (toPos.z - fromPos.z) * t;
          pSiz[i * (1 + CONFIG.trailGhostsPerPulse)] = 5;

          // Trail ghosts
          for (let g = 0; g < CONFIG.trailGhostsPerPulse; g++) {
            const trailT = Math.max(0, t - (g + 1) * 0.03);
            const ghostIdx = baseIdx + (g + 1) * 3;
            pPos[ghostIdx] = fromPos.x + (toPos.x - fromPos.x) * trailT;
            pPos[ghostIdx + 1] = fromPos.y + (toPos.y - fromPos.y) * trailT;
            pPos[ghostIdx + 2] = fromPos.z + (toPos.z - fromPos.z) * trailT;
            pSiz[i * (1 + CONFIG.trailGhostsPerPulse) + g + 1] = 3 - g;
          }
        }
        pulseGeo.attributes.position.needsUpdate = true;

        // ── Update ambient particles ──
        const aPos = ambientGeo.attributes.position.array as Float32Array;
        const halfX = CONFIG.spread.x * 1.25;
        const halfY = CONFIG.spread.y * 1.25;
        const halfZ = CONFIG.spread.z * 1.25;

        for (let i = 0; i < CONFIG.ambientParticles; i++) {
          aPos[i * 3] += ambientVelocities[i].x;
          aPos[i * 3 + 1] += ambientVelocities[i].y;
          aPos[i * 3 + 2] += ambientVelocities[i].z;

          // Wrap around if out of bounds
          if (Math.abs(aPos[i * 3]) > halfX) aPos[i * 3] *= -0.9;
          if (Math.abs(aPos[i * 3 + 1]) > halfY) aPos[i * 3 + 1] *= -0.9;
          if (Math.abs(aPos[i * 3 + 2]) > halfZ) aPos[i * 3 + 2] *= -0.9;
        }
        ambientGeo.attributes.position.needsUpdate = true;

        // Render
        if (composer) {
          composer.render();
        } else {
          renderer.render(scene, camera);
        }
      };
      animate();

      // ── Resize ──
      const onResize = () => {
        if (!container.isConnected) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        const a = w / h;
        camera.aspect = a;
        camera.position.z = a < 0.6 ? 100 : a < 1 ? 85 : 65;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        if (composer) composer.setSize(w, h);
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(container);

      // ── Store lifecycle controls ──
      sceneRef.current = {
        pause: () => {
          paused = true;
          cancelAnimationFrame(frameId);
        },
        resume: () => {
          if (!paused) return;
          paused = false;
          animate();
        },
        dispose: () => {
          cancelAnimationFrame(frameId);
          ro.disconnect();
          renderer.dispose();
          if (composer) composer.dispose();
          scene.traverse((obj: any) => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
              if (Array.isArray(obj.material)) obj.material.forEach((m: any) => m.dispose());
              else obj.material.dispose();
            }
          });
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        },
      };
    })();
    // No cleanup here — handled by separate unmount effect
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

export default NeuralNetworkCloud;
