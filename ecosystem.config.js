module.exports = {
  apps: [
    {
      name: 'nextjs-saa',
      script: 'npx',
      args: 'serve@latest out -l 3001',
      cwd: '/home/claude-flow/packages/public-site',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      env_file: '/home/claude-flow/packages/public-site/.env.local',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        HOSTNAME: '127.0.0.1'
      },
      error_file: '/home/claude-flow/.pm2/logs/nextjs-saa-error.log',
      out_file: '/home/claude-flow/.pm2/logs/nextjs-saa-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // Post-deployment hook to run tests with notifications
      post_deploy: '/home/claude-flow/scripts/run-e2e-tests-with-notify.sh --env production',

      // Health monitoring
      min_uptime: '10s',
      max_restarts: 10,

      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 10000,
      shutdown_with_message: true
    },
    {
      name: 'admin-dashboard',
      script: 'npm',
      args: 'start',
      cwd: '/home/claude-flow/packages/admin-dashboard',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      env_file: '/home/claude-flow/packages/admin-dashboard/.env.local',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
        HOSTNAME: '127.0.0.1'
      },
      error_file: '/home/claude-flow/.pm2/logs/admin-dashboard-error.log',
      out_file: '/home/claude-flow/.pm2/logs/admin-dashboard-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // Health monitoring
      min_uptime: '10s',
      max_restarts: 10,

      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 10000,
      shutdown_with_message: true
    }
  ],

  deploy: {
    production: {
      user: 'claude-flow',
      host: 'localhost',
      ref: 'origin/main',
      repo: 'git@github.com:saabuildingblocks/saabuildingblocks.git',
      path: '/home/claude-flow',
      'pre-deploy-local': '',
      'post-deploy': 'cd packages/admin-dashboard && npm ci && npm run build && pm2 reload ecosystem.config.js --env production && /home/claude-flow/scripts/run-e2e-tests-with-notify.sh --env production',
      'pre-setup': ''
    }
  }
};
