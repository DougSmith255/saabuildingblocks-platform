'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@saa/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@saa/shared/components/ui/card';

/**
 * Blog Post Data Interface
 * Fetched from WordPress API: GET /wp-json/saa/v1/homepage (recent_posts array)
 */
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  permalink: string;
  featured_image?: string;
  date: string;
}

/**
 * API Response Interface
 */
interface ApiResponse {
  recent_posts: BlogPost[];
}

/**
 * Format date to readable format (e.g., "Jan 15, 2025")
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Strip HTML tags from excerpt
 */
const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};

/**
 * Individual Blog Post Card Component
 */
interface BlogCardProps {
  post: BlogPost;
  index: number;
}

function BlogCard({ post, index }: BlogCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });

  const fallbackImage = '/images/blog-fallback.jpg'; // Fallback image path

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.5,
        delay: index * 0.05, // 50ms staggered delay
        ease: 'easeOut',
      }}
      className="group h-full"
    >
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
        {/* Featured Image */}
        <div className="relative aspect-video w-full overflow-hidden bg-neutral-100">
          <Image
            src={post.featured_image || fallbackImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
          />
        </div>

        <CardHeader>
          {/* Post Title - Truncate to 2 lines */}
          <CardTitle className="line-clamp-2 text-xl font-taskor font-semibold leading-tight text-neutral-900 transition-colors group-hover:text-gold-600">
            {post.title}
          </CardTitle>

          {/* Post Date */}
          <CardDescription className="mt-2 text-sm text-neutral-500">
            {formatDate(post.date)}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Excerpt - Truncate to 3 lines */}
          <p className="line-clamp-3 font-amulya text-neutral-600">
            {stripHtml(post.excerpt)}
          </p>
        </CardContent>

        <CardFooter>
          {/* Read More Link */}
          <Link
            href={post.permalink}
            className="inline-flex items-center gap-2 font-amulya text-sm font-medium text-gold-600 transition-colors hover:text-gold-700"
            aria-label={`Read more about ${post.title}`}
          >
            Read More
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

/**
 * Blog Preview Section Component
 *
 * Features:
 * - Fetches 6 recent blog posts from WordPress API
 * - Responsive grid layout (1/2/3 columns)
 * - Lazy loading with blur placeholders
 * - Staggered fade-in animations
 * - Hover effects with lift and image zoom
 * - "View All Posts" CTA button
 * - Error handling and loading states
 *
 * @component
 */
export default function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const apiUrl = process.env['NEXT_PUBLIC_WORDPRESS_API_URL'];

        if (!apiUrl) {
          throw new Error('WordPress API URL is not configured');
        }

        // Construct the custom endpoint URL
        const baseUrl = apiUrl.replace('/wp/v2', '');
        const endpoint = `${baseUrl}/saa/v1/homepage`;

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Use cache with revalidation for better performance
          next: { revalidate: 3600 }, // 1 hour
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch blog posts: ${response.status} ${response.statusText}`
          );
        }

        const data: ApiResponse = await response.json();

        if (!data.recent_posts || !Array.isArray(data.recent_posts)) {
          throw new Error('Invalid API response: recent_posts missing or invalid');
        }

        // Take only the first 6 posts
        setPosts(data.recent_posts.slice(0, 6));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load blog posts';
        setError(errorMessage);
        console.error('Blog Preview Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Loading State
  if (isLoading) {
    return (
      <section
        className="w-full bg-white py-16 md:py-24"
        aria-label="Blog preview loading"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header Skeleton */}
          <div className="mb-12 text-center">
            <div className="mx-auto h-10 w-64 animate-pulse rounded-lg bg-neutral-200" />
          </div>

          {/* Blog Grid Skeleton */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl border bg-card shadow">
                <div className="aspect-video w-full animate-pulse bg-neutral-200" />
                <div className="p-6">
                  <div className="h-6 w-3/4 animate-pulse rounded bg-neutral-200" />
                  <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-neutral-200" />
                  <div className="mt-4 space-y-2">
                    <div className="h-3 w-full animate-pulse rounded bg-neutral-200" />
                    <div className="h-3 w-full animate-pulse rounded bg-neutral-200" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error State
  if (error) {
    return (
      <section
        className="w-full bg-white py-16 md:py-24"
        aria-label="Blog preview error"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div
              className="rounded-lg border border-red-200 bg-red-50 p-6"
              role="alert"
            >
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Empty State
  if (posts.length === 0) {
    return (
      <section
        className="w-full bg-white py-16 md:py-24"
        aria-label="Blog preview empty"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-neutral-600">No blog posts available at this time.</p>
          </div>
        </div>
      </section>
    );
  }

  // Main Blog Preview Section
  return (
    <section
      ref={sectionRef}
      className="w-full bg-white py-16 md:py-24"
      aria-label="Latest blog posts"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="display-md font-taskor font-bold text-neutral-900">
            Latest from Our Blog
          </h2>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>

        {/* View All Posts Button */}
        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        >
          <Button
            asChild
            size="lg"
            className="bg-gold-500 text-neutral-900 hover:bg-gold-600 focus-visible:ring-gold-500 transition-all duration-200 hover:shadow-lg hover:scale-105"
          >
            <Link href="/blog" aria-label="View all blog posts">
              View All Posts
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
