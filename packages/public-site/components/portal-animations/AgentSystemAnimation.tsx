'use client';

/**
 * AgentSystemAnimation — "Your Passive Income System" (FLAGSHIP)
 *
 * Portrait 390x680 canvas. No portal chrome.
 * Shows the full Link Page -> Attraction Page flow.
 *
 * Choreography (15s loop):
 * 0-6s:    Link Page preview — profile, buttons stagger in, social icons
 * 4-7s:    Cursor moves to "About My eXp Team", hover glow, click pulse
 * 7-11s:   Attraction page slides in from bottom (polished layout)
 * 11-14s:  Vertical flow diagram with animated arrow + sparkles
 * 14-15s:  Fade to loop
 */

import React from 'react';
import { AnimationCanvas, CANVAS_W, COLORS } from './PortalFrame';

const CW = CANVAS_W;

export function AgentSystemAnimation() {
  // Link button positions
  const linkBtnX = 50;
  const linkBtnW = CW - 100;
  const linkBtnH = 38;
  const linkBtnRx = 19;

  // Attraction page benefit cards — horizontal row
  const benefitCardW = 88;
  const benefitCardH = 52;
  const benefitGap = 8;
  const benefitRowX = (CW - (benefitCardW * 3 + benefitGap * 2)) / 2;

  return (
    <>
      <style>{`
        /* ── SVG Filters ── */

        /* ── Phase 1: Link Page (0-6s visible) ── */
        @keyframes ags-linkpage {
          0%   { opacity: 0; }
          2%   { opacity: 1; }
          40%  { opacity: 1; }
          46%  { opacity: 0; }
          100% { opacity: 0; }
        }

        @keyframes ags-link-btn-1 {
          0%, 8%   { opacity: 0; transform: translateY(12px); }
          14%      { opacity: 1; transform: translateY(0); }
          40%      { opacity: 1; }
          46%      { opacity: 0; }
          100%     { opacity: 0; }
        }
        @keyframes ags-link-btn-2 {
          0%, 11%  { opacity: 0; transform: translateY(12px); }
          17%      { opacity: 1; transform: translateY(0); }
          40%      { opacity: 1; }
          46%      { opacity: 0; }
          100%     { opacity: 0; }
        }
        @keyframes ags-link-btn-3 {
          0%, 14%  { opacity: 0; transform: translateY(12px); }
          20%      { opacity: 1; transform: translateY(0); }
          40%      { opacity: 1; }
          46%      { opacity: 0; }
          100%     { opacity: 0; }
        }
        @keyframes ags-link-btn-4 {
          0%, 17%  { opacity: 0; transform: translateY(12px); }
          23%      { opacity: 1; transform: translateY(0); }
          40%      { opacity: 1; }
          46%      { opacity: 0; }
          100%     { opacity: 0; }
        }

        @keyframes ags-social-icons {
          0%, 20%  { opacity: 0; transform: translateY(8px); }
          26%      { opacity: 1; transform: translateY(0); }
          40%      { opacity: 1; }
          46%      { opacity: 0; }
          100%     { opacity: 0; }
        }

        @keyframes ags-live-pulse {
          0%, 50%  { opacity: 0.6; }
          25%      { opacity: 1; }
          75%      { opacity: 0.6; }
          100%     { opacity: 0.6; }
        }

        /* ── Phase 2: Cursor + Click (4-7s = 26%-46%) ── */
        @keyframes ags-cursor {
          0%, 24%  { transform: translate(100px, 180px); opacity: 0; }
          26%      { transform: translate(100px, 180px); opacity: 1; }
          32%      { transform: translate(${CW / 2 - 5}px, 430px); opacity: 1; }
          36%      { transform: translate(${CW / 2 - 5}px, 430px); opacity: 1; }
          38%      { transform: translate(${CW / 2 - 5}px, 432px); opacity: 1; }
          40%      { transform: translate(${CW / 2 - 5}px, 430px); opacity: 1; }
          44%      { transform: translate(${CW / 2 - 5}px, 430px); opacity: 0; }
          100%     { opacity: 0; }
        }

        @keyframes ags-hover-glow {
          0%, 30%  { opacity: 0; }
          33%      { opacity: 1; }
          40%      { opacity: 1; }
          44%      { opacity: 0; }
          100%     { opacity: 0; }
        }

        @keyframes ags-click-ring {
          0%, 37%  { r: 0; opacity: 0; }
          38%      { r: 3; opacity: 0.9; }
          41%      { r: 28; opacity: 0; }
          100%     { opacity: 0; }
        }

        @keyframes ags-click-flash {
          0%, 37%  { opacity: 0; }
          38%      { opacity: 0.15; }
          42%      { opacity: 0; }
          100%     { opacity: 0; }
        }

        /* ── Phase 3: Attraction Page (7-11s = 46%-73%) ── */
        @keyframes ags-attraction-in {
          0%, 44%  { opacity: 0; transform: translateY(60px); }
          50%      { opacity: 1; transform: translateY(-4px); }
          52%      { opacity: 1; transform: translateY(0); }
          73%      { opacity: 1; transform: translateY(0); }
          78%      { opacity: 0; transform: translateY(0); }
          100%     { opacity: 0; }
        }

        @keyframes ags-cta-pulse {
          0%, 56%  { transform: scale(1); }
          59%      { transform: scale(1.03); }
          62%      { transform: scale(1); }
          65%      { transform: scale(1.02); }
          68%      { transform: scale(1); }
          100%     { transform: scale(1); }
        }

        @keyframes ags-toast {
          0%, 60%  { opacity: 0; transform: translateX(60px); }
          65%      { opacity: 1; transform: translateX(0); }
          73%      { opacity: 1; transform: translateX(0); }
          78%      { opacity: 0; transform: translateX(0); }
          100%     { opacity: 0; }
        }

        /* ── Phase 4: Flow Diagram (11-14s = 73%-93%) ── */
        @keyframes ags-flow {
          0%, 72%  { opacity: 0; }
          78%      { opacity: 1; }
          92%      { opacity: 1; }
          98%      { opacity: 0; }
          100%     { opacity: 0; }
        }

        @keyframes ags-flow-arrow {
          0%, 76%  { stroke-dashoffset: 80; opacity: 0; }
          80%      { opacity: 1; }
          88%      { stroke-dashoffset: 0; opacity: 1; }
          92%      { opacity: 1; }
          98%      { opacity: 0; }
          100%     { opacity: 0; }
        }

        @keyframes ags-sparkle-1 {
          0%, 78%  { opacity: 0; transform: scale(0); }
          82%      { opacity: 1; transform: scale(1.2); }
          85%      { opacity: 0.6; transform: scale(0.8); }
          88%      { opacity: 1; transform: scale(1); }
          92%      { opacity: 1; }
          98%      { opacity: 0; }
          100%     { opacity: 0; }
        }
        @keyframes ags-sparkle-2 {
          0%, 80%  { opacity: 0; transform: scale(0); }
          84%      { opacity: 1; transform: scale(1.3); }
          87%      { opacity: 0.5; transform: scale(0.7); }
          90%      { opacity: 1; transform: scale(1); }
          92%      { opacity: 1; }
          98%      { opacity: 0; }
          100%     { opacity: 0; }
        }
        @keyframes ags-sparkle-3 {
          0%, 82%  { opacity: 0; transform: scale(0); }
          86%      { opacity: 1; transform: scale(1.1); }
          89%      { opacity: 0.7; transform: scale(0.9); }
          92%      { opacity: 1; transform: scale(1); }
          92%      { opacity: 1; }
          98%      { opacity: 0; }
          100%     { opacity: 0; }
        }
      `}</style>

      <AnimationCanvas>
        {/* SVG Filters for glow effects */}
        <defs>
          <filter id="ags-gold-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feFlood floodColor="#ffd700" floodOpacity="0.15" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="ags-green-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feFlood floodColor="#00ff88" floodOpacity="0.2" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="ags-gold-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,215,0,0.08)" />
            <stop offset="50%" stopColor="rgba(255,215,0,0.15)" />
            <stop offset="100%" stopColor="rgba(255,215,0,0.08)" />
          </linearGradient>
          <linearGradient id="ags-gold-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffd700" />
            <stop offset="100%" stopColor="#e6c200" />
          </linearGradient>
        </defs>

        {/* ================================================================ */}
        {/* Phase 1: Link Page Preview (0-6s)                               */}
        {/* ================================================================ */}
        <g style={{ animation: 'ags-linkpage 15s ease infinite' }}>
          {/* Page container */}
          <rect
            x="30" y="35" width={CW - 60} height="610" rx="18"
            fill="rgba(10,10,10,0.97)"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1.5"
          />
          {/* Inner subtle gradient overlay at top */}
          <rect
            x="30" y="35" width={CW - 60} height="80" rx="18"
            fill="url(#ags-gold-grad)"
            opacity="0.5"
          />
          {/* Cover the bottom corners of the gradient rect */}
          <rect x="30" y="97" width={CW - 60} height="18" fill="rgba(10,10,10,0.97)" />

          {/* "LINK PAGE PREVIEW" label */}
          <text
            x="52" y="58"
            fill={COLORS.textMuted}
            fontSize="8.5"
            fontWeight="600"
            fontFamily="system-ui, sans-serif"
            letterSpacing="1.5"
          >
            LINK PAGE PREVIEW
          </text>

          {/* LIVE badge (top-right, pulsing) */}
          <g style={{ animation: 'ags-live-pulse 2s ease-in-out infinite' }}>
            <rect
              x={CW - 30 - 48} y="44" width="38" height="18" rx="9"
              fill="rgba(255,215,0,0.15)"
              stroke="rgba(255,215,0,0.4)"
              strokeWidth="0.8"
            />
            <circle cx={CW - 30 - 38} cy="53" r="3" fill={COLORS.gold} />
            <text
              x={CW - 30 - 22} y="57"
              textAnchor="middle"
              fill={COLORS.gold}
              fontSize="8"
              fontWeight="700"
              fontFamily="system-ui, sans-serif"
              letterSpacing="0.8"
            >
              LIVE
            </text>
          </g>

          {/* Agent profile photo circle */}
          <circle
            cx={CW / 2} cy="130" r="40"
            fill="rgba(255,215,0,0.08)"
            stroke="rgba(255,215,0,0.25)"
            strokeWidth="2"
          />
          <circle
            cx={CW / 2} cy="130" r="38"
            fill="none"
            stroke="rgba(255,215,0,0.08)"
            strokeWidth="1"
          />
          <text
            x={CW / 2} y="137"
            textAnchor="middle"
            fill={COLORS.gold}
            fontSize="22"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            JD
          </text>

          {/* Name */}
          <text
            x={CW / 2} y="196"
            textAnchor="middle"
            fill={COLORS.textPrimary}
            fontSize="20"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            Jane Doe
          </text>

          {/* Bio */}
          <text
            x={CW / 2} y="216"
            textAnchor="middle"
            fill={COLORS.textSecondary}
            fontSize="11.5"
            fontFamily="system-ui, sans-serif"
          >
            Helping families find their dream home
          </text>

          {/* ── Link Buttons (staggered) ── */}

          {/* Button 1: Schedule a Call (gold) */}
          <g style={{ animation: 'ags-link-btn-1 15s ease-out infinite' }}>
            <rect
              x={linkBtnX} y={252}
              width={linkBtnW} height={linkBtnH}
              rx={linkBtnRx}
              fill="rgba(255,215,0,0.04)"
              stroke="rgba(255,215,0,0.25)"
              strokeWidth="1"
            />
            <text
              x={CW / 2} y={252 + 24}
              textAnchor="middle"
              fill={COLORS.gold}
              fontSize="12.5"
              fontWeight="600"
              fontFamily="system-ui, sans-serif"
            >
              Schedule a Call
            </text>
          </g>

          {/* Button 2: View Listings (green) */}
          <g style={{ animation: 'ags-link-btn-2 15s ease-out infinite' }}>
            <rect
              x={linkBtnX} y={302}
              width={linkBtnW} height={linkBtnH}
              rx={linkBtnRx}
              fill="rgba(0,255,136,0.03)"
              stroke="rgba(0,255,136,0.2)"
              strokeWidth="1"
            />
            <text
              x={CW / 2} y={302 + 24}
              textAnchor="middle"
              fill={COLORS.green}
              fontSize="12.5"
              fontWeight="600"
              fontFamily="system-ui, sans-serif"
            >
              View Listings
            </text>
          </g>

          {/* Button 3: Free Home Buyer Guide (cyan) */}
          <g style={{ animation: 'ags-link-btn-3 15s ease-out infinite' }}>
            <rect
              x={linkBtnX} y={352}
              width={linkBtnW} height={linkBtnH}
              rx={linkBtnRx}
              fill="rgba(0,191,255,0.03)"
              stroke="rgba(0,191,255,0.2)"
              strokeWidth="1"
            />
            <text
              x={CW / 2} y={352 + 24}
              textAnchor="middle"
              fill={COLORS.cyan}
              fontSize="12.5"
              fontWeight="600"
              fontFamily="system-ui, sans-serif"
            >
              Free Home Buyer Guide
            </text>
          </g>

          {/* Button 4: About My eXp Team (gold) — cursor target */}
          <g style={{ animation: 'ags-link-btn-4 15s ease-out infinite' }}>
            <rect
              x={linkBtnX} y={402}
              width={linkBtnW} height={linkBtnH}
              rx={linkBtnRx}
              fill="rgba(255,215,0,0.04)"
              stroke="rgba(255,215,0,0.25)"
              strokeWidth="1"
            />
            <text
              x={CW / 2} y={402 + 24}
              textAnchor="middle"
              fill={COLORS.gold}
              fontSize="12.5"
              fontWeight="600"
              fontFamily="system-ui, sans-serif"
            >
              About My eXp Team
            </text>
          </g>

          {/* ── Social Icons Row ── */}
          <g style={{ animation: 'ags-social-icons 15s ease-out infinite' }}>
            {/* Phone icon circle */}
            <circle
              cx={CW / 2 - 36} cy="474" r="15"
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
            {/* Phone icon */}
            <text
              x={CW / 2 - 36} y="479"
              textAnchor="middle"
              fill={COLORS.textMuted}
              fontSize="12"
              fontFamily="system-ui, sans-serif"
            >
              &#9742;
            </text>

            {/* Email icon circle */}
            <circle
              cx={CW / 2} cy="474" r="15"
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
            {/* Email icon */}
            <text
              x={CW / 2} y="479"
              textAnchor="middle"
              fill={COLORS.textMuted}
              fontSize="11"
              fontFamily="system-ui, sans-serif"
            >
              @
            </text>

            {/* Instagram icon circle */}
            <circle
              cx={CW / 2 + 36} cy="474" r="15"
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
            {/* Instagram icon (camera) */}
            <rect
              x={CW / 2 + 36 - 5} y={474 - 5}
              width="10" height="10" rx="2.5"
              fill="none"
              stroke={COLORS.textMuted}
              strokeWidth="1"
            />
            <circle
              cx={CW / 2 + 36} cy="474" r="2.5"
              fill="none"
              stroke={COLORS.textMuted}
              strokeWidth="0.8"
            />
          </g>

          {/* Powered by label */}
          <text
            x={CW / 2} y="520"
            textAnchor="middle"
            fill="rgba(255,255,255,0.15)"
            fontSize="8"
            fontFamily="system-ui, sans-serif"
          >
            Powered by Smart Agent Alliance
          </text>
        </g>

        {/* ================================================================ */}
        {/* Phase 2: Cursor + Hover + Click (4-7s)                          */}
        {/* ================================================================ */}

        {/* Hover glow on "About My eXp Team" button */}
        <rect
          x={linkBtnX - 1} y={401}
          width={linkBtnW + 2} height={linkBtnH + 2}
          rx={linkBtnRx + 1}
          fill="none"
          stroke={COLORS.gold}
          strokeWidth="2"
          filter="url(#ags-gold-glow)"
          style={{ animation: 'ags-hover-glow 15s ease infinite' }}
        />

        {/* Click pulse ring */}
        <circle
          cx={CW / 2} cy={402 + linkBtnH / 2}
          r="0"
          fill="none"
          stroke={COLORS.gold}
          strokeWidth="2.5"
          style={{ animation: 'ags-click-ring 15s ease-out infinite' }}
        />

        {/* Click flash overlay */}
        <rect
          x="30" y="35" width={CW - 60} height="610" rx="18"
          fill="white"
          style={{ animation: 'ags-click-flash 15s ease infinite' }}
        />

        {/* Animated cursor */}
        <g style={{ animation: 'ags-cursor 15s ease-in-out infinite' }}>
          <path
            d="M0 0 L0 14 L4 10 L7 16 L10 15 L7 9 L12 8 Z"
            fill={COLORS.gold}
            stroke="#000"
            strokeWidth="0.5"
          />
        </g>

        {/* ================================================================ */}
        {/* Phase 3: Attraction Page (7-11s)                                */}
        {/* ================================================================ */}
        <g style={{ animation: 'ags-attraction-in 15s ease-out infinite' }}>
          {/* Page container with gold border */}
          <rect
            x="25" y="30" width={CW - 50} height="620" rx="16"
            fill="rgba(10,10,10,0.98)"
            stroke="rgba(255,215,0,0.2)"
            strokeWidth="1.5"
          />

          {/* Gold gradient header bar */}
          <rect
            x="25" y="30" width={CW - 50} height="44" rx="16"
            fill="url(#ags-gold-grad)"
          />
          {/* Flatten bottom of header radius */}
          <rect x="25" y="58" width={CW - 50} height="16" fill="url(#ags-gold-grad)" />
          <rect x="25" y="66" width={CW - 50} height="8" fill="rgba(10,10,10,0.98)" />
          {/* Header label */}
          <text
            x={CW / 2} y="57"
            textAnchor="middle"
            fill={COLORS.gold}
            fontSize="11"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
            letterSpacing="0.5"
          >
            Agent Attraction Page
          </text>

          {/* ── Profile Section ── */}
          <circle
            cx={CW / 2} cy="112" r="30"
            fill="rgba(255,215,0,0.08)"
            stroke="rgba(255,215,0,0.25)"
            strokeWidth="1.5"
          />
          <text
            x={CW / 2} y="119"
            textAnchor="middle"
            fill={COLORS.gold}
            fontSize="16"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            JD
          </text>

          <text
            x={CW / 2} y="162"
            textAnchor="middle"
            fill={COLORS.textPrimary}
            fontSize="18"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            Jane Doe
          </text>
          <text
            x={CW / 2} y="180"
            textAnchor="middle"
            fill={COLORS.gold}
            fontSize="10"
            fontWeight="600"
            fontFamily="system-ui, sans-serif"
          >
            eXp Realty &bull; Smart Agent Alliance
          </text>
          <text
            x={CW / 2} y="196"
            textAnchor="middle"
            fill={COLORS.textSecondary}
            fontSize="10"
            fontFamily="system-ui, sans-serif"
          >
            Helping agents build thriving businesses
          </text>

          {/* ── "Why I Chose eXp Realty" section ── */}
          <text
            x="50" y="226"
            fill={COLORS.textPrimary}
            fontSize="12"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            Why I Chose eXp Realty
          </text>

          {/* Quote card with gold left border */}
          <rect
            x="50" y="236" width={CW - 100} height="70" rx="8"
            fill="rgba(255,255,255,0.02)"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
          {/* Gold left accent strip */}
          <rect
            x="50" y="236" width="3" height="70" rx="1.5"
            fill={COLORS.gold}
            opacity="0.6"
          />
          {/* Quote text (italic) */}
          <text
            x="64" y="257"
            fill={COLORS.textSecondary}
            fontSize="9.5"
            fontFamily="system-ui, sans-serif"
            fontStyle="italic"
          >
            &quot;After 10 years in traditional real estate,
          </text>
          <text
            x="64" y="271"
            fill={COLORS.textSecondary}
            fontSize="9.5"
            fontFamily="system-ui, sans-serif"
            fontStyle="italic"
          >
            I discovered a model that lets me earn
          </text>
          <text
            x="64" y="285"
            fill={COLORS.textSecondary}
            fontSize="9.5"
            fontFamily="system-ui, sans-serif"
            fontStyle="italic"
          >
            revenue share while helping other agents.&quot;
          </text>

          {/* ── Benefit Cards (3 horizontal) ── */}
          {[
            { label: 'Revenue', sublabel: 'Share', color: COLORS.gold, bgColor: 'rgba(255,215,0,0.06)', borderColor: 'rgba(255,215,0,0.2)' },
            { label: 'Cloud', sublabel: 'Brokerage', color: COLORS.green, bgColor: 'rgba(0,255,136,0.05)', borderColor: 'rgba(0,255,136,0.15)' },
            { label: 'Stock', sublabel: 'Awards', color: COLORS.cyan, bgColor: 'rgba(0,191,255,0.05)', borderColor: 'rgba(0,191,255,0.15)' },
          ].map((card, i) => {
            const cx = benefitRowX + i * (benefitCardW + benefitGap);
            return (
              <g key={i}>
                <rect
                  x={cx} y={320}
                  width={benefitCardW} height={benefitCardH}
                  rx="10"
                  fill={card.bgColor}
                  stroke={card.borderColor}
                  strokeWidth="1"
                />
                {/* Colored circle icon */}
                <circle
                  cx={cx + benefitCardW / 2} cy={336}
                  r="8"
                  fill="none"
                  stroke={card.color}
                  strokeWidth="1.2"
                  opacity="0.7"
                />
                {/* Icon symbol inside circle */}
                <text
                  x={cx + benefitCardW / 2} y={340}
                  textAnchor="middle"
                  fill={card.color}
                  fontSize="9"
                  fontWeight="700"
                  fontFamily="system-ui, sans-serif"
                >
                  {i === 0 ? '$' : i === 1 ? '\u2601' : '\u2605'}
                </text>
                {/* Label */}
                <text
                  x={cx + benefitCardW / 2} y={358}
                  textAnchor="middle"
                  fill={card.color}
                  fontSize="9"
                  fontWeight="600"
                  fontFamily="system-ui, sans-serif"
                >
                  {card.label}
                </text>
                <text
                  x={cx + benefitCardW / 2} y={369}
                  textAnchor="middle"
                  fill={COLORS.textMuted}
                  fontSize="8"
                  fontFamily="system-ui, sans-serif"
                >
                  {card.sublabel}
                </text>
              </g>
            );
          })}

          {/* ── Big "Join My Team" CTA Button (gold filled) ── */}
          <g
            style={{
              transformOrigin: `${CW / 2}px 408px`,
              animation: 'ags-cta-pulse 15s ease infinite',
            }}
          >
            <rect
              x={CW / 2 - 115} y={392}
              width="230" height="44" rx="22"
              fill="url(#ags-gold-fill)"
              opacity="0.9"
            />
            <rect
              x={CW / 2 - 115} y={392}
              width="230" height="44" rx="22"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="0.5"
            />
            <text
              x={CW / 2} y={419}
              textAnchor="middle"
              fill="#0a0a0a"
              fontSize="15"
              fontWeight="800"
              fontFamily="system-ui, sans-serif"
            >
              Join My Team
            </text>
          </g>

          {/* ── "New signup" Toast (slides from right) ── */}
          <g style={{ animation: 'ags-toast 15s ease-out infinite' }}>
            <rect
              x="44" y={450}
              width={CW - 88} height="34" rx="10"
              fill="rgba(0,255,136,0.08)"
              stroke="rgba(0,255,136,0.25)"
              strokeWidth="1"
            />
            {/* Green left accent */}
            <rect
              x="44" y={450}
              width="3" height="34" rx="1.5"
              fill={COLORS.green}
              opacity="0.8"
            />
            {/* Green dot */}
            <circle cx="62" cy={467} r="4" fill={COLORS.green} opacity="0.9" />
            {/* Toast text */}
            <text
              x="74" y={471}
              fill={COLORS.green}
              fontSize="10"
              fontWeight="600"
              fontFamily="system-ui, sans-serif"
            >
              New signup from your page!
            </text>
          </g>
        </g>

        {/* ================================================================ */}
        {/* Phase 4: Flow Diagram (11-14s)                                  */}
        {/* ================================================================ */}
        <g style={{ animation: 'ags-flow 15s ease-out infinite' }}>

          {/* ── Mini Link Page Card (top) ── */}
          <rect
            x="75" y="50" width={CW - 150} height="148" rx="12"
            fill="rgba(12,12,12,0.95)"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1.2"
          />
          {/* Mini profile */}
          <circle
            cx={CW / 2} cy="90" r="18"
            fill="rgba(255,215,0,0.08)"
            stroke="rgba(255,215,0,0.2)"
            strokeWidth="1"
          />
          <text
            x={CW / 2} y="95"
            textAnchor="middle"
            fill={COLORS.gold}
            fontSize="10"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            JD
          </text>
          {/* Mini link buttons */}
          <rect x={CW / 2 - 60} y="118" width="120" height="14" rx="7" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          <rect x={CW / 2 - 60} y="137" width="120" height="14" rx="7" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          <rect x={CW / 2 - 60} y="156" width="120" height="14" rx="7" fill="rgba(255,215,0,0.06)" stroke="rgba(255,215,0,0.15)" strokeWidth="0.5" />
          <text
            x={CW / 2} y="167"
            textAnchor="middle"
            fill={COLORS.gold}
            fontSize="7"
            fontFamily="system-ui, sans-serif"
          >
            About My eXp Team
          </text>

          {/* "Your Link Page" label */}
          <text
            x={CW / 2} y="216"
            textAnchor="middle"
            fill={COLORS.textSecondary}
            fontSize="11"
            fontWeight="600"
            fontFamily="system-ui, sans-serif"
          >
            Your Link Page
          </text>

          {/* ── Animated Gold Dashed Arrow ── */}
          <line
            x1={CW / 2} y1="232"
            x2={CW / 2} y2="320"
            stroke={COLORS.gold}
            strokeWidth="2"
            strokeDasharray="6 4"
            opacity="0.8"
            style={{ animation: 'ags-flow-arrow 15s ease-out infinite' }}
          />
          {/* Arrow head */}
          <polygon
            points={`${CW / 2 - 7},314 ${CW / 2},328 ${CW / 2 + 7},314`}
            fill={COLORS.gold}
            opacity="0.9"
            style={{ animation: 'ags-flow 15s ease-out infinite' }}
          />

          {/* "visitor clicks" label beside arrow */}
          <text
            x={CW / 2 + 22} y="280"
            fill={COLORS.textMuted}
            fontSize="9"
            fontFamily="system-ui, sans-serif"
          >
            visitor clicks
          </text>

          {/* ── Sparkle icons near the arrow ── */}
          <g style={{ transformOrigin: `${CW / 2 - 24}px 260px`, animation: 'ags-sparkle-1 15s ease infinite' }}>
            <text
              x={CW / 2 - 28} y="264"
              fill={COLORS.gold}
              fontSize="10"
              fontFamily="system-ui, sans-serif"
            >
              &#10022;
            </text>
          </g>
          <g style={{ transformOrigin: `${CW / 2 - 18}px 290px`, animation: 'ags-sparkle-2 15s ease infinite' }}>
            <text
              x={CW / 2 - 22} y="294"
              fill={COLORS.gold}
              fontSize="8"
              fontFamily="system-ui, sans-serif"
              opacity="0.7"
            >
              &#10022;
            </text>
          </g>
          <g style={{ transformOrigin: `${CW / 2 + 16}px 252px`, animation: 'ags-sparkle-3 15s ease infinite' }}>
            <text
              x={CW / 2 + 12} y="256"
              fill={COLORS.gold}
              fontSize="7"
              fontFamily="system-ui, sans-serif"
              opacity="0.6"
            >
              &#10022;
            </text>
          </g>

          {/* ── Mini Attraction Page Card (bottom) ── */}
          <rect
            x="55" y="340" width={CW - 110} height="155" rx="12"
            fill="rgba(12,12,12,0.95)"
            stroke="rgba(255,215,0,0.18)"
            strokeWidth="1.2"
          />
          {/* Mini gold header strip */}
          <rect
            x="55" y="340" width={CW - 110} height="24" rx="12"
            fill="rgba(255,215,0,0.06)"
          />
          <rect x="55" y="352" width={CW - 110} height="12" fill="rgba(255,215,0,0.06)" />
          <rect x="55" y="358" width={CW - 110} height="6" fill="rgba(12,12,12,0.95)" />
          <text
            x={CW / 2} y="357"
            textAnchor="middle"
            fill={COLORS.gold}
            fontSize="8"
            fontWeight="600"
            fontFamily="system-ui, sans-serif"
          >
            Attraction Page
          </text>
          {/* Mini profile row */}
          <circle
            cx="86" cy="382" r="12"
            fill="rgba(255,215,0,0.06)"
            stroke="rgba(255,215,0,0.15)"
            strokeWidth="0.8"
          />
          <text
            x="86" y="386"
            textAnchor="middle"
            fill={COLORS.gold}
            fontSize="7"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            JD
          </text>
          <text
            x="106" y="379"
            fill={COLORS.textPrimary}
            fontSize="10"
            fontWeight="600"
            fontFamily="system-ui, sans-serif"
          >
            Jane Doe
          </text>
          <text
            x="106" y="390"
            fill={COLORS.textMuted}
            fontSize="7.5"
            fontFamily="system-ui, sans-serif"
          >
            eXp Realty Agent
          </text>
          {/* Mini quote block */}
          <rect
            x="70" y="402" width={CW - 140} height="28" rx="4"
            fill="rgba(255,255,255,0.02)"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.5"
          />
          <rect x="70" y="402" width="2" height="28" rx="1" fill={COLORS.gold} opacity="0.4" />
          <rect x="80" y="410" width={CW - 180} height="4" rx="2" fill="rgba(255,255,255,0.06)" />
          <rect x="80" y="418" width={CW - 200} height="4" rx="2" fill="rgba(255,255,255,0.04)" />
          {/* Mini benefit dots row */}
          <circle cx={CW / 2 - 30} cy="444" r="4" fill="rgba(255,215,0,0.2)" stroke="rgba(255,215,0,0.3)" strokeWidth="0.5" />
          <circle cx={CW / 2} cy="444" r="4" fill="rgba(0,255,136,0.2)" stroke="rgba(0,255,136,0.2)" strokeWidth="0.5" />
          <circle cx={CW / 2 + 30} cy="444" r="4" fill="rgba(0,191,255,0.2)" stroke="rgba(0,191,255,0.2)" strokeWidth="0.5" />
          {/* Mini CTA */}
          <rect
            x={CW / 2 - 50} y="458" width="100" height="22" rx="11"
            fill="rgba(255,215,0,0.8)"
          />
          <text
            x={CW / 2} y="473"
            textAnchor="middle"
            fill="#0a0a0a"
            fontSize="8"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            Join My Team
          </text>

          {/* "Your Attraction Page" label */}
          <text
            x={CW / 2} y="513"
            textAnchor="middle"
            fill={COLORS.textSecondary}
            fontSize="11"
            fontWeight="600"
            fontFamily="system-ui, sans-serif"
          >
            Your Attraction Page
          </text>

          {/* ── Bottom labels ── */}
          <text
            x={CW / 2} y="560"
            textAnchor="middle"
            fill={COLORS.gold}
            fontSize="14"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
            filter="url(#ags-gold-glow)"
          >
            Zero-Effort Passive System
          </text>
          <text
            x={CW / 2} y="580"
            textAnchor="middle"
            fill={COLORS.textMuted}
            fontSize="10"
            fontFamily="system-ui, sans-serif"
          >
            Link page funnels agents to your attraction page
          </text>
        </g>
      </AnimationCanvas>
    </>
  );
}
