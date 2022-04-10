import { LoggerInstance } from "./Logger.instance";

/**
 * @returns {string}
 */
function getName(): string {
  let name = process.argv[2];
  name = name == "bot" ? process.argv[process.argv.length - 1] : name;
  return name == undefined ? "hyarcade" : name;
}

const Logger = new LoggerInstance(getName(), "🎮");

const start = new Date();

Logger.debug(`[${process.argv}]`);
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
  Logger.out(`${getName()} exiting with code ${code}`);
});

process.on("uncaughtException", (error, origin) => {
  Logger.err(error.name);
  Logger.err(origin);
  Logger.err(error.message);
  Logger.err(error.stack);
  Logger.err("EXITING PROCESS");

  process.exit(1);
});

const { name, emoji, log, out, info, event, custom, warn, debug, dbg, explain, verbose, error, err } = Logger;

export default Logger;
export * from "./Logger.instance";
export { name, emoji, log, out, info, event, custom, warn, debug, dbg, explain, verbose, error, err };
