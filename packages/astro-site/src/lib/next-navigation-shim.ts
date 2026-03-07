/**
 * next/navigation shim for Astro
 * Provides basic implementations of Next.js navigation hooks.
 *
 * usePathname uses useState + useEffect to avoid SSR/client hydration mismatch:
 * - SSR returns '/' (window undefined)
 * - Initial client render returns '/' (matches SSR for clean hydration)
 * - After hydration, useEffect updates to the real pathname
 */
import { useState, useEffect } from 'react';

export function usePathname(): string {
  const [pathname, setPathname] = useState('/');
  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);
  return pathname;
}

export function useSearchParams() {
  const [params, setParams] = useState(() => new URLSearchParams());
  useEffect(() => {
    setParams(new URLSearchParams(window.location.search));
  }, []);
  return params;
}

export function useRouter() {
  return {
    push: (url: string) => {
      if (typeof window !== 'undefined') window.location.href = url;
    },
    replace: (url: string) => {
      if (typeof window !== 'undefined') window.location.replace(url);
    },
    back: () => {
      if (typeof window !== 'undefined') window.history.back();
    },
    forward: () => {
      if (typeof window !== 'undefined') window.history.forward();
    },
    refresh: () => {
      if (typeof window !== 'undefined') window.location.reload();
    },
    prefetch: () => {},
  };
}

export function useParams() {
  const [params, setParams] = useState<Record<string, string>>({});
  useEffect(() => {
    const path = window.location.pathname;
    setParams({ slug: path.split('/').filter(Boolean).pop() || '' });
  }, []);
  return params;
}

export function redirect(url: string) {
  if (typeof window !== 'undefined') {
    window.location.href = url;
  }
}

export function notFound() {
  if (typeof window !== 'undefined') {
    window.location.href = '/404';
  }
}
