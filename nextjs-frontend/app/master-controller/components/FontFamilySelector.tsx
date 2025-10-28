'use client';

import React from 'react';

interface FontFamilySelectorProps {
  value: string;
  onChange: (fontFamily: string) => void;
}

const FONT_FAMILIES = [
  { value: 'var(--font-taskor)', label: 'Taskor', display: 'Taskor, system-ui, sans-serif' },
  { value: 'var(--font-amulya)', label: 'Amulya', display: 'Amulya, Georgia, serif' },
  { value: 'var(--font-synonym)', label: 'Synonym', display: 'Synonym, monospace' },
];

export const FontFamilySelector: React.FC<FontFamilySelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#e5e4dd]">
        Font Family
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-[#404040]/50 border border-[#404040] rounded-md text-[#dcdbd5] focus:outline-none focus:ring-2 focus:ring-[#00ff88] focus:border-transparent transition-all duration-200 hover:border-[#00ff88]/50"
      >
        {FONT_FAMILIES.map((font) => (
          <option
            key={font.value}
            value={font.value}
            style={{ fontFamily: font.display }}
          >
            {font.label}
          </option>
        ))}
      </select>
    </div>
  );
};
