const hypixelApi = require("./hypixelApi");
let accounts = [];

module.exports = function Gld(acclist) {
    accounts = acclist;
    return Guild;
};

class Guild {
    members = [];
    name = "";
    wins = 0;
    arcadeEXP = 0;
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
        for (let i = 0; i < this.members.length; i++) {
            let member = this.members[i];
            this.wins += member.wins;
            this.arcadeCoins += member.arcadeCoins;
            this.combinedAP += member.achievementPoints;
            this.arcadeWins += member.combinedArcadeWins;
        }
        this.members = undefined;
        return this.wins;
    }
}
