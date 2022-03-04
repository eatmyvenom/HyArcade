const Logger = require("hyarcade-logger");
const process = require("process");

/**
 * Runs a command from the commands directory
 */
async function main() {
  const args = process.argv;
  const mod = require(`./commands/${args[2]?.toLowerCase()}`);

  Logger.name = args[2]?.toLowerCase();

  await mod(args);

  process.nextTick(() => {
    process.exit(0);
  });
}

if (require.main == module) {
  main()
    .then(() => {})
    .catch(error => Logger.err(error.stack));
}

module.exports = main;
