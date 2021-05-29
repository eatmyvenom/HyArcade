const { MessageEmbed, Message } = require("discord.js");
const utils = require("../../utils");
const { client } = require("../BotUtils");
const helpText = require('../HelpText');
const BotUtils = require("../BotUtils");

module.exports = class InteractionUtils {
    static async resolveAccount(interaction, namearg = 0) {
        let string = "undefinednullnonothingno";
        if (interaction.options != undefined && interaction.options[namearg] != undefined) {
            string = interaction.options[namearg].value;
        }
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

        if (acc == undefined) {
            let discid = interaction.member.user.id;
            acc = acclist.find((a) => stringify(a.discord) == discid);
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
        e.setTitle(topicName);
        e.setColor(0x0066cc);

        switch(topicName) {
            case "Help" : {
                e.setDescription(helpText.help);
                break;
            }

            case "Verify" : {
                e.setDescription(helpText.verify);
                break;
            }

            case "AddAccount" : {
                e.setDescription(helpText.newacc);
                break;
            }

            case "Stats" : {
                e.setDescription(helpText.stats);
                break;
            }

            case "Unlinked Stats" : {
                e.setDescription(helpText.unlinkedstats);
                break;
            }

            case "Leaderboard" : {
                e.setDescription(helpText.lb);
                break;
            }

            case "Games" : {
                e.setDescription(helpText.games);
                break;
            }

            case "GetDataRaw" : {
                e.setDescription(helpText.getraw);
                break;
            }

            case "Name History" : {
                e.setDescription(helpText.names);
                break;
            }

            case "Who is" : {
                e.setDescription(helpText.whois);
                break;
            }

            default : {
                e.setDescription("This is an unknown help topic");
                break;
            }
        }
        return e;
    }
};

function stringify(str) {
    return "" + str;
}

