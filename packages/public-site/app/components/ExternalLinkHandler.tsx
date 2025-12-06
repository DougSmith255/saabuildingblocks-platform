'use client';

import { useEffect } from 'react';

/**
 * ExternalLinkHandler - Global component that makes external links open in new tabs
 *
 * This component adds target="_blank" and rel="noopener noreferrer" to all external links
 * on the page. It runs once on mount and uses a MutationObserver to handle dynamically
 * added content.
 *
 * External links are defined as:
 * - Links with href starting with http:// or https://
 * - Links that don't point to the current domain
 *
 * Internal links (same domain, relative paths) are not affected.
 */
export function ExternalLinkHandler() {
  useEffect(() => {
    const currentHost = window.location.host;

    /**
     * Process a single link element
     */
    function processLink(link: HTMLAnchorElement) {
      const href = link.getAttribute('href');
      if (!href) return;

      // Skip if already has target="_blank"
      if (link.getAttribute('target') === '_blank') return;

      // Check if it's an external link
      const isExternal = href.startsWith('http://') || href.startsWith('https://');
      if (!isExternal) return;

      // Check if it's the same domain
      try {
        const url = new URL(href);
        if (url.host === currentHost) return; // Same domain, skip
      } catch {
        return; // Invalid URL, skip
      }

      // Add target="_blank" and security attributes
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }

    /**
     * Process all links in the document
     */
    function processAllLinks() {
      const links = document.querySelectorAll('a[href]');
      links.forEach((link) => processLink(link as HTMLAnchorElement));
    }

    // Process existing links
    processAllLinks();

    // Watch for dynamically added links
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            // Check if the node itself is a link
            if (element.tagName === 'A') {
              processLink(element as HTMLAnchorElement);
            }
            // Check for links within the added node
            const links = element.querySelectorAll('a[href]');
            links.forEach((link) => processLink(link as HTMLAnchorElement));
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}

export default ExternalLinkHandler;
