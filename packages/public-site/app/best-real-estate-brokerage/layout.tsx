import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brokerage Comparison [Guide]',
  description:
    'Facts over feelings. Compare eXp Realty to traditional and online brokerages on commission splits, tech, passive income, and support — side by side.',
  openGraph: {
    title: 'Best Real Estate Brokerage Comparison',
    description:
      'Compare eXp vs traditional and online brokerages on splits, tech, income, and support.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://smartagentalliance.com/best-real-estate-brokerage',
  },
};

export default function BestRealEstateBrokerageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
