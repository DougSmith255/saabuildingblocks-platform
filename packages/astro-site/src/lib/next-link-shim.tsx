/**
 * Shim for next/link - replaces Next.js Link with a plain <a> tag.
 * Astro handles prefetching natively, no router needed.
 */
import React from 'react';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  legacyBehavior?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, prefetch, replace, scroll, shallow, passHref, legacyBehavior, children, ...rest },
  ref
) {
  return (
    <a ref={ref} href={href} {...rest}>
      {children}
    </a>
  );
});

Link.displayName = 'Link';
export default Link;
