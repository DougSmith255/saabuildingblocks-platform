/**
 * Post-build script: inject <link rel="modulepreload"> hints into HTML files.
 *
 * Astro's island hydration discovers JS modules lazily (via astro-island attributes).
 * This script adds modulepreload hints to <head> so browsers start downloading
 * the React renderer and page-specific island JS early, reducing TBT.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;

async function findHtmlFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findHtmlFiles(full));
    } else if (entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

async function processFile(filePath) {
  let html = await readFile(filePath, 'utf-8');

  // Extract renderer-url and component-url from astro-island elements
  const urls = new Set();
  const rendererMatches = html.matchAll(/renderer-url="([^"]+)"/g);
  for (const m of rendererMatches) urls.add(m[1]);
  const componentMatches = html.matchAll(/component-url="([^"]+)"/g);
  for (const m of componentMatches) urls.add(m[1]);

  if (urls.size === 0) return false;

  // Build modulepreload link tags
  const links = [...urls]
    .map(url => `<link rel="modulepreload" href="${url}">`)
    .join('');

  // Inject after <meta charset="utf-8"> for earliest possible discovery
  const marker = '<meta charset="utf-8">';
  if (html.includes(marker)) {
    html = html.replace(marker, marker + links);
    await writeFile(filePath, html);
    return true;
  }
  return false;
}

const files = await findHtmlFiles(DIST);
let count = 0;
for (const f of files) {
  if (await processFile(f)) count++;
}
console.log(`Injected modulepreload hints into ${count}/${files.length} HTML files`);
