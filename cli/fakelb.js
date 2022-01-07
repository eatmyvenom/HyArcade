const FakeLB = require("../src/discord/images/FakeLB");
const Discord = require("discord.js");

/**
 * 
 * @param {string[]} args 
 * @returns {*}
 */
async function main (args) {
  const lb = await FakeLB(args[4], args[5], args[6]);

  const hook = new Discord.WebhookClient({ url: args[3] });
  await hook.send({ content: `<t:${Math.floor(Date.now() / 1000)}:F>`, files: [lb], username: "Leaderboard Screenshotter", avatarURL: "https://i.vnmm.dev/arcadedisc.png" });
  hook.destroy();
}

module.exports = main;