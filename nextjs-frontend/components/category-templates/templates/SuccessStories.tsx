'use client';

/**
 * SuccessStories Template Component
 *
 * Category template for 'success-stories' showcasing agent achievements,
 * transformation stories, and career milestones.
 *
 * @module category-templates/templates/SuccessStories
 */

import { TemplateSection } from '../TemplateSection';
import { TemplateHero } from '../TemplateHero';
import { TemplateFeatureGrid } from '../TemplateFeatureGrid';
import { TemplateCTA } from '../TemplateCTA';
import { CTAButton } from '@/components/saa';
import type { TemplateProps } from '@/lib/category-templates/registry';
import {
  Trophy,
  Target,
  Rocket,
  Award
} from 'lucide-react';

export default function SuccessStories({ category, posts, settings }: TemplateProps) {
  const features = [
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Record-Breaking Agents",
      description: "Stories of agents who shattered sales records and achieved unprecedented growth with eXp's platform and support"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Career Transformations",
      description: "Real accounts of professionals who pivoted to real estate and built thriving businesses from the ground up"
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Team Growth Stories",
      description: "How agents scaled their operations, built successful teams, and created sustainable revenue streams"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Recognition & Awards",
      description: "Celebrate agents who earned industry accolades, company honors, and community recognition"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-[#dcdbd5]">
      <TemplateSection disableAnimation>
        <TemplateHero
          title="Success Stories"
          subtitle="Be inspired by real agents achieving extraordinary results through innovation, dedication, and the eXp Realty advantage"
          ctaText="Read Success Stories"
          ctaLink="/contact"
        />
      </TemplateSection>

        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-[#e5e4dd]">
              Real Agents, Real Results
            </h2>
            <p className="mx-auto max-w-2xl text-[clamp(1rem,2vw,1.125rem)] text-[#dcdbd5] font-[var(--font-amulya)]">
              Discover how agents like you are achieving their biggest goals and transforming their careers
            </p>
          </div>
          <TemplateFeatureGrid features={features} columns={4} />
        </div>
      </TemplateSection>

        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#00ff88] font-[var(--font-taskor)]">
                $1B+
              </div>
              <div className="text-[clamp(1rem,2vw,1.25rem)] text-[#e5e4dd] font-[var(--font-taskor)]">
                Agent Career Earnings
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#00ff88] font-[var(--font-taskor)]">
                10,000+
              </div>
              <div className="text-[clamp(1rem,2vw,1.25rem)] text-[#e5e4dd] font-[var(--font-taskor)]">
                Success Stories Shared
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#00ff88] font-[var(--font-taskor)]">
                500%
              </div>
              <div className="text-[clamp(1rem,2vw,1.25rem)] text-[#e5e4dd] font-[var(--font-taskor)]">
                Average Income Growth
              </div>
            </div>
          </div>
        </div>
      </TemplateSection>

      <TemplateSection>
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-[#e5e4dd]">
              Inspiring Success Stories
            </h2>
            <p className="mx-auto max-w-2xl text-[clamp(1rem,2vw,1.125rem)] text-[#dcdbd5] font-[var(--font-amulya)]">
              Learn from agents who turned their dreams into reality
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
                    Read Success Story
                  </CTAButton>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#00ff88]/0 via-[#00ff88]/0 to-[#00ff88]/5 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-[#00ff88]/20 bg-[#0a0a0a] p-12 text-center">
              <p className="text-[clamp(1rem,2vw,1.125rem)] text-[#dcdbd5] font-[var(--font-amulya)]">
                No success stories available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </TemplateSection>

      <TemplateSection>
        <div className="mx-auto max-w-5xl">
          <TemplateCTA
            heading="Write Your Success Story"
            description="Your breakthrough is waiting. Join eXp Realty and discover the tools, community, and support you need to achieve extraordinary results."
            ctaText="Start Your Journey"
            ctaLink="/contact"
          />
        </div>
      </TemplateSection>
    </div>
  );
}
