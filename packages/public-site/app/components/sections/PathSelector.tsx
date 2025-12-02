'use client';

import { useState } from 'react';
import { H2, GenericButton, CTAButton } from '@saa/shared/components/saa';
import { UserPlus, Briefcase, Users, Crown } from 'lucide-react';

type PathType = 'new-agent' | 'seasoned-agent' | 'team-leader' | 'empire-builder' | null;

interface PathContent {
  problem: string;
  answer: string;
  proof: string;
}

const paths: { id: PathType; label: string; icon: typeof UserPlus }[] = [
  { id: 'new-agent', label: 'New Agent', icon: UserPlus },
  { id: 'seasoned-agent', label: 'Seasoned Agent', icon: Briefcase },
  { id: 'team-leader', label: 'Team Leader', icon: Users },
  { id: 'empire-builder', label: 'Empire Builder', icon: Crown },
];

const pathContent: Record<Exclude<PathType, null>, PathContent> = {
  'new-agent': {
    problem: "Starting in real estate feels overwhelming. You're expected to figure out lead generation, marketing, transactions, and building a business - all at once, with little guidance.",
    answer: "We provide a complete system: training, mentorship, lead generation tools, and a proven roadmap. You're never alone. Our team supports you from day one with step-by-step guidance.",
    proof: "New agents on our team close their first deal 60% faster than the industry average. Our structured onboarding gets you earning sooner.",
  },
  'seasoned-agent': {
    problem: "You've been in the business, but you're hitting a ceiling. Fees are eating into your commission, and you lack the tools and support to scale without burning out.",
    answer: "Keep more of what you earn with better splits and lower fees. Access world-class technology, marketing automation, and a network of top producers who share strategies freely.",
    proof: "Agents who switch to our team see an average 23% increase in net income within the first year, while working fewer hours.",
  },
  'team-leader': {
    problem: "Building a team is hard. Recruiting, training, and retaining agents takes time away from your own production. Traditional models don't reward you fairly for your efforts.",
    answer: "Our revenue share model means you earn ongoing income from agents you attract - without the management headaches. We handle the training and support so you can focus on growth.",
    proof: "Team leaders in our organization average $8,000+/month in passive revenue share income within 24 months.",
  },
  'empire-builder': {
    problem: "You see the bigger picture. You want to build wealth, not just income. But traditional real estate doesn't offer true ownership or scalable passive income.",
    answer: "Build an empire with revenue share that pays you 7 levels deep. Earn stock in a publicly traded company. Create generational wealth while helping others succeed.",
    proof: "Our top empire builders have created six-figure passive income streams and hold significant equity positions in eXp World Holdings.",
  },
};

export function PathSelector() {
  const [selectedPath, setSelectedPath] = useState<PathType>(null);

  return (
    <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <H2>Which Best Describes You?</H2>
          <p className="text-[#dcdbd5] mt-4 text-lg max-w-3xl mx-auto">
            Select your path to see how we can help you succeed.
          </p>
        </div>

        {/* Path Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {paths.map((path) => (
            <GenericButton
              key={path.id}
              selected={selectedPath === path.id}
              onClick={() => setSelectedPath(selectedPath === path.id ? null : path.id)}
              aria-pressed={selectedPath === path.id}
            >
              <span className="flex items-center gap-2">
                <path.icon className="w-4 h-4" />
                {path.label}
              </span>
            </GenericButton>
          ))}
        </div>

        {/* Path Content - Reveal on Selection */}
        {selectedPath && (
          <div className="mt-8 p-6 md:p-8 rounded-xl bg-white/5 border border-white/10 animate-fadeIn">
            {/* Problem */}
            <div className="mb-6">
              <h3 className="text-[#ffd700] font-semibold text-lg mb-2">The Problem</h3>
              <p className="text-[#dcdbd5]">
                {pathContent[selectedPath].problem}
              </p>
            </div>

            {/* Answer */}
            <div className="mb-6">
              <h3 className="text-[#00ff88] font-semibold text-lg mb-2">The Answer</h3>
              <p className="text-[#dcdbd5]">
                {pathContent[selectedPath].answer}
              </p>
            </div>

            {/* Proof */}
            <div className="mb-8">
              <h3 className="text-[#e5e4dd] font-semibold text-lg mb-2">The Proof</h3>
              <p className="text-[#dcdbd5]">
                {pathContent[selectedPath].proof}
              </p>
            </div>

            {/* CTA */}
            <div className="text-center">
              <CTAButton href="/join">
                Get Started as a {paths.find(p => p.id === selectedPath)?.label}
              </CTAButton>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
