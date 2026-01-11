const fs = require('fs');

// Read the live HTML
let html = fs.readFileSync('/tmp/live-template.html', 'utf-8');

// Replacements: [literal string, template variable]
// Order matters - more specific replacements first
const replacements = [
  // Meta and title
  [`Join Doug's Team | Smart Agent Alliance`, '${escapeHTML(title)}'],
  [`Join Doug Smart's team at eXp Realty through Smart Agent Alliance. Access elite systems, proven training, and real community support.`, 'Join ${escapeHTML(displayName)}\'s team at eXp Realty through Smart Agent Alliance. Access elite systems, proven training, and real community support.'],
  [`Join Doug Smart's team at eXp Realty`, 'Join ${escapeHTML(displayName)}\'s team at eXp Realty'],

  // Profile image for the agent (not Doug's founder image)
  ['https://assets.saabuildingblocks.com/profiles/agent-page-ca31fc7a-0f1c-4bff-b918-025ef940be4e.png', '${escapeHTML(agentImageUrl)}'],

  // Instructions modal - sponsor info
  ['Enter <strong>doug.smart@expreferral.com</strong> and click Search. Select <strong>Doug Smart</strong> as your sponsor.',
   'Enter <strong>${escapeHTML(agentExpEmail)}</strong> and click Search. Select <strong>${escapeHTML(agentFullLegalName)}</strong> as your sponsor.'],

  // Site URL
  ['https://saabuildingblocks.pages.dev', '${siteUrl}'],
];

// Column 1 in "Your Support Network" - this is the dynamic agent
// We need to target just the first column's name, not Doug or Karrie columns
// The agent column has "SAA Team Member" as title
const agentColumnReplacements = [
  // Agent's name in column 1 (has gold border)
  [/<h3 class="founder-name">Doug Smart<\/h3>\s*<p class="founder-title">SAA Team Member<\/p>/g,
   '<h3 class="founder-name">${escapeHTML(displayName)}</h3>\n                  <p class="founder-title">SAA Team Member</p>'],
];

// Apply string replacements
replacements.forEach(([from, to]) => {
  const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const count = (html.match(new RegExp(escaped, 'g')) || []).length;
  if (count > 0) {
    console.log(`Replacing "${from.substring(0, 60)}..." (${count} occurrences)`);
  }
  html = html.split(from).join(to);
});

// Apply regex replacements
agentColumnReplacements.forEach(([regex, replacement]) => {
  const matches = html.match(regex);
  if (matches) {
    console.log(`Regex replacing (${matches.length} occurrences)`);
    html = html.replace(regex, replacement);
  }
});

// Now we need to find all places where the AGENT's name/image should be dynamic
// but NOT the founder sections (Doug and Karrie columns)

// Check remaining references
console.log('\n=== Remaining checks ===');

// Doug references that should stay (founder section)
const dougRefs = (html.match(/Doug/g) || []).length;
console.log(`"Doug" references remaining: ${dougRefs} (should be ~4 for founder section)`);

// Check for the agent email
const emailRefs = (html.match(/doug\.smart@expreferral\.com/g) || []).length;
console.log(`Email references remaining: ${emailRefs} (should be 0)`);

// Check for agent profile images
const profileRefs = (html.match(/assets\.saabuildingblocks\.com\/profiles/g) || []).length;
console.log(`Profile asset URLs remaining: ${profileRefs} (should be 0)`);

// Write the converted template
fs.writeFileSync('/tmp/converted-template-v2.html', html);
console.log(`\nConverted template saved to /tmp/converted-template-v2.html`);
console.log(`Template length: ${html.length} characters`);
