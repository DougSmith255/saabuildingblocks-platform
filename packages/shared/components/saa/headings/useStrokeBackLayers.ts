'use client';

import { useRef, useEffect, useCallback } from 'react';
import { getVisibleLayers } from './layerUtils';

// ── Layer configuration ──────────────────────────────────────────────

export interface StrokeLayer {
  color: string;
  tx: string;
  ty: string;
  filter?: string;
  opacity?: string;
}

export interface StrokeConfig {
  layers: StrokeLayer[];
  strokeWidth: string;
  rotateX: string;
  faceOffset: { x: string; y: string };
  /** Face text-shadow for fill extrusion (applied to the heading element) */
  faceTextShadow: string;
  /** Face text color */
  faceColor: string;
  /** OpenType feature settings for SVG text layers (default: "'ss01' 1") */
  fontFeatureSettings?: string;
}

// ── H1 presets ───────────────────────────────────────────────────────

const H1_FACE_TEXT_SHADOW = [
  '0 0 0.08em rgba(255, 215, 0, 0.4)',
  '0 0 0.2em rgba(255, 215, 0, 0.25)',
  '0.003em 0.004em 0 #e2e1da',
  '0.006em 0.008em 0 #dddcd5',
  '0.010em 0.013em 0 #d8d7d0',
  '0.013em 0.019em 0 #d1d0c7',
  '0.016em 0.025em 0 #cac9c0',
  '0.019em 0.032em 0 #c2c1b8',
  '0.022em 0.038em 0 #bbbab0',
  '0.025em 0.044em 0 #b3b2a8',
  '0.028em 0.050em 0 #abaa9f',
  '0.031em 0.057em 0 #a09f94',
  '0.034em 0.063em 0 #96958a',
  '0.037em 0.070em 0 #8d8c80',
  '0.040em 0.076em 0 #838278',
  '0.043em 0.082em 0 #7a7970',
].join(', ');

const H1_GOLD_LAYERS: StrokeLayer[] = [
  { color: '#b8960a', tx: '0.06em', ty: '0.18em', filter: 'blur(10px)', opacity: '0.5' },
  { color: '#e6ac00', tx: '0.05em', ty: '0.155em' },
  { color: '#d4a010', tx: '0.042em', ty: '0.13em' },
  { color: '#b8900a', tx: '0.035em', ty: '0.11em' },
  { color: '#9a7808', tx: '0.025em', ty: '0.08em' },
  { color: '#7c6008', tx: '0.016em', ty: '0.052em' },
  { color: '#5e4808', tx: '0.008em', ty: '0.026em' },
  { color: '#3f3010', tx: '0.004em', ty: '0.013em' },
  { color: '#191818', tx: '0', ty: '0' },
];

const H1_CYAN_LAYERS: StrokeLayer[] = [
  { color: '#0a7898', tx: '0.06em', ty: '0.18em', filter: 'blur(10px)', opacity: '0.5' },
  { color: '#00bfff', tx: '0.05em', ty: '0.155em' },
  { color: '#0aacdd', tx: '0.042em', ty: '0.13em' },
  { color: '#0a98bb', tx: '0.035em', ty: '0.11em' },
  { color: '#088499', tx: '0.025em', ty: '0.08em' },
  { color: '#087080', tx: '0.016em', ty: '0.052em' },
  { color: '#085c68', tx: '0.008em', ty: '0.026em' },
  { color: '#104850', tx: '0.004em', ty: '0.013em' },
  { color: '#181920', tx: '0', ty: '0' },
];

