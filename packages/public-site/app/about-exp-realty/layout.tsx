import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About eXp Realty',
  description:
    'See what SAA members actually get — agent portal, onboarding, weekly calls, templates, and real support. Not just a sponsor name, a full organization.',
  openGraph: {
    title: 'About eXp Realty',
    description:
      'See what SAA members get — portal, onboarding, calls, templates, and real support.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://smartagentalliance.com/about-exp-realty',
  },
};

export default function AboutExpRealtyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
