import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Download',
  description:
    'Download the Smart Agent Alliance mobile app.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
