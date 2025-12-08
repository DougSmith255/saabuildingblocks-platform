'use client';

import { H2, GenericCard } from '@saa/shared/components/saa';
import { DollarSign, Building, GraduationCap, Globe, TrendingUp, Wallet } from 'lucide-react';

const reasons = [
  {
    icon: DollarSign,
    title: 'Higher Splits, Lower Fees',
    description: 'Keep more of what you earn with industry-leading commission structures.',
  },
  {
    icon: Building,
    title: 'Cloud-Based Brokerage',
    description: 'No physical office overhead. Work from anywhere, anytime.',
  },
  {
    icon: GraduationCap,
    title: 'World-Class Training',
    description: 'Access 50+ hours of live training weekly plus on-demand resources.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Operate in 20+ countries with a truly international network.',
  },
  {
    icon: TrendingUp,
    title: 'Revenue Share',
    description: 'Build passive income by helping other agents succeed.',
  },
  {
    icon: Wallet,
    title: 'Stock Awards',
    description: 'Earn equity in a publicly traded company as you grow.',
  },
];

export function WhyExpRealty() {
  return (
    <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1900px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <H2>Why eXp Realty?</H2>
          <p className="text-[#dcdbd5] mt-4 text-lg max-w-3xl mx-auto">
            The future of real estate is here. Join the brokerage that puts agents first.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => (
            <GenericCard
              key={index}
              hover
              padding="md"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-full bg-[#ffd700]/10 flex items-center justify-center mb-4">
                <reason.icon className="w-6 h-6 text-[#ffd700]" />
              </div>

              {/* Title */}
              <h3 className="text-[#e5e4dd] font-semibold text-lg mb-2">
                {reason.title}
              </h3>

              {/* Description */}
              <p className="text-[#dcdbd5]/80 text-sm">
                {reason.description}
              </p>
            </GenericCard>
          ))}
        </div>
      </div>
    </section>
  );
}
