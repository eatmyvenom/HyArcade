const dataGeneration = require("../src/dataGeneration");

/**
 * 
 * @returns {*}
 */
async function main () {
  await dataGeneration.saveBoosters();
}

module.exports = main;