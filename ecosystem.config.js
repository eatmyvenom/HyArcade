/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */
const logs = {
  error_file: "/dev/null",
  out_file: "/dev/null",
  combine_logs: true,
};

module.exports = {
  apps: [
    {
      ...logs,
      name: "API",
      script: "yarn api start",
      restart: true,
    },
    {
      ...logs,
      name: "Site",
      script: "yarn site start",
      restart: true,
    },
    {
      ...logs,
      name: "Bot",
      script: "yarn bot start",
      restart_delay: 5000,
      restart: true,
    },
    {
      ...logs,
      name: "MIWBot",
      script: "yarn bot start mw",
      restart_delay: 10000,
      restart: true,
    },
    {
      ...logs,
      name: "Worker",
      script: "yarn worker start",
      restart_delay: 10000,
      restart: true,
    },
    {
      ...logs,
      name: "Cache",
      script: "yarn refreshcache",
      restart: false,
      autorestart: false,
      cron_restart: "*/20 * * * *",
    },
  ],
};
