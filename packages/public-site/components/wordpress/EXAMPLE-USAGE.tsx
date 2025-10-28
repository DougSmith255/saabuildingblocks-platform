/**
 * WordPress Components Example Usage
 *
 * This file demonstrates how to use all converted WordPress components
 * in a Next.js 15 page with App Router.
 */

import {
  StarField,
  CTAButton,
  CyberHolographicCard,
  Accordion,
  type AccordionItem,
} from '@/components/wordpress';

export default function WordPressComponentsExample() {
  // Accordion FAQ items
  const faqItems: AccordionItem[] = [
    {
      title: 'Why Choose eXp Realty?',
      content: (
        <>
          <p>eXp Realty offers a unique cloud-based model that provides agents with:</p>
          <ul className="ml-4 space-y-1">
            <li>Global collaboration opportunities</li>
            <li>Industry-leading commission structure</li>
            <li>Stock rewards and revenue sharing</li>
            <li>24/7 support and training resources</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Revenue Sharing Program',
      content: (
        <>
          <p>Our revenue sharing program allows you to build passive income by:</p>
          <ul className="ml-4 space-y-1">
            <li>Recruiting quality agents to your team</li>
            <li>Earning from their transactions for life</li>
            <li>Building generational wealth</li>
            <li>Creating multiple income streams</li>
          </ul>
          <p className="mt-3"><strong>Start building your empire today!</strong></p>
        </>
      ),
    },
    {
      title: 'Training & Support',
      content: (
        <>
          <p>Access comprehensive training including:</p>
          <ul className="ml-4 space-y-1">
            <li>Live virtual classes daily</li>
            <li>On-demand course library</li>
            <li>Mentorship programs</li>
            <li>Marketing tools and resources</li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <>
      {/* Star Background - Fixed behind all content */}
      <StarField starCount={300} />

      <main className="relative z-10 min-h-screen px-4 py-20">
        <div className="max-w-6xl mx-auto">

          {/* Hero Section */}
          <section className="text-center mb-20">
            <h1 className="text-4xl md:text-6xl font-heading text-gold-primary mb-6">
              WordPress Components Demo
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              Premium React/Next.js components converted from WordPress with
              Tailwind CSS v4 and full animation support.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <CTAButton href="/get-started">
                GET STARTED TODAY
              </CTAButton>
            </div>
          </section>

          {/* Cyber Cards Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-heading text-gold-primary mb-8 text-center">
              Premium Card Components
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CyberHolographicCard>
                <div className="text-center">
                  <h3 className="text-2xl font-heading text-gold-primary mb-4">
                    Advanced Features
                  </h3>
                  <p className="text-white/80">
                    Holographic effects with matrix rain, chromatic aberration,
                    and digital glitch overlays.
                  </p>
                </div>
              </CyberHolographicCard>

              <CyberHolographicCard>
                <div className="text-center">
                  <h3 className="text-2xl font-heading text-gold-primary mb-4">
                    Premium Design
                  </h3>
                  <p className="text-white/80">
                    GPU-accelerated animations with mouse tracking and
                    interactive hover effects.
                  </p>
                </div>
              </CyberHolographicCard>

              <CyberHolographicCard>
                <div className="text-center">
                  <h3 className="text-2xl font-heading text-gold-primary mb-4">
                    Full Fidelity
                  </h3>
                  <p className="text-white/80">
                    100% visual accuracy to WordPress originals with
                    Tailwind CSS v4 integration.
                  </p>
                </div>
              </CyberHolographicCard>
            </div>
          </section>

          {/* Accordion Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-heading text-gold-primary mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto">
              <Accordion
                items={faqItems}
                allowMultiple={false}
                variant="default"
              />
            </div>
          </section>

          {/* Small Accordion Variant */}
          <section className="mb-20">
            <h2 className="text-3xl font-heading text-gold-primary mb-8 text-center">
              Quick Tips (Small Variant)
            </h2>
            <div className="max-w-3xl mx-auto">
              <Accordion
                items={[
                  {
                    title: 'Tip #1: Component Imports',
                    content: <p>Import from @/components/wordpress for tree-shaking support.</p>
                  },
                  {
                    title: 'Tip #2: CSS Variables',
                    content: <p>Ensure all CSS variables are defined in your globals.css.</p>
                  },
                ]}
                variant="small"
              />
            </div>
          </section>

          {/* Features Grid */}
          <section className="mb-20">
            <h2 className="text-3xl font-heading text-gold-primary mb-8 text-center">
              Component Features
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-heading text-gold-primary mb-3">
                  🎨 Gold Theme
                </h3>
                <p className="text-white/80">
                  Premium gold (#FFD700) color scheme with glow animations and pulsing effects.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-heading text-gold-primary mb-3">
                  ⚡ GPU Accelerated
                </h3>
                <p className="text-white/80">
                  All animations use transform: translateZ(0) for smooth 60 FPS performance.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-heading text-gold-primary mb-3">
                  ♿ Accessible
                </h3>
                <p className="text-white/80">
                  Full ARIA support, keyboard navigation, and respects prefers-reduced-motion.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-heading text-gold-primary mb-3">
                  📱 Responsive
                </h3>
                <p className="text-white/80">
                  Mobile-optimized with responsive sizing using CSS clamp() functions.
                </p>
              </div>
            </div>
          </section>

          {/* Footer CTA */}
          <section className="text-center">
            <h2 className="text-3xl font-heading text-gold-primary mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              All components are production-ready with TypeScript support
              and complete documentation.
            </p>
            <CTAButton href="/documentation">
              VIEW DOCUMENTATION
            </CTAButton>
          </section>

        </div>
      </main>
    </>
  );
}

/**
 * Alternative: Individual Component Imports
 *
 * If you prefer to import components individually:
 */

/*
import StarField from '@/components/wordpress/backgrounds/StarField';
import CTAButton from '@/components/wordpress/buttons/CTAButton';
import CyberHolographicCard from '@/components/wordpress/cards/CyberHolographicCard';
import Accordion from '@/components/wordpress/special/Accordion';
import type { AccordionItem } from '@/components/wordpress/types';
*/

/**
 * Required CSS Variables (add to globals.css):
 *
 * :root {
 *   --gold-primary: #FFD700;
 *   --font-heading: 'Amulya', sans-serif;
 *   --font-body: 'Synonym', sans-serif;
 *   --size-button: clamp(0.875rem, 1.5vw, 1rem);
 *   --size-h3: clamp(20px, 2.5vw, 36px);
 *   --size-arrow: clamp(1.2rem, 2vw, 2.5rem);
 *   --space-1: 0.25rem;
 *   --space-2: 0.5rem;
 *   --space-3: 0.75rem;
 *   --space-4: 1rem;
 *   --space-5: 1.25rem;
 *   --space-6: 1.5rem;
 *   --space-8: 2rem;
 *   --radius-lg: 12px;
 *   --color-bg-overlay-1: rgba(26, 26, 26, 0.8);
 *   --color-text-primary: #ffffff;
 *   --color-text-secondary: rgba(255, 255, 255, 0.9);
 * }
 */

/**
 * Tailwind Config Extensions (add to tailwind.config.js):
 *
 * module.exports = {
 *   theme: {
 *     extend: {
 *       colors: {
 *         gold: {
 *           primary: 'var(--gold-primary)',
 *         },
 *       },
 *       boxShadow: {
 *         'gold-glow': '0 0 5px #ffd700, 0 0 15px #ffd700, 0 0 30px #ffd700, 0 0 60px #ffd700',
 *       },
 *       fontFamily: {
 *         heading: ['var(--font-heading)'],
 *         body: ['var(--font-body)'],
 *       },
 *     },
 *   },
 * };
 */
