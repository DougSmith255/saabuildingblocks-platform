'use client';

import { H2 } from '@saa/shared/components/saa';
import { Cpu, Cloud, Smartphone, Shield } from 'lucide-react';

const futurePoints = [
  {
    icon: Cloud,
    title: 'Cloud-First Model',
    description: 'No brick-and-mortar overhead. Work from anywhere in the world.',
  },
  {
    icon: Cpu,
    title: 'AI-Powered Tools',
    description: 'Stay ahead with cutting-edge AI training and automation.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Technology',
    description: 'Run your entire business from your phone with our suite of apps.',
  },
  {
    icon: Shield,
    title: 'Sustainable Model',
    description: 'Built to thrive regardless of market conditions.',
  },
];

export function BuiltForFuture() {
  return (
    <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1900px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <H2>Built for the Future</H2>
          <p className="text-[#dcdbd5] mt-4 text-lg max-w-3xl mx-auto">
            Real estate is evolving. We're already there.
          </p>
        </div>

        {/* Future Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {futurePoints.map((point, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#ffd700]/30 transition-all duration-300"
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#ffd700]/10 flex items-center justify-center">
                <point.icon className="w-6 h-6 text-[#ffd700]" />
              </div>

              {/* Content */}
              <div>
                <h3 className="text-[#e5e4dd] font-semibold text-lg mb-1">
                  {point.title}
                </h3>
                <p className="text-[#dcdbd5]/80">
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
