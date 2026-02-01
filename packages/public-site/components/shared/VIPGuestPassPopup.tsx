'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Mesh, QuadraticBezierCurve3, Line, Vector3, MeshBasicMaterial, LineBasicMaterial } from 'three';
import { SlidePanel } from '@saa/shared/components/saa/interactive/SlidePanel';
import { FormInput } from '@saa/shared/components/saa/forms/FormInput';
import { FormGroup } from '@saa/shared/components/saa/forms/FormGroup';
import { FormRow } from '@saa/shared/components/saa/forms/FormRow';
import { FormButton } from '@saa/shared/components/saa/forms/FormButton';

const STORAGE_KEY = 'saa_vip_pass_shown';
const TRIGGER_DELAY_MS = 30000;
const SCROLL_THRESHOLD = 0.5;

const EXP_X_LOGO = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/exp-x-logo-icon/public';

// --- City coordinates for data arc network ---
const CITIES = [
  { lat: 40.7, lng: -74 },     // New York
  { lat: 34.1, lng: -118.2 },  // Los Angeles
  { lat: 51.5, lng: -0.1 },    // London
  { lat: 48.9, lng: 2.35 },    // Paris
  { lat: 35.7, lng: 139.7 },   // Tokyo
  { lat: 22.3, lng: 114.2 },   // Hong Kong
  { lat: -33.9, lng: 151.2 },  // Sydney
  { lat: 25.2, lng: 55.3 },    // Dubai
  { lat: 1.35, lng: 103.8 },   // Singapore
  { lat: 55.8, lng: 37.6 },    // Moscow
  { lat: -23.5, lng: -46.6 },  // São Paulo
  { lat: 19.4, lng: -99.1 },   // Mexico City
  { lat: 37.6, lng: -122.4 },  // San Francisco
  { lat: 41.9, lng: -87.6 },   // Chicago
  { lat: 49.3, lng: -123.1 },  // Vancouver
];

const ARC_PAIRS = [
  [0, 2], [2, 4], [4, 7], [1, 6], [0, 11],
  [3, 9], [8, 5], [12, 14], [10, 0], [13, 2],
  [7, 8], [6, 4], [1, 4], [3, 7], [11, 10],
];

/**
 * Holographic wireframe globe with data arcs, city nodes, atmosphere glow,
 * floating particles, and bloom post-processing. Full Jarvis/Iron Man aesthetic.
 */
