const fs = require('fs');

// Read the current [slug].js file
const slugJs = fs.readFileSync('/home/claude-flow/packages/public-site/functions/[slug].js', 'utf8');

// Read the new function
const newFunction = fs.readFileSync('/tmp/new-generateAttractionPageHTML.js', 'utf8');

// Find the start and end of the old function
// Start: Line 437 (the comment block before the function)
// End: Line 4440 (the closing brace)

// Split by lines
const lines = slugJs.split('\n');

// Find start line (the comment block "/**" before "generateAttractionPageHTML")
let startLine = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('generateAttractionPageHTML - Creates the full agent')) {
    // Go back to find the /** comment start
    for (let j = i - 1; j >= 0; j--) {
      if (lines[j].trim() === '/**') {
        startLine = j;
        break;
      }
    }
    break;
  }
}

// Find end line (the } that closes the function, before the next function comment)
let endLine = -1;
for (let i = startLine; i < lines.length; i++) {
  if (lines[i].includes('Generate the Linktree-style Links page')) {
    // The function ends a few lines before this (at the closing brace)
    for (let j = i - 1; j >= 0; j--) {
      if (lines[j].trim() === '}') {
        endLine = j;
        break;
      }
    }
    break;
  }
}

console.log('Found function at lines:', startLine + 1, 'to', endLine + 1);
console.log('Total lines to replace:', endLine - startLine + 1);

// Build the new content
const beforeFunction = lines.slice(0, startLine).join('\n');
const afterFunction = lines.slice(endLine + 1).join('\n');

// Create the new comment block
const newComment = `
/**
 * generateAttractionPageHTML - Creates the full agent attraction page
 *
 * This is a converted version of the React agent-attraction-template component
 * rendered as static HTML with vanilla JavaScript for interactivity.
 *
 * @param agent - Agent data from KV store
 * @param siteUrl - Base URL of the site
 * @param escapeHTML - Function to escape HTML entities
 * @param escapeJS - Function to escape JS strings
 */`;

const newContent = beforeFunction + newComment + '\n' + newFunction + '\n' + afterFunction;

// Write the new file
fs.writeFileSync('/home/claude-flow/packages/public-site/functions/[slug].js', newContent);

console.log('File updated successfully!');
console.log('New file size:', newContent.length);

// Verify with syntax check
const { execSync } = require('child_process');
try {
  execSync('node --check /home/claude-flow/packages/public-site/functions/[slug].js');
  console.log('Syntax check PASSED!');
} catch (e) {
  console.log('Syntax check FAILED!');
  console.log(e.stderr?.toString() || e.message);
}
