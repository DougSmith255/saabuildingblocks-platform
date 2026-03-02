import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sites & Software for Real Estate Agents',
  description:
    'Curated tool recommendations for real estate agents. CRM, hosting, SEO, AI, domains, and website builders we actually use.',
  openGraph: {
    title: 'Sites & Software for Real Estate Agents | Smart Agent Alliance',
    description:
      'Curated tool recommendations for real estate agents. CRM, hosting, SEO, AI, and more.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
