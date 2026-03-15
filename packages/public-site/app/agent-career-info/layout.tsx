import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Real Estate Career Guide (2026)',
  description:
    'Career guides for real estate agents. Expenses, hours, strategies, team structures, brokerage transitions, and professional development.',
  alternates: {
    canonical: 'https://smartagentalliance.com/agent-career-info/',
  },
  openGraph: {
    title: 'Real Estate Career Guide (2026)',
    description:
      'Career guides for real estate agents. Expenses, hours, strategies, team structures, and professional development.',
    url: 'https://smartagentalliance.com/agent-career-info/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Smart Agent Alliance' }],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartagentalliance.com/' },
    { '@type': 'ListItem', position: 2, name: 'Agent Career Info', item: 'https://smartagentalliance.com/agent-career-info/' },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much do real estate agents make in their first year?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'First-year income varies widely, but most agents earn between $30,000-$60,000. Top performers in strong markets can exceed $100,000. Income depends on your market, brokerage split structure, sphere of influence, and how quickly you build your pipeline. Most agents hit their stride in years 2-3.',
      },
    },
    {
      '@type': 'Question',
      name: 'What expenses should new real estate agents expect?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Expect $2,000-$5,000 in startup costs including licensing ($300-$1,500), MLS dues ($300-$800/year), Realtor association dues ($300-$500/year), business cards, a basic CRM, and marketing materials. Ongoing monthly costs are typically $200-$500 for technology, marketing, and professional development.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many hours do real estate agents actually work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Full-time agents typically work 40-50 hours per week, though the schedule is flexible. The busiest times are evenings and weekends when buyers are available for showings. The trade-off is freedom to structure your own schedule and take time off during slower periods.',
      },
    },
    {
      '@type': 'Question',
      name: 'When should I switch brokerages?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Consider switching if your commission split no longer reflects your production level, you are not getting the training or support you need, technology is outdated, or your brokerage fees are eating into your income. Most agents evaluate their brokerage fit annually and many switch within their first 2-3 years.',
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
