'use client';

/**
 * PortalOverviewAnimation — "Your Command Center"
 *
 * Portrait 390x680 canvas. No portal chrome.
 *
 * Choreography (12s loop):
 * 0-1.5s:   Dashboard header fades in with gold underline
 * 1.5-4s:   4 stat cards fly in (2x2 grid), numbers count up, trend arrows
 * 4-7s:     Quick-action grid cards appear (2x3 grid) with real icons
 * 7-8.5s:   Cursor moves to "Link Page" card, hover glow
 * 8.5-10s:  Cursor moves to PWA install button, click pulse
 * 10-11s:   Green checkmark appears on install button
 * 11-12s:   Gentle fade to loop
 */

import React from 'react';
import { AnimationCanvas, CANVAS_W, COLORS } from './PortalFrame';

const CW = CANVAS_W;

const STAT_CARDS = [
  { label: 'Page Views', value: '247', color: COLORS.gold, trend: '+12%' },
  { label: 'Total Clicks', value: '89', color: COLORS.green, trend: '+8%' },
  { label: 'Link Page', value: 'Live', color: COLORS.cyan, trend: '' },
  { label: 'Agent Page', value: 'Active', color: '#a855f7', trend: '' },
];

const ACTION_CARDS = [
  { label: 'Get Support', desc: 'Need help?', color: COLORS.gold },
  { label: 'Link Page', desc: 'Your link page', color: COLORS.green },
  { label: 'Agent Attraction', desc: 'Recruitment page', color: '#a855f7' },
  { label: 'Team Calls', desc: 'Live calls', color: COLORS.cyan },
  { label: 'Templates', desc: 'Marketing', color: COLORS.gold },
  { label: 'Elite Courses', desc: 'Academy', color: '#a855f7' },
];

/* Simple SVG icon paths for each action card, designed for ~16x16 viewBox centered in a 28px circle */
function ActionIcon({ index, color }: { index: number; color: string }) {
  const icons: React.ReactNode[] = [
    /* 0 - Get Support: question mark in circle */
    <g key="support">
      <circle cx="0" cy="0" r="7" fill="none" stroke={color} strokeWidth="1.2" />
      <text x="0" y="1" textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="10" fontWeight="700" fontFamily="system-ui, sans-serif">?</text>
    </g>,
    /* 1 - Link Page: chain link */
    <g key="link">
      <path d="M-3 -2 Q-3 -5 0 -5 L3 -5 Q6 -5 6 -2 Q6 1 3 1 L2 1" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M3 2 Q3 5 0 5 L-3 5 Q-6 5 -6 2 Q-6 -1 -3 -1 L-2 -1" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    </g>,
    /* 2 - Agent Attraction: magnet */
    <g key="magnet">
      <path d="M-5 -3 L-5 2 Q-5 7 0 7 Q5 7 5 2 L5 -3" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <line x1="-5" y1="-1" x2="-5" y2="-5" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="5" y1="-1" x2="5" y2="-5" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </g>,
    /* 3 - Team Calls: video camera */
    <g key="calls">
      <rect x="-7" y="-4" width="10" height="8" rx="1.5" fill="none" stroke={color} strokeWidth="1.3" />
      <path d="M3 -2.5 L7 -4.5 L7 4.5 L3 2.5" fill="none" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
    </g>,
    /* 4 - Templates: document with lines */
    <g key="templates">
      <rect x="-5" y="-7" width="10" height="14" rx="1.5" fill="none" stroke={color} strokeWidth="1.2" />
      <line x1="-2.5" y1="-3" x2="2.5" y2="-3" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <line x1="-2.5" y1="0" x2="2.5" y2="0" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <line x1="-2.5" y1="3" x2="1" y2="3" stroke={color} strokeWidth="1" strokeLinecap="round" />
    </g>,
    /* 5 - Elite Courses: graduation cap */
    <g key="courses">
      <path d="M-7 0 L0 -4 L7 0 L0 4 Z" fill="none" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M-4 1.5 L-4 5 L0 7 L4 5 L4 1.5" fill="none" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
      <line x1="7" y1="0" x2="7" y2="5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </g>,
  ];

  return icons[index] || null;
}

