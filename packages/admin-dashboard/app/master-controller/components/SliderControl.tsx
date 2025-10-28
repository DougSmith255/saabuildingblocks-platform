'use client';

import React from 'react';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
  className?: string;
}

export const SliderControl: React.FC<SliderControlProps> = ({
  label,
  value,
  min,
  max,
  step,
  unit = '',
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-[#e5e4dd]">
          {label}
        </label>
        <span className="text-sm font-mono text-[#00ff88]">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-[#404040]/50 rounded-lg appearance-none cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:w-4
                   [&::-webkit-slider-thumb]:h-4
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-[#00ff88]
                   [&::-webkit-slider-thumb]:cursor-pointer
                   [&::-webkit-slider-thumb]:transition-all
                   [&::-webkit-slider-thumb]:hover:scale-110
                   [&::-webkit-slider-thumb]:shadow-lg
                   [&::-webkit-slider-thumb]:shadow-[#00ff88]/30
                   [&::-moz-range-thumb]:w-4
                   [&::-moz-range-thumb]:h-4
                   [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:bg-[#00ff88]
                   [&::-moz-range-thumb]:border-0
                   [&::-moz-range-thumb]:cursor-pointer
                   [&::-moz-range-thumb]:transition-all
                   [&::-moz-range-thumb]:hover:scale-110"
      />
    </div>
  );
};
