import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About eXp Realty',
  description:
    "Learn about eXp Realty's cloud-based model, commission structure, stock awards, and global reach. See why 84,000+ agents chose eXp.",
  alternates: {
    canonical: 'https://smartagentalliance.com/about-exp-realty/',
  },
  openGraph: {
    title: 'About eXp Realty | Smart Agent Alliance',
    description:
      "Learn about eXp Realty's cloud-based model, commission structure, stock awards, and global reach.",
    url: 'https://smartagentalliance.com/about-exp-realty/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Smart Agent Alliance' }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
