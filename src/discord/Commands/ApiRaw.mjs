import { createRequire } from "module";
const require = createRequire(import.meta.url);

import Command from "../../classes/Command.js";
import CommandResponse from "../Utils/CommandResponse.js";
import { ERROR_IGN_UNDEFINED } from "../Utils/Embeds/StaticEmbeds.js";

const { HypixelApi, mojangRequest } = require("hyarcade-requests");
const { MessageEmbed } = require("discord.js");
const Util = require("util");

/**
 * @param {object} o
 * @param {string} s
 * @returns {*}
 */
function getProp (o, s) {
  let obj = o;
  let str = s;
  str = str.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
  str = str.replace(/^\./, ""); // strip a leading dot
  const a = str.split(".");
  for(let i = 0, n = a.length; i < n; i += 1) {
    const k = a[i];
    if(k in obj) {
      obj = obj[k];
    } else {
      return;
    }
  }
  return obj;
}

export default new Command("apiraw", ["*"], async (args, rawMsg, interaction) => {
  const plr = args[0];
  const uuid = plr.length > 31 ? plr : await mojangRequest.getUUID(plr);
  if(uuid == undefined) {
    return new CommandResponse("", ERROR_IGN_UNDEFINED);
  }

  if(interaction) {
    await interaction.defer();
  }

  const path = args[1];
  let val;
  let data;
  let acc;
  try {
    acc = await HypixelApi.player(uuid);
    data = acc.player;
    val = getProp(data, path);
  } catch (e) {
    val = acc;
  }

  if(typeof val == "number" || typeof val == "boolean") {
    val = `${val}`;
  }

  if(typeof val != "string") {
    val = Util.inspect(val, true);
  }

  if(val == "") {
    val = "No response!";
  }

  const embed = new MessageEmbed()
    .setTitle(`${data.displayname}.${path}`)
    .setDescription(`\`\`\`${val}\`\`\``)
    .setColor(0xc60532);
  return new CommandResponse("", embed);
});
