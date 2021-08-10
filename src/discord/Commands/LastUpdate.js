const Command = require("../../classes/Command");
const fs = require("fs/promises");
const {
    MessageEmbed
} = require("discord.js");
const utils = require("../../utils");

module.exports = new Command("LastUpdate", ["*"], async () => {
    let time;
    if(utils.fileExists("timeupdate")) {
        time = await (await fs.readFile("timeupdate")).toString();
    } else {
        time = "Saving data!";
    }

    const embed = new MessageEmbed().setTitle("Update time")
        .setDescription(time)
        .setColor(0x00b37b);

    return {
        res: "",
        embed
    };
});
