const { getAccountData } = require("../hypixelApi");
const optifineRequest = require("../request/optifineRequest");
const labyRequest = require("../request/labyRequest");
const Logger = require("../utils/Logger");

function numberify(str) {
    return Number(("" + str).replace(/undefined/g, 0).replace(/null/g, 0));
}
class Account {
    name = "";
    name_lower = "";
    nameHist = [];
    uuid = "";
    uuidPosix = "";
    internalId = "";
    guildID = "";
    guild = undefined;
    rank = "";
    version = "";
    firstLogin = 0;
    isLoggedIn = false;
    lastLogout = 0;
    mostRecentGameType = "";
    achievementPoints = 0;
    xp = 0;
    level = 0;
    karma = 0;
    ranksGifted = 0;
    arcadeCoins = 0;
    wins = 0;
    hitwQual = 0;
    hitwFinal = 0;
    hitwWins = 0;
    hitwRounds = 0;
    farmhuntWins = 0;
    farmhuntShit = 0;
    hypixelSaysWins = 0;
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
    ctwKills = 0;
    ctwWoolCaptured = 0;
    arcadeWins = 0;
    combinedArcadeWins = 0;
    anyWins = 0;
    hnsKills = 0;
    seasonalWins = {
        easter: 0,
        scuba: 0,
        halloween: 0,
        grinch: 0,
        total: 0,
    };
    simTotal = 0;
    extras = {
        blockingDeadKills: 0,
        blockingDeadHeadshots: 0,
        bountyHuntersKills: 0,
        bountyHuntersBountyKills: 0,
        bountyHuntersDeaths: 0,
        dragonWarsKills: 0,
        footballGoals: 0,
        footballPKicks: 0,
        footballKicks: 0,
        galaxyWarsKills: 0,
        galaxyWarsDeaths: 0,
        HNSSeekerWins: 0,
        HNSHiderWins: 0,
        hypixelSaysRounds: 0,
        throwOutKills: 0,
        throwOutDeaths: 0,
    };
    miniWalls = {
        kit: "",
        arrowsHit: 0,
        arrowsShot: 0,
        finalKills: 0,
        kills: 0,
        witherKills: 0,
        deaths: 0,
        witherDamage: 0,
    };
    zombies = {};
    hasOFCape = false;
    hasLabyCape = false;
    cloak = "";
    clickEffect = "";
    plusColor = "";
    hat = "";
    hypixelDiscord = "";
    discord = "";
    updateTime = 0;

    /**
     * Creates an instance of Account.
     * @param {String} name
     * @param {Number} wins
     * @param {String} uuid
     * @memberof account
     */
    constructor(name, wins, uuid) {
        this.name = name;
        this.wins = wins;
        this.uuid = uuid;
        try {
            let timeLow = uuid?.slice(0, 8);
            let timeMid = uuid?.slice(8, 12);
            let version = uuid?.slice(12, 16);
            let varient = uuid?.slice(16, 20);
            let node = uuid?.slice(-12);
            this.uuidPosix = `${timeLow}-${timeMid}-${version}-${varient}-${node}`;
        } catch (e) {
            Logger.error(`Error caused from the uuid of ${name} : ${uuid}`);
            Logger.error(e);
        }
    }

    setData(oldAcc) {
        for (let prop in oldAcc) {
            this[prop] = oldAcc[prop];
        }
    }

    /**
     * Update and populate all the data for this account
     * @memberof account
     */
    async updateData() {
        await Promise.all([this.updateHypixel(), this.updateOptifine(), this.updateLaby()]);
    }

    /**
     * Update and populate the optifine data
     * @memberof account
     */
    async updateOptifine() {
        let req = new optifineRequest(this.name);
        await req.makeRequest();
        this.hasOFCape = req.hasCape();
    }

    /**
     * Update and populate the labymod data
     * @memberof account
     */
    async updateLaby() {
        let req = new labyRequest(this.uuidPosix);
        await req.makeRequest();
        this.hasLabyCape = req.hasCape();
    }

