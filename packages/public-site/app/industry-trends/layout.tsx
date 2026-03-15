import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Real Estate Industry Trends (2026)',
  description:
    'Stay ahead of real estate industry changes. NAR settlement impacts, commission structure shifts, off-market listings, and market predictions.',
  alternates: {
    canonical: 'https://smartagentalliance.com/industry-trends/',
  },
  openGraph: {
    title: 'Real Estate Industry Trends (2026)',
    description:
      'Stay ahead of real estate industry changes. NAR settlement impacts, commission shifts, and market predictions.',
    url: 'https://smartagentalliance.com/industry-trends/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Smart Agent Alliance' }],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartagentalliance.com/' },
    { '@type': 'ListItem', position: 2, name: 'Industry Trends', item: 'https://smartagentalliance.com/industry-trends/' },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How did the NAR settlement change real estate commissions?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The NAR settlement eliminated the requirement for sellers to offer compensation to buyer agents through the MLS. Buyer agents now need written agreements with their clients before showing homes. This shifts the commission conversation to be more transparent, but most transactions still involve buyer agent compensation - it is just negotiated differently.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are real estate agent commissions going down in 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Average commission rates have dipped slightly since the NAR settlement, but the impact varies by market. Agents who clearly communicate their value and provide excellent service are still earning competitive commissions. The biggest change is how commissions are disclosed and negotiated, not necessarily the total amount.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the controversy around off-market listings?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Off-market or "pocket" listings have become a hot-button issue. Some brokerages promote exclusive listings as a premium service, while others argue it reduces market transparency and can hurt sellers by limiting exposure. NAR has taken positions on both sides, and the debate continues to evolve.',
      },
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {children}
    </>
  );
}
