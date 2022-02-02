import Command from "hyarcade-structures/Discord/Command.js";
import CommandResponse from "hyarcade-structures/Discord/CommandResponse.js";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

import { inspect } from "node:util";
import BotRuntime from "../BotRuntime.js";

/**
 * @param {string} str
 * @returns {string}
 */
function safeEval(str) {
  return new Function("c", "r", "br", "m", `"use strict";return (${str})`);
}

export default new Command("eval", ["156952208045375488"], async (args, rawMsg) => {
  const c = BotRuntime.client;
  const f = safeEval(args.join(" "));

  let evaled = f(c, require, BotRuntime, rawMsg);

  if (typeof evaled != "string") {
    evaled = inspect(evaled, true);
  }

  const res = `\`\`\`\nResponse:\n${evaled}\n\`\`\``;
  return new CommandResponse(res);
});
