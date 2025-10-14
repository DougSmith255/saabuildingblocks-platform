/**
 * Blog Image Components - Usage Examples
 * Copy these examples into your components
 */

import {
  BlogFeaturedImage,
  BlogContentImage,
  BlogThumbnail,
  FeaturedImageSkeleton,
  SIZE_CONFIG
} from '@/components/blog';
import type { BlogPost } from '@/lib/wordpress/types';

// ============================================================================
// EXAMPLE 1: Blog Post Detail Page
// ============================================================================

export function BlogPostDetailExample({ post }: { post: BlogPost }) {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Featured Image - Above the fold, high priority */}
      <BlogFeaturedImage
        post={post}
        priority={true}  // LCP optimization
        className="rounded-lg mb-8 shadow-2xl"
      />

      {/* Post metadata */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-gray-400">
          <span>{new Date(post.date).toLocaleDateString()}</span>
          <span>•</span>
          <span>{post.author.name}</span>
        </div>
      </header>

      {/* Post content - WordPress HTML */}
      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* OR: Custom content images */}
      <BlogContentImage
        src="https://wp.saabuildingblocks.com/wp-content/uploads/2024/01/custom-image.jpg"
        alt="Custom image description"
        width={1200}
        height={800}
        caption="This is a custom image with caption"
        enableLightbox={true}  // Click to expand
        className="my-8"
      />
    </article>
  );
}

// ============================================================================
// EXAMPLE 2: Blog Listing Page (Grid)
// ============================================================================

