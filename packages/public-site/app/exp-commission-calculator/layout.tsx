import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'eXp Commission Calculator',
  description:
    'No hidden fees, just facts. Calculate your take-home with eXp\'s 80/20 split, $16K cap, and 100% post-cap commission. Compare it to your current brokerage.',
  openGraph: {
    title: 'eXp Commission Calculator',
    description:
      'Calculate your take-home with eXp\'s 80/20 split, $16K cap, and 100% post-cap.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://smartagentalliance.com/exp-commission-calculator',
  },
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Calculate Your eXp Realty Commission',
  description:
    'Use this calculator to estimate your take-home earnings with eXp Realty based on your number of transactions and average commission per deal.',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Enter your annual transactions',
      text: 'Input the number of real estate transactions you expect to close per year.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Enter your average commission per deal',
      text: 'Input your average gross commission income (GCI) per transaction.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Review your results',
      text: 'See your projected annual earnings including eXp\'s 80/20 split, $16,000 cap, and post-cap 100% commission.',
    },
  ],
  tool: {
    '@type': 'HowToTool',
    name: 'eXp Realty Commission Calculator',
  },
};

export default function ExpCommissionCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      {children}
    </>
  );
}
