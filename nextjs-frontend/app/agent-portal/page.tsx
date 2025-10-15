'use client';

/**
 * Agent Portal Dashboard Page
 * Phase 2: Layout Development
 *
 * Main dashboard showing:
 * - Welcome message with user name
 * - Quick stats cards
 * - Navigation cards to different sections
 *
 * STATIC EXPORT: Excluded via layout.tsx (parent has dynamic = 'force-dynamic')
 */

import { useAuth } from '@/app/providers/AuthProvider';
import { DashboardCard } from './components/DashboardCard';
import { StatsCard } from './components/StatsCard';
import { RecentActivityWidget } from '@/components/activity/RecentActivityWidget';
import { Users, Shield, Activity, Settings, UserPlus, Lock } from 'lucide-react';

export default function AgentPortalDashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="text-[#dcdbd5]">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-display text-3xl font-bold text-[#e5e4dd] mb-2">
          Welcome back, {user.username}! 👋
        </h1>
        <p className="text-[#dcdbd5]">
          Manage users, roles, and monitor system activity from your dashboard.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value="--"
          icon={Users}
          valueColor="#ffd700"
        />
        <StatsCard
          title="Active Users"
          value="--"
          icon={UserPlus}
          valueColor="#00ff88"
        />
        <StatsCard
          title="Total Roles"
          value="--"
          icon={Shield}
          valueColor="#00aaff"
        />
        <StatsCard
          title="Locked Accounts"
          value="--"
          icon={Lock}
          valueColor="#e5e4dd"
        />
      </div>

      {/* Navigation Cards */}
      <div className="mb-8">
        <h2 className="text-display text-xl font-semibold text-[#e5e4dd] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="Manage Users"
            description="View, create, edit, and delete user accounts"
            icon={Users}
            href="/agent-portal/users"
            iconColor="#ffd700"
          />
          <DashboardCard
            title="Manage Roles"
            description="Configure roles and permissions for users"
            icon={Shield}
            href="/agent-portal/roles"
            iconColor="#00ff88"
          />
          <DashboardCard
            title="Activity Logs"
            description="Monitor system activity and audit trail"
            icon={Activity}
            href="/agent-portal/activity"
            iconColor="#dcdbd5"
          />
        </div>
      </div>

      {/* Recent Activity Widget */}
      <div className="mb-8">
        <RecentActivityWidget />
      </div>

      {/* User Info Section */}
      <div
        className="p-6 rounded-lg border"
        style={{
          background: 'rgba(64, 64, 64, 0.5)',
          backdropFilter: 'blur(8px)',
          borderColor: 'rgba(255, 215, 0, 0.2)',
        }}
      >
        <h2 className="text-display text-xl font-semibold text-[#e5e4dd] mb-4">Your Session</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-[#dcdbd5] mb-1">Role</div>
            <div className="text-lg font-semibold text-[#ffd700]">{user.role}</div>
          </div>
          <div>
            <div className="text-sm text-[#dcdbd5] mb-1">Email</div>
            <div className="text-lg font-semibold text-[#e5e4dd]">{user.email}</div>
          </div>
          <div>
            <div className="text-sm text-[#dcdbd5] mb-1">Username</div>
            <div className="text-lg font-semibold text-[#e5e4dd]">{user.username}</div>
          </div>
          <div>
            <div className="text-sm text-[#dcdbd5] mb-1">Last Login</div>
            <div className="text-lg font-semibold text-[#e5e4dd]">
              {user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
