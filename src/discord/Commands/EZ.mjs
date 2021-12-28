import Command from "../../classes/Command.js";
import BotRuntime from "../BotRuntime.js";
import CommandResponse from "../Utils/CommandResponse.js";

let msgs = undefined;

export default new Command("ez", ["*"], async () => {
  if(msgs == undefined) {
    msgs = await BotRuntime.getFromDB("ezmsgs");
  }

  let msg = msgs[Math.floor(Math.random() * msgs.length)];
  msg = msg.replace(/\\n/g, "\n");
  return new CommandResponse(msg);
});
