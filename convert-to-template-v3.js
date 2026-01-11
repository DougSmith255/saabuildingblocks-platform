const fs = require('fs');

// Read the live HTML
let html = fs.readFileSync('/tmp/live-template.html', 'utf-8');

// Replacements: [literal string, template variable]
const replacements = [
  // Meta and title
  [`Join Doug's Team | Smart Agent Alliance`, '${escapeHTML(title)}'],
  [`Join Doug Smart's team at eXp Realty through Smart Agent Alliance. Access elite systems, proven training, and real community support.`, 'Join ${escapeHTML(displayName)}\'s team at eXp Realty through Smart Agent Alliance. Access elite systems, proven training, and real community support.'],
  [`Join Doug Smart's team at eXp Realty`, 'Join ${escapeHTML(displayName)}\'s team at eXp Realty'],

  // Tagline with counter - the span has "Join Doug Smart's Team"
  [`Join Doug Smart's Team<span`, 'Join ${escapeHTML(displayName)}\'s Team<span'],

  // Profile image for the agent
  ['https://assets.saabuildingblocks.com/profiles/agent-page-ca31fc7a-0f1c-4bff-b918-025ef940be4e.png', '${escapeHTML(agentImageUrl)}'],

  // Instructions modal - sponsor info
  ['Enter <strong>doug.smart@expreferral.com</strong> and click Search. Select <strong>Doug Smart</strong> as your sponsor.',
   'Enter <strong>${escapeHTML(agentExpEmail)}</strong> and click Search. Select <strong>${escapeHTML(agentFullLegalName)}</strong> as your sponsor.'],

  // JavaScript sponsor name constant
  ['const SPONSOR_NAME = "Doug Smart";', 'const SPONSOR_NAME = "${escapeJS(displayName)}";'],

  // Agent column in Support Network - alt text (Column 1 uses agentImageUrl)
  ['<img src="${escapeHTML(agentImageUrl)}" alt="Doug Smart"', '<img src="${escapeHTML(agentImageUrl)}" alt="${escapeHTML(displayName)}"'],

  // Site URL
  ['https://saabuildingblocks.pages.dev', '${siteUrl}'],
];

// Column 1 in "Your Support Network" - agent's name
const agentColumnReplacements = [
  // The agent column has "SAA Team Member" as title, and gold border
  [/<h3 class="founder-name">Doug Smart<\/h3>\s*<p class="founder-title">SAA Team Member<\/p>/g,
   '<h3 class="founder-name">${escapeHTML(displayName)}</h3>\n                  <p class="founder-title">SAA Team Member</p>'],
];

// Apply string replacements
replacements.forEach(([from, to]) => {
  const count = html.split(from).length - 1;
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

// Check remaining references
console.log('\n=== Remaining checks ===');
const dougRefs = (html.match(/Doug/g) || []).length;
console.log(`"Doug" references remaining: ${dougRefs} (expected: 4-5 for founder section + comment)`);

// Show what's left
console.log('\n=== Remaining Doug references ===');
html.split('\n').forEach((line, i) => {
  if (line.includes('Doug')) {
    console.log(`Line ${i+1}: ${line.substring(0, 100)}...`);
  }
});

// Write the converted template
fs.writeFileSync('/tmp/converted-template-v3.html', html);
console.log(`\nSaved to /tmp/converted-template-v3.html (${html.length} chars)`);
