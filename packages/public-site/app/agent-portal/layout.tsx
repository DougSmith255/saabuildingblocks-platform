import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agent Portal',
  description:
    'Access your Smart Agent Alliance tools, templates, team calls, courses, and resources. Members-only agent portal.',
  openGraph: {
    title: 'Agent Portal | Smart Agent Alliance',
    description:
      'Access your Smart Agent Alliance tools, templates, team calls, courses, and resources.',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
