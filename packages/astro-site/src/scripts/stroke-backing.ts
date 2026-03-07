/**
 * SVG Stroke Backing Layers - Vanilla JS
 *
 * Standalone version of useStrokeBackLayers.ts for Astro static HTML.
 * Finds all elements with data-stroke-config and creates SVG backing layers.
 * No React dependency.
 */

interface StrokeLayer {
  color: string;
  tx?: string;
  ty?: string;
  filter?: string;
  opacity?: string;
}

interface StrokeConfig {
  layers: StrokeLayer[];
  strokeWidth: string;
  rotateX: string;
  faceOffset: { x: string; y: string };
  faceTextShadow: string;
  faceColor: string;
}

// ── H1 presets ──────────────────────────────────────────────────────

const H1_GOLD_LAYERS: StrokeLayer[] = [
  { color: '#b8960a', tx: '0.06em', ty: '0.18em', filter: 'blur(10px)', opacity: '0.5' },
  { color: '#e6ac00', tx: '0.05em', ty: '0.155em' },
  { color: '#d4a010', tx: '0.042em', ty: '0.13em' },
  { color: '#b8900a', tx: '0.034em', ty: '0.105em' },
  { color: '#9a7808', tx: '0.025em', ty: '0.08em' },
  { color: '#7c6008', tx: '0.017em', ty: '0.055em' },
  { color: '#5e4808', tx: '0.009em', ty: '0.03em' },
  { color: '#3f3010', tx: '0.004em', ty: '0.015em' },
  { color: '#191818', tx: '0', ty: '0' },
];

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

const H1_CYAN_LAYERS: StrokeLayer[] = [
  { color: '#0a6878', tx: '0.06em', ty: '0.18em', filter: 'blur(10px)', opacity: '0.5' },
  { color: '#00c8d0', tx: '0.05em', ty: '0.155em' },
  { color: '#0ab0b8', tx: '0.042em', ty: '0.13em' },
  { color: '#0a9098', tx: '0.034em', ty: '0.105em' },
  { color: '#087880', tx: '0.025em', ty: '0.08em' },
  { color: '#085860', tx: '0.017em', ty: '0.055em' },
  { color: '#0a3840', tx: '0.009em', ty: '0.03em' },
  { color: '#182828', tx: '0.004em', ty: '0.015em' },
  { color: '#181a1a', tx: '0', ty: '0' },
];

