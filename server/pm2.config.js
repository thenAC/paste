const apps = [
  {
    name: 'paste-server',
    script: `./app/index.js`,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    exec_mode: 'cluster',
    max_memory_restart: '512M',
    instances: parseInt(process.env.NODE_WORKERS, 10) || 1,
    merge_logs: true,
    min_uptime: '5s',
    cwd: './',
    instance_var: 'INSTANCE_ID',
    ignore_watch: ['node_modules', 'public'],
    env: {
      NODE_ENV: 'production',
    },
    node_args: ['--unhandled-rejections=warn'],
  },
];

module.exports = {
  apps,
};
