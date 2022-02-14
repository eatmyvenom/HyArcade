module.exports = function NormalizeAccount(acc) {
  return (
    acc.blockingDead.wins * 7 +
    acc.bountyHunters.wins * 8 +
    acc.dragonWars.wins * 11 +
    acc.enderSpleef.wins * 4.5 +
    acc.farmhunt.wins * 6 +
    acc.football.wins * 2 +
    acc.galaxyWars.wins * 7 +
    acc.miniWalls.wins * 3 +
    acc.hideAndSeek.wins * 3 +
    acc.hypixelSays.wins * 2.5 +
    acc.partyGames.wins * 7.5 +
    acc.pixelPainters.wins * 10 +
    acc.holeInTheWall.wins * 5 +
    acc.throwOut.wins * 8 +
    acc.seasonalWins.total * 4 +
    (acc.zombies.wins_zombies ?? 0) * 30
  );
};
