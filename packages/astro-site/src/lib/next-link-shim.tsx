/**
 * next/link shim for Astro
 * Replaces Next.js Link with a plain <a> tag.
 */
import React from 'react';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  prefetch?: boolean;
  scroll?: boolean;
  replace?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  legacyBehavior?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, prefetch, scroll, replace, shallow, passHref, legacyBehavior, ...rest }, ref) => {
    return (
      <a ref={ref} href={href} {...rest}>
        {children}
      </a>
    );
  }
);

Link.displayName = 'Link';

export default Link;
