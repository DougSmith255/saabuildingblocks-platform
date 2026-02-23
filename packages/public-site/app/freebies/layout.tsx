import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Agent Resources [7 Tools]',
  description:
    'Download 7 free tools — social media templates, open house sign-in sheets, buyer/listing checklists, and business cards. No email required.',
  openGraph: {
    title: 'Free Agent Resources',
    description:
      '7 free tools — social templates, checklists, sign-in sheets, and business cards.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://smartagentalliance.com/freebies',
  },
};

export default function FreebiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
