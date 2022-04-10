const { Account } = require("@hyarcade/account");
const { writeJson } = require("fs-extra");

/**
 *
 */
async function main() {
  const a = new Account("bigc1109", 0, "f0133668f8da4ab7ad3e62ca1b5574da");
  await a.updateData();
  writeJson("data/test-account.json", a, { spaces: 4 });
}

main().then(console.log).catch(console.error);
