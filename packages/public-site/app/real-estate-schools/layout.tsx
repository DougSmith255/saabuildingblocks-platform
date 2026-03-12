import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Best Online Real Estate Schools by State: 2026 Guide',
  description:
    'Find the best online real estate schools for your state. Pre-licensing courses, exam prep, and continuing education reviewed and compared for 11 states.',
  alternates: {
    canonical: 'https://smartagentalliance.com/real-estate-schools/',
  },
  openGraph: {
    title: 'Best Online Real Estate Schools by State: 2026 Guide',
    description:
      'Find the best online real estate schools for your state. Pre-licensing courses, exam prep, and CE reviewed for 11 states.',
    url: 'https://smartagentalliance.com/real-estate-schools/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Smart Agent Alliance' }],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartagentalliance.com/' },
    { '@type': 'ListItem', position: 2, name: 'Real Estate Schools', item: 'https://smartagentalliance.com/real-estate-schools/' },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can I complete real estate school online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Most states now accept online pre-licensing courses. We review the best online schools for each state, covering course quality, pass rates, pricing, and exam prep options.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does real estate school cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Online real estate school typically costs $100-$500 depending on the state, school, and package. Premium packages with exam prep and additional resources can run up to $800. Our state guides break down pricing for every major school.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to complete real estate school?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Required pre-licensing hours vary by state, from 40 hours (Michigan) to 180 hours (Texas). Most online schools let you work at your own pace, so completion time depends on how much time you dedicate. Many students finish in 4-12 weeks.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I do after passing the real estate exam?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'After passing your exam, you need to choose a brokerage to hang your license with. This decision impacts your commission splits, training, technology, and long-term income. We recommend researching brokerages before you even start school so you can hit the ground running.',
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
