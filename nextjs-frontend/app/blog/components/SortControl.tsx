/**
 * SortControl Component
 * Dropdown for sorting blog posts
 * Phase 11.2 - Filtering & Sorting Implementation
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import type { SortOption } from '../types/filters';
import { SORT_OPTIONS } from '../types/filters';

interface SortControlProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  showRelevance?: boolean;
}

export function SortControl({ value, onChange, showRelevance = false }: SortControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on showRelevance
  const options = SORT_OPTIONS.filter(opt =>
    showRelevance || opt.value !== 'relevance'
  );

  const selectedOption = options.find(opt => opt.value === value);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative inline-flex items-center gap-2">
      <label
        id="sort-label"
        className="text-sm font-[var(--font-taskor)] text-[#dcdbd5]"
      >
        Sort by:
      </label>

      {/* Dropdown Button */}
      <button
        aria-labelledby="sort-label"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen(!isOpen)}
        className="
          inline-flex items-center gap-2
          px-4 py-2 rounded-lg
          bg-[#404040] text-[#e5e4dd]
          border border-[#808080]
          hover:border-[#00ff88]
          focus:border-[#00ff88] focus:outline-none
          font-[var(--font-taskor)] text-sm
          transition-colors duration-200
        "
      >
        {selectedOption?.label}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-labelledby="sort-label"
          className="
            absolute top-full left-0 mt-2 w-48
            bg-[#404040] border border-[#808080]
            rounded-lg shadow-2xl
            z-50
          "
        >
          {options.map(option => (
            <button
              key={option.value}
              role="option"
              aria-selected={value === option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="
                w-full px-4 py-3 text-left
                text-[#e5e4dd] font-[var(--font-taskor)] text-sm
                hover:bg-[#808080]/20
                transition-colors duration-150
                flex items-center justify-between
                border-b border-[#808080]/30 last:border-b-0
              "
            >
              {option.label}
              {value === option.value && (
                <svg className="w-4 h-4 text-[#00ff88]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
