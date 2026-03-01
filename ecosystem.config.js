module.exports = {
  apps: [
    {
      name: 'admin-dashboard',
      script: '.next/standalone/saabuildingblocks-platform/packages/admin-dashboard/server.js',
      cwd: '/home/ubuntu/saabuildingblocks-platform/packages/admin-dashboard',
      instances: 2,
      exec_mode: 'cluster',
      wait_ready: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      env_file: '/home/ubuntu/saabuildingblocks-platform/packages/admin-dashboard/.env.local',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
        HOSTNAME: '127.0.0.1'
      },
      error_file: '/home/ubuntu/saabuildingblocks-platform/.pm2/logs/admin-dashboard-error.log',
      out_file: '/home/ubuntu/saabuildingblocks-platform/.pm2/logs/admin-dashboard-out.log',
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
      user: 'ubuntu',
      host: 'localhost',
      ref: 'origin/main',
      repo: 'git@github.com:saabuildingblocks/saabuildingblocks.git',
      path: '/home/ubuntu/saabuildingblocks-platform',
      'pre-deploy-local': '',
      'post-deploy': 'cd packages/admin-dashboard && npm ci && npm run build && pm2 reload nextjs-saa && /home/ubuntu/saabuildingblocks-platform/scripts/run-e2e-tests-with-notify.sh --env production',
      'pre-setup': ''
    }
  }
};
