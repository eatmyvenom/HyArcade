const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/Command");
const utils = require("../../utils");
const BotUtils = require("../BotUtils");
const InteractionUtils = require("../interactions/InteractionUtils");

module.exports = new Command("cheatdetector", ["*"], async (args, rawMsg, interaction) => {
    let hax = 0;
    let reasons = [];
    let plr = args[0];
    let haxlist = BotUtils.fileCache.hacks;
    let acc;
    if (interaction == undefined) {
        acc = await BotUtils.resolveAccount(plr, rawMsg);
    } else {
        acc = await InteractionUtils.resolveAccount(interaction, 0);
    }


    if(acc.guildID == "608066958ea8c9abb0610f4d") {
        hax = 100;
        reasons.push("Member of Tajik guild");
    }

    if(acc.miniWalls.kills > acc.miniWallsWins * 8) {
        hax += 10;
        reasons.push("Has gotten more than 8 kills per mini walls win");
    }

    if(acc.miniWalls.kills > acc.miniWalls.deaths * 3) {
        hax += 25;
        reasons.push("Has greater than 3 KDR in miniwalls");
    }

    if(acc.miniWallsWins > acc.miniWalls.deaths * 1.5) {
        hax += 15;
        reasons.push("Has died less than 1.5 times per mini walls win");
    }

    if(acc.name.toLowerCase().includes("tajik")) {
        hax += 30;
        reasons.push("Has a name associated with cheating guild \"Tajik\"");
    }

    if(haxlist.includes(acc.uuid) || haxlist.includes(acc.name)) {
        hax += 100;
        reasons.push("Is a known hacker either by footage or by admission");
    }


    if(reasons.length == 0) {
        reasons.push("Nothing detected");
    }

    let embed = new MessageEmbed()
        .setTitle("Cheat level of " + acc.name)
        .setColor(0x8c54fe)
        .setDescription("Cheat levels above 40 should be considered most likely cheating. Levels above 25 should most likely be dodged in queue.")
        .addField("Cheat level", hax, false)
        .addField("Reasons", reasons, false);

    return { res: "", embed: embed };
});
