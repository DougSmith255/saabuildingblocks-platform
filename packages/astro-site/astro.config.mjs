import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'fs';

/**
 * Load NEXT_PUBLIC_* env vars from .env file.
 * Public-site components use process.env.NEXT_PUBLIC_* (Next.js convention).
 * Vite doesn't replace these automatically, so we define them explicitly.
 */
function loadPublicEnv() {
  const defs = {};
  try {
    const envContent = readFileSync(new URL('.env', import.meta.url), 'utf-8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx);
      const val = trimmed.slice(eqIdx + 1);
      if (key.startsWith('NEXT_PUBLIC_')) {
        defs[`process.env.${key}`] = JSON.stringify(val);
      }
    }
  } catch {}
  return defs;
}

/**
 * Vite plugin to replace utility components with no-ops.
 * These components are now inline <script> tags in BaseLayout.astro,
 * so we don't need them in the React bundle.
 */
function noopUtilityComponents() {
  const targets = ['ExternalLinkHandler', 'ScrollPerformanceOptimizer', 'ViewportHeightLock'];
  return {
    name: 'noop-utility-components',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!importer) return null;
      // Match any import that resolves to one of our target utility components
      for (const target of targets) {
        if (source.includes(target)) {
          return `\0noop-${target}`;
        }
      }
      return null;
    },
    load(id) {
      if (id.startsWith('\0noop-')) {
        return 'export function ExternalLinkHandler(){return null}\nexport function ScrollPerformanceOptimizer(){return null}\nexport function ViewportHeightLock(){return null}\nexport default function Noop(){return null}';
      }
      return null;
    }
  };
}

/**
 * Vite plugin to strip inline <script type="application/ld+json"> from React components.
 * These scripts cause React hydration error #418 when rendered inside the React tree.
 * The schema data is instead generated in Astro's <head> slot.
 */
function stripInlineJsonLd() {
  return {
    name: 'strip-inline-json-ld',
    enforce: 'pre',
    transform(code, id) {
      // Only apply to Breadcrumbs component (the known source of hydration #418)
      if (!id.includes('Breadcrumbs.tsx')) return null;
      if (!code.includes('application/ld+json')) return null;

      // Replace the <script> JSX block with null
      // Matches: <script\n  type="application/ld+json"\n  dangerouslySetInnerHTML={...}\n/>
      const result = code.replace(
        /<script\s+type="application\/ld\+json"\s+dangerouslySetInnerHTML=\{\{[^}]*\}\}\s*\/>/s,
        '{/* BreadcrumbList schema moved to Astro head */}'
      );

      if (result !== code) {
        return { code: result, map: null };
      }
      return null;
    },
  };
}

/**
 * Vite plugin to neutralize styled-jsx syntax for Astro builds.
 * Strips `jsx` and `global` attributes from <style> tags and
 * converts :global(selector) to plain selector (styled-jsx-specific syntax).
 * This lets Header/Footer/StarBackground render their CSS as plain <style> tags.
 */
function styledJsxNeutralize() {
  return {
    name: 'styled-jsx-neutralize',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('.tsx') && !id.includes('.jsx')) return null;
      if (!code.includes('style jsx')) return null;

      let result = code;
      // Convert <style jsx global> and <style jsx> to plain <style>
      result = result.replace(/<style\s+jsx\s+global\s*>/g, '<style>');
      result = result.replace(/<style\s+jsx\s*>/g, '<style>');
      // Strip :global() wrapper from selectors inside template literals
      result = result.replace(/:global\(([^)]+)\)/g, '$1');

      if (result !== code) {
        return { code: result, map: null };
      }
      return null;
    },
  };
}

export default defineConfig({
  site: 'https://smartagentalliance.com',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [
    react(),
    sitemap(),
  ],
  vite: {
    plugins: [noopUtilityComponents(), stripInlineJsonLd(), styledJsxNeutralize(), tailwindcss()],
    define: loadPublicEnv(),
    server: {
      allowedHosts: ['dev.saabuildingblocks.com'],
    },
    resolve: {
      alias: {
        // @/ in public-site components resolves to public-site root
        // (public-site uses @/ as its own root alias via tsconfig paths)
        '@/': new URL('../public-site/', import.meta.url).pathname,
        '@saa/shared/': new URL('../shared/', import.meta.url).pathname,
        '@public-site/': new URL('../public-site/', import.meta.url).pathname,
        'next/link': new URL('./src/lib/next-link-shim.tsx', import.meta.url).pathname,
        'next/dynamic': new URL('./src/lib/next-dynamic-shim.tsx', import.meta.url).pathname,
        'next/navigation': new URL('./src/lib/next-navigation-shim.ts', import.meta.url).pathname,
        'next/image': new URL('./src/lib/next-image-shim.tsx', import.meta.url).pathname,
      },
    },
  },
  prefetch: {
    defaultStrategy: 'hover',
    prefetchAll: false,
  },
});