const H1_CYAN_FACE_TEXT_SHADOW = [
  '0 0 0.08em rgba(0, 191, 255, 0.4)',
  '0 0 0.2em rgba(0, 191, 255, 0.25)',
  '0.003em 0.004em 0 #e2e1da',
  '0.006em 0.008em 0 #dddcd5',
  '0.010em 0.013em 0 #d8d7d0',
  '0.013em 0.019em 0 #d1d0c7',
  '0.016em 0.025em 0 #cac9c0',
  '0.019em 0.032em 0 #c2c1b8',
  '0.022em 0.038em 0 #bbbab0',
  '0.025em 0.044em 0 #b3b2a8',
  '0.028em 0.050em 0 #abaa9f',
  '0.031em 0.057em 0 #a09f94',
  '0.034em 0.063em 0 #96958a',
  '0.037em 0.070em 0 #8d8c80',
  '0.040em 0.076em 0 #838278',
  '0.043em 0.082em 0 #7a7970',
].join(', ');

export const H1_GOLD_CONFIG: StrokeConfig = {
  layers: H1_GOLD_LAYERS,
  strokeWidth: '0.22em',
  rotateX: '12deg',
  faceOffset: { x: '-0.025em', y: '0.13em' },
  faceTextShadow: H1_FACE_TEXT_SHADOW,
  faceColor: '#f2f1ec',
};

export const H1_CYAN_CONFIG: StrokeConfig = {
  layers: H1_CYAN_LAYERS,
  strokeWidth: '0.22em',
  rotateX: '12deg',
  faceOffset: { x: '-0.025em', y: '0.13em' },
  faceTextShadow: H1_CYAN_FACE_TEXT_SHADOW,
  faceColor: '#f2f1ec',
};

// ── H2 presets ───────────────────────────────────────────────────────

const H2_FACE_TEXT_SHADOW = [
  '0.005em 0.007em 0 #dddcd5',
  '0.010em 0.015em 0 #d5d4cb',
  '0.015em 0.025em 0 #cccbc2',
  '0.019em 0.035em 0 #c2c1b8',
  '0.023em 0.045em 0 #b8b7ae',
  '0.027em 0.055em 0 #abaa9f',
  '0.031em 0.065em 0 #a09f94',
  '0.034em 0.073em 0 #96958a',
  '0.037em 0.080em 0 #8d8c80',
  '0.040em 0.088em 0 #7a7970',
].join(', ');

const H2_DEFAULT_LAYERS: StrokeLayer[] = [
  { color: '#404040', tx: '0.04em', ty: '0.12em', filter: 'blur(6px)', opacity: '0.4' },
  { color: '#404040', tx: '0.035em', ty: '0.105em' },
  { color: '#3c3c3c', tx: '0.030em', ty: '0.09em' },
  { color: '#383838', tx: '0.025em', ty: '0.075em' },
  { color: '#343434', tx: '0.018em', ty: '0.055em' },
  { color: '#303030', tx: '0.012em', ty: '0.038em' },
  { color: '#2c2c2c', tx: '0.006em', ty: '0.020em' },
  { color: '#282828', tx: '0.003em', ty: '0.010em' },
  { color: '#222222', tx: '0', ty: '0' },
];

const H2_GOLD_LAYERS: StrokeLayer[] = [
  { color: '#b8960a', tx: '0.04em', ty: '0.12em', filter: 'blur(6px)', opacity: '0.4' },
  { color: '#e6ac00', tx: '0.035em', ty: '0.105em' },
  { color: '#d4a010', tx: '0.030em', ty: '0.09em' },
  { color: '#b8900a', tx: '0.025em', ty: '0.075em' },
  { color: '#9a7808', tx: '0.018em', ty: '0.055em' },
  { color: '#7c6008', tx: '0.012em', ty: '0.038em' },
  { color: '#5e4808', tx: '0.006em', ty: '0.020em' },
  { color: '#3f3010', tx: '0.003em', ty: '0.010em' },
  { color: '#191818', tx: '0', ty: '0' },
];

