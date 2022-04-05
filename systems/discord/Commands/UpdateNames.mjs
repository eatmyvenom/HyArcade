import Command from "@hyarcade/structures/Discord/Command.js";
import { client } from "../BotRuntime.js";

export default new Command("updatenames", ["%trusted%"], async () => {
  const NameUpdater = await import("../Utils/MemberHandlers/NameUpdater.mjs");
  await NameUpdater.default(client);
  return {
    res: "Names updated successfully",
  };
});
