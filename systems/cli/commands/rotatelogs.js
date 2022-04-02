const { readdir, rm } = require("fs-extra");
const Logger = require("@hyarcade/logger");
const ExecAsync = require("@hyarcade/utils/ExecAsync");

/**
 *
 */
async function main() {
  const now = new Date();
  try {
    await ExecAsync(`tar --force-local --exclude=Child-tar-out.log -zcvf Logs-${now.toISOString()}.tar.gz logs`);

    const dir = await readdir("logs/");

    for (const file of dir) {
      if (file.endsWith(".log") && !file.includes("Child-tar-out.log")) {
        await rm(`logs/${file}`);
      }
    }
  } catch {
    Logger.err("Log rotation error occured!");
  }
}

module.exports = main;
