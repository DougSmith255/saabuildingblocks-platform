'use client';

import { H2, CyberCard } from '@saa/shared/components/saa';
import { TrendingUp, Users, Award } from 'lucide-react';

const proofItems = [
  {
    icon: TrendingUp,
    stat: 'Fastest-Growing',
    label: 'Team at eXp Realty',
  },
  {
    icon: Award,
    stat: 'Top 1%',
    label: 'Agent Retention Rate',
  },
  {
    icon: Users,
    stat: '3,800+',
    label: 'Agents Strong',
  },
];

export function SocialProof() {
  return (
    <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1900px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <H2>Proven Results</H2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {proofItems.map((item, index) => (
            <CyberCard
              key={index}
              padding="md"
              centered
            >
              {/* Icon + Content aligned together */}
              <div className="flex flex-col items-center gap-2">
                {/* Icon - smaller, no bg circle */}
                <item.icon className="w-8 h-8 text-[#ffd700]" />

                {/* Stat */}
                <div className="text-h3 text-[#ffd700]">
                  {item.stat}
                </div>

                {/* Label */}
                <p className="text-body">
                  {item.label}
                </p>
              </div>
            </CyberCard>
          ))}
        </div>
      </div>
    </section>
  );
}
