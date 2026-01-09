'use client';

import React, { useState, useCallback } from 'react';
import { Play } from 'lucide-react';

export interface YouTubeFacadeProps {
  /** YouTube video ID (11 character string) */
  videoId: string;
  /** Title for accessibility */
  title: string;
  /** Optional className for container */
  className?: string;
}

/**
 * YouTubeFacade - Lazy-loading YouTube embed with 3D metal styling
 *
 * MASTER CONTROLLER COMPONENT
 * Location: @saa/shared/components/saa/media/YouTubeFacade
 *
 * This component displays a YouTube thumbnail with a 3D metal-styled play button.
 * The actual iframe is ONLY loaded when the user clicks to play.
 * This dramatically improves page load performance (~1MB+ saved per video).
 *
 * Features:
 * - Shows high-quality YouTube thumbnail (maxresdefault with fallback)
 * - 3D metal backing plate with dark overlay
 * - Play button uses Icon3D effect with gold styling
 * - Overlay fades out on hover as play button enlarges
 * - Iframe only loads on click with autoplay
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
  const [isHovered, setIsHovered] = useState(false);

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

  // 3D metal effect filter for play button (matches Icon3D)
  const icon3DFilter = `
    drop-shadow(-1px -1px 0 #ffe680)
    drop-shadow(1px 1px 0 #8a7a3d)
    drop-shadow(3px 3px 0 #2a2a1d)
    drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.5))
  `;

  if (isLoaded) {
    // Render actual iframe with autoplay
    return (
      <div
        className={className}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          background: '#0a0a0a',
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '6px',
          }}
        />
      </div>
    );
  }

  // Render thumbnail facade with 3D metal play button
  return (
    <div
      className={className}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Play video: ${title}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        background: '#0a0a0a',
        cursor: 'pointer',
        overflow: 'hidden',
        borderRadius: '6px',
      }}
    >
      {/* Thumbnail */}
      <img
        src={thumbnailUrl}
        alt=""
        loading="lazy"
        onError={() => setThumbnailError(true)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.3s ease',
          transform: isHovered ? 'scale(1.03)' : 'scale(1)',
        }}
      />

      {/* Dark overlay - fades out on hover */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
          opacity: isHovered ? 0 : 1,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        }}
      />

      {/* 3D Metal Play Button Container */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${isHovered ? 1.15 : 1})`,
          transition: 'transform 0.3s ease',
          zIndex: 10,
        }}
      >
        {/* Metal backing plate */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(145deg, #3a3a3a 0%, #1a1a1a 50%, #2a2a2a 100%)',
            border: '2px solid rgba(196, 169, 77, 0.4)',
            boxShadow: `
              0 4px 20px rgba(0, 0, 0, 0.6),
              0 0 30px rgba(196, 169, 77, 0.15),
              inset 0 2px 4px rgba(255, 255, 255, 0.1),
              inset 0 -2px 4px rgba(0, 0, 0, 0.3)
            `,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'perspective(500px) rotateX(8deg)',
          }}
        >
          {/* Play icon with 3D effect */}
          <Play
            style={{
              width: '36px',
              height: '36px',
              color: '#c4a94d',
              filter: icon3DFilter.trim(),
              marginLeft: '4px', // Visual centering for play triangle
              fill: 'currentColor',
            }}
          />
        </div>
      </div>

      {/* Video title on hover */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          color: 'white',
          fontSize: '14px',
          fontWeight: 500,
          textShadow: '0 1px 3px rgba(0,0,0,0.8)',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {title}
      </div>

      {/* Focus ring for accessibility */}
      <style jsx>{`
        div:focus-visible {
          outline: 2px solid rgba(196, 169, 77, 0.8);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}

export default YouTubeFacade;
