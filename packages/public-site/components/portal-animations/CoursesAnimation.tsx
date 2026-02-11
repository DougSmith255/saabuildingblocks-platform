'use client';

/**
 * CoursesAnimation — "Elite Training at Your Fingertips"
 *
 * Portrait 390x680 canvas. No portal chrome.
 *
 * Choreography (12s loop):
 * 0-1.5s:  Training header fades in with gold decorative line
 * 1.5-4s:  6 course cards fade in as a 2x3 grid (staggered)
 * 4-5.5s:  Cursor appears, moves to CENTER of Social Agent Academy card
 * 5.5-6s:  Hover glow on Social Agent Academy card
 * 6-6.3s:  Click pulse animation fires at cursor position
 * 6.3-9s:  Featured detail panel (Social Agent Academy PRO) expands
 * 9-10.5s: Overview with progress bars fades in
 * 10.5-12s: Gentle fade to loop
 */

import React from 'react';
import { AnimationCanvas, CANVAS_W, COLORS } from './PortalFrame';

const CW = CANVAS_W;

const COURSES = [
  { label: 'Social Agent Academy', tag: 'POPULAR', color: COLORS.gold, icon: '📱' },
  { label: 'AI Agent Accelerator', tag: 'NEW', color: COLORS.cyan, icon: '🤖' },
  { label: 'Paid Ads Mastery', tag: '', color: COLORS.green, icon: '📢' },
  { label: 'Branding Accelerator', tag: '', color: '#a855f7', icon: '✨' },
  { label: 'Agent Attraction', tag: '', color: COLORS.gold, icon: '🎯' },
  { label: 'Investor Training', tag: '', color: COLORS.green, icon: '📈' },
];

/* Card grid layout constants */
const CARD_W = (CW - 70) / 2; // 160
const CARD_H = 96;
const CARD_GAP_X = 20;
const CARD_GAP_Y = 110;
const GRID_X = 25;
const GRID_Y = 115;

/* Cursor target: center of Social Agent Academy card (index 0) */
const CURSOR_TARGET_X = GRID_X + CARD_W / 2;   // 25 + 80 = 105
const CURSOR_TARGET_Y = GRID_Y + CARD_H / 2;   // 115 + 48 = 163

