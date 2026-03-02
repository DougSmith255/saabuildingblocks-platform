import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book a Call',
  description:
    'Schedule a free consultation with the Smart Agent Alliance team. Learn how eXp Realty and our tools can accelerate your real estate career.',
  openGraph: {
    title: 'Book a Call | Smart Agent Alliance',
    description:
      'Schedule a free consultation with the Smart Agent Alliance team about joining eXp Realty.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
