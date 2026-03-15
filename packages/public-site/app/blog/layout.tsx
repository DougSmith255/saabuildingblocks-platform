import type { Metadata } from 'next';
import '../styles/blog.css';

export const metadata: Metadata = {
  title: 'Agent Success Hub: Real Estate Blog',
  description:
    'Real estate insights, marketing strategies, brokerage comparisons, and career guides. Expert tips for agents building lasting, profitable careers.',
  alternates: {
    canonical: 'https://smartagentalliance.com/blog/',
  },
  openGraph: {
    title: 'Agent Success Hub: Real Estate Blog - Smart Agent Alliance',
    description:
      'Real estate insights, marketing strategies, brokerage comparisons, and career guides. Expert tips for agents building lasting, profitable careers.',
    url: 'https://smartagentalliance.com/blog/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Smart Agent Alliance' }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
