'use client';

import React from 'react';

interface TypographyViewportSliderProps {
  value: number; // 0-100 percentage
  onChange: (value: number) => void;
  minViewport: number;
  maxViewport: number;
}

export const TypographyViewportSlider: React.FC<TypographyViewportSliderProps> = ({
  value,
  onChange,
  minViewport,
  maxViewport,
}) => {
  // Calculate current viewport size based on slider value
  const currentViewport = minViewport + (maxViewport - minViewport) * (value / 100);

  return (
    <div className="p-6 rounded-lg bg-[#404040]/30 border border-[#00ff88]/30 shadow-lg">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-lg font-semibold text-[#e5e4dd]">
              📐 Preview Viewport Size
            </h3>
            <p className="text-sm text-[#dcdbd5]/70 mt-1">
              Simulate how typography scales across different screen sizes
            </p>
          </div>

          {/* Current Size Indicators */}
          <div className="flex items-center gap-4">
            <div className="px-3 py-1.5 rounded-md bg-[#00ff88]/10 border border-[#00ff88]/30">
              <span className="text-[#00ff88] font-mono font-semibold">
                {Math.round(currentViewport)}px
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-md bg-[#ffd700]/10 border border-[#ffd700]/30">
              <span className="text-[#ffd700] font-mono font-semibold">
                {value}%
              </span>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-[#dcdbd5]/60">
            <span>Min ({minViewport}px)</span>
            <span>Viewport Simulator</span>
            <span>Max ({maxViewport}px)</span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-3 bg-gradient-to-r from-[#404040]/50 via-[#00ff88]/20 to-[#404040]/50 rounded-lg appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-5
                     [&::-webkit-slider-thumb]:h-5
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-[#00ff88]
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:transition-all
                     [&::-webkit-slider-thumb]:hover:scale-125
                     [&::-webkit-slider-thumb]:shadow-xl
                     [&::-webkit-slider-thumb]:shadow-[#00ff88]/50
                     [&::-webkit-slider-thumb]:border-2
                     [&::-webkit-slider-thumb]:border-[#191818]
                     [&::-moz-range-thumb]:w-5
                     [&::-moz-range-thumb]:h-5
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:bg-[#00ff88]
                     [&::-moz-range-thumb]:border-2
                     [&::-moz-range-thumb]:border-[#191818]
                     [&::-moz-range-thumb]:cursor-pointer
                     [&::-moz-range-thumb]:transition-all
                     [&::-moz-range-thumb]:hover:scale-125"
          />
        </div>

        {/* Device Breakpoint Indicators */}
        <div className="flex justify-between items-center text-xs pt-2">
          <button
            onClick={() => onChange(0)}
            className="px-2 py-1 rounded bg-[#404040]/50 hover:bg-[#00ff88]/10 text-[#dcdbd5]/70 hover:text-[#00ff88] transition-all"
          >
            📱 Mobile
          </button>
          <button
            onClick={() => onChange(25)}
            className="px-2 py-1 rounded bg-[#404040]/50 hover:bg-[#00ff88]/10 text-[#dcdbd5]/70 hover:text-[#00ff88] transition-all"
          >
            📱 Tablet
          </button>
          <button
            onClick={() => onChange(50)}
            className="px-2 py-1 rounded bg-[#404040]/50 hover:bg-[#00ff88]/10 text-[#dcdbd5]/70 hover:text-[#00ff88] transition-all"
          >
            💻 Laptop
          </button>
          <button
            onClick={() => onChange(75)}
            className="px-2 py-1 rounded bg-[#404040]/50 hover:bg-[#00ff88]/10 text-[#dcdbd5]/70 hover:text-[#00ff88] transition-all"
          >
            🖥️ Desktop
          </button>
          <button
            onClick={() => onChange(100)}
            className="px-2 py-1 rounded bg-[#404040]/50 hover:bg-[#00ff88]/10 text-[#dcdbd5]/70 hover:text-[#00ff88] transition-all"
          >
            🖥️ 4K
          </button>
        </div>

        {/* Info */}
        <div className="pt-3 border-t border-[#404040]">
          <p className="text-xs text-[#dcdbd5]/60">
            💡 <strong className="text-[#ffd700]">Tip:</strong> Use this slider to preview how text scales at different viewport sizes. The typography examples below will update in real-time to show the actual font size at the selected viewport.
          </p>
        </div>
      </div>
    </div>
  );
};
