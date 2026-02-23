import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join eXp Realty with SAA',
  description:
    'Your eXp sponsor matters. SAA gives you onboarding, an agent portal, marketing templates, and proven systems — and you pay nothing to join.',
  openGraph: {
    title: 'Join eXp Realty with SAA',
    description:
      'Your sponsor matters. Onboarding, portal, templates, proven systems — you pay nothing.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://smartagentalliance.com/exp-realty-sponsor',
  },
};

export default function ExpRealtySponsorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
