'use client';

/**
 * Agent Portal Header Component
 * Phase 2: Layout Development
 *
 * Features:
 * - Sticky header at top
 * - Glass morphism design matching Master Controller
 * - User dropdown with logout functionality
 * - Current user name display
 * - Responsive mobile menu
 */

import { useState } from 'react';
import Link from 'next/link';
import { UserDropdown } from './UserDropdown';
import { Menu, X, Users } from 'lucide-react';

export function AgentPortalHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      role="banner"
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(64, 64, 64, 0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-[#ffd700]" />
            <h1 className="text-xl font-bold text-[#e5e4dd]">Agent Portal</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Agent portal navigation">
            <Link
              href="/agent-portal"
              className="text-[#dcdbd5] hover:text-[#ffd700] transition-colors font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/agent-portal/users"
              className="text-[#dcdbd5] hover:text-[#ffd700] transition-colors font-medium"
            >
              Users
            </Link>
            <Link
              href="/agent-portal/roles"
              className="text-[#dcdbd5] hover:text-[#ffd700] transition-colors font-medium"
            >
              Roles
            </Link>
            <Link
              href="/agent-portal/activity"
              className="text-[#dcdbd5] hover:text-[#ffd700] transition-colors font-medium"
            >
              Activity Log
            </Link>
          </nav>

          {/* User Dropdown (Desktop) */}
          <div className="hidden md:block">
            <UserDropdown />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#dcdbd5] hover:text-[#ffd700] transition-colors"
            aria-label={mobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="agent-portal-mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            id="agent-portal-mobile-menu"
            className="md:hidden py-4 border-t border-[#404040]"
            role="navigation"
            aria-label="Mobile navigation"
            style={{
              background: 'rgba(64, 64, 64, 0.8)',
            }}
          >
            <nav className="flex flex-col gap-4">
              <Link
                href="/agent-portal"
                className="text-[#dcdbd5] hover:text-[#ffd700] transition-colors font-medium px-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/agent-portal/users"
                className="text-[#dcdbd5] hover:text-[#ffd700] transition-colors font-medium px-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Users
              </Link>
              <Link
                href="/agent-portal/roles"
                className="text-[#dcdbd5] hover:text-[#ffd700] transition-colors font-medium px-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Roles
              </Link>
              <Link
                href="/agent-portal/activity"
                className="text-[#dcdbd5] hover:text-[#ffd700] transition-colors font-medium px-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                Activity Log
              </Link>
              <div className="px-4 pt-2 border-t border-[#404040]">
                <UserDropdown />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
