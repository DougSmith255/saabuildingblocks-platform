import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'eXp Realty vs Traditional Brokerages',
  description:
    'Compare eXp Realty to traditional brokerages like Keller Williams, RE/MAX, and Coldwell Banker. Commission splits, desk fees, and agent benefits compared.',
  alternates: {
    canonical: 'https://smartagentalliance.com/best-real-estate-brokerage/traditional/',
  },
  openGraph: {
    title: 'eXp Realty vs Traditional Brokerages | Smart Agent Alliance',
    description:
      'Compare eXp Realty to Keller Williams, RE/MAX, and Coldwell Banker. Splits, fees, and benefits compared.',
    url: 'https://smartagentalliance.com/best-real-estate-brokerage/traditional/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Smart Agent Alliance' }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
