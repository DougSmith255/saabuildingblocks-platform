import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'eXp Revenue Share Calculator',
  description:
    'Visualize your eXp Realty revenue share potential across 7 tiers. See what building a team could earn you with an interactive visualizer.',
  alternates: {
    canonical: 'https://smartagentalliance.com/exp-realty-revenue-share-calculator/',
  },
  openGraph: {
    title: 'eXp Revenue Share Calculator | Smart Agent Alliance',
    description:
      'Model your eXp Realty revenue share income across 7 tiers. See what building a team could earn you.',
    url: 'https://smartagentalliance.com/exp-realty-revenue-share-calculator/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Smart Agent Alliance' }],
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'eXp Revenue Share Calculator',
    url: 'https://smartagentalliance.com/exp-realty-revenue-share-calculator/',
    description: 'Interactive 7-tier revenue share visualizer for eXp Realty agents. Model passive income from team building.',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    provider: { '@type': 'Organization', name: 'Smart Agent Alliance', url: 'https://smartagentalliance.com' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartagentalliance.com/' },
      { '@type': 'ListItem', position: 2, name: 'eXp Revenue Share Calculator', item: 'https://smartagentalliance.com/exp-realty-revenue-share-calculator/' },
    ],
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      {children}
    </>
  );
}
