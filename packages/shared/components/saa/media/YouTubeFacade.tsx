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
 * yellow/gold glow matching SAA brand, dark cinematic overlay.
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

  // Brand yellow with varying opacity
  const y = (a: number) => `rgba(255,215,0,${a})`;

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
          filter: isHovered ? 'brightness(0.55)' : 'brightness(0.35)',
        }}
      />

      {/* Dark gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.5) 100%)`,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Subtle vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none',
          zIndex: 2,
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
          filter: `drop-shadow(0 0 ${isHovered ? '24px' : '14px'} ${y(isHovered ? 0.5 : 0.25)})`,
          transition: 'filter 0.3s ease',
        }}
      >
        <svg
          viewBox="0 0 120 120"
          style={{
            width: '110px',
            height: '110px',
            transition: 'transform 0.3s ease',
            transform: isHovered ? 'scale(1.08)' : 'scale(1)',
          }}
        >
          {/* Outer ring - dashed, rotating clockwise */}
          <circle
            cx="60" cy="60" r="56"
            fill="none"
            stroke={y(isHovered ? 0.5 : 0.35)}
            strokeWidth="1.5"
            strokeDasharray="8 12"
            style={{
              animation: 'ytFacadeSpin 8s linear infinite',
              transformOrigin: 'center',
              transition: 'stroke 0.3s ease',
            }}
          />

          {/* Middle ring - solid with tick marks */}
          <circle
            cx="60" cy="60" r="48"
            fill="none"
            stroke={y(isHovered ? 0.6 : 0.3)}
            strokeWidth="1.5"
            style={{ transition: 'stroke 0.3s ease' }}
          />
          {/* Tick marks at cardinal points */}
          <line x1="60" y1="8" x2="60" y2="16" stroke={y(0.5)} strokeWidth="1.5" />
          <line x1="60" y1="104" x2="60" y2="112" stroke={y(0.5)} strokeWidth="1.5" />
          <line x1="8" y1="60" x2="16" y2="60" stroke={y(0.5)} strokeWidth="1.5" />
          <line x1="104" y1="60" x2="112" y2="60" stroke={y(0.5)} strokeWidth="1.5" />
          {/* Diagonal ticks */}
          <line x1="22" y1="22" x2="27" y2="27" stroke={y(0.3)} strokeWidth="1" />
          <line x1="93" y1="22" x2="98" y2="27" stroke={y(0.3)} strokeWidth="1" />
          <line x1="22" y1="93" x2="27" y2="98" stroke={y(0.3)} strokeWidth="1" />
          <line x1="93" y1="93" x2="98" y2="98" stroke={y(0.3)} strokeWidth="1" />

          {/* Inner ring - segmented, counter-rotating */}
          <circle
            cx="60" cy="60" r="40"
            fill="none"
            stroke={y(isHovered ? 0.55 : 0.25)}
            strokeWidth="2"
            strokeDasharray="18 8 6 8"
            style={{
              animation: 'ytFacadeSpinReverse 6s linear infinite',
              transformOrigin: 'center',
              transition: 'stroke 0.3s ease',
            }}
          />

          {/* Core circle */}
          <circle
            cx="60" cy="60" r="32"
            fill={y(isHovered ? 0.1 : 0.04)}
            stroke={y(isHovered ? 0.35 : 0.15)}
            strokeWidth="1"
            style={{ transition: 'fill 0.3s ease, stroke 0.3s ease' }}
          />

          {/* Play triangle - fills on hover */}
          <polygon
            points="50,40 50,80 82,60"
            fill={y(isHovered ? 0.85 : 0.6)}
            stroke={y(isHovered ? 1 : 0.7)}
            strokeWidth="2"
            strokeLinejoin="round"
            style={{ transition: 'fill 0.3s ease, stroke 0.3s ease' }}
          />
        </svg>
      </div>

      {/* "WATCH" label */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: y(isHovered ? 0.9 : 0.5),
          fontSize: '11px',
          letterSpacing: '0.3em',
          fontFamily: 'var(--font-taskor, monospace)',
          textTransform: 'uppercase',
          transition: 'color 0.3s ease',
          pointerEvents: 'none',
          zIndex: 10,
          textShadow: `0 0 8px ${y(0.3)}`,
        }}
      >
        {isHovered ? '[ WATCH ]' : 'WATCH'}
      </div>

      {/* Top-right duration hint */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: y(0.6),
          fontSize: '10px',
          letterSpacing: '0.15em',
          fontFamily: 'var(--font-taskor, monospace)',
          textTransform: 'uppercase',
          pointerEvents: 'none',
          zIndex: 10,
          opacity: isHovered ? 1 : 0.6,
          transition: 'opacity 0.3s ease',
        }}
      >
        <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polygon points="5,3 5,13 13,8" />
        </svg>
        VIDEO
      </div>

      {/* Focus ring */}
      <style jsx>{`
        div:focus-visible {
          outline: 2px solid ${y(0.6)};
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