export function CoursesAnimation() {
  return (
    <>
      <style>{`
        /* ---- Header ---- */
        @keyframes crs-header {
          0%, 2% { opacity: 0; transform: translateY(-12px); }
          10%, 85% { opacity: 1; transform: translateY(0); }
          95%, 100% { opacity: 0; }
        }
        @keyframes crs-gold-line {
          0%, 4% { width: 0; opacity: 0; }
          12% { width: 60px; opacity: 1; }
          85% { opacity: 1; }
          95%, 100% { opacity: 0; }
        }

        /* ---- Cards grid ---- */
        @keyframes crs-card {
          0%, 100% { opacity: 0; transform: translateY(18px); }
          14%, 85% { opacity: 1; transform: translateY(0); }
          93% { opacity: 0; }
        }

        /* ---- Cursor movement ---- */
        @keyframes crs-cursor {
          0%, 28% { transform: translate(60px, 80px); opacity: 0; }
          32% { transform: translate(60px, 80px); opacity: 1; }
          42% { transform: translate(${CURSOR_TARGET_X}px, ${CURSOR_TARGET_Y}px); opacity: 1; }
          43%, 50% { transform: translate(${CURSOR_TARGET_X}px, ${CURSOR_TARGET_Y}px); opacity: 1; }
          51% { transform: translate(${CURSOR_TARGET_X}px, ${CURSOR_TARGET_Y + 2}px); opacity: 1; }
          52% { transform: translate(${CURSOR_TARGET_X}px, ${CURSOR_TARGET_Y}px); opacity: 1; }
          56% { opacity: 0; transform: translate(${CURSOR_TARGET_X}px, ${CURSOR_TARGET_Y}px); }
          100% { opacity: 0; transform: translate(${CURSOR_TARGET_X}px, ${CURSOR_TARGET_Y}px); }
        }

        /* ---- Hover glow on card 0 ---- */
        @keyframes crs-hover-glow {
          0%, 38%, 75%, 100% { opacity: 0; }
          42%, 52% { opacity: 1; }
          56% { opacity: 0; }
        }

        /* ---- Click pulse ---- */
        @keyframes crs-click-pulse {
          0%, 49% { r: 0; opacity: 0; }
          50% { r: 2; opacity: 0.9; }
          54% { r: 18; opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes crs-click-pulse2 {
          0%, 50% { r: 0; opacity: 0; }
          51% { r: 2; opacity: 0.7; }
          56% { r: 24; opacity: 0; }
          100% { opacity: 0; }
        }

        /* ---- Featured panel (Social Agent Academy PRO) ---- */
        @keyframes crs-featured {
          0%, 50%, 100% { opacity: 0; transform: translateY(12px); }
          55%, 86% { opacity: 1; transform: translateY(0); }
          93% { opacity: 0; transform: translateY(0); }
        }
        @keyframes crs-featured-module {
          0%, 54%, 100% { opacity: 0; transform: translateY(10px); }
          60%, 86% { opacity: 1; transform: translateY(0); }
          93% { opacity: 0; }
        }

        /* ---- Tag pulse ---- */
        @keyframes crs-tag-pulse {
          0%, 50% { opacity: 0.8; }
          55% { opacity: 1; }
          60% { opacity: 0.8; }
          65% { opacity: 1; }
          70% { opacity: 0.8; }
        }

        /* ---- Live dot pulse ---- */
        @keyframes crs-live-dot {
          0%, 100% { opacity: 0.4; r: 3; }
          50% { opacity: 1; r: 3.5; }
        }

        /* ---- Background sparkle dots ---- */
        @keyframes crs-sparkle1 {
          0%, 100% { opacity: 0; }
          20%, 30% { opacity: 0.7; }
          50% { opacity: 0; }
          70%, 80% { opacity: 0.5; }
        }
        @keyframes crs-sparkle2 {
          0%, 100% { opacity: 0; }
          10% { opacity: 0; }
          40%, 50% { opacity: 0.6; }
          65% { opacity: 0; }
          85%, 95% { opacity: 0.4; }
        }
        @keyframes crs-sparkle3 {
          0%, 15% { opacity: 0; }
          30%, 45% { opacity: 0.5; }
          60%, 100% { opacity: 0; }
        }

        /* ---- CTA button shimmer ---- */
        @keyframes crs-cta-shimmer {
          0%, 55% { opacity: 0; }
          62% { opacity: 0.3; }
          68% { opacity: 0; }
          100% { opacity: 0; }
        }

      `}</style>

      <AnimationCanvas>
        {/* ============================================================ */}
        {/* Background sparkle dots                                      */}
        {/* ============================================================ */}
        <circle cx="340" cy="50" r="1.5" fill={COLORS.gold} style={{ animation: 'crs-sparkle1 12s ease infinite' }} />
        <circle cx="55" cy="400" r="1.2" fill={COLORS.gold} style={{ animation: 'crs-sparkle2 12s ease infinite' }} />
        <circle cx="320" cy="580" r="1" fill={COLORS.gold} style={{ animation: 'crs-sparkle3 12s ease infinite' }} />

        {/* ============================================================ */}
        {/* Header                                                       */}
        {/* ============================================================ */}
        <g style={{ animation: 'crs-header 12s ease-in-out infinite' }}>
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
            COURSES
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

        {/* ============================================================ */}
        {/* Course cards grid (2x3)                                      */}
        {/* ============================================================ */}
        {COURSES.map((course, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const cardX = GRID_X + col * (CARD_W + CARD_GAP_X);
          const cardY = GRID_Y + row * CARD_GAP_Y;
          const delay = `${1.5 + i * 0.2}s`;

          return (
            <g key={i} style={{ animation: `crs-card 12s ease-out ${delay} infinite` }}>
              {/* Card background */}
              <rect
                x={cardX}
                y={cardY}
                width={CARD_W}
                height={CARD_H}
                rx="10"
                fill={COLORS.cardBg}
                stroke={`${course.color}18`}
                strokeWidth="1"
              />

              {/* Icon area with colored glow */}
              <rect
                x={cardX + 10}
                y={cardY + 10}
                width="40"
                height="40"
                rx="10"
                fill={`${course.color}18`}
                stroke={`${course.color}35`}
                strokeWidth="1"
              />
              {/* Glow behind icon */}
              <circle
                cx={cardX + 30}
                cy={cardY + 30}
                r="14"
                fill={`${course.color}10`}
              />
              {/* Emoji icon (bigger) */}
              <text
                x={cardX + 30}
                y={cardY + 36}
                textAnchor="middle"
                fontSize="20"
              >
                {course.icon}
              </text>

              {/* Title */}
              <text
                x={cardX + 10}
                y={cardY + 68}
                fill={COLORS.textPrimary}
                fontSize="11"
                fontWeight="600"
                fontFamily="system-ui, sans-serif"
              >
                {course.label}
              </text>

              {/* Tag badge (more prominent) */}
              {course.tag && (
                <g style={{ animation: course.tag === 'NEW' ? 'crs-tag-pulse 12s ease infinite' : undefined }}>
                  <rect
                    x={cardX + 10}
                    y={cardY + 74}
                    width={course.tag.length * 7.5 + 14}
                    height="16"
                    rx="8"
                    fill={course.tag === 'NEW' ? 'rgba(0,191,255,0.2)' : 'rgba(255,215,0,0.2)'}
                    stroke={course.tag === 'NEW' ? 'rgba(0,191,255,0.5)' : 'rgba(255,215,0,0.5)'}
                    strokeWidth="1"
                  />
                  <text
                    x={cardX + 10 + (course.tag.length * 7.5 + 14) / 2}
                    y={cardY + 85}
                    textAnchor="middle"
                    fill={course.tag === 'NEW' ? COLORS.cyan : COLORS.gold}
                    fontSize="8"
                    fontWeight="800"
                    fontFamily="system-ui, sans-serif"
                    letterSpacing="0.5"
                  >
                    {course.tag}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* ============================================================ */}
        {/* Hover glow on Social Agent Academy (card 0)                  */}
        {/* ============================================================ */}
        <rect
          x={GRID_X}
          y={GRID_Y}
          width={CARD_W}
          height={CARD_H}
          rx="10"
          fill="none"
          stroke={COLORS.gold}
          strokeWidth="2"
          style={{ animation: 'crs-hover-glow 12s ease infinite' }}
        />
        {/* Gold glow shadow effect behind card 0 */}
        <rect
          x={GRID_X - 2}
          y={GRID_Y - 2}
          width={CARD_W + 4}
          height={CARD_H + 4}
          rx="12"
          fill="none"
          stroke={COLORS.gold}
          strokeWidth="1"
          opacity="0"
          filter="url(#crs-gold-glow)"
          style={{ animation: 'crs-hover-glow 12s ease infinite' }}
        />

        {/* ============================================================ */}
        {/* Click pulse circles at cursor position                       */}
        {/* ============================================================ */}
        <circle
          cx={CURSOR_TARGET_X}
          cy={CURSOR_TARGET_Y}
          r="0"
          fill="none"
          stroke={COLORS.gold}
          strokeWidth="2.5"
          style={{ animation: 'crs-click-pulse 12s ease-out infinite' }}
        />
        <circle
          cx={CURSOR_TARGET_X}
          cy={CURSOR_TARGET_Y}
          r="0"
          fill="none"
          stroke={COLORS.gold}
          strokeWidth="1.5"
          style={{ animation: 'crs-click-pulse2 12s ease-out infinite' }}
        />

        {/* ============================================================ */}
        {/* Featured: Social Agent Academy PRO                           */}
        {/* ============================================================ */}
        <g style={{ animation: 'crs-featured 12s ease-out infinite' }}>
          {/* SVG filter for gold glow */}
          <defs>
            <filter id="crs-gold-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Main panel background */}
          <rect
            x="25"
            y="100"
            width={CW - 50}
            height="410"
            rx="14"
            fill={COLORS.cardBg}
            stroke={`${COLORS.gold}30`}
            strokeWidth="1.5"
          />
          {/* Gold left border accent */}
          <rect
            x="25"
            y="114"
            width="3"
            height="382"
            rx="1.5"
            fill={COLORS.gold}
            opacity="0.6"
          />

          {/* Featured header band */}
          <rect
            x="25"
            y="100"
            width={CW - 50}
            height="44"
            rx="14"
            fill={`${COLORS.gold}0a`}
          />
          <rect
            x="25"
            y="130"
            width={CW - 50}
            height="14"
            fill={`${COLORS.gold}0a`}
          />
          <text
            x="50"
            y="120"
            fill={COLORS.gold}
            fontSize="9"
            fontWeight="800"
            fontFamily="system-ui, sans-serif"
            letterSpacing="1.5"
          >
            FEATURED COURSE
          </text>

          {/* Large icon */}
          <rect
            x="50"
            y="148"
            width="54"
            height="54"
            rx="14"
            fill={`${COLORS.gold}15`}
            stroke={`${COLORS.gold}30`}
            strokeWidth="1"
          />
          <text x="77" y="183" textAnchor="middle" fontSize="28">📱</text>

          {/* Title */}
          <text
            x="116"
            y="170"
            fill={COLORS.textPrimary}
            fontSize="16"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            Social Agent
          </text>
          <text
            x="116"
            y="188"
            fill={COLORS.textPrimary}
            fontSize="16"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            Academy PRO
          </text>

          {/* POPULAR badge */}
          <rect
            x="116"
            y="196"
            width="66"
            height="18"
            rx="9"
            fill="rgba(255,215,0,0.2)"
            stroke="rgba(255,215,0,0.5)"
            strokeWidth="1"
          />
          <text
            x="149"
            y="208"
            textAnchor="middle"
            fill={COLORS.gold}
            fontSize="8"
            fontWeight="800"
            fontFamily="system-ui, sans-serif"
            letterSpacing="0.5"
          >
            POPULAR
          </text>

          {/* Description */}
          <text x="50" y="236" fill={COLORS.textSecondary} fontSize="11" fontFamily="system-ui, sans-serif">
            Master organic social media to generate leads
          </text>
          <text x="50" y="250" fill={COLORS.textSecondary} fontSize="11" fontFamily="system-ui, sans-serif">
            without paid ads. Updated annually with latest
          </text>
          <text x="50" y="264" fill={COLORS.textSecondary} fontSize="11" fontFamily="system-ui, sans-serif">
            strategies.
          </text>

          {/* 3 Module cards */}
          {[
            { label: 'Content Creation', desc: 'Posts that convert', icon: '📝' },
            { label: 'Lead Generation', desc: 'DM scripts & funnels', icon: '🎯' },
            { label: 'Brand Building', desc: 'Authority positioning', icon: '👑' },
          ].map((mod, i) => (
            <g
              key={i}
              style={{
                animation: `crs-featured-module 12s ease-out ${0.3 + i * 0.15}s infinite`,
              }}
            >
              <rect
                x="50"
                y={280 + i * 50}
                width={CW - 100}
                height="42"
                rx="8"
                fill="rgba(255,215,0,0.04)"
                stroke="rgba(255,215,0,0.12)"
                strokeWidth="1"
              />
              <text x="64" y={304 + i * 50} fontSize="14">{mod.icon}</text>
              <text
                x="84"
                y={300 + i * 50}
                fill={COLORS.gold}
                fontSize="11"
                fontWeight="600"
                fontFamily="system-ui, sans-serif"
              >
                {mod.label}
              </text>
              <text
                x="84"
                y={314 + i * 50}
                fill={COLORS.textMuted}
                fontSize="9"
                fontFamily="system-ui, sans-serif"
              >
                {mod.desc}
              </text>
            </g>
          ))}

          {/* Weekly Live Call badge */}
          <rect
            x="50"
            y="432"
            width="130"
            height="22"
            rx="11"
            fill="rgba(0,255,136,0.1)"
            stroke="rgba(0,255,136,0.3)"
            strokeWidth="1"
          />
          <circle
            cx="66"
            cy="443"
            r="3"
            fill={COLORS.green}
            style={{ animation: 'crs-live-dot 2s ease infinite' }}
          />
          <text
            x="76"
            y="447"
            fill={COLORS.green}
            fontSize="9"
            fontWeight="600"
            fontFamily="system-ui, sans-serif"
          >
            Weekly Live Call
          </text>

          {/* Start Course CTA button */}
          <rect
            x={CW / 2 - 70}
            y="460"
            width="140"
            height="34"
            rx="17"
            fill={`${COLORS.gold}18`}
            stroke={COLORS.gold}
            strokeWidth="1.2"
          />
          {/* Shimmer overlay on CTA */}
          <rect
            x={CW / 2 - 70}
            y="460"
            width="140"
            height="34"
            rx="17"
            fill={COLORS.gold}
            style={{ animation: 'crs-cta-shimmer 12s ease infinite' }}
          />
          <text
            x={CW / 2}
            y="481"
            textAnchor="middle"
            fill={COLORS.gold}
            fontSize="12"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
            letterSpacing="0.3"
          >
            Start Course
          </text>
        </g>

        {/* ============================================================ */}
        {/* Animated cursor                                              */}
        {/* ============================================================ */}
        <g style={{ animation: 'crs-cursor 12s ease-in-out infinite' }}>
          <path
            d="M0 0 L0 14 L4 10 L7 16 L10 15 L7 9 L12 8 Z"
            fill={COLORS.gold}
            stroke="#000"
            strokeWidth="0.5"
          />
        </g>
      </AnimationCanvas>
    </>
  );
}