const H2_BLUE_LAYERS: StrokeLayer[] = [
  { color: '#0a7898', tx: '0.04em', ty: '0.12em', filter: 'blur(6px)', opacity: '0.4' },
  { color: '#00bfff', tx: '0.035em', ty: '0.105em' },
  { color: '#0aacdd', tx: '0.030em', ty: '0.09em' },
  { color: '#0a98bb', tx: '0.025em', ty: '0.075em' },
  { color: '#088499', tx: '0.018em', ty: '0.055em' },
  { color: '#086080', tx: '0.012em', ty: '0.038em' },
  { color: '#0a3a50', tx: '0.006em', ty: '0.020em' },
  { color: '#1a2a38', tx: '0.003em', ty: '0.010em' },
  { color: '#181920', tx: '0', ty: '0' },
];

const H2_PURPLE_LAYERS: StrokeLayer[] = [
  { color: '#6030a0', tx: '0.04em', ty: '0.12em', filter: 'blur(6px)', opacity: '0.4' },
  { color: '#a855f7', tx: '0.035em', ty: '0.105em' },
  { color: '#7845c8', tx: '0.030em', ty: '0.09em' },
  { color: '#6030a0', tx: '0.025em', ty: '0.075em' },
  { color: '#4a2068', tx: '0.018em', ty: '0.055em' },
  { color: '#3a1a50', tx: '0.012em', ty: '0.038em' },
  { color: '#2a1535', tx: '0.006em', ty: '0.020em' },
  { color: '#1a1020', tx: '0.003em', ty: '0.010em' },
  { color: '#1a1020', tx: '0', ty: '0' },
];

const H2_EMERALD_LAYERS: StrokeLayer[] = [
  { color: '#0a9868', tx: '0.04em', ty: '0.12em', filter: 'blur(6px)', opacity: '0.4' },
  { color: '#10b981', tx: '0.035em', ty: '0.105em' },
  { color: '#0a9868', tx: '0.030em', ty: '0.09em' },
  { color: '#086048', tx: '0.025em', ty: '0.075em' },
  { color: '#0a4a38', tx: '0.018em', ty: '0.055em' },
  { color: '#0f3a2a', tx: '0.012em', ty: '0.038em' },
  { color: '#152a25', tx: '0.006em', ty: '0.020em' },
  { color: '#101a18', tx: '0.003em', ty: '0.010em' },
  { color: '#101a18', tx: '0', ty: '0' },
];

// ── Light-mode H2 layers (visible depth on #e5e4dd background) ───────

const H2_LIGHT_FACE_TEXT_SHADOW = [
  '0.005em 0.007em 0 #a8a79e',
  '0.010em 0.015em 0 #9e9d94',
  '0.015em 0.025em 0 #94938a',
  '0.019em 0.035em 0 #8a8980',
  '0.023em 0.045em 0 #807f76',
  '0.027em 0.055em 0 #76756c',
  '0.031em 0.065em 0 #6c6b62',
  '0.034em 0.073em 0 #626158',
  '0.037em 0.080em 0 #58574e',
  '0.040em 0.088em 0 #4e4d44',
].join(', ');

const H2_LIGHT_LAYERS: StrokeLayer[] = [
  { color: 'rgba(80, 80, 80, 0.3)', tx: '0.04em', ty: '0.12em', filter: 'blur(6px)', opacity: '0.4' },
  { color: '#9a9a9a', tx: '0.035em', ty: '0.105em' },
  { color: '#909090', tx: '0.030em', ty: '0.09em' },
  { color: '#868686', tx: '0.025em', ty: '0.075em' },
  { color: '#7c7c7c', tx: '0.018em', ty: '0.055em' },
  { color: '#727272', tx: '0.012em', ty: '0.038em' },
  { color: '#686868', tx: '0.006em', ty: '0.020em' },
  { color: '#5e5e5e', tx: '0.003em', ty: '0.010em' },
  { color: '#545454', tx: '0', ty: '0' },
];

const H2_FACE_OFFSET = { x: '-0.018em', y: '0.15em' };

