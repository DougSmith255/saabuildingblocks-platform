'use client';

import { X } from 'lucide-react';
import { useControllerStore } from '../stores/controllerStore';
import { useTypographyStore } from '../stores/typographyStore';
import { useBrandColorsStore } from '../stores/brandColorsStore';

export function PreviewPanel() {
  const { togglePreview } = useControllerStore();
  const typography = useTypographyStore((state) => state.settings);
  const colors = useBrandColorsStore((state) => state.settings);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-gray-900 border-l border-gray-800 shadow-2xl overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white">Live Preview</h2>
        <button
          onClick={togglePreview}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
          aria-label="Close preview"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-8">
        {/* Typography Preview */}
        <section>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Typography
          </h3>
          <div className="space-y-3">
            <div className="text-white" style={{
              fontWeight: typography.h1.fontWeight,
              lineHeight: typography.h1.lineHeight,
              letterSpacing: `${typography.h1.letterSpacing}em`,
            }}>
              Heading 1
            </div>
            <div className="text-white" style={{
              fontWeight: typography.h2.fontWeight,
              lineHeight: typography.h2.lineHeight,
              letterSpacing: `${typography.h2.letterSpacing}em`,
            }}>
              Heading 2
            </div>
            <div className="text-white" style={{
              fontWeight: typography.h3.fontWeight,
              lineHeight: typography.h3.lineHeight,
            }}>
              Heading 3
            </div>
            <p className="text-gray-400" style={{
              fontWeight: typography.body.fontWeight,
              lineHeight: typography.body.lineHeight,
            }}>
              Body text with proper line height and spacing for readability.
            </p>
            <blockquote
              className="text-gray-400 italic"
              style={{
                fontWeight: typography.quote.fontWeight,
                lineHeight: typography.quote.lineHeight,
                borderLeft: `4px solid ${colors.accentGreen}`,
                paddingLeft: '1rem',
              }}
            >
              Quote text example
            </blockquote>
            <a
              href="#"
              className="underline"
              style={{
                fontWeight: typography.link.fontWeight,
                color: colors.accentGreen,
              }}
            >
              Link example
            </a>
          </div>
        </section>

        {/* Color Swatches */}
        <section>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Brand Colors
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div
                className="w-full h-16 rounded-md border border-gray-700 mb-2"
                style={{ backgroundColor: colors.accentGreen }}
              />
              <p className="text-xs text-gray-400">Accent Green</p>
              <p className="text-xs font-mono text-gray-500">{colors.accentGreen}</p>
            </div>
            <div>
              <div
                className="w-full h-16 rounded-md border border-gray-700 mb-2"
                style={{ backgroundColor: colors.brandGold }}
              />
              <p className="text-xs text-gray-400">Brand Gold</p>
              <p className="text-xs font-mono text-gray-500">{colors.brandGold}</p>
            </div>
            <div>
              <div
                className="w-full h-16 rounded-md border border-gray-700 mb-2"
                style={{ backgroundColor: colors.headingText }}
              />
              <p className="text-xs text-gray-400">Heading Text</p>
              <p className="text-xs font-mono text-gray-500">{colors.headingText}</p>
            </div>
            <div>
              <div
                className="w-full h-16 rounded-md border border-gray-700 mb-2"
                style={{ backgroundColor: colors.bodyText }}
              />
              <p className="text-xs text-gray-400">Body Text</p>
              <p className="text-xs font-mono text-gray-500">{colors.bodyText}</p>
            </div>
            <div>
              <div
                className="w-full h-16 rounded-md border border-gray-700 mb-2"
                style={{ backgroundColor: colors.darkGray }}
              />
              <p className="text-xs text-gray-400">Dark Gray</p>
              <p className="text-xs font-mono text-gray-500">{colors.darkGray}</p>
            </div>
            <div>
              <div
                className="w-full h-16 rounded-md border border-gray-700 mb-2"
                style={{ backgroundColor: colors.mediumGray }}
              />
              <p className="text-xs text-gray-400">Medium Gray</p>
              <p className="text-xs font-mono text-gray-500">{colors.mediumGray}</p>
            </div>
          </div>
        </section>

        {/* Spacing Example */}
        <section>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Spacing & Layout
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-400 mb-2">Container Padding: Responsive</p>
              <div
                className="bg-gray-800 border border-gray-700 rounded-md p-4"
              >
                <div className="bg-blue-950 text-blue-300 text-xs p-2 rounded">
                  Container content
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2">Grid Gap: Responsive</p>
              <div
                className="grid grid-cols-3 bg-gray-800 border border-gray-700 rounded-md p-2 gap-3"
              >
                <div className="bg-blue-950 text-blue-300 text-xs p-2 rounded text-center">1</div>
                <div className="bg-blue-950 text-blue-300 text-xs p-2 rounded text-center">2</div>
                <div className="bg-blue-950 text-blue-300 text-xs p-2 rounded text-center">3</div>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2">Section Margin: Responsive</p>
              <div className="bg-gray-800 border border-gray-700 rounded-md p-2">
                <div className="bg-blue-950 text-blue-300 text-xs p-2 rounded mb-4">
                  Section 1
                </div>
                <div className="bg-blue-950 text-blue-300 text-xs p-2 rounded">
                  Section 2
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
