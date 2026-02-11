'use client';

/**
 * AnalyticsAnimation — "Track Every Click"
 *
 * Portrait 390×680 canvas. No portal chrome.
 *
 * Choreography (10s loop):
 * 0-1.5s:  Analytics header fades in
 * 1.5-4s:  4 stat cards fly in (2×2 grid), numbers count up
 * 4-7s:    Button breakdown chart (full-width horizontal bars)
 * 7-9s:    Weekly trend line chart draws itself
 * 9-10s:   Gentle fade to loop
 */

import React from 'react';
import { AnimationCanvas, CANVAS_W, COLORS } from './PortalFrame';

const CW = CANVAS_W;

const STATS = [
  { label: 'Views This Week', value: '247', color: COLORS.gold },
  { label: 'Total Views', value: '1,842', color: COLORS.green },
  { label: 'Clicks This Week', value: '89', color: COLORS.cyan },
  { label: 'All-Time Clicks', value: '634', color: '#a855f7' },
];

const BUTTON_BREAKDOWN = [
  { label: 'Schedule a Call', clicks: 34, pct: 0.85 },
  { label: 'View Listings', clicks: 28, pct: 0.70 },
  { label: 'About My eXp Team', clicks: 18, pct: 0.45 },
  { label: 'Free Home Guide', clicks: 9, pct: 0.22 },
];

const TREND_VALUES = [28, 35, 42, 38, 52, 31, 21];
const TREND_MAX = 55;
const TREND_CHART_H = 40;
const TREND_CHART_W = CW - 80;

function trendPoint(v: number, i: number) {
  const px = 40 + i * (TREND_CHART_W / 6);
  const py = 636 - (v / TREND_MAX) * TREND_CHART_H;
  return { px, py };
}

const TREND_POINTS_STR = TREND_VALUES
  .map((v, i) => {
    const { px, py } = trendPoint(v, i);
    return `${px},${py}`;
  })
  .join(' ');

// Build the area fill path (line + close along bottom)
const TREND_AREA_PATH = (() => {
  const first = trendPoint(TREND_VALUES[0], 0);
  const last = trendPoint(TREND_VALUES[TREND_VALUES.length - 1], TREND_VALUES.length - 1);
  let d = `M${first.px},${first.py}`;
  for (let i = 1; i < TREND_VALUES.length; i++) {
    const { px, py } = trendPoint(TREND_VALUES[i], i);
    d += ` L${px},${py}`;
  }
  d += ` L${last.px},636 L${first.px},636 Z`;
  return d;
})();

const BAR_COLORS = [COLORS.gold, COLORS.green, COLORS.cyan, '#a855f7'];

// Trend indicators for stat cards
const STAT_TRENDS: (string | null)[] = ['\u219112%', '\u21918%', null, null];

