const {
  MessageEmbed
} = require("discord.js");
const Command = require("../../classes/Command");
const BotRuntime = require("../BotRuntime");
const InteractionUtils = require("../interactions/InteractionUtils");

module.exports = new Command("cheatdetector", ["156952208045375488"], async (args, rawMsg, interaction) => {
  let hax = 0;
  const reasons = [];
  const plr = args[0];
  const haxlist = await BotRuntime.getFromDB("hackerlist");
  let acc;
  if(interaction == undefined) {
    acc = await BotRuntime.resolveAccount(plr, rawMsg);
  } else {
    acc = await InteractionUtils.resolveAccount(interaction);
  }

  if(acc.guildID == "608066958ea8c9abb0610f4d") {
    hax = 100;
    reasons.push("Member of Tajik guild");
  }

  if(acc.miniWalls.kills > acc.miniWalls.wins * 15) {
    hax += 10;
    reasons.push("Has gotten more than 15 kills on average per mini walls win");
  }

  if(acc.miniWalls.kills < acc.miniWalls.wins) {
    hax += 30;
    reasons.push("Has gotten less kills than mini walls wins");
  }

  if(acc.miniWalls.kills + acc.miniWalls.finalKills > acc.miniWalls.deaths * 5) {
    hax += 25;
    reasons.push("Has greater than 5 KDR in miniwalls");
  }

  if(acc.throwOut.kills > acc.throwOut.deaths * 7) {
    hax += 25;
    reasons.push("Has greater than 7 KDR in throw out");
  }

  if(acc.throwOut.kills < acc.throwOut.wins) {
    hax += 30;
    reasons.push("Has gotten less throw out kills than throw out wins");
  }

  if(acc.miniWallsWins > acc.miniWalls.deaths * 1) {
    hax += 15;
    reasons.push("Has died less than 1 times per mini walls win");
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

  const embed = new MessageEmbed()
    .setTitle(`Level of ${acc.name}`)
    .setColor(0x8c54fe)
    .setDescription(
      "Levels above 40 should be considered most likely cheating. Levels above 25 should most likely be dodged in queue."
    )
    .addField("Level", `${hax}`, false)
    .addField("Reasons", `${reasons.join("\n")}`, false);

  return {
    res: "",
    embed
  };
});
