// Load environment variables from .env.local
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const envVars = {};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        // Remove quotes if present
        let value = valueParts.join('=').trim();
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        envVars[key.trim()] = value;
      }
    }
  });
}

module.exports = {
  apps: [{
    name: 'nextjs-saa',
    script: 'npm',
    args: 'start',
    cwd: '/home/claude-flow/packages/admin-dashboard',
    env: {
      ...envVars,
      PORT: 3001,
      NODE_ENV: 'production',
      GITHUB_TOKEN: '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',
      GITHUB_OWNER: 'DougSmith255',
      GITHUB_REPO: 'saabuildingblocks-platform'
    }
  }]
};
