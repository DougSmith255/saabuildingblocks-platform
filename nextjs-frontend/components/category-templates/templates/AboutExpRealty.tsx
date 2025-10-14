'use client';

/**
 * AboutExpRealty Template Component
 *
 * Category template for 'about-exp' category showcasing eXp Realty's
 * cloud-based real estate brokerage model, global reach, and technology platform.
 *
 * Features:
 * - Dramatic hero section with CTA
 * - Feature grid highlighting key differentiators (4 features)
 * - Blog posts list with category-specific styling
 * - Gradient CTA section
 *
 * @module category-templates/templates/AboutExpRealty
 */

import { TemplateSection } from '../TemplateSection';
import { TemplateHero } from '../TemplateHero';
import { TemplateFeatureGrid } from '../TemplateFeatureGrid';
import { TemplateCTA } from '../TemplateCTA';
import { CTAButton } from '@/components/saa';
import type { TemplateProps } from '@/lib/category-templates/registry';
import {
  Globe,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';

/**
 * AboutExpRealty Template Component
 *
 * Renders a comprehensive overview of eXp Realty with hero, features,
 * blog posts, and CTA sections. All sections use scroll-triggered animations
 * except the hero which animates immediately.
 */
export default function AboutExpRealty({ category, posts, settings }: TemplateProps) {
  // Features highlighting eXp Realty's unique value propositions
  const features = [
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Reach",
      description: "Access to international markets through a cloud-based brokerage model that spans multiple continents and time zones"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Revenue Sharing",
      description: "Unique compensation model with revenue sharing opportunities that reward agent growth and team building"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Advanced Technology",
      description: "Industry-leading technology platform with AI-powered tools, virtual office, and real-time collaboration features"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Agent-Centric Culture",
      description: "Built by agents, for agents - fostering a collaborative community focused on mutual success and professional growth"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-[#dcdbd5]">
      {/* Hero Section - No animation delay */}
      <TemplateSection disableAnimation>
        <TemplateHero
          title="About eXp Realty"
          subtitle="The cloud-based real estate brokerage revolutionizing the industry with technology, innovation, and agent-first culture"
          ctaText="Explore eXp"
          ctaLink="/contact"
        />
      </TemplateSection>

      {/* Features Section - Dark background */}
      <TemplateSection variant="dark">
        <div className="mx-auto max-w-6xl">
          {/* Section heading */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-[#e5e4dd]">
              Why Choose eXp Realty?
            </h2>
            <p className="mx-auto max-w-2xl text-[clamp(1rem,2vw,1.125rem)] text-[#dcdbd5] font-[var(--font-amulya)]">
              Discover what makes eXp Realty the fastest-growing real estate brokerage in the world
            </p>
          </div>

          {/* Feature grid with 4 columns on desktop */}
          <TemplateFeatureGrid features={features} columns={4} />
        </div>
      </TemplateSection>

      {/* Stats Section - Accent background */}
      <TemplateSection variant="accent">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Stat 1 */}
            <div className="text-center">
              <div className="mb-2 text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#00ff88] font-[var(--font-taskor)]">
                85,000+
              </div>
              <div className="text-[clamp(1rem,2vw,1.25rem)] text-[#e5e4dd] font-[var(--font-taskor)]">
                Real Estate Professionals
              </div>
            </div>

            {/* Stat 2 */}
            <div className="text-center">
              <div className="mb-2 text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#00ff88] font-[var(--font-taskor)]">
                20+
              </div>
              <div className="text-[clamp(1rem,2vw,1.25rem)] text-[#e5e4dd] font-[var(--font-taskor)]">
                Countries Worldwide
              </div>
            </div>

            {/* Stat 3 */}
            <div className="text-center">
              <div className="mb-2 text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#00ff88] font-[var(--font-taskor)]">
                #1
              </div>
              <div className="text-[clamp(1rem,2vw,1.25rem)] text-[#e5e4dd] font-[var(--font-taskor)]">
                Cloud-Based Brokerage
              </div>
            </div>
          </div>
        </div>
      </TemplateSection>

      {/* Blog Posts Section */}
      <TemplateSection>
        <div className="mx-auto max-w-6xl">
          {/* Section heading */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-[#e5e4dd]">
              Latest Articles About eXp Realty
            </h2>
            <p className="mx-auto max-w-2xl text-[clamp(1rem,2vw,1.125rem)] text-[#dcdbd5] font-[var(--font-amulya)]">
              Explore insights, updates, and stories from the eXp community
            </p>
          </div>

          {/* Posts grid */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group relative overflow-hidden rounded-lg border border-[#00ff88]/20 bg-gradient-to-br from-[#0a0a0a] to-[#111] p-6 transition-all hover:border-[#00ff88]/40 hover:shadow-lg hover:shadow-[#00ff88]/10"
                >
                  {/* Featured image if available */}
                  {post.featuredImage && (
                    <div className="mb-4 -mx-6 -mt-6 h-48 overflow-hidden">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Post title */}
                  <h3 className="mb-3 text-[clamp(1.125rem,2vw,1.5rem)] font-bold text-[#e5e4dd] font-[var(--font-taskor)] line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Post excerpt */}
                  {post.excerpt && (
                    <div
                      className="mb-4 text-[clamp(0.875rem,1.5vw,1rem)] text-[#dcdbd5] font-[var(--font-amulya)] line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: post.excerpt }}
                    />
                  )}

                  {/* Post meta */}
                  <div className="mb-4 flex items-center gap-4 text-sm text-[#dcdbd5]/70">
                    {post.author && (
                      <span className="font-[var(--font-amulya)]">
                        By {post.author}
                      </span>
                    )}
                    {post.date && (
                      <span className="font-[var(--font-amulya)]">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    )}
                  </div>

                  {/* Read more link */}
                  <CTAButton
                    href={`/blog/${post.slug}`}
                    className="w-full"
                  >
                    Read Article
                  </CTAButton>

                  {/* Hover gradient effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#00ff88]/0 via-[#00ff88]/0 to-[#00ff88]/5 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />
                </article>
              ))}
            </div>
          ) : (
            // No posts message
            <div className="rounded-lg border border-[#00ff88]/20 bg-[#0a0a0a] p-12 text-center">
              <p className="text-[clamp(1rem,2vw,1.125rem)] text-[#dcdbd5] font-[var(--font-amulya)]">
                No articles available yet. Check back soon for updates about eXp Realty!
              </p>
            </div>
          )}
        </div>
      </TemplateSection>

      {/* Final CTA Section */}
      <TemplateSection>
        <div className="mx-auto max-w-5xl">
          <TemplateCTA
            heading="Ready to Join eXp Realty?"
            description="Discover why thousands of real estate agents chose eXp Realty as their brokerage. Experience the power of cloud-based technology, revenue sharing, and a global agent community."
            ctaText="Contact Us Today"
            ctaLink="/contact"
          />
        </div>
      </TemplateSection>
    </div>
  );
}
