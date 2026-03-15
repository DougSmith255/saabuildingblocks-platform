import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Real Estate Marketing Guide (2026)',
  description:
    'Digital marketing strategies for real estate agents. Social media, Google Ads, YouTube, content marketing, and lead generation guides.',
  alternates: {
    canonical: 'https://smartagentalliance.com/marketing-mastery/',
  },
  openGraph: {
    title: 'Real Estate Marketing Guide (2026)',
    description:
      'Digital marketing strategies for real estate agents. Social media, Google Ads, YouTube, content marketing, and lead generation.',
    url: 'https://smartagentalliance.com/marketing-mastery/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Smart Agent Alliance' }],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartagentalliance.com/' },
    { '@type': 'ListItem', position: 2, name: 'Marketing Mastery', item: 'https://smartagentalliance.com/marketing-mastery/' },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the best marketing strategy for new real estate agents?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Start with one or two channels you can be consistent on. Most new agents see the fastest results from Google Business Profile optimization, social media content (especially short-form video), and building a sphere of influence through personal outreach. Paid ads can work but require budget and testing.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much should real estate agents spend on marketing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A common guideline is 10-15% of your GCI (gross commission income). For new agents, many of the most effective strategies are free or low-cost - social media, YouTube, blogging, and networking. As you grow, reinvest into paid channels that have proven ROI for your market.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does social media actually generate real estate leads?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, but it takes consistency. The agents who succeed on social media post valuable content regularly, engage with their audience, and use their platforms to build trust rather than just promote listings. Short-form video content on Instagram Reels and YouTube Shorts is currently the highest-performing format.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should real estate agents use Google Ads or Facebook Ads?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Both can work, but they serve different purposes. Google Ads captures people actively searching for agents or properties (high intent). Facebook and Instagram ads are better for brand awareness and retargeting. Most agents see better ROI starting with Google Ads for direct leads, then layering in social ads for visibility.',
      },
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {children}
    </>
  );
}
