const SendBasicLB = require("../../src/events/SendBasicLB");
const SendDuplexLB = require("../../src/events/SendDuplexLB");
const config = require("hyarcade-config").fromJSON();

/**
 * 
 * @param {string[]} args 
 * @returns {*}
 */
async function main (args) {
  if(args[3] == "basic") {
    return await SendBasicLB(config.otherHooks[args[4] ?? "TEST"], args[5] ?? "arcadeWins", args[6], args[7] ?? 10, (args[8] ?? "title").replace(/_/g, " "));
  } else if(args[3] == "duplex") {
    return await SendDuplexLB(config.otherHooks[args[4] ?? "TEST"], args[5] ?? "arcadeWins", args[6], args[7] ?? 10, (args[8] ?? "title").replace(/_/g, " "), args[9] ?? "day");
  }
}

module.exports = main;