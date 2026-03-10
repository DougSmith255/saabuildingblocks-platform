import type { Metadata } from 'next';
import '../styles/blog.css';

export const metadata: Metadata = {
  title: 'Real Estate Agent Blog',
  description:
    'Real estate insights, marketing strategies, brokerage comparisons, and career tips for agents who want to level up.',
  alternates: {
    canonical: 'https://smartagentalliance.com/blog/',
  },
  openGraph: {
    title: 'Real Estate Agent Blog | Smart Agent Alliance',
    description:
      'Real estate insights, marketing strategies, brokerage comparisons, and career tips for agents.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
