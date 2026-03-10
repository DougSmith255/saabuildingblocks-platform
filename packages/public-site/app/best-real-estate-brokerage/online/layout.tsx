import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'eXp Realty vs Online Brokerages',
  description:
    'Compare eXp Realty to Real Broker, LPT Realty, and Fathom Realty. Side-by-side comparison of commission splits, fees, technology, and stock options.',
  alternates: {
    canonical: 'https://smartagentalliance.com/best-real-estate-brokerage/online/',
  },
  openGraph: {
    title: 'eXp Realty vs Online Brokerages | Smart Agent Alliance',
    description:
      'Compare eXp Realty to Real Broker, LPT Realty, and Fathom Realty. Splits, fees, and technology compared.',
    url: 'https://smartagentalliance.com/best-real-estate-brokerage/online/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Smart Agent Alliance' }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
