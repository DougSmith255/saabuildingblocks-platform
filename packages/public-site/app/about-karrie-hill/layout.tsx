import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Karrie Hill, JD',
  description:
    'UC Berkeley Law grad. Six-figure RE business in year one — no cold calls. See her track record and 5 certifications as an eXp Certified Mentor.',
  openGraph: {
    title: 'About Karrie Hill, JD',
    description:
      'Six-figure first year, no cold calls. See her track record and certifications.',
    type: 'profile',
  },
  alternates: {
    canonical: 'https://smartagentalliance.com/about-karrie-hill',
  },
};

export default function AboutKarrieHillLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
