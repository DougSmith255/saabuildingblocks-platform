'use client';

/**
 * OnboardingAnimation — "Day One, You're Guided"
 *
 * Portrait 390x680 canvas. No portal chrome.
 *
 * Choreography (10s loop):
 * 0-1s:    Welcome header fades in with gold glow + "Let's get started" text
 * 1-5s:    5 onboarding steps appear as checklist (staggered 0.6s each)
 * 3-7s:    Cursor moves to each step, clicks, checkmarks appear with gold glow
 * 5-8s:    Progress bar fills from 0 to 330px with glow underneath
 * 8-9.5s:  "You're all set!" badge appears with prominent green glow + sparkles
 * 9.5-10s: Gentle fade preparing to loop
 */

import React from 'react';
import { AnimationCanvas, CANVAS_W, COLORS } from './PortalFrame';

const CW = CANVAS_W;

const STEPS = [
  'Set up your profile',
  'Complete your link page',
  'Customize your attraction page',
  'Review weekly team calls',
  'Explore elite courses',
];

/* Step layout constants */
const STEP_Y_START = 152;
const STEP_H = 62;
const STEP_GAP = 10;
const stepY = (i: number) => STEP_Y_START + i * (STEP_H + STEP_GAP);
const CHECK_CX = 60;
const checkCY = (i: number) => stepY(i) + STEP_H / 2;

/* Progress bar constants */
const BAR_X = 30;
const BAR_Y = 528;
const BAR_W = CW - 60; // 330
const BAR_H = 10;

/* Cursor click positions (checkbox centers) */
const CURSOR_POSITIONS = STEPS.map((_, i) => ({
  x: CHECK_CX,
  y: checkCY(i),
}));

