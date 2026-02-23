import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'eXp Realty Global Presence',
  description:
    '29+ countries. 84,000+ agents. 10+ languages. See where eXp operates and how one platform powers global referrals, stock awards, and zero franchise fees.',
  openGraph: {
    title: 'eXp Realty Global Presence',
    description:
      '29+ countries, 84,000+ agents. One platform, global referrals, zero franchise fees.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://smartagentalliance.com/locations',
  },
};

export default function LocationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
