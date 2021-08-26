import Command from "../../classes/Command";
import { client, botMode } from "../BotRuntime";
import SetPresence from "../Utils/SetPresence";

export default new Command("CyclePresence", ["*"], async () => {
  await SetPresence(client, botMode);
  return {
    res: "Presence cycled"
  };
});
