import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Resources',
  description:
    'Free downloadable tools for real estate agents. Prospecting scripts, checklists, templates, and action plans to grow your business.',
  openGraph: {
    title: 'Free Resources | Smart Agent Alliance',
    description:
      'Free downloadable tools for real estate agents. Scripts, checklists, templates, and action plans.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
