import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Download SAA Portal',
  description: 'Install the SAA Portal app on your device for instant access to your dashboard, templates, and team resources.',
  openGraph: {
    title: 'Download SAA Portal',
    description: 'Install the SAA Portal app',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function DownloadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
