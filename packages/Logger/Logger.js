const LoggerInstance = require("./LoggerInstance");

const process = require("process");

let name = process.argv[2];
name = this.name == "bot" ? process.argv[process.argv.length - 1] : this.name;
name = this.name == undefined ? "hyarcade" : this.name;

const Logger = new LoggerInstance(name, "🎮");

Logger.debug("----- NEW PROCESS STARTED -----");

let start = new Date();

Logger.debug(`Args are [${process.argv}] - executing`);
Logger.debug("----- Process info -----");
Logger.debug(`START TIME - ${start.toString()}`);
Logger.debug(`PLATFORM - ${process.platform} ${process.arch}`);
Logger.debug(`PID - ${process.pid}\nCWD - ${process.cwd()}`);
Logger.debug(`NODE VERSION - ${process.versions.node}\nV8 VERSION - ${process.versions.v8}`);
Logger.debug("------------------------");

process.on("warning", warning => {
  Logger.warn(warning.message);
  Logger.warn(warning.stack);
});

process.on("exit", code => {
  Logger.out(`${name} exiting with code ${code}`);
});

process.on("uncaughtException", (error, origin) => {
  Logger.err(error.name);
  Logger.err(origin);
  Logger.err(error.message);
  Logger.err(error.stack);
  Logger.err("EXITING PROCESS");

  process.exit(1);
});

module.exports = Logger;
