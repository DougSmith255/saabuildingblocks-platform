'use client';

import React, { useState } from 'react';
import { Twitter, Facebook, Linkedin, Mail, Link2, Check } from 'lucide-react';

export interface ShareButtonsProps {
  /**
   * Post title for sharing
   */
  title: string;
  /**
   * Post slug for URL construction
   */
  slug: string;
  /**
   * Post excerpt for sharing description
   */
  excerpt?: string;
}

/**
 * ShareButtons - Social media share buttons
 *
 * PROTOCOL COMPLIANCE:
 * ✅ Master Controller brand colors ONLY
 * ✅ Responsive design
 * ✅ Accessible buttons (aria-label)
 * ✅ Uses lucide-react icons
 *
 * Features:
 * - Twitter/X share
 * - Facebook share
 * - LinkedIn share
 * - Email share
 * - Copy link button (with visual feedback)
 * - Master Controller colors
 * - Hover effects
 *
 * @example
 * ```tsx
 * <ShareButtons
 *   title="Amazing Blog Post"
 *   slug="amazing-blog-post"
 *   excerpt="This is an amazing post about..."
 * />
 * ```
 */
export function ShareButtons({ title, slug, excerpt }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Build the post URL
  const postUrl = `https://saabuildingblocks.com/blog/${slug}`;

  // Clean excerpt for sharing
  const cleanExcerpt = excerpt
    ? excerpt.replace(/<[^>]*>/g, '').substring(0, 200)
    : '';

  // Share handlers
  const handleTwitterShare = () => {
    const text = `${title} - ${cleanExcerpt}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(postUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`I thought you might find this interesting:\n\n${title}\n\n${cleanExcerpt}\n\nRead more: ${postUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const buttonClass = `
    flex items-center justify-center gap-2
    px-4 py-2
    bg-[#e5e4dd]/5 hover:bg-[#e5e4dd]/10
    border border-[#e5e4dd]/20 hover:border-[#00ff88]
    text-[#dcdbd5] hover:text-[#00ff88]
    rounded-lg
    transition-all duration-200
    font-[var(--font-taskor)]
    text-sm uppercase tracking-wider
  `;

  return (
    <div className="mt-12 pt-8 border-t border-[#e5e4dd]/20">
      <h3 className="text-h3 mb-4 text-[#e5e4dd] font-[var(--font-taskor)]">
        Share This Post
      </h3>

      <div className="flex flex-wrap gap-3">
        {/* Twitter/X */}
        <button
          onClick={handleTwitterShare}
          className={buttonClass}
          aria-label="Share on Twitter"
        >
          <Twitter className="w-4 h-4" />
          <span className="hidden sm:inline">Twitter</span>
        </button>

        {/* Facebook */}
        <button
          onClick={handleFacebookShare}
          className={buttonClass}
          aria-label="Share on Facebook"
        >
          <Facebook className="w-4 h-4" />
          <span className="hidden sm:inline">Facebook</span>
        </button>

        {/* LinkedIn */}
        <button
          onClick={handleLinkedInShare}
          className={buttonClass}
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="w-4 h-4" />
          <span className="hidden sm:inline">LinkedIn</span>
        </button>

        {/* Email */}
        <button
          onClick={handleEmailShare}
          className={buttonClass}
          aria-label="Share via Email"
        >
          <Mail className="w-4 h-4" />
          <span className="hidden sm:inline">Email</span>
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className={buttonClass}
          aria-label="Copy link to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-[#00ff88]" />
              <span className="hidden sm:inline text-[#00ff88]">Copied!</span>
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4" />
              <span className="hidden sm:inline">Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
