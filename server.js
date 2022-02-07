/**
 * This script here is added due to yarn/npm behavior.
 * When (npm/yarn) start is run, it attempts to run
 * "node server.js" if server.js exists. This has a bit
 * of use in that it allows for me to lean on the
 * prestart and poststart scripts as well for various
 * tasks. In the future I plan to use more npm hooks
 * for whatever I might need.
 *
 * The main drawback here is that I am not able to set
 * any process flags. Usually this does not matter but I
 * have needed "--max-old-space-size" various times in
 * the past. While I do not believe I will need this any
 * time soon, it is possible that I do for the server, in
 * which case I would need to specify a new start script.
 */

const Logger = require("hyarcade-logger");

/**
 * @returns {*}
 */
async function main() {
  const Server = require("./systems/server/Server");
  Logger.out("Starting server for database and listening on port 6000");
  return await Server(6000);
}

main().then(Logger.log).catch(Logger.err);
