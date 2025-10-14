'use client';

/**
 * RoleForm Component
 * Form for creating/editing roles with permission selection
 */

import { useState, useEffect } from 'react';
import { Permission } from '@/lib/api/permissions';
import { Role } from '@/lib/api/roles';
import { PermissionsMatrix } from './PermissionsMatrix';
import { AlertCircle, Loader2 } from 'lucide-react';

interface RoleFormProps {
  role?: Role;
  permissions: Permission[];
  categorized: Record<string, Permission[]>;
  onSubmit: (data: { name: string; description: string; permission_ids: string[] }) => Promise<void>;
  onCancel: () => void;
  isSystem?: boolean;
}

export function RoleForm({
  role,
  permissions,
  categorized,
  onSubmit,
  onCancel,
  isSystem = false
}: RoleFormProps) {
  const [name, setName] = useState(role?.name || '');
  const [description, setDescription] = useState(role?.description || '');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    role?.permissions.map(p => p.id) || []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description || '');
      setSelectedPermissions(role.permissions.map(p => p.id));
    }
  }, [role]);

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim()) {
      setError('Role name is required');
      return;
    }

    if (selectedPermissions.length === 0) {
      setError('At least one permission must be selected');
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        permission_ids: selectedPermissions
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save role');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* System Role Warning */}
      {isSystem && (
        <div className="flex items-center gap-3 p-4 bg-[#ffd700]/10 border border-[#ffd700]/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-[#ffd700] flex-shrink-0" />
          <p className="text-sm text-[#ffd700]">
            This is a system role and cannot be modified. You can only view its permissions.
          </p>
        </div>
      )}

      {/* Role Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#dcdbd5] mb-2">
          Role Name *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSystem || loading}
          placeholder="e.g., Editor, Moderator"
          className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#404040] rounded-lg text-[#e5e4dd] placeholder-[#a8a7a0] focus:outline-none focus:border-[#ffd700] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-[#dcdbd5] mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSystem || loading}
          placeholder="Describe the purpose of this role..."
          rows={3}
          className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#404040] rounded-lg text-[#e5e4dd] placeholder-[#a8a7a0] focus:outline-none focus:border-[#ffd700] transition-colors disabled:opacity-50 disabled:cursor-not-allowed resize-none"
        />
      </div>

      {/* Permissions Matrix */}
      <div>
        <PermissionsMatrix
          permissions={permissions}
          categorized={categorized}
          selectedPermissions={selectedPermissions}
          onPermissionToggle={handlePermissionToggle}
          disabled={isSystem || loading}
        />
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#404040]">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-2 text-[#dcdbd5] hover:text-[#e5e4dd] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        {!isSystem && (
          <button
            type="submit"
            disabled={loading || selectedPermissions.length === 0}
            className="px-6 py-2 bg-[#ffd700] text-[#1a1a1a] rounded-lg font-medium hover:bg-[#e5c200] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Saving...' : role ? 'Update Role' : 'Create Role'}
          </button>
        )}
      </div>
    </form>
  );
}
