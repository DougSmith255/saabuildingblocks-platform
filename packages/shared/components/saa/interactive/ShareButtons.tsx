'use client';

import React, { useState } from 'react';
import { Twitter, Facebook, Linkedin, Mail, Link2, Check } from 'lucide-react';

export interface ShareButtonsProps {
  /**
   * Page/post title for sharing
   */
  title: string;
  /**
   * Full URL to share (or slug if baseUrl is provided)
   */
  url: string;
  /**
   * Optional excerpt/description for sharing
   */
  excerpt?: string;
  /**
   * Optional heading text (default: "Share This Post")
   */
  heading?: string;
  /**
   * Whether to show the heading (default: true)
   */
  showHeading?: boolean;
  /**
   * Whether to show the top border divider (default: true)
   */
  showDivider?: boolean;
  /**
   * Optional className for the container
   */
  className?: string;
}

/**
 * ShareButtons - Reusable social media share buttons
 *
 * MASTER CONTROLLER COMPONENT
 * Location: @saa/shared/components/saa/interactive/ShareButtons
 *
 * PROTOCOL COMPLIANCE:
 * ✅ Master Controller CSS variables
 * ✅ Responsive design
 * ✅ Accessible buttons (aria-label)
 * ✅ Uses lucide-react icons
 * ✅ Configurable (heading, divider, URL)
 *
 * Features:
 * - Twitter/X share
 * - Facebook share
 * - LinkedIn share
 * - Email share
 * - Copy link button (with visual feedback)
 * - Master Controller colors via CSS variables
 * - Hover effects with accent green
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ShareButtons
 *   title="Amazing Blog Post"
 *   url="https://example.com/blog/amazing-post"
 *   excerpt="This is an amazing post about..."
 * />
 *
 * // Without heading/divider
 * <ShareButtons
 *   title="Product Page"
 *   url="https://example.com/product"
 *   showHeading={false}
 *   showDivider={false}
 * />
 * ```
 */
export function ShareButtons({
  title,
  url,
  excerpt,
  heading = "Share This Post",
  showHeading = true,
  showDivider = true,
  className = ''
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Clean excerpt for sharing
  const cleanExcerpt = excerpt
    ? excerpt.replace(/<[^>]*>/g, '').substring(0, 200)
    : '';

  // Share handlers
  const handleTwitterShare = () => {
    const text = cleanExcerpt ? `${title} - ${cleanExcerpt}` : title;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=550,height=420');
  };

  const handleFacebookShare = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=550,height=420');
  };

  const handleLinkedInShare = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=550,height=420');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(
      cleanExcerpt
        ? `I thought you might find this interesting:\n\n${title}\n\n${cleanExcerpt}\n\nRead more: ${url}`
        : `I thought you might find this interesting:\n\n${title}\n\n${url}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  // Button styles - 3D Metal plate with green hover
  // 10px vertical padding (py-2.5 = 10px), 3D metal effect matching Master Controller
  const buttonClass = `
    flex items-center justify-center gap-2
    px-5 py-2.5
    rounded-lg
    transition-all duration-200
    font-[var(--font-taskor)]
    text-sm uppercase tracking-wider
    text-[var(--color-bodyText,#dcdbd5)]
    hover:text-[var(--color-accentGreen,#00ff88)]
    border border-[rgba(150,150,150,0.2)]
    hover:border-[var(--color-accentGreen,#00ff88)]
    bg-gradient-to-b from-[rgba(100,100,100,0.3)] to-[rgba(50,50,50,0.5)]
    shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.5)]
    hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_12px_rgba(0,255,136,0.3)]
  `;

  return (
    <div className={`
      ${showDivider ? 'mt-12 pt-8 border-t border-[var(--color-headingText,#e5e4dd)]/20' : ''}
      ${className}
    `}>
      {showHeading && (
        <h3
          className="mb-4"
          style={{
            fontFamily: 'var(--font-family-h3, var(--font-taskor), sans-serif)',
            fontSize: 'var(--font-size-h3, clamp(32px, calc(28.36px + 1.45vw), 72px))',
            lineHeight: 'var(--line-height-h3, 1.3)',
            color: 'var(--text-color-h3, #e5e4dd)',
            fontWeight: 'var(--font-weight-h3, 700)',
          }}
        >
          {heading}
        </h3>
      )}

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
              <Check className="w-4 h-4 text-[var(--color-accentGreen,#00ff88)]" />
              <span className="hidden sm:inline text-[var(--color-accentGreen,#00ff88)]">Copied!</span>
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

export default ShareButtons;
