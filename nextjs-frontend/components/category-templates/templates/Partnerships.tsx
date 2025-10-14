'use client';

/**
 * Partnerships Template Component
 *
 * Category template for 'partnerships' showcasing strategic alliances,
 * vendor relationships, and collaboration opportunities.
 *
 * @module category-templates/templates/Partnerships
 */

import { TemplateSection } from '../TemplateSection';
import { TemplateHero } from '../TemplateHero';
import { TemplateFeatureGrid } from '../TemplateFeatureGrid';
import { TemplateCTA } from '../TemplateCTA';
import { CTAButton } from '@/components/saa';
import type { TemplateProps } from '@/lib/category-templates/registry';
import {
  Handshake,
  Link,
  Network,
  Award
} from 'lucide-react';

export default function Partnerships({ category, posts, settings }: TemplateProps) {
  const features = [
    {
      icon: <Handshake className="h-8 w-8" />,
      title: "Strategic Alliances",
      description: "Partnerships with industry leaders providing agents exclusive access to premium services and discounts"
    },
    {
      icon: <Network className="h-8 w-8" />,
      title: "Vendor Network",
      description: "Curated network of trusted vendors for title, mortgage, insurance, and transaction services"
    },
    {
      icon: <Link className="h-8 w-8" />,
      title: "Technology Partners",
      description: "Integrations with leading CRM, marketing, and transaction platforms to streamline your workflow"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Preferred Programs",
      description: "Exclusive agent benefits, discounts, and perks through our partner ecosystem"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-[#dcdbd5]">
      <TemplateSection disableAnimation>
        <TemplateHero
          title="Partnerships"
          subtitle="Leverage strategic partnerships and vendor relationships to deliver exceptional service and value to your clients"
          ctaText="Explore Partners"
          ctaLink="/contact"
        />
      </TemplateSection>

      <TemplateSection variant="dark">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-[#e5e4dd]">
              Powered by Strategic Partnerships
            </h2>
            <p className="mx-auto max-w-2xl text-[clamp(1rem,2vw,1.125rem)] text-[#dcdbd5] font-[var(--font-amulya)]">
              Access vetted partners and exclusive benefits that enhance your service offering
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
                100+
              </div>
              <div className="text-[clamp(1rem,2vw,1.25rem)] text-[#e5e4dd] font-[var(--font-taskor)]">
                Trusted Partners
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#00ff88] font-[var(--font-taskor)]">
                $10K+
              </div>
              <div className="text-[clamp(1rem,2vw,1.25rem)] text-[#e5e4dd] font-[var(--font-taskor)]">
                Average Annual Savings
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#00ff88] font-[var(--font-taskor)]">
                50+
              </div>
              <div className="text-[clamp(1rem,2vw,1.25rem)] text-[#e5e4dd] font-[var(--font-taskor)]">
                Integration Platforms
              </div>
            </div>
          </div>
        </div>
      </TemplateSection>

      <TemplateSection>
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-[#e5e4dd]">
              Partnership Highlights
            </h2>
            <p className="mx-auto max-w-2xl text-[clamp(1rem,2vw,1.125rem)] text-[#dcdbd5] font-[var(--font-amulya)]">
              Discover new partnerships and exclusive benefits
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
                  <CTAButton href={`/blog/${post.slug}`} variant="secondary" size="small" className="w-full">
                    Learn More
                  </CTAButton>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#00ff88]/0 via-[#00ff88]/0 to-[#00ff88]/5 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-[#00ff88]/20 bg-[#0a0a0a] p-12 text-center">
              <p className="text-[clamp(1rem,2vw,1.125rem)] text-[#dcdbd5] font-[var(--font-amulya)]">
                No partnership news available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </TemplateSection>

      <TemplateSection>
        <div className="mx-auto max-w-5xl">
          <TemplateCTA
            heading="Unlock Partnership Benefits"
            description="Join eXp Realty and gain instant access to our network of strategic partners, exclusive discounts, and premium services."
            ctaText="See All Partners"
            ctaLink="/contact"
            variant="gradient"
          />
        </div>
      </TemplateSection>
    </div>
  );
}
