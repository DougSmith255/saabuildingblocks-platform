/**
 * Shim for next/navigation - replaces Next.js navigation hooks with browser APIs.
 */

export function useSearchParams(): URLSearchParams {
  if (typeof window === 'undefined') return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}

export function usePathname(): string {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname;
}

export function useRouter() {
  return {
    push: (url: string) => { window.location.href = url; },
    replace: (url: string) => { window.location.replace(url); },
    back: () => { window.history.back(); },
    forward: () => { window.history.forward(); },
    refresh: () => { window.location.reload(); },
    prefetch: () => {},
  };
}

export function useParams(): Record<string, string> {
  return {};
}
