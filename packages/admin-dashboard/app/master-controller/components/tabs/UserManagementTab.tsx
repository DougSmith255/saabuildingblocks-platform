'use client';

import { useState, useEffect } from 'react';
import { Users, Lock, Activity, ExternalLink, AlertCircle, UserPlus, X, Trash2, Edit, CheckCircle, XCircle, RefreshCw, Mail, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  first_name?: string;
  last_name?: string;
  name: string; // Full name for display (backward compatibility)
  email: string;
  username?: string;
  role: 'admin' | 'user';
  status: 'active' | 'pending' | 'suspended';
  ghl_contact_id?: string;
  created_at: string;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  lockedAccounts: number;
  recentActivity: Array<{
    id: string;
    action: string;
    user: string;
    timestamp: string;
  }>;
}

export function UserManagementTab() {
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    lockedAccounts: 0,
    recentActivity: [],
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addUserForm, setAddUserForm] = useState({ first_name: '', last_name: '', email: '' });
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<{
    success: boolean;
    message: string;
    email?: string;
    messageId?: string;
    timestamp?: string;
  } | null>(null);

  // Edit user state
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUserForm, setEditUserForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    role: 'user' as 'admin' | 'user',
    status: 'active' as 'active' | 'pending' | 'suspended'
  });
  const [editUserLoading, setEditUserLoading] = useState(false);
  const [editUserError, setEditUserError] = useState<string | null>(null);
  const [showEmailChangeConfirm, setShowEmailChangeConfirm] = useState(false);

  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Fetch users and stats
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Add cache-busting timestamp to ensure fresh data
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/users/list?_=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      const fetchedUsers: User[] = data.data || [];

      setUsers(fetchedUsers);

      // Calculate stats
      const activeUsers = fetchedUsers.filter((u) => u.status === 'active').length;
      const suspendedUsers = fetchedUsers.filter((u) => u.status === 'suspended').length;

      setStats({
        totalUsers: fetchedUsers.length,
        activeUsers,
        lockedAccounts: suspendedUsers,
        recentActivity: [], // TODO: Fetch from audit logs
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle add user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddUserLoading(true);
    setAddUserError(null);
    setEmailStatus(null);

    try {
      // Generate temporary password
      const tempPassword = `Temp${Math.random().toString(36).slice(-8)}!`;

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${process.env.NEXT_PUBLIC_API_BASIC_AUTH_USER || 'builder_user'}:${process.env.NEXT_PUBLIC_API_BASIC_AUTH_PASSWORD || 'K8mN#Build7$Q2'}`)}`,
        },
        body: JSON.stringify({
          first_name: addUserForm.first_name,
          last_name: addUserForm.last_name,
          email: addUserForm.email,
          username: addUserForm.email.split('@')[0].toLowerCase(),
          role: 'user',
        }),
      });

      // Check response content type before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response. Please check server logs.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      // Extract email service response
      const emailResponse = data.emailResponse || {};

      // Set email status based on response
      setEmailStatus({
        success: true,
        message: 'Invitation email sent successfully!',
        email: addUserForm.email,
        messageId: emailResponse.messageId || emailResponse.id || 'N/A',
        timestamp: new Date().toISOString(),
      });

      // Success - refresh user list but keep modal open to show email status
      await fetchData();

      // Auto-close modal after 3 seconds
      setTimeout(() => {
        setShowAddUserModal(false);
        setAddUserForm({ first_name: '', last_name: '', email: '' });
        setEmailStatus(null);
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
      setAddUserError(errorMessage);

      // Set email failed status
      setEmailStatus({
        success: false,
        message: errorMessage,
        email: addUserForm.email,
        timestamp: new Date().toISOString(),
      });

      console.error('Error creating user:', err);
    } finally {
      setAddUserLoading(false);
    }
  };

  // Retry sending email
  const handleRetryEmail = async () => {
    if (!emailStatus?.email) return;

    setAddUserLoading(true);
    setAddUserError(null);
    setEmailStatus(null);

    try {
      const response = await fetch('/api/users/resend-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailStatus.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend invitation');
      }

      const emailResponse = data.emailResponse || {};

      setEmailStatus({
        success: true,
        message: 'Invitation email resent successfully!',
        email: emailStatus.email,
        messageId: emailResponse.messageId || emailResponse.id || 'N/A',
        timestamp: new Date().toISOString(),
      });

      // Auto-close modal after 3 seconds
      setTimeout(() => {
        setShowAddUserModal(false);
        setAddUserForm({ first_name: '', last_name: '', email: '' });
        setEmailStatus(null);
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend invitation';
      setAddUserError(errorMessage);
      setEmailStatus({
        success: false,
        message: errorMessage,
        email: emailStatus.email,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setAddUserLoading(false);
    }
  };

  // Handle remove user - show confirmation dialog
  const handleRemoveUser = (user: User) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  // Handle confirmed deletion
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`/api/users/${userToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();

        // If user already deleted (404), just refresh the UI
        if (response.status === 404) {
          setShowDeleteConfirm(false);
          setUserToDelete(null);
          window.location.reload();
          return;
        }

        throw new Error(data.error || 'Failed to remove user');
      }

      // Close dialog and refresh user list
      setShowDeleteConfirm(false);
      setUserToDelete(null);

      // Force page reload to ensure UI updates
      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to remove user');
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  // Handle edit user - open modal with pre-filled data
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditUserForm({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email,
      username: user.username || '',
      role: user.role,
      status: user.status
    });
    setEditUserError(null);
    setShowEditUserModal(true);
  };

  // Handle save edited user - check for email change before submitting
  const handleSaveEditedUser = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if email changed
    const emailChanged = editingUser && editingUser.email !== editUserForm.email;

    if (emailChanged && !showEmailChangeConfirm) {
      setShowEmailChangeConfirm(true);
      return;
    }

    // Proceed with update
    await submitUserUpdate();
  };

  // Submit user update to API
  const submitUserUpdate = async () => {
    if (!editingUser) return;

    setEditUserLoading(true);
    setEditUserError(null);

    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: editUserForm.first_name,
          last_name: editUserForm.last_name,
          email: editUserForm.email,
          username: editUserForm.username,
          role: editUserForm.role,
          status: editUserForm.status,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update user');
      }

      // Success - refresh user list and close modal
      await fetchData();
      setShowEditUserModal(false);
      setEditingUser(null);
      setEditUserForm({
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        role: 'user',
        status: 'active',
      });
      setShowEmailChangeConfirm(false);
    } catch (err) {
      setEditUserError(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setEditUserLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'bg-[#00ff88]/10 text-[#00ff88]';
      case 'pending':
        return 'bg-[#ffd700]/10 text-[#ffd700]';
      case 'suspended':
        return 'bg-red-500/10 text-red-400';
      default:
        return 'bg-[#404040]/30 text-[#dcdbd5]';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ffd700]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
        <AlertCircle className="w-5 h-5" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#ffd700]">User Management</h1>
          <p className="text-[#dcdbd5] mt-2">
            Manage user accounts, permissions, and activity
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Users */}
        <div className="bg-[#404040]/30 border border-[#404040] rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#ffd700]/10 rounded-lg">
              <Users className="w-5 h-5 text-[#ffd700]" />
            </div>
            <h3 className="text-sm font-medium text-[#dcdbd5]">Total Users</h3>
          </div>
          <p className="text-3xl font-bold text-[#ffd700]">{stats.totalUsers}</p>
          <p className="text-xs text-[#dcdbd5]/60 mt-1">Registered accounts</p>
        </div>

        {/* Active Users */}
        <div className="bg-[#404040]/30 border border-[#404040] rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#00ff88]/10 rounded-lg">
              <Activity className="w-5 h-5 text-[#00ff88]" />
            </div>
            <h3 className="text-sm font-medium text-[#dcdbd5]">Active Users</h3>
          </div>
          <p className="text-3xl font-bold text-[#00ff88]">{stats.activeUsers}</p>
          <p className="text-xs text-[#dcdbd5]/60 mt-1">Currently active</p>
        </div>

        {/* Locked Accounts */}
        <div className="bg-[#404040]/30 border border-[#404040] rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <Lock className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-sm font-medium text-[#dcdbd5]">Locked Accounts</h3>
          </div>
          <p className="text-3xl font-bold text-red-400">{stats.lockedAccounts}</p>
          <p className="text-xs text-[#dcdbd5]/60 mt-1">Requires attention</p>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-[#404040]/30 border border-[#404040] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#ffd700]">Users</h2>
          <button
            onClick={() => setShowAddUserModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffd700] text-[#191818] font-semibold rounded-lg hover:bg-[#00ff88] transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add New Account
          </button>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-[#dcdbd5]/30 mx-auto mb-4" />
            <p className="text-[#dcdbd5]/60">No users found</p>
            <p className="text-sm text-[#dcdbd5]/40 mt-1">Add your first user to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#404040]">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#dcdbd5]/60">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#dcdbd5]/60">Username</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#dcdbd5]/60">Password</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#dcdbd5]/60">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#dcdbd5]/60">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-[#dcdbd5]/60">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-[#404040]/50 hover:bg-[#191818]/30">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#ffd700]/10 flex items-center justify-center">
                          <Users className="w-4 h-4 text-[#ffd700]" />
                        </div>
                        <div>
                          <p className="text-[#dcdbd5] font-medium">{user.name}</p>
                          <p className="text-xs text-[#dcdbd5]/60">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[#dcdbd5]">
                      {user.username || (
                        <span className="text-[#dcdbd5]/40 italic">Not set</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-[#dcdbd5]">
                      <span className="font-mono">••••••••</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-[#ffd700]/10 text-[#ffd700] text-sm font-medium rounded-full capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-[#ffd700] hover:bg-[#ffd700]/10 rounded transition-colors"
                          title="Edit user"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleRemoveUser(user)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#191818] border border-[#404040] rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-[#ffd700]">Add New Account</h2>
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setAddUserForm({ first_name: '', last_name: '', email: '' });
                  setAddUserError(null);
                  setEmailStatus(null);
                }}
                className="text-[#dcdbd5]/60 hover:text-[#dcdbd5] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[#dcdbd5]/60 mb-6">
              Create a new user account. An invitation email will be sent via GoHighLevel to complete registration.
            </p>

            {/* Email Status Notification */}
            {emailStatus && (
              <div className={`mb-4 p-4 rounded-lg border ${
                emailStatus.success
                  ? 'bg-[#00ff88]/10 border-[#00ff88]/20'
                  : 'bg-red-500/10 border-red-500/20'
              }`}>
                <div className="flex items-start gap-3">
                  {emailStatus.success ? (
                    <CheckCircle className="w-5 h-5 text-[#00ff88] flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`font-semibold ${
                      emailStatus.success ? 'text-[#00ff88]' : 'text-red-400'
                    }`}>
                      {emailStatus.success ? 'Email Sent Successfully!' : 'Email Failed'}
                    </p>
                    <p className="text-sm text-[#dcdbd5]/80 mt-1">
                      {emailStatus.message}
                    </p>
                    {emailStatus.email && (
                      <div className="mt-2 space-y-1 text-xs text-[#dcdbd5]/60">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5" />
                          <span>Sent to: <strong className="text-[#dcdbd5]">{emailStatus.email}</strong></span>
                        </div>
                        {emailStatus.messageId && (
                          <div className="flex items-center gap-2">
                            <span className="font-mono">Message ID: {emailStatus.messageId}</span>
                          </div>
                        )}
                        {emailStatus.timestamp && (
                          <div className="flex items-center gap-2">
                            <span>Sent at: {new Date(emailStatus.timestamp).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    )}
                    {!emailStatus.success && (
                      <button
                        onClick={handleRetryEmail}
                        disabled={addUserLoading}
                        className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-[#ffd700] text-[#191818] text-sm font-semibold rounded hover:bg-[#00ff88] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${addUserLoading ? 'animate-spin' : ''}`} />
                        Retry Sending Email
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {addUserError && !emailStatus && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {addUserError}
              </div>
            )}

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={addUserForm.first_name}
                  onChange={(e) => setAddUserForm({ ...addUserForm, first_name: e.target.value })}
                  className="w-full px-4 py-2 bg-[#404040]/30 border border-[#404040] rounded-lg text-[#dcdbd5] focus:border-[#ffd700] focus:outline-none"
                  placeholder="Enter first name"
                  disabled={addUserLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={addUserForm.last_name}
                  onChange={(e) => setAddUserForm({ ...addUserForm, last_name: e.target.value })}
                  className="w-full px-4 py-2 bg-[#404040]/30 border border-[#404040] rounded-lg text-[#dcdbd5] focus:border-[#ffd700] focus:outline-none"
                  placeholder="Enter last name"
                  disabled={addUserLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={addUserForm.email}
                  onChange={(e) => setAddUserForm({ ...addUserForm, email: e.target.value })}
                  className="w-full px-4 py-2 bg-[#404040]/30 border border-[#404040] rounded-lg text-[#dcdbd5] focus:border-[#ffd700] focus:outline-none"
                  placeholder="user@example.com"
                  disabled={addUserLoading}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddUserModal(false);
                    setAddUserForm({ first_name: '', last_name: '', email: '' });
                    setAddUserError(null);
                    setEmailStatus(null);
                  }}
                  className="flex-1 px-4 py-2 bg-[#404040]/30 border border-[#404040] text-[#dcdbd5] rounded-lg hover:border-[#dcdbd5]/30 transition-colors"
                  disabled={addUserLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#ffd700] text-[#191818] font-semibold rounded-lg hover:bg-[#00ff88] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={addUserLoading || emailStatus?.success}
                >
                  {addUserLoading ? 'Sending...' : emailStatus?.success ? 'Invitation Sent!' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#191818] border border-[#404040] rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-[#ffd700]">Edit User</h2>
              <button
                onClick={() => {
                  setShowEditUserModal(false);
                  setEditingUser(null);
                  setShowEmailChangeConfirm(false);
                  setEditUserError(null);
                }}
                className="text-[#dcdbd5]/60 hover:text-[#dcdbd5] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[#dcdbd5]/60 mb-6">
              Update user information and permissions.
            </p>

            {editUserError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {editUserError}
              </div>
            )}

            {showEmailChangeConfirm && (
              <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm">
                <p className="font-semibold mb-1">Email Change Detected</p>
                <p className="text-xs">
                  Changing the email address from <strong>{editingUser.email}</strong> to <strong>{editUserForm.email}</strong> will require the user to verify their new email address.
                </p>
              </div>
            )}

            <form onSubmit={handleSaveEditedUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={editUserForm.first_name}
                  onChange={(e) => setEditUserForm({ ...editUserForm, first_name: e.target.value })}
                  className="w-full px-4 py-2 bg-[#404040]/30 border border-[#404040] rounded-lg text-[#dcdbd5] focus:border-[#ffd700] focus:outline-none"
                  placeholder="Enter first name"
                  disabled={editUserLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={editUserForm.last_name}
                  onChange={(e) => setEditUserForm({ ...editUserForm, last_name: e.target.value })}
                  className="w-full px-4 py-2 bg-[#404040]/30 border border-[#404040] rounded-lg text-[#dcdbd5] focus:border-[#ffd700] focus:outline-none"
                  placeholder="Enter last name"
                  disabled={editUserLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editUserForm.email}
                  onChange={(e) => {
                    setEditUserForm({ ...editUserForm, email: e.target.value });
                    setShowEmailChangeConfirm(false);
                  }}
                  className="w-full px-4 py-2 bg-[#404040]/30 border border-[#404040] rounded-lg text-[#dcdbd5] focus:border-[#ffd700] focus:outline-none"
                  placeholder="user@example.com"
                  disabled={editUserLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={editUserForm.username}
                  onChange={(e) => setEditUserForm({ ...editUserForm, username: e.target.value })}
                  className="w-full px-4 py-2 bg-[#404040]/30 border border-[#404040] rounded-lg text-[#dcdbd5] focus:border-[#ffd700] focus:outline-none"
                  placeholder="username"
                  disabled={editUserLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">
                  Role
                </label>
                <select
                  value={editUserForm.role}
                  onChange={(e) => setEditUserForm({ ...editUserForm, role: e.target.value as 'admin' | 'user' })}
                  className="w-full px-4 py-2 bg-[#404040]/30 border border-[#404040] rounded-lg text-[#dcdbd5] focus:border-[#ffd700] focus:outline-none"
                  disabled={editUserLoading}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#dcdbd5] mb-2">
                  Status
                </label>
                <select
                  value={editUserForm.status}
                  onChange={(e) => setEditUserForm({ ...editUserForm, status: e.target.value as 'active' | 'pending' | 'suspended' })}
                  className="w-full px-4 py-2 bg-[#404040]/30 border border-[#404040] rounded-lg text-[#dcdbd5] focus:border-[#ffd700] focus:outline-none"
                  disabled={editUserLoading}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditUserModal(false);
                    setEditingUser(null);
                    setShowEmailChangeConfirm(false);
                    setEditUserError(null);
                  }}
                  className="flex-1 px-4 py-2 bg-[#404040]/30 border border-[#404040] text-[#dcdbd5] rounded-lg hover:border-[#dcdbd5]/30 transition-colors"
                  disabled={editUserLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#ffd700] text-[#191818] font-semibold rounded-lg hover:bg-[#00ff88] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={editUserLoading}
                >
                  {editUserLoading ? 'Saving...' : showEmailChangeConfirm ? 'Confirm Update' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#191818] border border-red-500/30 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-red-500/10 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-red-400 mb-2">Delete User Account</h2>
                <p className="text-[#dcdbd5]/80 text-sm mb-4">
                  Are you sure you want to delete this user? This will permanently delete the account and all associated information including invitations, email history, and user data.
                </p>
                <div className="bg-[#404040]/30 border border-[#404040] rounded-lg p-3 mb-4">
                  <p className="text-xs text-[#dcdbd5]/60 mb-1">User Details:</p>
                  <p className="text-[#dcdbd5] font-medium">{userToDelete.name}</p>
                  <p className="text-sm text-[#dcdbd5]/80">{userToDelete.email}</p>
                </div>
                <p className="text-sm text-red-400 font-semibold">
                  ⚠️ This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setUserToDelete(null);
                }}
                className="flex-1 px-4 py-2 bg-[#404040]/30 border border-[#404040] text-[#dcdbd5] rounded-lg hover:border-[#dcdbd5]/30 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
