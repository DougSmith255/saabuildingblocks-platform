'use client';

/**
 * Glass Tint & Texture Test Page
 * 15 variations with different brand colors and internal textures
 */

const BRAND_YELLOW = '#ffd700';

// 15 different color + texture combinations
const GLASS_VARIATIONS = [
  {
    id: 1,
    name: 'Pure Gold',
    color: { r: 255, g: 215, b: 0 },
    colorOpacity: 0.04,
    borderOpacity: 0.12,
    texture: 'noise',
    textureOpacity: 0.03,
    noiseFrequency: 0.9,
  },
  {
    id: 2,
    name: 'Warm Amber',
    color: { r: 255, g: 170, b: 0 },
    colorOpacity: 0.045,
    borderOpacity: 0.12,
    texture: 'noise',
    textureOpacity: 0.05,
    noiseFrequency: 0.7,
  },
  {
    id: 3,
    name: 'Deep Orange',
    color: { r: 255, g: 140, b: 0 },
    colorOpacity: 0.05,
    borderOpacity: 0.12,
    texture: 'noise',
    textureOpacity: 0.02,
    noiseFrequency: 1.2,
  },
  {
    id: 4,
    name: 'Copper Bronze',
    color: { r: 205, g: 150, b: 80 },
    colorOpacity: 0.05,
    borderOpacity: 0.15,
    texture: 'noise',
    textureOpacity: 0.04,
    noiseFrequency: 0.5,
  },
  {
    id: 5,
    name: 'Honey Gold',
    color: { r: 255, g: 200, b: 50 },
    colorOpacity: 0.035,
    borderOpacity: 0.10,
    texture: 'crosshatch',
    textureOpacity: 0.03,
    noiseFrequency: 0.8,
  },
  {
    id: 6,
    name: 'Sunset Orange',
    color: { r: 255, g: 120, b: 30 },
    colorOpacity: 0.04,
    borderOpacity: 0.14,
    texture: 'noise',
    textureOpacity: 0.06,
    noiseFrequency: 0.4,
  },
  {
    id: 7,
    name: 'Champagne',
    color: { r: 247, g: 231, b: 206 },
    colorOpacity: 0.06,
    borderOpacity: 0.08,
    texture: 'dots',
    textureOpacity: 0.04,
    noiseFrequency: 1.5,
  },
  {
    id: 8,
    name: 'Antique Gold',
    color: { r: 180, g: 140, b: 40 },
    colorOpacity: 0.055,
    borderOpacity: 0.15,
    texture: 'noise',
    textureOpacity: 0.07,
    noiseFrequency: 0.3,
  },
  {
    id: 9,
    name: 'Light Gold',
    color: { r: 255, g: 230, b: 100 },
    colorOpacity: 0.03,
    borderOpacity: 0.08,
    texture: 'lines',
    textureOpacity: 0.025,
    noiseFrequency: 2.0,
  },
  {
    id: 10,
    name: 'Burnt Sienna',
    color: { r: 200, g: 100, b: 30 },
    colorOpacity: 0.045,
    borderOpacity: 0.12,
    texture: 'noise',
    textureOpacity: 0.035,
    noiseFrequency: 0.6,
  },
  {
    id: 11,
    name: 'Peach Gold',
    color: { r: 255, g: 180, b: 100 },
    colorOpacity: 0.04,
    borderOpacity: 0.10,
    texture: 'grain',
    textureOpacity: 0.08,
    noiseFrequency: 1.0,
  },
  {
    id: 12,
    name: 'Marigold',
    color: { r: 255, g: 190, b: 0 },
    colorOpacity: 0.038,
    borderOpacity: 0.11,
    texture: 'noise',
    textureOpacity: 0.015,
    noiseFrequency: 1.8,
  },
  {
    id: 13,
    name: 'Warm Bronze',
    color: { r: 180, g: 120, b: 60 },
    colorOpacity: 0.06,
    borderOpacity: 0.14,
    texture: 'sandpaper',
    textureOpacity: 0.05,
    noiseFrequency: 0.35,
  },
  {
    id: 14,
    name: 'Cream Gold',
    color: { r: 255, g: 235, b: 180 },
    colorOpacity: 0.05,
    borderOpacity: 0.06,
    texture: 'noise',
    textureOpacity: 0.01,
    noiseFrequency: 2.5,
  },
  {
    id: 15,
    name: 'Rose Gold',
    color: { r: 230, g: 150, b: 120 },
    colorOpacity: 0.045,
    borderOpacity: 0.12,
    texture: 'canvas',
    textureOpacity: 0.04,
    noiseFrequency: 0.55,
  },
];

// Different texture patterns
function getTextureStyle(texture: string, opacity: number, frequency: number) {
  switch (texture) {
    case 'crosshatch':
      return {
        backgroundImage: `
          repeating-linear-gradient(45deg, rgba(255,255,255,${opacity}) 0px, transparent 1px, transparent 3px),
          repeating-linear-gradient(-45deg, rgba(255,255,255,${opacity}) 0px, transparent 1px, transparent 3px)
        `,
        backgroundSize: '8px 8px',
      };
    case 'dots':
      return {
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,${opacity * 2}) 1px, transparent 1px)`,
        backgroundSize: `${Math.round(12 / frequency)}px ${Math.round(12 / frequency)}px`,
      };
    case 'lines':
      return {
        backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,${opacity}) 0px, transparent 1px, transparent ${Math.round(6 / frequency)}px)`,
      };
    case 'grain':
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${frequency * 1.5}' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        opacity: opacity,
        mixBlendMode: 'overlay' as const,
      };
    case 'sandpaper':
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='turbulence' baseFrequency='${frequency}' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        opacity: opacity * 1.5,
        mixBlendMode: 'overlay' as const,
      };
    case 'canvas':
      return {
        backgroundImage: `
          url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${frequency}' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"),
          repeating-linear-gradient(0deg, rgba(255,255,255,${opacity * 0.3}) 0px, transparent 1px, transparent 4px)
        `,
        opacity: opacity,
        mixBlendMode: 'overlay' as const,
      };
    case 'noise':
    default:
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${frequency}' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        opacity: opacity,
        mixBlendMode: 'overlay' as const,
      };
  }
}

