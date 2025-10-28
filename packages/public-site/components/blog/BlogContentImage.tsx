/**
 * BlogContentImage Component
 * Images within blog post content with caption support
 * Handles lazy loading and optional lightbox functionality
 */

'use client';

import Image from 'next/image';
import { useState } from 'react';

export interface BlogContentImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  enableLightbox?: boolean;
  className?: string;
}

/**
 * Simple lightbox overlay component
 */
function Lightbox({
  src,
  alt,
  onClose
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
      onClick={onClose}
      role="dialog"
      aria-label="Image lightbox"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
        aria-label="Close lightbox"
      >
        ×
      </button>

      {/* Image */}
      <div className="relative max-w-7xl max-h-[90vh] w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes="100vw"
          quality={100}
        />
      </div>
    </div>
  );
}

/**
 * BlogContentImage Component
 *
 * Displays images within blog post content with:
 * - Lazy loading for performance
 * - Optional caption support
 * - Optional lightbox on click
 * - Responsive sizing
 * - Proper accessibility
 *
 * @param src - Image source URL
 * @param alt - Alt text for accessibility
 * @param width - Image width (optional, for aspect ratio)
 * @param height - Image height (optional, for aspect ratio)
 * @param caption - Image caption text
 * @param enableLightbox - Enable click to expand lightbox
 * @param className - Additional CSS classes
 */
export default function BlogContentImage({
  src,
  alt,
  width,
  height,
  caption,
  enableLightbox = false,
  className = ''
}: BlogContentImageProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Calculate aspect ratio if width and height provided
  const aspectRatio = width && height ? width / height : undefined;

  // Handle image load error
  const handleError = () => {
    setImageError(true);
  };

  // Handle lightbox open
  const handleClick = () => {
    if (enableLightbox && !imageError) {
      setIsLightboxOpen(true);
    }
  };

  // Handle lightbox close
  const handleClose = () => {
    setIsLightboxOpen(false);
  };

  return (
    <>
      <figure className={`my-8 ${className}`}>
        <div
          className={`relative w-full overflow-hidden bg-gray-900 rounded-lg ${
            enableLightbox && !imageError ? 'cursor-zoom-in' : ''
          }`}
          style={aspectRatio ? { aspectRatio: aspectRatio.toString() } : undefined}
          onClick={handleClick}
        >
          {imageError ? (
            // Error fallback
            <div className="flex items-center justify-center h-full min-h-[300px] text-gray-400">
              <div className="text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p>Image failed to load</p>
              </div>
            </div>
          ) : (
            <Image
              src={src}
              alt={alt}
              fill={!width || !height}
              width={width}
              height={height}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
              loading="lazy"
              onError={handleError}
            />
          )}
        </div>

        {/* Caption */}
        {caption && (
          <figcaption className="mt-3 text-sm text-gray-400 text-center italic">
            {caption}
          </figcaption>
        )}
      </figure>

      {/* Lightbox */}
      {isLightboxOpen && (
        <Lightbox
          src={src}
          alt={alt}
          onClose={handleClose}
        />
      )}
    </>
  );
}
