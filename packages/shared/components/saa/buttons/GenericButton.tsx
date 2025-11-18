/**
 * Generic Button Component - Master Controller
 *
 * Reusable generic button with active/inactive states
 * Used for blog category filters and similar multi-select filter UIs
 *
 * Design:
 * - Inactive: Gold gradient (#ffd700) with subtle glow
 * - Active: Neon green gradient (#00ff88) with stronger glow
 * - Double-border effect with outer gradient and inner dark background
 *
 * Usage:
 * <GenericButton selected={isActive} onClick={handleClick}>
 *   Category Name
 * </GenericButton>
 */

'use client';

import React from 'react';

interface GenericButtonProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  'aria-label'?: string;
  'aria-pressed'?: boolean;
}

export function GenericButton({
  children,
  selected = false,
  onClick,
  className = '',
  'aria-label': ariaLabel,
  'aria-pressed': ariaPressed,
}: GenericButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        min-w-[131px] h-[51px] rounded-[15px]
        cursor-pointer flex items-center justify-center p-[2px]
        transition-all duration-300
        ${selected
          ? 'bg-[rgba(0,255,136,0.6)] hover:bg-[rgba(0,255,136,0.8)] shadow-[0_0_15px_rgba(0,255,136,0.6)] hover:shadow-[0_0_20px_rgba(0,255,136,0.7)]'
          : 'bg-[rgba(255,215,0,0.5)] hover:bg-[rgba(255,215,0,0.7)] hover:shadow-[0_0_15px_rgba(255,215,0,0.6)]'
        }
        ${className}
      `}
      style={{
        background: selected
          ? 'linear-gradient(to bottom right, #00ff88 0%, rgba(0, 255, 136, 0) 30%)'
          : 'linear-gradient(to bottom right, #ffd700 0%, rgba(255, 215, 0, 0) 30%)',
        backgroundColor: selected ? 'rgba(0, 255, 136, 0.6)' : 'rgba(255, 215, 0, 0.5)',
      }}
      aria-pressed={ariaPressed ?? selected}
      aria-label={ariaLabel}
    >
      <div className="w-full h-[47px] rounded-[13px] bg-[#1a1a1a] flex items-center justify-center px-5 text-white">
        <span className="text-body">
          {children}
        </span>
      </div>
    </button>
  );
}
