import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About eXp Realty',
  description:
    "Learn about eXp Realty's cloud-based model, commission structure, stock awards, and global reach. See why 84,000+ agents chose eXp.",
  openGraph: {
    title: 'About eXp Realty | Smart Agent Alliance',
    description:
      "Learn about eXp Realty's cloud-based model, commission structure, stock awards, and global reach.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
