const fs = require('fs');

// Read the live HTML
let html = fs.readFileSync('/tmp/live-template.html', 'utf-8');

// Doug's specific values from the live page that need to become template variables
const dougData = {
  firstName: 'Doug',
  lastName: 'Smart',
  fullName: 'Doug Smart',
  profileImage: 'https://assets.saabuildingblocks.com/profiles/agent-page-ca31fc7a-0f1c-4bff-b918-025ef940be4e.png',
  expEmail: 'doug.smart@expreferral.com',
  fullLegalName: 'Sheldon Douglas Smart',
  // Add more as we find them
};

// Replacements: [literal string, template variable]
// Order matters - more specific replacements first
const replacements = [
  // Meta and title - full strings first
  [`Join Doug's Team | Smart Agent Alliance`, '${escapeHTML(title)}'],
  [`Join Doug Smart's team at eXp Realty through Smart Agent Alliance. Access elite systems, proven training, and real community support.`, 'Join ${escapeHTML(displayName)}\'s team at eXp Realty through Smart Agent Alliance. Access elite systems, proven training, and real community support.'],
  [`Join Doug Smart's team at eXp Realty`, 'Join ${escapeHTML(displayName)}\'s team at eXp Realty'],

  // Profile image
  [dougData.profileImage, '${escapeHTML(agentImageUrl)}'],

  // Full legal name (in form/instructions)
  ['Sheldon Douglas Smart', '${escapeHTML(agentFullLegalName)}'],

  // Email
  ['doug.smart@expreferral.com', '${escapeHTML(agentExpEmail)}'],

  // Full name displays
  [`Doug Smart`, '${escapeHTML(displayName)}'],

  // First name only displays (careful - must come after full name)
  [`Join Doug's Team`, 'Join ${escapeHTML(firstName)}\'s Team'],
  [`Doug's`, '${escapeHTML(firstName)}\'s'],

  // Site URL (keep flexible)
  ['https://saabuildingblocks.pages.dev', '${siteUrl}'],
];

// Apply replacements
replacements.forEach(([from, to]) => {
  const count = (html.match(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  if (count > 0) {
    console.log(`Replacing "${from.substring(0, 50)}..." (${count} occurrences)`);
  }
  html = html.split(from).join(to);
});

// Check for any remaining Doug references we might have missed
const dougMatches = html.match(/Doug/g);
console.log(`\nRemaining "Doug" references: ${dougMatches ? dougMatches.length : 0}`);

// Check for remaining hardcoded URLs
const assetMatches = html.match(/assets\.saabuildingblocks\.com\/profiles/g);
console.log(`Remaining profile asset URLs: ${assetMatches ? assetMatches.length : 0}`);

// Write out the converted template for inspection
fs.writeFileSync('/tmp/converted-template.html', html);
console.log(`\nConverted template saved to /tmp/converted-template.html`);
console.log(`Template length: ${html.length} characters`);
