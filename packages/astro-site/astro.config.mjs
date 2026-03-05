import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

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
    plugins: [styledJsxNeutralize(), tailwindcss()],
    resolve: {
      alias: {
        '@/': new URL('./src/', import.meta.url).pathname,
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
