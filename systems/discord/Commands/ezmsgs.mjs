import Command from "hyarcade-structures/Discord/Command.js";
import CommandResponse from "hyarcade-structures/Discord/CommandResponse.js";
import BotRuntime from "../BotRuntime.js";
import { ERROR_ARGS_LENGTH } from "../Utils/Embeds/DynamicEmbeds.js";

export default new Command("ezmsgs", ["%trusted%"], async args => {
  /**
   * @type {string[]}
   */
  let msgs = await BotRuntime.getFromDB("ezmsgs");

  const operation = args[0];
  const arg = args.slice(1).join(" ");

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
      msgs.push(arg);
      res = new CommandResponse("Message added!");
      hasChange = true;
      break;
    }

    case "-":
    case "rm":
    case "remove": {
      msgs = msgs.filter(h => h != arg);
      res = new CommandResponse("Message removed!");
      hasChange = true;
      break;
    }

    case "-l":
    case "ls":
    case "list":
    case "show": {
      res = new CommandResponse(`\`\`\`\n${msgs.join("\n")}\`\`\``);
      break;
    }
  }

  if (hasChange) {
    await BotRuntime.writeToDB("ezmsgs", msgs);
  }

  return res;
});
