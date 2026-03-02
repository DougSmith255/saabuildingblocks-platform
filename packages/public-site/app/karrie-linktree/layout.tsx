import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Karrie Hill - Links',
  description:
    'Connect with Karrie Hill on social media and explore Smart Agent Alliance resources.',
  openGraph: {
    title: 'Karrie Hill - Links | Smart Agent Alliance',
    description:
      'Connect with Karrie Hill on social media and explore Smart Agent Alliance resources.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
