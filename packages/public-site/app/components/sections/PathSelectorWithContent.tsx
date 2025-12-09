'use client';

import { useState, useEffect } from 'react';
import { H2, GenericButton, GenericCard } from '@saa/shared/components/saa';
import { UserPlus, Briefcase, Users, Crown } from 'lucide-react';
import { BuiltForFuture } from './BuiltForFuture';
import { FAQ } from './FAQ';
import { FinalCTA } from './FinalCTA';

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

export function PathSelectorWithContent() {
  const [selectedPath, setSelectedPath] = useState<PathType>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedPath, setDisplayedPath] = useState<PathType>(null);
  const hasSelection = selectedPath !== null;

  // Handle path changes with transition animation
  const handlePathSelect = (pathId: PathType) => {
    if (pathId === selectedPath) return;

    // Start transition - blur everything out
    setIsTransitioning(true);

    // After blur out, update the path and blur back in
    setTimeout(() => {
      setSelectedPath(pathId);
      setDisplayedPath(pathId);
      // Small delay then remove transition state
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  return (
    <>
      {/* Path Selector Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1900px] mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <H2>Which Best Describes You?</H2>
            <p className="text-body mt-4 max-w-3xl mx-auto">
              Select your path to unlock your personalized roadmap.
            </p>
          </div>

          {/* Path Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {paths.map((path) => (
              <GenericButton
                key={path.id}
                selected={selectedPath === path.id}
                onClick={() => handlePathSelect(path.id)}
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
          <div
            className="transition-all duration-300 ease-out"
            style={{
              filter: isTransitioning ? 'blur(8px)' : 'blur(0px)',
              opacity: isTransitioning ? 0.5 : 1,
            }}
          >
            {displayedPath && (
              <GenericCard padding="lg" className="mt-8">
                {/* Problem */}
                <div className="mb-6">
                  <h3 className="text-h4 mb-2" style={{ color: '#ff3131' }}>The Problem</h3>
                  <p className="text-body">
                    {pathContent[displayedPath].problem}
                  </p>
                </div>

                {/* Answer */}
                <div className="mb-6">
                  <h3 className="text-h4 mb-2" style={{ color: '#00ff88' }}>The Answer</h3>
                  <p className="text-body">
                    {pathContent[displayedPath].answer}
                  </p>
                </div>

                {/* Proof */}
                <div>
                  <h3 className="text-h4 mb-2">The Proof</h3>
                  <p className="text-body">
                    {pathContent[displayedPath].proof}
                  </p>
                </div>
              </GenericCard>
            )}
          </div>
        </div>
      </section>

      {/* Content Below - Blurred until selection, transitions on path change */}
      <div
        className="relative transition-all duration-500 ease-out"
        style={{
          filter: !hasSelection ? 'blur(8px)' : isTransitioning ? 'blur(6px)' : 'blur(0px)',
          opacity: !hasSelection ? 0.35 : isTransitioning ? 0.6 : 1,
        }}
      >
        <BuiltForFuture />
        <FAQ />
        <FinalCTA />
      </div>
    </>
  );
}
