const Account = require("./Account");
const GetLastActions = require("./GetLastActions");
const NormalizeAccount = require("./NormalizeAccount");

/**
 * Gets the correct monthly statistic from the two oscillating
 * monthly fields.
 *
 * This code is copied directly from the SlothPixel project which uses exactly this
 * https://github.com/slothpixel/core/blob/41a815f4682ab883ef81a036bd07a6c3937d7f5a/util/utility.js#L69
 *
 * Therefore this is licensed under the MIT License and not MPL-2.0
 *
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function getMonthlyStat(a, b) {
  const start = new Date();
  const end = new Date(1417410000000);

  const diffYear = end.getFullYear() - start.getFullYear();
  const diffMonth = diffYear * 12 + end.getMonth() - start.getMonth();

  return diffMonth % 2 === 0 ? a : b;
}

/**
 * Gets the correct weekly statistic from the two oscillating
 * weekly fields.
 *
 * This code is copied directly from the SlothPixel project which uses exactly this
 * https://github.com/slothpixel/core/blob/41a815f4682ab883ef81a036bd07a6c3937d7f5a/util/utility.js#L58
 *
 * Therefore this is licensed under the MIT License and not MPL-2.0
 *
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function getWeeklyStat(a, b) {
  const delta = Date.now() - new Date(1417237200000);
  const numberWeeks = Math.floor(delta / 604800000);

  return numberWeeks % 2 === 0 ? a ?? 0 : b ?? 0;
}

/**
 *
 * @param {object} json
 * @returns {string}
 */
function getRank(json) {
  let rank = json?.player?.newPackageRank;
  rank ??= json.player?.packageRank ?? "";
  if (json.player?.monthlyPackageRank == "SUPERSTAR") rank = "MVP_PLUS_PLUS";

  if (json?.player?.prefix != undefined) {
    return json?.player?.prefix;
  }

  switch (json?.player?.rank) {
    case "YOUTUBER": {
      return "YOUTUBER";
    }

    case "ADMIN": {
      return "ADMIN";
    }

    case "GAME_MASTER": {
      return "GM";
    }
  }

  return rank;
}

/**
 *
 * @param {object} json
 * @param {Account} account
 */
module.exports = function PopulateAccountData(json, account) {
  account.ranksGifted = json.player?.giftingMeta?.ranksGiven ?? 0;

  account.rank = getRank(json);

  account.mvpColor = json.player?.monthlyRankColor ?? "GOLD";

  account.hypixelDiscord = json.player?.socialMedia?.links?.DISCORD ?? "";

  account.name = json?.player?.displayname ?? "INVALID-NAME";
  account.name_lower = account.name.toLowerCase();
  account.nameHist = json?.player?.knownAliases ?? ["INVALID-NAME"];

  account.internalId = json?.player?._id ?? 0;
  account.isLoggedIn = json?.player?.lastLogin > json.player?.lastLogout;
  account.lastLogout = json?.player?.lastLogout ?? 0;
  account.firstLogin = json?.player?.firstLogin ?? Date.now();

  account.version = json.player?.mcVersionRp ?? "1.8";
  account.mostRecentGameType = json.player?.mostRecentGameType ?? "NONE";

  account.xp = json.player?.networkExp ?? 0;
  account.level = 1 + -8750 / 2500 + Math.sqrt(((-8750 / 2500) * -8750) / 2500 + (2 / 2500) * account.xp);

  account.karma = json?.player?.karma ?? 0;
  account.achievementPoints = json?.player?.achievementPoints ?? 0;

  account.plusColor = json?.player?.rankPlusColor;

  if (account.plusColor == undefined) {
    account.plusColor = account.rank == "VIP_PLUS" ? "GOLD" : "RED";
  }
  account.cloak = json?.player?.currentCloak ?? "";
  account.hat = json?.player?.currentHat ?? "";
  account.clickEffect = json?.player?.currentClickEffect ?? "";

  account.arcadeCoins = json.player?.stats?.Arcade?.coins ?? 0;
  account.arcadeWins = json.player?.achievements?.arcade_arcade_winner ?? 0;
  account.anyWins = json.player?.achievements?.general_wins ?? 0;
  account.arcadeAchievementPoints = account?.arcadeAchievments?.totalEarned ?? 0;

  account.questsCompleted = json.player?.achievements?.general_quest_master ?? 0;
  account.timePlaying = json.player?.timePlaying ?? 0;

  account.lastLogin = json.player?.lastLogin ?? 0;
  account.apiHidden = account.lastLogin == 0;

  account.migrated = json?.player?.tourney?.quake_solo2_1 != undefined;
  account.coinTransfers = json?.player?.stats?.Arcade?.stamp_level ?? 0;

  account.coinsEarned = json.player?.achievements?.arcade_arcade_banker ?? 0;
  account.weeklyCoins = getWeeklyStat(json?.player?.stats?.Arcade?.weekly_coins_a, json?.player?.stats?.Arcade?.weekly_coins_b);
  account.monthlyCoins = getMonthlyStat(json?.player?.stats?.Arcade?.monthly_coins_a, json?.player?.stats?.Arcade?.monthly_coins_b);

  account.combinedArcadeWins =
    (account?.blockingDead?.wins ?? 0) +
    (account?.bountyHunters?.wins ?? 0) +
    (account?.dragonWars?.wins ?? 0) +
    (account?.enderSpleef?.wins ?? 0) +
    (account?.farmhunt?.wins ?? 0) +
    (account?.football?.wins ?? 0) +
    (account?.galaxyWars?.wins ?? 0) +
    (account?.hideAndSeek?.wins ?? 0) +
    (account?.holeInTheWall?.wins ?? 0) +
    (account?.hypixelSays?.wins ?? 0) +
    (account?.miniWalls?.wins ?? 0) +
    (account?.partyGames?.wins ?? 0) +
    (account?.pixelPainters?.wins ?? 0) +
    (account?.simTotal ?? 0) +
    (account?.throwOut?.wins ?? 0) +
    (account?.zombies?.wins_zombies ?? 0);

  account.unknownWins = Math.abs(account.arcadeWins - account.combinedArcadeWins);
  account.actionTime = GetLastActions(json?.player);
  account.importance = NormalizeAccount(account);
};
