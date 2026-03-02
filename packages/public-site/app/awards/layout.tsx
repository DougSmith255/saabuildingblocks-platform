import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'eXp Realty Awards & Recognition',
  description:
    "See eXp Realty's industry awards including Forbes, Glassdoor, and RealTrends rankings. The most decorated cloud brokerage in real estate.",
  openGraph: {
    title: 'eXp Realty Awards & Recognition | Smart Agent Alliance',
    description:
      "See eXp Realty's industry awards including Forbes, Glassdoor, and RealTrends rankings.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
