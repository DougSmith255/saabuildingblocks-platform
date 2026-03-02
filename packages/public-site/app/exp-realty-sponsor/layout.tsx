import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join Our eXp Realty Team',
  description:
    'See what the Smart Agent Alliance offers eXp agents. Custom tools, templates, courses, revenue share, and a proven support system.',
  openGraph: {
    title: 'Join Our eXp Realty Team | Smart Agent Alliance',
    description:
      'See what the Smart Agent Alliance offers. Custom tools, templates, courses, and a proven support system for eXp agents.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
