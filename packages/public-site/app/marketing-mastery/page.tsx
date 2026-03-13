import { GenericCard } from '@saa/shared/components/saa/cards';
import { H1, H2, Tagline } from '@saa/shared/components/saa/headings';
import { FAQ } from '@saa/shared/components/saa/interactive';
import { CTAButton } from '@saa/shared/components/saa/buttons';
import { LazySection } from '@/components/shared/LazySection';
import { JoinAllianceCTA } from '@/components/shared/JoinAllianceCTA';
import { StickyHeroWrapper } from '@/components/shared/hero-effects/StickyHeroWrapper';
import { AsteroidBeltEffect } from '@/components/shared/hero-effects/AsteroidBeltEffect';

/**
 * Marketing Mastery Hub - Pillar Page
 * Links to all marketing guides for real estate agents
 */

const articles = [
  { title: 'Free Leads for Realtors: 15 Strategies', href: '/blog/marketing-mastery/free-leads', desc: '15 proven strategies to generate leads without spending a dime on advertising.' },
  { title: 'Google Ads for Real Estate Agents', href: '/blog/marketing-mastery/google-ads', desc: 'Step-by-step guide to running profitable Google Ads campaigns in your market.' },
  { title: '22 Blog Ideas for Real Estate Agents', href: '/blog/marketing-mastery/blog-ideas', desc: 'Content ideas that attract organic traffic and position you as the local expert.' },
  { title: 'Real Estate Agent Headshot Guide', href: '/blog/marketing-mastery/headshots', desc: 'Tips, examples, and mistakes to avoid for a professional headshot that builds trust.' },
  { title: 'Social Media Marketing for Agents', href: '/blog/marketing-mastery/social-media-use', desc: 'A complete guide to building your brand and generating leads on social platforms.' },
  { title: 'Top 10 Social Platforms for Agents', href: '/blog/marketing-mastery/social-network', desc: 'Where to focus your time based on audience demographics and lead potential.' },
  { title: 'Domain Name Strategy for Realtors', href: '/blog/marketing-mastery/domains', desc: 'How to choose a domain name that builds your brand and ranks in search.' },
  { title: 'Open House Checklist for Agents', href: '/blog/marketing-mastery/open-house-checklist', desc: 'Everything you need before, during, and after an open house to maximize results.' },
  { title: 'Master Expired Listing Scripts', href: '/blog/marketing-mastery/expired', desc: 'Turn seller rejection into income with scripts that actually convert expired leads.' },
  { title: '10 Marketing Mistakes to Fix', href: '/blog/marketing-mastery/marketing-mistakes', desc: 'Common marketing missteps agents make and how to correct them fast.' },
  { title: 'YouTube Guide for Realtors', href: '/blog/marketing-mastery/youtube-launch', desc: 'How to launch and grow a YouTube channel that generates consistent leads.' },
  { title: 'Content Repurposing for Agents', href: '/blog/marketing-mastery/repurpose-content', desc: 'Turn one piece of content into 10+ touchpoints across every platform.' },
  { title: 'Instagram Hashtags for Real Estate', href: '/blog/marketing-mastery/instagram-hashtags', desc: 'The right hashtag strategy to get your content in front of local buyers and sellers.' },
  { title: 'LinkedIn Tactics for Real Estate', href: '/blog/marketing-mastery/linkedin-tips', desc: '7 strategies to generate high-quality leads from the most professional social network.' },
  { title: 'ChatGPT Prompts for Realtors', href: '/blog/marketing-mastery/chatgpt-prompts', desc: 'Ready-to-use AI prompts for listings, emails, social posts, and client communication.' },
  { title: 'New Agent Marketing Tips', href: '/blog/marketing-mastery/new-agent-tips', desc: 'Where to start when you have zero budget and zero leads. Practical advice for day one.' },
  { title: 'Real Estate Postcards That Work', href: '/blog/marketing-mastery/postcards', desc: 'Design, targeting, and messaging strategies for postcards that actually generate calls.' },
  { title: 'Open House Tips for 2026', href: '/blog/marketing-mastery/open-house-tips', desc: 'Modern open house strategies including digital sign-ins, follow-up systems, and social media.' },
  { title: '"This or That" Post Ideas', href: '/blog/marketing-mastery/this-or-that-posts', desc: '21 engagement-driving social media post ideas that your audience will interact with.' },
  { title: 'Free Business Card Templates', href: '/blog/marketing-mastery/biz-cards', desc: 'Professional Canva templates you can customize in minutes.' },
  { title: 'Open House Sign-In Sheets', href: '/blog/marketing-mastery/open-house-sheets', desc: '12 free editable PDF templates to capture visitor information at your next open house.' },
  { title: 'The Golden Marketing Principle', href: '/blog/marketing-mastery/golden-principle', desc: 'The one marketing principle that separates top producers from everyone else.' },
  { title: 'YouTube Tips for More Views', href: '/blog/marketing-mastery/youtube-tips', desc: '7 tips to get more views and subscribers as a real estate YouTube creator.' },
  { title: 'YouTube Leads: $100K+ Year 1', href: '/blog/marketing-mastery/youtube-leads', desc: 'How one agent generated over $100K in GCI from social media leads in their first year.' },
  { title: 'YouTube Growth for Realtors', href: '/blog/marketing-mastery/youtube-growth', desc: 'Why YouTube is the biggest growth opportunity for agents in 2026.' },
  { title: 'LinkedIn Hashtags for Real Estate', href: '/blog/marketing-mastery/linkedin-hashtags', desc: 'Stop guessing - here are the hashtags that actually drive visibility on LinkedIn.' },
  { title: 'How to Find Buyers', href: '/blog/marketing-mastery/find-buyers', desc: 'Practical methods for finding qualified buyers without wasting time on tire-kickers.' },
  { title: '7 Social Media Tips for Agents', href: '/blog/marketing-mastery/social-tips', desc: 'Quick, actionable social media tips you can implement this week.' },
];

