import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Social Poster | Smart Agent Alliance',
  description: 'Automate blog post distribution across social media platforms',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 dark:bg-gray-900">
        {children}
      </body>
    </html>
  );
}
