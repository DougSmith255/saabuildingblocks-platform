import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Doug Smart',
  description:
    'Top 1% eXp team builder and SAA co-founder. See the 6 systems he built to scale agent businesses — attraction pages, automations, funnels, and more.',
  openGraph: {
    title: 'About Doug Smart',
    description:
      'Top 1% eXp team builder. See the 6 systems he built to scale agent businesses.',
    type: 'profile',
  },
  alternates: {
    canonical: 'https://smartagentalliance.com/about-doug-smart',
  },
};

export default function AboutDougSmartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
