import fs from "fs-extra";
import Command from "hyarcade-structures/Discord/Command.js";
import CommandResponse from "hyarcade-structures/Discord/CommandResponse.js";

let msgs;

export default new Command("ez", ["*"], async () => {
  if (msgs == undefined) {
    const file = await fs.readFile("data/ez");
    msgs = file.toString().split("\n");
  }

  let msg = msgs[Math.floor(Math.random() * msgs.length)];
  msg = msg.replace(/\\n/g, "\n");
  return new CommandResponse(msg);
});
