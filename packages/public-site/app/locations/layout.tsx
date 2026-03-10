import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'eXp Realty Locations',
  description:
    'eXp Realty operates in 29+ countries with 84,000+ agents worldwide. Explore the global presence and find eXp near you.',
  alternates: {
    canonical: 'https://smartagentalliance.com/locations/',
  },
  openGraph: {
    title: 'eXp Realty Locations | Smart Agent Alliance',
    description:
      'eXp Realty operates in 29+ countries with 84,000+ agents worldwide. Explore the global presence.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartagentalliance.com/' },
    { '@type': 'ListItem', position: 2, name: 'eXp Realty Locations', item: 'https://smartagentalliance.com/locations/' },
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
