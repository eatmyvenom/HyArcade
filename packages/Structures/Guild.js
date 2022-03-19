const logger = require("hyarcade-logger");
const { HypixelApi } = require("hyarcade-requests");
const Database = require("hyarcade-requests/Database");

class GuildAchievements {
  experienceKings = 0;
  winners = 0;
  concurrentOnline = 0;
}

class GameExperience {
  vampirez = 0;
  arena = 0;
  prototypeGames = 0;
  smashHeros = 0;
  turboKartRacers = 0;
  duels = 0;
  bedwars = 0;
  quakecraft = 0;
  battleground = 0;
  blitz = 0;
  buildBattle = 0;
  copsAndCrips = 0;
  megaWalls = 0;
  arcadeGames = 0;
  housing = 0;
  murderMystery = 0;
  skywars = 0;
  walls = 0;
  UHC = 0;
  paintball = 0;
  pit = 0;
  speedUHC = 0;
  tntGames = 0;

  constructor(gameTypeEXP) {
    this.vampirez = gameTypeEXP.VAMPIREZ ?? 0;
    this.arena = gameTypeEXP.ARENA ?? 0;
    this.prototypeGames = gameTypeEXP.PROTOTYPE ?? 0;
    this.smashHeros = gameTypeEXP.SUPER_SMASH ?? 0;
    this.turboKartRacers = gameTypeEXP.GINGERBREAD ?? 0;
    this.duels = gameTypeEXP.DUELS ?? 0;
    this.bedwars = gameTypeEXP.BEDWARS ?? 0;
    this.quakecraft = gameTypeEXP.QUAKECRAFT ?? 0;
    this.battleground = gameTypeEXP.BATTLEGROUND ?? 0;
    this.blitz = gameTypeEXP.SURVIVAL_GAMES ?? 0;
    this.buildBattle = gameTypeEXP.BUILD_BATTLE ?? 0;
    this.copsAndCrips = gameTypeEXP.MCGO ?? 0;
    this.megaWalls = gameTypeEXP.WALLS3 ?? 0;
    this.arcadeGames = gameTypeEXP.ARCADE ?? 0;
    this.housing = gameTypeEXP.HOUSING ?? 0;
    this.murderMystery = gameTypeEXP.MURDER_MYSTERY ?? 0;
    this.skywars = gameTypeEXP.SKYWARS ?? 0;
    this.walls = gameTypeEXP.WALLS ?? 0;
    this.UHC = gameTypeEXP.UHC ?? 0;
    this.paintball = gameTypeEXP.PAINTBALL ?? 0;
    this.pit = gameTypeEXP.PIT ?? 0;
    this.speedUHC = gameTypeEXP.SPEED_UHC ?? 0;
    this.tntGames = gameTypeEXP.TNTGAMES ?? 0;
  }
}

class GameStats {
  blockingDead = {
    wins: 0,
    kills: 0,
  };

  bountyHunters = {
    wins: 0,
    kills: 0,
  };

  captureTheWool = {
    woolCaptures: 0,
    kills: 0,
  };

  dragonWars = {
    wins: 0,
    kills: 0,
  };

  enderSpleef = {
    wins: 0,
    blocksBroken: 0,
  };

  farmHunt = {
    wins: 0,
    kills: 0,
    taunts: 0,
  };

  football = {
    wins: 0,
    goals: 0,
  };

  galaxyWars = {
    wins: 0,
    kills: 0,
  };

  hideAndSeek = {
    wins: 0,
    objectives: 0,
    kills: 0,
  };

  holeInTheWall = {
    wins: 0,
    qualifiers: 0,
    finals: 0,
  };

  hypixelSays = {
    wins: 0,
    roundWins: 0,
    points: 0,
  };

  miniWalls = {
    wins: 0,
    kills: 0,
    witherDamage: 0,
  };

  partyGames = {
    wins: 0,
    stars: 0,
    roundsWon: 0,
  };

  pixelPainters = {
    wins: 0,
  };

  throwOut = {
    wins: 0,
    kills: 0,
  };

  zombies = {
    wins: 0,
  };

  seasonal = {
    wins: 0,
  };

