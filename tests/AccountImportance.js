const fs = require("fs-extra");
const Account = require("hyarcade-requests/types/Account");
const normalize = require("../src/datagen/utils/NormalizeAccount");

async function main () {
  /**
   * @type {Account[]}
   */
  let accs = await fs.readJSON("data/accounts.json");

  accs = accs.sort((a, b) => {
    const normalizedWinsA = normalize(a);

    const normalizedWinsB = normalize(b);

    return normalizedWinsA - normalizedWinsB;
  });

  accs = accs.slice(-720);

  accs = accs.map((oldAcc) => {
    const normalizedWins = normalize(oldAcc);
    
    return `${oldAcc.name.padEnd(17, " ")} : ${Math.round(normalizedWins)}`;
  });

  return accs.join("\n");
}

main()
  .then(console.log)
  .catch(console.error);