import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agent Success Hub [Blog]',
  description:
    'Brokerage comparisons, marketing plays, and career strategies from top-producing eXp agents. New posts weekly.',
  openGraph: {
    title: 'Agent Success Hub',
    description:
      'Brokerage comparisons, marketing plays, and career strategies from top-producing eXp agents.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://smartagentalliance.com/blog',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