export const H2_DEFAULT_CONFIG: StrokeConfig = {
  layers: H2_DEFAULT_LAYERS,
  strokeWidth: '0.18em',
  rotateX: '8deg',
  faceOffset: H2_FACE_OFFSET,
  faceTextShadow: H2_FACE_TEXT_SHADOW,
  faceColor: '#e5e4dd',
  fontFeatureSettings: "'ss02' 1",
};

export const H2_GOLD_CONFIG: StrokeConfig = {
  layers: H2_GOLD_LAYERS,
  strokeWidth: '0.18em',
  rotateX: '8deg',
  faceOffset: H2_FACE_OFFSET,
  faceTextShadow: H2_FACE_TEXT_SHADOW,
  faceColor: '#e8d4a0',
  fontFeatureSettings: "'ss02' 1",
};

export const H2_BLUE_CONFIG: StrokeConfig = {
  layers: H2_BLUE_LAYERS,
  strokeWidth: '0.18em',
  rotateX: '8deg',
  faceOffset: H2_FACE_OFFSET,
  faceTextShadow: H2_FACE_TEXT_SHADOW,
  faceColor: '#b0d4e8',
  fontFeatureSettings: "'ss02' 1",
};

export const H2_PURPLE_CONFIG: StrokeConfig = {
  layers: H2_PURPLE_LAYERS,
  strokeWidth: '0.18em',
  rotateX: '8deg',
  faceOffset: H2_FACE_OFFSET,
  faceTextShadow: H2_FACE_TEXT_SHADOW,
  faceColor: '#d4b0e8',
  fontFeatureSettings: "'ss02' 1",
};

export const H2_EMERALD_CONFIG: StrokeConfig = {
  layers: H2_EMERALD_LAYERS,
  strokeWidth: '0.18em',
  rotateX: '8deg',
  faceOffset: H2_FACE_OFFSET,
  faceTextShadow: H2_FACE_TEXT_SHADOW,
  faceColor: '#a0e8c4',
  fontFeatureSettings: "'ss02' 1",
};

export const H2_LIGHT_CONFIG: StrokeConfig = {
  layers: H2_LIGHT_LAYERS,
  strokeWidth: '0.18em',
  rotateX: '8deg',
  faceOffset: H2_FACE_OFFSET,
  faceTextShadow: H2_LIGHT_FACE_TEXT_SHADOW,
  faceColor: '#191818',
  fontFeatureSettings: "'ss02' 1",
};

// ── Founder name preset (gold, smaller scale) ────────────────────────

const FOUNDER_GOLD_LAYERS: StrokeLayer[] = [
  { color: '#b8960a', tx: '0.04em', ty: '0.12em', filter: 'blur(6px)', opacity: '0.4' },
  { color: '#e6ac00', tx: '0.035em', ty: '0.105em' },
  { color: '#d4a010', tx: '0.030em', ty: '0.09em' },
  { color: '#b8900a', tx: '0.025em', ty: '0.075em' },
  { color: '#9a7808', tx: '0.018em', ty: '0.055em' },
  { color: '#7c6008', tx: '0.012em', ty: '0.038em' },
  { color: '#5e4808', tx: '0.006em', ty: '0.020em' },
  { color: '#3f3010', tx: '0.003em', ty: '0.010em' },
  { color: '#191818', tx: '0', ty: '0' },
];

const FOUNDER_FACE_TEXT_SHADOW = [
  '0 0 0.01em #fff',
  '0 0 0.02em #fff',
  '0 0 0.03em rgba(255,255,255,0.8)',
  '0 0 0.05em #ffd700',
  '0 0 0.09em rgba(255, 215, 0, 0.8)',
  '0 0 0.13em rgba(255, 215, 0, 0.55)',
  '0 0 0.18em rgba(255, 179, 71, 0.35)',
].join(', ');

export const FOUNDER_GOLD_CONFIG: StrokeConfig = {
  layers: FOUNDER_GOLD_LAYERS,
  strokeWidth: '0.16em',
  rotateX: '12deg',
  faceOffset: { x: '-0.015em', y: '0.10em' },
  faceTextShadow: FOUNDER_FACE_TEXT_SHADOW,
  faceColor: '#ffd700',
};

