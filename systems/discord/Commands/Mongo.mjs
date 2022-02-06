import MongoConnector from "hyarcade-requests/MongoConnector.js";
import Command from "hyarcade-structures/Discord/Command.js";
import CommandResponse from "hyarcade-structures/Discord/CommandResponse.js";
import { inspect } from "node:util";

// eslint-disable-next-line prefer-arrow-callback
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

/**
 * @param {string} str
 * @returns {string}
 */
function safeEval(str) {
  return new AsyncFunction("c", `"use strict";return (${str})`);
}

export default new Command("mongoeval", ["156952208045375488"], async args => {
  const f = safeEval(args.join(" "));

  const connector = new MongoConnector("mongodb://127.0.0.1:27017");
  await connector.connect(false);

  let evaled = await f(connector);

  if (typeof evaled != "string") {
    evaled = inspect(evaled, true);
  }

  const res = `\`\`\`\nResponse:\n${evaled}\n\`\`\``;
  return new CommandResponse(res);
});
