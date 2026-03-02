import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Doug Smart - Links',
  description:
    'Connect with Doug Smart on social media and explore Smart Agent Alliance resources.',
  openGraph: {
    title: 'Doug Smart - Links | Smart Agent Alliance',
    description:
      'Connect with Doug Smart on social media and explore Smart Agent Alliance resources.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
