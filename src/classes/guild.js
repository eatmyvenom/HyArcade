const Account = require("hyarcade-requests/types/Account");
const hypixelApi = require("../hypixelApi");
const { logger } = require("../utils");
let accounts = [];

/**
 * @param {string} str
 * @returns {number}
 */
function numberify (str) {
  return Number(str);
}

module.exports = function Gld (acclist) {
  accounts = acclist;
  return Guild;
};

class Guild {

  /**
   *
   * @type {Account[]}
   * @memberof Guild
   */
  members = [];
    name = "";
    wins = 0;
    arcadeEXP = 0;
    gxp = 0;
    uuid = "";
    memberUUIDs = [];
    membersStats = [];
    color = "";
    tag = "";
    games = [];
    createTime = 0;
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

    /**
     * Creates an instance of Guild.
     *
     * @param {string} uuid
     * @memberof Guild
     */
    constructor (uuid) {
      this.uuid = uuid;
    }

    /**
     * Updates the data for the guild with all of the accounts in the guild
     *
     * @memberof Guild
     */
    async updateMemberData () {
      const data = await this.getGuild();
      this.name = data?.guild?.name ?? "INVALID-NAME";
      logger.info(`Updating data for ${this.name}`);

      this.arcadeEXP = data?.guild?.guildExpByGameType?.ARCADE ?? 0;
      this.gxp = data?.guild?.exp ?? 0;
      this.color = data?.guild?.tagColor ?? "GREY";
      this.tag = data?.guild?.tag ?? "NONE";
      this.games = data?.guild?.preferredGames ?? [ "ARCADE" ];
      this.createTime = data?.guild?.created ?? 0;

      const gmembers = data?.guild?.members ?? [];
      for(let i = 0; i < gmembers.length; i += 1) {

        // find a corrosponding account in my account list
        const gamer = accounts.find((acc) => acc.uuid == gmembers[i].uuid);

        // dont add empty accounts
        if(gamer != undefined) {
          this.memberUUIDs.push(gamer.uuid);
          this.members.push(gamer);
        }
      }
    }

    /**
     * Get the JSON guild data returned from hypixel
     *
     * @returns {object}
     * @memberof Guild
     */
    async getGuild () {
      try {
        return JSON.parse(await hypixelApi.getGuildRaw(this.uuid));
      } catch (e) {
        logger.err(e);
        logger.err(this.uuid);
        return await this.getGuild();
      }
    }

    /**
     * Set the combined win count for the guild
     *
     * @returns {number}
     * @memberof Guild
     */
    async updateWins () {
      await this.updateMemberData();
      this.updateMemberStats();

      // TODO: Use this.members.forEach
      for(let i = 0; i < this.members.length; i += 1) {
        const member = this.members[i];
        this.wins += member.wins;
        this.arcadeCoins += member.arcadeCoins;
        this.combinedAP += member.achievementPoints;
        this.arcadeWins += member.combinedArcadeWins;
        this.karma += numberify(member.karma);
        this.ranksGifted += numberify(member.ranksGifted);
        this.hitwWins += numberify(member.holeInTheWall.wins);
        this.farmhuntWins += numberify(member.farmhunt.wins);
        this.miniWallsWins += numberify(member.miniWalls.wins);
        this.footballWins += numberify(member.football.wins);
        this.enderSpleefWins += numberify(member.enderSpleef.wins);
        this.throwOutWins += numberify(member.throwOut.wins);
        this.galaxyWarsWins += numberify(member.galaxyWars.wins);
        this.dragonWarsWins += numberify(member.dragonWars.wins);
        this.bountyHuntersWins += numberify(member.bountyHunters.wins);
        this.blockingDeadWins += numberify(member.blockingDead.wins ?? 0);
        this.hideAndSeekWins += numberify(member.hideAndSeek.wins ?? 0);
        this.hypixelSaysWins += numberify(member.hypixelSays.wins ?? 0);
        this.zombiesWins += numberify(member.zombies.wins_zombies ?? 0);
        this.pixelPaintersWins += numberify(member.pixelPainters.wins ?? 0);
        this.partyGamesWins += numberify(member?.partyGames?.wins ?? 0);
        this.simWins += numberify(member.seasonalWins.total);
      }
      delete this.members;
      return this.wins;
    }

    updateMemberStats () {
      this.members.forEach((member) => {
        const obj = {};
        obj.wins = member.combinedArcadeWins;
        obj.rank = member.rank;
        obj.name = member.name;
        obj.uuid = member.uuid;
        obj.online = member.isLoggedIn;
        obj.plusColor = member.plusColor;
        this.membersStats.push(obj);
      }, this);
    }
}
