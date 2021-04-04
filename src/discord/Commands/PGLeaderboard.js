const Command = require("../../classes/Command");
const listUtils = require("../../listUtils");

module.exports = new Command("pgleaderboard", ["*"], async (args) => {
    if (args.length < 2) {
        return {
            res:
                "Use the command but correctly :slight_smile:\nUse the help command if you are unsure of how to brain!",
        };
    }

    let type = args[0];
    let limit = args[1];

    switch (type) {
        case "d":
        case "day":
        case "daily": {
            return {
                res:
                    "**Daily leaderboard**\n```" +
                    (await listUtils.stringDaily("accounts", limit)) +
                    "```",
            };
            break;
        }

        case "a":
        case "o":
        case "acc":
        case "all":
        case "normal": {
            return {
                res:
                    "**Overall leaderboard**\n```" +
                    (await listUtils.stringNormal("accounts", limit)) +
                    "```",
            };
            break;
        }
    }

    return {
        res:
            "Use the command but correctly :slight_smile:\nUse the help command if you are unsure of how to brain!",
    };
});
