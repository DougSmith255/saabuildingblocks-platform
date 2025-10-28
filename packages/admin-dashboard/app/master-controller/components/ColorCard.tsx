'use client';

import { useState, useEffect } from 'react';
import { isValidHex } from '../lib/colorUtils';
import { useBrandColorsStore } from '../stores/brandColorsStore';
import type { ColorName } from '../types';

interface ColorCardProps {
  colorName: ColorName;
  label: string;
  description: string;
  usageExample: string;
}

export function ColorCard({ colorName, label, description, usageExample }: ColorCardProps) {
  const { settings, updateColor } = useBrandColorsStore();
  const currentColor = settings[colorName];
  const [hexInput, setHexInput] = useState(currentColor);
  const [isValid, setIsValid] = useState(true);

  // Sync hex input with store changes (from presets, etc.)
  useEffect(() => {
    setHexInput(currentColor);
    setIsValid(true);
  }, [currentColor]);

  const handleHexChange = (newValue: string) => {
    setHexInput(newValue);

    if (isValidHex(newValue)) {
      setIsValid(true);
      updateColor(colorName, newValue);
    } else {
      setIsValid(false);
    }
  };

  const handleColorPickerChange = (newValue: string) => {
    setHexInput(newValue);
    setIsValid(true);
    updateColor(colorName, newValue);
  };

  return (
    <div className="p-6 bg-[#191818] border border-[#404040] rounded-lg shadow-lg hover:shadow-xl hover:shadow-[#00ff88]/20 hover:border-[#00ff88]/50 transition-all duration-200">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#e5e4dd]">{label}</h3>
        {description && <p className="text-sm text-[#dcdbd5] mt-1">{description}</p>}
      </div>

      {/* Large Color Swatch */}
      <div
        className="w-full h-40 rounded-lg mb-4 border-2 border-[#404040] shadow-inner transition-colors duration-200"
        style={{ backgroundColor: currentColor }}
      />

      {/* Color Inputs */}
      <div className="space-y-3 mb-4">
        {/* Hex Input */}
        <div>
          <label className="block text-xs font-medium text-[#e5e4dd] mb-1">
            Hex Color Code
          </label>
          <input
            type="text"
            value={hexInput}
            onChange={(e) => handleHexChange(e.target.value)}
            className={`w-full px-3 py-2 font-mono text-sm border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${
              isValid
                ? 'bg-[#404040]/50 text-[#e5e4dd] border-[#404040] focus:ring-[#00ff88]/50 focus:border-[#00ff88]'
                : 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-950/20'
            }`}
            placeholder="#00ff88"
            spellCheck={false}
          />
          {!isValid && (
            <p className="text-xs text-red-400 mt-1">
              Invalid hex format. Use #RGB or #RRGGBB
            </p>
          )}
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-xs font-medium text-[#e5e4dd] mb-1">
            Color Picker
          </label>
          <input
            type="color"
            value={currentColor}
            onChange={(e) => handleColorPickerChange(e.target.value)}
            className="w-full h-12 rounded-md cursor-pointer border-2 border-[#404040] hover:border-[#00ff88] transition-all duration-200"
          />
        </div>
      </div>

      {/* Usage Example */}
      <div className="pt-4 border-t border-[#404040]">
        <p className="text-xs font-medium text-[#dcdbd5] mb-2">Usage Example:</p>
        <div
          className="px-4 py-3 rounded-md text-sm font-medium text-center transition-colors duration-200"
          style={{
            backgroundColor:
              colorName.includes('Background') || colorName.includes('Highlight')
                ? currentColor
                : 'transparent',
            color: colorName.includes('Text') || colorName.includes('Highlight') ? currentColor : '#666',
            border: colorName.includes('Text') ? `2px solid ${currentColor}` : 'none',
          }}
        >
          {usageExample}
        </div>
      </div>
    </div>
  );
}
