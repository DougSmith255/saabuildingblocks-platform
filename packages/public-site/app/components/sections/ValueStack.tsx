'use client';

import { H2, GenericCard } from '@saa/shared/components/saa';
import { DollarSign, Users, Brain, Zap, Globe } from 'lucide-react';

const valueItems = [
  {
    icon: DollarSign,
    title: 'Additional Income Stream Support',
    subtitle: 'So You Can Retire',
    savings: 'Save $4000/year',
  },
  {
    icon: Users,
    title: 'Attract Clients',
    subtitle: "Don't Chase Them",
    savings: 'Save $1000/year',
  },
  {
    icon: Brain,
    title: 'AI Training & Flipping Course',
    subtitle: "Don't Fall Behind",
    savings: 'Save $1500',
  },
  {
    icon: Zap,
    title: 'Automate Your Lead Generation & Follow Up',
    subtitle: '',
    savings: 'Save $1000',
  },
  {
    icon: Globe,
    title: 'Stay Inspired & Connected',
    subtitle: 'Get Private Referrals; Grow Globally',
    savings: 'Priceless',
  },
];

export function ValueStack() {
  return (
    <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1900px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <H2>Irresistible Value - No Cost to You</H2>
        </div>

        {/* Value Items */}
        <div className="space-y-6">
          {valueItems.map((item, index) => (
            <GenericCard
              key={index}
              hover
              padding="md"
              className="flex items-center gap-4 md:gap-6"
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#ffd700]/10 flex items-center justify-center">
                <item.icon className="w-6 h-6 md:w-7 md:h-7 text-[#ffd700]" />
              </div>

              {/* Content */}
              <div className="flex-grow">
                <h3 className="text-h4">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-body opacity-70">
                    {item.subtitle}
                  </p>
                )}
              </div>

              {/* Savings Badge */}
              <div className="flex-shrink-0 text-right">
                <span className="inline-block px-3 py-1 md:px-4 md:py-2 rounded-full bg-[#00ff88]/10 text-[#00ff88] font-semibold text-sm md:text-base whitespace-nowrap">
                  {item.savings}
                </span>
              </div>
            </GenericCard>
          ))}
        </div>

        {/* Bottom Statement */}
        <div className="mt-12 text-center">
          <div className="inline-block px-6 py-4 rounded-xl bg-gradient-to-r from-[#ffd700]/10 to-[#00ff88]/10 border border-[#ffd700]/20">
            <p className="text-h4">
              No Team Fees. No Cost. Everything is{' '}
              <span className="text-[#ffd700]">100% FREE</span>.
            </p>
            <p className="text-body mt-2">
              We Invest in Your Success!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
