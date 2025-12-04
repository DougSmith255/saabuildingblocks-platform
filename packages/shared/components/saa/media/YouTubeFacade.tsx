'use client';

import React, { useState, useCallback } from 'react';

export interface YouTubeFacadeProps {
  /** YouTube video ID (11 character string) */
  videoId: string;
  /** Title for accessibility */
  title: string;
  /** Optional className for container */
  className?: string;
}

/**
 * YouTubeFacade - Lazy-loading YouTube embed with thumbnail facade
 *
 * MASTER CONTROLLER COMPONENT
 * Location: @saa/shared/components/saa/media/YouTubeFacade
 *
 * This component displays a YouTube thumbnail with a play button overlay.
 * The actual iframe is ONLY loaded when the user clicks to play.
 * This dramatically improves page load performance (~1MB+ saved per video).
 *
 * Features:
 * - Shows high-quality YouTube thumbnail (maxresdefault with fallback)
 * - Custom play button styled to match site theme
 * - Iframe only loads on click
 * - Supports autoplay after click
 * - Accessible with keyboard navigation
 *
 * @example
 * ```tsx
 * <YouTubeFacade
 *   videoId="dQw4w9WgXcQ"
 *   title="Video Title"
 * />
 * ```
 */
export function YouTubeFacade({
  videoId,
  title,
  className = '',
}: YouTubeFacadeProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);

  const handleClick = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsLoaded(true);
    }
  }, []);

  // YouTube thumbnail URLs - try maxresdefault first, fall back to hqdefault
  const thumbnailUrl = thumbnailError
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    : `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

  if (isLoaded) {
    // Render actual iframe with autoplay
    // When nested in CyberFrame, use 100% dimensions to fill parent
    return (
      <div className={`youtube-facade youtube-facade-loaded ${className}`}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="youtube-facade-iframe"
        />
      </div>
    );
  }

  // Render thumbnail facade with play button
  return (
    <>
      <style jsx global>{`
        /* When inside CyberFrame (position: absolute), fill parent */
        /* When standalone, use aspect ratio */
        .youtube-facade {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          background: #0a0a0a;
          cursor: pointer;
          overflow: hidden;
          border-radius: 6px;
        }

        .youtube-facade-thumbnail {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .youtube-facade:hover .youtube-facade-thumbnail {
          transform: scale(1.02);
          filter: brightness(0.8);
        }

        .youtube-facade:focus-visible {
          outline: 2px solid rgba(0, 255, 136, 0.8);
          outline-offset: 2px;
        }

        /* Play button container */
        .youtube-facade-play {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .youtube-facade:hover .youtube-facade-play {
          transform: translate(-50%, -50%) scale(1.1);
          filter: drop-shadow(0 0 20px rgba(0, 255, 136, 0.5));
        }

        /* Custom play button - matches site theme */
        .youtube-facade-play-btn {
          width: 72px;
          height: 72px;
          background: rgba(0, 0, 0, 0.7);
          border: 2px solid rgba(0, 255, 136, 0.6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 4px 20px rgba(0, 0, 0, 0.5),
            0 0 30px rgba(0, 255, 136, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .youtube-facade:hover .youtube-facade-play-btn {
          background: rgba(0, 255, 136, 0.15);
          border-color: rgba(0, 255, 136, 0.9);
          box-shadow:
            0 4px 30px rgba(0, 0, 0, 0.6),
            0 0 40px rgba(0, 255, 136, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        /* Play triangle */
        .youtube-facade-play-icon {
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 14px 0 14px 24px;
          border-color: transparent transparent transparent rgba(0, 255, 136, 0.9);
          margin-left: 4px; /* Visual centering */
          transition: border-color 0.3s ease;
        }

        .youtube-facade:hover .youtube-facade-play-icon {
          border-left-color: #00ff88;
        }

        /* Loaded state - iframe fills container */
        .youtube-facade-loaded {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          background: #0a0a0a;
        }

        .youtube-facade-iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 6px;
        }

        /* Gradient overlay at bottom for better contrast */
        .youtube-facade-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 40%;
          background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%);
          pointer-events: none;
        }

        /* Video title tooltip on hover */
        .youtube-facade-title {
          position: absolute;
          bottom: 16px;
          left: 16px;
          right: 16px;
          color: white;
          font-size: 14px;
          font-weight: 500;
          text-shadow: 0 1px 3px rgba(0,0,0,0.8);
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.3s ease, transform 0.3s ease;
          pointer-events: none;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .youtube-facade:hover .youtube-facade-title {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <div
        className={`youtube-facade ${className}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`Play video: ${title}`}
      >
        {/* Thumbnail */}
        <img
          src={thumbnailUrl}
          alt=""
          className="youtube-facade-thumbnail"
          loading="lazy"
          onError={() => setThumbnailError(true)}
        />

        {/* Gradient overlay */}
        <div className="youtube-facade-overlay" />

        {/* Play button */}
        <div className="youtube-facade-play">
          <div className="youtube-facade-play-btn">
            <div className="youtube-facade-play-icon" />
          </div>
        </div>

        {/* Title on hover */}
        <div className="youtube-facade-title">{title}</div>
      </div>
    </>
  );
}

export default YouTubeFacade;