const H1_CYAN_FACE_TEXT_SHADOW = [
  '0 0 0.08em rgba(0, 200, 208, 0.4)',
  '0 0 0.2em rgba(0, 200, 208, 0.25)',
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

// ── H2 presets ──────────────────────────────────────────────────────

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

const H2_FACE_OFFSET = { x: '-0.018em', y: '0.15em' };

// ── Config registry ──────────────────────────────────────────────────

const CONFIGS: Record<string, StrokeConfig> = {
  'h1-gold': {
    layers: H1_GOLD_LAYERS, strokeWidth: '0.22em', rotateX: '12deg',
    faceOffset: { x: '-0.025em', y: '0.13em' }, faceTextShadow: H1_FACE_TEXT_SHADOW, faceColor: '#f2f1ec',
  },
  'h1-cyan': {
    layers: H1_CYAN_LAYERS, strokeWidth: '0.22em', rotateX: '12deg',
    faceOffset: { x: '-0.025em', y: '0.13em' }, faceTextShadow: H1_CYAN_FACE_TEXT_SHADOW, faceColor: '#f2f1ec',
  },
  'h2-default': {
    layers: H2_DEFAULT_LAYERS, strokeWidth: '0.18em', rotateX: '8deg',
    faceOffset: H2_FACE_OFFSET, faceTextShadow: H2_FACE_TEXT_SHADOW, faceColor: '#e5e4dd',
  },
  'h2-gold': {
    layers: H2_GOLD_LAYERS, strokeWidth: '0.18em', rotateX: '8deg',
    faceOffset: H2_FACE_OFFSET, faceTextShadow: H2_FACE_TEXT_SHADOW, faceColor: '#e8d4a0',
  },
  'h2-blue': {
    layers: H2_BLUE_LAYERS, strokeWidth: '0.18em', rotateX: '8deg',
    faceOffset: H2_FACE_OFFSET, faceTextShadow: H2_FACE_TEXT_SHADOW, faceColor: '#b0d4e8',
  },
  'h2-purple': {
    layers: H2_PURPLE_LAYERS, strokeWidth: '0.18em', rotateX: '8deg',
    faceOffset: H2_FACE_OFFSET, faceTextShadow: H2_FACE_TEXT_SHADOW, faceColor: '#d4b0e8',
  },
  'h2-emerald': {
    layers: H2_EMERALD_LAYERS, strokeWidth: '0.18em', rotateX: '8deg',
    faceOffset: H2_FACE_OFFSET, faceTextShadow: H2_FACE_TEXT_SHADOW, faceColor: '#a0e8c4',
  },
  'founder-gold': {
    layers: FOUNDER_GOLD_LAYERS, strokeWidth: '0.16em', rotateX: '12deg',
    faceOffset: { x: '-0.015em', y: '0.10em' }, faceTextShadow: FOUNDER_FACE_TEXT_SHADOW, faceColor: '#ffd700',
  },
};

// ── Line-break detection ─────────────────────────────────────────────

interface TextLine {
  text: string;
  bottom: number;
  centerX: number;
  width: number;
}

function getTextLines(heading: HTMLElement, wrapperRect: DOMRect): TextLine[] {
  const fullText = heading.textContent?.trim() || '';

  let textNode: Node | null = heading.childNodes[0];
  if (textNode && textNode.nodeType !== 3) {
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    textNode = walker.nextNode();
  }

  if (!textNode || textNode.nodeType !== 3) {
    const hRect = heading.getBoundingClientRect();
    const cx = (hRect.left + hRect.right) / 2 - wrapperRect.left;
    return [{ text: fullText, bottom: hRect.bottom - wrapperRect.top, centerX: cx, width: hRect.width }];
  }

  const text = (textNode as Text).data;

  interface RawLine { text: string; bottom: number; minX: number; maxX: number; }
  const rawLines: RawLine[] = [];
  let lastTop = -Infinity;
  let currentLine = '';
  let lineRect: DOMRect | null = null;
  let lineMinX = Infinity;
  let lineMaxX = -Infinity;

  for (let i = 0; i < text.length; i++) {
    const range = document.createRange();
    range.setStart(textNode!, i);
    range.setEnd(textNode!, i + 1);
    const rect = range.getBoundingClientRect();
    range.detach();

    if (rect.height === 0) continue;

    if (rect.top > lastTop + 2 && currentLine) {
      rawLines.push({ text: currentLine, bottom: lineRect!.bottom - wrapperRect.top, minX: lineMinX - wrapperRect.left, maxX: lineMaxX - wrapperRect.left });
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
    rawLines.push({ text: currentLine.trimEnd(), bottom: lineRect ? lineRect.bottom - wrapperRect.top : 0, minX: lineMinX - wrapperRect.left, maxX: lineMaxX - wrapperRect.left });
  }

  if (rawLines.length <= 1) {
    return rawLines.map((l) => ({ text: l.text, bottom: l.bottom, centerX: (l.minX + l.maxX) / 2, width: l.maxX - l.minX }));
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

function createBackLayers(wrapper: HTMLDivElement, heading: HTMLElement, config: StrokeConfig) {
  const { layers, strokeWidth, rotateX } = config;
  const styles = getComputedStyle(heading);
  const fontSizePx = parseFloat(styles.fontSize);
  const fontWeight = styles.fontWeight;

  const origTransform = heading.style.transform;
  heading.style.transform = 'none';
  heading.offsetHeight;
  const wrapperRect = wrapper.getBoundingClientRect();
  const lines = getTextLines(heading, wrapperRect);

  heading.style.transform = origTransform;
  if (!lines.length) return;

  const openingRadius = Math.max(0.8, fontSizePx * 0.03);

  layers.forEach((layer, i) => {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('overflow', 'visible');
    svg.style.cssText =
      'position:absolute;top:0;left:0;width:100%;height:calc(100% + 1em);' +
      'overflow:visible;pointer-events:none;user-select:none;' +
      `transform:perspective(800px) rotateX(${rotateX}) translate(${layer.tx || '0'},${layer.ty || '0'})`;
    if (layer.filter) svg.style.filter = layer.filter;
    if (layer.opacity) svg.style.opacity = layer.opacity;

    if (!layer.filter) {
      const defs = document.createElementNS(NS, 'defs');
      const filterId = `stroke-smooth-${i}`;
      const filter = document.createElementNS(NS, 'filter');
      filter.setAttribute('id', filterId);
      filter.setAttribute('x', '-10%');
      filter.setAttribute('y', '-25%');
      filter.setAttribute('width', '120%');
      filter.setAttribute('height', '150%');
      filter.setAttribute('primitiveUnits', 'userSpaceOnUse');
      const dilate = document.createElementNS(NS, 'feMorphology');
      dilate.setAttribute('operator', 'dilate');
      dilate.setAttribute('radius', String(Math.max(1, Math.round(openingRadius))));
      dilate.setAttribute('in', 'SourceGraphic');
      dilate.setAttribute('result', 'expanded');
      const blur = document.createElementNS(NS, 'feGaussianBlur');
      blur.setAttribute('stdDeviation', '0.8');
      blur.setAttribute('in', 'expanded');
      blur.setAttribute('result', 'smoothed');
      const transfer = document.createElementNS(NS, 'feComponentTransfer');
      transfer.setAttribute('in', 'smoothed');
      const funcA = document.createElementNS(NS, 'feFuncA');
      funcA.setAttribute('type', 'linear');
      funcA.setAttribute('slope', '15');
      funcA.setAttribute('intercept', '0');
      transfer.appendChild(funcA);
      filter.appendChild(dilate);
      filter.appendChild(blur);
      filter.appendChild(transfer);
      defs.appendChild(filter);
      svg.appendChild(defs);
    }

    const isInnermostLayer = i === layers.length - 1;

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
      if (!layer.filter) {
        textEl.setAttribute('filter', `url(#stroke-smooth-${i})`);
      }
      textEl.style.fontFamily = "'Taskor', serif";
      textEl.style.fontSize = `${fontSizePx}px`;
      textEl.style.fontWeight = fontWeight;
      textEl.style.fontFeatureSettings = "'ss01' 1";
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

// ── Init + resize handler ────────────────────────────────────────────

function processAllHeadings() {
  document.querySelectorAll<HTMLDivElement>('[data-stroke-config]').forEach((wrapper) => {
    const configName = wrapper.dataset.strokeConfig!;
    const config = CONFIGS[configName];
    if (!config) return;

    const heading = wrapper.querySelector<HTMLElement>('.heading-front');
    if (!heading) return;

    // Skip if already processed and dimensions haven't changed
    const rect = wrapper.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;

    // Skip if an ancestor has rotation
    let el: HTMLElement | null = wrapper.parentElement;
    while (el) {
      const t = getComputedStyle(el).transform;
      if (t && t !== 'none') {
        const m = new DOMMatrix(t);
        if (Math.abs(m.b) > 0.01 || Math.abs(m.c) > 0.01) return;
      }
      el = el.parentElement;
    }

    // Reset face transform for measurement
    heading.style.transform = `perspective(800px) rotateX(${config.rotateX})`;

    createBackLayers(wrapper, heading, config);
  });
}

function clearAllSvgs() {
  document.querySelectorAll('[data-stroke-config] svg[aria-hidden]').forEach((svg) => svg.remove());
}

// Run after fonts load
document.fonts.ready.then(processAllHeadings);

// Debounced resize handler
let resizeTimer: ReturnType<typeof setTimeout>;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    clearAllSvgs();
    processAllHeadings();
  }, 150);
});

// ResizeObserver for dynamic content
const ro = new ResizeObserver(() => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    clearAllSvgs();
    processAllHeadings();
  }, 100);
});

document.querySelectorAll('[data-stroke-config]').forEach((el) => ro.observe(el));
