const {
    MessageEmbed
} = require("discord.js");
const {
    HypixelApi,
    mojangRequest
} = require("hyarcade-requests");
const Command = require("../../classes/Command");
const CommandResponse = require("../Utils/CommandResponse");
const {
    ERROR_IGN_UNDEFINED
} = require("../Utils/Embeds/StaticEmbeds");

/**
 * @param {number} n
 * @returns {string}
 */
function numberify(n) {
    let r = Intl.NumberFormat("en").format(Number(n).toFixed(2));
    return r;
}

/**
 * @param {string} s
 * @returns {string}
 */
function wordify(s) {
    return ("" + s).replace(/_/g, " ");
}

module.exports = new Command("arena", ["*"], async (args, rawMsg, interaction) => {
    let plr = args[0];
    let uuid = plr.length > 31 ? plr : await mojangRequest.getUUID(plr);
    if(uuid == undefined) {
        return new CommandResponse("", ERROR_IGN_UNDEFINED);
    }
    await interaction.defer();
    let acc = await HypixelApi.player(uuid);
    let data = acc.player;
    let arena = data?.stats?.Arena;

    let damage = (arena?.damage_1v1 ?? 0) + (arena?.damage_2v2 ?? 0) + (arena?.damage_4v4 ?? 0);
    let deaths = (arena?.deaths_1v1 ?? 0) + (arena?.deaths_2v2 ?? 0) + (arena?.deaths_4v4 ?? 0);
    let kills = (arena?.kills_1v1 ?? 0) + (arena?.kills_2v2 ?? 0) + (arena?.kills_4v4 ?? 0);
    let heal = (arena?.healed_1v1 ?? 0) + (arena?.healed_2v2 ?? 0) + (arena?.healed_4v4 ?? 0);
    let losses = (arena?.losses_1v1 ?? 0) + (arena?.losses_2v2 ?? 0) + (arena?.losses_4v4 ?? 0);

    let embed = new MessageEmbed()
        .setTitle(data.displayname + " Arena stats")
        .addField("-----Overall stats-----",
            `**Wins** - ${numberify(arena?.wins ?? 0)}\n` +
            `**Losses** - ${numberify(losses)}\n` +
            `**Kills** - ${numberify(kills)}\n` +
            `**Deaths** - ${numberify(deaths)}\n` +
            `**Damage** - ${numberify(damage)}\n` +
            `**Healed** - ${numberify(heal)}\n`,
            true
        )
        .addField("---------Info----------",
            `**Offense** - ${wordify(arena?.offensive)}\n` +
            `**Utility** - ${wordify(arena?.utility)}\n` +
            `**Support** - ${wordify(arena?.support)}\n` +
            `**Ultimate** - ${wordify(arena?.ultimate)}\n` +
            `**Coins** - ${numberify(arena?.coins ?? 0)}`,
            true
        )
        .addField("---------Ratios--------",
            `**K/D** - ${numberify(kills / deaths)}\n` +
            `**K/Wins** - ${numberify(kills / (arena?.wins ?? 0))}\n` +
            `**D/Wins** - ${numberify(deaths / (arena?.wins ?? 0))}\n` +
            `**Dmg/D** - ${numberify(damage / deaths)}\n` +
            `**Heal/D** - ${numberify(heal / deaths)}\n`,
            true
        )
        .setThumbnail("https://crafatar.com/renders/head/" + uuid + "?overlay")
        .setColor(0x44a3e7);
    return new CommandResponse("", embed);
});
