module.exports = {
  apps : [{
    name: 'cos-s3-bot',
    script: 'pnpm start',
    instances: 1,
    watch: true,
    max_memory_restart: '180M',
  }]
}
