import * as fs from 'fs';
import * as path from 'path';

const chunksDir = path.join(__dirname, '../../public-site/public');
const files = fs.readdirSync(chunksDir).filter(f => f.startsWith('blog-posts-chunk'));

interface Post { slug: string; customUri?: string; title?: string; }

const allPosts: Post[] = [];
for (const file of files) {
  allPosts.push(...JSON.parse(fs.readFileSync(path.join(chunksDir, file), 'utf8')));
}

// Group by category (first part of customUri)
const byCategory: Record<string, Array<{ slug: string; customUri: string; lastSlug: string; title: string }>> = {};
for (const p of allPosts) {
  if (!p.customUri) continue;
  const parts = p.customUri.split('/');
  const category = parts[0];
  const lastSlug = parts.slice(1).join('/');
  if (!byCategory[category]) byCategory[category] = [];
  byCategory[category].push({ slug: p.slug, customUri: p.customUri, lastSlug, title: p.title || '' });
}

console.log('=== Blog Categories ===\n');
for (const [cat, posts] of Object.entries(byCategory).sort()) {
  console.log(`  ${cat} (${posts.length} posts)`);
}

console.log('\n=== marketing-mastery posts ===\n');
const mm = byCategory['marketing-mastery'] || [];
for (const p of mm) {
  console.log(`  /real-estate-agent-job/marketings/${p.lastSlug}  ->  /blog/${p.customUri}`);
}

console.log(`\nTotal marketing-mastery: ${mm.length}`);
