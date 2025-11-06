'use client';

import { useState } from 'react';
import { useBrandColorsStore } from '../../stores/brandColorsStore';
import { ColorCard } from '../ColorCard';
import { generateHarmony } from '../../lib/colorUtils';
import type { ColorName } from '../../types';

interface ColorDefinition {
  name: ColorName;
  label: string;
  description: string;
  usageExample: string;
}

const COLOR_DEFINITIONS: ColorDefinition[] = [
  {
    name: 'accentGreen',
    label: 'Accent Green',
    description: '',
    usageExample: 'Checkmarks, UI Confirmations (3s glow effects) - Use sparingly',
  },
  {
    name: 'headingText',
    label: 'Heading Text',
    description: '',
    usageExample: 'Main Heading',
  },
  {
    name: 'bodyText',
    label: 'Body Text',
    description: '',
    usageExample: 'Paragraph Text',
  },
  {
    name: 'brandGold',
    label: 'Brand Gold',
    description: '',
    usageExample: 'Button Hover',
  },
  {
    name: 'darkGray',
    label: 'Dark Gray',
    description: '',
    usageExample: 'Container Background',
  },
  {
    name: 'mediumGray',
    label: 'Medium Gray',
    description: '',
    usageExample: 'Menu Background',
  },
];

export function BrandColorsTab() {
  const { settings, resetToDefaults } = useBrandColorsStore();
  const [showHarmony, setShowHarmony] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSaveToDatabase = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const response = await fetch('/api/master-controller/brand-colors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ colors: settings }),
      });

      const result = await response.json();

      if (result.success) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
        console.error('[Brand Colors] Save failed:', result.error);
      }
    } catch (error) {
      setSaveStatus('error');
      console.error('[Brand Colors] Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const harmony = generateHarmony(settings.accentGreen);

  return (
    <div className="space-y-8">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-display text-2xl font-bold text-[#e5e4dd]">Brand Colors</h2>
          <p className="text-[#dcdbd5] mt-1">
            Centralized color control - changes propagate everywhere automatically
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Save to Database Button */}
          <button
            onClick={handleSaveToDatabase}
            disabled={isSaving}
            className={`px-4 py-2 text-sm rounded-md font-semibold transition-all ${
              saveStatus === 'success'
                ? 'bg-[#00ff88] text-[#191818] border border-[#00ff88]'
                : saveStatus === 'error'
                ? 'bg-red-500/20 text-red-400 border border-red-500'
                : isSaving
                ? 'bg-[#404040] text-[#dcdbd5] border border-[#404040] opacity-50 cursor-not-allowed'
                : 'bg-[#ffd700] text-[#191818] border border-[#ffd700] hover:bg-[#ffd700]/90 hover:shadow-lg'
            }`}
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : saveStatus === 'success' ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Saved!
              </span>
            ) : saveStatus === 'error' ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Error
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save to Database
              </span>
            )}
          </button>

          {/* Harmony Toggle */}
          <button
            onClick={() => setShowHarmony(!showHarmony)}
            className={`px-4 py-2 text-sm rounded-md transition-all ${
              showHarmony
                ? 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]'
                : 'text-[#dcdbd5] border border-[#404040] bg-[#404040] hover:bg-[#00ff88]/5 hover:border-[#00ff88]/50'
            }`}
          >
<span>{showHarmony ? 'Hide' : 'Show'} Harmony</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 text-sm text-[#dcdbd5] border border-[#404040] bg-[#404040] rounded-md hover:bg-[#00ff88]/5 hover:border-[#00ff88]/50 transition-all"
          >
<span>Reset All</span>
          </button>
        </div>
      </div>

      {/* Color Harmony Suggestions */}
      {showHarmony && (
        <div className="p-6 bg-[#191818] border border-[#00ff88]/30 rounded-lg">
          <h3 className="text-display text-lg font-semibold text-[#e5e4dd] mb-4">
            Color Harmony Suggestions
          </h3>
          <p className="text-sm text-[#dcdbd5] mb-4">
            Based on your Accent Green color, here are harmonious color suggestions:
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-medium text-[#e5e4dd]">Complementary</p>
              <div
                className="h-16 rounded-lg border-2 border-[#404040] shadow-md cursor-pointer hover:scale-105 hover:border-[#00ff88] transition-all duration-200"
                style={{ backgroundColor: harmony.complementary }}
                title={harmony.complementary}
              />
              <p className="text-xs font-mono text-[#dcdbd5]">{harmony.complementary}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-[#e5e4dd]">Triadic 1</p>
              <div
                className="h-16 rounded-lg border-2 border-[#404040] shadow-md cursor-pointer hover:scale-105 hover:border-[#00ff88] transition-all duration-200"
                style={{ backgroundColor: harmony.triadic[0] }}
                title={harmony.triadic[0]}
              />
              <p className="text-xs font-mono text-[#dcdbd5]">{harmony.triadic[0]}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-[#e5e4dd]">Triadic 2</p>
              <div
                className="h-16 rounded-lg border-2 border-[#404040] shadow-md cursor-pointer hover:scale-105 hover:border-[#00ff88] transition-all duration-200"
                style={{ backgroundColor: harmony.triadic[1] }}
                title={harmony.triadic[1]}
              />
              <p className="text-xs font-mono text-[#dcdbd5]">{harmony.triadic[1]}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-[#e5e4dd]">Lighter</p>
              <div
                className="h-16 rounded-lg border-2 border-[#404040] shadow-md cursor-pointer hover:scale-105 hover:border-[#00ff88] transition-all duration-200"
                style={{ backgroundColor: harmony.lighter }}
                title={harmony.lighter}
              />
              <p className="text-xs font-mono text-[#dcdbd5]">{harmony.lighter}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-[#e5e4dd]">Darker</p>
              <div
                className="h-16 rounded-lg border-2 border-[#404040] shadow-md cursor-pointer hover:scale-105 hover:border-[#00ff88] transition-all duration-200"
                style={{ backgroundColor: harmony.darker }}
                title={harmony.darker}
              />
              <p className="text-xs font-mono text-[#dcdbd5]">{harmony.darker}</p>
            </div>
          </div>
        </div>
      )}

      {/* Color Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COLOR_DEFINITIONS.map((colorDef) => (
          <ColorCard
            key={colorDef.name}
            colorName={colorDef.name}
            label={colorDef.label}
            description={colorDef.description}
            usageExample={colorDef.usageExample}
          />
        ))}
      </div>
    </div>
  );
}
