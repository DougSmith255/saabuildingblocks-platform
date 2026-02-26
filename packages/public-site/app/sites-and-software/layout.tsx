import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Doug's Tool List - Tools for Real Estate Agents",
  description: 'The actual software and tools I use to run Smart Agent Alliance. CRM, hosting, SEO, AI, and more.',
};

export default function SitesAndSoftwareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
