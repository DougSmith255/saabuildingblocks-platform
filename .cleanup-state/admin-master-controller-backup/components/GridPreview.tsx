'use client';

import { useEffect, useState } from 'react';
import { useSpacingStore } from '../stores/spacingStore';
import { generateClamp } from '../lib/clampCalculator';

export function GridPreview() {
  const { settings } = useSpacingStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-64 bg-[#404040] rounded-lg animate-pulse" />
    );
  }

  // Additional safety check for SSR
  if (!settings || !settings.gridGap || settings.gridMinWidth === undefined) {
    return (
      <div className="h-64 bg-[#404040] rounded-lg flex items-center justify-center">
        <div className="text-[#dcdbd5]">Loading grid preview...</div>
      </div>
    );
  }

  const gridGapClamp = generateClamp(settings.gridGap);
  const gridMinWidth = settings.gridMinWidth;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#e5e4dd]">
          Live Grid Preview
        </h3>
        <div className="text-xs font-mono text-[#dcdbd5]">
          Gap: {gridGapClamp}
        </div>
      </div>

      <div className="p-6 bg-[#191818] rounded-lg border border-[#404040]">
        <div
          className="grid transition-all duration-300"
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(${gridMinWidth}px, 1fr))`,
            gap: gridGapClamp,
          }}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-lg shadow-md flex items-center justify-center text-[#191818] font-semibold transition-all duration-300 hover:scale-105 hover:from-[#ffd700] hover:to-[#D4AF37]"
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Grid Info */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="p-3 bg-[#191818] rounded-lg border border-[#404040]">
          <div className="text-xs text-[#dcdbd5] mb-1">
            Grid Template
          </div>
          <code className="text-xs font-mono text-[#e5e4dd]">
            repeat(auto-fit, minmax({gridMinWidth}px, 1fr))
          </code>
        </div>
        <div className="p-3 bg-[#191818] rounded-lg border border-[#404040]">
          <div className="text-xs text-[#dcdbd5] mb-1">
            Grid Gap
          </div>
          <code className="text-xs font-mono text-[#e5e4dd]">
            {gridGapClamp}
          </code>
        </div>
      </div>

      {/* Resize Info */}
      <div className="p-4 bg-[#191818] rounded-lg border border-[#ffd700]/50">
        <div className="flex items-start gap-2">
          <svg
            className="w-5 h-5 text-[#ffd700] mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm text-[#e5e4dd]">
            <div className="font-semibold mb-1">Responsive Grid Behavior</div>
            <div className="text-[#dcdbd5]">
              Resize your browser to see the grid automatically adjust column count
              while maintaining the {gridMinWidth}px minimum width. The gap spacing
              will also scale fluidly.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
