import { Database } from "hyarcade-requests";
import Command from "hyarcade-structures/Discord/Command.js";
import CommandResponse from "hyarcade-structures/Discord/CommandResponse.js";

let msgs;

export default new Command("ez", ["*"], async () => {
  if (msgs == undefined) {
    msgs = await Database.readDB("ezMsgs");
    msgs = msgs.map(m => m.str);
  }

  let msg = msgs[Math.floor(Math.random() * msgs.length)];
  msg = msg.replace(/\\n/g, "\n");
  return new CommandResponse(msg);
});
