module.exports = {
  apps: [
    {
      name: "API",
      script: "yarn api",
      error_file: "/dev/null",
      out_file: "/dev/null",
      restart: true,
      combine_logs: true,
    },
    {
      name: "Bot",
      script: "yarn bot",
      error_file: "/dev/null",
      out_file: "/dev/null",
      restart: true,
      combine_logs: true,
    },
    {
      name: "Worker",
      script: "yarn workers",
      error_file: "/dev/null",
      out_file: "/dev/null",
      restart: true,
      combine_logs: true,
    },
  ],
};
