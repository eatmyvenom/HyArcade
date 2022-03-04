const { readdir } = require("fs-extra");

/**
 *
 */
async function main() {
  const mods = await readdir("systems/cli/");

  console.log("If you are reading this, you probably did something wrong!");
  console.log("");
  console.log("You have run the command here without a valid second argument, valid arguments are:");
  console.log(`\t${mods.map(v => v.replace(/\.js/, "")).join("\n\t")}`);
  console.log("");
  console.log("If you need more help I would advise reading the code.");
  console.log("If you are not sure how you got here then please disreguard this message.");
}

module.exports = main;
