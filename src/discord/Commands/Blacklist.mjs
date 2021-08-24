import Command from "../../classes/Command";
import { getFromDB, writeToDB } from "../BotUtils";
import CommandResponse from "../Utils/CommandResponse";
import { ERROR_ARGS_LENGTH } from "../Utils/Embeds/DynamicEmbeds";

export default new Command("blacklist", ["%trusted%"], async (args) => {
  /**
   * @type {string[]}
   */
  let blacklist = await getFromDB("blacklist");

  const operation = args[0];

  if(operation == undefined) {
    return {
      res: "",
      embed: ERROR_ARGS_LENGTH(1)
    };
  }

  let res;
  let hasChange = false;

  switch(operation) {
  case "+":
  case "add":
  case "plus": {
    blacklist.push(args[1]);
    res = new CommandResponse("Discord ID added!");
    hasChange = true;
    break;
  }

  case "-":
  case "rm":
  case "remove": {
    blacklist = blacklist.filter((h) => h != args[1]);
    res = new CommandResponse("Discord ID removed!");
    hasChange = true;
    break;
  }

  case "-l":
  case "ls":
  case "list":
  case "show": {
    res = new CommandResponse(`\`\`\`\n${blacklist.join("\n")}\`\`\``);
    break;
  }
  }

  if(hasChange) {
    await writeToDB("blacklist", blacklist);
  }

  return res;
});
