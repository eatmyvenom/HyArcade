import Command from "../../classes/Command.js";
import { exit } from "process";
import BotRuntime from "../BotRuntime.js";
import Webhooks from "../Utils/Webhooks.js";

export default new Command("KillBot", ["156952208045375488"], async () => {
  await Webhooks.logHook.send("**WARNING** Bot shutdown ordered!");
  await BotRuntime.client.destroy();
  exit(0);
});
