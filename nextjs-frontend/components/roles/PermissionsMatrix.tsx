'use client';

/**
 * PermissionsMatrix Component
 * Grid display of permissions grouped by category
 * Allows bulk selection and category-based operations
 */

import { useState } from 'react';
import { Permission } from '@/lib/api/permissions';
import { CheckCircle2, Circle, CheckSquare, Square } from 'lucide-react';

interface PermissionsMatrixProps {
  permissions: Permission[];
  categorized: Record<string, Permission[]>;
  selectedPermissions: string[];
  onPermissionToggle: (permissionId: string) => void;
  disabled?: boolean;
}

export function PermissionsMatrix({
  permissions,
  categorized,
  selectedPermissions,
  onPermissionToggle,
  disabled = false
}: PermissionsMatrixProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(Object.keys(categorized))
  );

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const isAllCategorySelected = (category: string) => {
    const categoryPerms = categorized[category] || [];
    return categoryPerms.length > 0 && categoryPerms.every(p => selectedPermissions.includes(p.id));
  };

  const toggleAllInCategory = (category: string) => {
    if (disabled) return;

    const categoryPerms = categorized[category] || [];
    const allSelected = isAllCategorySelected(category);

    categoryPerms.forEach(perm => {
      const isSelected = selectedPermissions.includes(perm.id);
      if (allSelected && isSelected) {
        onPermissionToggle(perm.id); // Deselect
      } else if (!allSelected && !isSelected) {
        onPermissionToggle(perm.id); // Select
      }
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'User Management': 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      'Role Management': 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      'Content': 'text-green-400 border-green-500/30 bg-green-500/10',
      'System': 'text-orange-400 border-orange-500/30 bg-orange-500/10',
      'Profile': 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10'
    };
    return colors[category] || 'text-[#ffd700] border-[#ffd700]/30 bg-[#ffd700]/10';
  };

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
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#e5e4dd]">Permissions</h3>
        <div className="text-sm text-[#a8a7a0]">
          {selectedPermissions.length} of {permissions.length} selected
        </div>
      </div>

      {Object.entries(categorized).map(([category, perms]) => {
        if (perms.length === 0) return null;

        const isExpanded = expandedCategories.has(category);
        const allSelected = isAllCategorySelected(category);

        return (
          <div
            key={category}
            className={`border rounded-lg overflow-hidden ${getCategoryColor(category)}`}
          >
            {/* Category Header */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#2a2a2a]/50 transition-colors"
              onClick={() => toggleCategory(category)}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAllInCategory(category);
                  }}
                  disabled={disabled}
                  className="p-1 hover:bg-[#404040] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {allSelected ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
                <h4 className="font-semibold">{category}</h4>
                <span className="text-sm opacity-75">({perms.length})</span>
              </div>
              <span className="text-xs">
                {isExpanded ? '▼' : '▶'}
              </span>
            </div>

            {/* Permissions Grid */}
            {isExpanded && (
              <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {perms.map((permission) => {
                  const isSelected = selectedPermissions.includes(permission.id);

                  return (
                    <button
                      key={permission.id}
                      onClick={() => !disabled && onPermissionToggle(permission.id)}
                      disabled={disabled}
                      className={`flex items-start gap-3 p-3 rounded-lg border transition-all text-left ${
                        isSelected
                          ? 'bg-[#2a2a2a] border-[#ffd700]'
                          : 'bg-[#1a1a1a] border-[#404040] hover:border-[#606060]'
                      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="mt-0.5">
                        {isSelected ? (
                          <CheckCircle2 className="w-5 h-5 text-[#ffd700]" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#606060]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-[#e5e4dd] text-sm">
                            {permission.resource}
                          </span>
                          <span className={`px-2 py-0.5 text-xs rounded border ${getActionColor(permission.action)}`}>
                            {permission.action}
                          </span>
                        </div>
                        {permission.description && (
                          <p className="text-xs text-[#a8a7a0] line-clamp-2">
                            {permission.description}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
