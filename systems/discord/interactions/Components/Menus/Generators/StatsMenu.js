const { MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");

/**
 * @param uuid
 * @param time
 * @param game
 * @returns {MessageActionRow[]}
 */
function StatsMenu(uuid, time, game) {
  const row = new MessageActionRow();
  const menu = new MessageSelectMenu()
    .setMaxValues(1)
    .setMinValues(1)
    .setCustomId(`s:${uuid}:${time}:${game}:menu`)
    .setPlaceholder("Select game to see stats from")
    .addOptions([
      {
        label: "Overall Arcade",
        value: "arc",
        description: "Overall stats about arcade games",
      },
      {
        label: "Blocking dead",
        value: "bd",
        description: "Hypixel arcade blocking dead stats",
      },
      {
        label: "Bounty hunters",
        value: "bh",
        description: "Hypixel arcade bounty hunters stats",
      },
      {
        label: "Capture the wool",
        value: "ctw",
        description: "Hypixel arcade capture the wool stats",
      },
      {
        label: "Dragon wars",
        value: "dw",
        description: "Hypixel arcade dragon wars stats",
      },
      {
        label: "Ender spleef",
        value: "es",
        description: "Hypixel arcade ender spleef stats",
      },
      {
        label: "Farm hunt",
        value: "fh",
        description: "Hypixel arcade farm hunt stats",
      },
      {
        label: "Football",
        value: "fb",
        description: "Hypixel arcade football stats",
      },
      {
        label: "Galaxy wars",
        value: "gw",
        description: "Hypixel arcade galaxy wars stats",
      },
      {
        label: "Hide and seek",
        value: "hns",
        description: "Hypixel arcade hide and seek stats",
      },
      {
        label: "Hole in the wall",
        value: "hitw",
        description: "Hypixel arcade hole in the wall stats",
      },
      {
        label: "Hypixel says",
        value: "hs",
        description: "Hypixel arcade hypixel says stats",
      },
      {
        label: "Mini walls",
        value: "mw",
        description: "Hypixel arcade mini walls stats",
      },
      {
        label: "Party games",
        value: "pg",
        description: "Hypixel arcade party games stats",
      },
      {
        label: "Pixel painters",
        value: "pp",
        description: "Hypixel arcade pixel painters stats",
      },
      {
        label: "Seasonal games",
        value: "sim",
        description: "Stats for all of the hypixel seasonal games",
      },
      {
        label: "Throw out",
        value: "to",
        description: "Hypixel arcade throw out stats",
      },
      {
        label: "Zombies",
        value: "z",
        description: "Hypixel arcade zombies stats",
      },
    ]);

  row.addComponents(menu);

  const row2 = new MessageActionRow();

  const lifetime = new MessageButton()
    .setCustomId(`s:${uuid}:lifetime:${game}:b`)
    .setLabel("Lifetime")
    .setStyle("SUCCESS")
    .setDisabled(time == "lifetime");

  const day = new MessageButton()
    .setCustomId(`s:${uuid}:day:${game}:b`)
    .setLabel("Daily")
    .setStyle("SECONDARY")
    .setDisabled(time == "day");

  const weekly = new MessageButton()
    .setCustomId(`s:${uuid}:weekly:${game}:b`)
    .setLabel("Weekly")
    .setStyle("SECONDARY")
    .setDisabled(time == "weekly");

  const monthly = new MessageButton()
    .setCustomId(`s:${uuid}:monthly:${game}:b`)
    .setLabel("Monthly")
    .setStyle("SECONDARY")
    .setDisabled(time == "monthly");

  row2.addComponents(lifetime, day, weekly, monthly);

  return [row, row2];
}

module.exports = StatsMenu;
