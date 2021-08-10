const {
    MessageEmbed
} = require("discord.js");
const Command = require("../../classes/Command");
const utils = require("../../utils");

/**
 * @param {string} game
 * @returns {object}
 */
async function getFields (game) {
    const counts = await utils.readJSON("./gameCounts.json");
    const fields = [];
    switch((`${game}`).toLowerCase()) {
    case "party":
    case "partygames":
    case "pg": {
        fields.push({
            name: "Party games players",
            value: `${counts.modes.PARTY}`,
            inline: true,
        });
        break;
    }

    case "fh":
    case "farm":
    case "fmhnt":
    case "farmhunt":
    case "frmhnt": {
        fields.push({
            name: "Farm hunt players",
            value: `${counts.modes.FARM_HUNT}`,
            inline: true,
        });
        break;
    }

    case "hs":
    case "hys":
    case "hypixel":
    case "says":
    case "hysays": {
        fields.push({
            name: "Hypixel says players",
            value: `${counts.modes.SIMON_SAYS}`,
            inline: true,
        });
        break;
    }

    case "hitw":
    case "hit":
    case "hole":
    case "pain": {
        fields.push({
            name: "Hole in the wall players",
            value: `${counts.modes.HOLE_IN_THE_WALL}`,
            inline: true,
        });
        break;
    }

    case "mw":
    case "miw":
    case "mini":
    case "mwall":
    case "wall":
    case "pvp":
    case "miniwalls": {
        fields.push({
            name: "Mini walls players",
            value: `${counts.modes.MINI_WALLS}`,
            inline: true,
        });
        break;
    }

    case "sc":
    case "fb":
    case "foot":
    case "ballin":
    case "fuck":
    case "shit":
    case "football": {
        fields.push({
            name: "Football players",
            value: `${counts.modes.SOCCER}`,
            inline: true,
        });
        break;
    }

    case "es":
    case "spleeg":
    case "ender":
    case "enderman":
    case "trash":
    case "enderspleef": {
        fields.push({
            name: "Ender spleef players",
            value: `${counts.modes.ENDER}`,
            inline: true,
        });
        break;
    }

    case "to":
    case "throw":
    case "toss":
    case "sumo2":
    case "throwout": {
        fields.push({
            name: "Throw out players",
            value: `${counts.modes.THROW_OUT}`,
            inline: true,
        });
        break;
    }

    case "gw":
    case "sw":
    case "galaxy":
    case "galaxywars": {
        fields.push({
            name: "Galaxy wars players",
            value: `${counts.modes.STARWARS}`,
            inline: true,
        });
        break;
    }

    case "dw":
    case "dragon":
    case "dragonwars": {
        fields.push({
            name: "Dragon wars players",
            value: `${counts.modes.DRAGONWARS2}`,
            inline: true,
        });
        break;
    }

    case "bh":
    case "bnt":
    case "one":
    case "bounty":
    case "oneinthequiver":
    case "bountyhunters": {
        fields.push({
            name: "Bounty hunters players",
            value: `${counts.modes.ONEINTHEQUIVER}`,
            inline: true,
        });
        break;
    }

    case "bd":
    case "do":
    case "dayone":
    case "blocking":
    case "blockingdead": {
        fields.push({
            name: "Blocking dead players",
            value: `${counts.modes.DAYONE}`,
            inline: true,
        });
        break;
    }

    case "has":
    case "hide":
    case "h&s":
    case "hns":
    case "probotkeptspammingthisshit":
    case "hideandseek":
    case "hidenseek":
    case "hideseek": {
        fields.push({
            name: "Party pooper players",
            value: `${counts.modes.HIDE_AND_SEEK_PARTY_POOPER}`,
            inline: true,
        });
        fields.push({
            name: "Prop hunt players",
            value: `${counts.modes.HIDE_AND_SEEK_PROP_HUNT}`,
            inline: true,
        });
        break;
    }

    case "z":
    case "zs":
    case "zbs":
    case "zomb":
    case "zbies":
    case "zombies": {
        fields.push({
            name: "Zombies bad blood players",
            value: `${counts.modes.ZOMBIES_BAD_BLOOD}`,
            inline: true,
        });
        fields.push({
            name: "Zombies alien arcadium players",
            value: `${counts.modes.ZOMBIES_ALIEN_ARCADIUM}`,
            inline: true,
        });
        fields.push({
            name: "Zombies dead end players",
            value: `${counts.modes.ZOMBIES_DEAD_END}`,
            inline: true,
        });
        break;
    }

    case "ctw":
    case "ctwool":
    case "capkills":
    case "capture":
    case "capwool":
    case "ctwwool":
    case "ctwwoolcaptured":
    case "ctwkills": {
        fields.push({
            name: "Capture the wool players",
            value: `${counts.modes.PVP_CTW}`,
            inline: true,
        });
        break;
    }

    case "pp":
    case "draw":
    case "pixpaint":
    case "pixelpaint":
    case "pixelpainters":
    case "drawmything":
    case "drawtheirthing":
    case "drawing": {
        fields.push({
            name: "Farm hunt players",
            value: `${counts.modes.DRAW_THEIR_THING}`,
            inline: true,
        });
        break;
    }

    case "creep":
    case "crep":
    case "ca":
    case "defender":
    case "creeper":
    case "creeperattack": {
        fields.push({
            name: "Creeper attack players",
            value: counts.modes.DEFENDER,
            inline: true,
        });
        break;
    }

    default: {
        fields.push({
            name: "Party games players",
            value: `${counts.modes.PARTY}`,
            inline: true,
        });
        fields.push({
            name: "Farm hunt players",
            value: `${counts.modes.FARM_HUNT}`,
            inline: true,
        });
        fields.push({
            name: "Hypixel says players",
            value: `${counts.modes.SIMON_SAYS}`,
            inline: true,
        });
        fields.push({
            name: "Hole in the wall players",
            value: `${counts.modes.HOLE_IN_THE_WALL}`,
            inline: true,
        });
        fields.push({
            name: "Mini walls players",
            value: `${counts.modes.MINI_WALLS}`,
            inline: true,
        });
        fields.push({
            name: "Football players",
            value: `${counts.modes.SOCCER}`,
            inline: true,
        });
        fields.push({
            name: "Ender spleef players",
            value: `${counts.modes.ENDER}`,
            inline: true,
        });
        fields.push({
            name: "Throw out players",
            value: `${counts.modes.THROW_OUT}`,
            inline: true,
        });
        fields.push({
            name: "Galaxy wars players",
            value: `${counts.modes.STARWARS}`,
            inline: true,
        });
        fields.push({
            name: "Dragon wars players",
            value: `${counts.modes.DRAGONWARS2}`,
            inline: true,
        });
        fields.push({
            name: "Bounty hunters players",
            value: `${counts.modes.ONEINTHEQUIVER}`,
            inline: true,
        });
        fields.push({
            name: "Blocking dead players",
            value: `${counts.modes.DAYONE}`,
            inline: true,
        });
        fields.push({
            name: "Party pooper players",
            value: `${counts.modes.HIDE_AND_SEEK_PARTY_POOPER}`,
            inline: true,
        });
        fields.push({
            name: "Prop hunt players",
            value: `${counts.modes.HIDE_AND_SEEK_PROP_HUNT}`,
            inline: true,
        });
        fields.push({
            name: "Bad blood players",
            value: `${counts.modes.ZOMBIES_BAD_BLOOD}`,
            inline: true,
        });
        fields.push({
            name: "Alien arcadium players",
            value: `${counts.modes.ZOMBIES_ALIEN_ARCADIUM}`,
            inline: true,
        });
        fields.push({
            name: "Dead end players",
            value: `${counts.modes.ZOMBIES_DEAD_END}`,
            inline: true,
        });
        fields.push({
            name: "Capture the wool players",
            value: `${counts.modes.PVP_CTW}`,
            inline: true,
        });
        fields.push({
            name: "Farm hunt players",
            value: `${counts.modes.DRAW_THEIR_THING}`,
            inline: true,
        });
        fields.push({
            name: "Creeper attack players",
            value: `${counts.modes.DEFENDER}`,
            inline: true,
        });
        fields.push({
            name: "Arcade players",
            value: `${counts.players}`,
            inline: true,
        });
    }
    }
    return fields;
}

module.exports = new Command("Game counts", ["*"], async (args) => {
    const game = args[0];
    const embed = new MessageEmbed()
        .setTitle("Arcade game counts")
        .setColor(0x44a3e7)
        .addFields(await getFields(game))
        .setTimestamp(Date.now());
    return {
        res: "",
        embed
    };
});
