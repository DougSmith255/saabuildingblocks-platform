import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Doug Smart',
  description:
    'Meet Doug Smart, co-founder of the Smart Agent Alliance. Builder of agent systems, tools, and technology at eXp Realty.',
  openGraph: {
    title: 'Doug Smart | Smart Agent Alliance',
    description:
      'Meet Doug Smart, co-founder of the Smart Agent Alliance. Builder of agent systems, tools, and technology at eXp Realty.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
