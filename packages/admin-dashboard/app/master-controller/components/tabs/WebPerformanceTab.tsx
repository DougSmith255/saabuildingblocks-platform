'use client';

/**
 * Web Performance Tab Component
 *
 * Displays real-time Core Web Vitals and performance metrics using web-vitals library.
 * Shows LCP, FID, CLS, FCP, TTFB and provides bundle analysis links.
 */

import { useEffect, useState } from 'react';
import { Activity, TrendingUp, Clock, Gauge, ExternalLink, BarChart3 } from 'lucide-react';
import type { Metric } from 'web-vitals';

interface WebVital {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  unit: string;
}

export function WebPerformanceTab() {
  const [vitals, setVitals] = useState<WebVital[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dynamically import web-vitals to avoid SSR issues
    import('web-vitals').then(({ onCLS, onLCP, onFCP, onTTFB, onINP }) => {
      const handleMetric = (metric: Metric) => {
        const rating = getRating(metric.name, metric.value);
        const unit = getUnit(metric.name);

        setVitals(prev => {
          const existing = prev.find(v => v.name === metric.name);
          if (existing) {
            return prev.map(v =>
              v.name === metric.name
                ? { ...v, value: metric.value, rating, unit }
                : v
            );
          }
          return [...prev, { name: metric.name, value: metric.value, rating, unit }];
        });
      };

      // Register all Web Vitals listeners (FID deprecated, using INP)
      onCLS(handleMetric);
      onLCP(handleMetric);
      onFCP(handleMetric);
      onTTFB(handleMetric);
      onINP(handleMetric); // Replaced FID in March 2024

      setIsLoading(false);
    });
  }, []);

  const getRating = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
    const thresholds: Record<string, [number, number]> = {
      'CLS': [0.1, 0.25],
      'INP': [200, 500],
      'LCP': [2500, 4000],
      'FCP': [1800, 3000],
      'TTFB': [800, 1800],
    };

    const [good, poor] = thresholds[name] || [0, 0];
    if (value <= good) return 'good';
    if (value <= poor) return 'needs-improvement';
    return 'poor';
  };

  const getUnit = (name: string): string => {
    return name === 'CLS' ? '' : 'ms';
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return '#00ff88';
      case 'needs-improvement': return '#ffd700';
      case 'poor': return '#ff6b6b';
      default: return '#dcdbd5';
    }
  };

  const getRatingBg = (rating: string) => {
    switch (rating) {
      case 'good': return 'rgba(0, 255, 136, 0.1)';
      case 'needs-improvement': return 'rgba(255, 215, 0, 0.1)';
      case 'poor': return 'rgba(255, 107, 107, 0.1)';
      default: return 'rgba(220, 219, 213, 0.1)';
    }
  };

  const formatValue = (value: number, unit: string): string => {
    if (unit === '') {
      return value.toFixed(3);
    }
    return `${Math.round(value)}${unit}`;
  };

  const getVitalIcon = (name: string) => {
    switch (name) {
      case 'LCP': return Clock;
      case 'INP': return Activity;
      case 'CLS': return TrendingUp;
      case 'FCP': return Gauge;
      case 'TTFB': return BarChart3;
      default: return Activity;
    }
  };

  const getVitalDescription = (name: string): string => {
    const descriptions: Record<string, string> = {
      'LCP': 'Largest Contentful Paint - measures loading performance. Target: ≤ 2.5s',
      'INP': 'Interaction to Next Paint - measures responsiveness. Target: ≤ 200ms (replaced FID in 2024)',
      'CLS': 'Cumulative Layout Shift - measures visual stability. Target: ≤ 0.1',
      'FCP': 'First Contentful Paint - measures perceived load speed. Target: ≤ 1.8s',
      'TTFB': 'Time to First Byte - measures server response time. Target: ≤ 800ms',
    };
    return descriptions[name] || 'Performance metric';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-lg border" style={{
        background: 'rgba(64, 64, 64, 0.3)',
        borderColor: 'rgba(255, 215, 0, 0.2)',
      }}>
        <h2 className="text-2xl font-bold text-[#ffd700] mb-2 flex items-center gap-2">
          <Activity className="w-6 h-6" />
          Web Performance Monitoring (2025)
        </h2>
        <p className="text-[#dcdbd5]">
          Real-time Core Web Vitals monitoring using the latest web-vitals library.
          These metrics are collected from actual user interactions on this page.
        </p>
      </div>

      {/* Core Web Vitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && vitals.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-[#dcdbd5]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffd700] mx-auto mb-4"></div>
            <p>Collecting Web Vitals metrics...</p>
            <p className="text-sm mt-2">Interact with the page to trigger measurements</p>
          </div>
        ) : (
          vitals.map((vital) => {
            const Icon = getVitalIcon(vital.name);
            return (
              <div
                key={vital.name}
                className="p-6 rounded-lg border"
                style={{
                  background: getRatingBg(vital.rating),
                  borderColor: getRatingColor(vital.rating),
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5" style={{ color: getRatingColor(vital.rating) }} />
                    <h3 className="text-lg font-bold text-[#e5e4dd]">{vital.name}</h3>
                  </div>
                  <span
                    className="px-2 py-1 rounded text-xs font-semibold"
                    style={{
                      background: getRatingColor(vital.rating),
                      color: '#000',
                    }}
                  >
                    {vital.rating.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="text-3xl font-bold mb-2" style={{ color: getRatingColor(vital.rating) }}>
                  {formatValue(vital.value, vital.unit)}
                </div>
                <p className="text-sm text-[#dcdbd5]">
                  {getVitalDescription(vital.name)}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Bundle Analysis Links */}
      <div className="p-6 rounded-lg border" style={{
        background: 'rgba(64, 64, 64, 0.3)',
        borderColor: 'rgba(0, 255, 136, 0.2)',
      }}>
        <h3 className="text-xl font-bold text-[#00ff88] mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Bundle Analysis Reports
        </h3>
        <p className="text-[#dcdbd5] mb-4">
          View interactive bundle size visualizations to identify optimization opportunities.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <a
            href="https://wp.saabuildingblocks.com/client.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-lg border hover:border-[#00ff88] transition-colors"
            style={{
              background: 'rgba(0, 255, 136, 0.05)',
              borderColor: 'rgba(0, 255, 136, 0.2)',
            }}
          >
            <span className="text-[#e5e4dd] font-medium">Client Bundle</span>
            <ExternalLink className="w-4 h-4 text-[#00ff88]" />
          </a>
          <a
            href="https://wp.saabuildingblocks.com/nodejs.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-lg border hover:border-[#00ff88] transition-colors"
            style={{
              background: 'rgba(0, 255, 136, 0.05)',
              borderColor: 'rgba(0, 255, 136, 0.2)',
            }}
          >
            <span className="text-[#e5e4dd] font-medium">Node.js Bundle</span>
            <ExternalLink className="w-4 h-4 text-[#00ff88]" />
          </a>
          <a
            href="https://wp.saabuildingblocks.com/edge.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-lg border hover:border-[#00ff88] transition-colors"
            style={{
              background: 'rgba(0, 255, 136, 0.05)',
              borderColor: 'rgba(0, 255, 136, 0.2)',
            }}
          >
            <span className="text-[#e5e4dd] font-medium">Edge Bundle</span>
            <ExternalLink className="w-4 h-4 text-[#00ff88]" />
          </a>
        </div>
      </div>

      {/* Performance Tips */}
      <div className="p-6 rounded-lg border" style={{
        background: 'rgba(64, 64, 64, 0.3)',
        borderColor: 'rgba(255, 215, 0, 0.2)',
      }}>
        <h3 className="text-xl font-bold text-[#ffd700] mb-4">2025 Performance Optimizations Enabled</h3>
        <ul className="space-y-2 text-[#dcdbd5]">
          <li className="flex items-start gap-2">
            <span className="text-[#00ff88] mt-1">✓</span>
            <span><strong className="text-[#e5e4dd]">React Compiler:</strong> Automatic component memoization (stable in Next.js 16)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00ff88] mt-1">✓</span>
            <span><strong className="text-[#e5e4dd]">Inline CSS:</strong> Eliminates render-blocking CSS requests</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00ff88] mt-1">✓</span>
            <span><strong className="text-[#e5e4dd]">Bundle Analyzer:</strong> Visualize and optimize bundle sizes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#00ff88] mt-1">✓</span>
            <span><strong className="text-[#e5e4dd]">Web Vitals Monitoring:</strong> Real-time performance tracking</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#ffd700] mt-1">→</span>
            <span><strong className="text-[#e5e4dd]">Turbopack:</strong> Next.js 16's default bundler for faster builds</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
