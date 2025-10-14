/**
 * Password Strength Indicator Component
 * Phase 3: Password Recovery
 *
 * Real-time password strength visualization using zxcvbn
 * with visual feedback and suggestions.
 */

'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  validatePasswordStrength,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
} from '@/lib/validation/password-schemas';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
  showRequirements?: boolean;
}

export default function PasswordStrengthIndicator({
  password,
  className,
  showRequirements = true,
}: PasswordStrengthIndicatorProps) {
  const [strength, setStrength] = useState({ score: 0, feedback: [] as string[], warning: '' });

  useEffect(() => {
    if (password.length > 0) {
      const result = validatePasswordStrength(password);
      setStrength(result);
    } else {
      setStrength({ score: 0, feedback: [], warning: '' });
    }
  }, [password]);

  // Password requirements checklist
  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { label: 'One number', met: /[0-9]/.test(password) },
    { label: 'One special character', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const allRequirementsMet = requirements.every((req) => req.met);

  if (password.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Password Strength</span>
          <span
            className={cn(
              'font-semibold',
              strength.score === 0 && 'text-red-400',
              strength.score === 1 && 'text-orange-400',
              strength.score === 2 && 'text-yellow-400',
              strength.score === 3 && 'text-blue-400',
              strength.score === 4 && 'text-green-400'
            )}
          >
            {getPasswordStrengthLabel(strength.score)}
          </span>
        </div>

        {/* Visual strength bar */}
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-all duration-300',
                index <= strength.score
                  ? getPasswordStrengthColor(strength.score)
                  : 'bg-gray-700'
              )}
            />
          ))}
        </div>
      </div>

      {/* Warning message from zxcvbn */}
      {strength.warning && (
        <div className="text-xs text-orange-400 bg-orange-400/10 border border-orange-400/20 rounded-md p-2">
          {strength.warning}
        </div>
      )}

      {/* Requirements checklist */}
      {showRequirements && (
        <div className="space-y-1.5">
          <p className="text-xs text-gray-400">Requirements:</p>
          {requirements.map((req, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-xs transition-colors duration-200"
            >
              <div
                className={cn(
                  'w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200',
                  req.met
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-700 text-gray-500'
                )}
              >
                {req.met ? (
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="w-1.5 h-1.5 bg-current rounded-full" />
                )}
              </div>
              <span
                className={cn(
                  'transition-colors duration-200',
                  req.met ? 'text-green-400' : 'text-gray-500'
                )}
              >
                {req.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Suggestions from zxcvbn */}
      {strength.feedback.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-gray-400">Suggestions:</p>
          {strength.feedback.map((suggestion, index) => (
            <p key={index} className="text-xs text-blue-400">
              • {suggestion}
            </p>
          ))}
        </div>
      )}

      {/* Success message */}
      {allRequirementsMet && strength.score >= 3 && (
        <div className="text-xs text-green-400 bg-green-400/10 border border-green-400/20 rounded-md p-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Strong password! All requirements met.</span>
        </div>
      )}
    </div>
  );
}
