'use client';

/**
 * Password Input Component with Visibility Toggle
 * Phase 2: Agent Portal Authentication UI
 *
 * Features:
 * - Show/hide password toggle
 * - Lock icon
 * - Accessible ARIA labels
 * - Matches Master Controller styling
 */

import { forwardRef, useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#dcdbd5] z-10" />
        <Input
          {...props}
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className={cn(
            'pl-10 pr-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-yellow-500 focus:ring-yellow-500/50',
            className
          )}
          placeholder="Enter your password"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-[#dcdbd5] hover:text-[#e5e4dd]"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
