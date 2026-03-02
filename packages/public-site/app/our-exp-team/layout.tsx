import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Team',
  description:
    'Meet the Smart Agent Alliance founders and partners. Doug Smart, Karrie Hill, and a team dedicated to helping eXp agents succeed.',
  openGraph: {
    title: 'Our Team | Smart Agent Alliance',
    description:
      'Meet the Smart Agent Alliance founders and partners. A team dedicated to helping eXp agents succeed.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
