'use client';

import React from 'react';

interface WeightSelectorProps {
  value: number;
  onChange: (weight: number) => void;
  className?: string;
}

const FONT_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900];

export const WeightSelector: React.FC<WeightSelectorProps> = ({
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-medium text-[#e5e4dd]">
        Font Weight
      </label>
      <div className="flex flex-wrap gap-2">
        {FONT_WEIGHTS.map((weight) => (
          <button
            key={weight}
            type="button"
            onClick={() => onChange(weight)}
            className={`px-3 py-1.5 text-sm rounded-md transition-all duration-200
                       ${
                         value === weight
                           ? 'bg-[#00ff88] text-[#191818] font-semibold shadow-lg shadow-[#00ff88]/20'
                           : 'bg-[#404040]/50 text-[#dcdbd5] hover:bg-[#404040] hover:border-[#00ff88]/50 border border-[#404040]'
                       }`}
            style={{ fontWeight: weight }}
          >
            {weight}
          </button>
        ))}
      </div>
    </div>
  );
};
