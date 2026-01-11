const fs = require('fs');

// Read the correct HTML template
let html = fs.readFileSync('/var/www/html/screenshots/!DOCTYPE htmlhtml lang=enhead.txt', 'utf8');

// === STEP 1: Escape for JS template literal ===
html = html
  .replace(/\\/g, '\\\\')
  .replace(/`/g, '\\`')
  .replace(/\$/g, '\\$');

// === STEP 2: Replace meta tags (lines 4-12) ===
// Title
html = html.replace(
  /<title>Join Doug&#039;s Team \| Smart Agent Alliance<\/title>/g,
  '<title>${escapeHTML(title)}</title>'
);

// Meta description
html = html.replace(
  /content="Join Doug Smart's team at eXp Realty through Smart Agent Alliance\. Access elite systems, proven training, and real community support\."/g,
  `content="Join \${escapeHTML(displayName)}'s team at eXp Realty through Smart Agent Alliance. Access elite systems, proven training, and real community support."`
);

// OG title
html = html.replace(
  /content="Join Doug&#039;s Team \| Smart Agent Alliance"/g,
  'content="${escapeHTML(title)}"'
);

// OG description
html = html.replace(
  /content="Join Doug Smart's team at eXp Realty"/g,
  `content="Join \${escapeHTML(displayName)}'s team at eXp Realty"`
);

// OG image
html = html.replace(
  /content="https:\/\/assets\.saabuildingblocks\.com\/profiles\/agent-page-ca31fc7a-0f1c-4bff-b918-025ef940be4e\.png"/g,
  'content="${escapeHTML(agentImageUrl)}"'
);

// Twitter title
html = html.replace(
  /<meta name="twitter:title" content="Join Doug&#039;s Team \| Smart Agent Alliance">/g,
  '<meta name="twitter:title" content="${escapeHTML(title)}">'
);

// === STEP 3: Replace hero tagline (line 2259) ===
html = html.replace(
  /Join Doug Smart's Team<span class="tagline-counter-suffix">/g,
  `Join \${escapeHTML(displayName)}'s Team<span class="tagline-counter-suffix">`
);

// === STEP 4: Replace Support Network first card (agent card - lines 2867, 2872) ===
// Agent image in first card
html = html.replace(
  /<img src="https:\/\/assets\.saabuildingblocks\.com\/profiles\/agent-page-ca31fc7a-0f1c-4bff-b918-025ef940be4e\.png" alt="Doug Smart" style="width: 100%; height: 100%; object-fit: cover; background-color: #d8d8da;">/g,
  '<img src="${escapeHTML(agentImageUrl)}" alt="${escapeHTML(displayName)}" style="width: 100%; height: 100%; object-fit: cover; background-color: #d8d8da;">'
);

// Agent name in first card (SAA Team Member) - match with flexible whitespace
html = html.replace(
  /<h3 class="founder-name">Doug Smart<\/h3>[\s\S]*?<p class="founder-title">SAA Team Member<\/p>/g,
  '<h3 class="founder-name">${escapeHTML(displayName)}</h3>\n                  <p class="founder-title">SAA Team Member</p>'
);

// === STEP 5: Replace sponsor instructions (line 3150) ===
html = html.replace(
  /Enter <strong>doug\.smart@expreferral\.com<\/strong> and click Search\. Select <strong>Doug Smart<\/strong> as your sponsor\./g,
  'Enter <strong>${escapeHTML(agentExpEmail)}</strong> and click Search. Select <strong>${escapeHTML(displayName)}</strong> as your sponsor.'
);

// === STEP 6: Replace SPONSOR_NAME JavaScript variable (line 3213) ===
html = html.replace(
  /const SPONSOR_NAME = "Doug Smart";/g,
  'const SPONSOR_NAME = "${escapeJS(displayName)}";'
);

// === STEP 7: Replace hero image (line 2250) ===
html = html.replace(
  /<img src="https:\/\/assets\.saabuildingblocks\.com\/profiles\/agent-page-ca31fc7a-0f1c-4bff-b918-025ef940be4e\.png" alt="" width="900" height="500"/g,
  '<img src="${escapeHTML(agentImageUrl)}" alt="${escapeHTML(displayName)}" width="900" height="500"'
);

console.log('Template processed successfully');
console.log('Length:', html.length);

// Write to a temp file
fs.writeFileSync('/tmp/new-attraction-template.txt', html);
console.log('Written to /tmp/new-attraction-template.txt');

// Verify replacements
const result = fs.readFileSync('/tmp/new-attraction-template.txt', 'utf8');
console.log('\n=== Verification ===');
console.log('escapeHTML(title) count:', (result.match(/escapeHTML\(title\)/g) || []).length);
console.log('escapeHTML(displayName) count:', (result.match(/escapeHTML\(displayName\)/g) || []).length);
console.log('escapeHTML(agentImageUrl) count:', (result.match(/escapeHTML\(agentImageUrl\)/g) || []).length);
console.log('escapeHTML(agentExpEmail) count:', (result.match(/escapeHTML\(agentExpEmail\)/g) || []).length);
console.log('escapeJS(displayName) count:', (result.match(/escapeJS\(displayName\)/g) || []).length);
console.log('Remaining "Doug Smart" count:', (result.match(/Doug Smart/g) || []).length);
console.log('Remaining hardcoded image URL:', (result.match(/ca31fc7a/g) || []).length);
