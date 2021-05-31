const hypixelApi = require("./hypixelApi");
let accounts = [];

function numberify(str) {
    return Number(("" + str).replace(/undefined/g, 0).replace(/null/g, 0))
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
    async updateData() {
        let data = await this.getGuild();
        this.name = data.guild.name_lower;
        this.arcadeEXP = data.guild.guildExpByGameType.ARCADE;
        this.gxp = data.guild.exp;

        let gmembers = data.guild.members;
        for (let i = 0; i < gmembers.length; i++) {
            // find a corrosponding account in my account list
            let gamer = accounts.find((acc) => acc.uuid == gmembers[i].uuid);
            // dont add empty accounts
            if (gamer != undefined) {
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
        await this.updateData();
        this.wins = 0;
        this.arcadeCoins = 0;
        this.combinedAP = 0;
        this.arcadeWins = 0;
        this.karma = 0;
        this.ranksGifted = 0;
        this.hitwWins = 0;
        this.farmhuntWins = 0;
        this.miniWallsWins = 0;
        this.footballWins = 0;
        this.enderSpleefWins = 0;
        this.throwOutWins = 0;
        this.galaxyWarsWins = 0;
        this.dragonWarsWins = 0;
        this.bountyHuntersWins = 0;
        this.blockingDeadWins = 0;
        this.hideAndSeekWins = 0;
        this.zombiesWins = 0;
        this.pixelPaintersWins = 0;
        this.simWins = 0;
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
