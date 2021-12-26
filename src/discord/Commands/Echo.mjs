import Command from "../../classes/Command.js";
import BotRuntime from "../BotRuntime.js";
import CommandResponse from "../Utils/CommandResponse.js";

export default new Command("echo", ["%trusted%"], async (args, rawMsg) => {
  const channel = args[0];
  let text;
  let discChannel;
  if(channel.length == 18 && channel.toLowerCase() == channel.toUpperCase()) {
    discChannel = await BotRuntime.client.channels.fetch(args[0]);
    text = args.slice(1).join(" ");
  } else {
    discChannel = rawMsg.channel;
    text = args.join(" ");
  }

  await discChannel.send(text);
  return new CommandResponse("Message sent!", undefined, undefined, undefined, false, true);
});
