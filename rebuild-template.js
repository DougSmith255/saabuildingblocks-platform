const fs = require('fs');

// Read the live HTML from doug-smart page
let html = fs.readFileSync('/tmp/correct-deployment/doug-smart.html', 'utf-8');

// Doug's specific data that needs to be replaced with template variables
const replacements = [
  // Title and meta
  ["Join Doug's Team | Smart Agent Alliance", "${agent.first_name ? `Join ${escapeHTML(agent.first_name)}'s Team` : 'Join Our Team'} | Smart Agent Alliance"],
  ["Join Doug Smart's team at eXp Realty through Smart Agent Alliance. Access elite systems, proven training, and real community support.", "${agent.first_name ? `Join ${escapeHTML(agent.first_name)} ${escapeHTML(agent.last_name || '')}'s team at eXp Realty through Smart Agent Alliance.` : 'Join our team at eXp Realty through Smart Agent Alliance.'} Access elite systems, proven training, and real community support."],
  ["Join Doug Smart's team at eXp Realty", "${agent.first_name ? `Join ${escapeHTML(agent.first_name)}'s team at eXp Realty` : 'Join our team at eXp Realty'}"],

  // Profile image
  ["https://assets.saabuildingblocks.com/profiles/agent-page-ca31fc7a-0f1c-4bff-b918-025ef940be4e.png", "${agent.profile_image_url || 'https://assets.saabuildingblocks.com/profiles/default-agent.png'}"],

  // Agent name displays
  ["Doug Smart", "${escapeHTML(agent.first_name || '')} ${escapeHTML(agent.last_name || '')}"],
  ["Doug", "${escapeHTML(agent.first_name || '')}"],

  // Social links - these need careful handling
];

// Apply simple string replacements first
replacements.forEach(([from, to]) => {
  html = html.split(from).join(to);
});

// Output info about the HTML
console.log('HTML length:', html.length);
console.log('Sample of converted HTML (first 2000 chars):');
console.log(html.substring(0, 2000));
