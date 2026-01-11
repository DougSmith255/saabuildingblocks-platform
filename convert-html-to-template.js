const fs = require('fs');

// Read the live HTML
const html = fs.readFileSync('/tmp/correct-deployment/doug-smart.html', 'utf-8');

// Read the current [slug].js to get the function structure
const currentSlug = fs.readFileSync('/home/claude-flow/packages/public-site/functions/[slug].js', 'utf-8');

// Find where the HTML template starts in the current [slug].js
const templateStartMatch = currentSlug.match(/const html = `<!DOCTYPE html>/);
const templateEndMatch = currentSlug.match(/<\/html>`;\s*return new Response/);

console.log('Template start found:', !!templateStartMatch);
console.log('Template end found:', !!templateEndMatch);

// Get the function wrapper (everything before the HTML template)
const functionHeaderEnd = currentSlug.indexOf('const html = `<!DOCTYPE html>');
const functionFooterStart = currentSlug.lastIndexOf('</html>`;');

console.log('Function header ends at:', functionHeaderEnd);
console.log('Function footer starts at:', functionFooterStart);

if (functionHeaderEnd > 0 && functionFooterStart > 0) {
  const header = currentSlug.substring(0, functionHeaderEnd);
  const footer = currentSlug.substring(functionFooterStart + '</html>`;'.length);

  console.log('\n=== HEADER (last 500 chars) ===');
  console.log(header.substring(header.length - 500));

  console.log('\n=== FOOTER (first 500 chars) ===');
  console.log(footer.substring(0, 500));
}
