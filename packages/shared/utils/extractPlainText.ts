import React from 'react';

/**
 * Extract plain text content from React children
 *
 * This utility is used for SEO purposes to provide screen readers and search engine
 * bots with readable text when the visual component uses character-by-character
 * rendering (like Taskor font ligature animations).
 *
 * @param children - React children (string, number, ReactNode, array, etc.)
 * @returns Plain text string without React elements
 *
 * @example
 * ```tsx
 * const plainText = extractPlainText("Smart Agent Alliance");
 * // Returns: "Smart Agent Alliance"
 *
 * const plainText = extractPlainText(<span>Hello</span>);
 * // Returns: "Hello"
 * ```
 */
export function extractPlainText(children: React.ReactNode): string {
  // Handle null, undefined, boolean
  if (children == null || typeof children === 'boolean') {
    return '';
  }

  // Handle string
  if (typeof children === 'string') {
    return children;
  }

  // Handle number
  if (typeof children === 'number') {
    return String(children);
  }

  // Handle array of children
  if (Array.isArray(children)) {
    return children.map(extractPlainText).join('');
  }

  // Handle React element
  if (React.isValidElement(children)) {
    // Recursively extract text from element's children
    const props = children.props as { children?: React.ReactNode };
    return extractPlainText(props.children);
  }

  // Fallback for any other type (shouldn't happen in practice)
  return String(children);
}
