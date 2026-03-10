import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About eXp Realty',
  description:
    "Learn about eXp Realty's cloud-based model, commission structure, stock awards, and global reach. See why 84,000+ agents chose eXp.",
  alternates: {
    canonical: 'https://smartagentalliance.com/about-exp-realty/',
  },
  openGraph: {
    title: 'About eXp Realty | Smart Agent Alliance',
    description:
      "Learn about eXp Realty's cloud-based model, commission structure, stock awards, and global reach.",
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartagentalliance.com/' },
    { '@type': 'ListItem', position: 2, name: 'About eXp Realty', item: 'https://smartagentalliance.com/about-exp-realty/' },
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
