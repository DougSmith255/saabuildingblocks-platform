'use client';

import React, { useState, useCallback, useEffect } from 'react';

export interface YouTubeFacadeProps {
  /** YouTube video ID (11 character string) */
  videoId: string;
  /** Title for accessibility */
  title: string;
  /** Optional className for container */
  className?: string;
  /** Fallback image URL when YouTube has no custom thumbnail (e.g. blog featured image) */
  fallbackImage?: string;
}

/**
 * YouTubeFacade - Lazy-loading YouTube embed with TRON-style play button
 *
 * MASTER CONTROLLER COMPONENT
 * Location: @saa/shared/components/saa/media/YouTubeFacade
 *
 * Shows a YouTube thumbnail with a sci-fi concentric ring play button.
 * The actual iframe is ONLY loaded when the user clicks to play.
 *
 * Design: Concentric rotating rings with thin-stroke play triangle,
 * cyan glow, inspired by TRON Legacy UI/HUD elements.
 */
export function YouTubeFacade({
  videoId,
  title,
  className = '',
  fallbackImage,
}: YouTubeFacadeProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [thumbState, setThumbState] = useState<'pending' | 'maxres' | 'sd' | 'fallback' | 'hq'>('pending');
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

  // Determine thumbnail: maxresdefault > sddefault > fallbackImage > hqdefault
  let thumbnailUrl: string;
  switch (thumbState) {
    case 'maxres':
      thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
      break;
    case 'sd':
      thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`;
      break;
    case 'fallback':
      thumbnailUrl = fallbackImage!;
      break;
    default:
      thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      break;
  }

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth > 200) {
        setThumbState('maxres');
      } else {
        const sd = new Image();
        sd.onload = () => setThumbState('sd');
        sd.onerror = () => setThumbState(fallbackImage ? 'fallback' : 'hq');
        sd.src = `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`;
      }
    };
    img.onerror = () => setThumbState(fallbackImage ? 'fallback' : 'hq');
    img.src = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  }, [videoId, fallbackImage]);

  if (isLoaded) {
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
        alt={`Video thumbnail: ${title}`}
        loading="lazy"
        onError={() => setThumbState(fallbackImage ? 'fallback' : 'hq')}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.4s ease, filter 0.4s ease',
          transform: isHovered ? 'scale(1.06)' : 'scale(1.02)',
          filter: isHovered ? 'brightness(0.6)' : 'brightness(0.45)',
        }}
      />

      {/* TRON Play Button */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          filter: `drop-shadow(0 0 ${isHovered ? '20px' : '12px'} rgba(0,212,255,${isHovered ? '0.6' : '0.3'}))`,
          transition: 'filter 0.3s ease',
        }}
      >
        <svg
          viewBox="0 0 120 120"
          style={{
            width: '100px',
            height: '100px',
            transition: 'transform 0.3s ease',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          {/* Outer ring - dashed, rotating clockwise */}
          <circle
            cx="60" cy="60" r="56"
            fill="none"
            stroke="rgba(0,212,255,0.3)"
            strokeWidth="1"
            strokeDasharray="8 12"
            style={{
              animation: 'ytFacadeSpin 8s linear infinite',
              transformOrigin: 'center',
            }}
          />

          {/* Middle ring - solid with tick marks */}
          <circle
            cx="60" cy="60" r="48"
            fill="none"
            stroke={isHovered ? 'rgba(0,212,255,0.6)' : 'rgba(0,212,255,0.25)'}
            strokeWidth="1"
            style={{ transition: 'stroke 0.3s ease' }}
          />
          {/* Tick marks at cardinal points */}
          <line x1="60" y1="8" x2="60" y2="14" stroke="rgba(0,212,255,0.4)" strokeWidth="1" />
          <line x1="60" y1="106" x2="60" y2="112" stroke="rgba(0,212,255,0.4)" strokeWidth="1" />
          <line x1="8" y1="60" x2="14" y2="60" stroke="rgba(0,212,255,0.4)" strokeWidth="1" />
          <line x1="106" y1="60" x2="112" y2="60" stroke="rgba(0,212,255,0.4)" strokeWidth="1" />
          {/* Diagonal ticks */}
          <line x1="23" y1="23" x2="27" y2="27" stroke="rgba(0,212,255,0.2)" strokeWidth="0.75" />
          <line x1="93" y1="23" x2="97" y2="27" stroke="rgba(0,212,255,0.2)" strokeWidth="0.75" />
          <line x1="23" y1="93" x2="27" y2="97" stroke="rgba(0,212,255,0.2)" strokeWidth="0.75" />
          <line x1="93" y1="93" x2="97" y2="97" stroke="rgba(0,212,255,0.2)" strokeWidth="0.75" />

          {/* Inner ring - segmented, counter-rotating */}
          <circle
            cx="60" cy="60" r="40"
            fill="none"
            stroke={isHovered ? 'rgba(0,212,255,0.5)' : 'rgba(0,212,255,0.15)'}
            strokeWidth="1.5"
            strokeDasharray="20 10 5 10"
            style={{
              animation: 'ytFacadeSpinReverse 6s linear infinite',
              transformOrigin: 'center',
              transition: 'stroke 0.3s ease',
            }}
          />

          {/* Core circle - subtle fill */}
          <circle
            cx="60" cy="60" r="32"
            fill={isHovered ? 'rgba(0,212,255,0.08)' : 'rgba(0,212,255,0.03)'}
            stroke={isHovered ? 'rgba(0,212,255,0.3)' : 'rgba(0,212,255,0.1)'}
            strokeWidth="0.5"
            style={{ transition: 'fill 0.3s ease, stroke 0.3s ease' }}
          />

          {/* Play triangle - thin stroke, fills on hover */}
          <polygon
            points="50,40 50,80 82,60"
            fill={isHovered ? 'rgba(0,212,255,0.2)' : 'none'}
            stroke={isHovered ? 'rgba(0,212,255,0.9)' : 'rgba(0,212,255,0.5)'}
            strokeWidth="1.5"
            strokeLinejoin="round"
            style={{ transition: 'fill 0.3s ease, stroke 0.3s ease' }}
          />
        </svg>
      </div>

      {/* "PLAY" label */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: isHovered ? 'rgba(0,212,255,0.8)' : 'rgba(0,212,255,0.4)',
          fontSize: '11px',
          letterSpacing: '0.3em',
          fontFamily: 'var(--font-taskor, monospace)',
          textTransform: 'uppercase',
          transition: 'color 0.3s ease',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        {isHovered ? '[ PLAY ]' : 'PLAY'}
      </div>

      {/* Focus ring for accessibility */}
      <style jsx>{`
        div:focus-visible {
          outline: 2px solid rgba(0, 212, 255, 0.6);
          outline-offset: 2px;
        }
        @keyframes ytFacadeSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes ytFacadeSpinReverse {
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}

export default YouTubeFacade;
