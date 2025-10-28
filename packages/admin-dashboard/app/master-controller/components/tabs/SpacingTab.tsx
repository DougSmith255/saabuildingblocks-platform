'use client';

import { SpacingControl } from '../../components/SpacingControl';
import { GridPresetSelector } from '../../components/GridPresetSelector';
import { GridPreview } from '../../components/GridPreview';
import { useSpacingStore } from '../../stores/spacingStore';
import { SPACING_PRESETS } from '../../lib/spacingPresets';
import type { SpacingToken } from '../../types';

const SPACING_TOKENS: SpacingToken[] = ['containerPadding', 'gridGap', 'sectionMargin'];

export function SpacingTab() {
  const { batchUpdate, resetToDefaults } = useSpacingStore();

  const handlePresetSelect = (presetKey: string) => {
    const preset = SPACING_PRESETS[presetKey];
    if (preset) {
      batchUpdate(preset.settings);
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#e5e4dd]">
            Spacing & Layout
          </h2>
          <p className="text-sm text-[#dcdbd5] mt-1">
            Control spacing tokens and responsive grid behavior
          </p>
        </div>
        <button
          onClick={resetToDefaults}
          className="px-4 py-2 text-sm font-medium text-[#dcdbd5] bg-[#404040] border border-[#404040] rounded-lg hover:bg-[#ffd700]/5 hover:border-[#ffd700]/50 transition-all"
        >
          Reset to Defaults
        </button>
      </div>

      {/* Spacing Presets */}
      <section className="p-6 bg-[#191818] rounded-lg border border-[#404040]">
        <h3 className="font-semibold text-[#e5e4dd] mb-4">
          Spacing Presets
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(SPACING_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => handlePresetSelect(key)}
              className="p-4 text-left rounded-lg border-2 border-[#404040] hover:border-[#ffd700] bg-[#404040]/30 transition-all duration-200 hover:shadow-md hover:shadow-[#ffd700]/20"
            >
              <div className="font-semibold text-[#e5e4dd] mb-1">
                {preset.name}
              </div>
              <div className="text-sm text-[#dcdbd5]">
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Spacing Controls */}
      <section>
        <h3 className="font-semibold text-[#e5e4dd] mb-4">
          Spacing Tokens
        </h3>
        <div className="grid gap-6">
          {SPACING_TOKENS.map((token) => (
            <SpacingControl key={token} spacingToken={token} />
          ))}
        </div>
      </section>

      {/* Grid Configuration */}
      <section className="p-6 bg-[#191818] rounded-lg border border-[#404040]">
        <GridPresetSelector />
      </section>

      {/* Live Grid Preview */}
      <section className="p-6 bg-[#191818] rounded-lg border border-[#404040]">
        <GridPreview />
      </section>

      {/* CSS Output Info */}
      <section className="p-6 bg-[#404040]/30 rounded-lg border border-[#404040]">
        <h3 className="font-semibold text-[#e5e4dd] mb-3">
          Generated CSS Variables
        </h3>
        <div className="space-y-2 font-mono text-sm">
          <div className="flex justify-between items-center p-2 bg-[#191818] rounded border border-[#404040]">
            <span className="text-[#dcdbd5]">--container-padding</span>
            <span className="text-[#ffd700]">clamp(...)</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-[#191818] rounded border border-[#404040]">
            <span className="text-[#dcdbd5]">--grid-gap</span>
            <span className="text-[#ffd700]">clamp(...)</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-[#191818] rounded border border-[#404040]">
            <span className="text-[#dcdbd5]">--section-margin</span>
            <span className="text-[#ffd700]">clamp(...)</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-[#191818] rounded border border-[#404040]">
            <span className="text-[#dcdbd5]">--grid-min-width</span>
            <span className="text-[#ffd700]">Dynamic</span>
          </div>
        </div>
        <p className="text-xs text-[#dcdbd5] mt-4">
          These CSS variables are automatically generated and applied to your application.
          Use them in your components with <code className="px-1 py-0.5 bg-[#191818] border border-[#404040] rounded text-[#ffd700]">var(--container-padding)</code>
        </p>
      </section>
    </div>
  );
}
