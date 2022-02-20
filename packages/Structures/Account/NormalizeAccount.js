module.exports = function NormalizeAccount(acc) {
  return (
    acc.blockingDead.wins * 7 +
    acc.bountyHunters.wins * 8 +
    acc.dragonWars.wins * 10 +
    acc.enderSpleef.wins * 5 +
    acc.farmhunt.wins * 5 +
    acc.football.wins * 2 +
    acc.galaxyWars.wins * 7 +
    acc.miniWalls.wins * 3 +
    acc.hideAndSeek.wins * 3 +
    acc.hypixelSays.wins * 3 +
    acc.partyGames.wins * 7 +
    acc.pixelPainters.wins * 11 +
    acc.holeInTheWall.wins * 6 +
    acc.throwOut.wins * 9 +
    acc.seasonalWins.total * 3 +
    (acc.zombies.wins_zombies ?? 0) * 30
  );
};
