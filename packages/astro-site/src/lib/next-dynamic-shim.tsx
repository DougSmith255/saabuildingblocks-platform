/**
 * next/dynamic shim for Astro
 *
 * Handles two modes:
 * - ssr: false  → Client-only: renders null during SSR AND initial hydration,
 *                 then loads the component via useEffect after mount.
 *                 This prevents hydration mismatches where Vite SSR resolves
 *                 imports synchronously but the client resolves them async.
 * - ssr: true   → Standard React.lazy() + Suspense for code-split SSR.
 */
import React, { Suspense, lazy, useState, useEffect } from 'react';

interface DynamicOptions {
  ssr?: boolean;
  loading?: () => React.ReactNode;
}

export default function dynamic<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T } | T>,
  options?: DynamicOptions
): React.ComponentType<React.ComponentProps<T>> {
  // ssr: false → client-only component (matches Next.js behavior)
  if (options?.ssr === false) {
    const ClientOnly = (props: React.ComponentProps<T>) => {
      const [Comp, setComp] = useState<React.ComponentType<any> | null>(null);

      useEffect(() => {
        let cancelled = false;
        importFn().then((mod) => {
          if (cancelled) return;
          const resolved = 'default' in mod ? (mod as any).default : mod;
          // Use functional updater so React stores the component function, not its return value
          setComp(() => resolved);
        });
        return () => { cancelled = true; };
      }, []);

      if (!Comp) {
        return options?.loading ? <>{options.loading()}</> : null;
      }
      return <Comp {...props} />;
    };

    ClientOnly.displayName = `Dynamic(ClientOnly:${importFn.name || 'Component'})`;
    return ClientOnly;
  }

  // ssr: true (default) → React.lazy + Suspense for code splitting
  const LazyComponent = lazy(async () => {
    const mod = await importFn();
    if ('default' in mod) {
      return mod as { default: T };
    }
    return { default: mod as T };
  });

  const DynamicWrapper = (props: React.ComponentProps<T>) => {
    const fallback = options?.loading ? options.loading() : null;
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };

  DynamicWrapper.displayName = `Dynamic(${importFn.name || 'Component'})`;
  return DynamicWrapper;
}
