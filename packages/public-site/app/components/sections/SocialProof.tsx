'use client';

import { H2, GenericCard } from '@saa/shared/components/saa';
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
            <GenericCard
              key={index}
              hover
              padding="md"
              centered
              className="flex flex-col items-center"
            >
              {/* Icon */}
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#ffd700]/10 flex items-center justify-center mb-4">
                <item.icon className="w-8 h-8 md:w-10 md:h-10 text-[#ffd700]" />
              </div>

              {/* Stat */}
              <div className="text-3xl md:text-4xl font-bold text-[#ffd700] mb-2">
                {item.stat}
              </div>

              {/* Label */}
              <p className="text-[#dcdbd5] text-lg">
                {item.label}
              </p>
            </GenericCard>
          ))}
        </div>
      </div>
    </section>
  );
}
