import Command from "@hyarcade/structures/Discord/Command.js";
import { client } from "../BotRuntime.js";
import roleHandler from "../Utils/MemberHandlers/roleHandler.js";

export default new Command("updroles", ["%trusted%"], async () => {
  await roleHandler(client);
  return {
    res: "Roles updated successfully",
  };
});
