import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Karrie Hill',
  description:
    'Meet Karrie Hill, co-founder of the Smart Agent Alliance. Licensed REALTOR, certified negotiation expert, and eXp Realty leader.',
  openGraph: {
    title: 'Karrie Hill | Smart Agent Alliance',
    description:
      'Meet Karrie Hill, co-founder of the Smart Agent Alliance. Licensed REALTOR, certified negotiation expert, and eXp Realty leader.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
