import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'eXp Realty Awards & Rankings',
  description:
    'Forbes #8 employer. Glassdoor #22. RealTrends #1 brokerage. Deloitte Fast 500. See why eXp Realty dominates industry rankings year after year.',
  openGraph: {
    title: 'eXp Realty Awards & Rankings',
    description:
      'Forbes #8, Glassdoor #22, RealTrends #1, Deloitte Fast 500. The receipts are in.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://smartagentalliance.com/awards',
  },
};

export default function AwardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
