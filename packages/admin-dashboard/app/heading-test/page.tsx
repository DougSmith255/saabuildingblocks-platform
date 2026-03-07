'use client';

import React from 'react';

const FONT_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-taskor), serif',
};

const H1_SIZE = 'clamp(50px, calc(30px + 4vw + 0.3vh), 150px)';
const H2_SIZE = 'clamp(26px, calc(16px + 2.2vw), 64px)';

/** Replace M, A, E, N, T with their Taskor alternate glyphs (PUA codepoints) */
function altGlyphs(text: string): string {
  const map: Record<string, string> = {
    M: '\uF016',
    A: '\uF00E',
    E: '\uF011',
    N: '\uF015',  // second N alternate
    T: '\uF018',
  };
  return text.replace(/[MAENT]/g, ch => map[ch] ?? ch);
}

// ── Face shadows ──────────────────────────────────────────────────────

const EXTRUSION_SHADOWS = [
  '0.003em 0.005em 0 #e5e4dd',
  '0.006em 0.010em 0 #e0dfda',
  '0.009em 0.016em 0 #dbdad5',
  '0.012em 0.022em 0 #d5d4cd',
  '0.015em 0.028em 0 #cfcec6',
  '0.018em 0.035em 0 #c8c7bf',
  '0.021em 0.042em 0 #c0bfb7',
  '0.024em 0.049em 0 #b8b7ae',
  '0.027em 0.056em 0 #b0afa5',
  '0.030em 0.063em 0 #a7a69c',
  '0.033em 0.070em 0 #9e9d93',
  '0.036em 0.077em 0 #96958a',
  '0.039em 0.084em 0 #8d8c80',
  '0.042em 0.090em 0 #848377',
  '0.045em 0.096em 0 #7c7b6f',
  '0.048em 0.102em 0 #747367',
].join(', ');

const H1_FACE_SHADOW = [
  '0 0 0.08em rgba(255, 215, 0, 0.4)',
  '0 0 0.2em rgba(255, 215, 0, 0.25)',
  EXTRUSION_SHADOWS,
].join(', ');

const H2_FACE_SHADOW = [
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

// ── H1 Two Layers Deep ───────────────────────────────────────────────

const H1_TWO_LAYERS = [
  { color: '#e6ac00', tx: '0.022em', ty: '0.065em', stroke: '0.16em' },  // farthest (gold, bright)
  { color: '#191818', tx: '0em', ty: '0em', stroke: '0.22em' },           // nearest (dark, bolder)
];

function H1TwoLayersDeep({ children }: { children: string }) {
  const text = altGlyphs(children);
  const persp = (tx: string, ty: string) =>
    `perspective(800px) rotateX(12deg) rotateY(-2deg) translate(${tx}, ${ty})`;
  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '100%', overflow: 'visible' }}>
      <div aria-hidden="true" style={{ userSelect: 'none', position: 'absolute', inset: 0 }}>
        {/* Shadow blur */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          pointerEvents: 'none', margin: 0, lineHeight: 1.1, ...FONT_STYLE,
          fontSize: H1_SIZE, color: 'rgba(184, 150, 10, 0.5)', textShadow: 'none',
          transform: persp('0.025em', '0.07em'), filter: 'blur(6px)',
        }}>{text}</div>
        {/* 2 stroked layers */}
        {H1_TWO_LAYERS.map((layer, i) => (
          <div key={i} style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            pointerEvents: 'none', margin: 0, lineHeight: 1.1, ...FONT_STYLE,
            fontSize: H1_SIZE, color: layer.color,
            WebkitTextStroke: layer.stroke + ' ' + layer.color,
            WebkitTextFillColor: layer.color,
            paintOrder: 'stroke fill', textShadow: 'none',
            transform: persp(layer.tx, layer.ty),
          }}>{text}</div>
        ))}
      </div>
      <h1 style={{
        margin: 0, lineHeight: 1.1, ...FONT_STYLE, fontSize: H1_SIZE,
        color: '#f2f1ec', textShadow: H1_FACE_SHADOW,
        transform: persp('-0.04em', '-0.08em'),
        position: 'relative', overflow: 'visible',
      }}>{text}</h1>
    </div>
  );
}

// ── H2 Two Layers Deep ───────────────────────────────────────────────

const H2_TWO_LAYERS = [
  { color: '#444444', tx: '0.022em', ty: '0.065em', stroke: '0.10em' },  // farthest (brightest, deeper)
  { color: '#1a1a1a', tx: '0em', ty: '0em', stroke: '0.16em' },           // nearest (darkest, bolder)
];

function H2TwoLayersDeep({ children }: { children: string }) {
  const text = altGlyphs(children);
  const persp = (tx: string, ty: string) =>
    `perspective(800px) rotateX(8deg) rotateY(-1.5deg) translate(${tx}, ${ty})`;
  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '100%', overflow: 'visible', textAlign: 'center' }}>
      <div aria-hidden="true" style={{ userSelect: 'none' }}>
        {/* Shadow blur */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          pointerEvents: 'none', textAlign: 'center', lineHeight: 1.1, ...FONT_STYLE,
          fontSize: H2_SIZE, color: 'rgba(64, 64, 64, 0.4)', textShadow: 'none',
          transform: persp('0.025em', '0.07em'), filter: 'blur(4px)',
        }}>{text}</div>
        {/* 2 stroked layers */}
        {H2_TWO_LAYERS.map((layer, i) => (
          <div key={i} style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            pointerEvents: 'none', textAlign: 'center', lineHeight: 1.1, ...FONT_STYLE,
            fontSize: H2_SIZE, color: layer.color,
            WebkitTextStroke: layer.stroke + ' ' + layer.color,
            WebkitTextFillColor: layer.color,
            paintOrder: 'stroke fill', textShadow: 'none',
            transform: persp(layer.tx, layer.ty),
          }}>{text}</div>
        ))}
      </div>
      <h2 style={{
        textAlign: 'center', ...FONT_STYLE, fontSize: H2_SIZE,
        marginTop: 0, marginBottom: 0, lineHeight: 1.1,
        color: '#e5e4dd', textShadow: H2_FACE_SHADOW,
        transform: persp('-0.025em', '-0.055em'),
        position: 'relative', overflow: 'visible',
      }}>{text}</h2>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────

function Label({ children, desc }: { children: string; desc: string }) {
  return (
    <>
      <h2 style={{ fontFamily: 'sans-serif', fontSize: '18px', color: '#ffd700', marginBottom: '8px', letterSpacing: '0.1em' }}>
        {children}
      </h2>
      <p style={{ fontFamily: 'sans-serif', fontSize: '13px', color: '#888', marginBottom: '20px' }}>
        {desc}
      </p>
    </>
  );
}

export default function HeadingTestPage() {
  return (
    <div style={{ background: '#191818', minHeight: '100vh', padding: '60px 40px', color: '#e5e4dd' }}>

      <Label desc="2 stroked layers (farthest gold 0.10em + nearest dark 0.16em bolder), deeper offsets. 4 total elements.">
        H1 TWO LAYERS DEEP
      </Label>
      <H1TwoLayersDeep>SMART AGENT ALLIANCE</H1TwoLayersDeep>

      <div style={{ height: '100px' }} />

      <Label desc="2 stroked layers (farthest 0.10em + nearest 0.16em bolder), deeper offsets. 4 total elements.">
        H2 TWO LAYERS DEEP
      </Label>
      <H2TwoLayersDeep>PREMIUM AGENT NETWORK</H2TwoLayersDeep>

    </div>
  );
}
