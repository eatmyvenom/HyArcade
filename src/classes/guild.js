const hypixelApi = require("../hypixelApi");
let accounts = [];

function numberify(str) {
    return Number(("" + str).replace(/undefined/g, 0).replace(/null/g, 0));
}

module.exports = function Gld(acclist) {
    accounts = acclist;
    return Guild;
};

class Guild {
    members = [];
    name = "";
    wins = 0;
    arcadeEXP = 0;
    gxp = 0;
    uuid = "";
    memberUUIDs = [];
    color = "";
    tag = "";
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
    enderSpleefWins = 0;
    throwOutWins = 0;
    galaxyWarsWins = 0;
    dragonWarsWins = 0;
    bountyHuntersWins = 0;
    blockingDeadWins = 0;
    hideAndSeekWins = 0;
    zombiesWins = 0;
    pixelPaintersWins = 0;
    simWins = 0;

    /**
     * Creates an instance of Guild.
     * @param {String} name
     * @param {String} uuid
     * @memberof Guild
     */
    constructor(uuid) {
        this.uuid = uuid;
    }

    /**
     * Updates the data for the guild with all of the accounts in the guild
     *
     * @memberof Guild
     */
    async updateMemberData() {
        let data = await this.getGuild();
        this.name = data.guild.name;
        this.arcadeEXP = data.guild.guildExpByGameType.ARCADE;
        this.gxp = data.guild.exp;
        this.color = data.guild.tagColor;
        this.tag = data.guild.tag;

        let gmembers = data.guild.members;
        for (let i = 0; i < gmembers.length; i++) {
            // find a corrosponding account in my account list
            let gamer = accounts.find((acc) => acc.uuid == gmembers[i].uuid);
            // dont add empty accounts
            if (gamer != undefined) {
                this.memberUUIDs.push(gamer.uuid);
                this.members.push(gamer);
            }
        }
    }

    /**
     * Get the JSON guild data returned from hypixel
     *
     * @return {Object}
     * @memberof Guild
     */
    async getGuild() {
        return JSON.parse(await hypixelApi.getGuildRaw(this.uuid));
    }

    /**
     * Set the combined win count for the guild
     *
     * @return {Number}
     * @memberof Guild
     */
    async updateWins() {
        await this.updateMemberData();
        for (let i = 0; i < this.members.length; i++) {
            let member = this.members[i];
            this.wins += member.wins;
            this.arcadeCoins += member.arcadeCoins;
            this.combinedAP += member.achievementPoints;
            this.arcadeWins += member.combinedArcadeWins;
            this.karma += numberify(member.karma);
            this.ranksGifted += numberify(member.ranksGifted);
            this.hitwWins += numberify(member.hitwWins);
            this.farmhuntWins += numberify(member.farmhuntWins);
            this.miniWallsWins += numberify(member.miniWallsWins);
            this.footballWins += numberify(member.footballWins);
            this.enderSpleefWins += numberify(member.enderSpleefWins);
            this.throwOutWins += numberify(member.throwOutWins);
            this.galaxyWarsWins += numberify(member.galaxyWarsWins);
            this.dragonWarsWins += numberify(member.dragonWarsWins);
            this.blockingDeadWins += numberify(member.blockingDeadWins);
            this.hideAndSeekWins += numberify(member.hideAndSeekWins);
            this.zombiesWins += numberify(member.zombiesWins);
            this.pixelPaintersWins += numberify(member.pixelPaintersWins);
            this.simWins += numberify(member.simTotal);
        }
        this.members = undefined;
        return this.wins;
    }
}
