import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Winning Real Estate Clients: Proven Strategies for Agents in 2026',
  description:
    'Strategies for attracting and converting real estate clients. Listing presentations, buyer consultations, negotiation tactics, and client retention.',
  alternates: {
    canonical: 'https://smartagentalliance.com/winning-clients/',
  },
  openGraph: {
    title: 'Winning Real Estate Clients: Proven Strategies for Agents in 2026',
    description:
      'Strategies for attracting and converting real estate clients. Listing presentations, buyer consultations, and negotiation tactics.',
    url: 'https://smartagentalliance.com/winning-clients/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Smart Agent Alliance' }],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartagentalliance.com/' },
    { '@type': 'ListItem', position: 2, name: 'Winning Clients', item: 'https://smartagentalliance.com/winning-clients/' },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I get more listings as a new real estate agent?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Start with your sphere of influence - let everyone know you are in real estate. Host open houses for other agents, door knock in target neighborhoods, and create local market content. Expired and FSBO listings are also high-conversion opportunities. Consistency matters more than any single tactic.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I include in a listing presentation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A strong listing presentation covers your marketing plan (professional photos, staging, online exposure), a comparative market analysis, your track record, your communication plan, and a clear pricing strategy. Focus on what makes you different and how you will get the seller the best outcome.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I handle buyer objections about agent commissions?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Be transparent about your value. Walk buyers through the 117+ services you provide, from market analysis to negotiation to closing coordination. Use a buyer consultation to set expectations early and demonstrate your expertise. Agents who clearly communicate their value rarely lose clients over commission concerns.',
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
