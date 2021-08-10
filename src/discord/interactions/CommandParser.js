const Runtime = require("../../Runtime");
const logger = require("hyarcade-logger");
const {
    addAccounts
} = require("../../listUtils");
const InteractionUtils = require("./InteractionUtils");
const {
    MessageEmbed,
    CommandInteraction,
} = require("discord.js");

const EZ = require("../Commands/EZ");
const Info = require("../Commands/Info");
const Susser = require("../Commands/Susser");
const GameCounts = require("../Commands/GameCounts");
const LastUpdate = require("../Commands/LastUpdate");
const Leaderboard = require("../Commands/Leaderboard");
const ButtonGenerator = require("./Buttons/ButtonGenerator");
const Ping = require("../Commands/Ping");
const TopGames = require("../Commands/TopGames");
const {
    ERROR_DATABASE_ERROR
} = require("../Utils/Embeds/DynamicEmbeds");
const {
    ERROR_API_DOWN,
    ERROR_UNLINKED
} = require("../Utils/Embeds/StaticEmbeds");
const CommandResponse = require("../Utils/CommandResponse");
const GetDataRaw = require("../Commands/GetDataRaw");
const Quake = require("../Commands/Quake");
const Zombies = require("../Commands/Zombies");
const Help = require("../Commands/Help");
const Stats = require("../Commands/Stats");
const Arena = require("../Commands/Arena");
const PBall = require("../Commands/PBall");

let Commands = null;

/**
 *
 * @param {CommandInteraction} interaction
 * @returns {CommandResponse | object}
 */
module.exports = async (interaction) => {
    if(Commands == null) {
        logger.debug("ECMA modules are null, they need to be added!");
        logger.info("Initializing ECMA modules");
        Commands = {};
        const {
            Profile
        } = await import("../Commands/Profile.mjs");
        const {
            WhoIS
        } = await import("../Commands/WhoIS.mjs");
        const {
            Verify
        } = await import("../Commands/LinkMe.mjs");
        const {
            Compare
        } = await import("../Commands/Compare.mjs");
        Commands.Profile = Profile;
        Commands.WhoIS = WhoIS;
        Commands.Verify = Verify;
        Commands.Compare = Compare;
    }

    if(interaction.guildID == "808077828842455090") return;
    const authorID = interaction.member.user.id;
    const opts = interaction.options;

    if(Runtime.fromJSON().dbERROR) {
        logger.warn("Refusing to run command because database is corrupted!");
        const res = new CommandResponse("", ERROR_DATABASE_ERROR);
        res.priv = true;

        return res;
    }

    if(Runtime.fromJSON().apiDown) {
        logger.warn("Refusing to run command because API is down!");
        const res = new CommandResponse("", ERROR_API_DOWN);
        res.priv = true;

        return res;
    }

    switch(interaction.commandName) {
    case "stats": {
        return Stats.execute([opts.getString("player"), opts.getString("game")], authorID, null, interaction);
    }

    case "leaderboard": {
        const res = await Leaderboard.execute(
            [
                opts.getString("game"),
                opts.getString("type"),
                opts.getInteger("amount"),
                opts.getInteger("start"),
            ],
            authorID,
            null,
            interaction
        );
        const e = res.embed;
        if(res.game != undefined) {
            const buttons = await ButtonGenerator.getLBButtons(res.start, res.game, opts.getString("type"));
            return new CommandResponse("", e, undefined, buttons);
        }
        return new CommandResponse("", e);
    }

    case "add-account": {
        await interaction.defer({
            ephemeral: true
        });

        const names = opts.getString("accounts").value.split(" ");
        let res = await addAccounts("others", names);
        res = `\`\`\`\n${res}\n\`\`\``;
        const embed = new MessageEmbed()
            .setTitle("Accounts added")
            .setDescription(res)
            .setFooter(
                "It will take a little while for these accounts to be fully added to the database, please be patient."
            )
            .setTimestamp(Date.now())
            .setColor(0x44a3e7);
        return {
            res: "",
            embed
        };
    }

    case "unlinkedstats": {
        const embed = new MessageEmbed()
            .setTitle("Use /stats")
            .setColor(0xd69323)
            .setDescription(
                "This command has been merged with /stats! If you are having troubles getting an unlinked player then use their uuid instead."
            );

        return {
            res: undefined,
            embed
        };
    }

    case "name-history": {
        const acc = await InteractionUtils.resolveAccount(interaction);
        if(acc == undefined) {
            return new CommandResponse("", ERROR_UNLINKED);
        }
        const embed = new MessageEmbed()
            .setTitle(`${acc.name} IGN history`)
            .setDescription(([].concat(acc.nameHist)).join("\n"))
            .setColor(0x44a3e7);
        return {
            res: "",
            embed
        };
    }

    case "whois": {
        return await Commands.WhoIS.execute([opts.getString("player")], authorID, null, interaction);
    }

    case "get-data-raw": {
        return await GetDataRaw.execute([opts.getString("player"), opts.getString("path")], authorID, null, interaction);
    }

    case "verify": {
        return await Commands.Verify.execute([opts.getString("player")], authorID, null, interaction);
    }

    case "game-counts": {
        return await GameCounts.execute([opts.getString("game")], authorID, null, interaction);
    }

    case "info": {
        return await Info.execute([], authorID, null, interaction);
    }

    case Susser.name: {
        return await Susser.execute([opts.getString("player")], authorID, null, interaction);
    }

    case Commands.Compare.name: {
        return await Commands.Compare.execute(
            [opts.getString("player2"), opts.getString("player2"), opts.getString("game")],
            authorID,
            null,
            interaction
        );
    }

    case Commands.Profile.name: {
        return await Commands.Profile.execute([opts.getString("player")], authorID, null, interaction);
    }

    case "top-games": {
        return await TopGames.execute([opts.getString("player"), opts.getString("time")], authorID, null, interaction);
    }

    case "quake": {
        return await Quake.execute([opts.getString("player")], authorID, null, interaction);
    }

    case "zombies": {
        return await Zombies.execute([opts.getString("player")], authorID, null, interaction);
    }

    case "arena": {
        return await Arena.execute([opts.getString("player")], authorID, null, interaction);
    }

    case "paintball": {
        return await PBall.execute([opts.getString("player")], authorID, null, interaction);
    }

    case "arcade": {
        if(interaction.options.getSubCommand() == "ez") {
            logger.debug("Adding ez button to message");
            const buttons = await ButtonGenerator.getEZ();
            const res = await EZ.execute([], authorID, null, interaction);
            res.b = buttons;
            return res;
        }

        if(interaction.options.getSubCommand() == "lastupdate") {
            return await LastUpdate.execute([], authorID, null, interaction);
        }

        if(interaction.options.getSubCommand() == "ping") {
            return await Ping.execute([], authorID, null, interaction);
        }

        if(interaction.options.getSubCommand() == "help") {
            return await Help.execute([], authorID, null, interaction);
        }
    }
    }
};
