const Logger = require("hyarcade-logger");
const LoggerInstance = require("hyarcade-logger/LoggerInstance");
const { exec, ExecException } = require("child_process");

/**
 * @param command
 * @returns {Promise<string|ExecException>}
 */
function ExecAsync(command) {
  Logger.debug(`Spawning "${command.split(" ")[0]}" child process`);
  const execLogger = new LoggerInstance(`Child-${command.split(" ")[0]}`, "⑂");
  return new Promise((resolve, reject) => {
    exec(command, {}, (error, stdout, stderr) => {
      execLogger.log(stdout);
      if (stderr != "" && stderr != undefined) {
        execLogger.error(stderr);
      }

      if (error) {
        reject(error);
      }

      resolve(stdout);
    });
  });
}

module.exports = ExecAsync;
