import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Best Real Estate Brokerage Comparison',
  description:
    'Compare real estate brokerages side by side. See how eXp Realty stacks up against online and traditional brokerages on commission, fees, and tools.',
  alternates: {
    canonical: 'https://smartagentalliance.com/best-real-estate-brokerage/',
  },
  openGraph: {
    title: 'Best Real Estate Brokerage Comparison | Smart Agent Alliance',
    description:
      'Compare real estate brokerages side by side. Commission splits, fees, tools, and support compared.',
    url: 'https://smartagentalliance.com/best-real-estate-brokerage/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Smart Agent Alliance' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartagentalliance.com/' },
    { '@type': 'ListItem', position: 2, name: 'Best Real Estate Brokerage Comparison', item: 'https://smartagentalliance.com/best-real-estate-brokerage/' },
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
