import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'eXp Realty Locations',
  description:
    'eXp Realty operates in 29+ countries with 84,000+ agents worldwide. Explore the global presence and find eXp near you.',
  openGraph: {
    title: 'eXp Realty Locations | Smart Agent Alliance',
    description:
      'eXp Realty operates in 29+ countries with 84,000+ agents worldwide. Explore the global presence.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