  /**
   *
   * @param {object[]} members
   */
  constructor(members) {
    for (const member of members) {
      this.blockingDead.wins += member?.blockingDead?.wins ?? 0;
      this.blockingDead.kills += member?.blockingDead?.kills ?? 0;

      this.bountyHunters.wins += member?.bountyHunters?.wins ?? 0;
      this.bountyHunters.kills += member?.bountyHunters?.kills ?? 0;

      this.captureTheWool.woolCaptures += member?.captureTheWool?.woolCaptures ?? 0;
      this.captureTheWool.kills += member?.captureTheWool?.kills ?? 0;

      this.dragonWars.wins += member?.dragonWars?.wins ?? 0;
      this.dragonWars.kills += member?.dragonWars?.kills ?? 0;

      this.enderSpleef.wins += member?.enderSpleef?.wins ?? 0;
      this.enderSpleef.blocksBroken += member?.enderSpleef?.blocksBroken ?? 0;

      this.farmHunt.wins += member?.farmhunt?.wins ?? 0;
      this.farmHunt.kills += member?.farmhunt?.kills ?? 0;
      this.farmHunt.taunts += member?.farmhunt?.tauntsUsed ?? 0;

      this.football.wins += member?.football?.wins ?? 0;
      this.football.goals += member?.football?.goals ?? 0;

      this.galaxyWars.wins += member?.galaxyWars?.wins ?? 0;
      this.galaxyWars.kills += member?.galaxyWars?.kills ?? 0;

      this.hideAndSeek.wins += member?.hideAndSeek?.wins ?? 0;
      this.hideAndSeek.kills += member?.hideAndSeek?.kills ?? 0;
      this.hideAndSeek.objectives += member?.hideAndSeek?.objectives ?? 0;

      this.holeInTheWall.wins += member?.holeInTheWall?.wins ?? 0;
      this.holeInTheWall.qualifiers += member?.holeInTheWall?.qualifiers ?? 0;
      this.holeInTheWall.finals += member?.holeInTheWall?.finals ?? 0;

      this.hypixelSays.wins += member?.hypixelSays?.wins ?? 0;
      this.hypixelSays.roundWins += member?.hypixelSays?.totalRoundWins ?? 0;
      this.hypixelSays.points += member?.hypixelSays?.totalPoints ?? 0;

      this.miniWalls.wins += member?.miniWalls?.wins ?? 0;
      this.miniWalls.kills += member?.miniWalls?.kills ?? 0;
      this.miniWalls.witherDamage += member?.miniWalls?.witherDamage ?? 0;

      this.partyGames.wins += member?.partyGames?.wins ?? 0;
      this.partyGames.stars += member?.partyGames?.stars ?? 0;
      this.partyGames.roundsWon += member?.partyGames?.roundsWon ?? 0;

      this.pixelPainters.wins += member?.pixelPainters?.wins ?? 0;

      this.throwOut.wins += member?.throwOut?.wins ?? 0;
      this.throwOut.kills += member?.throwOut?.kills ?? 0;

      this.zombies.wins += member?.zombies?.wins_zombies ?? 0;

      this.seasonal.wins += member?.seasonalWins?.total ?? 0;
    }
  }
}

class Guild {
  input = "";

  memberUUIDs = [];
  members = [];

  uuid = "";
  name = "";

  arcadeEXP = 0;
  gexp = 0;
  membersStats = [];
  color = "";
  tag = "";
  createTime = 0;

  description = "";

  games = [];

  guildRanks = [];

  /** @type {GuildAchievements} */
  achievements = {};

  /** @type {GameExperience} */
  gameExperience = {};

  /** @type {GameStats} */
  gameStats = {};

  arcadeCoins = 0;
  combinedAP = 0;
  arcadeWins = 0;
  karma = 0;
  ranksGifted = 0;
  arcadeAchievementPoints = 0;
  questsCompleted = 0;
  totalWins = 0;

  updateTime = 0;

  /**
   * Creates an instance of Guild.
   *
   * @param {string} input
   * @memberof Guild
   */
  constructor(input) {
    this.input = input;
  }

