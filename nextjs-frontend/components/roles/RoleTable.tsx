'use client';

/**
 * RoleTable Component
 * Displays roles in a table with permission counts
 * Supports search, filtering, and actions
 */

import { useState } from 'react';
import Link from 'next/link';
import { Role } from '@/lib/api/roles';
import { Edit, Trash2, Shield, ShieldAlert, Eye, Search } from 'lucide-react';

interface RoleTableProps {
  roles: Role[];
  onDelete: (role: Role) => void;
  isAdmin: boolean;
}

export function RoleTable({ roles, onDelete, isAdmin }: RoleTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'system' | 'custom'>('all');

  // Filter roles
  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         role.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' ||
                         (filterType === 'system' && role.is_system) ||
                         (filterType === 'custom' && !role.is_system);
    return matchesSearch && matchesFilter;
  });

  const getRoleIcon = (role: Role) => {
    if (role.name === 'admin') return <ShieldAlert className="w-5 h-5 text-red-400" />;
    if (role.is_system) return <Shield className="w-5 h-5 text-[#ffd700]" />;
    return <Shield className="w-5 h-5 text-blue-400" />;
  };

  const getRoleBadge = (role: Role) => {
    if (role.is_system) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/30">
          System
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
        Custom
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a8a7a0]" />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#2a2a2a] border border-[#404040] rounded-lg text-[#e5e4dd] placeholder-[#a8a7a0] focus:outline-none focus:border-[#ffd700] transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === 'all'
                ? 'bg-[#ffd700] text-[#1a1a1a] font-medium'
                : 'bg-[#2a2a2a] text-[#dcdbd5] border border-[#404040] hover:border-[#ffd700]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('system')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === 'system'
                ? 'bg-[#ffd700] text-[#1a1a1a] font-medium'
                : 'bg-[#2a2a2a] text-[#dcdbd5] border border-[#404040] hover:border-[#ffd700]'
            }`}
          >
            System
          </button>
          <button
            onClick={() => setFilterType('custom')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterType === 'custom'
                ? 'bg-[#ffd700] text-[#1a1a1a] font-medium'
                : 'bg-[#2a2a2a] text-[#dcdbd5] border border-[#404040] hover:border-[#ffd700]'
            }`}
          >
            Custom
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#404040]">
              <th className="px-4 py-3 text-left text-sm font-medium text-[#a8a7a0]">Role</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#a8a7a0]">Description</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#a8a7a0]">Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[#a8a7a0]">Permissions</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-[#a8a7a0]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#a8a7a0]">
                  No roles found
                </td>
              </tr>
            ) : (
              filteredRoles.map((role) => (
                <tr
                  key={role.id}
                  className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a]/50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {getRoleIcon(role)}
                      <span className="font-medium text-[#e5e4dd]">{role.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[#dcdbd5]">
                    {role.description || <span className="text-[#a8a7a0] italic">No description</span>}
                  </td>
                  <td className="px-4 py-4">{getRoleBadge(role)}</td>
                  <td className="px-4 py-4">
                    <span className="px-3 py-1 text-sm rounded-full bg-[#404040] text-[#e5e4dd]">
                      {role.permission_count} {role.permission_count === 1 ? 'permission' : 'permissions'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/agent-portal/roles/${role.id}`}
                        className="p-2 text-[#dcdbd5] hover:text-[#ffd700] transition-colors"
                        title="View/Edit"
                      >
                        {role.is_system || !isAdmin ? <Eye className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                      </Link>
                      {!role.is_system && isAdmin && (
                        <button
                          onClick={() => onDelete(role)}
                          className="p-2 text-[#dcdbd5] hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Results Count */}
      <div className="text-sm text-[#a8a7a0]">
        Showing {filteredRoles.length} of {roles.length} role{roles.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
