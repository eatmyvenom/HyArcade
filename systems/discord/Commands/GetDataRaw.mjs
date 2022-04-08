import { info } from "@hyarcade/logger";
import { account, timedAccount } from "@hyarcade/database";
import Command from "@hyarcade/structures/Discord/Command.js";
import CommandResponse from "@hyarcade/structures/Discord/CommandResponse.js";
import { inspect } from "node:util";
import AccountComparitor from "../Utils/AccountComparitor.js";

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

export default new Command(["get-data-raw", "getraw", "getdataraw", "raw", "rawdata"], ["*"], async (args, rawMsg, interaction) => {
  const plr = args[0];
  const time = args[2];
  let acc;
  if (interaction == undefined) {
    acc = await account(plr, rawMsg.author.id);
  } else {
    await interaction.deferReply();
    acc = await timedAccount(interaction.options.getString("player"), interaction.user.id, time);
  }

  if (acc.timed != undefined && acc.timed != {}) {
    info("Getting account diff");
    const tmpAcc = AccountComparitor(acc.acc, acc.timed);

    acc = tmpAcc;
  }

  const path = args[1];
  let val = getProp(acc, path);

  if (typeof val === "number" || typeof val === "boolean") {
    val = `${val}`;
  }

  if (typeof val !== "string") {
    val = inspect(val, true);
  }

  if (val == "") {
    val = "No response.";
  }

  if (val == "") {
    val = '{ data: "No response!" }';
  }

  const txt = `\`\`\`hyarcade.${acc.name}.${path}:\n${val}\`\`\``;
  return new CommandResponse(txt);
});
