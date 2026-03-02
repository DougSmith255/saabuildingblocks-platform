import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'eXp Realty vs Traditional Brokerages',
  description:
    'Compare eXp Realty to traditional brokerages like Keller Williams, RE/MAX, and Coldwell Banker. Commission splits, desk fees, and agent benefits compared.',
  openGraph: {
    title: 'eXp Realty vs Traditional Brokerages | Smart Agent Alliance',
    description:
      'Compare eXp Realty to Keller Williams, RE/MAX, and Coldwell Banker. Splits, fees, and benefits compared.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
