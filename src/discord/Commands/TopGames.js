const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/Command");
const { getFromDB } = require("../BotUtils");
const BotUtils = require("../BotUtils");
const InteractionUtils = require("../interactions/InteractionUtils");
const CommandResponse = require("../Utils/CommandResponse");
const { ERROR_UNLINKED } = require("../Utils/Embeds/StaticEmbeds");

/**
 * @param acc
 */
function getGames(acc) {
    let games = [
        { name : "Party games", wins: acc.wins },
        { name : "HITW", wins : acc.hitwWins},
        { name : "Farm hunt", wins : acc.farmhuntWins},
        { name : "Hypixel says", wins : acc.hypixelSaysWins},
        { name : "Mini walls", wins : acc.miniWallsWins},
        { name : "Football", wins : acc.footballWins},
        { name : "Ender spleef", wins : acc.enderSpleefWins},
        { name : "Dragon wars", wins : acc.dragonWarsWins},
        { name : "Bounty hunters", wins : acc.bountyHuntersWins},
        { name : "Blocking dead", wins : acc.blockingDeadWins},
        { name : "Throw out", wins : acc.throwOutWins},
        { name : "Hide and seek", wins : acc.hideAndSeekWins},
        { name : "Zombies", wins : acc.zombiesWins},
        { name : "Galaxy wars", wins : acc.galaxyWarsWins},
        { name : "Pixel painters", wins : acc.pixelPaintersWins},
        { name : "Seasonal", wins : acc.simTotal},
    ];

    games = games.sort((a, b)=>{
        if(b.wins == undefined) {
            return -1;
        }

        if(a.wins == undefined) {
            return 1;
        }

        return b.wins - a.wins;
    });

    let str = "";
    let i = 0;

    for(let g of games) {
        if(g.wins != 0 && g.wins != undefined) {
            str += `${++i}) **${g.name}** (${g.wins})\n`;
        }
    }

    return str;

}

/**
 * @param acc1
 * @param acc2
 */
function getTimedAccount(acc1, acc2) {
    acc1.wins = (acc1.wins ?? 0) - (acc2?.wins ?? 0);
    acc1.hitwWins = (acc1.hitwWins ?? 0) - (acc2?.hitwWins ?? 0);
    acc1.farmhuntWins = (acc1.farmhuntWins ?? 0) - (acc2?.farmhuntWins ?? 0);
    acc1.hypixelSaysWins = (acc1.hypixelSaysWins ?? 0) - (acc2?.hypixelSaysWins ?? 0);
    acc1.miniWallsWins = (acc1.miniWallsWins ?? 0) - (acc2?.miniWallsWins ?? 0);
    acc1.footballWins = (acc1.footballWins ?? 0) - (acc2?.footballWins ?? 0);
    acc1.enderSpleefWins = (acc1.enderSpleefWins ?? 0) - (acc2?.enderSpleefWins ?? 0);
    acc1.dragonWarsWins = (acc1.dragonWarsWins ?? 0) - (acc2?.dragonWarsWins ?? 0);
    acc1.bountyHuntersWins = (acc1.bountyHuntersWins ?? 0) - (acc2?.bountyHuntersWins ?? 0);
    acc1.blockingDeadWins = (acc1.blockingDeadWins ?? 0) - (acc2?.blockingDeadWins ?? 0);
    acc1.throwOutWins = (acc1.throwOutWins ?? 0) - (acc2?.throwOutWins ?? 0);
    acc1.hideAndSeekWins = (acc1.hideAndSeekWins ?? 0) - (acc2?.hideAndSeekWins ?? 0);
    acc1.zombiesWins = (acc1.zombiesWins ?? 0) - (acc2?.zombiesWins ?? 0);
    acc1.galaxyWarsWins = (acc1.galaxyWarsWins ?? 0) - (acc2?.galaxyWarsWins ?? 0);
    acc1.pixelPaintersWins = (acc1.pixelPaintersWins ?? 0) - (acc2?.pixelPaintersWins ?? 0);
    acc1.simTotal = (acc1.simTotal ?? 0) - (acc2?.simTotal ?? 0);

    return acc1;
}

module.exports = new Command("top-games", ["*"], async (args, rawMsg, interaction) => {
    let plr = args[0];
    let timetype = args[1];
    let acc;
    if(interaction == undefined) {
        acc = await BotUtils.resolveAccount(plr, rawMsg, args.length != 2);
    } else {
        acc = await InteractionUtils.resolveAccount(interaction);
        if (acc == undefined) return new CommandResponse("", ERROR_UNLINKED);
    }

    if(timetype == "d") {
        let daily = await getFromDB("dayaccounts");
        let dayAcc = await daily.find(a=>a?.uuid==acc.uuid);
        acc = getTimedAccount(acc, dayAcc);
    } else if(timetype == "w") {
        let weekly = await getFromDB("weeklyaccounts");
        let dayAcc = await weekly.find(a=>a?.uuid==acc.uuid);
        acc = getTimedAccount(acc, dayAcc);
    } else if(timetype == "m") {
        let monthly = await getFromDB("monthlyaccounts");
        let dayAcc = await monthly.find(a=>a?.uuid==acc.uuid);
        acc = getTimedAccount(acc, dayAcc);
    }

    let embed = new MessageEmbed()
        .setTitle(acc.name + " top games won")
        .setDescription(getGames(acc))
        .setColor(0x44a3e7);
    return { res: "", embed: embed };
});
