'use client';

/**
 * User Dropdown Component
 * Phase 2: Layout Development
 *
 * Features:
 * - Display current user name and email
 * - Logout button with loading state
 * - Role badge display
 * - Change password link
 */

import { useState } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@saa/shared/components/ui/dropdown-menu';
import { Badge } from '@saa/shared/components/ui/badge';
import { User, LogOut, KeyRound, ChevronDown } from 'lucide-react';

export function UserDropdown() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return null;
  }

  // Determine role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-[#ffd700] text-[#191818]';
      case 'agent':
        return 'bg-[#00ff88] text-[#191818]';
      default:
        return 'bg-[#dcdbd5] text-[#191818]';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#404040]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#ffd700]/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#404040] flex items-center justify-center">
            <User className="w-5 h-5 text-[#ffd700]" />
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-sm font-medium text-[#e5e4dd]">{user.username}</div>
            <div className="text-xs text-[#dcdbd5]">{user.email}</div>
          </div>
          <ChevronDown className="w-4 h-4 text-[#dcdbd5]" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64"
        style={{
          background: 'rgba(64, 64, 64, 0.95)',
          border: '1px solid rgba(255, 215, 0, 0.2)',
        }}
      >
        <DropdownMenuLabel className="text-[#e5e4dd]">
          <div className="flex flex-col gap-1">
            <div className="font-semibold">{user.username}</div>
            <div className="text-xs font-normal text-[#dcdbd5]">{user.email}</div>
            <div className="mt-1">
              <Badge className={getRoleBadgeColor(user.role)}>
                {user.role}
              </Badge>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator style={{ background: 'rgba(255, 215, 0, 0.2)' }} />

        <DropdownMenuItem
          className="text-[#dcdbd5] hover:text-[#ffd700] hover:bg-[#404040]/50 cursor-pointer"
          onClick={() => {
            // Navigate to change password page
            window.location.href = '/auth/change-password';
          }}
        >
          <KeyRound className="w-4 h-4 mr-2" />
          Change Password
        </DropdownMenuItem>

        <DropdownMenuSeparator style={{ background: 'rgba(255, 215, 0, 0.2)' }} />

        <DropdownMenuItem
          className="text-red-400 hover:text-red-300 hover:bg-[#404040]/50 cursor-pointer"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
