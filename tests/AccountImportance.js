const fs = require("fs-extra");
const Account = require("hyarcade-requests/types/Account");

function normalize (acc) {
  return (
    (acc.blockingDead.wins * 7) +
    (acc.bountyHunters.wins * 8) +
    (acc.dragonWars.wins * 11) +
    (acc.enderSpleef.wins * 4.5) +
    (acc.farmhunt.wins * 6) +
    (acc.football.wins * 2) +
    (acc.galaxyWars.wins * 7) +
    (acc.miniWalls.wins * 3) +
    (acc.hideAndSeek.wins * 3.5) +
    (acc.hypixelSays.wins * 2.5) +
    (acc.partyGames.wins * 7.5) +
    (acc.pixelPainters.wins * 10) +
    (acc.throwOut.wins * 8) +
    (acc.seasonalWins.total * 4) +
    ((acc.zombies.wins_zombies ?? 0) * 30)
  );
}

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