'use client';

import { useMemo } from 'react';
import { calculateContrast, getContrastRating, type ContrastRating } from '../lib/colorUtils';
import { useBrandColorsStore } from '../stores/brandColorsStore';

interface ContrastResult {
  label: string;
  ratio: number;
  rating: ContrastRating;
  textColor: string;
  bgColor: string;
}

export function ContrastChecker() {
  const { settings } = useBrandColorsStore();

  const contrastResults = useMemo<ContrastResult[]>(() => {
    return [
      {
        label: 'Heading Text on Dark Gray',
        textColor: settings.headingText,
        bgColor: settings.darkGray,
        ratio: calculateContrast(settings.headingText, settings.darkGray),
        rating: getContrastRating(
          calculateContrast(settings.headingText, settings.darkGray)
        ),
      },
      {
        label: 'Heading Text on Medium Gray',
        textColor: settings.headingText,
        bgColor: settings.mediumGray,
        ratio: calculateContrast(settings.headingText, settings.mediumGray),
        rating: getContrastRating(
          calculateContrast(settings.headingText, settings.mediumGray)
        ),
      },
      {
        label: 'Body Text on Dark Gray',
        textColor: settings.bodyText,
        bgColor: settings.darkGray,
        ratio: calculateContrast(settings.bodyText, settings.darkGray),
        rating: getContrastRating(
          calculateContrast(settings.bodyText, settings.darkGray)
        ),
      },
      {
        label: 'Body Text on Medium Gray',
        textColor: settings.bodyText,
        bgColor: settings.mediumGray,
        ratio: calculateContrast(settings.bodyText, settings.mediumGray),
        rating: getContrastRating(
          calculateContrast(settings.bodyText, settings.mediumGray)
        ),
      },
    ];
  }, [settings]);

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

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        WCAG Contrast Checker
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Ensures text readability meets accessibility standards (WCAG 2.1)
      </p>

      <div className="space-y-3">
        {contrastResults.map((result, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded border border-gray-300 flex items-center justify-center text-xs font-bold"
                  style={{
                    backgroundColor: result.bgColor,
                    color: result.textColor,
                  }}
                >
                  Aa
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{result.label}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Contrast: {result.ratio.toFixed(2)}:1
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`px-3 py-1 rounded-full border font-medium text-sm ${getRatingColor(
                result.rating
              )}`}
            >
              {getRatingIcon(result.rating)} {result.rating}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">WCAG Standards:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>
            <strong>AAA:</strong> ≥7:1 ratio (Enhanced accessibility)
          </li>
          <li>
            <strong>AA:</strong> ≥4.5:1 ratio (Minimum for body text)
          </li>
          <li>
            <strong>Fail:</strong> &lt;4.5:1 ratio (May be hard to read)
          </li>
        </ul>
      </div>
    </div>
  );
}
