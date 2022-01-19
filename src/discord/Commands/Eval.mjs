import { createRequire } from "module";
const require = createRequire(import.meta.url);

import Command from "hyarcade-structures/Discord/Command.js";
import BotRuntime from "../BotRuntime.js";
import CommandResponse from "hyarcade-structures/Discord/CommandResponse.js";
import { inspect } from "util";

/**
 * @param {string} str
 * @returns {string}
 */
function safeEval (str) {
  return Function("c", "r", "br", "m", `"use strict";return (${str})`);
}

export default new Command("eval", ["156952208045375488"], async (args, rawMsg) => {
  const c = BotRuntime.client;
  const f = safeEval(args.join(" "));

  let evaled = f(c, require, BotRuntime, rawMsg);

  if(typeof evaled != "string") {
    evaled = inspect(evaled, true);
  }

  const res = `\`\`\`\nResponse:\n${evaled}\n\`\`\``;
  return new CommandResponse(res);
});
