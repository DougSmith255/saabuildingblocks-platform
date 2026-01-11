const fs = require('fs');

// Read the current [slug].js
const currentSlug = fs.readFileSync('/home/claude-flow/packages/public-site/functions/[slug].js', 'utf-8');

// Read the converted HTML template
const convertedHtml = fs.readFileSync('/tmp/converted-template-v3.html', 'utf-8');

// Split current file into sections
const lines = currentSlug.split('\n');

// Part 1: Everything before the function (lines 1-447)
const headerEnd = 447;
const header = lines.slice(0, headerEnd).join('\n');

// Part 2: Function signature and variable setup (lines 448-492)
// We need to rebuild this properly
const functionHeader = `
function generateAttractionPageHTML(agent, siteUrl = 'https://smartagentalliance.com', escapeHTML, escapeJS) {
  const isActive = agent.activated ?? agent.is_active ?? false;
  if (!isActive) return null;

  // Agent data extraction
  const fullName = \`\${agent.display_first_name} \${agent.display_last_name}\`.trim();
  const firstName = agent.display_first_name || 'Agent';
  const displayName = fullName || 'Smart Agent Alliance';
  const title = \`Join \${firstName}'s Team | Smart Agent Alliance\`;
  const analyticsDomain = 'smartagentalliance.com';

  // Agent-specific customization
  const agentImageUrl = agent.profile_image_url || \`\${siteUrl}/images/default-profile.png\`;
  const agentExpEmail = agent.exp_email || 'doug.smart@expreferral.com';
  const agentFullLegalName = agent.full_legal_name || fullName || 'Sheldon Douglas Smart';
  const agentTagline = \`Join \${displayName}'s Team\`;

  // Cloudflare Images CDN
  const CLOUDFLARE_BASE = 'https://imagedelivery.net/RZBQ4dWu2c_YEpklnDDxFg';

  return \``;

// Part 3: The HTML template (converted from live site)
// Need to escape backticks and ${} that aren't template variables
let templateHtml = convertedHtml;

// The HTML already has proper template variables like ${escapeHTML(title)}
// We just need to escape any literal backticks that might exist
templateHtml = templateHtml.replace(/`/g, '\\`');

// Part 4: Close the template and function
const functionFooter = `\`;
}`;

// Part 5: Everything after line 4440 (the links page function and handler)
const footerStart = 4440;
const footer = lines.slice(footerStart).join('\n');

// Assemble the final file
const finalContent = header + '\n' + functionHeader + templateHtml + functionFooter + '\n' + footer;

// Write to a new file first for review
fs.writeFileSync('/tmp/new-slug.js', finalContent);
console.log('New [slug].js assembled');
console.log('Total size:', finalContent.length);
console.log('Header size:', header.length);
console.log('Function header:', functionHeader.length);
console.log('Template HTML:', templateHtml.length);
console.log('Footer size:', footer.length);

// Verify the file is valid JavaScript by attempting to parse it
try {
  new Function(finalContent);
  console.log('✓ JavaScript syntax is valid');
} catch (e) {
  console.log('✗ JavaScript syntax error:', e.message);
}
