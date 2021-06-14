const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const utils = require("../../utils");
const { client } = require("../BotUtils");
const helpText = require('../HelpText');
const BotUtils = require("../BotUtils");
const { logger } = require("../../utils");
const mojangRequest = require("../../mojangRequest");
const Account = require("../../account");

module.exports = class InteractionUtils {

    static async getStatsButtons(currentGame, uuid) {

        let leftTxt = "";
        let rightTxt = "";
        let leftID = "";
        let rightID = "";

        switch(currentGame) {
            case "arc" : {
                leftTxt = "Seasonal games";
                leftID = "sim";
                rightTxt = "Party games";
                rightID = "pg";
                break;
            }

            case "pg" : {
                leftTxt = "Arcade";
                leftID = "arc";
                rightTxt = "Farm hunt";
                rightID = "fh"
                break;
            }

            case "fh" : {
                leftTxt = "Party games";
                leftID = "pg";
                rightTxt = "Hole in the wall";
                rightID = "hitw"
                break;
            }

            case "hitw" : {
                leftTxt = "Farm hunt";
                leftID = "fh";
                rightTxt = "Hypixel Says";
                rightID = "hs"
                break;
            }

            case "hs" : {
                leftTxt = "Hole in the wall";
                leftID = "hitw";
                rightTxt = "Blocking dead";
                rightID = "bd"
                break;
            }

            case "bd" : {
                leftTxt = "Hypixel Says";
                leftID = "hs";
                rightTxt = "Mini walls";
                rightID = "mw"
                break;
            }

            case "mw" : {
                leftTxt = "Blocking dead";
                leftID = "bd";
                rightTxt = "Football";
                rightID = "fb"
                break;
            }

            case "fb" : {
                leftTxt = "Mini walls";
                leftID = "mw";
                rightTxt = "Ender spleef";
                rightID = "es";
                break;
            }

            case "es" : {
                leftTxt = "Football";
                leftID = "fb";
                rightTxt = "Throw out";
                rightID = "to";
                break;
            }

            case "to" : {
                leftTxt = "Ender spleef";
                leftID = "es";
                rightTxt = "Galaxy wars";
                rightID = "gw";
                break;
            }

            case "gw" : {
                leftTxt = "Throw out";
                leftID = "to";
                rightTxt = "Dragon wars";
                rightID = "dw";
                break;
            }

            case "dw" : {
                leftTxt = "Galaxy wars";
                leftID = "gw";
                rightTxt = "Bounty hunters";
                rightID = "bh";
                break;
            }

            case "bh" : {
                leftTxt = "Dragon wars";
                leftID = "dw";
                rightTxt = "Hide and seek";
                rightID = "hns";
                break;
            }

            case "hns" : {
                leftTxt = "Bounty hunters";
                leftID = "bh";
                rightTxt = "Zombies";
                rightID = "z";
                break;
            }

            case "z" : {
                leftTxt = "Hide and seek";
                leftID = "hns";
                rightTxt = "Pixel Painters";
                rightID = "pp";
                break;
            }

            case "pp" : {
                leftTxt = "Zombies";
                leftID = "z";
                rightTxt = "Capture the wool";
                rightID = "ctw"
                break;
            }

            case "ctw": {
                leftTxt = "Pixel Painters";
                leftID = "pp";
                rightTxt = "Seasonal games";
                rightID = "sim";
                break;
            }

            case "sim" : {
                leftTxt = "Capture the wool";
                leftID = "ctw";
                rightTxt = "Arcade";
                rightID = "arc";
                break;
            }
        }

        let row = new MessageActionRow();
        let left = new MessageButton()
                        .setCustomID(`s:${uuid}:${leftID}`)
                        .setLabel("<< " + leftTxt)
                        .setStyle('PRIMARY');

        let m = new MessageButton()
                        .setCustomID(`s:${uuid}:${currentGame}`)
                        .setLabel("↻ Refresh")
                        .setStyle('SECONDARY');

        let right = new MessageButton()
                        .setCustomID(`s:${uuid}:${rightID}`)
                        .setLabel(rightTxt + " >>")
                        .setStyle('PRIMARY');

        row.addComponents(left, m, right);
        return row;
    }

    static async accFromUUID(uuid) {
        let acclist = await BotUtils.fileCache.acclist;
        let acc = acclist.find((a) => a.uuid == uuid);

        if(acc == undefined) {
            acc = new Account("", 0, "" + uuid);
            await acc.updateData();
        }

        return acc;
    }

    static async resolveAccount(interaction, namearg = "player") {
        logger.out("Attempting to resolve account from " + JSON.stringify(interaction.options));
        let string = "undefinednullnonothingno";
        if(interaction.options.get(namearg) != undefined) {
            string = interaction.options.get(namearg).value;
        }
        let canbeSelf = string == "" || string == "undefinednullnonothingno";
        string = stringify(string).toLowerCase();
        let acclist = await BotUtils.fileCache.acclist;
        let acc;
        if (string.length == 18) {
            acc = acclist.find((a) => a.discord == string);
        }

        if (acc == undefined && string.length > 16) {
            acc = acclist.find((a) => a.uuid == string);
        } else if (acc == undefined && string.length <= 16) {
            acc = acclist.find((a) => a.name.toLowerCase() == string);
        }

        if (acc == undefined && string.length <= 16) {
            acc = acclist.find((a) => a.name.toLowerCase().startsWith(string));
        }

        if(acc == undefined && string.length == "22") {
            acc = acclist.find((a) => a.discord == string.slice(3,-1));
        }

        if(acc == undefined && string.length == "21") {
            acc = acclist.find((a) => a.discord == string.slice(2,-1));
        }

        if(acc == undefined) {
            acc = acclist.find((a) => {
                if(a.nameHist && a.nameHist.length > 0) {
                    for(let name of a.nameHist) {
                        if(name.toLowerCase().startsWith(string)) {
                            return true;
                        }
                    }
                }
                return false;
            });
        }

        if (acc == undefined && canbeSelf) {
            let discid = interaction.member.user.id;
            acc = acclist.find((a) => stringify(a.discord) == discid);
        }

        if(acc) {
            logger.out("resolved as " + acc.name);
        } else {
            interaction.defer();
            logger.out("Unable to resolve, getting by ign from hypixel.");
        
            let plr = string;
            let uuid;
            if (plr.length > 17) {
                uuid = plr;
            } else {
                uuid = await mojangRequest.getUUID(plr);
            }
        
            acc = new Account("", 0, "" + uuid);
            await acc.updateData();
        }

        return acc;
    }

    static helpEmbed() {
        return new MessageEmbed()
            .setTitle("Arcade bot help")
            .setColor(0x0066cc)
            .addField("/addaccount", "Add account(s) to the data base by current ign or by uuid")
            .addField("/getdataraw", "Get some raw data from a player")
            .addField("/info", "Get info about the bot")
            .addField("/leaderboard", "Get an arcade leaderboard")
            .addField("/namehistory", "Get the list of previous names from a player")
            .addField("/stats", "Get the stats of a specified player")
            .addField("/status", "Get the status of a player")
            .addField("/unlinkedstats", "Get the stats of a player not in the arcade bot database")
            .addField("/verify", "Verify yourself with the arcade bot")
            .addField("/whois", "Get the linked discord account of a player")
            .addField("/help", "Get a list of commands of help on a specific topic")
            .addField("Other help topics", "games - the names of all the available games for commands like /stats and /leaderboard\nsearching - an explanation on how the bot searches for an account when you give input\nrole handling - an explantion on how role handling happens within the bot")
    }

    static helpTopic(topicName) {
        let e = new MessageEmbed();
        let topic = topicName.slice(6)

        e.setTitle(topic);
        e.setColor(0x0066cc);

        e.setDescription(helpText[topic]);
        return e;
    }
};

function stringify(str) {
    return "" + str;
}

