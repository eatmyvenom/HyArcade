import Command from "../../classes/Command";
import BotRuntime, { client, getFromDB } from "../BotRuntime";
import CommandResponse from "../Utils/CommandResponse";
import { inspect } from "util";

/**
 * @param {string} str
 * @returns {string}
 */
function safeEval (str) {
  return Function("c", "r", "bu", "accs", "m", `"use strict";return (${str})`);
}

export default new Command("eval", ["156952208045375488"], async (args, rawMsg) => {
  const c = client;
  const f = safeEval(args.join(" "));
  let evaled = f(c, require, BotRuntime, await getFromDB("accounts"), rawMsg);
  if(typeof evaled != "string") {
    evaled = inspect(evaled, true);
  }
  const res = `\`\`\`\nResponse:\n${evaled}\n\`\`\``;
  return new CommandResponse(res);
});
