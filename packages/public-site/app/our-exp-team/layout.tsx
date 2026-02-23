import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Upline — 7 Tiers Deep',
  description:
    'Meet the producers in your corner — Doug Smart, Karrie Hill, Mike Sherrard, Connor Steinbrook, and more. 7 tiers of proven eXp expertise backing your business.',
  openGraph: {
    title: 'Your Upline — 7 Tiers Deep',
    description:
      'Doug Smart, Karrie Hill, Mike Sherrard, Connor Steinbrook — 7 tiers in your corner.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://smartagentalliance.com/our-exp-team',
  },
};

export default function OurExpTeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
