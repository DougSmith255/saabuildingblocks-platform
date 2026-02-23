import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'eXp Revenue Share Calculator',
  description:
    'See how eXp\'s 7-tier revenue share compounds with your team size — from 5 agents to 3,500+. Interactive projections built on real rates and caps.',
  openGraph: {
    title: 'eXp Revenue Share Calculator',
    description:
      'See how eXp\'s 7-tier revenue share compounds — from 5 agents to 3,500+.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://smartagentalliance.com/exp-realty-revenue-share-calculator',
  },
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Estimate Your eXp Realty Revenue Share',
  description:
    'Use this interactive calculator to project your passive income from eXp Realty\'s 7-tier revenue sharing model based on your team size and growth.',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Select a growth scenario',
      text: 'Choose from Starter (5 agents), Growing (10), Established (20), Momentum (30), or Empire Builder (40) to see how revenue share scales.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Explore tier breakdowns',
      text: 'Hover or tap each of the 7 tiers to see per-agent earnings, rates, and caps at each depth level.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Review total projected earnings',
      text: 'See your total annual revenue share including the ~20% adjustment bonus on Tiers 1-3.',
    },
  ],
  tool: {
    '@type': 'HowToTool',
    name: 'eXp Revenue Share Calculator',
  },
};

export default function ExpRevenueShareCalculatorLayout({
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
