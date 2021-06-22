const BotUtils = require("../BotUtils");
const { addAccounts } = require("../../listUtils");
const { MessageEmbed } = require("discord.js");
const InteractionUtils = require("./InteractionUtils");
const Runtime = require("../../Runtime");
const embeds = require("../Embeds");

const Leaderboard = require("../Commands/Leaderboard");
const GameCounts = require("../Commands/GameCounts");
const Boosters = require("../Commands/Boosters");
const Status = require("../Commands/Status");
const Info = require("../Commands/Info");
const Susser = require("../Commands/Susser");
const MiniWalls = require("../Commands/MiniWalls");
const MiniWallsLB = require("../Commands/MiniWallsLB");
const ButtonGenerator = require("./Buttons/ButtonGenerator");
const { logger } = require("../../utils");
let Commands = null;
function getArg(i, a) {
    let v = i.options.get(a);
    if (v != undefined) {
        return v.value;
    }
    return undefined;
}

module.exports = async (interaction) => {
    if (Commands == null) {
        logger.debug("EMCA modules are null, they need to be added!");
        logger.info("Initializing EMCA modules");
        Commands = {};
        let { Profile } = await import("../Commands/Profile.mjs");
        let { WhoIS } = await import("../Commands/WhoIS.mjs");
        let { Verify } = await import("../Commands/LinkMe.mjs");
        let { Compare } = await import("../Commands/Compare.mjs");
        Commands.Profile = Profile;
        Commands.WhoIS = WhoIS;
        Commands.Verify = Verify;
        Commands.Compare = Compare;
    }

    if (!interaction.isCommand()) return;
    if (interaction.guildID == "808077828842455090") return;
    let authorID = interaction.member.user.id;
    let opts = interaction.options;

    if (Runtime.fromJSON().dbERROR) {
        logger.warn("Refusing to run command because database is corrupted!");
        return { res: "", embed: embeds.dbded };
    }

    if (Runtime.fromJSON().apiDown) {
        logger.warn("Refusing to run command because API is down!");
        return { res: "", embed: embeds.apiDed };
    }

    switch (interaction.commandName) {
        case "stats": {
            let game = getArg(interaction, "game");
            let acc = await InteractionUtils.resolveAccount(interaction, "player");
            let res = await BotUtils.getStats(acc, "" + game);
            let e = res.embed;
            logger.debug("Adding stats buttons to message");
            let buttons = await ButtonGenerator.getStatsButtons(res.game, acc.uuid);
            return { res: "", embed: e, b: buttons };
        }

        case "leaderboard": {
            let res = await Leaderboard.execute(
                [
                    getArg(interaction, "game"),
                    getArg(interaction, "type"),
                    getArg(interaction, "amount"),
                    getArg(interaction, "start"),
                ],
                authorID
            );
            let e = res.embed;
            if (res.game != undefined) {
                let buttons = await ButtonGenerator.getLBButtons(res.start, res.game, getArg(interaction, "type"));
                return { res: "", embed: e, b: buttons };
            }
            return { res: "", embed: e };
        }

        case "addaccount": {
            await interaction.defer();

            let names = opts.get("accounts").value.split(" ");
            let res = await addAccounts("others", names);
            res = "```\n" + res + "\n```";
            let embed = new MessageEmbed()
                .setTitle("Accounts added")
                .setDescription(res)
                .setFooter(
                    "It will take a little while for these accounts to be fully added to the database, please be patient."
                )
                .setTimestamp(Date.now())
                .setColor(0x44a3e7);
            return { res: "", embed: embed };
        }

        case "unlinkedstats": {
            let embed = new MessageEmbed()
                .setTitle("Use /stats")
                .setColor(0xd69323)
                .setDescription(
                    "This command has been merged with /stats! If you are having troubles getting an unlinked player then use their uuid instead."
                );

            return { res: undefined, embed: embed };
        }

        case "namehistory": {
            let acc = await InteractionUtils.resolveAccount(interaction);
            let embed = new MessageEmbed()
                .setTitle(`${acc.name} IGN history`)
                .setDescription([].concat(acc.nameHist).split("\n"))
                .setColor(0x44a3e7);
            return { res: "", embed: embed };
        }

        case "whois": {
            return await Commands.WhoIS.execute([getArg(interaction, "player")], authorID, null, interaction);
        }

        case "getdataraw": {
            let acc = await InteractionUtils.resolveAccount(interaction);
            let path = opts.get("path").value;
            let embed = new MessageEmbed()
                .setTitle(acc.name + "." + path)
                .setDescription(acc[path])
                .setColor(0x44a3e7);
            return { res: "", embed: embed };
        }

        case "verify": {
            return await Commands.Verify.execute([getArg(interaction, "player")], authorID, null, interaction);
        }

        case "gamecounts": {
            return await GameCounts.execute([getArg(interaction, "game")], authorID, null, interaction);
        }

        case "status": {
            return await Status.execute([getArg(interaction, "player")], authorID, null, interaction);
        }

        case "info": {
            return await Info.execute([], authorID, null, interaction);
        }

        case Boosters.name: {
            return await Boosters.execute([], authorID, null, interaction);
        }

        case "arcadehelp": {
            if (opts.get("topic") == undefined) {
                return { res: "", embed: InteractionUtils.helpEmbed() };
            } else {
                return { res: "", embed: InteractionUtils.helpTopic(opts.get("topic").value) };
            }
        }

        case Susser.name: {
            return await Susser.execute([getArg(interaction, "player")], authorID, null, interaction);
        }

        case Commands.Compare.name: {
            return await Commands.Compare.execute(
                [getArg(interaction, "player1"), getArg(interaction, "player2"), getArg(interaction, "game")],
                authorID,
                undefined,
                interaction
            );
        }

        case Commands.Profile.name: {
            return await Commands.Profile.execute([getArg(interaction, "player")], authorID, null, interaction);
        }
    }

    if (interaction.commandName == "miniwalls") {
        switch (interaction.options[0].options[0].name) {
            case "stats": {
                let newI = interaction.options[0].options[0];
                newI.defer = interaction.defer;
                newI.member = interaction.member;
                return await MiniWalls.execute(
                    [interaction.options[0].options[0].options[0].value],
                    authorID,
                    undefined,
                    newI
                );
            }

            case "leaderboard": {
                let newI = interaction.options[0].options[0];
                newI.defer = interaction.defer;
                newI.member = interaction.member;
                return await MiniWallsLB.execute(
                    [
                        interaction.options[0].options[0].options[0].value,
                        interaction.options[0].options[0].options[1].value,
                        interaction.options[0].options[0].options[2].value,
                    ],
                    authorID,
                    undefined,
                    newI
                );
            }
        }
    }
};
