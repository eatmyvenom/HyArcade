const { MessageActionRow, MessageSelectMenu } = require("discord.js");

/**
 * @param uuid
 * @param game
 * @returns {MessageActionRow}
 */
function ArcadeAPMenu(uuid, game) {
  const row = new MessageActionRow();
  const menu = new MessageSelectMenu()
    .setMaxValues(1)
    .setMinValues(1)
    .setCustomId(`ap:${uuid}:${game}:menu`)
    .setPlaceholder("Select game")
    .addOptions([
      {
        label: "All Games",
        value: "all",
      },
      {
        label: "Overall Arcade",
        value: "overall",
      },
      {
        label: "Blocking dead",
        value: "blockingDead",
      },
      {
        label: "Bounty hunters",
        value: "bountyHunters",
      },
      {
        label: "Capture the wool",
        value: "captureTheWool",
      },
      {
        label: "Dragon wars",
        value: "dragonWars",
      },
      {
        label: "Ender spleef",
        value: "enderSpleef",
      },
      {
        label: "Farm hunt",
        value: "farmHunt",
      },
      {
        label: "Football",
        value: "football",
      },
      {
        label: "Galaxy wars",
        value: "galaxyWars",
      },
      {
        label: "Hide and Seek",
        value: "hideAndSeek",
      },
      {
        label: "Hole in the wall",
        value: "holeInTheWall",
      },
      {
        label: "Hypixel says",
        value: "hypixelSays",
      },
      {
        label: "Mini walls",
        value: "miniWalls",
      },
      {
        label: "Party games",
        value: "partyGames",
      },
      {
        label: "Pixel painters",
        value: "pixelPainters",
      },
      {
        label: "Throw out",
        value: "throwOut",
      },
      {
        label: "Zombies",
        value: "zombies",
      },
    ]);

  row.addComponents(menu);
  return row;
}

module.exports = ArcadeAPMenu;