export function AnalyticsAnimation() {
  return (
    <>
      <style>{`
        @keyframes ana-header {
          0%, 2% { opacity: 0; transform: translateY(-10px); }
          10%, 90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; }
        }
        @keyframes ana-stat {
          0%, 100% { opacity: 0; transform: translateY(20px); }
          15%, 88% { opacity: 1; transform: translateY(0); }
          95% { opacity: 0; }
        }
        @keyframes ana-bar {
          0%, 100% { opacity: 0; transform: scaleX(0); }
          20%, 85% { opacity: 1; transform: scaleX(1); }
          92% { opacity: 0; }
        }
        @keyframes ana-breakdown-header {
          0%, 30% { opacity: 0; }
          38%, 85% { opacity: 1; }
          92%, 100% { opacity: 0; }
        }
        @keyframes ana-chart {
          0%, 65% { opacity: 0; }
          72%, 88% { opacity: 1; }
          95%, 100% { opacity: 0; }
        }
        @keyframes ana-line-draw {
          0%, 65% { stroke-dashoffset: 500; opacity: 0; }
          70% { opacity: 1; }
          85%, 88% { stroke-dashoffset: 0; opacity: 1; }
          95%, 100% { opacity: 0; stroke-dashoffset: 0; }
        }
        @keyframes ana-area-reveal {
          0%, 65% { opacity: 0; }
          80%, 88% { opacity: 1; }
          95%, 100% { opacity: 0; }
        }
        @keyframes ana-num {
          0%, 12% { opacity: 0; }
          20% { opacity: 1; }
        }
      `}</style>

      <AnimationCanvas>
        {/* SVG defs for glow filters and gradients */}
        <defs>
          {/* Bar glow filters */}
          {BAR_COLORS.map((color, i) => (
            <filter key={`bar-glow-${i}`} id={`bar-glow-${i}`} x="-10%" y="-50%" width="120%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={color} floodOpacity="0.45" />
            </filter>
          ))}

          {/* Gold line glow */}
          <filter id="gold-line-glow" x="-10%" y="-50%" width="120%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={COLORS.gold} floodOpacity="0.5" />
          </filter>

          {/* Gold area fill gradient */}
          <linearGradient id="gold-area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.gold} stopOpacity="0.18" />
            <stop offset="100%" stopColor={COLORS.gold} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Section label */}
        <g style={{ animation: 'ana-header 10s ease-in-out infinite' }}>
          <text
            x={CW / 2}
            y="60"
            textAnchor="middle"
            fill={COLORS.gold}
            fontSize="13"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
            letterSpacing="2"
            opacity="0.7"
          >
            ANALYTICS
          </text>
          <rect
            x={CW / 2 - 30}
            y="70"
            width="60"
            height="1.5"
            rx="0.75"
            fill={COLORS.gold}
            opacity="0.3"
          />
        </g>

        {/* Stat cards (2x2 grid) */}
        {STATS.map((stat, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const cardW = (CW - 70) / 2;
          const cardX = 25 + col * (cardW + 20);
          const cardY = 105 + row * 95;
          const delay = `${1 + i * 0.3}s`;
          const trend = STAT_TRENDS[i];

          return (
            <g key={i} style={{ animation: `ana-stat 10s ease-out ${delay} infinite` }}>
              <rect
                x={cardX}
                y={cardY}
                width={cardW}
                height="80"
                rx="10"
                fill={COLORS.cardBg}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
              <text
                x={cardX + 16}
                y={cardY + 36}
                fill={stat.color}
                fontSize="24"
                fontWeight="700"
                fontFamily="system-ui, sans-serif"
                style={{ animation: `ana-num 10s ease-out ${delay} infinite` }}
              >
                {stat.value}
              </text>
              {/* Trend indicator */}
              {trend && (
                <text
                  x={cardX + 16}
                  y={cardY + 50}
                  fill={COLORS.green}
                  fontSize="9"
                  fontWeight="600"
                  fontFamily="system-ui, sans-serif"
                  style={{ animation: `ana-num 10s ease-out ${delay} infinite` }}
                >
                  {trend}
                </text>
              )}
              <text
                x={cardX + 16}
                y={cardY + 66}
                fill={COLORS.textMuted}
                fontSize="10"
                fontFamily="system-ui, sans-serif"
              >
                {stat.label}
              </text>
            </g>
          );
        })}

        {/* Button Breakdown Section */}
        <g style={{ animation: 'ana-breakdown-header 10s ease-out infinite' }}>
          <text
            x="25"
            y="328"
            fill={COLORS.textPrimary}
            fontSize="16"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            Button Click Breakdown
          </text>

          {/* Bar chart */}
          {BUTTON_BREAKDOWN.map((btn, i) => {
            const barY = 350 + i * 52;
            const barMaxW = CW - 90;
            const delay = `${3.5 + i * 0.3}s`;

            return (
              <g key={i}>
                {/* Button name (above bar) */}
                <text
                  x="25"
                  y={barY + 14}
                  fill={COLORS.textSecondary}
                  fontSize="11"
                  fontFamily="system-ui, sans-serif"
                  style={{ animation: 'ana-breakdown-header 10s ease-out infinite' }}
                >
                  {btn.label}
                </text>

                {/* Bar background */}
                <rect
                  x="25"
                  y={barY + 20}
                  width={barMaxW}
                  height="18"
                  rx="4"
                  fill="rgba(255,255,255,0.03)"
                  style={{ animation: 'ana-breakdown-header 10s ease-out infinite' }}
                />

                {/* Bar fill with glow */}
                <rect
                  x="25"
                  y={barY + 20}
                  width={barMaxW * btn.pct}
                  height="18"
                  rx="4"
                  fill={BAR_COLORS[i]}
                  opacity="0.7"
                  filter={`url(#bar-glow-${i})`}
                  style={{
                    animation: `ana-bar 10s ease-out ${delay} infinite`,
                    transformOrigin: '25px 0',
                  }}
                />

                {/* Click count */}
                <text
                  x={CW - 30}
                  y={barY + 34}
                  textAnchor="end"
                  fill={COLORS.textSecondary}
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="system-ui, sans-serif"
                  style={{ animation: 'ana-breakdown-header 10s ease-out infinite' }}
                >
                  {btn.clicks}
                </text>
              </g>
            );
          })}
        </g>

        {/* Weekly Trend Mini Chart */}
        <g style={{ animation: 'ana-chart 10s ease-out infinite' }}>
          <text
            x="25"
            y="580"
            fill={COLORS.textPrimary}
            fontSize="13"
            fontWeight="600"
            fontFamily="system-ui, sans-serif"
          >
            Weekly Trend
          </text>

          {/* Chart background */}
          <rect x="25" y="592" width={CW - 50} height="50" rx="6" fill="rgba(255,255,255,0.02)" />

          {/* Grid lines */}
          {[0, 1, 2, 3, 4, 5, 6].map((d) => {
            const lineX = 40 + d * ((CW - 80) / 6);
            return (
              <line
                key={d}
                x1={lineX}
                y1="592"
                x2={lineX}
                y2="642"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="0.5"
              />
            );
          })}

          {/* Day labels */}
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, d) => {
            const labelX = 40 + d * ((CW - 80) / 6);
            return (
              <text
                key={d}
                x={labelX}
                y="658"
                textAnchor="middle"
                fill={COLORS.textMuted}
                fontSize="8"
                fontFamily="system-ui, sans-serif"
              >
                {day}
              </text>
            );
          })}

          {/* Area fill under the trend line */}
          <path
            d={TREND_AREA_PATH}
            fill="url(#gold-area-fill)"
            style={{ animation: 'ana-area-reveal 10s ease-out infinite' }}
          />

          {/* Trend line with glow */}
          <polyline
            points={TREND_POINTS_STR}
            fill="none"
            stroke={COLORS.gold}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="500"
            filter="url(#gold-line-glow)"
            style={{ animation: 'ana-line-draw 10s ease-out infinite' }}
          />

          {/* Data points — outer colored dot + white center */}
          {TREND_VALUES.map((v, i) => {
            const { px, py } = trendPoint(v, i);
            return (
              <g key={i} style={{ animation: 'ana-chart 10s ease-out infinite' }}>
                <circle cx={px} cy={py} r="4" fill={COLORS.gold} />
                <circle cx={px} cy={py} r="1.5" fill="#ffffff" />
              </g>
            );
          })}
        </g>
      </AnimationCanvas>
    </>
  );
}
