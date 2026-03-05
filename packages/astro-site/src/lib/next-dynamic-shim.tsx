/**
 * Shim for next/dynamic - replaces with React.lazy + Suspense.
 */
import React, { lazy, Suspense } from 'react';

interface DynamicOptions {
  ssr?: boolean;
  loading?: () => React.ReactNode;
}

export default function dynamic<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T } | T>,
  options?: DynamicOptions
): React.ComponentType<React.ComponentProps<T>> {
  const LazyComponent = lazy(async () => {
    const mod = await importFn();
    if ('default' in mod) return mod as { default: T };
    return { default: mod as unknown as T };
  });

  const DynamicWrapper = (props: React.ComponentProps<T>) => (
    <Suspense fallback={options?.loading ? options.loading() : null}>
      <LazyComponent {...props} />
    </Suspense>
  );

  DynamicWrapper.displayName = 'Dynamic';
  return DynamicWrapper;
}
