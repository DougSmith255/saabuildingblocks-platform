'use client';

/**
 * PermissionCheckbox Component
 * Individual permission checkbox with label and description
 */

import { Permission } from '@/lib/api/permissions';
import { CheckCircle2, Circle } from 'lucide-react';

interface PermissionCheckboxProps {
  permission: Permission;
  checked: boolean;
  onChange: (permissionId: string) => void;
  disabled?: boolean;
}

export function PermissionCheckbox({
  permission,
  checked,
  onChange,
  disabled = false
}: PermissionCheckboxProps) {
  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      'read': 'bg-green-500/20 text-green-400 border-green-500/30',
      'write': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'delete': 'bg-red-500/20 text-red-400 border-red-500/30',
      'admin': 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    };
    return colors[action] || 'bg-[#404040] text-[#dcdbd5] border-[#505050]';
  };

  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(permission.id)}
      disabled={disabled}
      className={`flex items-start gap-3 p-3 rounded-lg border transition-all text-left w-full ${
        checked
          ? 'bg-[#2a2a2a] border-[#ffd700]'
          : 'bg-[#1a1a1a] border-[#404040] hover:border-[#606060]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className="mt-0.5">
        {checked ? (
          <CheckCircle2 className="w-5 h-5 text-[#ffd700]" />
        ) : (
          <Circle className="w-5 h-5 text-[#606060]" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-[#e5e4dd] text-sm">
            {permission.name}
          </span>
          <span className={`px-2 py-0.5 text-xs rounded border ${getActionColor(permission.action)}`}>
            {permission.action}
          </span>
        </div>
        <p className="text-xs text-[#606060]">
          {permission.resource}
        </p>
        {permission.description && (
          <p className="text-xs text-[#a8a7a0] mt-1 line-clamp-2">
            {permission.description}
          </p>
        )}
      </div>
    </button>
  );
}
