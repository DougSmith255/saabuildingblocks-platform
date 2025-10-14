'use client';

/**
 * Edit/View Role Page
 * Edit existing role or view system role details
 */

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { RoleForm } from '@/components/roles/RoleForm';
import { getPermissions, Permission, PermissionCategory } from '@/lib/api/permissions';
import { getRole, updateRole, Role } from '@/lib/api/roles';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function EditRolePage() {
  const router = useRouter();
  const params = useParams();
  const roleId = params?.id as string;

  const [role, setRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [categorized, setCategorized] = useState<PermissionCategory>({
    'User Management': [],
    'Role Management': [],
    'Content': [],
    'System': [],
    'Profile': []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (roleId) {
      loadData();
    }
  }, [roleId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [roleResponse, permissionsResponse] = await Promise.all([
        getRole(roleId),
        getPermissions()
      ]);

      setRole(roleResponse.role);
      setPermissions(permissionsResponse.permissions);
      setCategorized(permissionsResponse.categorized);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load role data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: { name: string; description: string; permission_ids: string[] }) => {
    if (!role) return;

    try {
      await updateRole(role.id, data);
      router.push('/agent-portal/roles');
    } catch (err) {
      throw err; // Let RoleForm handle the error display
    }
  };

  const handleCancel = () => {
    router.push('/agent-portal/roles');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#ffd700] animate-spin" />
      </div>
    );
  }

  if (error || !role) {
    return (
      <div className="space-y-6">
        <Link
          href="/agent-portal/roles"
          className="inline-flex items-center gap-2 text-[#dcdbd5] hover:text-[#ffd700] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Roles
        </Link>
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-400">{error || 'Role not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/agent-portal/roles"
          className="inline-flex items-center gap-2 text-[#dcdbd5] hover:text-[#ffd700] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Roles
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-[#e5e4dd]">
            {role.is_system ? 'View' : 'Edit'} Role: {role.name}
          </h1>
          {role.is_system && (
            <span className="px-3 py-1 text-sm rounded-full bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/30">
              System Role
            </span>
          )}
        </div>
        <p className="text-[#a8a7a0]">
          {role.is_system
            ? 'System roles cannot be modified. View permissions only.'
            : 'Update role details and permissions'}
        </p>
      </div>

      {/* Form */}
      <div
        className="p-6 rounded-lg border border-[#404040]"
        style={{
          background: 'rgba(64, 64, 64, 0.3)',
          backdropFilter: 'blur(8px)'
        }}
      >
        <RoleForm
          role={role}
          permissions={permissions}
          categorized={categorized}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSystem={role.is_system}
        />
      </div>
    </div>
  );
}
