'use client';

/**
 * Password Strength Indicator Component
 * Shows visual feedback on password strength
 */

import { useMemo } from 'react';
import {
  calculatePasswordStrength,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
} from '@/lib/auth/activation-schemas';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export default function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);
  const label = useMemo(() => getPasswordStrengthLabel(strength), [strength]);
  const color = useMemo(() => getPasswordStrengthColor(strength), [strength]);

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600">Password Strength:</span>
        <span className="text-xs font-semibold" style={{ color }}>
          {label}
        </span>
      </div>

      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className="h-1.5 flex-1 rounded-full transition-colors"
            style={{
              backgroundColor: level <= strength ? color : '#e5e7eb',
            }}
          />
        ))}
      </div>

      <ul className="space-y-1 text-xs text-gray-600">
        <li className={password.length >= 8 ? 'text-green-600' : ''}>
          ✓ At least 8 characters
        </li>
        <li className={/[A-Z]/.test(password) && /[a-z]/.test(password) ? 'text-green-600' : ''}>
          ✓ Uppercase and lowercase letters
        </li>
        <li className={/[0-9]/.test(password) ? 'text-green-600' : ''}>
          ✓ At least one number
        </li>
        <li className={/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : ''}>
          ✓ At least one special character
        </li>
      </ul>
    </div>
  );
}
