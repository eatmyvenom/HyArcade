import Command from "../../classes/Command";
import { exit } from "process";
import { client } from "../BotRuntime";
import { logHook } from "../Utils/Webhooks";

export default new Command("KillBot", ["156952208045375488"], async () => {
  await logHook.send("**WARNING** Bot shutdown ordered!");
  await client.destroy();
  exit(0);
});
