const Accounts = require("../src/utils/files/Accounts");
const Database = require("hyarcade-requests/Database");

async function main () {
  const accounts = await Database.readDB("weeklyaccounts");

  const h = new Accounts("data/accounts.weekly");

  h.writeAccounts(accounts);
}

main()
  .then(console.log)
  .catch(console.error);