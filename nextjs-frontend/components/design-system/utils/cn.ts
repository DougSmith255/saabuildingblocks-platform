/**
 * Class Name Utility
 * Migrated from wordpress-theme/lib/utils.js
 *
 * Combines clsx for conditional classes and tailwind-merge for intelligent merging
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-gold-500', className)
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
