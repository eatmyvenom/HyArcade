const { readDB } = require("../src/utils");
const Accounts = require("../src/utils/files/Accounts");

async function main () {
  const accounts = await readDB("weeklyaccounts");

  const h = new Accounts("data/accounts");

  h.writeAccounts(accounts);
}

main()
  .then(console.log)
  .catch(console.error);