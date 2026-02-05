'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useTypographyStore } from '../../stores/typographyStore';
import { useBrandColorsStore } from '../../stores/brandColorsStore';
import { TextTypeCardWithPreview } from '../../components/TextTypeCardWithPreview';
import { TypographyViewportSlider } from '../../components/TypographyViewportSlider';
import { calculateContrast, getContrastRating } from '../../lib/colorUtils';
import { VIEWPORT_RANGE } from '../../lib/constants';
import type { TextType } from '../../types';

const TEXT_TYPES: TextType[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'quote', 'link', 'button', 'secondaryButton', 'tagline', 'caption', 'menuMainItem', 'menuSubItem'];

export const TypographyTab: React.FC = () => {
  const { settings, resetToDefaults } = useTypographyStore();
  const { settings: brandColors } = useBrandColorsStore();
  const [saveMessage, setSaveMessage] = useState<string>('');
  const [viewportSimulation, setViewportSimulation] = useState<number>(50); // 0-100 percentage, default 50%

  // Calculate global contrast overview
  const contrastOverview = useMemo(() => {
    // Early return if stores not ready
    if (!brandColors || !settings) {
      return { results: [], totalPassing: 0, totalFailing: 0, total: 0 };
    }

    const results = TEXT_TYPES.map((textType) => {
      const config = settings[textType];

      // Add null check for missing config
      if (!config || !config.color) {
        console.warn(`Typography config missing for ${textType}, using fallback values`);
        return {
          textType,
          contrastRatio: 0,
          rating: 'Fail' as const,
          passes: false
        };
      }

      const colorKey = config.color as keyof typeof brandColors;
      const textColor = brandColors[colorKey] || brandColors.bodyText || '#dcdbd5';
      const contrastRatio = calculateContrast(textColor, brandColors.darkGray);
      const rating = getContrastRating(contrastRatio);
      const isLargeText = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'quote'].includes(textType);
      const minRatio = isLargeText ? 3.0 : 4.5;
      const passes = contrastRatio >= minRatio;

      return { textType, contrastRatio, rating, passes };
    });

    const totalPassing = results.filter(r => r.passes).length;
    const totalFailing = results.filter(r => !r.passes).length;

    return { results, totalPassing, totalFailing, total: results.length };
  }, [settings, brandColors]);

  const handleReset = () => {
    resetToDefaults();
  };

  const handleSave = async () => {
    try {
      setSaveMessage('Saving to database...');

      const response = await fetch('/api/master-controller/typography', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });

      const result = await response.json();

      if (result.success) {
        setSaveMessage('✓ Settings saved to database successfully!');
      } else {
        setSaveMessage('❌ Failed to save: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Save error:', error);
      setSaveMessage('❌ Failed to save to database');
    }

    setTimeout(() => setSaveMessage(''), 3000);
  };

  // Set Taskor as the display font (permanent)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--font-display', 'Taskor, system-ui, sans-serif');
    }
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#404040]">
        <div>
          <h2 className="text-[clamp(1.5rem,1.5vw+0.5rem,1.875rem)] leading-[1.3] font-semibold text-[#e5e4dd]">
            Typography Settings
          </h2>
          <p className="text-[clamp(0.8125rem,0.125vw+0.75rem,0.875rem)] leading-[1.75] text-[#dcdbd5] mt-1">
            Configure fluid typography with responsive sizing
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Save Button */}
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md bg-[#00ff88] text-[#191818] font-medium text-sm leading-[1.5] tracking-[0.01em]
                     border border-[#00ff88]
                     hover:bg-[#00ff88]/90 hover:shadow-lg hover:shadow-[#00ff88]/30 transition-all"
          >
            💾 Save
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-md bg-[#404040]
                     text-[#dcdbd5] border border-[#404040]
                     hover:bg-[#00ff88]/5 hover:border-[#00ff88]/50 transition-all"
          >
            Reset to Defaults
          </button>

          {/* Save Message */}
          {saveMessage && (
            <span className="text-sm text-[#00ff88] font-medium animate-fade-in">
              {saveMessage}
            </span>
          )}
        </div>
      </div>

      {/* Viewport Simulation Slider */}
      <div className="mt-6">
        <TypographyViewportSlider
          value={viewportSimulation}
          onChange={setViewportSimulation}
          minViewport={VIEWPORT_RANGE.min}
          maxViewport={VIEWPORT_RANGE.max}
        />
      </div>

      {/* Grid of Text Type Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {TEXT_TYPES.map((textType) => {
          // Safety check: only render card if settings exist and are valid
          const config = settings[textType];
          if (!config || !config.size || typeof config?.size?.min !== 'number') {
            return (
              <div key={textType} className="p-6 rounded-lg bg-[#404040]/30 border border-[#404040] shadow-lg">
                <div className="text-center text-[#dcdbd5]">Loading {textType} settings...</div>
              </div>
            );
          }
          return (
            <TextTypeCardWithPreview
              key={textType}
              textType={textType}
              viewportSimulation={viewportSimulation}
            />
          );
        })}
      </div>

      {/* WCAG Contrast Compliance Overview */}
      <div className="mt-8 p-6 rounded-lg bg-[#404040]/30 border border-[#404040]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h3 className="text-[clamp(1.125rem,1vw+0.5rem,1.25rem)] leading-[1.3] font-semibold text-[#e5e4dd]">
              WCAG Contrast Compliance
            </h3>
            <p className="text-[clamp(0.8125rem,0.125vw+0.75rem,0.875rem)] leading-[1.75] text-[#dcdbd5] mt-1">
              Accessibility contrast ratio validation (WCAG AA standard)
            </p>
          </div>

          {/* Summary Badge */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-md bg-[#00ff88]/10 border border-[#00ff88]/30">
              <span className="text-[#00ff88] font-semibold text-lg">
                {contrastOverview.totalPassing}/{contrastOverview.total}
              </span>
              <span className="text-[#dcdbd5] text-sm ml-2">Pass</span>
            </div>
            {contrastOverview.totalFailing > 0 && (
              <div className="px-4 py-2 rounded-md bg-[#ff4444]/10 border border-[#ff4444]/30">
                <span className="text-[#ff4444] font-semibold text-lg">
                  {contrastOverview.totalFailing}
                </span>
                <span className="text-[#dcdbd5] text-sm ml-2">Fail</span>
              </div>
            )}
          </div>
        </div>

        {/* Contrast Results Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {contrastOverview.results.map(({ textType, contrastRatio, rating, passes }) => (
            <div
              key={textType}
              className={`p-3 rounded-md border transition-all ${
                passes
                  ? 'bg-[#00ff88]/5 border-[#00ff88]/30 hover:bg-[#00ff88]/10'
                  : 'bg-[#ff4444]/5 border-[#ff4444]/30 hover:bg-[#ff4444]/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#dcdbd5] font-medium text-sm uppercase">
                  {textType}
                </span>
                <span className="text-xl">
                  {passes ? '✓' : '⚠'}
                </span>
              </div>
              <div className="text-xs space-y-1">
                <div className={passes ? 'text-[#00ff88]' : 'text-[#ff4444]'}>
                  {contrastRatio.toFixed(2)}:1
                </div>
                <div className="text-[#dcdbd5]/60">
                  {rating}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Warning Message if any fail */}
        {contrastOverview.totalFailing > 0 && (
          <div className="mt-4 p-3 rounded-md bg-[#ffd700]/10 border border-[#ffd700]/30">
            <p className="text-[clamp(0.8125rem,0.125vw+0.75rem,0.875rem)] leading-[1.75] text-[#dcdbd5]">
              <strong className="text-[#ffd700] font-medium">⚠️ Warning:</strong>{' '}
              {contrastOverview.totalFailing} text type{contrastOverview.totalFailing > 1 ? 's' : ''} {contrastOverview.totalFailing > 1 ? 'do' : 'does'} not meet WCAG AA contrast requirements.
              Consider adjusting colors in the Brand Colors tab for better accessibility.
            </p>
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="mt-8 p-4 rounded-lg bg-[#ffd700]/10 border border-[#ffd700]/30">
        <p className="text-[clamp(0.8125rem,0.125vw+0.75rem,0.875rem)] leading-[1.75] text-[#dcdbd5]">
          <strong className="text-[#ffd700] font-medium">💡 Tip:</strong> Typography uses CSS clamp() for fluid scaling between viewport sizes.
          Changes update CSS variables in real-time and persist in localStorage.
        </p>
      </div>
    </div>
  );
};
