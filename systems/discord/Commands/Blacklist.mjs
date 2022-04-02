import { Database } from "@hyarcade/requests";
import Command from "@hyarcade/structures/Discord/Command.js";
import CommandResponse from "@hyarcade/structures/Discord/CommandResponse.js";
import { ERROR_ARGS_LENGTH } from "../Utils/Embeds/DynamicEmbeds.js";

export default new Command("blacklist", ["%trusted%"], async args => {
  let blacklist = await Database.readDB("blacklist");

  const operation = args[0] ?? "ls";

  if (operation == undefined) {
    return {
      res: "",
      embed: ERROR_ARGS_LENGTH(1),
    };
  }

  let res;
  let hasChange = false;

  switch (operation) {
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
      blacklist = blacklist.filter(h => h != args[1]);
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

  if (hasChange) {
    await Database.writeDB("blacklist", blacklist);
  }

  return res;
});
