'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormSelectProps {
  /** Options for the select */
  options: SelectOption[];
  /** Placeholder text for empty state */
  placeholder?: string;
  /** Visual style variant */
  variant?: 'dark' | 'cyber';
  /** Current value */
  value?: string;
  /** Name attribute for form submission */
  name?: string;
  /** ID attribute */
  id?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Change handler (compatible with native select signature) */
  onChange?: (e: { target: { name: string; value: string } }) => void;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Disabled state */
  disabled?: boolean;
}

// Base trigger styles
const baseTriggerStyles: React.CSSProperties = {
  width: '100%',
  padding: '0.5rem 0.75rem',
  paddingRight: '2rem',
  borderRadius: '6px',
  fontFamily: 'var(--font-synonym, system-ui), sans-serif',
  fontSize: '0.9rem',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  textAlign: 'left',
};

// Variant-specific styles
const variantStyles: Record<string, React.CSSProperties> = {
  dark: {
    background: '#1a1a1c',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: '#fff',
  },
  cyber: {
    background: 'rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    color: '#e5e4dd',
  },
};

const menuStyles: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 4px)',
  left: 0,
  right: 0,
  background: '#1a1a1c',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '6px',
  overflow: 'hidden',
  zIndex: 200000,
  maxHeight: '200px',
  overflowY: 'auto',
  transformOrigin: 'top center',
};

const optionStyles: React.CSSProperties = {
  padding: '0.5rem 0.75rem',
  color: '#fff',
  fontFamily: 'var(--font-synonym, system-ui), sans-serif',
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
};

/**
 * FormSelect - Custom dropdown component with smooth animation
 *
 * Uses a custom dropdown instead of native select for better styling
 * and smooth open/close animations.
 *
 * @example
 * <FormSelect
 *   options={[
 *     { value: 'US', label: 'United States' },
 *     { value: 'CA', label: 'Canada' },
 *   ]}
 *   placeholder="Select country"
 *   value={country}
 *   onChange={(e) => setCountry(e.target.value)}
 * />
 */
export function FormSelect({
  options,
  placeholder = 'Select...',
  variant = 'dark',
  value = '',
  name = '',
  id,
  required,
  onChange,
  style,
  disabled = false,
}: FormSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Find the selected option label
  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption?.label || placeholder;
  const isPlaceholder = !selectedOption;

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleTriggerClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsOpen(prev => !prev);
    }
  }, [disabled]);

  const handleOptionClick = useCallback((optionValue: string) => {
    onChange?.({ target: { name, value: optionValue } });
    setIsOpen(false);
    triggerRef.current?.focus();
  }, [name, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex(prev => Math.min(prev + 1, options.length - 1));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(prev => Math.max(prev - 1, 0));
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else if (focusedIndex >= 0) {
          handleOptionClick(options[focusedIndex].value);
        }
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  }, [disabled, isOpen, focusedIndex, options, handleOptionClick]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%' }}
    >
      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name={name}
        value={value}
        required={required}
      />

      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        id={id}
        onClick={handleTriggerClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{
          ...baseTriggerStyles,
          ...variantStyles[variant],
          ...style,
          color: isPlaceholder ? 'rgba(255, 255, 255, 0.5)' : variantStyles[variant].color,
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <span>{displayText}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="currentColor"
          style={{
            position: 'absolute',
            right: '0.75rem',
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <path d="M6 8L1 3h10z" />
        </svg>
      </button>

      {/* Dropdown menu */}
      <div
        role="listbox"
        style={{
          ...menuStyles,
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transform: isOpen ? 'translateY(0) scaleY(1)' : 'translateY(-8px) scaleY(0.95)',
          transition: 'opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease',
        }}
      >
        {options.map((option, index) => (
          <div
            key={option.value}
            role="option"
            aria-selected={option.value === value}
            onClick={() => handleOptionClick(option.value)}
            onMouseEnter={() => setFocusedIndex(index)}
            style={{
              ...optionStyles,
              background: option.value === value
                ? 'rgba(255, 215, 0, 0.2)'
                : focusedIndex === index
                ? 'rgba(255, 215, 0, 0.1)'
                : 'transparent',
              color: option.value === value ? '#ffd700' : '#fff',
            }}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FormSelect;