function GlassPanel({ variation }: { variation: typeof GLASS_VARIATIONS[0] }) {
  const { r, g, b } = variation.color;
  const textureStyle = getTextureStyle(variation.texture, variation.textureOpacity, variation.noiseFrequency);

  return (
    <div className="relative rounded-3xl overflow-hidden" style={{ minHeight: '200px' }}>
      {/* Corner fill gradients */}
      <div className="absolute top-0 left-0 w-12 h-12 pointer-events-none z-0" style={{ background: 'radial-gradient(circle at top left, #080808 0%, transparent 70%)' }} />
      <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none z-0" style={{ background: 'radial-gradient(circle at top right, #080808 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 w-12 h-12 pointer-events-none z-0" style={{ background: 'radial-gradient(circle at bottom left, #080808 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none z-0" style={{ background: 'radial-gradient(circle at bottom right, #080808 0%, transparent 70%)' }} />

      {/* Glass plate */}
      <div
        className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden z-[1]"
        style={{
          background: `linear-gradient(180deg, rgba(${r},${g},${b},${variation.colorOpacity * 0.8}) 0%, rgba(${r},${g},${b},${variation.colorOpacity}) 50%, rgba(${r},${g},${b},${variation.colorOpacity * 0.8}) 100%)`,
          borderTop: `1px solid rgba(${r},${g},${b},${variation.borderOpacity})`,
          borderBottom: '2px solid rgba(0,0,0,0.6)',
          boxShadow: `
            inset 0 1px 0 rgba(${r},${g},${b},${variation.borderOpacity * 0.7}),
            inset 0 2px 4px rgba(${r},${g},${b},${variation.colorOpacity * 0.8}),
            inset 0 -2px 0 rgba(0,0,0,0.4),
            inset 0 -4px 8px rgba(0,0,0,0.2),
            0 4px 12px rgba(0,0,0,0.3)
          `,
          backdropFilter: 'blur(2px)',
        }}
      >
        {/* Texture overlay */}
        <div
          className="absolute inset-0"
          style={textureStyle}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 text-center">
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
          style={{ backgroundColor: `rgba(${r},${g},${b},0.3)`, color: `rgb(${Math.min(r + 30, 255)},${Math.min(g + 30, 255)},${Math.min(b + 30, 255)})` }}
        >
          #{variation.id}
        </div>
        <h3 className="font-heading text-xl font-bold mb-2" style={{ color: `rgb(${r},${g},${b})` }}>
          {variation.name}
        </h3>
        <div className="text-body text-xs space-y-1 opacity-70">
          <p>Color: rgb({r},{g},{b}) @ {(variation.colorOpacity * 100).toFixed(1)}%</p>
          <p>Border: {(variation.borderOpacity * 100).toFixed(0)}% opacity</p>
          <p>Texture: {variation.texture}</p>
          <p>Texture opacity: {(variation.textureOpacity * 100).toFixed(1)}%</p>
          <p>Noise frequency: {variation.noiseFrequency}</p>
        </div>
      </div>
    </div>
  );
}

export default function GlassTestPage() {
  return (
    <main className="min-h-screen bg-[#080808] py-12 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND_YELLOW }}>
          Glass Tint & Texture Test
        </h1>
        <p className="text-body opacity-70 max-w-2xl mx-auto">
          15 variations with different brand-aligned colors and internal textures. Each panel shows a unique combination of tint color, opacity levels, and texture patterns.
        </p>
      </div>

      {/* Grid of variations */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GLASS_VARIATIONS.map((variation) => (
          <GlassPanel key={variation.id} variation={variation} />
        ))}
      </div>

      {/* Legend */}
      <div className="max-w-4xl mx-auto mt-12 p-6 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 className="font-heading text-lg font-bold mb-4" style={{ color: BRAND_YELLOW }}>Texture Types</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-body text-sm">
          <div>
            <span className="font-bold text-white/80">noise</span>
            <p className="opacity-60">Standard fractal noise grain</p>
          </div>
          <div>
            <span className="font-bold text-white/80">crosshatch</span>
            <p className="opacity-60">45° crossed lines</p>
          </div>
          <div>
            <span className="font-bold text-white/80">dots</span>
            <p className="opacity-60">Repeating dot pattern</p>
          </div>
          <div>
            <span className="font-bold text-white/80">lines</span>
            <p className="opacity-60">Vertical scan lines</p>
          </div>
          <div>
            <span className="font-bold text-white/80">grain</span>
            <p className="opacity-60">Heavy film grain</p>
          </div>
          <div>
            <span className="font-bold text-white/80">sandpaper</span>
            <p className="opacity-60">Coarse turbulence</p>
          </div>
          <div>
            <span className="font-bold text-white/80">canvas</span>
            <p className="opacity-60">Fabric-like texture</p>
          </div>
        </div>
      </div>
    </main>
  );
}