// ── Line-break detection ─────────────────────────────────────────────

interface TextLine {
  text: string;
  bottom: number;
  centerX: number; // horizontal center of this line relative to wrapper (px)
  width: number;   // measured width of the face text line (px)
}

function getTextLines(heading: HTMLElement, wrapperRect: DOMRect): TextLine[] {
  const fullText = heading.textContent?.trim() || '';

  // Find first text node - may be nested inside <strong>, <span>, etc.
  let textNode: Node | null = heading.childNodes[0];
  if (textNode && textNode.nodeType !== 3) {
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    textNode = walker.nextNode();
  }

  if (!textNode || textNode.nodeType !== 3) {
    // Fallback: use heading's bounding rect
    const hRect = heading.getBoundingClientRect();
    const cx = (hRect.left + hRect.right) / 2 - wrapperRect.left;
    return [{ text: fullText, bottom: hRect.bottom - wrapperRect.top, centerX: cx, width: hRect.width }];
  }

  // Use the found text node's data
  const text = (textNode as Text).data;

  interface RawLine {
    text: string;
    bottom: number;
    minX: number;
    maxX: number;
  }
  const rawLines: RawLine[] = [];
  let lastTop = -Infinity;
  let currentLine = '';
  let lineRect: DOMRect | null = null;
  let lineMinX = Infinity;
  let lineMaxX = -Infinity;

  for (let i = 0; i < text.length; i++) {
    const range = document.createRange();
    range.setStart(textNode, i);
    range.setEnd(textNode, i + 1);
    const rect = range.getBoundingClientRect();
    range.detach();

    if (rect.height === 0) continue;

    if (rect.top > lastTop + 2 && currentLine) {
      rawLines.push({
        text: currentLine,
        bottom: lineRect!.bottom - wrapperRect.top,
        minX: lineMinX - wrapperRect.left,
        maxX: lineMaxX - wrapperRect.left,
      });
      currentLine = text[i];
      lineRect = rect;
      lineMinX = rect.left;
      lineMaxX = rect.right;
    } else {
      currentLine += text[i];
      if (!lineRect || rect.top > lastTop + 2) lineRect = rect;
      lineMinX = Math.min(lineMinX, rect.left);
      lineMaxX = Math.max(lineMaxX, rect.right);
    }
    lastTop = rect.top;
  }
  if (currentLine) {
    rawLines.push({
      text: currentLine.trimEnd(),
      bottom: lineRect ? lineRect.bottom - wrapperRect.top : 0,
      minX: lineMinX - wrapperRect.left,
      maxX: lineMaxX - wrapperRect.left,
    });
  }

  if (rawLines.length <= 1) {
    return rawLines.map((l) => ({
      text: l.text,
      bottom: l.bottom,
      centerX: (l.minX + l.maxX) / 2,
      width: l.maxX - l.minX,
    }));
  }

  const styles = getComputedStyle(heading);
  const lineHeight = parseFloat(styles.lineHeight) || parseFloat(styles.fontSize) * 1.1;
  const firstBottom = rawLines[0].bottom;

  return rawLines.map((line, i) => ({
    text: line.text,
    bottom: firstBottom + i * lineHeight,
    centerX: (line.minX + line.maxX) / 2,
    width: line.maxX - line.minX,
  }));
}

// ── SVG layer creation ───────────────────────────────────────────────

const NS = 'http://www.w3.org/2000/svg';

