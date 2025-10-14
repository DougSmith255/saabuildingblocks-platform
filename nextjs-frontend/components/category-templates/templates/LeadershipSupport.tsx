'use client';

/**
 * LeadershipSupport Template Component
 *
 * Category template for 'leadership-support' showcasing mentorship,
 * coaching, and leadership development programs.
 *
 * @module category-templates/templates/LeadershipSupport
 */

import { TemplateSection } from '../TemplateSection';
import { TemplateHero } from '../TemplateHero';
import { TemplateFeatureGrid } from '../TemplateFeatureGrid';
import { TemplateCTA } from '../TemplateCTA';
import { CTAButton } from '@/components/saa';
import type { TemplateProps } from '@/lib/category-templates/registry';
import {
  Users,
  Compass,
  Briefcase,
  Shield
} from 'lucide-react';

export default function LeadershipSupport({ category, posts, settings }: TemplateProps) {
  const features = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Executive Leadership",
      description: "Access to experienced executives and industry veterans who provide strategic guidance and visionary direction"
    },
    {
      icon: <Compass className="h-8 w-8" />,
      title: "Personal Coaching",
      description: "One-on-one coaching from certified business coaches focused on goal achievement and performance optimization"
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "Team Building Support",
      description: "Comprehensive resources for recruiting, onboarding, and developing high-performing agent teams"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Compliance Assistance",
      description: "Expert legal and compliance support ensuring you operate with confidence in every transaction"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-[#dcdbd5]">
      <TemplateSection disableAnimation>
        <TemplateHero
          title="Leadership & Support"
          subtitle="Receive world-class guidance, mentorship, and support from industry leaders committed to your success"
          ctaText="Meet Our Leaders"
          ctaLink="/contact"
        />
      </TemplateSection>

        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-[#e5e4dd]">
              Support at Every Level
            </h2>
            <p className="mx-auto max-w-2xl text-[clamp(1rem,2vw,1.125rem)] text-[#dcdbd5] font-[var(--font-amulya)]">
              From day one to industry veteran, you'll have access to experienced leaders dedicated to your growth
            </p>
          </div>
          <TemplateFeatureGrid features={features} columns={4} />
        </div>
      </TemplateSection>

        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#00ff88] font-[var(--font-taskor)]">
                24/7
              </div>
              <div className="text-[clamp(1rem,2vw,1.25rem)] text-[#e5e4dd] font-[var(--font-taskor)]">
                Leadership Access
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#00ff88] font-[var(--font-taskor)]">
                500+
              </div>
              <div className="text-[clamp(1rem,2vw,1.25rem)] text-[#e5e4dd] font-[var(--font-taskor)]">
                Certified Coaches
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#00ff88] font-[var(--font-taskor)]">
                100%
              </div>
              <div className="text-[clamp(1rem,2vw,1.25rem)] text-[#e5e4dd] font-[var(--font-taskor)]">
                Agent-First Philosophy
              </div>
            </div>
          </div>
        </div>
      </TemplateSection>

      <TemplateSection>
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-[#e5e4dd]">
              Leadership Insights
            </h2>
            <p className="mx-auto max-w-2xl text-[clamp(1rem,2vw,1.125rem)] text-[#dcdbd5] font-[var(--font-amulya)]">
              Learn from industry leaders and discover best practices for growth
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
                    Read Article
                  </CTAButton>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#00ff88]/0 via-[#00ff88]/0 to-[#00ff88]/5 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-[#00ff88]/20 bg-[#0a0a0a] p-12 text-center">
              <p className="text-[clamp(1rem,2vw,1.125rem)] text-[#dcdbd5] font-[var(--font-amulya)]">
                No leadership content available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </TemplateSection>

      <TemplateSection>
        <div className="mx-auto max-w-5xl">
          <TemplateCTA
            heading="Experience True Leadership Support"
            description="Join a brokerage where leadership is accessible, supportive, and genuinely invested in your success. You're never alone at eXp Realty."
            ctaText="Connect with Leaders"
            ctaLink="/contact"
          />
        </div>
      </TemplateSection>
    </div>
  );
}
