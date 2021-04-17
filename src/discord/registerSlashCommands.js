const { WebhookClient } = require("discord.js");
const utils = require("../utils");
const BotUtils = require("./BotUtils");
const Leaderboard = require("./Commands/Leaderboard");



module.exports = async (client) => {
    client.ws.on('INTERACTION_CREATE', async interaction => {
        let opts = [].concat(interaction.data.options);
        let args = [];
        for (let i = 0; i< opts.length; i++) {
            args[i] = opts[i].value
        }
        if(interaction.data.name == 'stats') {
            let game = "";
            if(interaction.data.options != undefined) {
                game = interaction.data.options[interaction.data.options.length - 1].value;
            }
            let acc = await resolveAccount(interaction);
            let stats = await BotUtils.getStats(acc, ""+game);
            client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                  content: '',
                  embeds: [ stats.embed ]
                }
            }});
        } else if(interaction.data.name == 'leaderboard') {

            let res = await Leaderboard.execute(args, interaction.member.user.id);
            client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                  content: '',
                  embeds: [ res.embed ]
                }
            }});
        }
        await BotUtils.logHook.send(`${interaction.member.user.username}#${interaction.member.user.discriminator} invoked interaction \`${interaction.data.name}\` with options \`${JSON.stringify(interaction.data.options)}\``)
    })
}

async function resolveAccount(interaction) {
    let string = "undefinednullnonothingno"
    if(interaction.data.options != undefined) {
        string = interaction.data.options[0].value;
    }
    string = stringify(string);
    let acclist = await utils.readJSON("./accounts.json");
    let acc;
    if (string.length == 18) {
        acc = acclist.find((a) => a.discord == string);
    }

    if (acc == undefined && string.length > 16) {
        acc = acclist.find(
            (a) => a.uuid.toLowerCase() == string.toLowerCase()
        );
    } else if (acc == undefined && string.length <= 16) {
        acc = acclist.find(
            (a) => a.name.toLowerCase() == string.toLowerCase()
        );
    }

    if (acc == undefined) {
        let discid = interaction.member.user.id;
        acc = acclist.find(
            (a) =>
                stringify(a.discord).toLowerCase() == discid.toLowerCase()
        );
    }

    return acc;
}

function stringify(str) {
    return "" + str;
}