export function BlogListingGridExample({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
      {posts.map(post => (
        <article
          key={post.id}
          className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
        >
          {/* Thumbnail with medium size, 16:9 aspect ratio */}
          <BlogThumbnail
            post={post}
            size="medium"
            aspectRatio="16/9"
          />

          <div className="p-6">
            <h3 className="text-xl font-bold mb-2 line-clamp-2">
              {post.title}
            </h3>
            <div
              className="text-gray-400 text-sm line-clamp-3"
              dangerouslySetInnerHTML={{ __html: post.excerpt }}
            />
            <div className="mt-4 flex items-center gap-2">
              {post.categories.map(cat => (
                <span
                  key={cat}
                  className="px-2 py-1 bg-blue-600 rounded text-xs"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Blog Listing Page (List View)
// ============================================================================

export function BlogListingListExample({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="max-w-5xl mx-auto space-y-8 px-4">
      {posts.map(post => (
        <article
          key={post.id}
          className="flex gap-6 bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
        >
          {/* Small thumbnail with square aspect ratio */}
          <div className="w-48 flex-shrink-0">
            <BlogThumbnail
              post={post}
              size="small"
              aspectRatio="1/1"
            />
          </div>

          <div className="flex-1 p-6">
            <h3 className="text-2xl font-bold mb-2">{post.title}</h3>
            <div
              className="text-gray-400 mb-4 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: post.excerpt }}
            />
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{new Date(post.date).toLocaleDateString()}</span>
              <span>•</span>
              <span>{post.author.name}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Featured Posts Carousel
// ============================================================================

export function FeaturedPostsCarouselExample({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8 px-4">Featured Posts</h2>

      <div className="flex gap-6 overflow-x-auto px-4 pb-4 snap-x snap-mandatory">
        {posts.slice(0, 5).map(post => (
          <article
            key={post.id}
            className="flex-shrink-0 w-80 bg-gray-800 rounded-lg overflow-hidden snap-start"
          >
            {/* Large thumbnail */}
            <BlogThumbnail
              post={post}
              size="large"
              aspectRatio="16/9"
            />

            <div className="p-4">
              <h3 className="font-bold mb-2 line-clamp-2">{post.title}</h3>
              <p className="text-sm text-gray-400 line-clamp-2">
                {post.excerpt.replace(/<[^>]*>/g, '')}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// EXAMPLE 5: Loading State with Skeleton
// ============================================================================

export function BlogPostLoadingExample() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Loading skeleton for featured image */}
      <FeaturedImageSkeleton className="rounded-lg mb-8" />

      {/* Loading skeletons for content */}
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-gray-800 rounded w-3/4" />
        <div className="h-4 bg-gray-800 rounded w-1/4" />
        <div className="space-y-2 pt-8">
          <div className="h-4 bg-gray-800 rounded" />
          <div className="h-4 bg-gray-800 rounded" />
          <div className="h-4 bg-gray-800 rounded w-5/6" />
        </div>
      </div>
    </article>
  );
}

// ============================================================================
// EXAMPLE 6: Blog Sidebar with Recent Posts
// ============================================================================

export function BlogSidebarExample({ recentPosts }: { recentPosts: BlogPost[] }) {
  return (
    <aside className="w-80 space-y-6">
      <h3 className="text-xl font-bold">Recent Posts</h3>

      {recentPosts.map(post => (
        <article key={post.id} className="flex gap-4">
          {/* Small square thumbnail */}
          <div className="w-20 flex-shrink-0">
            <BlogThumbnail
              post={post}
              size="small"
              aspectRatio="1/1"
              className="rounded"
            />
          </div>

          <div className="flex-1">
            <h4 className="text-sm font-semibold line-clamp-2 mb-1">
              {post.title}
            </h4>
            <p className="text-xs text-gray-500">
              {new Date(post.date).toLocaleDateString()}
            </p>
          </div>
        </article>
      ))}
    </aside>
  );
}

// ============================================================================
// EXAMPLE 7: Category Page with Mixed Layouts
// ============================================================================

export function CategoryPageExample({ posts }: { posts: BlogPost[] }) {
  const [featured, ...rest] = posts;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Featured post - Large */}
      {featured && (
        <article className="mb-12 bg-gray-800 rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-2/3">
              <BlogFeaturedImage
                post={featured}
                priority={true}
              />
            </div>
            <div className="md:w-1/3 p-8">
              <h2 className="text-3xl font-bold mb-4">{featured.title}</h2>
              <div
                className="text-gray-400 line-clamp-4 mb-6"
                dangerouslySetInnerHTML={{ __html: featured.excerpt }}
              />
              <button className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700">
                Read More
              </button>
            </div>
          </div>
        </article>
      )}

      {/* Rest of posts - Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {rest.map(post => (
          <article
            key={post.id}
            className="bg-gray-800 rounded-lg overflow-hidden"
          >
            <BlogThumbnail
              post={post}
              size="medium"
              aspectRatio="16/9"
            />
            <div className="p-4">
              <h3 className="font-bold mb-2 line-clamp-2">{post.title}</h3>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 8: Custom Content with Multiple Images
// ============================================================================

export function CustomContentExample() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8 prose prose-invert">
      <h1>How to Build a Real Estate Brand</h1>

      <p>
        Building a strong real estate brand requires consistent visual identity
        and messaging across all platforms.
      </p>

      {/* Image with caption */}
      <BlogContentImage
        src="https://wp.saabuildingblocks.com/wp-content/uploads/2024/01/brand-identity.jpg"
        alt="Brand identity elements including logo, colors, and typography"
        width={1200}
        height={800}
        caption="Key elements of a cohesive brand identity"
        enableLightbox={true}
      />

      <h2>Visual Consistency</h2>
      <p>Your brand should be recognizable across all touchpoints...</p>

      {/* Another image */}
      <BlogContentImage
        src="https://wp.saabuildingblocks.com/wp-content/uploads/2024/01/consistency.jpg"
        alt="Examples of consistent branding across platforms"
        width={1200}
        height={600}
        caption="Consistent branding builds trust and recognition"
        enableLightbox={true}
      />
    </article>
  );
}

// ============================================================================
// EXAMPLE 9: Masonry Grid Layout
// ============================================================================

export function MasonryGridExample({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 px-4">
      {posts.map((post, index) => (
        <article
          key={post.id}
          className="break-inside-avoid mb-8 bg-gray-800 rounded-lg overflow-hidden"
        >
          {/* Different aspect ratios for variety */}
          <BlogThumbnail
            post={post}
            size="medium"
            aspectRatio={index % 3 === 0 ? '1/1' : index % 3 === 1 ? '4/3' : '16/9'}
          />

          <div className="p-4">
            <h3 className="font-bold mb-2">{post.title}</h3>
            <div
              className="text-sm text-gray-400 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: post.excerpt }}
            />
          </div>
        </article>
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 10: Size Configuration Usage
// ============================================================================

export function SizeConfigExample() {
  // Access size configuration for custom logic
  console.log('Available sizes:', Object.keys(SIZE_CONFIG));
  console.log('Medium size config:', SIZE_CONFIG.medium);

  return (
    <div>
      <h2>Size Configurations</h2>
      <ul>
        {Object.entries(SIZE_CONFIG).map(([size, config]) => (
          <li key={size}>
            {size}: {config.sizes} @ {config.quality}% quality
          </li>
        ))}
      </ul>
    </div>
  );
}
