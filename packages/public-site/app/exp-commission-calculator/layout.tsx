import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'eXp Commission Calculator',
  description:
    'Calculate your potential eXp Realty earnings. Compare commission splits, fees, and net income with an interactive calculator.',
  openGraph: {
    title: 'eXp Commission Calculator | Smart Agent Alliance',
    description:
      'Calculate your potential eXp Realty earnings. Compare commission splits, fees, and net income.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
