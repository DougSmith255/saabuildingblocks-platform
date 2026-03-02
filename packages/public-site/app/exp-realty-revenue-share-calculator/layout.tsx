import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'eXp Revenue Share Calculator',
  description:
    'Model your eXp Realty revenue share income across 7 tiers. See what building a team could earn you with an interactive calculator.',
  openGraph: {
    title: 'eXp Revenue Share Calculator | Smart Agent Alliance',
    description:
      'Model your eXp Realty revenue share income across 7 tiers. See what building a team could earn you.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
