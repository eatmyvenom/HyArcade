const Logger = require("@hyarcade/logger");

/**
 *
 */
function main() {
  Logger.log("Main logger LOG");
  Logger.info("Main logger INFO");
  Logger.debug("Main logger DEBUG");
  Logger.warn("Main logger WARN");
  Logger.error("Main logger ERROR");
  Logger.event("a", "Main logger EVENT");
  Logger.event("a", "Main logger EVENT");
  Logger.verbose("Main logger VERBOSE");

  for (let i = 0; i < 100; i++) {
    console.log(`\u001B[${i}m    AAAA ${i}  \u001B[0m`);
  }
}

main();
