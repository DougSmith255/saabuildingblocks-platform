module.exports = {
  apps: [{
    name: 'social-poster',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3010',
    cwd: '/home/claude-flow/packages/social-poster',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3010,
    },
    error_file: '/home/claude-flow/logs/social-poster-error.log',
    out_file: '/home/claude-flow/logs/social-poster-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    restart_delay: 4000,
  }]
};
