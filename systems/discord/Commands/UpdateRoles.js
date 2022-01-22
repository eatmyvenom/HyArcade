const Command = require("hyarcade-structures/Discord/Command");
const BotRuntime = require("../BotRuntime");
const roleHandler = require("../roleHandler");

module.exports = new Command("updroles", ["%trusted%"], async () => {
  await roleHandler(BotRuntime.client);
  return {
    res: "Roles updated successfully"
  };
});
