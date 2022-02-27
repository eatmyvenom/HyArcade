const { writeJson } = require("fs-extra");
const { Account } = require("hyarcade-structures");

/**
 *
 */
async function main() {
  let a = new Account("bigc1109", 0, "f0133668f8da4ab7ad3e62ca1b5574da");
  await a.updateData();
  writeJson("data/test-account.json", a, { spaces: 4 });
}

main().then(console.log).catch(console.error);
