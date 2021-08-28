import Command from "../../classes/Command";
import { getFromDB } from "../BotRuntime";
import CommandResponse from "../Utils/CommandResponse";

export default new Command("ez", ["*"], async () => {
  const msgs = await getFromDB("ezmsgs");
  let msg = msgs[Math.floor(Math.random() * msgs.length)];
  msg = msg.replace(/\\n/g, "\n");
  return new CommandResponse(msg);
});
