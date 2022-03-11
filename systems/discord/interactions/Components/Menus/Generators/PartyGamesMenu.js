const { MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");

/**
 * @param uuid
 * @param game
 * @param time
 * @returns {MessageActionRow[]}
 */
function PartyGamesMenu(uuid, game, time) {
  const row = new MessageActionRow();
  const menu = new MessageSelectMenu()
    .setMaxValues(1)
    .setMinValues(1)
    .setCustomId(`pg:${uuid}:${time}:menu`)
    .setPlaceholder("Select a party game")
    .addOptions([
      {
        label: "Overall",
        value: "Party Games",
      },
      {
        label: "Animal Slaughter",
        value: "Animal Slaughter",
      },
      {
        label: "Anvil Spleef",
        value: "Anvil Spleef",
      },
      {
        label: "Bombardment",
        value: "Bombardment",
      },
      {
        label: "Chicken Rings",
        value: "Chicken Rings",
      },
      {
        label: "Dive",
        value: "Dive",
      },
      {
        label: "High Ground",
        value: "High Ground",
      },
      {
        label: "Hoe Hoe Hoe",
        value: "Hoe Hoe Hoe",
      },
      {
        label: "Jigsaw Rush",
        value: "Jigsaw Rush",
      },
      {
        label: "Parkour",
        value: "Parkour",
      },
      {
        label: "Lab Escape",
        value: "Lab Escape",
      },
      {
        label: "Lawn Moower",
        value: "Lawn Moower",
      },
      {
        label: "Minecart Racing",
        value: "Minecart Racing",
      },
      {
        label: "RPG-16",
        value: "RPG-16",
      },
      {
        label: "Spider Maze",
        value: "Spider Maze",
      },
      {
        label: "Avalanche",
        value: "Avalanche",
      },
      {
        label: "Misc Pigs",
        value: "Misc Pigs",
      },
      {
        label: "Trampolinio",
        value: "Trampolinio",
      },
      {
        label: "Workshop",
        value: "Workshop",
      },
      {
        label: "Shooting Range",
        value: "Shooting Range",
      },
      {
        label: "Frozen Floor",
        value: "Frozen Floor",
      },
      {
        label: "Cannon Painting",
        value: "Cannon Painting",
      },
      {
        label: "Fire Leapers",
        value: "Fire Leapers",
      },
      {
        label: "Super Sheep",
        value: "Super Sheep",
      },
    ]);

  row.addComponents(menu);

  const row2 = new MessageActionRow();

  const lifetime = new MessageButton()
    .setCustomId(`pg:${uuid}:lifetime:${game}:b`)
    .setLabel("Lifetime")
    .setStyle("SUCCESS")
    .setDisabled(time == "lifetime");

  const day = new MessageButton()
    .setCustomId(`pg:${uuid}:day:${game}:b`)
    .setLabel("Daily")
    .setStyle("SECONDARY")
    .setDisabled(time == "day");

  const weekly = new MessageButton()
    .setCustomId(`pg:${uuid}:weekly:${game}:b`)
    .setLabel("Weekly")
    .setStyle("SECONDARY")
    .setDisabled(time == "weekly");

  const monthly = new MessageButton()
    .setCustomId(`pg:${uuid}:monthly:${game}:b`)
    .setLabel("Monthly")
    .setStyle("SECONDARY")
    .setDisabled(time == "monthly");

  row2.addComponents(lifetime, day, weekly, monthly);

  return [row2, row];
}

module.exports = PartyGamesMenu;
