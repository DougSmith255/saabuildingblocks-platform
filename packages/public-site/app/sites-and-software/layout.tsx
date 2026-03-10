import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sites & Software for Real Estate Agents',
  description:
    'Curated tool recommendations for real estate agents. CRM, hosting, SEO, AI, domains, and website builders we actually use.',
  alternates: {
    canonical: 'https://smartagentalliance.com/sites-and-software/',
  },
  openGraph: {
    title: 'Sites & Software for Real Estate Agents | Smart Agent Alliance',
    description:
      'Curated tool recommendations for real estate agents. CRM, hosting, SEO, AI, and more.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartagentalliance.com/' },
    { '@type': 'ListItem', position: 2, name: 'Sites & Software', item: 'https://smartagentalliance.com/sites-and-software/' },
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
