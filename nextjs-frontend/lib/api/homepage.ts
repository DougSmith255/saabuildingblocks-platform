/**
 * API utilities for fetching homepage data from WordPress
 */

import type { Highlight, HomepageData, TeamValue } from '@/types/homepage';

const WP_API_URL = process.env['NEXT_PUBLIC_WP_API_URL'] || 'https://your-wordpress-site.com';

export async function getHomepageData(): Promise<HomepageData> {
  try {
    const response = await fetch(`${WP_API_URL}/wp-json/saa/v1/homepage`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch homepage data: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    throw error;
  }
}

export async function getHighlights(): Promise<Highlight[]> {
  const data = await getHomepageData();
  return data.highlights || [];
}

export async function getTeamLeaders() {
  const data = await getHomepageData();
  return data.leaders || [];
}

export async function getTeamValues(): Promise<TeamValue[]> {
  const data = await getHomepageData();
  return data.values || [];
}