export function createBackLayers(
  wrapper: HTMLDivElement,
  heading: HTMLElement,
  config: StrokeConfig,
) {
  const { layers, strokeWidth, rotateX } = config;
  const visibleLayers = getVisibleLayers(layers);
  if (visibleLayers.length === 0) return;
  const styles = getComputedStyle(heading);
  const fontSizePx = parseFloat(styles.fontSize);
  const fontWeight = styles.fontWeight;
  // Remove transform before measuring so coordinates are untransformed
  const origTransform = heading.style.transform;
  heading.style.transform = 'none';
  heading.offsetHeight; // force reflow
  const wrapperRect = wrapper.getBoundingClientRect();
  const lines = getTextLines(heading, wrapperRect);

  // Restore base transform (face offset applied after)
  heading.style.transform = origTransform;
  if (!lines.length) return;

  visibleLayers.forEach((layer, i) => {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('overflow', 'visible');
    svg.style.cssText =
      'position:absolute;top:0;left:0;width:100%;height:calc(100% + 1em);' +
      'overflow:visible;pointer-events:none;user-select:none;' +
      `transform:perspective(800px) rotateX(${rotateX}) translate(${layer.tx || '0'},${layer.ty || '0'})`;
    if (layer.filter) svg.style.filter = layer.filter;
    if (layer.opacity) svg.style.opacity = layer.opacity;

    const isInnermostLayer = i === visibleLayers.length - 1;

    lines.forEach((line) => {
      const textEl = document.createElementNS(NS, 'text');
      textEl.setAttribute('x', `${line.centerX}px`);
      textEl.setAttribute('y', `${line.bottom - fontSizePx * 0.05}px`);
      textEl.setAttribute('text-anchor', 'middle');
      textEl.setAttribute('fill', isInnermostLayer ? layer.color : 'none');
      textEl.setAttribute('stroke', layer.color);
      textEl.setAttribute('stroke-width', strokeWidth);
      textEl.setAttribute('stroke-linejoin', 'miter');
      textEl.setAttribute('stroke-miterlimit', '4');
      textEl.setAttribute('paint-order', 'stroke fill');
      textEl.style.fontFamily = "'Taskor', serif";
      textEl.style.fontSize = `${fontSizePx}px`;
      textEl.style.fontWeight = fontWeight;
      textEl.style.fontFeatureSettings = config.fontFeatureSettings || "'ss01' 1";
      textEl.textContent = line.text;
      if (line.width > 0) {
        textEl.setAttribute('textLength', `${line.width}px`);
        textEl.setAttribute('lengthAdjust', 'spacing');
      }
      svg.appendChild(textEl);
    });

    wrapper.insertBefore(svg, heading);
  });

  // Apply face offset
  const { faceOffset } = config;
  heading.style.transform = `perspective(800px) rotateX(${rotateX}) translate(${faceOffset.x},${faceOffset.y})`;
}

// ── React hook ───────────────────────────────────────────────────────

export function useStrokeBackLayers(config: StrokeConfig) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const rebuild = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const heading = wrapper.querySelector<HTMLElement>('.heading-front');
    if (!heading) return;

    // Clear existing SVG layers
    wrapper.querySelectorAll('svg[aria-hidden]').forEach((svg) => svg.remove());

    // Skip if wrapper is invisible (zero dimensions or hidden)
    const rect = wrapper.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;

    // Skip if an ancestor applies a non-identity rotation (SVG positioning
    // uses the wrapper's local coordinate system, but getBoundingClientRect
    // returns axis-aligned bounding boxes, so measurements are wrong when
    // the wrapper or a parent is rotated).
    let el: HTMLElement | null = wrapper.parentElement;
    while (el) {
      const t = getComputedStyle(el).transform;
      if (t && t !== 'none') {
        const m = new DOMMatrix(t);
        // Check for any significant rotation (skew in the matrix)
        if (Math.abs(m.b) > 0.01 || Math.abs(m.c) > 0.01) return;
      }
      el = el.parentElement;
    }

    // Reset face transform for clean measurement
    heading.style.transform = `perspective(800px) rotateX(${config.rotateX})`;

    createBackLayers(wrapper, heading, config);
  }, [config]);

  useEffect(() => {
    document.fonts.ready.then(rebuild);

    // Debounced resize handler
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(rebuild, 150);
    };
    window.addEventListener('resize', onResize);

    const wrapper = wrapperRef.current;

    // ResizeObserver: rebuild when wrapper dimensions change
    // (catches accordion open/close, visibility changes, etc.)
    let ro: ResizeObserver | undefined;
    if (wrapper) {
      ro = new ResizeObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(rebuild, 100);
      });
      ro.observe(wrapper);
    }

    // Listen for transform transitions ending on ancestors.
    // When a parent accordion panel rotates, we skip SVG layer creation.
    // Once the rotation transition ends, we rebuild so layers render correctly.
    const onTransitionEnd = (e: Event) => {
      const prop = (e as TransitionEvent).propertyName;
      if (prop === 'transform' || prop === 'flex') {
        clearTimeout(timer);
        timer = setTimeout(rebuild, 50);
      }
    };
    // Attach to the wrapper's nearest positioned ancestor (captures bubbled events)
    const listenTarget = wrapper?.closest('section') || wrapper?.parentElement?.parentElement;
    listenTarget?.addEventListener('transitionend', onTransitionEnd);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
      ro?.disconnect();
      listenTarget?.removeEventListener('transitionend', onTransitionEnd);
    };
  }, [rebuild]);

  return wrapperRef;
}

