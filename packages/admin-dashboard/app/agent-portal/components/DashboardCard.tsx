'use client';

/**
 * Dashboard Card Component
 * Phase 2: Layout Development
 *
 * Reusable card component for navigation items on dashboard
 */

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  iconColor?: string;
}

export function DashboardCard({
  title,
  description,
  icon: Icon,
  href,
  iconColor = '#ffd700',
}: DashboardCardProps) {
  return (
    <Link href={href}>
      <div
        className="group p-6 rounded-lg border transition-all duration-300 hover:scale-105 cursor-pointer"
        style={{
          background: 'rgba(64, 64, 64, 0.5)',
          borderColor: 'rgba(255, 215, 0, 0.2)',
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className="p-3 rounded-lg"
            style={{
              background: 'rgba(64, 64, 64, 0.8)',
            }}
          >
            <Icon className="w-6 h-6" style={{ color: iconColor }} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#e5e4dd] mb-1 group-hover:text-[#ffd700] transition-colors">
              {title}
            </h3>
            <p className="text-sm text-[#dcdbd5]">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
