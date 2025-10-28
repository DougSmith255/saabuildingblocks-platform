'use client';

import React, { useMemo } from 'react';
import { useTypographyStore } from '../stores/typographyStore';
import { useBrandColorsStore } from '../stores/brandColorsStore';
import { SliderControl } from './SliderControl';
import { WeightSelector } from './WeightSelector';
import { FontFamilySelector } from './FontFamilySelector';
import { FontStyleSelector } from './FontStyleSelector';
import { ColorSelector } from './ColorSelector';
import { calculateContrast, getContrastRating, type ContrastRating } from '../lib/colorUtils';
import type { TextType } from '../types';

interface TextTypeCardProps {
  textType: TextType;
}

const TEXT_TYPE_LABELS: Record<TextType, string> = {
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  body: 'Body Text',
  quote: 'Quote',
  link: 'Link',
  button: 'Button',
};

// Inline ContrastIndicator Component
interface ContrastIndicatorProps {
  textColor: string;
  bgColor: string;
  textType: TextType;
}

const ContrastIndicator: React.FC<ContrastIndicatorProps> = ({ textColor, bgColor, textType }) => {
  const contrastRatio = useMemo(() => calculateContrast(textColor, bgColor), [textColor, bgColor]);
  const rating = useMemo(() => getContrastRating(contrastRatio), [contrastRatio]);

  // Large text (18pt+ or 14pt+ bold) has lower requirements (3:1 for AA)
  const isLargeText = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'quote'].includes(textType);
  const minRatio = isLargeText ? 3.0 : 4.5;

  const getRatingColor = (rating: ContrastRating): string => {
    switch (rating) {
      case 'AAA':
        return 'text-green-700 bg-green-100 border-green-300';
      case 'AA':
        return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'Fail':
        return 'text-red-700 bg-red-100 border-red-300';
    }
  };

  const getRatingIcon = (rating: ContrastRating): string => {
    switch (rating) {
      case 'AAA':
        return '✅';
      case 'AA':
        return '⚠️';
      case 'Fail':
        return '❌';
    }
  };

  const getWarningMessage = (): string | null => {
    if (contrastRatio < minRatio) {
      return `Contrast too low! Needs ${minRatio}:1 for WCAG AA compliance. Current: ${contrastRatio.toFixed(2)}:1`;
    }
    return null;
  };

  const warningMessage = getWarningMessage();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#dcdbd5]">Contrast Ratio:</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#dcdbd5] font-mono">{contrastRatio.toFixed(2)}:1</span>
          <span className={`px-2 py-0.5 rounded border text-xs font-medium ${getRatingColor(rating)}`}>
            {getRatingIcon(rating)} {rating}
          </span>
        </div>
      </div>

      {warningMessage && (
        <div className="p-2 rounded bg-red-900/20 border border-red-500/30">
          <p className="text-xs text-red-400 flex items-start gap-2">
            <span className="flex-shrink-0">❌</span>
            <span>{warningMessage}</span>
          </p>
        </div>
      )}

      {!warningMessage && rating === 'AA' && (
        <div className="p-2 rounded bg-yellow-900/20 border border-yellow-500/30">
          <p className="text-xs text-yellow-400 flex items-start gap-2">
            <span className="flex-shrink-0">⚠️</span>
            <span>Meets WCAG AA (minimum). Consider AAA (7:1) for better accessibility.</span>
          </p>
        </div>
      )}

      {rating === 'AAA' && (
        <div className="p-2 rounded bg-green-900/20 border border-green-500/30">
          <p className="text-xs text-green-400 flex items-start gap-2">
            <span className="flex-shrink-0">✅</span>
            <span>Excellent contrast! Meets WCAG AAA standards.</span>
          </p>
        </div>
      )}
    </div>
  );
};

export const TextTypeCard: React.FC<TextTypeCardProps> = ({ textType }) => {
  const { settings, updateTextType } = useTypographyStore();
  const { settings: brandColors } = useBrandColorsStore();
  const config = settings[textType];

  // Early return if config not loaded (SSR/static generation)
  if (!config || !config.size) {
    return (
      <div className="p-6 rounded-lg bg-[#404040]/30 border border-[#404040] shadow-lg">
        <div className="text-center text-[#dcdbd5]">Loading typography settings...</div>
      </div>
    );
  }

  const handleMinChange = (min: number) => {
    updateTextType(textType, {
      size: { ...config.size, min },
    });
  };

  const handleMaxChange = (max: number) => {
    updateTextType(textType, {
      size: { ...config.size, max },
    });
  };

  const handleWeightChange = (fontWeight: number) => {
    updateTextType(textType, { fontWeight });
  };

  const handleFontFamilyChange = (fontFamily: string) => {
    updateTextType(textType, { fontFamily });
  };

  const handleFontStyleChange = (fontStyle: 'normal' | 'italic' | 'oblique') => {
    updateTextType(textType, { fontStyle });
  };

  const handleColorChange = (color: string) => {
    updateTextType(textType, { color });
  };

  // Get the actual hex color value from the brand colors
  const getColorValue = () => {
    const colorKey = config.color as keyof typeof brandColors;
    return brandColors[colorKey] || brandColors.bodyText;
  };

  return (
    <div className="p-6 rounded-lg bg-[#404040]/30 border border-[#404040] shadow-lg hover:shadow-xl hover:shadow-[#00ff88]/5 transition-all">
      {/* Header */}
      <div className="mb-4 pb-4 border-b border-[#404040]">
        <h3 className="text-lg font-semibold text-[#e5e4dd] mb-2">
          {TEXT_TYPE_LABELS[textType]}
        </h3>

        {/* Live Preview */}
        <div className={`text-${textType} transition-all duration-200`} style={{
          fontFamily: config.fontFamily,
          fontWeight: config.fontWeight,
          lineHeight: config.lineHeight,
          letterSpacing: `${config.letterSpacing}em`,
          fontSize: `clamp(${config.size.min}px, 2vw, ${config.size.max}px)`,
          fontStyle: config.fontStyle || 'normal',
          color: getColorValue()
        }}>
          The quick brown fox jumps over the lazy dog
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Font Size */}
        <div className="space-y-3">
          <SliderControl
            label="Min Size"
            value={config.size.min}
            min={12}
            max={120}
            step={1}
            unit="px"
            onChange={handleMinChange}
          />
          <SliderControl
            label="Max Size"
            value={config.size.max}
            min={12}
            max={120}
            step={1}
            unit="px"
            onChange={handleMaxChange}
          />
        </div>

        {/* Color Selector */}
        <ColorSelector value={config.color} onChange={handleColorChange} />

        {/* WCAG Contrast Validation - NEW */}
        <div className="pt-3 border-t border-[#404040]">
          <ContrastIndicator
            textColor={getColorValue()}
            bgColor={brandColors.darkGray}
            textType={textType}
          />
        </div>

        {/* Font Weight */}
        <WeightSelector value={config.fontWeight} onChange={handleWeightChange} />

        {/* Font Family */}
        <FontFamilySelector value={config.fontFamily} onChange={handleFontFamilyChange} />

        {/* Font Style */}
        <FontStyleSelector value={config.fontStyle} onChange={handleFontStyleChange} />
      </div>
    </div>
  );
};
