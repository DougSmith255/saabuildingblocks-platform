const fs = require('fs');

// Read the processed template
const template = fs.readFileSync('/tmp/new-attraction-template.txt', 'utf8');

// Build the complete function
const functionCode = `
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

  return \`${template}\`;
}
`;

fs.writeFileSync('/tmp/new-generateAttractionPageHTML.js', functionCode);
console.log('Function written to /tmp/new-generateAttractionPageHTML.js');
console.log('Function length:', functionCode.length);
