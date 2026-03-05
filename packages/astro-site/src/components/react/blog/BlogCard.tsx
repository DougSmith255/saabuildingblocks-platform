'use client';

import { GenericCard } from '@saa/shared/components/saa/cards/GenericCard';

interface BlogCardProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  featuredImage?: { url: string; alt: string };
  href: string;
}

export function BlogCard({ title, excerpt, category, date, featuredImage, href }: BlogCardProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <a href={href} className="block group">
      <GenericCard hover padding="none" className="h-full overflow-hidden">
        {featuredImage?.url && (
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={featuredImage.url}
              alt={featuredImage.alt || title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        )}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#ffd700]" style={{ fontSize: 'var(--font-size-caption)' }}>
              {category}
            </span>
            <span className="text-[#dcdbd5]/40" style={{ fontSize: 'var(--font-size-caption)' }}>
              {formattedDate}
            </span>
          </div>
          <h3 className="text-h6 text-[#e5e4dd] mb-2 group-hover:text-[#00ff88] transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-body line-clamp-3" style={{ fontSize: 'var(--font-size-caption)' }}>
            {excerpt}
          </p>
        </div>
      </GenericCard>
    </a>
  );
}
