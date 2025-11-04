'use client';

import React from 'react';

interface FontStyleSelectorProps {
  value?: 'normal' | 'italic';
  onChange: (fontStyle: 'normal' | 'italic') => void;
}

const FONT_STYLES = [
  { value: 'normal' as const, label: 'Normal' },
  { value: 'italic' as const, label: 'Italic' },
];

export const FontStyleSelector: React.FC<FontStyleSelectorProps> = ({
  value = 'normal',
  onChange
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#e5e4dd]">
        Font Style
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as 'normal' | 'italic')}
        className="w-full px-3 py-2 bg-[#404040]/50 border border-[#404040] rounded-md text-[#dcdbd5] focus:outline-none focus:ring-2 focus:ring-[#00ff88] focus:border-transparent transition-all duration-200 hover:border-[#00ff88]/50"
      >
        {FONT_STYLES.map((style) => (
          <option
            key={style.value}
            value={style.value}
          >
            {style.label}
          </option>
        ))}
      </select>
    </div>
  );
};
