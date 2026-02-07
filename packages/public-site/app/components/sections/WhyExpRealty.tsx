'use client';

import { H2 } from '@saa/shared/components/saa';
import { IconCyberCard } from '@saa/shared/components/saa/cards';
import { DollarSign, Building, GraduationCap, Globe, TrendingUp, Wallet } from 'lucide-react';

const reasons = [
  {
    icon: DollarSign,
    title: 'Higher Splits, Lower Fees',
    description: 'Keep more of what you earn with industry-leading commission structures.',
    theme: 'yellow' as const,
  },
  {
    icon: Building,
    title: 'Cloud-Based Brokerage',
    description: 'No physical office overhead. Work from anywhere, anytime.',
    theme: 'yellow' as const,
  },
  {
    icon: GraduationCap,
    title: 'World-Class Training',
    description: 'Access 50+ hours of live training weekly plus on-demand resources.',
    theme: 'yellow' as const,
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Operate in 20+ countries with a truly international network.',
    theme: 'yellow' as const,
  },
  {
    icon: TrendingUp,
    title: 'Revenue Share',
    description: 'Build passive income by helping other agents succeed.',
    theme: 'yellow' as const,
  },
  {
    icon: Wallet,
    title: 'Stock Awards',
    description: 'Earn equity in a publicly traded company as you grow.',
    theme: 'yellow' as const,
  },
];

export function WhyExpRealty() {
  return (
    <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1900px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <H2>Why eXp Realty?</H2>
          <p className="text-body mt-4 max-w-3xl mx-auto">
            The future of real estate is here. Join the brokerage that puts agents first.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => (
            <IconCyberCard
              key={index}
              icon={<reason.icon className="w-6 h-6 md:w-7 md:h-7" />}
              theme={reason.theme}
              hover
              centered={false}
            >
              {/* Title */}
              <h3 className="text-h4 mb-2">
                {reason.title}
              </h3>

              {/* Description */}
              <p className="text-body opacity-80">
                {reason.description}
              </p>
            </IconCyberCard>
          ))}
        </div>
      </div>
    </section>
  );
}
