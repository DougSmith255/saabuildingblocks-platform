'use client';

/**
 * FaqSupport Template Component
 *
 * Category template for 'faq-support' showcasing frequently asked questions,
 * help resources, and support channels.
 *
 * @module category-templates/templates/FaqSupport
 */

import { TemplateSection } from '../TemplateSection';
import { TemplateHero } from '../TemplateHero';
import { TemplateFeatureGrid } from '../TemplateFeatureGrid';
import { TemplateCTA } from '../TemplateCTA';
import { CTAButton } from '@/components/saa';
import type { TemplateProps } from '@/lib/category-templates/registry';
import {
  HelpCircle,
  MessageCircle,
  BookOpen,
  Headphones
} from 'lucide-react';

export default function FaqSupport({ category, posts, settings }: TemplateProps) {
  const features = [
    {
      icon: <HelpCircle className="h-8 w-8" />,
      title: "Knowledge Base",
      description: "Comprehensive help center with step-by-step guides, tutorials, and answers to common questions"
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Live Chat Support",
      description: "Instant assistance from support specialists available 24/7 to resolve issues quickly"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Video Tutorials",
      description: "Visual learning resources covering platform features, best practices, and troubleshooting"
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: "Phone Support",
      description: "Direct access to technical support teams for complex issues requiring personalized assistance"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-[#dcdbd5]">
      <TemplateSection disableAnimation>
        <TemplateHero
          title="FAQ & Support"
          subtitle="Get answers to your questions and access comprehensive support resources whenever you need help"
          ctaText="Browse FAQs"
          ctaLink="/contact"
        />
      </TemplateSection>

      <TemplateSection variant="dark">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-[#e5e4dd]">
              We're Here to Help
            </h2>
            <p className="mx-auto max-w-2xl text-[clamp(1rem,2vw,1.125rem)] text-[#dcdbd5] font-[var(--font-amulya)]">
              Access multiple support channels and resources to ensure you're never stuck
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
                24/7
              </div>
              <div className="text-[clamp(1rem,2vw,1.25rem)] text-[#e5e4dd] font-[var(--font-taskor)]">
                Support Available
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#00ff88] font-[var(--font-taskor)]">
                &lt;2min
              </div>
              <div className="text-[clamp(1rem,2vw,1.25rem)] text-[#e5e4dd] font-[var(--font-taskor)]">
                Average Response Time
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#00ff88] font-[var(--font-taskor)]">
                1000+
              </div>
              <div className="text-[clamp(1rem,2vw,1.25rem)] text-[#e5e4dd] font-[var(--font-taskor)]">
                Help Articles
              </div>
            </div>
          </div>
        </div>
      </TemplateSection>

      <TemplateSection>
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-[#e5e4dd]">
              Common Questions & Guides
            </h2>
            <p className="mx-auto max-w-2xl text-[clamp(1rem,2vw,1.125rem)] text-[#dcdbd5] font-[var(--font-amulya)]">
              Find answers to frequently asked questions and detailed guides
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
                    Read Answer
                  </CTAButton>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#00ff88]/0 via-[#00ff88]/0 to-[#00ff88]/5 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-[#00ff88]/20 bg-[#0a0a0a] p-12 text-center">
              <p className="text-[clamp(1rem,2vw,1.125rem)] text-[#dcdbd5] font-[var(--font-amulya)]">
                No support articles available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </TemplateSection>

      <TemplateSection>
        <div className="mx-auto max-w-5xl">
          <TemplateCTA
            heading="Need More Help?"
            description="Our support team is standing by to assist you. Get in touch via chat, phone, or email for personalized assistance."
            ctaText="Contact Support"
            ctaLink="/contact"
            variant="gradient"
          />
        </div>
      </TemplateSection>
    </div>
  );
}
