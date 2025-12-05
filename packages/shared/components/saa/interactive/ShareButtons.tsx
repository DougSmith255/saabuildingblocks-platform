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
 * - 3D Metal plate backing (matches Master Controller style)
 * - Hover effects with accent green (#00ff88)
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

  return (
    <>
      {/* Share button styles - 3D metal plate with green hover */}
      <style jsx global>{`
        .share-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.625rem 1.25rem;
          border-radius: 0.5rem;
          font-family: var(--font-taskor, sans-serif);
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: all 0.2s ease;
          /* 3D Metal plate styling */
          background: linear-gradient(135deg, rgba(100,100,100,0.4) 0%, rgba(50,50,50,0.6) 100%);
          background-color: #2d2d2d;
          color: #dcdbd5;
          border: 1px solid rgba(150,150,150,0.3);
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.15), 0 2px 8px rgba(0,0,0,0.5);
          cursor: pointer;
        }

        .share-btn:hover {
          color: #00ff88;
          border-color: #00ff88;
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.15), 0 4px 12px rgba(0,255,136,0.3);
        }

        .share-btn svg {
          width: 1rem;
          height: 1rem;
        }

        .share-btn:hover svg {
          color: #00ff88;
        }
      `}</style>

      <div className={`
        ${showDivider ? 'mt-12 pt-8 border-t' : ''}
        ${className}
      `}
      style={showDivider ? { borderColor: '#333331' } : undefined}
      >
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
            className="share-btn"
            aria-label="Share on Twitter"
          >
            <Twitter />
            <span className="hidden sm:inline">Twitter</span>
          </button>

          {/* Facebook */}
          <button
            onClick={handleFacebookShare}
            className="share-btn"
            aria-label="Share on Facebook"
          >
            <Facebook />
            <span className="hidden sm:inline">Facebook</span>
          </button>

          {/* LinkedIn */}
          <button
            onClick={handleLinkedInShare}
            className="share-btn"
            aria-label="Share on LinkedIn"
          >
            <Linkedin />
            <span className="hidden sm:inline">LinkedIn</span>
          </button>

          {/* Email */}
          <button
            onClick={handleEmailShare}
            className="share-btn"
            aria-label="Share via Email"
          >
            <Mail />
            <span className="hidden sm:inline">Email</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="share-btn"
            aria-label="Copy link to clipboard"
          >
            {copied ? (
              <>
                <Check style={{ color: '#00ff88' }} />
                <span className="hidden sm:inline" style={{ color: '#00ff88' }}>Copied!</span>
              </>
            ) : (
              <>
                <Link2 />
                <span className="hidden sm:inline">Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default ShareButtons;
