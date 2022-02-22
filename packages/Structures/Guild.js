const logger = require("hyarcade-logger");
const { HypixelApi } = require("hyarcade-requests");
const Database = require("hyarcade-requests/Database");

/**
 * @param {string} str
 * @returns {number}
 */
function numberify(str) {
  return Number(str);
}

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

class Guild {
  input = "";

  memberUUIDs = [];

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

  /** @type {GuildAchievements} */
  achievements = {};

  /** @type {GameExperience} */
  gameExperience = {};

  wins = 0;
  arcadeCoins = 0;
  combinedAP = 0;
  arcadeWins = 0;
  karma = 0;
  ranksGifted = 0;
  hitwWins = 0;
  farmhuntWins = 0;
  miniWallsWins = 0;
  footballWins = 0;
  hypixelSaysWins = 0;
  enderSpleefWins = 0;
  throwOutWins = 0;
  galaxyWarsWins = 0;
  dragonWarsWins = 0;
  bountyHuntersWins = 0;
  blockingDeadWins = 0;
  hideAndSeekWins = 0;
  zombiesWins = 0;
  pixelPaintersWins = 0;
  partyGamesWins = 0;
  simWins = 0;

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
      return await HypixelApi.guild(this.input);
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

    for (let i = 0; i < this.members.length; i += 1) {
      const member = this.members[i];
      this.wins += member?.wins ?? 0;
      this.arcadeCoins += member?.arcadeCoins ?? 0;
      this.combinedAP += member?.achievementPoints ?? 0;
      this.arcadeWins += member?.combinedArcadeWins ?? 0;
      this.karma += numberify(member?.karma ?? 0);
      this.ranksGifted += numberify(member?.ranksGifted ?? 0);
      this.hitwWins += numberify(member?.holeInTheWall?.wins ?? 0);
      this.farmhuntWins += numberify(member?.farmhunt?.wins ?? 0);
      this.miniWallsWins += numberify(member?.miniWalls?.wins ?? 0);
      this.footballWins += numberify(member?.football?.wins ?? 0);
      this.enderSpleefWins += numberify(member?.enderSpleef?.wins ?? 0);
      this.throwOutWins += numberify(member?.throwOut?.wins ?? 0);
      this.galaxyWarsWins += numberify(member?.galaxyWars?.wins ?? 0);
      this.dragonWarsWins += numberify(member?.dragonWars?.wins ?? 0);
      this.bountyHuntersWins += numberify(member?.bountyHunters?.wins ?? 0);
      this.blockingDeadWins += numberify(member?.blockingDead?.wins ?? 0);
      this.hideAndSeekWins += numberify(member?.hideAndSeek?.wins ?? 0);
      this.hypixelSaysWins += numberify(member?.hypixelSays?.wins ?? 0);
      this.zombiesWins += numberify(member?.zombies?.wins_zombies ?? 0);
      this.pixelPaintersWins += numberify(member?.pixelPainters?.wins ?? 0);
      this.partyGamesWins += numberify(member?.partyGames?.wins ?? 0);
      this.simWins += numberify(member?.seasonalWins?.total ?? 0);
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
      obj.guildRank = member.guildData.rank;
      obj.joinTime = member.guildData.joined;
      obj.questParticipation = member.guildData.questParticipation;
      obj.gexpHistory = member.guildData.expHistory;
      obj.arcadeWins = member.arcadeWins;
      obj.combinedArcadeWins = member.combinedArcadeWins;
      obj.arcadeCoins = member.arcadeCoins;
      obj.achievementPoints = member.achievementPoints;
      obj.arcadeAchievements = member?.arcadeAchievments?.totalEarned ?? 0;
      obj.updateTime = member.updateTime;
      obj.lastAction = member.actionTime;
      this.membersStats.push(obj);
    }
  }
}

module.exports = Guild;
