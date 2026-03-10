import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Doug Smart',
  description:
    'Meet Doug Smart, co-founder of the Smart Agent Alliance. Builder of agent systems, tools, and technology at eXp Realty.',
  alternates: {
    canonical: 'https://smartagentalliance.com/about-doug-smart/',
  },
  openGraph: {
    title: 'About Doug Smart | Smart Agent Alliance',
    description:
      'Meet Doug Smart, co-founder of the Smart Agent Alliance. Builder of agent systems, tools, and technology at eXp Realty.',
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Doug Smart',
    jobTitle: 'Co-Founder',
    description: 'Co-founder of the Smart Agent Alliance. Builder of agent systems, tools, and technology at eXp Realty.',
    url: 'https://smartagentalliance.com/about-doug-smart/',
    image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/55dbdf32ddc5fbcc-Doug-Profile-Picture.png/public',
    worksFor: [
      { '@type': 'Organization', name: 'Smart Agent Alliance', url: 'https://smartagentalliance.com' },
      { '@type': 'Organization', name: 'eXp Realty' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartagentalliance.com/' },
      { '@type': 'ListItem', position: 2, name: 'About Doug Smart', item: 'https://smartagentalliance.com/about-doug-smart/' },
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
