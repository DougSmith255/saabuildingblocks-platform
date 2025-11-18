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
  const [isHovered, setIsHovered] = React.useState(false);

  // Base styles that don't change
  const baseStyles: React.CSSProperties = {
    minWidth: '131px',
    height: '51px',
    borderRadius: '15px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px',
    transition: 'all 0.3s ease',
  };

  // Dynamic styles based on selected state and hover
  const dynamicStyles: React.CSSProperties = selected
    ? {
        // Active/Selected state (green)
        background: 'linear-gradient(to bottom right, #00ff88 0%, rgba(0, 255, 136, 0) 30%)',
        backgroundColor: isHovered ? 'rgba(0, 255, 136, 0.8)' : 'rgba(0, 255, 136, 0.6)',
        boxShadow: isHovered
          ? '0 0 20px rgba(0, 255, 136, 0.7)'
          : '0 0 15px rgba(0, 255, 136, 0.6)',
      }
    : {
        // Inactive state (gold)
        background: 'linear-gradient(to bottom right, #ffd700 0%, rgba(255, 215, 0, 0) 30%)',
        backgroundColor: isHovered ? 'rgba(255, 215, 0, 0.7)' : 'rgba(255, 215, 0, 0.5)',
        boxShadow: isHovered ? '0 0 15px rgba(255, 215, 0, 0.6)' : 'none',
      };

  const innerStyles: React.CSSProperties = {
    width: '100%',
    height: '47px',
    borderRadius: '13px',
    backgroundColor: '#1a1a1a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 20px',
    color: '#fff',
  };

  return (
    <button
      onClick={onClick}
      className={className}
      style={{ ...baseStyles, ...dynamicStyles }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-pressed={ariaPressed ?? selected}
      aria-label={ariaLabel}
    >
      <div style={innerStyles}>
        <span className="text-body">
          {children}
        </span>
      </div>
    </button>
  );
}
