import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Get a Real Estate License: State-by-State Guide 2026',
  description:
    'Step-by-step guides to getting your real estate license in 11 states. Requirements, costs, timelines, and exam tips for aspiring agents.',
  alternates: {
    canonical: 'https://smartagentalliance.com/become-an-agent/',
  },
  openGraph: {
    title: 'How to Get a Real Estate License: State-by-State Guide 2026',
    description:
      'Step-by-step guides to getting your real estate license in 11 states. Requirements, costs, timelines, and exam tips.',
    url: 'https://smartagentalliance.com/become-an-agent/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Smart Agent Alliance' }],
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartagentalliance.com/' },
    { '@type': 'ListItem', position: 2, name: 'Get Licensed', item: 'https://smartagentalliance.com/become-an-agent/' },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How long does it take to get a real estate license?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It depends on your state. Pre-licensing education ranges from 40 hours (Michigan) to 180 hours (Texas). Most people complete their coursework in 4-12 weeks studying part-time, then schedule the state exam within a few weeks. Total timeline is typically 2-4 months from start to licensed.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does it cost to get a real estate license?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Total costs typically range from $300-$1,500 depending on the state. This includes pre-licensing courses ($100-$500), state exam fees ($50-$100), license application ($50-$300), background check ($30-$80), and any additional materials. Our state guides break down exact costs.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need a college degree to get a real estate license?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Most states only require you to be 18 or 19 years old, have a high school diploma or GED, and complete state-approved pre-licensing education. No college degree is required in any state.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the real estate exam pass rate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'First-time pass rates vary by state, typically ranging from 50% to 75%. The exam covers national real estate principles and state-specific laws. Strong exam prep and practice tests significantly improve your chances. Our state guides include exam tips and recommended prep resources.',
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
