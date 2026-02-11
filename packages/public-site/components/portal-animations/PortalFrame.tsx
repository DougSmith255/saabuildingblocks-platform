'use client';

/**
 * AnimationCanvas — Minimal portrait SVG wrapper for portal animations
 *
 * Replaces PortalFrame. No chrome — just a portrait SVG canvas (390×680)
 * with a dark background rect and rounded corners like a phone screen.
 */

import React from 'react';

// ============================================================================
// Shared constants
// ============================================================================

export const CANVAS_W = 390;
export const CANVAS_H = 680;

export const COLORS = {
  bg: '#0a0a0a',
  textPrimary: '#e5e4dd',
  textSecondary: '#a8a7a0',
  textMuted: '#666',
  gold: '#ffd700',
  green: '#00ff88',
  cyan: '#00bfff',
  cardBg: '#1a1a1a',
  cardBorder: 'rgba(255,255,255,0.06)',
  goldDim: 'rgba(255,215,0,0.15)',
  goldBorder: 'rgba(255,215,0,0.3)',
};

// ============================================================================
// AnimationCanvas
// ============================================================================

export function AnimationCanvas({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 390 680"
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-full"
      role="img"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// ============================================================================
// AnimatedCursor
// ============================================================================

export interface AnimatedCursorProps {
  keyframes: string;
  duration: string;
  delay?: string;
}

export function AnimatedCursor({ keyframes, duration, delay = '0s' }: AnimatedCursorProps) {
  return (
    <g
      style={{
        animation: `${keyframes} ${duration} ${delay} ease-in-out infinite`,
        willChange: 'transform',
      }}
    >
      <path
        d="M0 0 L0 14 L4 10 L7 16 L10 15 L7 9 L12 8 Z"
        fill="#ffd700"
        stroke="#000"
        strokeWidth="0.5"
      />
    </g>
  );
}

// ============================================================================
// ClickPulse
// ============================================================================

export function ClickPulse({ delay = '0s' }: { delay?: string }) {
  return (
    <circle
      r="0"
      fill="none"
      stroke={COLORS.gold}
      strokeWidth="2"
      opacity="0"
      style={{
        animation: `clickPulse 0.6s ease-out ${delay} both`,
      }}
    />
  );
}

// ============================================================================
// Shared CSS @keyframes
// ============================================================================

export function PortalAnimationStyles() {
  return (
    <style>{`
      @keyframes mockCardIn {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes mockFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes clickPulse {
        0% { r: 0; opacity: 0.8; stroke-width: 3; }
        100% { r: 18; opacity: 0; stroke-width: 0.5; }
      }
      @keyframes slideInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes toastIn {
        0% { opacity: 0; transform: translateX(40px); }
        10% { opacity: 1; transform: translateX(0); }
        80% { opacity: 1; transform: translateX(0); }
        100% { opacity: 0; transform: translateX(40px); }
      }
      @keyframes pulseGlow {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
      }
    `}</style>
  );
}

// Legacy exports for backward compatibility
export const CONTENT_X = 0;
export const CONTENT_Y = 0;
export const CONTENT_W = CANVAS_W;
export const CONTENT_H = CANVAS_H;

/** @deprecated Use AnimationCanvas instead */
export const PortalFrame = AnimationCanvas;
