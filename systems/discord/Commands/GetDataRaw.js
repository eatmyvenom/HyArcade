const { MessageEmbed } = require("discord.js");
const Logger = require("hyarcade-logger");
const Database = require("hyarcade-requests/Database");
const Command = require("hyarcade-structures/Discord/Command");
const Util = require("node:util");
const AccountComparitor = require("../Utils/AccountComparitor");

/**
 * @param {object} o
 * @param {string} s
 * @returns {*}
 */
function getProp(o, s) {
  let obj = o;
  let str = s;
  str = str.replace(/\[(\w+)]/g, ".$1"); // convert indexes to properties
  str = str.replace(/^\./, ""); // strip a leading dot
  const a = str.split(".");
  for (let i = 0, n = a.length; i < n; i += 1) {
    const k = a[i];
    if (k in obj) {
      obj = obj[k];
    } else {
      return;
    }
  }
  return obj;
}

module.exports = new Command(["get-data-raw", "getraw", "getdataraw", "raw", "rawdata"], ["*"], async (args, rawMsg, interaction) => {
  const plr = args[0];
  const time = args[2];
  let acc;
  if (interaction == undefined) {
    acc = await Database.account(plr, rawMsg.author.id);
  } else {
    await interaction.deferReply();
    acc = await Database.timedAccount(interaction.options.getString("player"), interaction.user.id, time);
  }

  if (acc.timed != undefined && acc.timed != {}) {
    Logger.info("Getting account diff");
    const tmpAcc = AccountComparitor(acc.acc, acc.timed);

    acc = tmpAcc;
  }

  const path = args[1];
  let val = getProp(acc, path);

  if (typeof val == "number" || typeof val == "boolean") {
    val = `${val}`;
  }

  if (typeof val != "string") {
    val = Util.inspect(val, true);
  }

  if (val == "") {
    val = "No response.";
  }

  const embed = new MessageEmbed().setTitle(`${acc.name}.${path}`).setDescription(`\`\`\`${val}\`\`\``).setColor(0x44a3e7);
  return {
    res: "",
    embed,
  };
});