function HolographicGlobe({ isVisible }: { isVisible: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;
    if (cleanupRef.current) return;

    const container = containerRef.current;
    container.style.opacity = '0';

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
        // Bloom not available — renders without glow post-processing
      }

      if (!container || !container.isConnected) return;

      const width = container.clientWidth;
      const height = container.clientHeight;
      const R = 28; // Globe radius

      // Compute camera distance based on aspect ratio —
      // narrow/tall panels (desktop sidebar) pull camera back so globe isn't oversized
      function cameraZForAspect(w: number, h: number) {
        const aspect = w / h;
        if (aspect < 0.45) return 120;   // very narrow desktop panel
        if (aspect < 0.65) return 108;   // typical desktop slide panel
        return 90;                        // tablet / wider
      }

      // ── Scene ──
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = cameraZForAspect(width, height);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);

      // Bloom composer (if available)
      let composer: any = null;
      if (EffectComposer && RenderPass && UnrealBloomPass) {
        composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        const bloom = new UnrealBloomPass(
          new THREE.Vector2(width, height), 1.5, 0.4, 0.85
        );
        bloom.threshold = 0.08;
        bloom.strength = 1.8;
        bloom.radius = 0.9;
        composer.addPass(bloom);
      }

      const globeGroup = new THREE.Group();
      scene.add(globeGroup);

      // ── 1. DOT SPHERE (vertices as glowing points) ──
      const icoGeo = new THREE.IcosahedronGeometry(R, 4);
      const dotGeo = new THREE.BufferGeometry();
      dotGeo.setAttribute('position', icoGeo.attributes.position.clone());
      const dotMat = new THREE.PointsMaterial({
        color: 0x44ccff,
        size: 0.5,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      globeGroup.add(new THREE.Points(dotGeo, dotMat));

      // ── 2. WIREFRAME (faint structural lines) ──
      const wireGeo = new THREE.WireframeGeometry(icoGeo);
      const wireMat = new THREE.LineBasicMaterial({
        color: 0x0066aa,
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      globeGroup.add(new THREE.LineSegments(wireGeo, wireMat));

      // ── 3. INNER WIREFRAME (second layer, slightly smaller, different opacity) ──
      const innerIco = new THREE.IcosahedronGeometry(R * 0.85, 3);
      const innerWireGeo = new THREE.WireframeGeometry(innerIco);
      const innerWireMat = new THREE.LineBasicMaterial({
        color: 0x003366,
        transparent: true,
        opacity: 0.06,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const innerWireframe = new THREE.LineSegments(innerWireGeo, innerWireMat);
      globeGroup.add(innerWireframe);

      // ── 4. CITY NODES (pulsing bright dots) ──
      function latLngTo3D(lat: number, lng: number, r: number) {
        const phi = (90 - lat) * Math.PI / 180;
        const theta = (lng + 180) * Math.PI / 180;
        return new THREE.Vector3(
          -r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta)
        );
      }

      const cityVecs = CITIES.map(c => latLngTo3D(c.lat, c.lng, R));
      const cityPosArr: number[] = [];
      cityVecs.forEach(v => cityPosArr.push(v.x, v.y, v.z));

      const cityGeo = new THREE.BufferGeometry();
      cityGeo.setAttribute('position', new THREE.Float32BufferAttribute(cityPosArr, 3));
      const cityMat = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 2.5,
        sizeAttenuation: true,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      globeGroup.add(new THREE.Points(cityGeo, cityMat));

      // City glow rings (small torus at each city)
      const ringGeo = new THREE.RingGeometry(1.2, 1.8, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const cityRings: Mesh[] = [];
      cityVecs.forEach(v => {
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.copy(v);
        ring.lookAt(0, 0, 0);
        globeGroup.add(ring);
        cityRings.push(ring);
      });

      // ── 5. DATA ARCS (animated light traveling between cities) ──
      type ArcInfo = {
        curve: QuadraticBezierCurve3;
        head: Mesh;
        trail: Line;
        progress: number;
        speed: number;
      };

      const arcs: ArcInfo[] = [];
      const headGeo = new THREE.SphereGeometry(0.6, 8, 8);
      const headMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
      });

      ARC_PAIRS.forEach(([i, j]) => {
        const start = cityVecs[i];
        const end = cityVecs[j];
        const mid = start.clone().add(end).multiplyScalar(0.5);
        const dist = start.distanceTo(end);
        mid.normalize().multiplyScalar(R + dist * 0.35);

        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);

        // Static arc line (faint path)
        const pts = curve.getPoints(60);
        const trailGeo = new THREE.BufferGeometry().setFromPoints(pts);
        const trailMat = new THREE.LineBasicMaterial({
          color: 0x006688,
          transparent: true,
          opacity: 0.15,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const trail = new THREE.Line(trailGeo, trailMat);
        globeGroup.add(trail);

        // Traveling head particle
        const head = new THREE.Mesh(headGeo, headMat.clone());
        globeGroup.add(head);

        arcs.push({
          curve,
          head,
          trail,
          progress: Math.random(),
          speed: 0.08 + Math.random() * 0.12,
        });
      });

      // ── 6. ATMOSPHERE GLOW (shader-based edge glow) ──
      const atmosGeo = new THREE.SphereGeometry(R + 2, 32, 32);
      const atmosMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        uniforms: {
          glowColor: { value: new THREE.Color(0x0088cc) },
          viewVector: { value: camera.position },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPositionW;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPositionW = (modelMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 glowColor;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
            gl_FragColor = vec4(glowColor, intensity * 0.5);
          }
        `,
      });
      globeGroup.add(new THREE.Mesh(atmosGeo, atmosMat));

      // ── 7. EQUATOR + MERIDIAN RINGS (tech interface aesthetic) ──
      function createInterfaceRing(radius: number, rotX: number, rotY: number, opacity: number) {
        const rGeo = new THREE.RingGeometry(radius - 0.08, radius + 0.08, 128);
        const rMat = new THREE.MeshBasicMaterial({
          color: 0x00aaff,
          transparent: true,
          opacity,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        const ring = new THREE.Mesh(rGeo, rMat);
        ring.rotation.x = rotX;
        ring.rotation.y = rotY;
        return ring;
      }
      globeGroup.add(createInterfaceRing(R + 0.5, Math.PI / 2, 0, 0.12)); // equator
      globeGroup.add(createInterfaceRing(R + 0.5, 0, 0, 0.06)); // meridian
      globeGroup.add(createInterfaceRing(R + 0.5, 0, Math.PI / 2, 0.06)); // meridian 2

      // Outer scanning ring (wider, slowly rotates independently)
      const scanGeo = new THREE.RingGeometry(R + 6, R + 6.3, 128);
      const scanMat = new THREE.MeshBasicMaterial({
        color: 0x00ccff,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const scanRing = new THREE.Mesh(scanGeo, scanMat);
      scanRing.rotation.x = Math.PI / 2.5;
      globeGroup.add(scanRing);

      // ── 8. FLOATING AMBIENT PARTICLES ──
      const pCount = 300;
      const pArr = new Float32Array(pCount * 3);
      const pVel: Vector3[] = [];
      for (let i = 0; i < pCount; i++) {
        const pr = R + 4 + Math.random() * 25;
        const pTheta = Math.random() * Math.PI * 2;
        const pPhi = Math.acos(2 * Math.random() - 1);
        pArr[i * 3] = pr * Math.sin(pPhi) * Math.cos(pTheta);
        pArr[i * 3 + 1] = pr * Math.sin(pPhi) * Math.sin(pTheta);
        pArr[i * 3 + 2] = pr * Math.cos(pPhi);
        pVel.push(new THREE.Vector3(
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015,
        ));
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pArr, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0x4488cc,
        size: 0.25,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      scene.add(new THREE.Points(pGeo, pMat)); // don't rotate with globe

      // ── LIGHTS ──
      scene.add(new THREE.AmbientLight(0x111122));

      // ── ANIMATION LOOP ──
      let time = 0;
      let frameId = 0;

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        time += 0.016;

        // Globe rotation
        globeGroup.rotation.y += 0.0015;
        innerWireframe.rotation.y -= 0.001; // counter-rotate for depth

        // Scan ring rotation
        scanRing.rotation.z += 0.003;

        // Pulse city nodes
        const pulse = 0.6 + Math.sin(time * 2.5) * 0.4;
        cityMat.opacity = pulse;
        cityMat.size = 2 + Math.sin(time * 2.5) * 0.8;

        // Pulse city glow rings
        cityRings.forEach((ring, idx) => {
          const rp = 0.15 + Math.sin(time * 2 + idx * 0.5) * 0.15;
          (ring.material as MeshBasicMaterial).opacity = rp;
          const rs = 1 + Math.sin(time * 1.5 + idx) * 0.2;
          ring.scale.setScalar(rs);
        });

        // Animate data arc heads
        arcs.forEach(arc => {
          arc.progress += arc.speed * 0.016;
          if (arc.progress > 1) arc.progress = 0;
          const pos = arc.curve.getPoint(arc.progress);
          arc.head.position.copy(pos);
          const hs = 0.6 + Math.sin(time * 6 + arc.progress * 12) * 0.4;
          arc.head.scale.setScalar(hs);
          // Pulse arc trail brightness near the head
          const mat = arc.trail.material as LineBasicMaterial;
          mat.opacity = 0.1 + Math.sin(time * 3 + arc.progress * 5) * 0.08;
        });

        // Animate floating particles
        const positions = pGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < pCount; i++) {
          positions[i * 3] += pVel[i].x;
          positions[i * 3 + 1] += pVel[i].y;
          positions[i * 3 + 2] += pVel[i].z;
          const d = Math.sqrt(positions[i*3]**2 + positions[i*3+1]**2 + positions[i*3+2]**2);
          if (d > R + 35 || d < R + 2) {
            const nr = R + 4 + Math.random() * 20;
            const nt = Math.random() * Math.PI * 2;
            const np = Math.acos(2 * Math.random() - 1);
            positions[i*3] = nr * Math.sin(np) * Math.cos(nt);
            positions[i*3+1] = nr * Math.sin(np) * Math.sin(nt);
            positions[i*3+2] = nr * Math.cos(np);
          }
        }
        pGeo.attributes.position.needsUpdate = true;

        // Render with bloom or fallback
        if (composer) {
          composer.render();
        } else {
          renderer.render(scene, camera);
        }
      };
      animate();

      // Fade in after first frame renders (masks any load flash)
      requestAnimationFrame(() => {
        if (container.isConnected) container.style.opacity = '1';
      });

      // Resize — also adjusts camera distance for narrow panels
      const onResize = () => {
        if (!container.isConnected) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.position.z = cameraZForAspect(w, h);
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        if (composer) composer.setSize(w, h);
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(container);

      // Cleanup
      cleanupRef.current = () => {
        cancelAnimationFrame(frameId);
        ro.disconnect();
        renderer.dispose();
        if (composer) composer.dispose();
        // Traverse and dispose all geometries/materials
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
        cleanupRef.current = null;
      };
    })();

    return () => {
      cleanupRef.current?.();
    };
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        transition: 'opacity 0.6s ease-in',
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════
// VIPGuestPassPopup
// ═══════════════════════════════════════════════════════════════

export function VIPGuestPassPopup({ forceOpen, onForceClose }: { forceOpen?: boolean; onForceClose?: () => void } = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasTriggeredRef = useRef(false);
  const closePanelRef = useRef<(() => void) | null>(null);

  const showPopup = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    setHasTriggered(true);
    setIsOpen(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    try { localStorage.setItem(STORAGE_KEY, 'true'); } catch {}
  }, []);

  // Helper: returns true when any other SlidePanel is currently open.
  // SlidePanel adds 'slide-panel-open' to <html> whenever it's visible.
  const isPanelOpen = useCallback(() => {
    return typeof document !== 'undefined' &&
      document.documentElement.classList.contains('slide-panel-open');
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) {
        hasTriggeredRef.current = true;
        setHasTriggered(true);
        return;
      }
    } catch {
      hasTriggeredRef.current = true;
      setHasTriggered(true);
      return;
    }

    // Interval-based timer that pauses while any panel is open.
    // Ticks every 500ms; only accumulates elapsed time when no panel is open.
    let elapsed = 0;
    const TICK = 500;
    const intervalId = setInterval(() => {
      if (hasTriggeredRef.current) return;
      if (!isPanelOpen()) {
        elapsed += TICK;
        if (elapsed >= TRIGGER_DELAY_MS) {
          showPopup();
          clearInterval(intervalId);
        }
      }
    }, TICK);

    const handleScroll = () => {
      if (hasTriggeredRef.current) return;
      // Don't trigger while another panel is open
      if (isPanelOpen()) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0 && scrollTop / docHeight >= SCROLL_THRESHOLD) showPopup();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearInterval(intervalId);
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showPopup, isPanelOpen]);

  useEffect(() => {
    if (forceOpen) setIsOpen(true);
  }, [forceOpen]);

  // Pre-warm Three.js modules ~5s before popup trigger so the globe
  // is ready instantly when the panel opens (no flash-in).
  // Does NOT load anything on initial page load.
  useEffect(() => {
    if (hasTriggered) return;
    let warmed = false;
    const preWarm = () => {
      if (warmed) return;
      warmed = true;
      import('three').catch(() => {});
      import('three/examples/jsm/postprocessing/EffectComposer.js').catch(() => {});
      import('three/examples/jsm/postprocessing/RenderPass.js').catch(() => {});
      import('three/examples/jsm/postprocessing/UnrealBloomPass.js').catch(() => {});
    };
    const timer = setTimeout(preWarm, Math.max(TRIGGER_DELAY_MS - 5000, 0));
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (docH > 0 && window.scrollY / docH >= 0.35) {
        preWarm();
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { clearTimeout(timer); window.removeEventListener('scroll', onScroll); };
  }, [hasTriggered]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    onForceClose?.();
  }, [onForceClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.email.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const res = await fetch('/api/join-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          source: 'vip-guest-pass',
        }),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setSubmitStatus('success');
      // Close with animation via SlidePanel's internal close (same as clicking X)
      setTimeout(() => {
        if (closePanelRef.current) closePanelRef.current();
        else setIsOpen(false); // fallback
      }, 3000);
    } catch {
      setSubmitStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render before the popup has ever been triggered
  if (!hasTriggered && !forceOpen) return null;

  // NOTE: We intentionally do NOT return null when isOpen is false here.
  // SlidePanel needs to stay mounted briefly after isOpen=false to play
  // its exit animation (slide out + backdrop fade). SlidePanel handles
  // its own unmount timing internally.

  return (
    <SlidePanel
      isOpen={isOpen}
      onClose={handleClose}
      closeRef={closePanelRef}
      title="eXp World Guest Pass"
      subtitle="Step inside the world's largest virtual real estate campus"
      size="md"
      theme="blue"
      backgroundElement={<HolographicGlobe isVisible={isOpen} />}
      icon={
        <img
          src={EXP_X_LOGO}
          alt="eXp"
          style={{ width: '24px', height: '24px', objectFit: 'contain' }}
        />
      }
    >
      {/* Scoped style — dark form labels + extra spacer on wide screens */}
      <style>{`
        .vip-form-area label { color: #0a1a2e !important; }
      `}</style>

      {/* Content area — flex-centered across the full panel height.
           The parent content div is now absolutely positioned (inset: 0)
           so flex centering works from panel top to bottom. */}
      <div
        className="vip-form-area flex flex-col gap-3"
        style={{
          flex: '1 1 0%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 16px',
        }}
      >
        {/* Description — dark text readable against bright blue globe */}
        <p style={{
          fontSize: '14px',
          color: '#0a1a2e',
          lineHeight: 1.6,
          textAlign: 'center',
          fontWeight: 500,
          textShadow: '0 0 8px rgba(100,200,255,0.3)',
        }}>
          84,000+ agents. 29 countries. One virtual campus.<br />
          eXp World is your hub for live training, on-demand support, and direct
          access to leadership. Set up your own virtual office and meet with
          clients anywhere in the world — all inside eXp World.
        </p>

        {submitStatus === 'success' ? (
          <div
            className="text-center py-6 px-4 rounded-xl"
            style={{
              background: 'rgba(0,20,50,0.55)',
              border: '1px solid rgba(0,191,255,0.35)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          >
            <p className="font-semibold mb-1" style={{ fontSize: '18px', color: '#00bfff' }}>
              You&apos;re In!
            </p>
            <p style={{ fontSize: '15px', color: '#e0f7fa', opacity: 0.9 }}>
              Expect an email from <strong style={{ color: '#00bfff' }}>agentonboarding@exprealty.net</strong> within
              3 minutes with a link to access eXp World.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <FormRow columns={2}>
                <FormGroup label="First Name" htmlFor="vip-first-name" required>
                  <FormInput
                    type="text"
                    id="vip-first-name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="First name"
                    required
                    style={{
                      background: 'rgba(2, 8, 22, 0.7)',
                      border: '1px solid rgba(0, 140, 200, 0.3)',
                      color: '#e0f0ff',
                    }}
                  />
                </FormGroup>
                <FormGroup label="Last Name" htmlFor="vip-last-name">
                  <FormInput
                    type="text"
                    id="vip-last-name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Last name"
                    style={{
                      background: 'rgba(2, 8, 22, 0.7)',
                      border: '1px solid rgba(0, 140, 200, 0.3)',
                      color: '#e0f0ff',
                    }}
                  />
                </FormGroup>
              </FormRow>
              <div style={{ marginTop: '-4px' }}>
              <FormGroup label="Email" htmlFor="vip-email" required>
                <FormInput
                  type="email"
                  id="vip-email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="you@example.com"
                  required
                  style={{
                    background: 'rgba(2, 8, 22, 0.7)',
                    border: '1px solid rgba(0, 140, 200, 0.3)',
                    color: '#e0f0ff',
                  }}
                />
              </FormGroup>
              </div>
            </div>

            {submitStatus === 'error' && (
              <p className="text-sm text-center mt-2" style={{ color: '#ff4444' }}>
                {errorMessage}
              </p>
            )}

            <div style={{ marginTop: '31px' }}>
              <FormButton
                type="submit"
                variant="cyber"
                isLoading={isSubmitting}
                loadingText="Claiming..."
                fullWidth
                style={{
                  background: 'linear-gradient(135deg, #00bfff 0%, #0066aa 100%)',
                  color: '#ffffff',
                  border: '1px solid rgba(0,191,255,0.5)',
                  boxShadow: '0 0 20px rgba(0,191,255,0.3), 0 4px 15px rgba(0,0,0,0.3)',
                }}
              >
                Claim Your Guest Pass
              </FormButton>
            </div>
          </form>
        )}

        <p className="text-xs text-center" style={{ color: '#0a1a2e', opacity: 0.5 }}>
          No spam. No obligations.
        </p>
      </div>
    </SlidePanel>
  );
}

export default VIPGuestPassPopup;
