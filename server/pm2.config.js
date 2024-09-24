const apps = [
  {
    name: process.env.APP_NAME || 'paste-server',
    script: `./server/src/index.js`,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    exec_mode: 'cluster',
    max_memory_restart: '256M',
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
  process.env.USE_JOB === '1' && {
    name: process.env.APP_NAME_JOB_CLEAR || 'paste-job-clear',
    script: `./server/src/jobs/clear.js`,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    exec_mode: 'fork',
    max_memory_restart: '128M',
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
].filter(Boolean);

module.exports = {
  apps,
};
