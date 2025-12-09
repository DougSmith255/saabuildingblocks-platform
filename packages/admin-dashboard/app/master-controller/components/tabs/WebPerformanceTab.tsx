'use client';

/**
 * Web Performance Tab Component
 *
 * Runs Lighthouse audits on any URL and displays results.
 * Similar to PageSpeed Insights but integrated into Master Controller.
 */

import { useState } from 'react';
import { Activity, Globe, Clock, Gauge, AlertTriangle, CheckCircle, XCircle, Loader2, TrendingUp, Zap, Eye, Search } from 'lucide-react';

interface LighthouseMetric {
  value: number;
  displayValue: string;
  score: number;
}

interface LighthouseOpportunity {
  title: string;
  description: string;
  savings: string;
}

interface LighthouseDiagnostic {
  title: string;
  description: string;
  displayValue?: string;
}

interface LighthouseResult {
  url: string;
  fetchTime: string;
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  metrics: {
    fcp: LighthouseMetric;
    lcp: LighthouseMetric;
    tbt: LighthouseMetric;
    cls: LighthouseMetric;
    si: LighthouseMetric;
    tti: LighthouseMetric;
  };
  opportunities: LighthouseOpportunity[];
  diagnostics: LighthouseDiagnostic[];
}

export function WebPerformanceTab() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LighthouseResult | null>(null);

  const runLighthouse = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    // Add https:// if no protocol specified
    let testUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      testUrl = `https://${url}`;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/lighthouse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: testUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to run Lighthouse');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#00ff88';
    if (score >= 50) return '#ffd700';
    return '#ff6b6b';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'rgba(0, 255, 136, 0.15)';
    if (score >= 50) return 'rgba(255, 215, 0, 0.15)';
    return 'rgba(255, 107, 107, 0.15)';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return CheckCircle;
    if (score >= 50) return AlertTriangle;
    return XCircle;
  };

  const getMetricRating = (score: number): 'good' | 'needs-improvement' | 'poor' => {
    if (score >= 0.9) return 'good';
    if (score >= 0.5) return 'needs-improvement';
    return 'poor';
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return '#00ff88';
      case 'needs-improvement': return '#ffd700';
      case 'poor': return '#ff6b6b';
      default: return '#dcdbd5';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-lg border" style={{
        background: 'rgba(64, 64, 64, 0.3)',
        borderColor: 'rgba(255, 215, 0, 0.2)',
      }}>
        <h2 className="text-2xl font-bold text-[#ffd700] mb-2 flex items-center gap-2">
          <Gauge className="w-6 h-6" />
          Lighthouse Performance Audit
        </h2>
        <p className="text-[#dcdbd5]">
          Run a full Lighthouse audit on any URL. Similar to PageSpeed Insights, powered by Google Lighthouse.
        </p>
      </div>

      {/* URL Input */}
      <div className="p-6 rounded-lg border" style={{
        background: 'rgba(64, 64, 64, 0.3)',
        borderColor: 'rgba(0, 255, 136, 0.2)',
      }}>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#dcdbd5]" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && runLighthouse()}
              placeholder="Enter URL to analyze (e.g., saabuildingblocks.pages.dev)"
              className="w-full pl-10 pr-4 py-3 rounded-lg border bg-[#2a2a2a] text-[#e5e4dd] placeholder-[#888] focus:outline-none focus:border-[#00ff88] transition-colors"
              style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={runLighthouse}
            disabled={isLoading}
            className="px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: isLoading ? 'rgba(255, 215, 0, 0.3)' : 'linear-gradient(135deg, #ffd700, #ffb347)',
              color: '#000',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Analyze
              </>
            )}
          </button>
        </div>

        {isLoading && (
          <div className="mt-4 p-4 rounded-lg" style={{ background: 'rgba(255, 215, 0, 0.1)' }}>
            <p className="text-[#ffd700] text-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Running Lighthouse audit... This may take 15-30 seconds.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 rounded-lg" style={{ background: 'rgba(255, 107, 107, 0.1)' }}>
            <p className="text-[#ff6b6b] text-sm flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              {error}
            </p>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <>
          {/* Scores Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Performance', score: result.scores.performance, icon: Zap },
              { label: 'Accessibility', score: result.scores.accessibility, icon: Eye },
              { label: 'Best Practices', score: result.scores.bestPractices, icon: CheckCircle },
              { label: 'SEO', score: result.scores.seo, icon: Search },
            ].map((item) => {
              const ScoreIcon = getScoreIcon(item.score);
              return (
                <div
                  key={item.label}
                  className="p-6 rounded-lg border text-center"
                  style={{
                    background: getScoreBg(item.score),
                    borderColor: getScoreColor(item.score),
                  }}
                >
                  <div className="flex justify-center mb-2">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                      style={{
                        background: `conic-gradient(${getScoreColor(item.score)} ${item.score * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
                        color: getScoreColor(item.score),
                      }}
                    >
                      {item.score}
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <item.icon className="w-4 h-4" style={{ color: getScoreColor(item.score) }} />
                    <span className="text-[#e5e4dd] font-medium">{item.label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Core Web Vitals */}
          <div className="p-6 rounded-lg border" style={{
            background: 'rgba(64, 64, 64, 0.3)',
            borderColor: 'rgba(255, 215, 0, 0.2)',
          }}>
            <h3 className="text-xl font-bold text-[#ffd700] mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Core Web Vitals
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { key: 'fcp', label: 'First Contentful Paint', desc: 'Time to first content' },
                { key: 'lcp', label: 'Largest Contentful Paint', desc: 'Main content loaded' },
                { key: 'tbt', label: 'Total Blocking Time', desc: 'Main thread blocking' },
                { key: 'cls', label: 'Cumulative Layout Shift', desc: 'Visual stability' },
                { key: 'si', label: 'Speed Index', desc: 'Visual progression' },
                { key: 'tti', label: 'Time to Interactive', desc: 'Fully interactive' },
              ].map((metric) => {
                const data = result.metrics[metric.key as keyof typeof result.metrics];
                const rating = getMetricRating(data.score);
                return (
                  <div
                    key={metric.key}
                    className="p-4 rounded-lg border"
                    style={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderColor: getRatingColor(rating),
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[#dcdbd5]">{metric.label}</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{
                          background: getRatingColor(rating),
                          color: '#000',
                        }}
                      >
                        {rating.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: getRatingColor(rating) }}>
                      {data.displayValue}
                    </div>
                    <div className="text-xs text-[#888] mt-1">{metric.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Opportunities */}
          {result.opportunities.length > 0 && (
            <div className="p-6 rounded-lg border" style={{
              background: 'rgba(64, 64, 64, 0.3)',
              borderColor: 'rgba(255, 107, 107, 0.2)',
            }}>
              <h3 className="text-xl font-bold text-[#ff6b6b] mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Opportunities
              </h3>
              <div className="space-y-3">
                {result.opportunities.map((opp, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border"
                    style={{
                      background: 'rgba(255, 107, 107, 0.05)',
                      borderColor: 'rgba(255, 107, 107, 0.2)',
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-[#e5e4dd]">{opp.title}</div>
                        <div className="text-sm text-[#888] mt-1">{opp.description.split('.')[0]}.</div>
                      </div>
                      <div className="text-[#ff6b6b] font-semibold ml-4">
                        {opp.savings}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Diagnostics */}
          {result.diagnostics.length > 0 && (
            <div className="p-6 rounded-lg border" style={{
              background: 'rgba(64, 64, 64, 0.3)',
              borderColor: 'rgba(255, 215, 0, 0.2)',
            }}>
              <h3 className="text-xl font-bold text-[#ffd700] mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Diagnostics
              </h3>
              <div className="space-y-3">
                {result.diagnostics.map((diag, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border"
                    style={{
                      background: 'rgba(255, 215, 0, 0.05)',
                      borderColor: 'rgba(255, 215, 0, 0.2)',
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-[#e5e4dd]">{diag.title}</div>
                        <div className="text-sm text-[#888] mt-1">{diag.description.split('.')[0]}.</div>
                      </div>
                      {diag.displayValue && (
                        <div className="text-[#ffd700] font-semibold ml-4">
                          {diag.displayValue}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="text-sm text-[#888] text-center">
            Analyzed: {result.url} • {new Date(result.fetchTime).toLocaleString()}
          </div>
        </>
      )}

      {/* Empty State */}
      {!result && !isLoading && !error && (
        <div className="p-12 rounded-lg border text-center" style={{
          background: 'rgba(64, 64, 64, 0.2)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        }}>
          <Gauge className="w-16 h-16 mx-auto mb-4 text-[#404040]" />
          <p className="text-[#888] text-lg">Enter a URL above to run a Lighthouse performance audit</p>
          <p className="text-[#666] text-sm mt-2">
            Get detailed performance scores, Core Web Vitals, and optimization recommendations
          </p>
        </div>
      )}
    </div>
  );
}
