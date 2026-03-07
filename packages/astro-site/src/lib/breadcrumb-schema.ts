/**
 * Generate BreadcrumbList JSON-LD schema for blog posts.
 * This is generated at build time in Astro's <head> slot,
 * replacing the inline <script> that was in the React Breadcrumbs component
 * (which caused hydration error #418).
 */

const CATEGORY_SLUG_MAP: Record<string, string> = {
  'Brokerage Comparison': 'brokerage-comparison',
  'About eXp Realty': 'about-exp-realty',
  'eXp Realty Sponsor': 'exp-realty-sponsor',
  'Marketing Mastery': 'marketing-mastery',
  'Agent Career Info': 'agent-career-info',
  'Winning Clients': 'winning-clients',
  'Real Estate Schools': 'real-estate-schools',
  'Become an Agent': 'become-an-agent',
  'Industry Trends': 'industry-trends',
  'Fun for Agents': 'fun-for-agents',
  'Business Growth': 'marketing-mastery',
  'Clients': 'winning-clients',
  'Uncategorized': '',
};

function getCategorySlug(categoryName: string): string {
  const mapped = CATEGORY_SLUG_MAP[categoryName];
  if (mapped !== undefined) return mapped;
  return categoryName.toLowerCase().replace(/\s+/g, '-');
}

export function buildBreadcrumbSchema(category: string, postTitle: string) {
  const resolvedSlug = getCategorySlug(category);
  const items: Array<{ '@type': string; position: number; name: string; item?: string }> = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartagentalliance.com/' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://smartagentalliance.com/blog' },
  ];

  if (category && resolvedSlug) {
    items.push({
      '@type': 'ListItem',
      position: 3,
      name: category,
      item: `https://smartagentalliance.com/blog/#category=${resolvedSlug}`,
    });
  }

  items.push({
    '@type': 'ListItem',
    position: items.length + 1,
    name: postTitle,
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}
