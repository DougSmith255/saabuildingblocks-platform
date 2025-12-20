'use client';

/**
 * Stats Card Component
 * Phase 2: Layout Development
 *
 * Display statistical information with icon and value
 */

import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  valueColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  valueColor = '#ffd700',
  trend,
}: StatsCardProps) {
  return (
    <div
      className="p-6 rounded-lg border"
      style={{
        background: 'rgba(64, 64, 64, 0.5)',
        borderColor: 'rgba(64, 64, 64, 0.8)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-[#dcdbd5] font-medium">{title}</div>
        <Icon className="w-5 h-5 text-[#dcdbd5]" />
      </div>

      <div className="flex items-baseline gap-2">
        <div className="text-3xl font-bold" style={{ color: valueColor }}>
          {value}
        </div>
        {trend && (
          <div
            className={`text-xs font-medium ${
              trend.isPositive ? 'text-[#00ff88]' : 'text-red-400'
            }`}
          >
            {trend.isPositive ? '+' : ''}{trend.value}
          </div>
        )}
      </div>
    </div>
  );
}
