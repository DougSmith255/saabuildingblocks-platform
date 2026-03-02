import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Best Real Estate Brokerage Comparison',
  description:
    'Compare real estate brokerages side by side. See how eXp Realty stacks up against online and traditional brokerages on commission, fees, and tools.',
  openGraph: {
    title: 'Best Real Estate Brokerage Comparison | Smart Agent Alliance',
    description:
      'Compare real estate brokerages side by side. Commission splits, fees, tools, and support compared.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
