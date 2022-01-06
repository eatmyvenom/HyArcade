const SendBasicLB = require("../src/events/SendBasicLB");
const SendDuplexLB = require("../src/events/SendDuplexLB");
const config = require("../Config").fromJSON();

/**
 * 
 * @param {string[]} args 
 * @returns {*}
 */
async function main (args) {
  if(args[2] == "basic") {
    return await SendBasicLB(config.otherHooks[args[3]], args[4], args[5], args[6], args[7]);
  } else if(args[2] == "duplex") {
    return await SendDuplexLB(config.otherHooks[args[3]], args[4], args[5], args[6], args[7], args[8]);
  }
}

module.exports = main;