// ── Blog H2 CSS div backing ────────────────────────────────────────
// Creates div-based backing layers that match H2.tsx component rendering.
// Unlike SVG text layers, div layers reflow naturally on resize.

export interface BlogH2DivConfig {
  rotateX: string;
  rotateY: string;
  strokeWidth?: string;
  shadow: { color: string; tx: string; ty: string; blur: string };
  layers: { color: string; tx: string; ty: string; stroke?: string }[];
  face: { color: string; tx: string; ty: string; textShadow: string };
}

const BLOG_FACE_SHADOW = [
  '0.003em 0.005em 0 #dddcd5',
  '0.006em 0.011em 0 #d5d4cb',
  '0.009em 0.017em 0 #cccbc2',
  '0.012em 0.023em 0 #c2c1b8',
  '0.015em 0.030em 0 #b8b7ae',
  '0.018em 0.037em 0 #abaa9f',
  '0.021em 0.044em 0 #a09f94',
  '0.024em 0.051em 0 #96958a',
  '0.027em 0.058em 0 #8d8c80',
  '0.030em 0.065em 0 #838277',
  '0.033em 0.070em 0 #7a7970',
].join(', ');

const BLOG_LIGHT_FACE_SHADOW = [
  '0.005em 0.007em 0 #a8a79e',
  '0.010em 0.015em 0 #9e9d94',
  '0.015em 0.025em 0 #94938a',
  '0.019em 0.035em 0 #8a8980',
  '0.023em 0.045em 0 #807f76',
  '0.027em 0.055em 0 #76756c',
  '0.031em 0.065em 0 #6c6b62',
  '0.034em 0.073em 0 #626158',
  '0.037em 0.080em 0 #58574e',
  '0.040em 0.088em 0 #4e4d44',
].join(', ');

const BLOG_OFFSETS: { tx: string; ty: string }[] = [
  { tx: '0.018em', ty: '0.053em' },
  { tx: '0.015em', ty: '0.045em' },
  { tx: '0.013em', ty: '0.038em' },
  { tx: '0.009em', ty: '0.028em' },
  { tx: '0.006em', ty: '0.019em' },
  { tx: '0.003em', ty: '0.010em' },
  { tx: '0.002em', ty: '0.005em' },
  { tx: '0em', ty: '0em' },
];

const blogLayers = (colors: string[]) =>
  colors.map((color, i) => ({ color, ...BLOG_OFFSETS[i] }));

