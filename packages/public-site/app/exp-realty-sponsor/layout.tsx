import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join Our eXp Realty Sponsor Team',
  description:
    'See what the Smart Agent Alliance offers eXp agents. Custom tools, templates, courses, revenue share, and a proven support system.',
  alternates: {
    canonical: 'https://smartagentalliance.com/exp-realty-sponsor/',
  },
  openGraph: {
    title: 'Join Our eXp Realty Sponsor Team | Smart Agent Alliance',
    description:
      'See what the Smart Agent Alliance offers. Custom tools, templates, courses, and a proven support system for eXp agents.',
    url: 'https://smartagentalliance.com/exp-realty-sponsor/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Smart Agent Alliance' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'SAA Team Value 6.0',
  description: 'See what the Smart Agent Alliance offers eXp agents. Custom tools, templates, courses, revenue share, and a proven support system.',
  thumbnailUrl: 'https://customer-505wbln0w1rittgq.cloudflarestream.com/cd4d22b4fd6f33dfac69b0e1546d1c40/thumbnails/thumbnail.jpg',
  uploadDate: '2026-01-01',
  contentUrl: 'https://customer-505wbln0w1rittgq.cloudflarestream.com/cd4d22b4fd6f33dfac69b0e1546d1c40/manifest/video.m3u8',
  embedUrl: 'https://customer-505wbln0w1rittgq.cloudflarestream.com/cd4d22b4fd6f33dfac69b0e1546d1c40/iframe',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
