import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book a Call With Our Team',
  description:
    'Schedule a free consultation with the Smart Agent Alliance team. Learn how eXp Realty and our tools can accelerate your real estate career.',
  alternates: {
    canonical: 'https://smartagentalliance.com/book-a-call/',
  },
  openGraph: {
    title: 'Book a Call With Our Team | Smart Agent Alliance',
    description:
      'Schedule a free consultation with the Smart Agent Alliance team about joining eXp Realty.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartagentalliance.com/' },
    { '@type': 'ListItem', position: 2, name: 'Book a Call', item: 'https://smartagentalliance.com/book-a-call/' },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
