'use client';

import { useState, useRef, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

/**
 * LazyImage - Deferred image loading with IntersectionObserver
 *
 * Unlike native `loading="lazy"` which is just a browser hint,
 * this component completely defers rendering the image until
 * it's near the viewport. This prevents the browser from even
 * knowing about the image until needed.
 *
 * Features:
 * - True deferred loading (not just a browser hint)
 * - Configurable rootMargin for preloading distance
 * - Smooth fade-in animation when image loads
 * - Placeholder shown until image is ready
 * - Works with both next/image and native img
 *
 * Usage:
 * <LazyImage
 *   src="/image.jpg"
 *   alt="Description"
 *   width={800}
 *   height={600}
 * />
 */

interface LazyImageProps extends Omit<ImageProps, 'loading' | 'placeholder'> {
  /** How far before viewport to start loading (default: 200px) */
  rootMargin?: string;
  /** Custom loading placeholder component */
  loadingPlaceholder?: React.ReactNode;
  /** Fade-in duration in ms (default: 400) */
  fadeDuration?: number;
}

export function LazyImage({
  rootMargin = '200px',
  loadingPlaceholder,
  fadeDuration = 400,
  className = '',
  style,
  ...imageProps
}: LazyImageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold: 0,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin]);

  // Default placeholder - subtle shimmer box
  const defaultPlaceholder = (
    <div
      className="lazy-image-placeholder"
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(30,30,30,1) 0%, rgba(40,40,40,1) 100%)',
        position: 'absolute',
        inset: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)',
          animation: 'lazy-image-shimmer 1.5s infinite',
        }}
      />
      <style jsx>{`
        @keyframes lazy-image-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`lazy-image-container ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Placeholder - always rendered until image loads */}
      {!isLoaded && (loadingPlaceholder || defaultPlaceholder)}

      {/* Image - only rendered when near viewport */}
      {isVisible && (
        <Image
          {...imageProps}
          className={`lazy-image ${isLoaded ? 'lazy-image-loaded' : ''}`}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: `opacity ${fadeDuration}ms ease-out`,
          }}
          onLoad={() => setIsLoaded(true)}
          loading="eager" // We handle lazy loading ourselves
        />
      )}
    </div>
  );
}

/**
 * LazyImg - Same as LazyImage but for native <img> elements
 * Use when you don't need next/image optimization
 */
interface LazyImgProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  rootMargin?: string;
  loadingPlaceholder?: React.ReactNode;
  fadeDuration?: number;
  className?: string;
  style?: React.CSSProperties;
  imgClassName?: string;
  imgStyle?: React.CSSProperties;
}

export function LazyImg({
  src,
  alt,
  width,
  height,
  rootMargin = '200px',
  loadingPlaceholder,
  fadeDuration = 400,
  className = '',
  style,
  imgClassName = '',
  imgStyle,
}: LazyImgProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold: 0,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin]);

  const defaultPlaceholder = (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(30,30,30,1) 0%, rgba(40,40,40,1) 100%)',
        position: 'absolute',
        inset: 0,
      }}
    />
  );

  return (
    <div
      ref={containerRef}
      className={`lazy-img-container ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {!isLoaded && (loadingPlaceholder || defaultPlaceholder)}

      {isVisible && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`${imgClassName} ${isLoaded ? 'lazy-img-loaded' : ''}`}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: `opacity ${fadeDuration}ms ease-out`,
            ...imgStyle,
          }}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
}

export default LazyImage;