export const BLOG_H2_DARK: BlogH2DivConfig = {
  rotateX: '8deg',
  rotateY: '-1.5deg',
  shadow: { color: 'rgba(64, 64, 64, 0.4)', tx: '0.025em', ty: '0.07em', blur: '4px' },
  layers: [
    { color: '#444444', tx: '0.022em', ty: '0.065em', stroke: '0.10em' },
    { color: '#1a1a1a', tx: '0em', ty: '0em', stroke: '0.16em' },
  ],
  face: { color: '#e5e4dd', tx: '-0.025em', ty: '-0.055em', textShadow: BLOG_FACE_SHADOW },
};

export const BLOG_H2_LIGHT: BlogH2DivConfig = {
  rotateX: '8deg',
  rotateY: '-1.5deg',
  shadow: { color: 'rgba(80, 80, 80, 0.3)', tx: '0.025em', ty: '0.07em', blur: '4px' },
  layers: [
    { color: '#9a9a9a', tx: '0.022em', ty: '0.065em', stroke: '0.10em' },
    { color: '#545454', tx: '0em', ty: '0em', stroke: '0.16em' },
  ],
  face: { color: '#191818', tx: '-0.025em', ty: '-0.055em', textShadow: BLOG_LIGHT_FACE_SHADOW },
};

/**
 * Create CSS div-based backing layers for blog H2 elements.
 * Matches H2.tsx component rendering - layers reflow naturally on resize.
 */
export function createDivBackLayers(
  wrapper: HTMLDivElement,
  heading: HTMLElement,
  config: BlogH2DivConfig,
) {
  if (config.layers.length === 0) return;

  const text = heading.textContent?.trim() || '';
  const cs = getComputedStyle(heading);
  const persp = (tx: string, ty: string) =>
    `perspective(800px) rotateX(${config.rotateX}) rotateY(${config.rotateY}) translate(${tx}, ${ty})`;

  // Static font properties only - font-size is provided by the heading's
  // CSS classes (e.g. text-h2) via responsive clamp(), NOT computed pixels.
  const fontCss =
    `font-family:${cs.fontFamily};font-weight:${cs.fontWeight};` +
    `letter-spacing:${cs.letterSpacing};text-transform:${cs.textTransform};` +
    `font-feature-settings:${cs.fontFeatureSettings || '"ss02" 1'};`;
  const baseCss =
    `position:absolute;top:0;left:0;right:0;pointer-events:none;` +
    `text-align:${cs.textAlign};line-height:1.1;${fontCss}`;

  // Copy heading's classes so backing divs get the same responsive font-size
  const headingClasses = heading.className;

  // Backing container
  const container = document.createElement('div');
  container.setAttribute('aria-hidden', 'true');
  container.setAttribute('data-h2-backing', '');
  container.style.userSelect = 'none';

  // Shadow layer
  const shadow = document.createElement('div');
  shadow.className = headingClasses;
  shadow.style.cssText =
    baseCss +
    `color:${config.shadow.color};text-shadow:none;` +
    `transform:${persp(config.shadow.tx, config.shadow.ty)};filter:blur(${config.shadow.blur});`;
  shadow.textContent = text;
  container.appendChild(shadow);

  // Stroked layers (2-layer deep design)
  config.layers.forEach((layer) => {
    const strokeW = layer.stroke || config.strokeWidth || '0.10em';
    const div = document.createElement('div');
    div.className = headingClasses;
    div.style.cssText =
      baseCss +
      `color:${layer.color};-webkit-text-stroke:${strokeW} ${layer.color};` +
      `-webkit-text-fill-color:${layer.color};paint-order:stroke fill;text-shadow:none;` +
      `transform:${persp(layer.tx, layer.ty)};`;
    div.textContent = text;
    container.appendChild(div);
  });

  wrapper.insertBefore(container, heading);

  // Style the face
  heading.style.color = config.face.color;
  heading.style.textShadow = config.face.textShadow;
  heading.style.transform = persp(config.face.tx, config.face.ty);
  heading.style.lineHeight = '1.1';
  heading.style.position = 'relative';
  heading.style.overflow = 'visible';
  heading.style.filter = 'none';
}
