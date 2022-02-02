const Discord = require("discord.js");
const Database = require("hyarcade-requests/Database");

/**
 * @param {number} number
 * @returns {string}
 */
function formatNum(number) {
  return Intl.NumberFormat("en").format(number);
}

/**
 *
 * @param {*} list
 * @param {*} lbprop
 * @param {*} category
 * @param {*} maxamnt
 * @param {*} startingIndex
 * @returns {*}
 */
function stringifyList(list, lbprop, category, maxamnt = 10, startingIndex = 0) {
  let str = "";
  const length = Math.min(maxamnt, list?.length ?? 0);
  const sizedList = list.slice(0, length);

  let propVal;
  for (let i = startingIndex; i < sizedList.length; i += 1) {
    propVal = category == undefined ? sizedList[i]?.[lbprop] : sizedList[i]?.[category]?.[lbprop];
    // don't print if player has 0
    if (!((propVal ?? 0) > 0)) continue;

    const { name } = sizedList[i];

    // eslint-disable-next-line prefer-template
    const num = `\` ${i + 1}.`.padEnd(`\` ${[list.length - 1]}. `.length) + "`";

    str += `${num} **${name}** (\`${formatNum(propVal ?? 0)}\`)\n`;
  }
  return str.replace(/\\?_/g, "\\_");
}

/**
 * @param {string} stat
 * @param {string} category
 * @param {number} limit
 * @param {string} title
 * @returns {Discord.MessageEmbed}
 */
async function genEmbed(stat, category, limit, title) {
  const list = await Database.getLeaderboard(stat, category, undefined, true, false, limit);
  const string = stringifyList(list, stat, category, limit);

  const embed = new Discord.MessageEmbed()
    .setTitle(`${title}`)
    .setColor(0x44a3e7)
    .addField("------------- Lifetime -------------", string, true);

  return embed;
}

module.exports = async function SendBasicLB(webhook, stat, category, limit, title) {
  if (webhook?.id == undefined || webhook?.token == undefined) {
    throw new Error(`The webhook "${webhook}" is invalid!`);
  }

  const hook = new Discord.WebhookClient({ id: webhook.id, token: webhook.token });
  await hook.send({
    embeds: [await genEmbed(stat, category, limit, title)],
    username: webhook.username,
    avatarURL: webhook.pfp,
  });
  hook.destroy();
};