export function OnboardingAnimation() {
  return (
    <>
      <style>{`
        /* ===================== WELCOME ===================== */
        @keyframes onb-welcome {
          0%, 2% { opacity: 0; transform: translateY(-14px); }
          7%, 90% { opacity: 1; transform: translateY(0); }
          97%, 100% { opacity: 0; transform: translateY(-6px); }
        }

        /* ===================== STEP CARDS ===================== */
        @keyframes onb-step-in {
          0%, 100% { opacity: 0; transform: translateX(-20px); }
          12%, 88% { opacity: 1; transform: translateX(0); }
          95% { opacity: 0; transform: translateX(0); }
        }

        /* ===================== CHECKMARKS ===================== */
        @keyframes onb-check {
          0%, 100% { opacity: 0; transform: scale(0); }
          10% { opacity: 1; transform: scale(1.25); }
          18%, 84% { opacity: 1; transform: scale(1); }
          92% { opacity: 0; transform: scale(1); }
        }

        /* ===================== PROGRESS BAR ===================== */
        @keyframes onb-progress-bar-bg {
          0%, 14% { opacity: 0; }
          18%, 90% { opacity: 1; }
          97%, 100% { opacity: 0; }
        }
        @keyframes onb-progress-fill {
          0%, 50% { width: 0; }
          55% { width: 66px; }
          60% { width: 132px; }
          65% { width: 198px; }
          70% { width: 264px; }
          78%, 90% { width: 330px; }
          97%, 100% { width: 330px; opacity: 0; }
        }

        /* ===================== BADGE ===================== */
        @keyframes onb-badge {
          0%, 78% { opacity: 0; transform: scale(0.6); }
          83% { opacity: 1; transform: scale(1.08); }
          87%, 91% { opacity: 1; transform: scale(1); }
          98%, 100% { opacity: 0; transform: scale(0.85); }
        }
        @keyframes onb-badge-glow {
          0%, 78% { opacity: 0; }
          83% { opacity: 0.9; }
          87%, 91% { opacity: 0.6; }
          98%, 100% { opacity: 0; }
        }

        /* ===================== SPARKLES ===================== */
        @keyframes onb-sparkle-1 {
          0%, 80% { opacity: 0; transform: translate(0, 0) scale(0); }
          84% { opacity: 1; transform: translate(-28px, -22px) scale(1.2); }
          90% { opacity: 0; transform: translate(-40px, -32px) scale(0); }
          100% { opacity: 0; }
        }
        @keyframes onb-sparkle-2 {
          0%, 81% { opacity: 0; transform: translate(0, 0) scale(0); }
          85% { opacity: 1; transform: translate(30px, -18px) scale(1); }
          91% { opacity: 0; transform: translate(44px, -28px) scale(0); }
          100% { opacity: 0; }
        }
        @keyframes onb-sparkle-3 {
          0%, 82% { opacity: 0; transform: translate(0, 0) scale(0); }
          86% { opacity: 1; transform: translate(0px, -30px) scale(1.3); }
          92% { opacity: 0; transform: translate(0px, -44px) scale(0); }
          100% { opacity: 0; }
        }

        /* ===================== CURSOR ===================== */
        @keyframes onb-cursor {
          0%, 5% { transform: translate(${CW / 2}px, 110px); opacity: 0; }
          8% { transform: translate(${CW / 2}px, 110px); opacity: 1; }
          /* Move to step 1 */
          14% { transform: translate(${CURSOR_POSITIONS[0].x}px, ${CURSOR_POSITIONS[0].y}px); }
          16%, 20% { transform: translate(${CURSOR_POSITIONS[0].x}px, ${CURSOR_POSITIONS[0].y}px); }
          /* Move to step 2 */
          25% { transform: translate(${CURSOR_POSITIONS[1].x}px, ${CURSOR_POSITIONS[1].y}px); }
          27%, 31% { transform: translate(${CURSOR_POSITIONS[1].x}px, ${CURSOR_POSITIONS[1].y}px); }
          /* Move to step 3 */
          36% { transform: translate(${CURSOR_POSITIONS[2].x}px, ${CURSOR_POSITIONS[2].y}px); }
          38%, 42% { transform: translate(${CURSOR_POSITIONS[2].x}px, ${CURSOR_POSITIONS[2].y}px); }
          /* Move to step 4 */
          47% { transform: translate(${CURSOR_POSITIONS[3].x}px, ${CURSOR_POSITIONS[3].y}px); }
          49%, 53% { transform: translate(${CURSOR_POSITIONS[3].x}px, ${CURSOR_POSITIONS[3].y}px); }
          /* Move to step 5 */
          58% { transform: translate(${CURSOR_POSITIONS[4].x}px, ${CURSOR_POSITIONS[4].y}px); }
          60%, 64% { transform: translate(${CURSOR_POSITIONS[4].x}px, ${CURSOR_POSITIONS[4].y}px); }
          /* Drift away */
          72% { transform: translate(${CW / 2 + 40}px, 490px); opacity: 1; }
          78% { transform: translate(${CW / 2 + 40}px, 490px); opacity: 0; }
          100% { transform: translate(${CW / 2 + 40}px, 490px); opacity: 0; }
        }

        /* ===================== CLICK PULSE ===================== */
        @keyframes onb-click-pulse {
          0%, 100% { r: 0; opacity: 0; }
          5% { r: 3; opacity: 0.9; }
          30% { r: 18; opacity: 0; }
          31% { r: 0; opacity: 0; }
        }

        /* ===================== PROGRESS GLOW ===================== */
        @keyframes onb-progress-glow {
          0%, 50% { opacity: 0; width: 0; }
          55% { opacity: 0.4; width: 66px; }
          60% { opacity: 0.5; width: 132px; }
          65% { opacity: 0.6; width: 198px; }
          70% { opacity: 0.7; width: 264px; }
          78%, 88% { opacity: 0.8; width: 330px; }
          95%, 100% { opacity: 0; width: 330px; }
        }
      `}</style>

      <AnimationCanvas>
        {/* ==================== SVG DEFS ==================== */}
        <defs>
          {/* Gold glow for welcome text */}
          <filter id="onb-gold-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0.2  0 0.85 0 0 0.1  0 0 0 0 0  0 0 0 0.6 0"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gold glow for checkmarks */}
          <filter id="onb-check-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0.2  0 0.85 0 0 0.1  0 0 0 0 0  0 0 0 0.7 0"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Green glow for badge */}
          <filter id="onb-green-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0.2  0 0 0.5 0 0  0 0 0 0.8 0"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gold glow for progress bar */}
          <filter id="onb-bar-glow" x="-10%" y="-200%" width="120%" height="500%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0.2  0 0.85 0 0 0.1  0 0 0 0 0  0 0 0 0.5 0"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* ClipPath for progress bar fill */}
          <clipPath id="onb-bar-clip">
            <rect x={BAR_X} y={BAR_Y} width={BAR_W} height={BAR_H} rx="5" />
          </clipPath>
        </defs>

        {/* ==================== SECTION LABEL ==================== */}
        <g style={{ animation: 'onb-welcome 10s ease-in-out infinite' }}>
          <text
            x={CW / 2}
            y="88"
            textAnchor="middle"
            fill={COLORS.gold}
            fontSize="13"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
            letterSpacing="2"
            opacity="0.7"
          >
            ONBOARDING
          </text>
          <rect
            x={CW / 2 - 30}
            y="98"
            width="60"
            height="1.5"
            rx="0.75"
            fill={COLORS.gold}
            opacity="0.3"
          />
        </g>

        {/* ==================== ONBOARDING STEP CARDS ==================== */}
        {STEPS.map((step, i) => {
          const sy = stepY(i);
          const cy = checkCY(i);
          const stepDelay = `${0.8 + i * 0.5}s`;
          const checkDelay = `${2.0 + i * 1.0}s`;

          return (
            <g key={i}>
              {/* Step row - slides in from left */}
              <g
                style={{
                  animation: `onb-step-in 10s ease-out ${stepDelay} infinite`,
                  opacity: 0,
                }}
              >
                {/* Card background */}
                <rect
                  x="30"
                  y={sy}
                  width={CW - 60}
                  height={STEP_H}
                  rx="10"
                  fill={COLORS.cardBg}
                  stroke={COLORS.cardBorder}
                  strokeWidth="1"
                />

                {/* Gold accent bar on left edge */}
                <rect
                  x="30"
                  y={sy + 8}
                  width="2.5"
                  height={STEP_H - 16}
                  rx="1.25"
                  fill={COLORS.gold}
                  opacity="0.6"
                />

                {/* Checkbox circle (empty) */}
                <circle
                  cx={CHECK_CX}
                  cy={cy}
                  r="13"
                  fill="none"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1.5"
                />

                {/* Step number */}
                <text
                  x={CHECK_CX}
                  y={cy + 5}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.25)"
                  fontSize="12"
                  fontWeight="700"
                  fontFamily="system-ui, sans-serif"
                >
                  {i + 1}
                </text>

                {/* Step text */}
                <text
                  x="88"
                  y={cy + 5}
                  fill={COLORS.textPrimary}
                  fontSize="14"
                  fontWeight="500"
                  fontFamily="system-ui, sans-serif"
                >
                  {step}
                </text>
              </g>

              {/* Gold checkmark with glow - appears after cursor click */}
              <g
                style={{
                  animation: `onb-check 10s ease-out ${checkDelay} infinite`,
                  transformOrigin: `${CHECK_CX}px ${cy}px`,
                  opacity: 0,
                }}
                filter="url(#onb-check-glow)"
              >
                <circle cx={CHECK_CX} cy={cy} r="13" fill={COLORS.gold} />
                <path
                  d={`M${CHECK_CX - 6} ${cy} L${CHECK_CX - 1} ${cy + 5} L${CHECK_CX + 7} ${cy - 5}`}
                  fill="none"
                  stroke="#000"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </g>
          );
        })}

        {/* ==================== PROGRESS BAR ==================== */}
        <g style={{ animation: 'onb-progress-bar-bg 10s ease-in-out infinite' }}>
          {/* Bar background */}
          <rect
            x={BAR_X}
            y={BAR_Y}
            width={BAR_W}
            height={BAR_H}
            rx="5"
            fill="rgba(255,255,255,0.06)"
          />

          {/* Glow underneath the bar fill */}
          <rect
            x={BAR_X}
            y={BAR_Y}
            height={BAR_H}
            rx="5"
            fill={COLORS.gold}
            filter="url(#onb-bar-glow)"
            clipPath="url(#onb-bar-clip)"
            style={{
              animation: 'onb-progress-glow 10s ease-in-out infinite',
            }}
          />

          {/* Bar fill — clipped to prevent overflow */}
          <rect
            x={BAR_X}
            y={BAR_Y}
            height={BAR_H}
            rx="5"
            fill={COLORS.gold}
            clipPath="url(#onb-bar-clip)"
            style={{
              animation: 'onb-progress-fill 10s ease-in-out infinite',
            }}
          />

          {/* Progress text */}
          <text
            x={BAR_X}
            y={BAR_Y + 26}
            fill={COLORS.textSecondary}
            fontSize="11"
            fontWeight="500"
            fontFamily="system-ui, sans-serif"
          >
            Onboarding Progress
          </text>
        </g>

        {/* ==================== COMPLETION BADGE ==================== */}
        <g
          style={{
            animation: 'onb-badge 10s ease-out infinite',
            transformOrigin: `${CW / 2}px 608px`,
            opacity: 0,
          }}
        >
          {/* Green glow behind badge — matches pill shape */}
          <rect
            x={CW / 2 - 106}
            y="584"
            width="212"
            height="52"
            rx="26"
            fill={COLORS.green}
            opacity="0.12"
            style={{ animation: 'onb-badge-glow 10s ease-out infinite' }}
            filter="url(#onb-green-glow)"
          />

          {/* Badge pill */}
          <rect
            x={CW / 2 - 100}
            y="588"
            width="200"
            height="44"
            rx="22"
            fill="rgba(0,255,136,0.12)"
            stroke="rgba(0,255,136,0.5)"
            strokeWidth="1.5"
          />

          {/* Checkmark icon in badge */}
          <circle cx={CW / 2 - 56} cy="610" r="10" fill={COLORS.green} opacity="0.2" />
          <path
            d={`M${CW / 2 - 62} 610 L${CW / 2 - 58} 614 L${CW / 2 - 50} 606`}
            fill="none"
            stroke={COLORS.green}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Badge text */}
          <text
            x={CW / 2 + 10}
            y="616"
            textAnchor="middle"
            fill={COLORS.green}
            fontSize="16"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
            letterSpacing="0.3"
          >
            You&apos;re all set!
          </text>

          {/* ===== SPARKLES ===== */}
          <circle
            cx={CW / 2}
            cy="608"
            r="3"
            fill={COLORS.gold}
            style={{
              animation: 'onb-sparkle-1 10s ease-out infinite',
              transformOrigin: `${CW / 2}px 608px`,
              opacity: 0,
            }}
          />
          <circle
            cx={CW / 2}
            cy="608"
            r="2.5"
            fill={COLORS.gold}
            style={{
              animation: 'onb-sparkle-2 10s ease-out infinite',
              transformOrigin: `${CW / 2}px 608px`,
              opacity: 0,
            }}
          />
          <circle
            cx={CW / 2}
            cy="608"
            r="3.5"
            fill={COLORS.gold}
            style={{
              animation: 'onb-sparkle-3 10s ease-out infinite',
              transformOrigin: `${CW / 2}px 608px`,
              opacity: 0,
            }}
          />
        </g>

        {/* ==================== ANIMATED CURSOR ==================== */}
        <g
          style={{
            animation: 'onb-cursor 10s ease-in-out infinite',
            opacity: 0,
          }}
        >
          <path
            d="M0 0 L0 14 L4 10 L7 16 L10 15 L7 9 L12 8 Z"
            fill={COLORS.gold}
            stroke="#000"
            strokeWidth="0.5"
          />
        </g>

        {/* ===== CLICK PULSES — one per step, timed with cursor pauses ===== */}
        {CURSOR_POSITIONS.map((pos, i) => (
          <circle
            key={`pulse-${i}`}
            cx={pos.x}
            cy={pos.y}
            r="0"
            fill="none"
            stroke={COLORS.gold}
            strokeWidth="2"
            opacity="0"
            style={{
              animation: `onb-click-pulse 10s ease-out ${1.6 + i * 1.1}s infinite`,
            }}
          />
        ))}
      </AnimationCanvas>
    </>
  );
}
