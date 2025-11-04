/**
 * RoleBadge Component
 *
 * Displays a colored badge showing the user's role
 * Used in header, user menu, and user management pages
 */

'use client';

import React from 'react';
import { Shield, User } from 'lucide-react';
import type { Role } from '@/lib/types/rbac';
import { getRoleDisplayName, getRoleBadgeColor, isAdmin } from '@/lib/types/rbac';

export interface RoleBadgeProps {
  role: Role;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function RoleBadge({ role, size = 'md', showIcon = true, className = '' }: RoleBadgeProps) {
  const displayName = getRoleDisplayName(role);
  const color = getRoleBadgeColor(role);
  const Icon = isAdmin(role) ? Shield : User;

  // Size variants
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${sizeClasses[size]} ${className}`}
      style={{
        color: color,
        borderColor: `${color}40`,
        backgroundColor: `${color}10`,
      }}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{displayName}</span>
    </div>
  );
}
