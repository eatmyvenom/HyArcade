const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");
const InteractionUtils = require("../interactions/InteractionUtils");
const CommandResponse = require("../Utils/CommandResponse");
const { ERROR_UNLINKED } = require("../Utils/Embeds/StaticEmbeds");

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

module.exports = new Command("topgames", ["*"], async (args, rawMsg, interaction) => {
    let plr = args[0];
    let acc;
    if(interaction == undefined) {
        acc = await BotUtils.resolveAccount(plr, rawMsg, args.length != 2);
    } else {
        acc = await InteractionUtils.resolveAccount(interaction);
        return new CommandResponse("", ERROR_UNLINKED);
    }
    let embed = new MessageEmbed()
        .setTitle(acc.name + " top games won")
        .setDescription(getGames(acc))
        .setColor(0x44a3e7);
    return { res: "", embed: embed };
});
