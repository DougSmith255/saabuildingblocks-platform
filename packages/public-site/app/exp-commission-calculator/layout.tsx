import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'eXp Commission Calculator',
  description:
    'Calculate your potential eXp Realty earnings. Compare commission splits, fees, and net income with an interactive calculator.',
  alternates: {
    canonical: 'https://smartagentalliance.com/exp-commission-calculator/',
  },
  openGraph: {
    title: 'eXp Commission Calculator | Smart Agent Alliance',
    description:
      'Calculate your potential eXp Realty earnings. Compare commission splits, fees, and net income.',
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'eXp Realty Commission Calculator',
    url: 'https://smartagentalliance.com/exp-commission-calculator/',
    description: 'Interactive commission visualizer showing eXp Realty net income after splits, fees, and caps.',
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
      { '@type': 'ListItem', position: 2, name: 'eXp Commission Calculator', item: 'https://smartagentalliance.com/exp-commission-calculator/' },
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
