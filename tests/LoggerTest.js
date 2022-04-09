const { LoggerInstance } = require("@hyarcade/logger");

/**
 *
 */
function main() {
  const l = new LoggerInstance("test", "🤺");
  l.err("Testing 123456789");
  l.warn("Testing 123456789");
  l.log("Testing 123456789");
  l.info("Testing 123456789");
  l.debug("Testing 123456789");
  l.verbose("Testing 123456789");
}

main();
