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
      script: "yarn api",
      restart: true,
    },
    {
      ...logs,
      name: "Site",
      script: "yarn site",
      restart: true,
    },
    {
      ...logs,
      name: "Bot",
      script: "yarn bot",
      restart_delay: 5000,
      restart: true,
    },
    {
      ...logs,
      name: "MIWBot",
      script: "yarn bot mw",
      restart_delay: 10000,
      restart: true,
    },
    {
      ...logs,
      name: "Worker",
      script: "yarn worker",
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
