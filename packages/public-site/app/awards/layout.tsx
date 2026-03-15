import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'eXp Realty Awards & Recognition',
  description:
    "See eXp Realty's industry awards including Forbes, Glassdoor, and RealTrends rankings. The most decorated cloud brokerage in real estate.",
  alternates: {
    canonical: 'https://smartagentalliance.com/awards/',
  },
  openGraph: {
    title: 'eXp Realty Awards & Recognition - Smart Agent Alliance',
    description:
      "See eXp Realty's industry awards including Forbes, Glassdoor, and RealTrends rankings.",
    url: 'https://smartagentalliance.com/awards/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Smart Agent Alliance' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartagentalliance.com/' },
    { '@type': 'ListItem', position: 2, name: 'eXp Realty Awards & Recognition', item: 'https://smartagentalliance.com/awards/' },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