    /**
     * Update and populate the hypixel data
     * @memberof account
     */
    async updateHypixel() {
        let json = await getAccountData(this.uuid);
        // make sure player has stats to be checked
        if (json.player.stats?.Arcade != undefined) {
            this.updateTime = Date.now();
            let arcade = json.player.stats?.Arcade;

            let wins = 0;
            if (arcade?.wins_party) wins += arcade?.wins_party;
            if (arcade?.wins_party_2) wins += arcade?.wins_party_2;
            if (arcade?.wins_party_3) wins += arcade?.wins_party_3;
            this.wins = numberify(wins);

            this.ranksGifted = json.player.giftingMeta?.ranksGiven;
            this.ranksGifted = this.ranksGifted == undefined ? 0 : this.ranksGifted; 

            this.rank = json.player.newPackageRank != undefined ? json.player.newPackageRank : json.player.packageRank;

            if (json.player.monthlyPackageRank == "SUPERSTAR") this.rank = "MVP_PLUS_PLUS";
            if (json.player.rank) this.rank = json.player.rank;

            this.hypixelDiscord = json.player?.socialMedia?.links?.DISCORD;

            this.name = json.player.displayname;
            this.name_lower = this.name.toLowerCase();
            this.nameHist = json.player.knownAliases;
            this.internalId = json.player._id;
            this.isLoggedIn = json.player.lastLogin > json.player.lastLogout;
            this.lastLogout = json.player.lastLogout;
            this.version = json.player.mcVersionRp;
            this.mostRecentGameType = json.player.mostRecentGameType;
            this.xp = json.player.networkExp;
            this.level =
                1.0 + -8750.0 / 2500.0 + Math.sqrt(((-8750.0 / 2500.0) * -8750.0) / 2500.0 + (2.0 / 2500.0) * this.xp);
            this.firstLogin = json.player.firstLogin;
            this.karma = json.player.karma;
            this.hypixelSaysWins = arcade.wins_simon_says;
            this.achievementPoints = numberify(json.player?.achievementPoints);
            this.plusColor = json.player.rankPlusColor;
            this.cloak = json.player.currentCloak;
            this.hat = json.player.currentHat;
            this.clickEffect = json.player.currentClickEffect;
            this.arcadeCoins = numberify(arcade.coins);
            this.hitwFinal = arcade.hitw_record_f;
            this.hitwQual = arcade.hitw_record_q;
            this.hitwWins = numberify(arcade.wins_hole_in_the_wall);
            this.hitwRounds = arcade.rounds_hole_in_the_wall;
            this.farmhuntWins = numberify(arcade.wins_farm_hunt);
            this.farmhuntShit = arcade.poop_collected;
            this.miniWallsWins = numberify(arcade.wins_mini_walls);
            this.footballWins = numberify(arcade.wins_soccer);
            this.enderSpleefWins = numberify(arcade.wins_ender);
            this.throwOutWins = numberify(arcade.wins_throw_out);
            this.galaxyWarsWins = numberify(arcade.sw_game_wins);
            this.dragonWarsWins = numberify(arcade.wins_dragonwars2);
            this.bountyHuntersWins = numberify(arcade.wins_oneinthequiver);
            this.blockingDeadWins = numberify(arcade.wins_dayone);
            this.hideAndSeekWins =
                numberify(arcade.seeker_wins_hide_and_seek) + numberify(arcade.hider_wins_hide_and_seek);
            this.zombiesWins = numberify(arcade.wins_zombies);
            this.ctwKills = json.player.achievements?.arcade_ctw_slayer;
            this.ctwWoolCaptured = json.player.achievements?.arcade_ctw_oh_sheep;
            this.pixelPaintersWins = numberify(arcade.wins_draw_their_thing);
            this.hnsKills = numberify(json.player.achievements?.arcade_hide_and_seek_hider_kills);

            this.seasonalWins.easter = numberify(arcade.wins_easter_simulator);
            this.seasonalWins.grinch = numberify(arcade.wins_grinch_simulator_v2);
            this.seasonalWins.halloween = numberify(arcade.wins_halloween_simulator);
            this.seasonalWins.scuba = numberify(arcade.wins_scuba_simulator);
            this.simTotal = this.seasonalWins.total =
                this.seasonalWins.easter +
                this.seasonalWins.grinch +
                this.seasonalWins.halloween +
                this.seasonalWins.scuba;

            for (let stat in arcade) {
                if (stat.includes("zombie")) {
                    this.zombies[stat] = arcade[stat];
                }
            }

            this.extras.blockingDeadKills = arcade.kills_dayone;
            this.extras.blockingDeadHeadshots = arcade.headshots_dayone;
            this.extras.bountyHuntersKills = arcade.kills_oneinthequiver;
            this.extras.bountyHuntersBountyKills = arcade.bounty_kills_oneinthequiver;
            this.extras.bountyHuntersDeaths = arcade.deaths_oneinthequiver;
            this.extras.dragonWarsKills = arcade.kills_dragonwars2;
            this.extras.footballGoals = arcade.goals_soccer;
            this.extras.footballPKicks = arcade.powerkicks_soccer;
            this.extras.footballKicks = arcade.kicks_soccer;
            this.extras.galaxyWarsKills = arcade.sw_kills;
            this.extras.galaxyWarsDeaths = arcade.sw_deaths;
            this.extras.HNSSeekerWins = arcade.seeker_wins_hide_and_seek;
            this.extras.HNSHiderWins = arcade.hider_wins_hide_and_seek;
            this.extras.hypixelSaysRounds = arcade.rounds_simon_says;
            this.extras.throwOutKills = arcade.kills_throw_out;
            this.extras.throwOutDeaths = arcade.deaths_throw_out;

            this.miniWalls.kit = arcade.miniwalls_activeKit;
            this.miniWalls.arrowsHit = arcade.arrows_hit_mini_walls;
            this.miniWalls.arrowsShot = arcade.arrows_shot_mini_walls;
            this.miniWalls.finalKills = arcade.final_kills_mini_walls;
            this.miniWalls.kills = arcade.kills_mini_walls;
            this.miniWalls.witherKills = arcade.wither_kills_mini_walls;
            this.miniWalls.deaths = arcade.deaths_mini_walls;
            this.miniWalls.witherDamage = arcade.wither_damage_mini_walls;

            this.arcadeWins = json.player.achievements?.arcade_arcade_winner;
            this.anyWins = json.player.achievements?.general_wins;

            this.combinedArcadeWins =
                numberify(this.wins) +
                numberify(this.hitwWins) +
                numberify(this.farmhuntWins) +
                numberify(this.hypixelSaysWins) +
                numberify(this.miniWallsWins) +
                numberify(this.footballWins) +
                numberify(this.enderSpleefWins) +
                numberify(this.throwOutWins) +
                numberify(this.galaxyWarsWins) +
                numberify(this.dragonWarsWins) +
                numberify(this.bountyHuntersWins) +
                numberify(this.blockingDeadWins) +
                numberify(this.hideAndSeekWins) +
                numberify(this.zombiesWins) +
                numberify(this.pixelPaintersWins) +
                numberify(this.simTotal);
        } else {
            for (let prop in this) {
                this[prop] = undefined;
            }
        }
    }
}

module.exports = Account;
