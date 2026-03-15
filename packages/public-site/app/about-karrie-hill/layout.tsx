import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Karrie Hill',
  description:
    'Meet Karrie Hill, co-founder of the Smart Agent Alliance. Licensed REALTOR, certified negotiation expert, and eXp Realty leader.',
  alternates: {
    canonical: 'https://smartagentalliance.com/about-karrie-hill/',
  },
  openGraph: {
    title: 'About Karrie Hill - Smart Agent Alliance',
    description:
      'Meet Karrie Hill, co-founder of the Smart Agent Alliance. Licensed REALTOR, certified negotiation expert, and eXp Realty leader.',
    url: 'https://smartagentalliance.com/about-karrie-hill/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Smart Agent Alliance' }],
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Karrie Hill',
    jobTitle: 'Co-Founder',
    description: 'Co-founder of the Smart Agent Alliance. Licensed REALTOR, certified negotiation expert, and eXp Realty leader.',
    url: 'https://smartagentalliance.com/about-karrie-hill/',
    image: 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg/4e2a3c105e488654-Karrie-Profile-Picture.png/public',
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
      { '@type': 'ListItem', position: 2, name: 'About Karrie Hill', item: 'https://smartagentalliance.com/about-karrie-hill/' },
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
