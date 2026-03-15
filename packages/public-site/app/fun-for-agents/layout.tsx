import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fun for Real Estate Agents',
  description:
    'The lighter side of real estate. Best books for agents, top real estate movies and TV shows, gift ideas, and lifestyle content.',
  alternates: {
    canonical: 'https://smartagentalliance.com/fun-for-agents/',
  },
  openGraph: {
    title: 'Fun for Real Estate Agents',
    description:
      'The lighter side of real estate. Best books for agents, top movies and TV shows, gift ideas, and lifestyle content.',
    url: 'https://smartagentalliance.com/fun-for-agents/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Smart Agent Alliance' }],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartagentalliance.com/' },
    { '@type': 'ListItem', position: 2, name: 'Fun for Agents', item: 'https://smartagentalliance.com/fun-for-agents/' },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
