import GetLastActions from "./GetLastActions";
import NormalizeAccount from "./NormalizeAccount";

/**
 * @param {object} json
 * @returns {number}
 */
function getQuestsCompleted(json) {
  const quests = json?.player?.quests ?? {};
  let completions = 0;

  if (!quests) {
    return 0;
  }

  for (const questName in quests) {
    const quest = quests[questName];
    if (quest.completions) {
      completions += quest.completions.length;
    }
  }

  return completions;
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
 * @param {any} account
 */
export function PopulateAccountData(json: any, account: any) {
  account.ranksGifted = json.player?.giftingMeta?.ranksGiven ?? 0;

  account.rank = getRank(json);

  account.mvpColor = json.player?.monthlyRankColor ?? "GOLD";

  account.hypixelDiscord = json.player?.socialMedia?.links?.DISCORD ?? "";

  account.name = json?.player?.displayname ?? "INVALID-NAME";
  // eslint-disable-next-line camelcase
  account.name_lower = account.name.toLowerCase();
  account.nameHist = json?.player?.knownAliases ?? ["INVALID-NAME"];

  account.internalId = json?.player?._id ?? 0;
  account.isLoggedIn = json?.player?.lastLogin > json.player?.lastLogout;
  account.lastLogout = json?.player?.lastLogout ?? 0;
  account.firstLogin = json?.player?.firstLogin ?? 0;

  account.mostRecentGameType = json.player?.mostRecentGameType ?? "NONE";

  account.xp = json.player?.networkExp ?? 0;
  account.level = 1 + -8750 / 2500 + Math.sqrt(((-8750 / 2500) * -8750) / 2500 + (2 / 2500) * account.xp);

  account.karma = json?.player?.karma ?? 0;
  account.achievementPoints = json?.player?.achievementPoints ?? 0;

  account.plusColor = json?.player?.rankPlusColor;

  if (account.plusColor == undefined) {
    account.plusColor = account.rank == "VIP_PLUS" ? "GOLD" : "RED";
  }

  account.arcadeCoins = json.player?.stats?.Arcade?.coins ?? 0;
  account.arcadeWins = json.player?.achievements?.arcade_arcade_winner ?? 0;
  account.anyWins = json.player?.achievements?.general_wins ?? 0;
  account.arcadeAchievementPoints = account?.arcadeAchievments?.totalEarned ?? 0;

  account.questsCompleted = getQuestsCompleted(json);
  account.timePlaying = json.player?.timePlaying ?? 0;

  account.lastLogin = json.player?.lastLogin ?? 0;
  account.apiHidden = account.lastLogin == 0;

  account.coinTransfers = json?.player?.stats?.Arcade?.stamp_level ?? 0;

  account.coinsEarned = json.player?.achievements?.arcade_arcade_banker ?? 0;

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
}
