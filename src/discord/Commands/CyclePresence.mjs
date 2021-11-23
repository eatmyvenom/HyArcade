import Command from "../../classes/Command.js";
import BotRuntime from "../BotRuntime.js";
import SetPresence from "../Utils/SetPresence.js";

export default new Command("cyclepresence", ["*"], async () => {
  await SetPresence(BotRuntime.client, BotRuntime.botMode);
  return {
    res: "Presence cycled"
  };
});
