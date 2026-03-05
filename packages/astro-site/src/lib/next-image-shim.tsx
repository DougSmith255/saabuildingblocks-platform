/**
 * Shim for next/image - replaces with plain <img> tag.
 */
import React from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fill?: boolean;
  unoptimized?: boolean;
  priority?: boolean;
  quality?: number;
  placeholder?: string;
  blurDataURL?: string;
  loader?: any;
  sizes?: string;
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(function Image(
  { fill, unoptimized, priority, quality, placeholder, blurDataURL, loader, style, ...rest },
  ref
) {
  const imgStyle: React.CSSProperties = { ...style };
  if (fill) {
    imgStyle.position = 'absolute';
    imgStyle.top = 0;
    imgStyle.left = 0;
    imgStyle.width = '100%';
    imgStyle.height = '100%';
    imgStyle.objectFit = imgStyle.objectFit || 'cover';
  }

  return <img ref={ref} style={imgStyle} loading={priority ? 'eager' : 'lazy'} {...rest} />;
});

Image.displayName = 'Image';
export default Image;
