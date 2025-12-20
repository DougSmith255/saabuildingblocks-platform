'use client';

/**
 * Create New Role Page
 * Form to create a new custom role with permissions
 *
 * STATIC EXPORT: This route is excluded from static export
 * Requires authentication and role creation functionality
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RoleForm } from '@/components/roles/RoleForm';
import { getPermissions, Permission, PermissionCategory } from '@/lib/api/permissions';
import { createRole } from '@/lib/api/roles';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function NewRolePage() {
  const router = useRouter();
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
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      setLoading(true);
      const { permissions: fetchedPerms, categorized: fetchedCategorized } = await getPermissions();
      setPermissions(fetchedPerms);
      setCategorized(fetchedCategorized);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load permissions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: { name: string; description: string; permission_ids: string[] }) => {
    try {
      const { role } = await createRole(data);
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
        <h1 className="text-3xl font-bold text-[#e5e4dd] mb-2">Create New Role</h1>
        <p className="text-[#a8a7a0]">
          Define a new custom role with specific permissions
        </p>
      </div>

      {/* Form */}
      <div
        className="p-6 rounded-lg border border-[#404040]"
        style={{
          background: 'rgba(64, 64, 64, 0.5)',
        }}
      >
        <RoleForm
          permissions={permissions}
          categorized={categorized}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
