'use client';

/**
 * GlobalExpansion Template Component
 *
 * Category template for 'global-expansion' showcasing international
 * markets, cross-border opportunities, and worldwide presence.
 *
 * @module category-templates/templates/GlobalExpansion
 */

import { TemplateSection } from '../TemplateSection';
import { TemplateHero } from '../TemplateHero';
import { TemplateFeatureGrid } from '../TemplateFeatureGrid';
import { TemplateCTA } from '../TemplateCTA';
import { CTAButton } from '@/components/saa';
import type { TemplateProps } from '@/lib/category-templates/registry';
import {
  Globe2,
  MapPin,
  Languages,
  Plane
} from 'lucide-react';

export default function GlobalExpansion({ category, posts, settings }: TemplateProps) {
  const features = [
    {
      icon: <Globe2 className="h-8 w-8" />,
      title: "20+ Countries",
      description: "Operate seamlessly across North America, Europe, Asia, and beyond through our unified cloud-based platform"
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Local Market Expertise",
      description: "Access region-specific insights, regulations, and best practices from experienced agents in every market"
    },
    {
      icon: <Languages className="h-8 w-8" />,
      title: "Multilingual Support",
      description: "Serve diverse clientele with platform support and agent networks spanning multiple languages and cultures"
    },
    {
      icon: <Plane className="h-8 w-8" />,
      title: "Cross-Border Referrals",
      description: "Generate income through international referrals and help clients navigate global real estate transactions"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-[#dcdbd5]">
      <TemplateSection disableAnimation>
        <TemplateHero
          title="Global Expansion"
          subtitle="Break geographic boundaries and tap into international real estate markets with the world's fastest-growing cloud-based brokerage"
          ctaText="Go Global"
          ctaLink="/contact"
        />
      </TemplateSection>

      <TemplateSection variant="dark">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-[#e5e4dd]">
              Your Gateway to Global Markets
            </h2>
            <p className="mx-auto max-w-2xl text-[clamp(1rem,2vw,1.125rem)] text-[#dcdbd5] font-[var(--font-amulya)]">
              Expand your business internationally with infrastructure, support, and networks already in place
            </p>
          </div>
          <TemplateFeatureGrid features={features} columns={4} />
        </div>
      </TemplateSection>

      <TemplateSection variant="accent">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#00ff88] font-[var(--font-taskor)]">
                20+
              </div>
              <div className="text-[clamp(1rem,2vw,1.25rem)] text-[#e5e4dd] font-[var(--font-taskor)]">
                Countries Worldwide
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#00ff88] font-[var(--font-taskor)]">
                85K+
              </div>
              <div className="text-[clamp(1rem,2vw,1.25rem)] text-[#e5e4dd] font-[var(--font-taskor)]">
                Global Agent Network
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#00ff88] font-[var(--font-taskor)]">
                6
              </div>
              <div className="text-[clamp(1rem,2vw,1.25rem)] text-[#e5e4dd] font-[var(--font-taskor)]">
                Continents
              </div>
            </div>
          </div>
        </div>
      </TemplateSection>

      <TemplateSection>
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-[#e5e4dd]">
              Global Expansion News
            </h2>
            <p className="mx-auto max-w-2xl text-[clamp(1rem,2vw,1.125rem)] text-[#dcdbd5] font-[var(--font-amulya)]">
              Stay updated on international growth, market entries, and global opportunities
            </p>
          </div>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group relative overflow-hidden rounded-lg border border-[#00ff88]/20 bg-gradient-to-br from-[#0a0a0a] to-[#111] p-6 transition-all hover:border-[#00ff88]/40 hover:shadow-lg hover:shadow-[#00ff88]/10"
                >
                  {post.featuredImage && (
                    <div className="mb-4 -mx-6 -mt-6 h-48 overflow-hidden">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <h3 className="mb-3 text-[clamp(1.125rem,2vw,1.5rem)] font-bold text-[#e5e4dd] font-[var(--font-taskor)] line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <div
                      className="mb-4 text-[clamp(0.875rem,1.5vw,1rem)] text-[#dcdbd5] font-[var(--font-amulya)] line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: post.excerpt }}
                    />
                  )}
                  <div className="mb-4 flex items-center gap-4 text-sm text-[#dcdbd5]/70">
                    {post.author && <span className="font-[var(--font-amulya)]">By {post.author}</span>}
                    {post.date && (
                      <span className="font-[var(--font-amulya)]">
                        {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <CTAButton href={`/blog/${post.slug}`} className="w-full">
                    Read Article
                  </CTAButton>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#00ff88]/0 via-[#00ff88]/0 to-[#00ff88]/5 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-[#00ff88]/20 bg-[#0a0a0a] p-12 text-center">
              <p className="text-[clamp(1rem,2vw,1.125rem)] text-[#dcdbd5] font-[var(--font-amulya)]">
                No global expansion news available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </TemplateSection>

      <TemplateSection>
        <div className="mx-auto max-w-5xl">
          <TemplateCTA
            heading="Think Globally, Grow Exponentially"
            description="Join eXp Realty and unlock international opportunities. Build a business without borders through our global platform and agent network."
            ctaText="Explore Global Markets"
            ctaLink="/contact"
          />
        </div>
      </TemplateSection>
    </div>
  );
}
