'use client';

import dynamic from 'next/dynamic';

// Lazy load H1 glow controller - runs after page load, zero impact on LCP/FCP
const H1GlowController = dynamic(() => import('./H1GlowController'), {
  ssr: false, // Client-only, no server rendering needed
});

/**
 * Wrapper component that allows dynamic import with ssr:false
 * in a client component context (required by Next.js 16)
 */
export default function H1GlowWrapper() {
  return <H1GlowController />;
}
