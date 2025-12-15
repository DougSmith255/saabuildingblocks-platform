import { notFound } from 'next/navigation';
import AgentPageClient from './components/AgentPageClient';
import type { Metadata } from 'next';

/**
 * Agent Page - Dynamic route at root level
 *
 * URLs: /john-smith, /jane-doe, etc.
 *
 * Static routes (blog, agent-portal, etc.) take priority over this dynamic route.
 * This catches any slug that doesn't match a static route and displays the agent page.
 */

// Disable dynamic params - only pre-generated routes will work
export const dynamicParams = false;

// For static export, we need to provide all possible slugs at build time
// Since agent pages are created dynamically, we return empty array for now
// New agent pages will require a rebuild to be accessible
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  // TODO: Fetch active agent slugs from Supabase at build time
  // For now, return empty - agent pages will 404 until added to build
  return [];
}

/**
 * Generate metadata for agent pages
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Format slug for display (john-smith -> John Smith)
  const displayName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${displayName} | Smart Agent Alliance`,
    description: `Connect with ${displayName}, a real estate professional with Smart Agent Alliance and eXp Realty.`,
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Agent Page Component
 */
export default async function AgentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Reserved slugs that should 404 if they somehow reach here
  const reservedSlugs = [
    'api',
    'admin',
    '_next',
    'static',
    'favicon.ico',
  ];

  if (reservedSlugs.includes(slug)) {
    notFound();
  }

  return (
    <main id="main-content">
      <AgentPageClient slug={slug} />
    </main>
  );
}
