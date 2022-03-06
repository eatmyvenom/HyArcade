import Database from "hyarcade-requests/Database.js";
import Command from "hyarcade-structures/Discord/Command.js";
import CommandResponse from "hyarcade-structures/Discord/CommandResponse.js";
import { createRequire } from "node:module";
import { inspect } from "node:util";
import BotRuntime from "../BotRuntime.js";

const require = createRequire(import.meta.url);

// eslint-disable-next-line prefer-arrow-callback
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

/**
 * @param {string} str
 * @returns {string}
 */
function safeEval(str) {
  return new AsyncFunction("c", "r", "br", "m", "db", `"use strict";return (${str})`);
}

export default new Command("eval", ["156952208045375488"], async (args, rawMsg) => {
  const c = BotRuntime.client;
  const f = safeEval(args.join(" "));

  let evaled;
  try {
    evaled = await f(c, require, BotRuntime, rawMsg, Database);
  } catch (error) {
    evaled = error;
  }

  if (typeof evaled != "string") {
    evaled = inspect(evaled, true);
  }

  const res = `\`\`\`\nResponse:\n${evaled}\n\`\`\``;
  return new CommandResponse(res);
});
