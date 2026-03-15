import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Real Estate Brokerage Comparison (2026)',
  description:
    'Compare 15 real estate brokerages side by side. Commission splits, fees, revenue share, and financial stability. 67 head-to-head matchups.',
  alternates: {
    canonical: 'https://smartagentalliance.com/best-real-estate-brokerage/',
  },
  openGraph: {
    title: 'Real Estate Brokerage Comparison (2026) - Smart Agent Alliance',
    description:
      'Compare 15 real estate brokerages side by side. Commission splits, fees, revenue share, and 67 head-to-head matchups.',
    url: 'https://smartagentalliance.com/best-real-estate-brokerage/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Smart Agent Alliance' }],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartagentalliance.com/' },
    { '@type': 'ListItem', position: 2, name: 'Brokerage Comparison', item: 'https://smartagentalliance.com/best-real-estate-brokerage/' },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Which cloud brokerage has the best commission split?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All four cloud brokerages offer paths to 100% commission. eXp Realty starts at 80/20 with a $16K cap. Real Brokerage starts at 85/15 with a $12K cap. LPT Realty varies by plan ($5K-$15K cap). Fathom offers three plans with caps ranging from $0 to $12K.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which brokerage is the most financially stable?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'eXp Realty has the strongest financial health with 15 profitable quarters out of 20, compared to just 1 profitable quarter each for Real Brokerage and Fathom. eXp is listed on the S&P 600. LPT is privately held with no public financial data.',
      },
    },
    {
      '@type': 'Question',
      name: "What makes eXp Realty's revenue share different?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "eXp has the largest revenue share pool ($204M if 30% of agents cap), offers 7 tiers of earnings, lets you earn from every downline agent regardless of production, has no fees to participate, and has paid out over $889 million to date. It's also willable income.",
      },
    },
    {
      '@type': 'Question',
      name: 'Which brokerage offers the best training?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'eXp Realty offers 50+ live training hours per week, the most of any cloud brokerage. Real Brokerage offers 30+ hours. LPT offers daily live sessions. Fathom has 600+ on-demand courses but no live training schedule.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I build retirement income with these brokerages?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All four cloud brokerages offer some form of passive income through revenue share. eXp has the clearest path with no production requirements to earn. Real and Fathom require minimum production to maintain eligibility.',
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
