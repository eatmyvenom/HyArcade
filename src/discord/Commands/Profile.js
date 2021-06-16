const Command = require("../../classes/Command");
const { logger } = require("../../utils");
const BotUtils = require("../BotUtils");
const ImageGenerator = require("../images/ImageGenerator");

module.exports = new Command("profile", ["*"], async (args, rawMsg) => {
    let player = args[0];
    let acc = await BotUtils.resolveAccount(player, rawMsg, args.length != 1);
    let lvl = Math.round(acc.level * 100) / 100;
    let img = new ImageGenerator(640, 400);
    await img.addBackground("resources/drops.jpg");

    img.writeTitle(acc.name);
    let txt = `Level - ${lvl}\nArcade wins - ${acc.arcadeWins}\nCoins - ${acc.arcadeCoins}\nAP - ${acc.achievementPoints}\nKarma - ${acc.karma}`
    img.writeTextCenter(txt);
    let attachment = img.toDiscord();

    return { res : "", img : attachment };
});
