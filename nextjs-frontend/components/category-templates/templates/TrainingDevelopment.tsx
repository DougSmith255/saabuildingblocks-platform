'use client';

/**
 * TrainingDevelopment Template Component
 *
 * Category template for 'training-development' showcasing eXp Realty's
 * comprehensive training programs, mentorship opportunities, and skill development.
 *
 * Features:
 * - Hero section focused on agent development
 * - Feature grid highlighting training programs
 * - Blog posts list with training-specific styling
 * - CTA encouraging enrollment
 *
 * @module category-templates/templates/TrainingDevelopment
 */

import { TemplateSection } from '../TemplateSection';
import { TemplateHero } from '../TemplateHero';
import { TemplateFeatureGrid } from '../TemplateFeatureGrid';
import { TemplateCTA } from '../TemplateCTA';
import { CTAButton } from '@/components/saa';
import type { TemplateProps } from '@/lib/category-templates/registry';
import {
  GraduationCap,
  BookOpen,
  UserCheck,
  TrendingUp
} from 'lucide-react';

/**
 * TrainingDevelopment Template Component
 */
export default function TrainingDevelopment({ category, posts, settings }: TemplateProps) {
  const features = [
    {
      icon: <GraduationCap className="h-8 w-8" />,
      title: "eXp University",
      description: "Comprehensive online learning platform with 200+ courses covering real estate fundamentals, advanced strategies, and business growth"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Live Training Events",
      description: "Weekly webinars, masterclasses, and workshops led by industry experts and top-producing agents sharing actionable insights"
    },
    {
      icon: <UserCheck className="h-8 w-8" />,
      title: "Mentorship Programs",
      description: "One-on-one guidance from experienced agents who help you navigate challenges and accelerate your career growth"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Continuing Education",
      description: "State-approved CE courses, designation prep, and advanced certifications to maintain licenses and expand expertise"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-[#dcdbd5]">
      {/* Hero Section */}
      <TemplateSection disableAnimation>
        <TemplateHero
          title="Training & Development"
          subtitle="Invest in your success with world-class training programs, mentorship, and continuous learning opportunities designed for real estate professionals"
          ctaText="Start Learning"
          ctaLink="/contact"
        />
      </TemplateSection>

      {/* Features Section */}
      <TemplateSection variant="dark">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-[#e5e4dd]">
              Comprehensive Training Ecosystem
            </h2>
            <p className="mx-auto max-w-2xl text-[clamp(1rem,2vw,1.125rem)] text-[#dcdbd5] font-[var(--font-amulya)]">
              From new agents to seasoned professionals, our training programs provide the knowledge and skills you need to excel
            </p>
          </div>

          <TemplateFeatureGrid features={features} columns={4} />
        </div>
      </TemplateSection>

      {/* Stats Section */}
      <TemplateSection variant="accent">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#00ff88] font-[var(--font-taskor)]">
                200+
              </div>
              <div className="text-[clamp(1rem,2vw,1.25rem)] text-[#e5e4dd] font-[var(--font-taskor)]">
                Online Courses Available
              </div>
            </div>

            <div className="text-center">
              <div className="mb-2 text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#00ff88] font-[var(--font-taskor)]">
                24/7
              </div>
              <div className="text-[clamp(1rem,2vw,1.25rem)] text-[#e5e4dd] font-[var(--font-taskor)]">
                Access to Training Resources
              </div>
            </div>

            <div className="text-center">
              <div className="mb-2 text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#00ff88] font-[var(--font-taskor)]">
                Weekly
              </div>
              <div className="text-[clamp(1rem,2vw,1.25rem)] text-[#e5e4dd] font-[var(--font-taskor)]">
                Live Training Sessions
              </div>
            </div>
          </div>
        </div>
      </TemplateSection>

      {/* Blog Posts Section */}
      <TemplateSection>
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-[#e5e4dd]">
              Training Resources & Insights
            </h2>
            <p className="mx-auto max-w-2xl text-[clamp(1rem,2vw,1.125rem)] text-[#dcdbd5] font-[var(--font-amulya)]">
              Explore articles, guides, and success stories about professional development
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

                  <CTAButton
                    href={`/blog/${post.slug}`}
                    className="w-full"
                  >
                    Read Article
                  </CTAButton>

                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#00ff88]/0 via-[#00ff88]/0 to-[#00ff88]/5 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-[#00ff88]/20 bg-[#0a0a0a] p-12 text-center">
              <p className="text-[clamp(1rem,2vw,1.125rem)] text-[#dcdbd5] font-[var(--font-amulya)]">
                No training resources available yet. Check back soon for updates!
              </p>
            </div>
          )}
        </div>
      </TemplateSection>

      {/* Final CTA Section */}
      <TemplateSection>
        <div className="mx-auto max-w-5xl">
          <TemplateCTA
            heading="Ready to Elevate Your Skills?"
            description="Join eXp Realty and gain access to industry-leading training programs that will accelerate your career and maximize your earning potential."
            ctaText="Get Started Today"
            ctaLink="/contact"
          />
        </div>
      </TemplateSection>
    </div>
  );
}
