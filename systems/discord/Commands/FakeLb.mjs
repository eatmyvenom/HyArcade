import Command from "hyarcade-structures/Discord/Command.js";
import CommandResponse from "hyarcade-structures/Discord/CommandResponse.js";
import FakeLB from "../images/FakeLB.js";
import ImageGenerator from "../images/ImageGenerator.js";

export default new Command("fakelb", ["%trusted%", "303732854787932160"], async args => {
  const img = new ImageGenerator(1900, 1035, "'myFont'", false);
  await img.addBackground("assets/lb3.png", 0, 0, 1900, 1035, "#00000000");

  const path = args[0];
  const category = args[1];
  const time = args[2];

  const attachment = await FakeLB(path, category, time);
  return new CommandResponse("", undefined, attachment);
});
