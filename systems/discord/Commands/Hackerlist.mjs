import Command from "hyarcade-structures/Discord/Command.js";
import BotRuntime from "../BotRuntime.js";
import { ERROR_ARGS_LENGTH } from "../Utils/Embeds/DynamicEmbeds.js";

export default new Command("hackerlist", ["%trusted%"], async (args) => {

  
  const operation = args[0] ?? "ls";
  
  if(operation == undefined) {
    return {
      res: "",
      embed: ERROR_ARGS_LENGTH(1)
    };
  }

  /** @type {string[]} */
  let hackers = await BotRuntime.getFromDB("hackerlist");

  let res;
  let hasChange = false;

  switch(operation) {
  case "+":
  case "add":
  case "plus": {
    hackers.push(args[1]);
    res = {
      res: "UUID added!"
    };
    hasChange = true;
    break;
  }

  case "-":
  case "rm":
  case "remove": {
    hackers = hackers.filter((h) => h != args[1]);
    res = {
      res: "UUID removed!"
    };
    hasChange = true;
    break;
  }

  case "-l":
  case "ls":
  case "list":
  case "show": {
    res = {
      res: `\`\`\`\n${hackers.join("\n")}\`\`\``
    };
    break;
  }
  }

  if(hasChange) {
    await BotRuntime.writeToDB("hackerlist", hackers);
  }

  return res;
});
