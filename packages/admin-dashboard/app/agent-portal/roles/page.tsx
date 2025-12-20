'use client';

/**
 * Roles Management Page
 * List and manage all roles in the system
 *
 * STATIC EXPORT: This route is excluded from static export
 * Requires authentication and dynamic role management
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RoleTable } from '@/components/roles/RoleTable';
import { Role, getRoles, deleteRole } from '@/lib/api/roles';
import { Plus, Shield, AlertCircle, Loader2 } from 'lucide-react';

export default function RolesPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<Role | null>(null);
  const [deleting, setDeleting] = useState(false);

  // TODO: Get from auth context
  const isAdmin = true;

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const { roles: fetchedRoles } = await getRoles();
      setRoles(fetchedRoles);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (role: Role) => {
    setDeleteConfirm(role);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      setDeleting(true);
      await deleteRole(deleteConfirm.id);
      setRoles(roles.filter(r => r.id !== deleteConfirm.id));
      setDeleteConfirm(null);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete role');
    } finally {
      setDeleting(false);
    }
  };

  const stats = {
    total: roles.length,
    system: roles.filter(r => r.is_system).length,
    custom: roles.filter(r => !r.is_system).length
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#e5e4dd] mb-2">Role Management</h1>
          <p className="text-[#a8a7a0]">
            Manage user roles and permissions
          </p>
        </div>
        {isAdmin && (
          <Link
            href="/agent-portal/roles/new"
            className="flex items-center gap-2 px-6 py-3 bg-[#ffd700] text-[#1a1a1a] rounded-lg font-medium hover:bg-[#e5c200] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Role
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="p-6 rounded-lg border border-[#404040]"
          style={{
            background: 'rgba(64, 64, 64, 0.5)',
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-[#ffd700]" />
            <h3 className="text-sm font-medium text-[#a8a7a0]">Total Roles</h3>
          </div>
          <p className="text-3xl font-bold text-[#e5e4dd]">{stats.total}</p>
        </div>
        <div
          className="p-6 rounded-lg border border-[#404040]"
          style={{
            background: 'rgba(64, 64, 64, 0.5)',
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-[#ffd700]" />
            <h3 className="text-sm font-medium text-[#a8a7a0]">System Roles</h3>
          </div>
          <p className="text-3xl font-bold text-[#e5e4dd]">{stats.system}</p>
        </div>
        <div
          className="p-6 rounded-lg border border-[#404040]"
          style={{
            background: 'rgba(64, 64, 64, 0.5)',
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-medium text-[#a8a7a0]">Custom Roles</h3>
          </div>
          <p className="text-3xl font-bold text-[#e5e4dd]">{stats.custom}</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Roles Table */}
      <div
        className="p-6 rounded-lg border border-[#404040]"
        style={{
          background: 'rgba(64, 64, 64, 0.5)',
        }}
      >
        <RoleTable roles={roles} onDelete={handleDelete} isAdmin={isAdmin} />
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            className="w-full max-w-md p-6 rounded-lg border border-[#404040]"
            style={{
              background: 'rgba(42, 42, 42, 0.98)',
            }}
          >
            <h3 className="text-xl font-bold text-[#e5e4dd] mb-4">Delete Role</h3>
            <p className="text-[#dcdbd5] mb-6">
              Are you sure you want to delete the role "{deleteConfirm.name}"? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="px-6 py-2 text-[#dcdbd5] hover:text-[#e5e4dd] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
