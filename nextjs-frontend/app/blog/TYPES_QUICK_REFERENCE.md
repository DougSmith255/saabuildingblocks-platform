# Blog Types - Quick Reference for Workers

**For Workers 1 & 2: Copy-paste ready code snippets**

---

## Import Statements

### Blog Listing (`page.tsx`)
```typescript
import type { BlogPost } from '@/lib/wordpress';
import { fetchAllPosts } from '@/lib/wordpress';
```

### Blog Post (`[slug]/page.tsx`)
```typescript
import type { BlogPost } from '@/lib/wordpress';
import type { Metadata } from 'next';
import { fetchAllPosts, fetchPostBySlug } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
```

---

## Type-Safe Function Signatures

### Blog Listing Page
```typescript
export default async function BlogPage(): Promise<JSX.Element> {
  const posts: BlogPost[] = await fetchAllPosts();
  // ...
}
```

### Blog Post Page
```typescript
// Generate static params
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const posts: BlogPost[] = await fetchAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

// Generate metadata
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post: BlogPost | null = await fetchPostBySlug(params.slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

// Page component
export default async function BlogPostPage(
  { params }: { params: { slug: string } }
): Promise<JSX.Element> {
  const post: BlogPost | null = await fetchPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // ...
}
```

---

## BlogPost Type Properties

```typescript
interface BlogPost {
  id: number;              // Unique post ID
  slug: string;            // URL-friendly slug
  title: string;           // Post title (plain text)
  content: string;         // HTML content
  excerpt: string;         // HTML excerpt
  date: string;            // ISO date string
  modified: string;        // ISO date string
  featuredImage?: {        // Optional featured image
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  author: {
    name: string;
    avatar?: string;       // Optional avatar URL
  };
  categories: string[];    // Array of category slugs
}
```

---

## Safe Property Access

### Featured Image (Optional)
```typescript
{post.featuredImage && (
  <img
    src={post.featuredImage.url}
    alt={post.featuredImage.alt}
    width={post.featuredImage.width}
    height={post.featuredImage.height}
  />
)}
```

### Author Avatar (Optional)
```typescript
{post.author.avatar && (
  <img src={post.author.avatar} alt={post.author.name} />
)}
```

### Categories
```typescript
{post.categories.map(category => (
  <span key={category}>{category}</span>
))}
```

---

## Null Safety Pattern

```typescript
const post: BlogPost | null = await fetchPostBySlug(params.slug);

if (!post) {
  notFound(); // Next.js 404
  return; // TypeScript knows this is unreachable
}

// From here, post is BlogPost (not null)
return <article>{post.title}</article>;
```

---

## Date Formatting

```typescript
// Raw ISO string
post.date // "2024-03-15T10:30:00"

// Format with Date object
new Date(post.date).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})
// "March 15, 2024"
```

---

## Complete Example (Blog Listing)

```typescript
import type { BlogPost } from '@/lib/wordpress';
import { fetchAllPosts } from '@/lib/wordpress';

export default async function BlogPage() {
  const posts: BlogPost[] = await fetchAllPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1>Blog</h1>

      <div className="grid gap-8">
        {posts.map((post: BlogPost) => (
          <article key={post.id}>
            <h2>{post.title}</h2>

            {post.featuredImage && (
              <img
                src={post.featuredImage.url}
                alt={post.featuredImage.alt}
                width={post.featuredImage.width}
                height={post.featuredImage.height}
              />
            )}

            <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />

            <div>
              <span>By {post.author.name}</span>
              <time>{new Date(post.date).toLocaleDateString()}</time>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
```

---

## Complete Example (Blog Post)

```typescript
import type { BlogPost } from '@/lib/wordpress';
import type { Metadata } from 'next';
import { fetchAllPosts, fetchPostBySlug } from '@/lib/wordpress';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const posts: BlogPost[] = await fetchAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const post: BlogPost | null = await fetchPostBySlug(params.slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post.title,
    description: post.excerpt.replace(/<[^>]*>/g, ''), // Strip HTML
    openGraph: post.featuredImage ? {
      images: [{
        url: post.featuredImage.url,
        width: post.featuredImage.width,
        height: post.featuredImage.height,
        alt: post.featuredImage.alt,
      }],
    } : undefined,
  };
}

export default async function BlogPostPage({ params }) {
  const post: BlogPost | null = await fetchPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-8">
      <h1>{post.title}</h1>

      <div className="metadata">
        <span>By {post.author.name}</span>
        <time>{new Date(post.date).toLocaleDateString()}</time>
      </div>

      {post.featuredImage && (
        <img
          src={post.featuredImage.url}
          alt={post.featuredImage.alt}
          width={post.featuredImage.width}
          height={post.featuredImage.height}
        />
      )}

      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

---

## TypeScript Compilation Check

```bash
# Verify no type errors
npx tsc --noEmit --skipLibCheck
```

**Expected**: No errors related to blog files.

---

## Summary

✅ **Import from**: `@/lib/wordpress`
✅ **Main type**: `BlogPost`
✅ **Null safety**: Always check `BlogPost | null`
✅ **Optional props**: `featuredImage?`, `author.avatar?`
✅ **Next.js types**: Import `Metadata` from `'next'`

**All types are fully defined, no `any` types needed!**
