const {
  MessageEmbed, TextChannel
} = require("discord.js");
const Command = require("../../classes/Command");
const BotRuntime = require("../BotRuntime");

/**
 * @param {string} name
 * @param {string} link
 * @returns {object}
 */
function makeField (name, link) {
  return {
    name,
    value: `[Server Invite](${link})`,
    inline: true,
  };
}

module.exports = new Command("mkinv", ["%trusted%"], async (args) => {
  const channelID = args[0];
  const msgID = args[1];

  /** @type {TextChannel} */
  const channel = await BotRuntime.client.channels.fetch(channelID);
  const embed = new MessageEmbed()
    .setTitle("Arcade servers")
    .setDescription("List of other arcade discord servers")
    .setColor(0x2f3136)
    .addFields([
      makeField("<:Arcade:863593216220987403> Arcade Community", "https://discord.gg/J6UMkQrjpV"),
      makeField("<:BD:779068503503536138> Blocking Dead", "https://discord.gg/mGp4JjmpDq"),
      makeField("<:BH:779068496038330400> Bounty Hunters", "https://discord.gg/J6UMkQrjpV"),
      makeField("<:CTW:779068480792166461> Capture the wool", "https://discord.gg/7dwQ7fZXt5"),
      makeField("<:CA:779068489273049138> Creeper Attack", "https://discord.gg/PBypGgf"),
      makeField("<:DW:779068471517773914> Dragon Wars", "https://discord.gg/MrxAFvMrBf"),
      makeField("<:ES:779068461564690453> Ender Spleef", "https://discord.gg/WnPP3aq53X"),
      makeField("<:FH:779067965294903366> Farm Hunt", "https://discord.gg/zdzPgPEaSc"),
      makeField("<:FB:779068436726546453> Football", "https://discord.gg/rGTkxSG"),
      makeField("<:GW:779067916737314816> Galaxy Wars", "https://discord.gg/4fBMNA9M4B"),
      makeField("<:HaS:779067904435028068> Hide and Seek", "https://discord.gg/M4KjeH3uKq"),
      makeField("<:HitW:779067896973230093> Hole in the Wall", "https://discord.gg/Gh24vw5b54"),
      makeField("<:HS:779067888983474187> Hypixel Says", "https://discord.gg/GzjN5c4zze"),
      makeField("<:MiW:779067880696315994> Mini Walls", "https://discord.gg/a3mFVpMPaf"),
      makeField("<:PG:779067862165487616> Party Games", "https://discord.gg/zkBV2j7"),
      makeField("<:PP:779067828241956885> Pixel Painters", "https://discord.gg/P6sGse3sWq"),
      makeField("<:TO:779067808624672779> Throw Out", "https://discord.gg/Z4AbEvX6dM"),
      makeField("<:Zomb:779067783753105488> Zombies", "https://discord.gg/rdZKx4b"),
      makeField("<:seasonal:784954031604367400> Seasonal Games", "https://discord.gg/X28ucyys8A"),
      makeField("📊 Leaderboards", "https://discord.gg/KP4hFcj4Du"),
      makeField("<:ArcadeBot:840086063258927115> HyArcade", "https://discord.gg/6kFBVDcRd5"),
    ]);

  if(msgID == undefined) {
    await channel.send({
      embeds: [embed]
    });
  } else {
    const message = await channel.messages.fetch(msgID);
    await message.edit(embed);
  }
  return {
    res: "list created"
  };
});
