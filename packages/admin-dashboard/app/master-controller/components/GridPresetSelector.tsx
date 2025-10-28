'use client';

import { useSpacingStore } from '../stores/spacingStore';

// Grid presets for min-width values
const GRID_PRESETS = {
  narrow: { name: 'Narrow', description: 'Narrow columns', minWidth: 200 },
  standard: { name: 'Standard', description: 'Standard columns', minWidth: 300 },
  wide: { name: 'Wide', description: 'Wide columns', minWidth: 400 },
} as const;

type GridPreset = keyof typeof GRID_PRESETS;

export function GridPresetSelector() {
  const { settings, updateSpacing } = useSpacingStore();

  // Early return if settings not loaded (SSR/static generation)
  if (!settings || settings.gridMinWidth === undefined) {
    return (
      <div className="space-y-4 p-4 rounded-lg border border-[#404040] bg-[#191818]">
        <div className="text-center text-[#dcdbd5]">Loading grid settings...</div>
      </div>
    );
  }

  const currentMinWidth = settings.gridMinWidth;

  const handlePresetClick = (preset: GridPreset) => {
    updateSpacing({ gridMinWidth: GRID_PRESETS[preset].minWidth });
  };

  const getActivePreset = (): GridPreset | null => {
    for (const [key, config] of Object.entries(GRID_PRESETS)) {
      if (config.minWidth === currentMinWidth) {
        return key as GridPreset;
      }
    }
    return null;
  };

  const activePreset = getActivePreset();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-[#e5e4dd] mb-2">
          Grid Column Width Preset
        </h3>
        <p className="text-sm text-[#dcdbd5] mb-4">
          Sets the minimum column width for <code className="px-1.5 py-0.5 bg-[#191818] rounded text-xs">repeat(auto-fit, minmax(Xpx, 1fr))</code>
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {(Object.entries(GRID_PRESETS) as [GridPreset, typeof GRID_PRESETS[GridPreset]][]).map(
          ([key, config]) => {
            const isActive = activePreset === key;
            return (
              <button
                key={key}
                onClick={() => handlePresetClick(key)}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-200
                  ${
                    isActive
                      ? 'border-[#ffd700] bg-[#ffd700]/5 shadow-md'
                      : 'border-[#404040] hover:border-[#ffd700]/50'
                  }
                `}
              >
                <div className="text-sm font-semibold text-[#e5e4dd] mb-1">
                  {config.name}
                </div>
                <div className="text-xs text-[#dcdbd5] mb-3">
                  {config.description}
                </div>
                {/* Visual Grid Illustration */}
                <div className="grid gap-1" style={{
                  gridTemplateColumns: `repeat(auto-fit, minmax(${Math.min(config.minWidth / 10, 40)}px, 1fr))`,
                }}>
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`
                        h-6 rounded
                        ${
                          isActive
                            ? 'bg-[#ffd700]'
                            : 'bg-[#404040]'
                        }
                      `}
                    />
                  ))}
                </div>
                <div className="text-xs font-mono text-[#dcdbd5] mt-2">
                  {config.minWidth}px min
                </div>
              </button>
            );
          }
        )}
      </div>

      {/* Custom Width Control */}
      <div className="pt-4 border-t border-[#404040]">
        <label className="block text-sm font-medium text-[#e5e4dd] mb-2">
          Custom Grid Min Width
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={200}
            max={500}
            step={10}
            value={currentMinWidth}
            onChange={(e) => updateSpacing({ gridMinWidth: Number(e.target.value) })}
            className="flex-1 h-2 bg-[#404040] rounded-lg appearance-none cursor-pointer accent-[#ffd700]"
          />
          <span className="text-sm font-mono text-[#e5e4dd] min-w-[60px]">
            {currentMinWidth}px
          </span>
        </div>
      </div>
    </div>
  );
}
