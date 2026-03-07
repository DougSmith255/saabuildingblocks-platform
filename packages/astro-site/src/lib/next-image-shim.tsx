/**
 * next/image shim for Astro
 * Replaces Next.js Image with a plain <img> tag.
 * Handles the `fill` prop by converting to absolute positioning.
 */
import React from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  placeholder?: string;
  blurDataURL?: string;
  unoptimized?: boolean;
  sizes?: string;
  loader?: any;
  onLoadingComplete?: any;
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ src, alt, fill, priority, quality, placeholder, blurDataURL, unoptimized, loader, onLoadingComplete, style, ...rest }, ref) => {
    const imgStyle: React.CSSProperties = fill
      ? {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: (style?.objectFit as any) || 'cover',
          ...style,
        }
      : { ...style };

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        style={imgStyle}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        {...rest}
      />
    );
  }
);

Image.displayName = 'Image';

export default Image;
