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
    script: '.next/standalone/saabuildingblocks-platform/packages/admin-dashboard/server.js',
    cwd: '/home/ubuntu/saabuildingblocks-platform/packages/admin-dashboard',
    instances: 2,
    exec_mode: 'cluster',
    wait_ready: true,
    listen_timeout: 10000,
    env: {
      ...envVars,
      PORT: 3002,
      HOSTNAME: '127.0.0.1',
      NODE_ENV: 'production',
    }
  }]
};