  /**
   * Updates the data for the guild with all of the accounts in the guild
   *
   * @memberof Guild
   */
  async updateMemberData() {
    const data = await this.getGuild();
    this.uuid = data?.guild?._id ?? "";
    this.name = data?.guild?.name ?? "INVALID-NAME";

    if (this.name == "INVLAID-NAME") {
      return;
    }

    logger.log(`Updating member data for ${this.name}`);
    this.arcadeEXP = data?.guild?.guildExpByGameType?.ARCADE ?? 0;
    this.gexp = data?.guild?.exp ?? 0;
    this.color = data?.guild?.tagColor ?? "GREY";
    this.tag = data?.guild?.tag ?? "NONE";
    this.games = data?.guild?.preferredGames ?? [];
    this.createTime = data?.guild?.created ?? 0;
    this.description = data?.guild?.description ?? "";

    this.guildRanks = data?.guild?.ranks ?? [];

    this.achievements = {
      experienceKings: data?.guild?.achievements?.EXPERIENCE_KINGS ?? 0,
      winners: data?.guild?.achievements?.WINNERS ?? 0,
      concurrentOnline: data?.guild?.achievements?.ONLINE_PLAYERS ?? 0,
    };

    this.gameExperience = new GameExperience(data?.guild?.guildExpByGameType ?? {});

    const gmembers = data?.guild?.members ?? [];
    for (const gmember of gmembers) {
      const gamer = await Database.account(gmember.uuid, undefined, true);

      gamer.guildData = gmember;

      // dont add empty accounts
      if (gamer != undefined && gamer.name != "INVALID-NAME") {
        this.memberUUIDs.push(gamer.uuid);
        this.members.push(gamer);
      }
    }

    this.updateTime = Date.now();
  }

  /**
   * Get the JSON guild data returned from hypixel
   *
   * @returns {object}
   * @memberof Guild
   */
  async getGuild() {
    try {
      if (this.input != undefined && this.input != "") {
        return await HypixelApi.guild(this.input);
      }
    } catch (error) {
      logger.err(error.stack);
      logger.err(this.input);
      return await this.getGuild();
    }
  }

  /**
   * Set the combined win count for the guild
   *
   * @returns {number}
   * @memberof Guild
   */
  async updateWins() {
    await this.updateMemberData();
    this.updateMemberStats();

    this.gameStats = new GameStats(this.members);

    for (const member of this.members) {
      this.arcadeCoins += member?.arcadeCoins ?? 0;
      this.combinedAP += member.achievementPoints ?? 0;
      this.arcadeWins += member?.arcadeWins ?? 0;
      this.karma += member?.karma ?? 0;
      this.ranksGifted += member?.ranksGifted ?? 0;
      this.arcadeAchievementPoints += member?.arcadeAchievementPoints ?? 0;
      this.questsCompleted += member?.questsCompleted ?? 0;
      this.totalWins += member?.anyWins ?? 0;
    }

    delete this.members;
    delete this.memberUUIDs;
    return this.wins;
  }

  updateMemberStats() {
    for (const member of this.members) {
      const obj = {};
      obj.name = member.name;
      obj.uuid = member.uuid;
      obj.rank = member.rank;
      obj.mvpColor = member.mvpColor;
      obj.plusColor = member.plusColor;
      obj.guildRank = this.guildRanks.find(r => r.name == member.guildData.rank);
      obj.joinTime = member.guildData.joined;
      obj.questParticipation = member.guildData.questParticipation;
      obj.gexpHistory = member.guildData.expHistory;
      obj.stats = {
        arcadeWins: member.arcadeWins,
        combinedArcadeWins: member.combinedArcadeWins,
        arcadeCoins: member.arcadeCoins,
        achievementPoints: member.achievementPoints,
        arcadeAchievements: member?.arcadeAchievments?.totalEarned ?? 0,
        questsCompleted: member?.questsCompleted ?? 0,
        xp: member?.xp ?? 0,
        level: member?.level ?? 0,
        totalWins: member?.anyWins ?? 0,
      };
      obj.updateTime = member.updateTime;
      obj.lastAction = member.actionTime;
      this.membersStats.push(obj);
    }
  }
}

module.exports = Guild;
