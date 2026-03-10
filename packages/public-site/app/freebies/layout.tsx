import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Resources',
  description:
    'Free downloadable tools for real estate agents. Prospecting scripts, checklists, templates, and action plans to grow your business.',
  alternates: {
    canonical: 'https://smartagentalliance.com/freebies/',
  },
  openGraph: {
    title: 'Free Resources | Smart Agent Alliance',
    description:
      'Free downloadable tools for real estate agents. Scripts, checklists, templates, and action plans.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartagentalliance.com/' },
    { '@type': 'ListItem', position: 2, name: 'Free Resources', item: 'https://smartagentalliance.com/freebies/' },
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