/* ---- Layout constants ---- */
const CARD_W = (CW - 70) / 2; // ~160
const ACTION_GRID_Y = 330;
const ACTION_ROW_H = 68;
// Link Page card position (index 1, col 1, row 0)
const LINK_CARD_X = 25 + 1 * (CARD_W + 20);
const LINK_CARD_Y = ACTION_GRID_Y;
const LINK_CARD_CX = LINK_CARD_X + CARD_W / 2;
const LINK_CARD_CY = LINK_CARD_Y + 29;
// PWA popup
const PWA_X = 25;
const PWA_Y = 540;
const PWA_W = CW - 50;
const PWA_H = 120;
const INSTALL_BTN_X = PWA_X + PWA_W - 70;
const INSTALL_BTN_Y = PWA_Y + 42;
const INSTALL_BTN_CX = INSTALL_BTN_X + 27;
const INSTALL_BTN_CY = INSTALL_BTN_Y + 14;

export function PortalOverviewAnimation() {
  return (
    <>
      <style>{`
        /* ---- Header ---- */
        @keyframes pov-header {
          0%, 2% { opacity: 0; transform: translateY(-10px); }
          10%, 88% { opacity: 1; transform: translateY(0); }
          96%, 100% { opacity: 0; }
        }
        @keyframes pov-underline {
          0%, 5% { width: 0; opacity: 0; }
          14%, 88% { width: 60px; opacity: 1; }
          96%, 100% { opacity: 0; }
        }

        /* ---- Stat cards ---- */
        @keyframes pov-stat {
          0%, 100% { opacity: 0; transform: translateY(20px); }
          15%, 86% { opacity: 1; transform: translateY(0); }
          94% { opacity: 0; }
        }
        @keyframes pov-num {
          0%, 12% { opacity: 0; }
          20% { opacity: 1; }
        }
        @keyframes pov-trend {
          0%, 20% { opacity: 0; transform: translateY(4px); }
          28%, 86% { opacity: 1; transform: translateY(0); }
          94% { opacity: 0; }
        }

        /* ---- Action cards ---- */
        @keyframes pov-action {
          0%, 100% { opacity: 0; transform: translateY(14px); }
          15%, 83% { opacity: 1; transform: translateY(0); }
          92% { opacity: 0; }
        }

        /* ---- Cursor movement ---- */
        @keyframes pov-cursor {
          0%, 30% { transform: translate(${CW / 2}px, 200px); opacity: 0; }
          38% { opacity: 1; transform: translate(${CW / 2}px, 200px); }
          50% { transform: translate(${LINK_CARD_CX}px, ${LINK_CARD_CY}px); opacity: 1; }
          58% { transform: translate(${LINK_CARD_CX}px, ${LINK_CARD_CY}px); opacity: 1; }
          72% { transform: translate(${INSTALL_BTN_CX}px, ${INSTALL_BTN_CY}px); opacity: 1; }
          76% { transform: translate(${INSTALL_BTN_CX}px, ${INSTALL_BTN_CY}px); opacity: 1; }
          78% { transform: translate(${INSTALL_BTN_CX}px, ${INSTALL_BTN_CY + 1}px); opacity: 1; }
          80% { transform: translate(${INSTALL_BTN_CX}px, ${INSTALL_BTN_CY}px); opacity: 1; }
          85% { transform: translate(${INSTALL_BTN_CX}px, ${INSTALL_BTN_CY}px); opacity: 1; }
          90% { opacity: 0; transform: translate(${INSTALL_BTN_CX}px, ${INSTALL_BTN_CY}px); }
          100% { opacity: 0; }
        }

        /* ---- Hover glow on Link Page card ---- */
        @keyframes pov-hover-glow {
          0%, 48%, 60%, 100% { opacity: 0; }
          52%, 58% { opacity: 1; }
        }

        /* ---- PWA popup ---- */
        @keyframes pov-pwa {
          0%, 55% { opacity: 0; transform: translateY(24px) scale(0.95); }
          65%, 88% { opacity: 1; transform: translateY(0) scale(1); }
          96%, 100% { opacity: 0; transform: translateY(0) scale(1); }
        }

        /* ---- Click pulse on install button ---- */
        @keyframes pov-click-pulse {
          0%, 76% { r: 0; opacity: 0; }
          78% { r: 4; opacity: 0.9; }
          84% { r: 22; opacity: 0; }
          100% { opacity: 0; }
        }

        /* ---- Green checkmark ---- */
        @keyframes pov-check {
          0%, 80% { opacity: 0; transform: scale(0.3); }
          84% { opacity: 1; transform: scale(1.15); }
          87%, 88% { opacity: 1; transform: scale(1); }
          96%, 100% { opacity: 0; transform: scale(1); }
        }

        /* ---- Gold dots decoration ---- */
        @keyframes pov-dots {
          0%, 6% { opacity: 0; }
          14%, 86% { opacity: 1; }
          94%, 100% { opacity: 0; }
        }
      `}</style>

      <AnimationCanvas>
        {/* ====== Background gold dot constellation ====== */}
        <g style={{ animation: 'pov-dots 12s ease infinite' }}>
          <circle cx="42" cy="38" r="1.5" fill={COLORS.gold} opacity="0.12" />
          <circle cx="350" cy="52" r="1" fill={COLORS.gold} opacity="0.10" />
          <circle cx="365" cy="120" r="1.2" fill={COLORS.gold} opacity="0.08" />
          <circle cx="30" cy="290" r="1" fill={COLORS.gold} opacity="0.10" />
          <circle cx="360" cy="310" r="1.5" fill={COLORS.gold} opacity="0.07" />
          <circle cx="52" cy="525" r="1" fill={COLORS.gold} opacity="0.09" />
        </g>

        {/* ====== Section label ====== */}
        <g style={{ animation: 'pov-header 12s ease-in-out infinite' }}>
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
            PORTAL
          </text>
          <rect
            x={CW / 2 - 20}
            y="70"
            width="40"
            height="1.5"
            rx="0.75"
            fill={COLORS.gold}
            opacity="0.3"
          />
        </g>

        {/* ====== Stat cards (2x2 grid) ====== */}
        {STAT_CARDS.map((card, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const cardX = 25 + col * (CARD_W + 20);
          const cardY = 105 + row * 90;
          const delay = `${1.5 + i * 0.3}s`;

          return (
            <g key={`stat-${i}`} style={{ animation: `pov-stat 12s ease-out ${delay} infinite` }}>
              <rect
                x={cardX}
                y={cardY}
                width={CARD_W}
                height="75"
                rx="10"
                fill={COLORS.cardBg}
                stroke={COLORS.cardBorder}
                strokeWidth="1"
              />
              {/* Subtle top accent line */}
              <rect
                x={cardX + 16}
                y={cardY}
                width="28"
                height="2"
                rx="1"
                fill={card.color}
                opacity="0.4"
              />
              <text
                x={cardX + 16}
                y={cardY + 36}
                fill={card.color}
                fontSize="22"
                fontWeight="700"
                fontFamily="system-ui, sans-serif"
                style={{ animation: `pov-num 12s ease-out ${delay} infinite` }}
              >
                {card.value}
              </text>
              {/* Trend indicator for first two cards */}
              {card.trend && (
                <g style={{ animation: `pov-trend 12s ease-out ${delay} infinite` }}>
                  <text
                    x={cardX + CARD_W - 16}
                    y={cardY + 34}
                    textAnchor="end"
                    fill={COLORS.green}
                    fontSize="9"
                    fontWeight="600"
                    fontFamily="system-ui, sans-serif"
                  >
                    {card.trend}
                  </text>
                  {/* Tiny up arrow */}
                  <path
                    d={`M${cardX + CARD_W - 14} ${cardY + 28} l3 -4 l3 4`}
                    fill="none"
                    stroke={COLORS.green}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              )}
              <text
                x={cardX + 16}
                y={cardY + 56}
                fill={COLORS.textMuted}
                fontSize="10"
                fontFamily="system-ui, sans-serif"
              >
                {card.label}
              </text>
            </g>
          );
        })}

        {/* ====== Quick Actions header ====== */}
        <g style={{ animation: 'pov-action 12s ease-out 3s infinite' }}>
          <text
            x="25"
            y="314"
            fill={COLORS.textPrimary}
            fontSize="15"
            fontWeight="600"
            fontFamily="system-ui, sans-serif"
          >
            Quick Actions
          </text>
        </g>

        {/* ====== Action cards (2x3 grid) with real icons ====== */}
        {ACTION_CARDS.map((card, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const cardX = 25 + col * (CARD_W + 20);
          const cardY = ACTION_GRID_Y + row * ACTION_ROW_H;
          const delay = `${3.5 + i * 0.2}s`;
          const iconCx = cardX + 24;
          const iconCy = cardY + 29;

          return (
            <g key={`action-${i}`} style={{ animation: `pov-action 12s ease-out ${delay} infinite` }}>
              <rect
                x={cardX}
                y={cardY}
                width={CARD_W}
                height="58"
                rx="10"
                fill={COLORS.cardBg}
                stroke={COLORS.cardBorder}
                strokeWidth="1"
              />
              {/* Icon circle background */}
              <circle
                cx={iconCx}
                cy={iconCy}
                r="14"
                fill={`${card.color}12`}
                stroke={`${card.color}35`}
                strokeWidth="1"
              />
              {/* Actual SVG icon */}
              <g transform={`translate(${iconCx}, ${iconCy})`}>
                <ActionIcon index={i} color={card.color} />
              </g>
              <text
                x={cardX + 46}
                y={cardY + 26}
                fill={COLORS.textPrimary}
                fontSize="11.5"
                fontWeight="600"
                fontFamily="system-ui, sans-serif"
              >
                {card.label}
              </text>
              <text
                x={cardX + 46}
                y={cardY + 40}
                fill={COLORS.textMuted}
                fontSize="9"
                fontFamily="system-ui, sans-serif"
              >
                {card.desc}
              </text>
            </g>
          );
        })}

        {/* ====== Hover glow on Link Page card (index 1) ====== */}
        <rect
          x={LINK_CARD_X}
          y={LINK_CARD_Y}
          width={CARD_W}
          height="58"
          rx="10"
          fill="none"
          stroke={COLORS.green}
          strokeWidth="2"
          style={{ animation: 'pov-hover-glow 12s ease infinite' }}
        />

        {/* ====== PWA Install Popup (full-width, polished) ====== */}
        <g style={{ animation: 'pov-pwa 12s ease-out infinite' }}>
          {/* Frosted card background */}
          <rect
            x={PWA_X}
            y={PWA_Y}
            width={PWA_W}
            height={PWA_H}
            rx="14"
            fill="#1e1e1e"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="1"
          />
          {/* Subtle inner highlight at top */}
          <rect
            x={PWA_X + 1}
            y={PWA_Y + 1}
            width={PWA_W - 2}
            height="1"
            rx="0.5"
            fill="rgba(255,255,255,0.06)"
          />

          {/* App icon - gold square with SAA text */}
          <rect
            x={PWA_X + 18}
            y={PWA_Y + 20}
            width="48"
            height="48"
            rx="12"
            fill="rgba(255,215,0,0.12)"
            stroke="rgba(255,215,0,0.35)"
            strokeWidth="1"
          />
          {/* SAA letters inside icon */}
          <text
            x={PWA_X + 42}
            y={PWA_Y + 49}
            textAnchor="middle"
            fill={COLORS.gold}
            fontSize="14"
            fontWeight="800"
            fontFamily="system-ui, sans-serif"
          >
            SAA
          </text>

          {/* App name and URL */}
          <text
            x={PWA_X + 80}
            y={PWA_Y + 38}
            fill={COLORS.textPrimary}
            fontSize="14"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            Agent Portal
          </text>
          <text
            x={PWA_X + 80}
            y={PWA_Y + 54}
            fill={COLORS.textSecondary}
            fontSize="10"
            fontFamily="system-ui, sans-serif"
          >
            saabuildingblocks.com
          </text>

          {/* Install button */}
          <rect
            x={INSTALL_BTN_X}
            y={INSTALL_BTN_Y}
            width="54"
            height="28"
            rx="7"
            fill="rgba(0,255,136,0.12)"
            stroke="rgba(0,255,136,0.35)"
            strokeWidth="1"
          />
          <text
            x={INSTALL_BTN_X + 27}
            y={INSTALL_BTN_Y + 18}
            textAnchor="middle"
            fill={COLORS.green}
            fontSize="11"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            Install
          </text>

          {/* "Add to Home Screen" subtitle below card */}
          <text
            x={CW / 2}
            y={PWA_Y + PWA_H + 18}
            textAnchor="middle"
            fill={COLORS.textMuted}
            fontSize="9.5"
            fontFamily="system-ui, sans-serif"
          >
            Add to Home Screen
          </text>

          {/* Click pulse circle on install button */}
          <circle
            cx={INSTALL_BTN_CX}
            cy={INSTALL_BTN_CY}
            r="0"
            fill="none"
            stroke={COLORS.green}
            strokeWidth="2"
            style={{ animation: 'pov-click-pulse 12s ease-out infinite' }}
          />

          {/* Green checkmark badge overlaying install button */}
          <g
            transform={`translate(${INSTALL_BTN_X + 46}, ${INSTALL_BTN_Y - 2})`}
            style={{ animation: 'pov-check 12s ease-out infinite', transformOrigin: `${INSTALL_BTN_X + 46}px ${INSTALL_BTN_Y - 2}px` }}
          >
            <circle cx="0" cy="0" r="9" fill={COLORS.green} />
            <path
              d="M-4 0 L-1.5 2.5 L4 -2.5"
              fill="none"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>

        {/* ====== Animated cursor ====== */}
        <g style={{ animation: 'pov-cursor 12s ease-in-out infinite' }}>
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
