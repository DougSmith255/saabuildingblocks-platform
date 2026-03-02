import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Real estate insights, marketing strategies, brokerage comparisons, and career tips for agents who want to level up.',
  openGraph: {
    title: 'Blog | Smart Agent Alliance',
    description:
      'Real estate insights, marketing strategies, brokerage comparisons, and career tips for agents.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
