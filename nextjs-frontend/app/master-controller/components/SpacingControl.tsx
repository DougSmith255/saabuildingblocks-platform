'use client';

import { useSpacingStore } from '../stores/spacingStore';
import { generateClamp } from '../lib/clampCalculator';
import type { SpacingToken } from '../types';

interface SpacingControlProps {
  spacingToken: SpacingToken;
}

const SPACING_LABELS: Record<SpacingToken, string> = {
  containerPadding: 'Container Padding',
  gridGap: 'Grid Gap',
  sectionMargin: 'Section Margin',
};

export function SpacingControl({ spacingToken }: SpacingControlProps) {
  const { settings, updateSpacing } = useSpacingStore();
  const config = settings[spacingToken];

  // Early return if config not loaded (SSR/static generation)
  if (!config || config.min === undefined || config.max === undefined) {
    return (
      <div className="space-y-4 p-4 rounded-lg border border-[#404040] bg-[#191818]">
        <div className="text-center text-[#dcdbd5]">Loading spacing settings...</div>
      </div>
    );
  }

  const handleMinChange = (value: number) => {
    updateSpacing({
      [spacingToken]: { ...config, min: value },
    });
  };

  const handleMaxChange = (value: number) => {
    updateSpacing({
      [spacingToken]: { ...config, max: value },
    });
  };

  // Calculate values at key breakpoints
  const getValueAtViewport = (viewport: number): number => {
    const { min, max, viewportMin, viewportMax } = config;
    if (viewport <= viewportMin) return min;
    if (viewport >= viewportMax) return max;
    const ratio = (viewport - viewportMin) / (viewportMax - viewportMin);
    return Math.round(min + ratio * (max - min));
  };

  const breakpoints = [
    { name: 'Mobile', width: 300 },
    { name: 'Tablet', width: 768 },
    { name: 'Desktop', width: 1024 },
    { name: 'Wide', width: 2050 },
  ];

  return (
    <div className="space-y-4 p-4 rounded-lg border border-[#404040] bg-[#191818]">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#e5e4dd]">
          {SPACING_LABELS[spacingToken]}
        </h3>
        <div className="text-sm font-mono text-[#dcdbd5]">
          {generateClamp(config)}
        </div>
      </div>

      {/* Min Value Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-[#e5e4dd]">
            Minimum
          </label>
          <span className="text-sm font-mono text-[#dcdbd5]">
            {config.min}px
          </span>
        </div>
        <input
          type="range"
          min={8}
          max={200}
          step={1}
          value={config.min}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          className="w-full h-2 bg-[#404040] rounded-lg appearance-none cursor-pointer accent-[#ffd700]"
        />
      </div>

      {/* Max Value Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-[#e5e4dd]">
            Maximum
          </label>
          <span className="text-sm font-mono text-[#dcdbd5]">
            {config.max}px
          </span>
        </div>
        <input
          type="range"
          min={8}
          max={200}
          step={1}
          value={config.max}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          className="w-full h-2 bg-[#404040] rounded-lg appearance-none cursor-pointer accent-[#ffd700]"
        />
      </div>

      {/* Visual Preview */}
      <div className="pt-4 border-t border-[#404040]">
        <div className="text-xs text-[#dcdbd5] mb-2">
          Responsive Preview:
        </div>
        <div className="grid grid-cols-4 gap-2">
          {breakpoints.map((bp) => (
            <div key={bp.width} className="text-center">
              <div className="text-xs text-[#dcdbd5] mb-1">
                {bp.name}
              </div>
              <div
                className="mx-auto bg-[#ffd700] rounded transition-all duration-300"
                style={{
                  width: spacingToken === 'gridGap' ? '40px' : '60px',
                  height: `${Math.min(getValueAtViewport(bp.width) / 2, 40)}px`,
                }}
              />
              <div className="text-xs font-mono text-[#e5e4dd] mt-1">
                {getValueAtViewport(bp.width)}px
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ruler Visualization */}
      <div className="relative h-8 bg-[#404040] rounded overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-[#ffd700] transition-all duration-300 opacity-30"
          style={{ width: `${(config.min / 200) * 100}%` }}
        />
        <div
          className="absolute right-0 top-0 h-full bg-[#ffd700] transition-all duration-300 opacity-50"
          style={{ width: `${(config.max / 200) * 100}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-[#e5e4dd]">
          {config.min}px → {config.max}px
        </div>
      </div>
    </div>
  );
}
