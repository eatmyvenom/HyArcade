const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");

let WhoIS = new Command("whois", ["*"], async (args, rawMsg) => {
    let plr = args[0];
    let acc = await BotUtils.resolveAccount(plr, rawMsg, args.length != 2);
    let embed = new MessageEmbed().setTitle(`${acc.name} discord`).setDescription(`Discord ID: ${acc.discord}\n<@${acc.discord}>`).setColor(0x44a3e7);
    return { res: "", embed: embed };
});

export { WhoIS };