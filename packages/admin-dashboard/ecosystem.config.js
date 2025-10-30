module.exports = {
  apps: [{
    name: 'nextjs-saa',
    script: 'npm',
    args: 'start',
    cwd: '/home/claude-flow/packages/admin-dashboard',
    env: {
      PORT: 3001,
      NODE_ENV: 'production'
    },
    env_file: '.env.local'
  }]
};
