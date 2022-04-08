import Database from "@hyarcade/database";
import Command from "@hyarcade/structures/Discord/Command.js";
import CommandResponse from "@hyarcade/structures/Discord/CommandResponse.js";
import { ERROR_ARGS_LENGTH } from "../Utils/Embeds/DynamicEmbeds.js";

export default new Command("ezmsgs", ["%trusted%"], async args => {
  /**
   * @type {string[]}
   */
  let msgs = await Database.readDB("ezMsgs");
  msgs = msgs.map(m => m.str);

  const operation = args[0];
  const arg = args.slice(1).join(" ");

  if (operation == undefined) {
    return {
      res: "",
      embed: ERROR_ARGS_LENGTH(1),
    };
  }

  let res;

  switch (operation) {
    case "+":
    case "add":
    case "plus": {
      await Database.internal({ ezmsgs: { add: arg } });
      res = new CommandResponse("Message added!");
      break;
    }

    case "-l":
    case "ls":
    case "list":
    case "show": {
      res = new CommandResponse(`\`\`\`\n${msgs.join("\n")}\`\`\``);
      break;
    }

    default: {
      res = new CommandResponse("Not a valid action!");
    }
  }

  return res;
});
