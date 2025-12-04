import { BlogPostTemplate } from '@/components/blog';
import type { BlogPost } from '@/lib/wordpress/types';

// Sample blog post data for preview
const samplePost: BlogPost = {
  id: 1,
  slug: 'sample-blog-post',
  permalink: 'blog/sample-blog-post',
  title: 'How to Build a Real Estate Empire with eXp Realty',
  content: `
    <h2>Introduction</h2>
    <p>Building a successful real estate career is about more than just closing deals. It's about creating systems, leveraging technology, and building a team that works together to achieve massive success.</p>

    <p>At <a href="https://smartagentalliance.com">Smart Agent Alliance</a>, we've developed a proven roadmap that helps agents go from struggling solo practitioners to empire builders with passive income streams.</p>

    <h2>The Three Pillars of Success</h2>

    <h3>1. Technology That Works For You</h3>
    <p>Gone are the days of cold calling and door knocking. Modern agents leverage AI-powered lead generation, automated follow-up systems, and CRM tools that keep them organized without the busy work.</p>

    <blockquote>
      "The best agents don't work harder—they work smarter. Technology is the great equalizer." — Doug Smart
    </blockquote>

    <h3>2. Revenue Share That Builds Wealth</h3>
    <p>Unlike traditional brokerages, eXp Realty offers a revenue share model that pays you for helping other agents succeed. This creates true passive income that grows over time.</p>

    <ul>
      <li>Earn up to 7 levels deep on agents you attract</li>
      <li>No recruiting requirements—just help agents find their path</li>
      <li>Residual income that continues even when you're not actively selling</li>
    </ul>

    <h3>3. Community and Mentorship</h3>
    <p>Success doesn't happen in isolation. Our team provides:</p>

    <ol>
      <li>Weekly mastermind calls with top producers</li>
      <li>One-on-one coaching for new agents</li>
      <li>Access to proven scripts and systems</li>
      <li>A supportive community that celebrates wins together</li>
    </ol>

    <h2>Ready to Get Started?</h2>
    <p>If you're ready to transform your real estate career, the Smart Agent Alliance is here to help. We've helped hundreds of agents build six-figure incomes and create the lifestyle freedom they've always dreamed of.</p>

    <p><strong>The question isn't whether you can succeed—it's whether you're ready to take the first step.</strong></p>
  `,
  excerpt: 'Learn the three pillars of building a successful real estate empire with eXp Realty and the Smart Agent Alliance team.',
  date: '2025-12-02T12:00:00Z',
  modified: '2025-12-02T12:00:00Z',
  featuredImage: {
    url: 'https://wp.saabuildingblocks.com/wp-content/uploads/2025/09/sponsoring-agents-as-a-new-exp-agent-featured.webp',
    alt: 'Sample featured image for blog post preview'
  },
  author: {
    name: 'Doug Smart',
    avatar: 'https://wp.saabuildingblocks.com/wp-content/uploads/2025/12/Doug-Profile-Picture.png',
  },
  categories: ['Business Growth', 'eXp Realty'],
  youtubeVideoUrl: 'https://youtu.be/NZH2BpEIDhQ?si=dMVJFYnXEL10Zzht',
};

// Sample related posts
const relatedPosts: BlogPost[] = [
  {
    id: 2,
    slug: 'revenue-share-explained',
    permalink: 'blog/revenue-share-explained',
    title: 'eXp Realty Revenue Share Explained: Your Path to Passive Income',
    content: '<p>Understanding revenue share...</p>',
    excerpt: 'A comprehensive guide to understanding eXp Realty\'s revenue share model.',
    date: '2025-11-28T12:00:00Z',
    modified: '2025-11-28T12:00:00Z',
    author: { name: 'Karrie Smart' },
    categories: ['Business Growth'],
  },
  {
    id: 3,
    slug: 'new-agent-success-guide',
    permalink: 'blog/new-agent-success-guide',
    title: 'New Agent Success Guide: Your First 90 Days',
    content: '<p>Starting your career...</p>',
    excerpt: 'Everything you need to know to succeed in your first 90 days as a real estate agent.',
    date: '2025-11-25T12:00:00Z',
    modified: '2025-11-25T12:00:00Z',
    author: { name: 'Doug Smart' },
    categories: ['New Agents'],
  },
];

export default function BlogPreviewPage() {
  return (
    <main>
      <BlogPostTemplate
        post={samplePost}
        relatedPosts={relatedPosts}
      />
    </main>
  );
}

export const metadata = {
  title: 'Blog Post Preview | Smart Agent Alliance',
  description: 'Preview of the blog post template',
};