const pillars = [
  { title: 'Social Media', desc: 'Build your brand and generate leads on Instagram, YouTube, LinkedIn, and more.', count: 10 },
  { title: 'Lead Generation', desc: 'Free and paid strategies to fill your pipeline with qualified buyers and sellers.', count: 6 },
  { title: 'Content & SEO', desc: 'Blog ideas, video content, and search optimization to attract organic traffic.', count: 6 },
  { title: 'Tools & Templates', desc: 'Business cards, sign-in sheets, scripts, and AI prompts to save time.', count: 6 },
];

export default function MarketingMastery() {
  return (
    <main id="main-content">
      {/* Hero */}
      <StickyHeroWrapper>
        <section className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-8 md:px-12 py-24 md:py-32">
          <AsteroidBeltEffect />
          <div className="max-w-[1900px] mx-auto w-full text-center relative z-10">
            <H1>MARKETING MASTERY FOR AGENTS</H1>
            <Tagline className="mt-4">28 guides to grow your brand and fill your pipeline</Tagline>
            <p className="text-body mt-6 max-w-2xl mx-auto">
              The best agents are the best marketers. These guides cover everything from free lead generation to paid ads, social media strategy, content creation, and the tools that save you time.
            </p>
          </div>
        </section>
      </StickyHeroWrapper>

      {/* Pillars Overview */}
      <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1900px] mx-auto">
          <div className="text-center mb-12">
            <H2>Four Pillars of Agent Marketing</H2>
            <p className="text-body mt-4 max-w-2xl mx-auto">
              Master these four areas and you will never run out of clients.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {pillars.map((p) => (
              <GenericCard key={p.title} padding="md" className="h-full">
                <h3 className="text-h6 mb-2">{p.title}</h3>
                <p className="text-body mb-2" style={{ fontSize: 'var(--font-size-caption)' }}>{p.desc}</p>
                <span className="text-link font-medium" style={{ fontSize: 'var(--font-size-caption)' }}>{p.count} guides</span>
              </GenericCard>
            ))}
          </div>
        </div>
      </section>

      {/* All Articles */}
      <LazySection height={1200}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>All Marketing Guides</H2>
              <p className="text-body mt-4 max-w-2xl mx-auto">
                Every guide is written specifically for real estate agents - no generic marketing fluff.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((a) => (
                <a key={a.href} href={a.href} className="block group">
                  <GenericCard hover padding="md" className="h-full">
                    <h3 className="text-h6 mb-2">{a.title}</h3>
                    <p className="text-body mb-3" style={{ fontSize: 'var(--font-size-caption)' }}>{a.desc}</p>
                    <span className="text-link group-hover:underline" style={{ fontSize: 'var(--font-size-caption)' }}>Read guide</span>
                  </GenericCard>
                </a>
              ))}
            </div>
          </div>
        </section>
      </LazySection>

      {/* FAQ */}
      <LazySection height={400}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto">
            <div className="text-center mb-12">
              <H2>Frequently Asked Questions</H2>
            </div>

            <FAQ
              items={[
                {
                  question: 'What is the best marketing strategy for new real estate agents?',
                  answer: 'Start with one or two channels you can be consistent on. Most new agents see the fastest results from Google Business Profile optimization, social media content (especially short-form video), and building a sphere of influence through personal outreach. Paid ads can work but require budget and testing.',
                },
                {
                  question: 'How much should real estate agents spend on marketing?',
                  answer: 'A common guideline is 10-15% of your GCI. For new agents, many of the most effective strategies are free or low-cost - social media, YouTube, blogging, and networking. As you grow, reinvest into paid channels that have proven ROI for your market.',
                },
                {
                  question: 'Does social media actually generate real estate leads?',
                  answer: 'Yes, but it takes consistency. The agents who succeed on social media post valuable content regularly, engage with their audience, and use their platforms to build trust rather than just promote listings. Short-form video content is currently the highest-performing format.',
                },
                {
                  question: 'Should real estate agents use Google Ads or Facebook Ads?',
                  answer: 'Both can work, but they serve different purposes. Google Ads captures people actively searching (high intent). Facebook and Instagram ads are better for brand awareness and retargeting. Most agents see better ROI starting with Google Ads, then layering in social ads for visibility.',
                },
              ]}
              allowMultiple={false}
            />
          </div>
        </section>
      </LazySection>

      {/* CTA */}
      <LazySection height={300}>
        <section className="relative py-16 md:py-24 px-4 sm:px-8 md:px-12">
          <div className="max-w-[1900px] mx-auto text-center">
            <H2>Market Smarter With the Right Team Behind You</H2>
            <p className="text-body mt-4 mb-8 max-w-2xl mx-auto">
              eXp agents at Smart Agent Alliance get marketing training, templates, and tools included. No extra cost, no upsells.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <JoinAllianceCTA />
              <CTAButton href="/blog/">
                Browse All Articles
              </CTAButton>
            </div>
          </div>
        </section>
      </LazySection>
    </main>
  );
}
