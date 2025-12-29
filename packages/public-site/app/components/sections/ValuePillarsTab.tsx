'use client';

import { Icon3D } from '@saa/shared/components/saa';
import { GlassPanel } from '@saa/shared/components/saa/backgrounds/GlassPanel';
import { Globe, Users, TrendingUp } from 'lucide-react';

/**
 * ValuePillarsTab - Emerald "tab" section with value proposition bullets
 *
 * Designed to wrap around the top of MediaLogos section.
 * Has extra bottom padding that overlaps MediaLogos's top corners.
 */
export function ValuePillarsTab() {
  return (
    <GlassPanel variant="emerald">
      <section className="py-6 md:py-8 px-6">
        <div className="mx-auto" style={{ maxWidth: '900px' }}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 justify-center">
              <Icon3D><Users className="w-5 h-5" /></Icon3D>
              <span className="text-body text-sm md:text-base opacity-90">Smart Agent Alliance, free sponsor support built for agents.</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Icon3D><Globe className="w-5 h-5" /></Icon3D>
              <span className="text-body text-sm md:text-base opacity-90">Inside eXp Realty, the most successful global independent brokerage.</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Icon3D><TrendingUp className="w-5 h-5" /></Icon3D>
              <span className="text-body text-sm md:text-base opacity-90">Together, we deliver an ecosystem for exponential growth.</span>
            </div>
          </div>
        </div>
      </section>
    </GlassPanel>
  );
}

export default ValuePillarsTab;
