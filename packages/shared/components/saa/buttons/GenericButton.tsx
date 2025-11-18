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
    <>
      <button
        onClick={onClick}
        className={`filter-button ${className}`}
        data-selected={selected}
        aria-pressed={ariaPressed ?? selected}
        aria-label={ariaLabel}
      >
        <div className="filter-button-inner">
          <span className="text-body">
            {children}
          </span>
        </div>
      </button>

      <style jsx>{`
        .filter-button {
          min-width: 131px;
          height: 51px;
          border-radius: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          transition: none;
          box-shadow: none;
        }

        /* Inactive button - default state */
        .filter-button[data-selected="false"] {
          background: linear-gradient(
            to bottom right,
            #ffd700 0%,
            rgba(255, 215, 0, 0) 30%
          );
          background-color: rgba(255, 215, 0, 0.5);
          box-shadow: none;
        }

        /* Inactive button - hover state */
        .filter-button[data-selected="false"]:hover {
          background-color: rgba(255, 215, 0, 0.7);
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
          outline: none;
        }

        /* Active button - default state */
        .filter-button[data-selected="true"] {
          background: linear-gradient(
            to bottom right,
            #00ff88 0%,
            rgba(0, 255, 136, 0) 30%
          );
          background-color: rgba(0, 255, 136, 0.6);
          box-shadow: 0 0 15px rgba(0, 255, 136, 0.6);
        }

        /* Active button - hover state */
        .filter-button[data-selected="true"]:hover {
          background-color: rgba(0, 255, 136, 0.8);
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.7);
        }

        .filter-button-inner {
          width: 100%;
          height: 47px;
          border-radius: 13px;
          background-color: #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 20px;
          color: #fff;
        }
      `}</style>
    </>
  );
}
