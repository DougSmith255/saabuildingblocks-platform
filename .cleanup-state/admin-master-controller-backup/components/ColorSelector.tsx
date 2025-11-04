'use client';

import React from 'react';
import { useBrandColorsStore } from '../stores/brandColorsStore';
import type { ColorName } from '../types';

interface ColorSelectorProps {
  value: ColorName; // Current color reference (e.g., 'headingText')
  onChange: (colorName: ColorName) => void;
}

const COLOR_LABELS: Record<ColorName, string> = {
  accentGreen: 'Accent Green',
  brandGold: 'Brand Gold',
  headingText: 'Heading Text',
  bodyText: 'Body Text',
  darkGray: 'Dark Gray',
  mediumGray: 'Medium Gray',
};

export const ColorSelector: React.FC<ColorSelectorProps> = ({ value, onChange }) => {
  const { settings: brandColors } = useBrandColorsStore();

  const colorEntries: Array<[ColorName, string]> = [
    ['accentGreen', brandColors.accentGreen],
    ['brandGold', brandColors.brandGold],
    ['headingText', brandColors.headingText],
    ['bodyText', brandColors.bodyText],
    ['darkGray', brandColors.darkGray],
    ['mediumGray', brandColors.mediumGray],
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#e5e4dd]">
        Text Color
      </label>

      <div className="flex flex-wrap gap-3">
        {colorEntries.map(([colorName, hexValue]) => {
          const isActive = value === colorName;

          return (
            <button
              key={colorName}
              onClick={() => onChange(colorName)}
              className={`
                group relative flex flex-col items-center gap-1.5
                transition-all duration-200
              `}
              title={COLOR_LABELS[colorName]}
            >
              {/* Color Swatch */}
              <div
                className={`
                  w-10 h-10 rounded-full
                  border-2 transition-all duration-200
                  ${isActive
                    ? 'border-[#00ff88] scale-110 shadow-lg shadow-[#00ff88]/30'
                    : 'border-[#404040] hover:scale-110 hover:border-[#00ff88]/50'
                  }
                `}
                style={{ backgroundColor: hexValue }}
              />

              {/* Color Name Label */}
              <span className={`
                text-[10px] font-medium transition-colors duration-200
                ${isActive ? 'text-[#00ff88]' : 'text-[#dcdbd5] group-hover:text-[#e5e4dd]'}
              `}>
                {COLOR_LABELS[colorName].split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
