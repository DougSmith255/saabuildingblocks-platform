import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our eXp Realty Team',
  description:
    'Meet the Smart Agent Alliance founders and partners. Doug Smart, Karrie Hill, and a team dedicated to helping eXp agents succeed.',
  alternates: {
    canonical: 'https://smartagentalliance.com/our-exp-team/',
  },
  openGraph: {
    title: 'Our eXp Realty Team - Smart Agent Alliance',
    description:
      'Meet the Smart Agent Alliance founders and partners. A team dedicated to helping eXp agents succeed.',
    url: 'https://smartagentalliance.com/our-exp-team/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Smart Agent Alliance' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartagentalliance.com/' },
    { '@type': 'ListItem', position: 2, name: 'Our eXp Realty Team', item: 'https://smartagentalliance.com/our-exp-team/' },
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
