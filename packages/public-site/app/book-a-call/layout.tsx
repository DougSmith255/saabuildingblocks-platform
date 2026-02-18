import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book a Call | Smart Agent Alliance',
  description: 'Schedule a one-on-one call with the Smart Agent Alliance team to learn about joining eXp Realty with SAA.',
  openGraph: {
    title: 'Book a Call | Smart Agent Alliance',
    description: 'Schedule a call with SAA to see if we\'re the right fit for you.',
    type: 'website',
  },
};

export default function BookACallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
